# Vybe — Full Project Specification

## App Name
Vybe

## Tagline
"Your stage. Your vybe. Weekly."

## Color Palette
- Primary Purple: #7F77DD
- Secondary Pink: #D4537E
- Accent Amber: #EF9F27
- Teal (success/positive): #1D9E75
- Background Light: #F8F7FF
- Background Dark: #0E0E14
- Surface Light: #FFFFFF
- Surface Dark: #1A1A24
- Text Primary Light: #1A1A2E
- Text Primary Dark: #F0EFF8
- Text Secondary Light: #6B6B8A
- Text Secondary Dark: #9999B8
- Border Light: #E8E7F5
- Border Dark: #2A2A3E
- Danger: #E24B4A
- Warning: #EF9F27
- Positive: #1D9E75

## Typography
- Font: Inter (Google Fonts)
- Heading 1: 28px / 700
- Heading 2: 22px / 600
- Heading 3: 18px / 600
- Body: 15px / 400
- Caption: 12px / 400
- Label: 13px / 500

## Spacing System
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

## Border Radius
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- pill: 100px

## Shadows
- card: 0 2px 12px rgba(0,0,0,0.08)
- elevated: 0 8px 32px rgba(0,0,0,0.12)
- none in dark mode (use borders instead)

## App Structure (Navigation)
Bottom tab navigator with 5 tabs:
1. Home (challenge feed) — flame icon
2. Discover — grid icon
3. Create (+) — center button, large, gradient
4. Leaderboard — trophy icon
5. Profile — user icon

Stack navigator on top of each tab for nested screens.

## Screens — Complete List

### Auth Flow
- SplashScreen
- OnboardingScreen (3 slides)
- SignUpScreen
- LoginScreen
- ForgotPasswordScreen
- PositivityPledgeScreen
- CategorySelectScreen
- ProfileSetupScreen

### Main App
- HomeScreen (challenge feed — full screen vertical scroll)
- ChallengeDetailScreen (challenge brief + entries)
- VideoPlayerScreen (full screen single video)
- CommentScreen (bottom sheet)
- DiscoverScreen (browse by category + search)
- CreateScreen (camera + recording)
- EffectsScreen (filters, stickers, music)
- CaptionScreen (caption + challenge tag)
- ProcessingScreen (upload + moderation pending)
- LeaderboardScreen (tabs: this week / all time / hall of fame)
- ProfileScreen (own profile)
- PublicProfileScreen (other user's profile)
- EditProfileScreen
- SettingsScreen
- NotificationsScreen
- WinnerRevealScreen (animated winner announcement)
- ChallengeArchiveScreen (past challenges)
- ReportScreen (content report flow)
- ModerationStatusScreen (user's own entry status)

## Feature Specifications

### Challenge Feed (HomeScreen)
- Full-screen vertical FlatList (paginated, snap-to-item)
- Each card: video fills screen, overlay UI
- Overlay bottom: creator name, challenge tag, caption, reaction bar
- Overlay right side: vote button (fire icon + count), comment button, share button, creator avatar
- Challenge banner top: "This week: [theme]" with countdown timer
- Auto-play when card is in viewport, pause when scrolled away
- Skeleton loading state while video buffers
- Pull-to-refresh
- Empty state if no entries yet

### Video Recording (CreateScreen)
- Camera preview full screen
- Front/rear camera toggle
- Record button (hold to record, max 60 seconds)
- Progress bar showing recording duration
- Flash toggle
- Grid lines toggle (rule of thirds)
- Flip/mirror toggle
- Timer countdown (3-2-1 before recording)
- Tap to focus
- After recording: trim screen, then proceed to effects

### Effects Screen
- AR filters (beauty, colour grade presets: warm, cool, vivid, B&W, golden)
- Music selector (royalty-free library, 30-sec clips)
- Sticker overlays (challenge-specific stickers)
- Text overlay tool
- Speed control (0.5x, 1x, 1.5x)

### Caption & Publish Screen
- Caption input (max 200 chars) with character counter
- Challenge tag auto-applied (this week's challenge)
- Allow/disallow duet toggle
- Visibility: public / followers only
- Submit button → triggers upload + moderation pipeline

### Voting System
- One vote per user per entry
- Vote = tap fire icon
- Visual feedback: fire icon animates, count increments
- Vote cannot be undone (by design — considered, intentional)
- Real-time vote count via Supabase Realtime
- Votes contribute to leaderboard rank

### Reaction System (comments)
- 6 emoji reactions on each video: 🔥 ❤️ 🎉 👏 ✨ 😍
- These are separate from comments
- Reaction counts visible on video overlay
- Reactions do NOT require moderation

### Comment System
- Bottom sheet modal
- Comments displayed newest-first
- Each comment: avatar, username, text, timestamp, like button
- Reply threading (one level only)
- Comment input at bottom with send button
- ALL comments pass through positivity filter before display
- Blocked comment: input clears, soft message "Keep it positive! 🌟" shown
- No comment deletion by users (only by moderators)
- Pinned comment: creator can pin one positive comment

### Leaderboard
- Three tabs: This Week / Hall of Fame / My Rank
- This Week: live ranking, updates every 30 seconds
- Each row: rank number, creator avatar + name, challenge, vote count, entry thumbnail
- Top 3 highlighted with gold/silver/bronze treatment
- Hall of Fame: all past weekly winners with date + challenge
- My Rank: user's own position + how many votes needed to climb

### Creator Profile
- Avatar, name, handle, bio (max 150 chars)
- Vybe Score (aggregate of votes received across all entries, displayed as number)
- Stats row: entries submitted / challenges won / total votes
- Badge shelf: challenge winner crowns, milestone badges, streak badges
- Entry grid: 3-column grid of past entries (thumbnail, vote count overlay)
- Tap entry → VideoPlayerScreen
- Follow button (for other profiles)
- Vybe Coins balance (visible on own profile only)

### Vybe Score
- Calculated as: (total votes received × 1) + (challenge wins × 100) + (entries submitted × 5)
- Displayed as a number with tier label:
  - 0–99: "New Vybe"
  - 100–499: "Rising Star"
  - 500–1999: "Hot Vybe"
  - 2000+: "Vybe Legend"

### Vybe Coins
- Earned by: submitting entries (+10), getting 10 votes (+5), winning a challenge (+500), daily login (+2)
- Displayed on own profile
- Future: redeem for cosmetic badges (non-pay-to-win)

### Notifications
- Types: new_challenge, vote_milestone (10, 50, 100, 500 votes), comment_on_entry, new_follower, winner_announcement, entry_approved, entry_rejected, rank_change (entered top 10)
- Notification center screen
- Push via Firebase Cloud Messaging

### Winner Reveal
- Sunday 11:59 PM: voting closes
- Animated screen reveals top 3
- Confetti animation
- Winner's video auto-plays in background
- Share winner card button (generates image card for Instagram/WhatsApp)

### Moderation Pipeline (client side awareness)
- After submit: entry shows "Under Review" badge
- Typical review: < 30 seconds for auto-approve
- If flagged for human review: "In Review" state, user notified within 2 hrs
- If rejected: push notification with reason (category: content/audio/caption)
- Strike counter visible in settings

### Onboarding
- 3 slides: "Your stage" / "Compete weekly" / "Kindness only"
- Slide 4: Positivity Pledge (must scroll to bottom + tap Accept)
- Slide 5: Pick categories (multi-select, minimum 1)
- Slide 6: Profile setup (name, handle, avatar)
- Complete → Home screen

## Data Models

### User
- id: uuid
- handle: string (unique, @username)
- displayName: string
- avatarUrl: string
- bio: string (max 150)
- categories: string[]
- vybeScore: number
- vybeCoins: number
- strikeCount: number (0-3)
- pledgeSigned: boolean
- createdAt: timestamp
- followersCount: number
- followingCount: number

### Challenge
- id: uuid
- title: string
- description: string (brief for creators)
- category: enum (singing | dancing | comedy | cooking | art | instrument)
- weekNumber: number
- year: number
- startDate: timestamp (Monday 00:00)
- endDate: timestamp (Saturday 23:59)
- revealDate: timestamp (Sunday 23:59)
- coverImageUrl: string
- promptText: string (e.g. "Cover any acoustic song, original or classic")
- status: enum (upcoming | active | voting | closed | revealed)
- winnerId: uuid | null
- runnerUp1Id: uuid | null
- runnerUp2Id: uuid | null

### Entry
- id: uuid
- challengeId: uuid
- userId: uuid
- videoUrl: string
- thumbnailUrl: string
- caption: string (max 200)
- duration: number (seconds)
- voteCount: number
- reactionCounts: { fire, heart, party, clap, sparkle, love }
- status: enum (processing | under_review | live | rejected | removed)
- moderationScore: number (0-1, AI confidence)
- rejectionReason: string | null
- createdAt: timestamp
- rank: number | null

### Comment
- id: uuid
- entryId: uuid
- userId: uuid
- text: string
- positivityScore: number (0-1)
- isPinned: boolean
- parentId: uuid | null (for replies)
- createdAt: timestamp
- likeCount: number

### Vote
- id: uuid
- entryId: uuid
- userId: uuid
- createdAt: timestamp
(unique constraint on entryId + userId)

### Notification
- id: uuid
- userId: uuid
- type: string
- title: string
- body: string
- data: json
- read: boolean
- createdAt: timestamp

### Follow
- followerId: uuid
- followingId: uuid
- createdAt: timestamp

### Strike
- id: uuid
- userId: uuid
- reason: string
- entryId: uuid | null
- issuedAt: timestamp
- expiresAt: timestamp (90 days)

## API Endpoints (REST)

### Auth
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password

### Challenges
GET    /challenges/active
GET    /challenges/:id
GET    /challenges/:id/entries
GET    /challenges/archive

### Entries
POST   /entries (multipart/form-data: video + metadata)
GET    /entries/:id
DELETE /entries/:id
GET    /entries/feed?challengeId=&cursor=&limit=

### Votes
POST   /votes { entryId }
GET    /votes/check/:entryId

### Comments
GET    /comments/:entryId
POST   /comments { entryId, text, parentId? }
POST   /comments/:id/pin (creator only)
POST   /comments/:id/like

### Reactions
POST   /reactions { entryId, type }

### Leaderboard
GET    /leaderboard/current
GET    /leaderboard/hall-of-fame
GET    /leaderboard/my-rank

### Users
GET    /users/:id
PUT    /users/me
GET    /users/me/notifications
PUT    /users/me/notifications/:id/read
GET    /users/me/entries
GET    /users/me/coins

### Reports
POST   /reports { entryId?, commentId?, reason }

### Moderation (internal)
POST   /moderation/entry/:id/approve
POST   /moderation/entry/:id/reject
POST   /moderation/user/:id/strike

## State Management
Use Zustand for global state. Stores:
- authStore: user, token, isLoading, login(), logout(), updateProfile()
- feedStore: entries[], currentIndex, loadFeed(), vote(), react()
- challengeStore: activeChallenge, archiveList, fetchActive()
- leaderboardStore: currentWeek[], hallOfFame[], myRank, fetchLeaderboard()
- notificationStore: notifications[], unreadCount, markRead()
- createStore: videoUri, effects, caption, challengeId, upload(), reset()
- moderationStore: entryStatuses{}, fetchStatus()

## Offline & Loading States
- Every screen must have a skeleton loader
- Every async action must have a loading spinner or button loading state
- Network errors must show a retry button with descriptive message
- Optimistic UI for votes (increment immediately, rollback on failure)
- Optimistic UI for reactions

## Accessibility
- All touchable elements minimum 44×44px
- All images have accessibilityLabel
- Color contrast ratio minimum 4.5:1 (WCAG AA)
- Screen reader support via accessibilityRole and accessibilityHint
- Reduced motion: respect prefers-reduced-motion (skip animations)

## Performance Requirements
- Feed video start time < 1 second
- App launch to home screen < 2 seconds
- Leaderboard update interval: 30 seconds
- Comment filter response: < 200ms
- Upload progress: chunked with progress bar