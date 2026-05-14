-- ─────────────────────────────────────────────────────────────────────────────
-- Seed data: demo users, challenges, entries, votes, and comments
-- Makes all 5 tabs feel like a real, active social app
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Demo Users ───────────────────────────────────────────────────────────────
-- These are "virtual" users for demo content. They reference auth.users,
-- so we create them in auth first, then in public.users.

-- Insert into auth.users (needed for FK constraints)
-- Password hash is bcrypt of 'demo123456'
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
values
  ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maya@demo.vybe', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kai@demo.vybe', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'zara@demo.vybe', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'leon@demo.vybe', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nina@demo.vybe', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{}'),
  ('a6666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ravi@demo.vybe', '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', now(), now(), now(), '', '{"provider":"email","providers":["email"]}', '{}')
on conflict (id) do nothing;

-- Insert public user profiles
insert into public.users (id, username, full_name, avatar_url, bio, categories, vybe_score)
values
  ('a1111111-1111-1111-1111-111111111111', 'mayavibes', 'Maya Chen', 'https://i.pravatar.cc/300?u=maya', '🎤 Singer & songwriter | NYC vibes', '{music,dance}', 2450),
  ('a2222222-2222-2222-2222-222222222222', 'kaibeats', 'Kai Thompson', 'https://i.pravatar.cc/300?u=kai', '🥁 Beatboxer & producer | LA', '{music,comedy}', 1890),
  ('a3333333-3333-3333-3333-333333333333', 'zaradance', 'Zara Williams', 'https://i.pravatar.cc/300?u=zara', '💃 Contemporary dancer | Chicago', '{dance,fitness}', 3100),
  ('a4444444-4444-4444-4444-444444444444', 'leonarts', 'Leon Park', 'https://i.pravatar.cc/300?u=leon', '🎨 Digital artist & animator', '{art,gaming}', 1560),
  ('a5555555-5555-5555-5555-555555555555', 'ninacooks', 'Nina Rodriguez', 'https://i.pravatar.cc/300?u=nina', '🍳 Chef & food stylist | Miami', '{cooking,travel}', 2780),
  ('a6666666-6666-6666-6666-666666666666', 'ravifitness', 'Ravi Sharma', 'https://i.pravatar.cc/300?u=ravi', '💪 Fitness coach & motivator', '{fitness,sports}', 2100)
on conflict (id) do nothing;

-- ── Challenges ───────────────────────────────────────────────────────────────

-- Clear the default challenge if it exists and insert fresh ones
delete from public.challenges where title = 'Acoustic Covers';

insert into public.challenges (id, title, description, status, ends_at, created_at)
values
  ('c1111111-1111-1111-1111-111111111111', '🎤 Acoustic Covers', 'Show us your best acoustic cover of any trending song. Creativity and vibes matter most!', 'active', now() + interval '5 days', now() - interval '2 days'),
  ('c2222222-2222-2222-2222-222222222222', '💃 Dance Battle', 'Hit us with your best 30-second dance routine. Any style, any song — just bring the energy!', 'active', now() + interval '3 days', now() - interval '4 days'),
  ('c3333333-3333-3333-3333-333333333333', '🎨 Art in 60 Seconds', 'Create a speed-art video — painting, digital art, or sketching. Show your process!', 'active', now() + interval '6 days', now() - interval '1 day'),
  ('c4444444-4444-4444-4444-444444444444', '😂 Make Us Laugh', 'Your funniest skit, impression, or standup bit. Keep it clean, keep it hilarious!', 'completed', now() - interval '1 day', now() - interval '8 days'),
  ('c5555555-5555-5555-5555-555555555555', '🍳 Quick Recipe', 'Cook something delicious in under 60 seconds. Fast food, elevated!', 'upcoming', now() + interval '10 days', now())
on conflict (id) do nothing;

-- ── Entries (with real public video URLs) ────────────────────────────────────
-- Using royalty-free sample videos from various CDNs

insert into public.entries (id, challenge_id, user_id, video_url, thumbnail_url, caption, vote_count, status, music_track, created_at)
values
  -- Acoustic Covers challenge entries
  ('e1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
   'https://i.pravatar.cc/400?u=thumb1',
   'My acoustic take on "Flowers" 🌸 What do you think?', 342, 'live', 'Flowers - Acoustic', now() - interval '1 day'),

  ('e2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
   'https://i.pravatar.cc/400?u=thumb2',
   'Beatbox + guitar = magic 🎸🥁', 287, 'live', 'Original Beat', now() - interval '18 hours'),

  ('e3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'a5555555-5555-5555-5555-555555555555',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
   'https://i.pravatar.cc/400?u=thumb3',
   'Kitchen cover session while making pasta 🍝🎵', 198, 'live', 'Kitchen Vibes', now() - interval '12 hours'),

  -- Dance Battle challenge entries
  ('e4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
   'https://i.pravatar.cc/400?u=thumb4',
   'Contemporary meets hip-hop 💫 This one hits different', 456, 'live', 'Levitating - Dua Lipa', now() - interval '3 days'),

  ('e5555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222', 'a6666666-6666-6666-6666-666666666666',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
   'https://i.pravatar.cc/400?u=thumb5',
   'When the beat drops at the gym 💪🔥', 312, 'live', 'Gym Anthem', now() - interval '2 days'),

  ('e6666666-6666-6666-6666-666666666666', 'c2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
   'https://i.pravatar.cc/400?u=thumb6',
   'Freestyle Friday vibes 🕺', 178, 'live', 'Freestyle Beat', now() - interval '1 day'),

  -- Art challenge entries
  ('e7777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
   'https://i.pravatar.cc/400?u=thumb7',
   'Speed painting a sunset cityscape 🌆🎨', 234, 'live', 'Lo-fi Beats', now() - interval '6 hours'),

  ('e8888888-8888-8888-8888-888888888888', 'c3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
   'https://i.pravatar.cc/400?u=thumb8',
   'Digital portrait in Procreate ✏️ Who should I draw next?', 156, 'live', 'Chill Vibes', now() - interval '3 hours'),

  -- Completed challenge (Make Us Laugh) - has a winner
  ('e9999999-9999-9999-9999-999999999999', 'c4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
   'https://i.pravatar.cc/400?u=thumb9',
   'When your code compiles on the first try 😂💻', 523, 'winner', 'Comedy Gold', now() - interval '5 days'),

  ('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c4444444-4444-4444-4444-444444444444', 'a5555555-5555-5555-5555-555555555555',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
   'https://i.pravatar.cc/400?u=thumb10',
   'Cooking fails compilation 🍳😅 Don''t try this at home', 410, 'live', 'Fail Sound', now() - interval '6 days')
on conflict (id) do nothing;

-- ── Comments ─────────────────────────────────────────────────────────────────

insert into public.comments (id, entry_id, user_id, content, positivity_score)
values
  (gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'Your voice is incredible! 😍', 0.95),
  (gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', 'This gave me chills 🔥', 0.9),
  (gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'a6666666-6666-6666-6666-666666666666', 'Love the acoustic arrangement!', 0.85),
  (gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Beatbox skills are insane 🤯', 0.92),
  (gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', 'How do you even do that?! Amazing!', 0.88),
  (gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 'The way you move is art 💫', 0.93),
  (gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', 'Teach me those moves!! 🙏', 0.87),
  (gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'a6666666-6666-6666-6666-666666666666', 'Best dance entry so far 🏆', 0.91),
  (gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'a3333333-3333-3333-3333-333333333333', 'Gym + dance = ultimate combo 💪🕺', 0.86),
  (gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', 'This is so satisfying to watch 😌', 0.94),
  (gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'a3333333-3333-3333-3333-333333333333', 'The colors!! 🎨✨', 0.89),
  (gen_random_uuid(), 'e9999999-9999-9999-9999-999999999999', 'a1111111-1111-1111-1111-111111111111', 'I''m CRYING 😂😂😂', 0.96),
  (gen_random_uuid(), 'e9999999-9999-9999-9999-999999999999', 'a3333333-3333-3333-3333-333333333333', 'This is TOO relatable 💀', 0.88),
  (gen_random_uuid(), 'e9999999-9999-9999-9999-999999999999', 'a4444444-4444-4444-4444-444444444444', 'Deserved winner for sure! 👑', 0.92),
  (gen_random_uuid(), 'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a2222222-2222-2222-2222-222222222222', 'The egg flip fail 💀😂', 0.85)
on conflict (id) do nothing;

-- ── Votes ────────────────────────────────────────────────────────────────────
-- Add some cross-voting between users to make leaderboard rankings feel real

insert into public.votes (entry_id, user_id)
values
  ('e1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222'),
  ('e1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333'),
  ('e1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444'),
  ('e2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111'),
  ('e2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333'),
  ('e4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111'),
  ('e4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222'),
  ('e4444444-4444-4444-4444-444444444444', 'a5555555-5555-5555-5555-555555555555'),
  ('e4444444-4444-4444-4444-444444444444', 'a6666666-6666-6666-6666-666666666666'),
  ('e5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111'),
  ('e5555555-5555-5555-5555-555555555555', 'a3333333-3333-3333-3333-333333333333'),
  ('e7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111'),
  ('e7777777-7777-7777-7777-777777777777', 'a2222222-2222-2222-2222-222222222222'),
  ('e9999999-9999-9999-9999-999999999999', 'a1111111-1111-1111-1111-111111111111'),
  ('e9999999-9999-9999-9999-999999999999', 'a3333333-3333-3333-3333-333333333333'),
  ('e9999999-9999-9999-9999-999999999999', 'a4444444-4444-4444-4444-444444444444'),
  ('e9999999-9999-9999-9999-999999999999', 'a5555555-5555-5555-5555-555555555555'),
  ('e9999999-9999-9999-9999-999999999999', 'a6666666-6666-6666-6666-666666666666'),
  ('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1111111-1111-1111-1111-111111111111'),
  ('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a3333333-3333-3333-3333-333333333333')
on conflict (entry_id, user_id) do nothing;
