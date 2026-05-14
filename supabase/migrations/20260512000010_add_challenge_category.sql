-- ─────────────────────────────────────────────────────────────────────────────
-- Add category column to challenges + seed diverse active challenges
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.challenges
  add column if not exists category text not null default 'general';

-- Fix the 5 seed challenges from migration 000003 that were inserted before
-- this column existed (they all defaulted to 'general').
update public.challenges set category = 'music'  where id = 'c1111111-1111-1111-1111-111111111111';
update public.challenges set category = 'dance'  where id = 'c2222222-2222-2222-2222-222222222222';
update public.challenges set category = 'art'    where id = 'c3333333-3333-3333-3333-333333333333';
update public.challenges set category = 'comedy' where id = 'c4444444-4444-4444-4444-444444444444';
update public.challenges set category = 'cooking' where id = 'c5555555-5555-5555-5555-555555555555';

-- Seed additional active challenges across every remaining category so the
-- Discover feed has content to personalise against user interests.

insert into public.challenges (title, description, category, status, ends_at) values
  ('Acoustic Covers',
   'Cover any song acoustically — guitar, piano, ukulele, or just your voice. Originality wins!',
   'music', 'active', now() + interval '5 days'),

  ('Best Dance Moves',
   'Show us your sickest choreography or freestyle dance. Any genre, any style — just bring the energy!',
   'dance', 'active', now() + interval '5 days'),

  ('Stand-Up Minute',
   'You have 60 seconds to make us laugh. Original comedy bits only — no recycled jokes!',
   'comedy', 'active', now() + interval '6 days'),

  ('Sketch & Paint',
   'Speed-draw, paint, or digitally illustrate something that wows. Time-lapses welcome!',
   'art', 'active', now() + interval '4 days'),

  ('Trick Shot Kings',
   'Pull off the most impressive trick shot you can — basketball, pool, bottle flips, you name it.',
   'sports', 'active', now() + interval '7 days'),

  ('Recipe in 30',
   'Cook or bake something delicious in 30 seconds or less (sped-up is fine). Show us the final plate!',
   'cooking', 'active', now() + interval '3 days'),

  ('OOTD Showcase',
   'Show off your outfit of the day. Style, confidence, and creativity are what count.',
   'fashion', 'active', now() + interval '6 days'),

  ('Pet Tricks',
   'Train your pet to do something adorable or impressive and film it. Cuteness overload encouraged!',
   'pets', 'active', now() + interval '5 days'),

  ('Home Workout Challenge',
   'Share your most intense or creative home workout routine. No gym? No problem!',
   'fitness', 'active', now() + interval '4 days'),

  ('Epic Gaming Moments',
   'Capture your most clutch play, funniest glitch, or speedrun highlight. Any game, any platform!',
   'gaming', 'active', now() + interval '6 days'),

  ('DIY Life Hacks',
   'Build, fix, or create something useful from everyday items. The more creative, the better!',
   'diy', 'active', now() + interval '5 days'),

  ('Hidden Gem Spots',
   'Show us a hidden gem in your city or town — a café, trail, rooftop, or anywhere worth visiting.',
   'travel', 'active', now() + interval '7 days')
on conflict do nothing;
