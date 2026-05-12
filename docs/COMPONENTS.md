# Vybe — Reusable Components

## VideoCard
Props: entry (Entry), isActive (bool), onVote, onComment, onShare, onCreatorPress
- Full screen width and height
- Video player (react-native-video)
- Auto-play when isActive=true, pause when false
- Overlay layout (see HomeScreen design)
- Vote button with animation (fire burst using Lottie or Reanimated)
- Double-tap gesture → vote
- Loading state: blurred thumbnail behind activity indicator

## EntryCard (list variant)
Props: entry (Entry), onPress, showChallengeName (bool)
- Horizontal layout: thumbnail (16:9, 90px wide) | content
- Content: creator name, challenge, caption (1 line truncated), vote count + fire icon
- Status badge overlay on thumbnail if own entry

## ChallengeCard
Props: challenge (Challenge), onPress
- Cover image (full width, 160px height)
- Gradient overlay bottom
- Title, category chip, countdown, entry count
- "Enter" button

## WinnerCard
Props: entry (Entry), weekNumber, challengeTitle
- Crown icon top right
- Thumbnail background
- Winner's name, challenge, votes, week

## LeaderboardRow
Props: rank, entry (Entry), isCurrentUser (bool)
- Rank number (gold/silver/bronze for 1-3, else plain)
- Avatar (40px)
- Name + handle
- Challenge name
- Vote count
- Thumbnail (40px)
- Highlighted background if isCurrentUser

## CommentBubble
Props: comment (Comment), onLike, onReply, isPinned
- Avatar, handle, text, time
- Pin icon if pinned
- Like button
- Reply button
- Replies list (collapsed by default)

## CreatorAvatar
Props: user (User), size, showVerified, onPress
- Circular image
- Fallback: gradient circle with initials
- Crown overlay if recent winner
- Size variants: sm (32), md (44), lg (64), xl (80)

## VybeScoreBadge
Props: score (number)
- Color-coded tier badge
- Score number + tier label
- Tiers: New Vybe (gray) / Rising Star (teal) / Hot Vybe (purple) / Vybe Legend (gradient)

## BadgeItem
Props: badge (Badge)
- Icon, label, earned date tooltip
- Badge types: weekly_winner, top_3, top_10, first_entry, streak_5, streak_10, viral (500 votes)

## CountdownTimer
Props: endDate (timestamp), onExpire
- Format: "Xd Xh Xm" or "Xh Xm Xs" when under 24hrs
- Color: normal (white), urgent (amber, <24hrs), critical (red, <1hr)
- Updates every second

## PositivityToast
- Appears when comment blocked
- "Keep it positive! 🌟" message
- Soft slide-in from bottom
- Auto-dismisses after 2 seconds
- Never shows what was wrong or what the filter caught

## FilterThumbnail
Props: filter (string), videoUri, isSelected, onSelect
- Small video preview with filter applied
- Selected: purple border + checkmark

## ProgressRing
Props: progress (0-1), size, strokeWidth, color
- SVG-based circular progress
- Used in recording screen and upload screen

## GradientButton
Props: label, onPress, loading, disabled, size (sm/md/lg/full)
- Purple → pink gradient
- Loading: spinner replaces label
- Disabled: reduced opacity
- Full width option

## CategoryChip
Props: category, selected, onPress, size (sm/md)
- Icon + label
- Selected: filled background, unselected: outline

## SkeletonLoader
Props: width, height, borderRadius
- Animated shimmer effect
- Used to build skeleton layouts for all list screens

## VideoThumbnail
Props: uri, width, height, voteCount, status
- Image with vote count overlay (bottom right)
- Status badge overlay if applicable
- Press → VideoPlayerScreen

## CoinsBadge
Props: amount
- Coin icon + formatted number
- Used in profile header

## EmptyState
Props: icon, title, message, ctaLabel, onCta
- Centered illustration (icon), title, message, optional CTA button
- Used on empty feed, empty notifications, etc.

## ErrorState
Props: message, onRetry
- Error icon, message, "Try Again" button

## ConfettiOverlay
- Full screen confetti on winner reveal
- Uses react-native-confetti-cannon
- Auto-stops after 4 seconds

## PlatformKeyboardAvoidingView
- Wrapper using KeyboardAvoidingView with correct behavior per platform
- Used in comment input, caption screen

## SwipeableVideoContainer
- Wraps VideoCard
- Handles swipe-down-to-dismiss gesture
- Animates back to feed on dismiss