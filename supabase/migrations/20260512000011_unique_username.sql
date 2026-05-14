-- ─────────────────────────────────────────────────────────────────────────────
-- Enforce unique usernames (only for non-empty values, since new
-- signups start with an empty string until onboarding completes).
-- ─────────────────────────────────────────────────────────────────────────────

create unique index if not exists users_username_unique
  on public.users (username)
  where username <> '';
