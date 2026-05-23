-- LARPN FAQ schema
-- Run this in the Supabase SQL editor (Project → SQL → New query).
-- Then copy NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY into .env.local.
--
-- Safe to re-run: every statement is idempotent (`create ... if not exists`,
-- `drop ... if exists` before recreate, `alter ... add constraint if not exists`
-- via DO-block guards).

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

-- ── Spam hardening: length CHECK constraints ─────────────────────────────
-- DB-level caps so the constraints survive direct API calls that bypass the
-- client-side `maxLength`. 8..400 for the question is the same range the form
-- enforces; submitted_by stays nullable but caps at 60 chars when present.

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'faq_questions_question_len'
  ) then
    alter table faq_questions
      add constraint faq_questions_question_len
      check (char_length(question) between 8 and 400);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'faq_questions_submitted_by_len'
  ) then
    alter table faq_questions
      add constraint faq_questions_submitted_by_len
      check (submitted_by is null or char_length(submitted_by) <= 60);
  end if;
end $$;

-- ── Sanitize Unicode bidi-override + zero-width chars on insert ──────────
-- Mirrors lib/sanitize.ts on the client. A hostile actor calling Supabase
-- directly with the anon key would otherwise be able to slip RLO/ZWJ etc.
-- past the moderator queue, where reviewed text looks innocuous but renders
-- malicious in the public list.

create or replace function strip_unsafe_unicode(input text)
returns text
language plpgsql
immutable
as $$
begin
  if input is null then return null; end if;
  return regexp_replace(
    input,
    -- Explicit codepoint character class so reviewers can see exactly what's stripped:
    --   00AD soft hyphen, 200B-200D zero-width, 202A-202E bidi overrides,
    --   2066-2069 bidi isolates, FEFF BOM.
    '[' ||
      chr(x'00AD'::int) ||
      chr(x'200B'::int) || '-' || chr(x'200D'::int) ||
      chr(x'202A'::int) || '-' || chr(x'202E'::int) ||
      chr(x'2066'::int) || '-' || chr(x'2069'::int) ||
      chr(x'FEFF'::int) ||
    ']',
    '',
    'g'
  );
end $$;

create or replace function faq_questions_sanitize_trigger()
returns trigger
language plpgsql
as $$
begin
  new.question     := strip_unsafe_unicode(new.question);
  new.submitted_by := strip_unsafe_unicode(new.submitted_by);
  return new;
end $$;

drop trigger if exists faq_questions_sanitize on faq_questions;
create trigger faq_questions_sanitize
  before insert or update on faq_questions
  for each row execute function faq_questions_sanitize_trigger();

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
