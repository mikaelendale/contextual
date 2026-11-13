-- Agent feedback: one row per report a person reviewed and sent from
-- /agent/feedback. No IP addresses, no account, nothing about the sender.
-- Every limit here matches site/lib/feedback/report.ts, so the database
-- refuses what the server would have refused.
-- Run once: psql "$DATABASE_URL" -f site/db/migrations/0001_agent_feedback.sql

create table if not exists agent_feedback (
  id                  bigint generated always as identity primary key,
  created_at          timestamptz not null default now(),

  -- From the agent, reviewed and possibly edited by the person
  harness             text not null check (harness in ('claude-code', 'codex', 'opencode', 'antigravity', 'other')),
  model               text not null check (char_length(model) between 1 and 64),
  skill               text not null check (skill in ('setup', 'next', 'sync', 'none')),
  category            text not null check (category in ('conflicting-rules', 'unclear-skill-step', 'check-false-alarm', 'check-miss', 'hook-friction', 'template-gap', 'token-cost', 'structure-preference')),
  severity            text not null check (severity in ('blocked', 'worked-around', 'annoyance', 'idea')),
  happened            text not null check (char_length(happened) between 1 and 600),
  expected            text not null check (char_length(expected) between 1 and 600),
  suggestion          text not null default '' check (char_length(suggestion) <= 600),
  file                text not null default '' check (char_length(file) <= 120),

  -- Added by the CLI
  contextual_version  text not null check (char_length(contextual_version) <= 32),
  os                  text not null check (os in ('linux', 'macos', 'windows', 'other')),
  package_manager     text not null check (package_manager in ('npm', 'pnpm', 'yarn', 'bun', 'none')),
  harness_folders     text[] not null default '{}' check (harness_folders <@ array['.agents', '.agent', '.claude', '.codex', '.opencode']::text[]),
  check_errors        integer check (check_errors between 0 and 100000),
  check_warnings      integer check (check_warnings between 0 and 100000),
  feature_count       text not null check (feature_count in ('none', '1-5', '6-20', '21+'))
);

create index if not exists agent_feedback_created_at on agent_feedback (created_at desc);
