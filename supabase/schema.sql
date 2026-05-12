-- Vybe security baseline: application tables and Row Level Security policies.
-- Runnable with Supabase SQL editor or psql after auth schema is available.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  full_name text,
  avatar_url text,
  bio text not null default '' check (char_length(bio) <= 160),
  vybe_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete restrict,
  user_id uuid not null references public.users(id) on delete cascade,
  video_url text not null,
  thumbnail_url text,
  caption text not null default '' check (char_length(caption) <= 200),
  status text not null default 'processing' check (status in ('processing', 'live', 'rejected')),
  vote_count integer not null default 0 check (vote_count >= 0),
  music_track text,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (entry_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 500),
  positivity_score numeric not null default 0 check (positivity_score >= 0 and positivity_score <= 1),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.strikes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  entry_id uuid references public.entries(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reason text not null,
  details text not null default '' check (char_length(details) <= 500),
  created_at timestamptz not null default now(),
  check (entry_id is not null or comment_id is not null)
);

alter table public.users enable row level security;
alter table public.entries enable row level security;
alter table public.votes enable row level security;
alter table public.comments enable row level security;
alter table public.notifications enable row level security;
alter table public.strikes enable row level security;
alter table public.follows enable row level security;
alter table public.reports enable row level security;

drop policy if exists "users_select_authenticated" on public.users;
create policy "users_select_authenticated" on public.users
  for select to authenticated using (true);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "entries_select_live" on public.entries;
create policy "entries_select_live" on public.entries
  for select using (status = 'live');

drop policy if exists "entries_insert_own_active_challenge" on public.entries;
create policy "entries_insert_own_active_challenge" on public.entries
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.challenges c
      where c.id = challenge_id and c.status = 'active' and c.ends_at > now()
    )
    and (
      select count(*) from public.strikes s where s.user_id = auth.uid()
    ) < 3
  );

drop policy if exists "votes_select_all" on public.votes;
create policy "votes_select_all" on public.votes
  for select using (true);

drop policy if exists "votes_insert_own_not_self" on public.votes;
create policy "votes_insert_own_not_self" on public.votes
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and not exists (select 1 from public.entries e where e.id = entry_id and e.user_id = auth.uid())
    and (
      select count(*) from public.strikes s where s.user_id = auth.uid()
    ) < 2
  );

drop policy if exists "comments_select_positive" on public.comments;
create policy "comments_select_positive" on public.comments
  for select using (positivity_score > 0.3);

drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own" on public.comments
  for insert to authenticated with check (user_id = auth.uid() and positivity_score > 0.3);

drop policy if exists "comments_pin_by_entry_owner" on public.comments;
create policy "comments_pin_by_entry_owner" on public.comments
  for update to authenticated
  using (
    exists (
      select 1 from public.entries e
      where e.id = comments.entry_id and e.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.entries e
      where e.id = comments.entry_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "notifications_update_own_read" on public.notifications;
create policy "notifications_update_own_read" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "strikes_select_own" on public.strikes;
create policy "strikes_select_own" on public.strikes
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "follows_select_all" on public.follows;
create policy "follows_select_all" on public.follows
  for select using (true);

drop policy if exists "follows_insert_own" on public.follows;
create policy "follows_insert_own" on public.follows
  for insert to authenticated with check (follower_id = auth.uid());

drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own" on public.follows
  for delete to authenticated using (follower_id = auth.uid());

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
  for insert to authenticated with check (reporter_id = auth.uid());

drop policy if exists "reports_select_own" on public.reports;
create policy "reports_select_own" on public.reports
  for select to authenticated using (reporter_id = auth.uid());
