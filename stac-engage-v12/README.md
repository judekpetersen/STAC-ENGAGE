# STAC Engage — Student Portal v3

Production-ready student engagement platform for Saint Thomas Aquinas College.
Clean file-per-tab architecture, fully Supabase-ready.

---

## Project structure

```
stac-engage/
├── index.html                  # Login / signup / onboarding
├── app.html                    # Main app shell
├── css/
│   └── main.css                # Full design system
├── js/
│   ├── supabase-client.js      # ← PLUG IN YOUR KEYS HERE
│   ├── data.js                 # Static seed data (replace with Supabase calls)
│   ├── spaces-data.js          # STAC Venues — 14 spaces + buildings + calendar events
│   ├── state.js                # localStorage state (swappable with Supabase)
│   ├── components.js           # Shared UI component builders + global event handlers
│   ├── auth.js                 # Login, signup, onboarding (Supabase-ready)
│   ├── app-v2.js               # App init, sidebar, tab router
│   └── tabs/
│       ├── dashboard.js        # Home — stats, previews of all sections
│       ├── calendar.js         # Monthly/weekly calendar + schedule form
│       ├── map.js              # SVG campus map + space detail + booking modal
│       ├── events.js           # Event list + RSVP
│       ├── transcript.js       # Co-curricular record + badges + PDF export
│       ├── pathways.js         # Career competency progress
│       ├── leaderboard.js      # Student rankings
│       ├── streaks.js          # Weekly streak + monthly challenges
│       ├── shop.js             # Points redemption store
│       ├── feed.js             # Activity feed + shoutouts
│       ├── orgs.js             # Student org directory + join/leave
│       ├── clubvclub.js        # Club-level engagement leaderboard
│       ├── profile.js          # Student profile + stats
│       └── notifications.js    # In-app notifications
└── netlify.toml
```

---

## Deploy to Netlify

1. Push this folder to a GitHub repo
2. Go to netlify.com → Add new site → Import from Git
3. Set publish directory to `/`
4. Deploy

---

## Wire up Supabase (real auth + live data)

### Step 1 — Create project
- Go to supabase.com → New project
- Copy your Project URL and anon key from Settings → API

### Step 2 — Add keys
Open `js/supabase-client.js` and replace:
```js
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
```
Then uncomment the `createClient` line.

### Step 3 — Add CDN to HTML files
In both `index.html` and `app.html`, add before all other scripts:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-client.js"></script>
```

### Step 4 — Run the SQL schema
Paste the SQL below into your Supabase SQL editor.

### Step 5 — Swap data calls
Every tab file has TODO comments showing exactly which Supabase query replaces the static DATA call.

---

## Database schema

```sql
-- Profiles (auto-created on signup via trigger)
create table profiles (
  id            uuid references auth.users primary key,
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  major         text,
  year          text,
  score         integer default 0,
  streak_weeks  integer default 0,
  interests     text[],
  created_at    timestamptz default now()
);

-- Events
create table events (
  id          serial primary key,
  name        text not null,
  event_date  date not null,
  start_time  time,
  end_time    time,
  type        text,
  location    text,
  space_id    integer references spaces(id),
  points      integer default 0,
  created_by  uuid references profiles(id),
  created_at  timestamptz default now()
);

-- RSVPs
create table rsvps (
  user_id   uuid references profiles(id),
  event_id  integer references events(id),
  created_at timestamptz default now(),
  primary key (user_id, event_id)
);

-- Activity feed
create table activity_feed (
  id          serial primary key,
  user_id     uuid references profiles(id),
  text        text not null,
  likes       integer default 0,
  created_at  timestamptz default now()
);

create table post_likes (
  user_id  uuid references profiles(id),
  post_id  integer references activity_feed(id),
  primary key (user_id, post_id)
);

-- Orgs
create table orgs (
  id    serial primary key,
  name  text not null,
  meta  text,
  icon  text,
  bg    text,
  ic    text
);

create table org_memberships (
  user_id    uuid references profiles(id),
  org_id     integer references orgs(id),
  joined_at  timestamptz default now(),
  primary key (user_id, org_id)
);

-- Challenges
create table challenges (
  id     serial primary key,
  name   text,
  points integer,
  month  text
);

create table challenge_claims (
  user_id      uuid references profiles(id),
  challenge_id integer references challenges(id),
  claimed_at   timestamptz default now(),
  primary key (user_id, challenge_id)
);

-- Shop
create table shop_items (
  id    serial primary key,
  name  text,
  desc  text,
  cost  integer,
  icon  text,
  bg    text,
  ic    text
);

create table redemptions (
  user_id   uuid references profiles(id),
  item_id   integer references shop_items(id),
  redeemed_at timestamptz default now(),
  primary key (user_id, item_id)
);

-- Spaces (from STAC Venues)
create table spaces (
  id         serial primary key,
  name       text,
  building   text,
  capacity   integer,
  type       text,
  features   text[],
  rate       integer default 0,
  available  boolean default true
);

-- Bookings
create table bookings (
  id             serial primary key,
  user_id        uuid references profiles(id),
  space_id       integer references spaces(id),
  name           text,
  event_date     date,
  start_time     time,
  end_time       time,
  attendee_count integer,
  notes          text,
  status         text default 'pending', -- pending | approved | denied
  created_at     timestamptz default now()
);

-- Calendar events (user-created + official)
create table calendar_events (
  id          serial primary key,
  user_id     uuid references profiles(id),
  title       text not null,
  event_date  date not null,
  start_time  time,
  end_time    time,
  type        text,
  space_id    integer references spaces(id),
  public      boolean default false,
  created_at  timestamptz default now()
);

-- Notifications
create table notifications (
  id         serial primary key,
  user_id    uuid references profiles(id),
  text       text,
  icon       text,
  icon_bg    text,
  icon_c     text,
  read       boolean default false,
  created_at timestamptz default now()
);

-- Score helpers
create or replace function add_score(user_id uuid, points integer)
returns void language sql as $$
  update profiles set score = score + points where id = user_id;
$$;

create or replace function increment_likes(post_id integer)
returns void language sql as $$
  update activity_feed set likes = likes + 1 where id = post_id;
$$;

create or replace function decrement_likes(post_id integer)
returns void language sql as $$
  update activity_feed set likes = greatest(likes - 1, 0) where id = post_id;
$$;

-- Club leaderboard view
create or replace function get_club_leaderboard()
returns table(org_id integer, org_name text, total_pts bigint, member_count bigint)
language sql as $$
  select o.id, o.name, coalesce(sum(p.score), 0) as total_pts, count(m.user_id) as member_count
  from orgs o
  left join org_memberships m on o.id = m.org_id
  left join profiles p on m.user_id = p.id
  group by o.id, o.name
  order by total_pts desc;
$$;

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, first_name, last_name, email, major, year)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', 'Student'),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    new.raw_user_meta_data->>'major',
    new.raw_user_meta_data->>'year'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

---

## Row Level Security (RLS)

Enable RLS on all tables and add these policies:

```sql
-- profiles: users can read all, write only own
alter table profiles enable row level security;
create policy "Public profiles" on profiles for select using (true);
create policy "Own profile" on profiles for update using (auth.uid() = id);

-- rsvps, claims, redemptions, memberships: own rows only
alter table rsvps enable row level security;
create policy "Own RSVPs" on rsvps using (auth.uid() = user_id);

-- bookings: own rows, admins see all (set admin role in profiles)
alter table bookings enable row level security;
create policy "Own bookings" on bookings using (auth.uid() = user_id);

-- notifications: own only
alter table notifications enable row level security;
create policy "Own notifications" on notifications using (auth.uid() = user_id);

-- activity_feed: everyone reads, authenticated write
alter table activity_feed enable row level security;
create policy "Anyone reads feed" on activity_feed for select using (true);
create policy "Auth users post" on activity_feed for insert with check (auth.uid() = user_id);
```

---

## Next: Admin portal

The admin portal will be a separate `admin.html` file that reuses
the same Supabase client. It will handle:
- Booking approvals / denials
- Event creation and management
- Student engagement reports
- At-risk student flags (low engagement)
- QR check-in code generation
