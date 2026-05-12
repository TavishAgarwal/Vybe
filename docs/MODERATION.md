# Vybe — Moderation System Design

## Philosophy
Vybe's moderation is invisible when working correctly. Users should never encounter toxic content, but creators should never feel over-policed. The system favors soft friction over hard blocks, education over punishment, and community empowerment over top-down control.

## The Vybe Positivity Pledge (full text)
"Welcome to Vybe. Before you start creating and competing, we ask you to make one promise to this community:

I will support other creators, not tear them down.
I will leave comments that lift people up.
I will compete with creativity, not cruelty.
I will report content that doesn't belong here.
I will remember there's a real human behind every video.

Vybe is built on the belief that talent shines brightest when it's celebrated. By joining, you agree to our Community Guidelines and commit to keeping this a positive space for everyone."

## Moderation Layers

### Layer 1 — Pre-Upload (Client-Side)
Tool: On-device ML model (TensorFlow Lite or Core ML)
Checks:
- Nudity / explicit content detection
- Violence / gore detection
- Visible hate symbols or text
Action: Block upload before it reaches server, show user-facing error message (vague, non-confrontational: "This content doesn't meet Vybe's guidelines. Try something different!")
Threshold: High confidence only (>0.90) to avoid false positives

### Layer 2 — Server-Side Video Analysis
Tool: Google Cloud Video Intelligence API (or equivalent)
Checks:
- Safe search detection (adult, violence, racy)
- Text detection on screen (offensive text in video)
- Logo / copyright symbol detection (flagged for review, not auto-rejected)
Speech-to-text: Whisper API transcribes audio track
- Transcript run through Perspective API (toxicityScore, severeToxicity, insult, threat)
Caption analysis: Perspective API on caption text
Thresholds:
- Auto-approve: all scores < 0.30
- Human review queue: any score 0.30–0.70
- Auto-reject: any score > 0.70
Entry status during review: "under_review"
Typical processing time: 10–30 seconds

### Layer 3 — Comment Guard (Real-Time)
Tool: Perspective API (toxicity + insult + threat attributes)
Flow:
1. User types comment and hits send
2. Client sends comment text to /comments endpoint
3. Server calls Perspective API synchronously (< 200ms)
4. If toxicityScore > 0.50: comment blocked, 200 response with { blocked: true }
5. Client clears input, shows PositivityToast ("Keep it positive! 🌟")
6. No logging of blocked comment text (privacy-first)
7. If repeat blocking (3 in session): show "Remember the Vybe Pledge" prompt
Filter also checks: ALL_CAPS (shouting), excessive punctuation (aggressiveness signal), word repetition (spam)
Emoji-only comments: allowed (always positive)
Edge case: Very short comments ("nice", "wow", "🔥") bypass heavy filtering

### Layer 4 — Community Reports
Trigger: User taps "Report" on any entry or comment
Threshold: 3 unique reports → entry auto-hidden (status: under_review)
Human mod queue: all reports reviewed within 2 hours during Mon–Sat
Actions available to mods:
- Approve (restore entry, dismiss reports)
- Remove entry + warn user
- Remove entry + strike user
- Remove entry + escalate (potential ban)

### Layer 5 — Strike System
Strike 1: In-app warning notification. Entry removed if applicable. Educational message linking to guidelines.
Strike 2: 48-hour voting ban (can watch and submit but cannot vote). Notification sent.
Strike 3: 7-day challenge suspension (cannot submit entries). Notification sent.
Strike 4+: Account review (manual). Potential permanent ban.
Strike expiry: Strikes older than 90 days do not count toward threshold (but remain in history).
Appeal process: User can appeal within 7 days. Text input → mod team reviews within 24 hrs. One appeal per strike.

### Human Moderation Queue
- Moderation dashboard (admin web app, separate from mobile app)
- Shows: entry thumbnail, video, caption, transcript, AI scores, report reasons
- Mod actions: approve / reject (with reason) / strike
- Rejection reasons (shown to creator):
  - "Caption contains inappropriate language"
  - "Audio content doesn't meet guidelines"
  - "Video content doesn't meet guidelines"
  - "Not relevant to this week's challenge theme"
  - "Suspected spam or duplicate"
- Target SLA: < 2 hours for human-review queue items

## Moderation Transparency
- Users can see their own entry statuses in ModerationStatusScreen
- Rejection reason always provided (category only, not AI score)
- Strike history visible in Settings > Moderation
- Community Guidelines always accessible from Settings
- No public shaming — all moderation is private between user and platform

## Anti-Gaming Measures
- Vote manipulation: one vote per user per entry (server-enforced, not just client)
- Account farming: rate limit on new accounts (1 entry per new account per week until Vybe Score > 50)
- Bot detection: CAPTCHA on signup, anomaly detection on vote bursts
- Duplicate submissions: perceptual hash check on uploaded videos (blocks exact re-uploads)