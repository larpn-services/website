-- LARPN FAQ schema
-- Run this in the Supabase SQL editor (Project → SQL → New query).
-- Then copy NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY into .env.local.

create table if not exists faq_questions (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text,
  category      text not null default 'user-submitted',
  status        text not null default 'pending', -- pending | approved | rejected | removed
  like_count    integer not null default 0,
  submitted_by  text,                            -- optional display name
  created_at    timestamptz not null default now()
);

-- Useful indexes
create index if not exists faq_questions_status_idx       on faq_questions (status);
create index if not exists faq_questions_status_likes_idx on faq_questions (status, like_count desc);

-- Row Level Security
alter table faq_questions enable row level security;

-- Anyone (even unauthenticated) may read approved questions
drop policy if exists "Public can read approved" on faq_questions;
create policy "Public can read approved"
  on faq_questions for select
  using (status = 'approved');

-- Anyone may submit a new question, but only with status = 'pending'.
-- This guarantees moderation: nothing ever goes live without your approval.
drop policy if exists "Public can submit pending" on faq_questions;
create policy "Public can submit pending"
  on faq_questions for insert
  with check (status = 'pending');

-- Updates / deletes are NOT granted to anon — moderation happens via the
-- Supabase Studio (or a future admin route using the service role key).

-- ── Like counter ──────────────────────────────────────────────────────────
-- Anonymous like increments via a SECURITY DEFINER function. The function
-- only mutates rows that are already approved, so it can't be used to bump
-- pending/rejected ones into visibility.

create or replace function increment_faq_like(qid uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare new_count integer;
begin
  update faq_questions
     set like_count = like_count + 1
   where id = qid and status = 'approved'
  returning like_count into new_count;
  return coalesce(new_count, -1);
end;
$$;

grant execute on function increment_faq_like(uuid) to anon, authenticated;
