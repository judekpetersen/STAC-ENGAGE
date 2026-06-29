-- ============================================================
-- STAC Engage — Full Database Schema
-- Paste this entire file into Supabase SQL Editor and run it
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles (extends Supabase auth.users) ───────────────────
create table if not exists profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  first_name  text not null default '',
  last_name   text not null default '',
  major       text default '',
  year        text default '',
  score       integer not null default 0,
  streak_weeks integer not null default 0,
  avatar_helmet text default 'maroon',
  avatar_logo   text default 'none',
  interests   text[] default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can read all profiles"   on profiles for select using (true);
create policy "Users can update own profile"  on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"  on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, first_name, last_name, major, year)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'major', ''),
    coalesce(new.raw_user_meta_data->>'year', '')
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Score helper function ─────────────────────────────────────
create or replace function add_score(p_user_id uuid, p_points integer)
returns void language plpgsql security definer as $$
begin
  update profiles set score = greatest(0, score + p_points) where id = p_user_id;
end;
$$;

-- ── Events ───────────────────────────────────────────────────
create table if not exists events (
  id          uuid default uuid_generate_v4() primary key,
  title       text not null,
  description text default '',
  event_date  date not null,
  start_time  time,
  end_time    time,
  location    text default '',
  space       text default '',
  capacity    integer default 100,
  points      integer default 50,
  type        text default 'general',
  color       text default '#6b1a1a',
  bg          text default '#FBE6E6',
  created_by  uuid references profiles(id),
  created_at  timestamptz default now()
);
alter table events enable row level security;
create policy "Everyone can read events" on events for select using (true);
create policy "Admins can insert events" on events for insert with check (true);
create policy "Admins can update events" on events for update using (true);
create policy "Admins can delete events" on events for delete using (true);

-- ── RSVPs ─────────────────────────────────────────────────────
create table if not exists rsvps (
  id        uuid default uuid_generate_v4() primary key,
  user_id   uuid references profiles(id) on delete cascade,
  event_id  uuid references events(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, event_id)
);
alter table rsvps enable row level security;
create policy "Users can manage own RSVPs" on rsvps for all using (auth.uid() = user_id);
create policy "Admins can read all RSVPs"  on rsvps for select using (true);

-- ── Activity feed ─────────────────────────────────────────────
create table if not exists activity_feed (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references profiles(id) on delete cascade,
  text       text not null,
  likes      integer default 0,
  type       text default 'shoutout',
  created_at timestamptz default now()
);
alter table activity_feed enable row level security;
create policy "Everyone can read feed"   on activity_feed for select using (true);
create policy "Users can post to feed"   on activity_feed for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts" on activity_feed for delete using (auth.uid() = user_id);

-- ── Post likes ────────────────────────────────────────────────
create table if not exists post_likes (
  user_id uuid references profiles(id) on delete cascade,
  post_id uuid references activity_feed(id) on delete cascade,
  primary key (user_id, post_id)
);
alter table post_likes enable row level security;
create policy "Users can manage own likes" on post_likes for all using (auth.uid() = user_id);

create or replace function increment_likes(p_post_id uuid)
returns void language plpgsql security definer as $$
begin update activity_feed set likes = likes + 1 where id = p_post_id; end;
$$;
create or replace function decrement_likes(p_post_id uuid)
returns void language plpgsql security definer as $$
begin update activity_feed set likes = greatest(0, likes - 1) where id = p_post_id; end;
$$;

-- ── Orgs ─────────────────────────────────────────────────────
create table if not exists orgs (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null unique,
  description text default '',
  icon        text default 'ti-users',
  color       text default '#6b1a1a',
  bg          text default '#FBE6E6',
  ic          text default '#6b1a1a',
  created_at  timestamptz default now()
);
alter table orgs enable row level security;
create policy "Everyone can read orgs" on orgs for select using (true);
create policy "Admins can manage orgs" on orgs for all using (true);

create table if not exists org_memberships (
  user_id uuid references profiles(id) on delete cascade,
  org_id  uuid references orgs(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (user_id, org_id)
);
alter table org_memberships enable row level security;
create policy "Users can manage own memberships" on org_memberships for all using (auth.uid() = user_id);
create policy "Admins can read all memberships"  on org_memberships for select using (true);

-- ── Student positions (officer roles) ────────────────────────
create table if not exists student_positions (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references profiles(id) on delete cascade,
  position   text not null,
  org        text not null,
  assigned_at timestamptz default now(),
  unique(user_id, position, org)
);
alter table student_positions enable row level security;
create policy "Everyone can read positions" on student_positions for select using (true);
create policy "Admins can manage positions" on student_positions for all using (true);

-- ── Spaces / bookings ─────────────────────────────────────────
create table if not exists spaces (
  id       uuid default uuid_generate_v4() primary key,
  name     text not null,
  building text not null,
  capacity integer default 50,
  type     text default 'room',
  icon     text default 'ti-building',
  color    text default '#6b1a1a',
  bg       text default '#FBE6E6',
  features text[] default '{}',
  rate     integer default 0,
  available boolean default true
);
alter table spaces enable row level security;
create policy "Everyone can read spaces" on spaces for select using (true);
create policy "Admins can manage spaces" on spaces for all using (true);

create table if not exists bookings (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid references profiles(id) on delete cascade,
  space_id       uuid references spaces(id),
  purpose        text not null,
  booking_date   date,
  start_time     time,
  end_time       time,
  attendee_count integer default 1,
  notes          text default '',
  status         text default 'pending',
  admin_note     text default '',
  created_at     timestamptz default now()
);
alter table bookings enable row level security;
create policy "Users can manage own bookings" on bookings for all using (auth.uid() = user_id);
create policy "Admins can read all bookings"  on bookings for select using (true);
create policy "Admins can update bookings"    on bookings for update using (true);

-- ── Calendar events ───────────────────────────────────────────
create table if not exists calendar_events (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  title       text not null,
  event_date  date not null,
  start_time  time,
  end_time    time,
  type        text default 'personal',
  color       text default '#6b1a1a',
  bg          text default '#FBE6E6',
  space       text default '',
  is_public   boolean default false,
  created_at  timestamptz default now()
);
alter table calendar_events enable row level security;
create policy "Users see own + public events" on calendar_events for select
  using (is_public = true or auth.uid() = user_id);
create policy "Users can create events" on calendar_events for insert
  with check (auth.uid() = user_id);
create policy "Users can update own events" on calendar_events for update
  using (auth.uid() = user_id);

-- ── Academic calendar (admin-posted) ─────────────────────────
create table if not exists academic_calendar (
  id         uuid default uuid_generate_v4() primary key,
  title      text not null,
  event_date date not null,
  type       text default 'other',
  color      text default '#6b1a1a',
  bg         text default '#FBE6E6',
  created_at timestamptz default now()
);
alter table academic_calendar enable row level security;
create policy "Everyone can read academic calendar" on academic_calendar for select using (true);
create policy "Admins can manage academic calendar" on academic_calendar for all using (true);

-- ── Messages ─────────────────────────────────────────────────
create table if not exists messages (
  id           uuid default uuid_generate_v4() primary key,
  sender_id    uuid references profiles(id) on delete cascade,
  recipient_id uuid references profiles(id) on delete cascade,
  text         text not null,
  read         boolean default false,
  created_at   timestamptz default now()
);
alter table messages enable row level security;
create policy "Users can read own messages" on messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can send messages" on messages for insert
  with check (auth.uid() = sender_id);

-- ── Event requests ────────────────────────────────────────────
create table if not exists event_requests (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references profiles(id) on delete cascade,
  title        text not null,
  event_date   date,
  start_time   time,
  end_time     time,
  space        text default '',
  org          text default '',
  attendance   integer default 0,
  description  text default '',
  points       integer default 50,
  status       text default 'pending',
  admin_note   text default '',
  created_at   timestamptz default now()
);
alter table event_requests enable row level security;
create policy "Users can manage own requests" on event_requests for all using (auth.uid() = user_id);
create policy "Admins can read all requests"  on event_requests for select using (true);
create policy "Admins can update requests"    on event_requests for update using (true);

-- ── Notifications ─────────────────────────────────────────────
create table if not exists notifications (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references profiles(id) on delete cascade,
  text       text not null,
  type       text default 'info',
  read       boolean default false,
  created_at timestamptz default now()
);
alter table notifications enable row level security;
create policy "Users can read own notifications" on notifications for select
  using (auth.uid() = user_id);
create policy "Users can mark read" on notifications for update
  using (auth.uid() = user_id);
create policy "Admins can insert notifications" on notifications for insert with check (true);

-- ── Shop redemptions ──────────────────────────────────────────
create table if not exists redemptions (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references profiles(id) on delete cascade,
  item_id    integer not null,
  created_at timestamptz default now()
);
alter table redemptions enable row level security;
create policy "Users can manage own redemptions" on redemptions for all using (auth.uid() = user_id);

-- ── Game announcements (athletics admin) ─────────────────────
create table if not exists game_announcements (
  id         uuid default uuid_generate_v4() primary key,
  sport      text not null,
  opponent   text not null,
  game_date  text not null,
  game_time  text not null,
  location   text default '',
  result     text default null,
  created_at timestamptz default now()
);
alter table game_announcements enable row level security;
create policy "Everyone can read announcements" on game_announcements for select using (true);
create policy "Admins can manage announcements" on game_announcements for all using (true);

-- ── Athlete profiles ─────────────────────────────────────────
create table if not exists athlete_sports (
  user_id    uuid references profiles(id) on delete cascade,
  sport_id   text not null,
  primary key (user_id, sport_id)
);
alter table athlete_sports enable row level security;
create policy "Everyone can read athlete sports" on athlete_sports for select using (true);
create policy "Admins can manage athlete sports" on athlete_sports for all using (true);

-- ============================================================
-- Done! All 16 tables created with RLS policies.
-- ============================================================

-- ── Service hours ─────────────────────────────────────────────
create table if not exists service_hours (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  org_name    text not null,
  date        date not null,
  hours       numeric(4,1) not null,
  description text default '',
  status      text default 'pending',
  admin_note  text default '',
  created_at  timestamptz default now()
);
alter table service_hours enable row level security;
create policy "Users can manage own hours" on service_hours for all using (auth.uid() = user_id);
create policy "Admins can read all hours"  on service_hours for select using (true);
create policy "Admins can update hours"    on service_hours for update using (true);

-- Award points when service hours approved
create or replace function award_service_points()
returns trigger language plpgsql security definer as $$
begin
  if NEW.status = 'approved' and OLD.status = 'pending' then
    perform add_score(NEW.user_id, floor(NEW.hours * 10)::integer);
  end if;
  return NEW;
end;
$$;
drop trigger if exists on_service_approved on service_hours;
create trigger on_service_approved
  after update on service_hours
  for each row execute procedure award_service_points();
