# Vybe — Screen-by-Screen Design Guide

## SplashScreen
- Full screen, dark background (#0E0E14)
- Vybe logo centered, gradient text (purple → pink → amber)
- Tagline below: "Your stage. Your vybe. Weekly."
- Auto-navigate to OnboardingScreen (if first launch) or HomeScreen (if logged in)
- Duration: 2 seconds, then fade out

## OnboardingScreen
- 3 slides with page dots indicator
- Slide 1: Large phone mockup showing feed. Title: "Your stage". Body: "Record, submit, and compete in weekly talent challenges."
- Slide 2: Leaderboard animation. Title: "Compete weekly". Body: "Every Monday a new theme drops. Submit by Saturday. Winners revealed Sunday."
- Slide 3: Heart/shield icon. Title: "Kindness only". Body: "Every comment is checked for positivity. This is a safe space for creators."
- CTA: "Get Started" → PositivityPledgeScreen
- Skip button top-right → PositivityPledgeScreen

## PositivityPledgeScreen
- Title: "The Vybe Pledge"
- Subtitle: "Before you join, please read and accept our community promise."
- Scrollable text block with the full pledge text (see MODERATION.md)
- Scroll indicator: "Scroll to read"
- Accept button enabled only after user scrolls to bottom
- Accept → CategorySelectScreen

## CategorySelectScreen
- Title: "What's your talent?"
- Subtitle: "Pick all that apply. We'll personalize your feed."
- 6 category cards in 2x3 grid:
  - Singing 🎤
  - Dancing 💃
  - Comedy 😂
  - Cooking 🍳
  - Art 🎨
  - Instruments 🎸
- Each card: icon, label, tap to toggle (selected state: purple border + checkmark)
- Must select at least 1 to continue
- Continue → ProfileSetupScreen

## ProfileSetupScreen
- Title: "Set up your profile"
- Avatar picker (camera, gallery, or default gradient avatar generated from name initials)
- Display name input (required, max 40 chars)
- Handle input (@username, required, max 20 chars, alphanumeric + underscore, unique check)
- Bio input (optional, max 150 chars, char counter)
- Finish → HomeScreen (with welcome animation)

## HomeScreen (Challenge Feed)
- Status bar: light content (dark background behind video)
- Full screen FlatList, vertical, pagingEnabled, snapToAlignment="start"
- Each item is a VideoCard component (see COMPONENTS.md)
- Top overlay (absolute): challenge banner showing "🔥 This Week: [Challenge Title]" + countdown "3d 14h left"
- Right overlay (absolute, vertical stack): vote button, reaction button, comment button, share button, creator avatar
- Bottom overlay (absolute): creator name + handle, challenge tag chip, caption text (2 lines + expand), gradient fade up from bottom
- Video auto-plays when focused, pauses when not
- Double-tap on video = vote (haptic feedback + fire burst animation)
- Swipe up = next entry

## ChallengeDetailScreen
- Header: challenge cover image (full width), title, category chip, description
- Countdown timer strip
- "Enter Challenge" CTA button → CreateScreen with challengeId pre-set
- Tabs: "All Entries" / "Top Voted" / "New"
- Each tab: vertical list of EntryCard components
- Own entry (if submitted): pinned to top with status badge

## VideoPlayerScreen
- Full screen video, tap to pause/play
- Back button top-left
- Same overlay as HomeScreen feed card
- Swipe down to dismiss (interactive)

## CommentScreen (bottom sheet)
- 75% screen height bottom sheet, drag to expand to full
- Comments FlatList
- Each comment: avatar (32px), handle, text, timestamp, like icon + count
- Replies: indented, shown inline (max 3, "View more replies" expands)
- Pinned comment: gold pin icon, always at top
- Input bar fixed at bottom: avatar thumbnail, text input ("Add a positive comment..."), send arrow
- If comment blocked: input shakes, text clears, toast: "Keep it positive! 🌟"
- Loading skeleton for initial comment load

## DiscoverScreen
- Header: "Discover" title + search bar
- Category filter chips (horizontal scroll): All / Singing / Dancing / Comedy / Cooking / Art / Instruments
- Section: "This Week's Challenges" — horizontal scroll of ChallengeCard components
- Section: "Trending Entries" — 2-column masonry grid of video thumbnails
- Section: "Recent Winners" — horizontal scroll of WinnerCard components
- Search active state: full-screen search results (entries + creators)

## CreateScreen (Camera)
- Full screen camera preview
- Top bar: X (cancel), flash toggle, grid toggle, flip toggle, timer toggle
- Bottom bar: gallery picker icon | record button | camera flip icon
- Record button: large circle (70px), white border, tap to start
- While recording: border animates, progress arc fills (duration bar)
- Release to stop (or auto-stops at 60s)
- After recording → EffectsScreen

## EffectsScreen
- Video preview at top (60% height)
- Tabs row: Filters | Music | Stickers | Text | Speed
- Filters tab: horizontal scroll of filter previews (Normal, Warm, Cool, Vivid, B&W, Golden, Dreamy)
- Music tab: search bar + royalty-free tracks list (track name, artist, BPM, 15-sec preview play)
- Stickers tab: grid of challenge-themed animated stickers
- Text tab: font options, color picker, position (drag on video preview)
- Speed tab: 0.5× / 1× / 1.5× pill selector
- Bottom bar: Back | Next (→ CaptionScreen)

## CaptionScreen
- Video preview thumbnail (full width, 30% height)
- Caption text input (multiline, max 200 chars, char counter)
- Challenge tag chip (auto-applied, not removable)
- "Who can see this?" toggle: Everyone / Followers only
- "Allow duets" toggle
- Post button (large, gradient, full width)
- Tapping Post → ProcessingScreen

## ProcessingScreen
- Centered layout
- Animated upload icon (progress ring)
- "Uploading your Vybe..." text
- Progress percentage
- After upload: "Under Review 🔍" state with estimated time ("Usually less than a minute")
- On approved: success animation → "You're live! 🎉" → navigate to entry in feed
- On rejected: "Hmm, something wasn't right" → reason + appeal option

## LeaderboardScreen
- Header: trophy icon + "Leaderboard" title
- Three tabs: This Week | Hall of Fame | My Rank
- This Week tab:
  - Live badge (green dot + "Live") with last-updated time
  - Top 3 podium visual (2nd | 1st | 3rd) with avatars + names + vote counts
  - Ranks 4–10 in a list
  - Each row: rank number, avatar, name, challenge name, vote count, thumbnail
  - Auto-refreshes every 30 seconds
- Hall of Fame tab:
  - Chronological list of all past winners
  - Week number, challenge title, winner name, vote count
- My Rank tab:
  - User's rank card (your rank, your votes, distance to next rank)
  - Progress bar towards next rank
  - "Share your rank" button

## ProfileScreen / PublicProfileScreen
- Header: gradient background strip
- Avatar (80px, circular, white border)
- Display name (heading), handle (secondary), bio
- Stats row: Entries | Wins | Total Votes — all tappable to expand
- Vybe Score chip (color-coded by tier)
- Badge shelf (horizontal scroll): crown badges, milestone badges
- Tab bar: Videos | Wins
- Videos tab: 3-column grid of thumbnails with vote count overlay
- Wins tab: list of won challenges with date + challenge name
- Own profile: Edit Profile button, Settings icon in header
- Other profile: Follow button, Message button (future)
- Vybe Coins row (own profile only): coin icon + balance + "How to earn ↗"

## EditProfileScreen
- Avatar edit (camera, gallery, remove)
- Display name input
- Handle input (with availability check)
- Bio input
- Categories multi-select
- Save button
- Delete account option (destructive, confirmation dialog)

## SettingsScreen
- Sections: Account | Privacy | Notifications | Moderation | About
- Account: email, password change, connected accounts
- Privacy: profile visibility, who can comment (everyone/followers)
- Notifications: per-type toggles
- Moderation: strike history, appeal a decision, view community guidelines
- About: version, privacy policy, terms, Vybe Pledge text

## NotificationsScreen
- FlatList of notifications
- Grouped by: Today / This Week / Earlier
- Each notification: icon (type-based), title, body, time, unread dot
- Tap → relevant screen (entry, profile, leaderboard)
- Mark all as read button

## WinnerRevealScreen
- Dark background
- Animated confetti (react-native-confetti-cannon)
- "🏆 This Week's Vybe Winner" headline
- Winner's video auto-playing in a phone-frame mockup (centered)
- Winner name, challenge name, vote count
- "Share Winner Card" button → generates shareable image
- "See full leaderboard" → LeaderboardScreen
- Auto-dismisses after 10 seconds

## ReportScreen
- Title: "Report this content"
- Reason selection (radio):
  - Harmful or dangerous
  - Hateful or discriminatory
  - Spam or misleading
  - Inappropriate for the challenge theme
  - Other
- Text input for details (optional)
- Submit button
- Confirmation: "Thanks for keeping Vybe positive. We'll review within 2 hours."

## ModerationStatusScreen
- List of own entries with status badges
- Status types: Live ✅ | Under Review 🔍 | Rejected ❌ | Removed 🚫
- Tap rejected: see reason + appeal form
- Appeal: text input (max 300 chars) + submit