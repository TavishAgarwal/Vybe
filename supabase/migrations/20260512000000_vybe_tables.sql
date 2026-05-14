-- ─────────────────────────────────────────────────────────────────────────────
-- Vybe social platform tables
-- Creates: users, challenges, entries, votes, comments, reports
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Users (public profile for Vybe) ──────────────────────────────────────────
-- This is separate from the generic 'profiles' table; it holds Vybe-specific fields.

create table if not exists public.users (
  id            uuid        primary key references auth.users(id) on delete cascade,
  username      text        not null default '',
  full_name     text,
  avatar_url    text,
  bio           text,
  categories    text[]      default '{}',
  vybe_score    integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users are publicly readable" on public.users
  for select using (true);

create policy "Users can update own record" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own record" on public.users
  for insert with check (auth.uid() = id);

-- Auto-create Vybe user row on auth signup
create or replace function public.handle_new_vybe_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_vybe
  after insert on auth.users
  for each row execute procedure public.handle_new_vybe_user();

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.set_updated_at();

-- ── Challenges ───────────────────────────────────────────────────────────────

create table if not exists public.challenges (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,
  description   text        not null default '',
  status        text        not null default 'active',
  ends_at       timestamptz not null default (now() + interval '7 days'),
  created_at    timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "Challenges are publicly readable" on public.challenges
  for select using (true);

-- ── Entries ──────────────────────────────────────────────────────────────────

create table if not exists public.entries (
  id             uuid        primary key default gen_random_uuid(),
  challenge_id   uuid        not null references public.challenges(id) on delete cascade,
  user_id        uuid        not null references auth.users(id) on delete cascade,
  video_url      text        not null,
  thumbnail_url  text        not null default '',
  caption        text        not null default '',
  vote_count     integer     not null default 0,
  status         text        not null default 'pending_review',
  music_track    text,
  created_at     timestamptz not null default now()
);

alter table public.entries enable row level security;

create policy "Entries are publicly readable" on public.entries
  for select using (true);

create policy "Users can insert own entries" on public.entries
  for insert with check (auth.uid() = user_id);

create policy "Users can update own entries" on public.entries
  for update using (auth.uid() = user_id);

-- ── Votes ────────────────────────────────────────────────────────────────────

create table if not exists public.votes (
  id         uuid        primary key default gen_random_uuid(),
  entry_id   uuid        not null references public.entries(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (entry_id, user_id)
);

alter table public.votes enable row level security;

create policy "Votes are publicly readable" on public.votes
  for select using (true);

create policy "Users can insert own votes" on public.votes
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own votes" on public.votes
  for delete using (auth.uid() = user_id);

-- ── Comments ─────────────────────────────────────────────────────────────────

create table if not exists public.comments (
  id               uuid        primary key default gen_random_uuid(),
  entry_id         uuid        not null references public.entries(id) on delete cascade,
  user_id          uuid        not null references auth.users(id) on delete cascade,
  content          text        not null,
  positivity_score numeric     not null default 1.0,
  created_at       timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Comments are publicly readable" on public.comments
  for select using (true);

create policy "Users can insert own comments" on public.comments
  for insert with check (auth.uid() = user_id);

-- ── Reports ──────────────────────────────────────────────────────────────────

create table if not exists public.reports (
  id           uuid        primary key default gen_random_uuid(),
  entry_id     uuid        references public.entries(id) on delete set null,
  comment_id   uuid        references public.comments(id) on delete set null,
  reporter_id  uuid        not null references auth.users(id) on delete cascade,
  reason       text        not null,
  details      text,
  created_at   timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Users can insert own reports" on public.reports
  for insert with check (auth.uid() = reporter_id);

-- ── Seed: default active challenge ───────────────────────────────────────────

insert into public.challenges (title, description, status, ends_at)
values (
  'Acoustic Covers',
  'Show us your best acoustic cover of any trending song. Creativity and vibes matter most!',
  'active',
  now() + interval '7 days'
)
on conflict do nothing;
