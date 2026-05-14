-- ─────────────────────────────────────────────────────────────────────────────
-- RPC functions for atomic vote count updates
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.increment_vote_count(target_entry_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.entries
  set vote_count = vote_count + 1
  where id = target_entry_id;
end;
$$;

create or replace function public.decrement_vote_count(target_entry_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.entries
  set vote_count = greatest(0, vote_count - 1)
  where id = target_entry_id;
end;
$$;
