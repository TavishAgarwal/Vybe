# VYBE APP — DEBUG REPORT

## Bug Details

──────────────────────────────────────────────────────────────
BUG #1
──────────────────────────────────────────────────────────────
File:        src/screens/feed/HomeScreen.tsx
Line(s):     60-74, 124-164
Type:        WARNING | PERFORMANCE | FLOW
Severity:    HIGH
Symptom:     Feed viewability could become unstable and videos could fail to pause/play correctly while scrolling.
Root Cause:  Stable FlatList callbacks/config were stored via ref `.current` during render, which React 19 lint flags and can produce stale behavior.

BUGGY CODE:
```tsx
const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;
const onViewableItemsChanged = useRef(({ viewableItems }) => {
  setCurrentIndex(viewableItems[0].index);
}).current;
```

FIXED CODE:
```tsx
const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 70 }), []);
const onViewableItemsChanged = useCallback(({ viewableItems }) => {
  if (viewableItems.length > 0 && viewableItems[0].index !== null) {
    setCurrentIndex(viewableItems[0].index);
  }
}, [setCurrentIndex]);
```

VERIFICATION:
`npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #2
──────────────────────────────────────────────────────────────
File:        src/screens/feed/HomeScreen.tsx
Line(s):     88-97, 151-164
Type:        FLOW | PERFORMANCE
Severity:    MEDIUM
Symptom:     Pull-to-refresh and infinite loading could use stale cursor state or over-render video feed items.
Root Cause:  Refresh did not reset feed cursor/current index; FlatList video performance props were missing.

BUGGY CODE:
```tsx
onRefresh={refetch}
onEndReached={() => {
  if (hasNextPage && !isFetchingNextPage) fetchNextPage();
}}
```

FIXED CODE:
```tsx
useFeedStore.setState({ nextCursor: undefined, currentIndex: 0 });
refetch().catch(() => undefined);
initialNumToRender={1}
maxToRenderPerBatch={2}
windowSize={3}
removeClippedSubviews={Platform.OS === 'android'}
```

VERIFICATION:
`npx tsc --noEmit`; `npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #3
──────────────────────────────────────────────────────────────
File:        src/stores/feedStore.ts
Line(s):     33-51, 73-87
Type:        STATE | LOGIC
Severity:    HIGH
Symptom:     Duplicate feed entries could appear after pagination; failed vote rollback could show negative counts.
Root Cause:  Pages were appended without deduplication and rollback decremented without a floor.

BUGGY CODE:
```ts
entries: refresh ? response.data || [] : [...entries, ...(response.data || [])]
e.id === entryId ? { ...e, voteCount: e.voteCount - 1 } : e
```

FIXED CODE:
```ts
const dedupedEntries = Array.from(
  new Map(nextEntries.map(entry => [entry.id, entry])).values(),
);
e.id === entryId ? { ...e, voteCount: Math.max(0, e.voteCount - 1) } : e
```

VERIFICATION:
`npx tsc --noEmit`; `npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #4
──────────────────────────────────────────────────────────────
File:        src/hooks/useFeed.ts
Line(s):     49-68
Type:        STATE | LOGIC
Severity:    HIGH
Symptom:     A successful local vote could jump by two when realtime echoed the same vote insert.
Root Cause:  Realtime INSERT blindly incremented entries already optimistically voted by the current client.

BUGGY CODE:
```ts
const entryId = payload.new?.entry_id;
entries.map(e => e.id === entryId ? { ...e, voteCount: e.voteCount + 1 } : e)
```

FIXED CODE:
```ts
const nextVote = payload.new as Partial<DbVote> | null;
const { entries, votedEntryIds } = useFeedStore.getState();
if (votedEntryIds.has(entryId)) return;
```

VERIFICATION:
`npx tsc --noEmit`; `npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #5
──────────────────────────────────────────────────────────────
File:        src/components/InteractionBar.tsx
Line(s):     36-59
Type:        STATE | LOGIC
Severity:    MEDIUM
Symptom:     Vote UI could become stale or allow local unlike behavior that was not backed by the store/API.
Root Cause:  Local state mirrored props and toggled independently from the feed store.

BUGGY CODE:
```tsx
const [isLiked, setIsLiked] = useState(hasLiked);
const [likeCount, setLikeCount] = useState(entry.voteCount);
```

FIXED CODE:
```tsx
const hasLocalLike = locallyLikedEntryId === entry.id;
const isLiked = hasLiked || hasLocalLike;
const likeCount = entry.voteCount + (!hasLiked && hasLocalLike ? 1 : 0);
```

VERIFICATION:
`npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #6
──────────────────────────────────────────────────────────────
File:        src/screens/create/ProcessingScreen.tsx
Line(s):     17-57
Type:        FLOW | NAVIGATION
Severity:    HIGH
Symptom:     Create flow could get stuck/re-enter Caption, show a progress bar that never moved, or allow Android back during processing.
Root Cause:  Processing status used an unrelated upload hook progress and did not intercept hardware back while pending.

BUGGY CODE:
```tsx
const isDone = false;
const { uploadProgress } = useUpload();
navigation.replace('Caption', { videoUri, filterId, musicId });
```

FIXED CODE:
```tsx
const [uploadProgress, setUploadProgress] = useState(0);
BackHandler.addEventListener('hardwareBackPress', () => !isDone);
navigation.replace('Main', { screen: 'Home' });
```

VERIFICATION:
`npx tsc --noEmit`; `npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #7
──────────────────────────────────────────────────────────────
File:        src/hooks/useUpload.ts
Line(s):     148-230
Type:        MEMORY | TYPE
Severity:    HIGH
Symptom:     Navigating away during upload could call state setters after unmount; upload response data was untyped.
Root Cause:  Async upload path updated hook state after awaits without an is-mounted guard and read `any` API response fields.

BUGGY CODE:
```ts
setUploadProgress(progress * 0.8);
const uploadUrl = initResponse.data?.uploadUrl;
const entry = entryResponse.data as Entry;
```

FIXED CODE:
```ts
const isMountedRef = useRef(true);
const initResponse = await apiClient.post<UploadInitResponse>('/upload-init', ...);
progress => safelySetProgress(progress * 0.8)
const entryResponse = await apiClient.post<Entry>('/entry-create', ...);
```

VERIFICATION:
`npx tsc --noEmit`; `npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #8
──────────────────────────────────────────────────────────────
File:        src/api/client.ts
Line(s):     27-127
Type:        NETWORK | TYPE
Severity:    HIGH
Symptom:     Auth retry logic relied on unsafe `any` fields and mutable header assignment that can break with AxiosHeaders.
Root Cause:  Interceptors treated Axios error/config/data as untyped objects.

BUGGY CODE:
```ts
const originalRequest = error.config;
originalRequest.headers.Authorization = `Bearer ${accessToken}`;
```

FIXED CODE:
```ts
const originalRequest = error.config as RetryableRequestConfig | undefined;
originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
```

VERIFICATION:
`npx tsc --noEmit`; `npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #9
──────────────────────────────────────────────────────────────
File:        src/navigation/RootNavigator.tsx
Line(s):     43-92
Type:        FLOW | CRASH
Severity:    HIGH
Symptom:     App could remain on the loading screen if the initial auth/profile query failed.
Root Cause:  Initial session/profile loading had no complete catch path and no unmount guard.

BUGGY CODE:
```tsx
supabase.auth.getSession().then(... supabase.from('users')...then(...));
```

FIXED CODE:
```tsx
let isMounted = true;
const initializeSession = async () => { try { ... } catch { ...setIsInitializing(false); } };
return () => { isMounted = false; subscription.unsubscribe(); };
```

VERIFICATION:
`npx tsc --noEmit`; `npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #10
──────────────────────────────────────────────────────────────
File:        src/components/ui/SkeletonLoader.tsx
Line(s):     15-36
Type:        MEMORY | WARNING
Severity:    MEDIUM
Symptom:     Skeleton animation could continue after unmount and triggered React ref-read lint failures.
Root Cause:  Animated value was read from ref during render and loop had no cleanup.

BUGGY CODE:
```tsx
const opacity = useRef(new Animated.Value(0.3)).current;
Animated.loop(...).start();
```

FIXED CODE:
```tsx
const [opacity] = useState(() => new Animated.Value(0.3));
const animation = Animated.loop(...);
animation.start();
return () => animation.stop();
```

VERIFICATION:
`npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #11
──────────────────────────────────────────────────────────────
File:        src/components/CommentSheet.tsx
Line(s):     85-90
Type:        RENDER | FLOW
Severity:    MEDIUM
Symptom:     Comment input could fight the keyboard/bottom sheet on mobile.
Root Cause:  BottomSheet keyboard behavior was not configured.

BUGGY CODE:
```tsx
<BottomSheet enablePanDownToClose ...>
```

FIXED CODE:
```tsx
<BottomSheet keyboardBehavior="interactive" keyboardBlurBehavior="restore" ...>
```

VERIFICATION:
`npx eslint src/ --ext .ts,.tsx --max-warnings 0`
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
BUG #12
──────────────────────────────────────────────────────────────
File:        jest.config.js
Line(s):     9-11
Type:        WARNING | FLOW
Severity:    MEDIUM
Symptom:     `npx jest` failed despite app tests passing because Jest scanned the `missing_headers/` Expo vendor dump.
Root Cause:  Jest did not ignore the large non-app source tree containing duplicate mocks and obsolete snapshots.

BUGGY CODE:
```js
testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
```

FIXED CODE:
```js
modulePathIgnorePatterns: ['<rootDir>/missing_headers/'],
watchPathIgnorePatterns: ['<rootDir>/missing_headers/'],
testPathIgnorePatterns: ['<rootDir>/missing_headers/'],
```

VERIFICATION:
`npx jest` passes: 1 suite, 14 tests.
──────────────────────────────────────────────────────────────

## Summary

TOTAL BUGS FOUND:       12
TOTAL BUGS FIXED:       12

BY SEVERITY:
  CRITICAL (crashes/data loss):    0 found  0 fixed
  HIGH (broken flow):              7 found  7 fixed
  MEDIUM (wrong behavior):         5 found  5 fixed
  LOW (visual/minor):              0 found  0 fixed

BY TYPE:
  CRASH:         1
  LOGIC:         3
  RENDER:        1
  NAVIGATION:    1
  PERFORMANCE:   2
  MEMORY:        2
  TYPE:          3
  WARNING:       3
  FLOW:          5
  NETWORK:       1
  STATE:         3

AUTOMATED CHECKS:
  TypeScript:  0 errors ✅
  ESLint:      0 errors, 0 warnings ✅
  Jest:        passing ✅
  expo-doctor: passing ✅

MANUAL FLOWS:
  Cold start new user:    Not run on device
  Returning user:         Not run on device
  Feed interaction:       Not run on device
  Create and submit:      Not run on device
  Leaderboard:            Not run on device
  Profile:                Not run on device
  Notifications:          Not run on device
  Settings and logout:    Not run on device

UNFIXED BUGS:
  Manual iOS/Android flow verification remains unrun in this environment.

COMPETITION READINESS:
  ❌ NOT READY — automated gates pass, but required manual device flows were not completed.
