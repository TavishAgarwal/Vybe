<div align="center">

# 🔥 Vybe
### Positive Social Video Platform

*Your stage. Your vybe. Weekly.*

![Version](https://img.shields.io/badge/version-1.0.0-7F77DD)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Built With](https://img.shields.io/badge/built%20with-Expo%20%7C%20React%20Native-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## What is Vybe?

Vybe is a mobile-first short-form video platform where creators
compete in weekly themed talent challenges — moderated entirely
for positivity. No toxicity. No negativity. Just talent.

Every Monday a new challenge drops (singing, dancing, comedy,
cooking, art, or instruments). Creators submit their entries
before Saturday. The community votes. Winners are revealed
every Sunday night with a cinematic reveal screen.

---

## Screenshots

<!-- Add screenshots here after building -->
| Home Feed | Challenge | Leaderboard | Profile |
|-----------|-----------|-------------|---------|
| ![Home](assets/screenshots/home.png) | ![Challenge](assets/screenshots/challenge.png) | ![Leaderboard](assets/screenshots/leaderboard.png) | ![Profile](assets/screenshots/profile.png) |

---

## Key Features

- **Weekly Challenges** — New theme every Monday across 6 categories
- **Full-Screen Video Feed** — Smooth vertical scroll, auto-play, 60fps
- **Positivity Moderation** — AI + human hybrid, invisible to users
- **Live Leaderboard** — Real-time vote rankings, updates every 30s
- **Creator Profiles** — Vybe Score, badges, challenge history
- **Winner Reveal** — Cinematic Sunday night reveal with confetti
- **Vybe Coins** — Earn by participating, win by competing

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native 0.73 + Expo SDK 50 |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation 6 |
| State | Zustand 4 + TanStack Query v5 |
| Backend | Supabase (Auth + DB + Realtime + Storage) |
| Video | Cloudflare Stream (HLS adaptive bitrate) |
| Moderation | Perspective API + Google Cloud Video Intelligence |
| Animations | Reanimated 3 + Moti |
| Camera | react-native-vision-camera 3 |
| Push | Firebase Cloud Messaging |

---

## Project Structure

```text
vybe/
├── src/
│   ├── navigation/        # Navigator definitions
│   ├── screens/           # All app screens
│   │   ├── auth/          # Onboarding, login, signup
│   │   ├── feed/          # Home feed, video player, comments
│   │   ├── create/        # Camera, effects, caption, upload
│   │   ├── leaderboard/   # Rankings and winner history
│   │   ├── profile/       # User profiles and settings
│   │   └── misc/          # Notifications, winner reveal, etc.
│   ├── components/        # Reusable components
│   │   ├── feed/          # VideoCard, EntryCard
│   │   ├── ui/            # Design system components
│   │   ├── profile/       # Avatar, badges, score
│   │   └── comment/       # Comment bubbles
│   ├── stores/            # Zustand state stores
│   ├── api/               # Axios API layer + mock data
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Formatters, validators, helpers
│   ├── theme/             # Colors, typography, spacing
│   └── types/             # TypeScript type definitions
├── assets/                # Fonts, images, animations
├── supabase/              # Database schema + RLS policies
├── .env.example           # Environment variable template
└── app.json               # Expo configuration
```

---

## Getting Started

### Prerequisites

- Node.js 20 LTS or higher
- npm 10+ or yarn 1.22+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 15+ (Mac only)
- Android: Android Studio + JDK 17

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/vybe.git
cd vybe

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Fill in your values in .env

# Start the development server
npx expo start
```

### Running on Device

```bash
# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android

# Physical device (Expo Go)
npx expo start --tunnel
```

### Environment Setup

Copy `.env.example` to `.env` and fill in:

1. **Supabase** — Create a project at [supabase.com](https://supabase.com)
   and run `supabase/schema.sql` in the SQL editor
2. **Cloudflare Stream** — or substitute with [Mux](https://mux.com)
   for video delivery
3. **Firebase** — Create a project for push notifications
4. **Perspective API** — Server-side only, for comment moderation

---

## Moderation System

Vybe uses a 5-layer moderation pipeline:

```text
User submits content
↓
Layer 1: On-device ML pre-screen (nudity, violence)
↓
Layer 2: Server AI (video + speech-to-text + caption analysis)
↓
Layer 3: Auto-approve / Flag for human review / Auto-reject
↓
Layer 4: Community reports (3 reports → auto-hide pending review)
↓
Layer 5: Strike system (warn → voting ban → submission ban)
```

Comments are filtered in real-time via Perspective API before
display. Blocked comments are silently dropped with a soft nudge
to the user. No shaming. No harsh error messages.

---

## Database Schema

The Supabase schema is in `supabase/schema.sql`. Tables:

- `users` — Creator profiles and account data
- `challenges` — Weekly challenge definitions
- `entries` — Submitted video entries
- `votes` — One vote per user per entry (unique constraint)
- `comments` — Moderated comment threads
- `reactions` — Emoji reactions on entries
- `notifications` — Per-user notification feed
- `follows` — Creator follow relationships
- `strikes` — Moderation strike records

Row Level Security is enabled on all tables.

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

## Scripts

```bash
npm start              # Start Expo development server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run type-check     # Run TypeScript compiler check
npm run lint           # Run ESLint
npm test               # Run Jest test suite
npm run build:ios      # EAS build for iOS
npm run build:android  # EAS build for Android
```

---

## Contributing

This project is a competition submission. For the competition
period, contributions are from the core team only.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built with ❤️ for the Coverstar Clone Challenge
</div>
