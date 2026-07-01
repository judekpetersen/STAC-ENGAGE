-- ── Event Feedback ────────────────────────────────────────────
create table if not exists event_feedback (
  id          uuid default uuid_generate_v4() primary key,
  event_id    uuid references events(id) on delete cascade,
  user_id     uuid references profiles(id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  comment     text default '',
  created_at  timestamptz default now(),
  unique(event_id, user_id)
);
alter table event_feedback enable row level security;
create policy "Users can submit own feedback" on event_feedback for insert with check (auth.uid() = user_id);
create policy "Users can read own feedback"   on event_feedback for select using (auth.uid() = user_id);
create policy "Admins can read all feedback"  on event_feedback for select using (true);
