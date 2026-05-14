<div align="center">

# 🔥 Vybe

### Positive Social Video Platform

*Your stage. Your vybe. Weekly.*

![Version](https://img.shields.io/badge/version-1.0.0-7F77DD)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Built With](https://img.shields.io/badge/built%20with-Expo%2055%20%7C%20React%20Native%200.83-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![Supabase](https://img.shields.io/badge/backend-Supabase-3ECF8E)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## What is Vybe?

Vybe is a **mobile-first short-form video platform** where creators compete in weekly themed talent challenges — moderated entirely for positivity. No toxicity. No negativity. Just talent.

Every week a new challenge drops across **12 categories** — music, dance, comedy, art, sports, gaming, cooking, fashion, fitness, DIY, pets, and travel. Creators submit their entries before the deadline. The community votes. Winners are revealed with a cinematic reveal screen.

Vybe stands out through its **forced-positivity model**: every interaction — from comments to reports — is designed to encourage and uplift. A multi-layer moderation system ensures the community stays safe, fun, and inspiring.

---

## Screenshots

| Home Feed | Discover | Leaderboard | Profile |
|-----------|----------|-------------|---------|
| ![Home](assets/screenshots/home.png) | ![Discover](assets/screenshots/discover.png) | ![Leaderboard](assets/screenshots/leaderboard.png) | ![Profile](assets/screenshots/profile.png) |

| Onboarding | Category Select | Camera | Effects |
|------------|----------------|--------|---------|
| ![Onboarding](assets/screenshots/onboarding.png) | ![Categories](assets/screenshots/categories.png) | ![Camera](assets/screenshots/camera.png) | ![Effects](assets/screenshots/effects.png) |

---

## Key Features

### 🎯 Core Experience
- **12 Challenge Categories** — Music, Dance, Comedy, Art, Sports, Gaming, Cooking, Fashion, Fitness, DIY, Pets, Travel
- **Full-Screen Video Feed** — Smooth vertical scroll with auto-play
- **Live Leaderboard** — Real-time vote rankings with animated cards
- **Creator Profiles** — Vybe Score, bio, challenge history, and badges
- **Winner Reveal** — Cinematic reveal screen with confetti cannon

### 🧭 Personalized Discovery
- **Smart Onboarding** — New users choose interest categories and set up their profile before entering the app
- **Discover Page** — Filter challenges by category with horizontal chip selector (All → For You → individual categories)
- **"For You" Feed** — Challenges matching your selected interests are highlighted with a badge
- **Dynamic Category Toggle** — Switch between categories instantly on the Discover page

### 🎬 Content Creation
- **Built-in Camera** — Powered by `expo-camera` with permissions handling
- **Effects & Filters** — Color overlays (Warm, Cool, Vintage, B&W) with live preview
- **Music Selection** — Choose from curated tracks or keep original audio
- **Caption & Submit** — Add captions with hashtags before publishing

### 🛡️ Positivity-First Moderation
- **Positivity Pledge** — New users sign a pledge before accessing the community
- **Comment Moderation** — Real-time positivity scoring on all comments
- **Report System** — Community reporting with structured reason categories
- **Strike System** — Progressive enforcement (warn → voting ban → submission ban)

### 👤 Profile & Identity
- **Unique Username Enforcement** — Database-level constraint prevents duplicate handles
- **Bio & Display Name** — Full profile customization with avatar support
- **Interest Categories** — Stored per-user, used for feed personalization
- **Vybe Score** — Reputation metric based on votes, wins, and participation

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React Native + Expo | RN 0.83 · Expo SDK 55 |
| **Language** | TypeScript | 5.9 (strict mode) |
| **Navigation** | React Navigation | v7 (native-stack + bottom-tabs) |
| **State** | Zustand + TanStack Query | Zustand 5 · RQ v5 |
| **Backend** | Supabase | Auth + PostgreSQL + RLS + Storage |
| **Camera** | expo-camera | SDK 55 |
| **Icons** | Lucide React Native | 1.7 |
| **Animations** | React Native Reanimated + Moti | Reanimated 4 · Moti 0.30 |
| **Forms** | React Hook Form + Zod | RHF 7 · Zod 4 |
| **Fonts** | Inter (Google Fonts) | via @expo-google-fonts |
| **UI Extras** | expo-blur · expo-linear-gradient · expo-haptics | SDK 55 |
| **Storage** | expo-secure-store · AsyncStorage · MMKV | — |

---

## App Architecture

### Navigation Flow

```text
App Launch
  │
  ├─ Not Authenticated ──→ AuthNavigator
  │                           ├─ OnboardingScreen (welcome)
  │                           ├─ LoginScreen
  │                           ├─ SignUpScreen
  │                           └─ PositivityPledgeScreen
  │
  ├─ Authenticated (no username) ──→ OnboardingNavigator
  │                                    ├─ CategorySelectScreen (pick interests)
  │                                    └─ ProfileSetupScreen (name, bio, handle)
  │
  └─ Authenticated (profile complete) ──→ MainNavigator (Tab Bar)
                                            ├─ Home (Feed)
                                            ├─ Discover
                                            ├─ Create (+)
                                            ├─ Leaderboard
                                            └─ Profile
```

### State Management

| Store | Purpose |
|-------|---------|
| `authStore` (Zustand) | User session, profile, login/signup/logout, updateProfile |
| `feedStore` (Zustand) | Feed playback state (active index, paused status) |
| `createStore` (Zustand) | Video creation flow state |
| `leaderboardStore` (Zustand) | Leaderboard data cache |
| TanStack Query | Server data fetching, caching, and revalidation |

---

## Project Structure

```text
vybe/
├── src/
│   ├── api/                  # Supabase API layer
│   │   ├── index.ts          # challengesApi, entriesApi, commentsApi, usersApi
│   │   ├── supabase.ts       # Supabase client initialization
│   │   └── mock/             # Mock data for development
│   ├── components/           # Reusable components
│   │   ├── ui/               # Design system primitives
│   │   │   ├── Avatar.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── GlassPanel.tsx
│   │   │   ├── GradientButton.tsx
│   │   │   ├── Pill.tsx          # Tappable pill with onPress support
│   │   │   └── SkeletonLoader.tsx
│   │   ├── FeedItem.tsx      # Full-screen video feed card
│   │   ├── InteractionBar.tsx # Like/comment/share overlay
│   │   ├── CommentSheet.tsx  # Bottom sheet comment thread
│   │   ├── VideoPlayer.tsx   # Image-based video preview
│   │   └── LeaderboardCard.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useActiveChallenges.ts  # Fetches all active challenges
│   │   ├── useActiveChallenge.ts   # Single active challenge
│   │   ├── useComments.ts         # Comment thread for an entry
│   │   ├── useFeed.ts            # Paginated video feed
│   │   ├── useLeaderboard.ts     # Leaderboard rankings
│   │   ├── useProfileStats.ts    # User stats (entries, votes, wins)
│   │   └── useUpload.ts          # Video upload pipeline
│   ├── navigation/           # Navigator definitions
│   │   ├── RootNavigator.tsx      # 3-way branch: auth / onboarding / main
│   │   ├── AuthNavigator.tsx      # Login, signup, pledge screens
│   │   ├── OnboardingNavigator.tsx # Category + profile setup
│   │   └── MainNavigator.tsx      # Bottom tab navigator (5 tabs)
│   ├── screens/              # All app screens
│   │   ├── auth/             # Authentication & onboarding
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   ├── PositivityPledgeScreen.tsx
│   │   │   ├── CategorySelectScreen.tsx   # Interest picker (12 categories)
│   │   │   ├── ProfileSetupScreen.tsx     # Username, name, bio, avatar
│   │   │   └── SplashScreen.tsx
│   │   ├── feed/             # Home feed
│   │   │   └── HomeScreen.tsx
│   │   ├── discover/         # Challenge discovery
│   │   │   └── DiscoverScreen.tsx   # Category filter chips + challenge cards
│   │   ├── create/           # Content creation flow
│   │   │   ├── CameraScreen.tsx
│   │   │   ├── EffectsScreen.tsx    # Filter + music selection
│   │   │   ├── CaptionScreen.tsx    # Caption + hashtags
│   │   │   └── ProcessingScreen.tsx # Upload progress
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardScreen.tsx
│   │   │   └── WinnerRevealScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx    # Avatar, bio, stats, settings
│   │   │   └── SettingsScreen.tsx
│   │   ├── moderation/
│   │   │   └── ReportScreen.tsx
│   │   └── misc/
│   │       └── NotificationsScreen.tsx
│   ├── stores/               # Zustand state stores
│   │   ├── authStore.ts      # Auth session + profile management
│   │   ├── feedStore.ts      # Feed playback state
│   │   ├── createStore.ts    # Creation flow state
│   │   └── leaderboardStore.ts
│   ├── theme/                # Design tokens
│   │   ├── colors.ts         # Color palette (dark theme)
│   │   ├── typography.ts     # Font weights, sizes (Inter family)
│   │   ├── spacing.ts        # Spacing scale + border radii
│   │   └── index.ts
│   ├── types/                # TypeScript definitions
│   │   ├── models.ts         # User, Challenge, Entry, Comment, Vote
│   │   ├── database.ts       # Database row interfaces (Db* types)
│   │   └── navigation.ts     # RootStackParamList
│   └── utils/                # Helpers
│       ├── cleanup.ts        # Secure data cleanup on logout
│       ├── logger.ts         # Structured logging utility
│       └── ...
├── supabase/
│   └── migrations/           # Ordered SQL migrations
│       ├── 20260101000000_init.sql
│       ├── 20260418000000_app_domain.sql
│       ├── 20260512000000_vybe_tables.sql        # Core schema (users, challenges, entries, votes, comments, reports)
│       ├── 20260512000001_vote_rpcs.sql           # Vote/unvote RPC functions
│       ├── 20260512000002_storage_bucket.sql      # Video upload bucket + policies
│       ├── 20260512000003_seed_data.sql           # Demo users, challenges, entries, comments, votes
│       ├── 20260512000010_add_challenge_category.sql  # Category column + 12-category seed
│       └── 20260512000011_unique_username.sql     # Partial unique index on usernames
├── assets/                   # Static assets
├── app.json                  # Expo configuration
├── tsconfig.json             # TypeScript config (strict)
└── package.json
```

---

## Database Schema

The database runs on **Supabase PostgreSQL** with Row Level Security (RLS) enabled on all tables. Migrations are in `supabase/migrations/`.

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `users` | Creator profiles — username, display name, bio, avatar, categories, vybe_score | Owners can update own row; public read |
| `challenges` | Weekly challenge definitions — title, description, category, status, deadline | Public read |
| `entries` | Video submissions — video_url, thumbnail, caption, vote_count, music_track | Creator can insert; public read |
| `votes` | One vote per user per entry (unique constraint on entry_id + user_id) | Users can insert/delete own votes |
| `comments` | Threaded comments with positivity_score | Users can insert own; public read |
| `reports` | Content reports with reason categorization | Users can insert own reports |

### Key Constraints & Indexes

- **Unique username** — Partial unique index: `CREATE UNIQUE INDEX ... ON users (lower(username)) WHERE username IS NOT NULL AND username != ''`
- **One vote per entry** — Unique constraint on `(entry_id, user_id)`
- **Challenge categories** — `category TEXT NOT NULL DEFAULT 'general'` — supports: music, dance, comedy, art, sports, gaming, cooking, fashion, fitness, diy, pets, travel
- **RPC functions** — `cast_vote(p_entry_id)` and `remove_vote(p_entry_id)` handle atomic vote count updates

### Seed Data

The seed migration (`20260512000003`) creates:
- **6 demo users** with avatars, bios, and interest categories
- **5 challenges** (3 active, 1 completed, 1 upcoming)
- **10 video entries** with real sample video URLs
- **15 comments** with positivity scores
- **20 votes** for realistic leaderboard rankings

The category migration (`20260512000010`) adds **12 additional active challenges** — one per category — ensuring the Discover page always has content.

---

## Onboarding Flow

New users go through a **mandatory 4-step onboarding**:

1. **Welcome Screen** — App introduction with feature highlights
2. **Sign Up** — Email + password via Supabase Auth
3. **Positivity Pledge** — Users agree to the community standards
4. **Category Select** — Pick interests from 12 categories (min 1 required)
5. **Profile Setup** — Set username (uniqueness-checked in real-time), display name, and bio

Users cannot access the main app until all steps are complete. The `RootNavigator` enforces this with a three-way branch checking `isAuthenticated` and `user.username` existence.

---

## Discover Page

The Discover screen features a **category filter system**:

| Filter | Behavior |
|--------|----------|
| 🌟 **All** | Shows all 15+ active challenges |
| ✨ **For You** | Shows only challenges matching user's onboarding interests |
| 🎵 **Music**, 💃 **Dance**, etc. | Shows only that category's challenges |

Each challenge card displays:
- Hashtag title with fire icon
- Category pill with emoji
- Description (2-line preview)
- Time remaining countdown
- "Matches your interests" badge (when applicable)

---

## Vybe Score

Creator reputation is calculated as:

```text
Vybe Score = (total votes × 1) + (challenge wins × 100) + (entries × 5)
```

| Score | Tier |
|-------|------|
| 0 – 99 | New Vybe |
| 100 – 499 | Rising Star |
| 500 – 1,999 | Hot Vybe |
| 2,000+ | Vybe Legend |

---

## Moderation System

Vybe uses a 5-layer moderation pipeline:

```text
User submits content
  ↓
Layer 1: On-device pre-screen (content type check)
  ↓
Layer 2: Server-side analysis (video + caption + speech-to-text)
  ↓
Layer 3: Auto-approve / Flag for human review / Auto-reject
  ↓
Layer 4: Community reports (3 reports → auto-hide pending review)
  ↓
Layer 5: Strike system (warn → voting ban → submission ban)
```

Comments are scored for positivity in real-time. Low-scoring comments are silently filtered — no shaming, no harsh error messages. The entire moderation experience is designed to be invisible to well-behaved users.

---

## Getting Started

### Prerequisites

- **Node.js** 20 LTS or higher
- **npm** 10+ or yarn 1.22+
- **Expo CLI**: installed via npx (no global install needed)
- **iOS**: Xcode 15+ with Command Line Tools (Mac only)
- **Android**: Android Studio with JDK 17
- **Supabase CLI**: `npm install -g supabase`

### Installation

```bash
# Clone the repository
git clone https://github.com/TavishAgarwal/vybe.git
cd vybe

# Install dependencies
npm install

# Start Supabase locally
npx supabase start

# Apply migrations and seed data
npx supabase db reset

# Start the Expo development server
npx expo start
```

### Running on Device

```bash
# iOS Simulator (requires Xcode)
npx expo run:ios

# Android Emulator
npx expo run:android

# Physical device via Expo Go
npx expo start --tunnel
```

### Environment Setup

The app connects to a local Supabase instance by default. The Supabase URL and keys are configured in `src/api/supabase.ts`.

For production deployment:

1. **Supabase** — Create a project at [supabase.com](https://supabase.com) and run the migrations via `supabase db push`
2. **Update keys** — Replace the local Supabase URL and anon key with your production values
3. **Storage** — The video upload bucket (`videos`) is created automatically by the storage migration

---

## Scripts

```bash
npm start              # Start Expo development server
npm run start:clear    # Start with cache cleared
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run type-check     # Run TypeScript compiler (strict)
npm run type-check:watch # TypeScript in watch mode
npm run lint           # ESLint with zero-warning policy
npm run lint:fix       # Auto-fix linting issues
npm run format         # Prettier formatting
npm run test           # Jest test suite
npm run test:coverage  # Test coverage report
npm run prebuild       # Expo prebuild (clean native dirs)
npm run build:ios      # EAS build for iOS
npm run build:android  # EAS build for Android
npm run doctor         # Expo doctor health check
npm run clean          # Full clean reinstall
```

---

## Design System

### Theme

Vybe uses a **dark-first design** with a curated color palette:

| Token | Value | Usage |
|-------|-------|-------|
| `primary.base` | `#7F77DD` | Buttons, highlights, active states |
| `primary.light` | `#A89CFF` | Text accents, badges |
| `background.default` | `#0A0A0F` | App background |
| `background.secondary` | `#1A1A2E` | Cards, panels |
| `text.inverse` | `#FFFFFF` | Primary text on dark bg |

### Typography

- **Font**: Inter (Google Fonts) — Regular, Medium, SemiBold, Bold
- **Scale**: xs (11) → sm (13) → md (15) → lg (17) → xl (20) → 2xl (24) → 3xl (28) → 4xl (32)

### UI Components

| Component | Description |
|-----------|-------------|
| `GradientButton` | Primary CTA with linear gradient and size variants |
| `Pill` | Tappable label chip with 5 color variants + `onPress` support |
| `Avatar` | Circular user avatar with fallback initials |
| `GlassPanel` | Semi-transparent card with blur effect |
| `SkeletonLoader` | Animated placeholder for loading states |
| `ErrorBoundary` | Graceful crash recovery with retry |

---

## API Layer

All data flows through a typed Supabase API layer (`src/api/index.ts`):

| Module | Methods |
|--------|---------|
| `challengesApi` | `getActive()`, `getAll()`, `getById(id)` |
| `entriesApi` | `getFeed(challengeId, cursor, limit)`, `createEntry(data)` |
| `commentsApi` | `getForEntry(entryId)`, `create(entryId, content)` |
| `usersApi` | `getById(id)`, `getTopCreators(limit)` |
| `votesApi` | `castVote(entryId)`, `removeVote(entryId)` |

Data is cached and revalidated via **TanStack Query** with configurable stale times.

---

## Contributing

This project is a competition submission. During the competition period, contributions are from the core team only.

After the competition, contributions are welcome! Please open an issue first to discuss proposed changes.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by Tavish Agarwal**

*Vybe — Where talent meets positivity*

</div>
