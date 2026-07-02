-- ================================================================
-- STAC Engage Demo Data
-- Run this in Supabase SQL Editor before the demo
-- To remove: run supabase-demo-cleanup.sql
-- ================================================================

-- ── Demo student accounts (profiles only, no auth accounts needed for display) ──
-- We insert directly into profiles with fake UUIDs for display purposes

INSERT INTO profiles (id, first_name, last_name, major, year, score, streak_weeks, role, avatar_helmet, avatar_logo)
VALUES
  ('a1000001-0000-0000-0000-000000000001', 'Emma',     'Sullivan',  'Business Administration',   '2027', 420, 6, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000002', 'Marcus',   'Thompson',  'Criminal Justice',          '2026', 385, 5, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000003', 'Sofia',    'Rivera',    'Education',                 '2028', 340, 4, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000004', 'Dylan',    'Chen',      'Hospitality Management',   '2027', 295, 3, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000005', 'Olivia',   'Martínez',  'Psychology',               '2026', 280, 4, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000006', 'James',    'O''Brien',   'Accounting',               '2028', 255, 2, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000007', 'Priya',    'Patel',     'Biology',                  '2027', 230, 3, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000008', 'Tyler',    'Washington','Communication Arts',        '2026', 210, 2, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000009', 'Isabella', 'Rossi',     'Nursing',                  '2028', 185, 1, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000010', 'Noah',     'Kim',       'Computer Science',         '2027', 160, 2, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000011', 'Ava',      'Johnson',   'Business Administration',  '2026', 140, 1, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000012', 'Liam',     'Garcia',    'Hospitality Management',   '2028', 120, 1, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000013', 'Mia',      'Davis',     'Education',                '2027',  95, 0, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000014', 'Ethan',    'Wilson',    'Criminal Justice',         '2026',  70, 0, 'student', 'maroon', 'none'),
  ('a1000001-0000-0000-0000-000000000015', 'Charlotte','Brown',     'Psychology',               '2028',  45, 0, 'student', 'maroon', 'none')
ON CONFLICT (id) DO NOTHING;

-- ── Demo events (upcoming this month) ──
INSERT INTO events (id, title, event_date, start_time, end_time, location, type, capacity, points, description)
VALUES
  ('b1000001-0000-0000-0000-000000000001', 'Business Networking Night',        '2026-07-08', '18:00', '20:00', 'Romano Student Center — Grille',     'org',      80,  50, 'Connect with local business leaders and STAC alumni. Dress professionally.'),
  ('b1000001-0000-0000-0000-000000000002', 'Spartan Wellness Fair',            '2026-07-10', '11:00', '14:00', 'Costello Hall — Gymnasium',           'academic', 200, 40, 'Free health screenings, fitness demos, and wellness resources for students.'),
  ('b1000001-0000-0000-0000-000000000003', 'Campus Trivia Night',              '2026-07-12', '19:00', '21:00', 'Romano Student Center — Lounge',      'social',   60,  35, 'Test your knowledge and win prizes. Teams of 2–4. Sign up at the door.'),
  ('b1000001-0000-0000-0000-000000000004', 'Service Saturday — Food Pantry',   '2026-07-14', '09:00', '12:00', 'Off campus — Sparkill Community Center','service',  25,  75, 'Help sort and distribute food donations. Transportation provided from campus.'),
  ('b1000001-0000-0000-0000-000000000005', 'Summer Research Symposium',        '2026-07-16', '13:00', '16:00', 'Spellman Hall — Auditorium',          'academic', 150, 60, 'Students and faculty present summer research projects across all disciplines.'),
  ('b1000001-0000-0000-0000-000000000006', 'Outdoor Movie Night',              '2026-07-18', '20:30', '23:00', 'Academic Quad',                       'social',   120, 30, 'Bring a blanket and enjoy a movie under the stars. Snacks provided.'),
  ('b1000001-0000-0000-0000-000000000007', 'Hospitality Industry Panel',       '2026-07-22', '14:00', '16:00', 'Costello Hall — Room 201',            'academic', 40,  55, 'Hear from hotel and restaurant professionals about careers in hospitality.'),
  ('b1000001-0000-0000-0000-000000000008', 'SGA Club Fair',                    '2026-07-24', '12:00', '15:00', 'Romano Student Center — Lobby',       'org',      200, 25, 'Discover clubs, sign up for organizations, and meet student leaders.'),
  ('b1000001-0000-0000-0000-000000000009', 'Observatory Night — Open House',   '2026-07-26', '21:00', '23:00', 'SKAE Astronomy Center — Observatory', 'academic', 20,  65, 'View planets and deep-sky objects through STAC''s 24-inch telescope. Limited spots.'),
  ('b1000001-0000-0000-0000-000000000010', 'End of Month Cookout',             '2026-07-31', '16:00', '19:00', 'Academic Quad',                       'social',   300, 20, 'Celebrate the end of July with food, music, and games on the quad.')
ON CONFLICT (id) DO NOTHING;

-- ── RSVPs for demo students ──
INSERT INTO rsvps (event_id, user_id, checked_in)
VALUES
  -- Business Networking Night
  ('b1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', true),
  ('b1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000002', true),
  ('b1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000004', true),
  ('b1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000005', false),
  ('b1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000011', false),
  -- Wellness Fair
  ('b1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000003', true),
  ('b1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000007', true),
  ('b1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000009', true),
  ('b1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000001', false),
  -- Trivia Night
  ('b1000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000006', true),
  ('b1000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000008', true),
  ('b1000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000010', false),
  -- Service Saturday
  ('b1000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000003', true),
  ('b1000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000002', true),
  -- Observatory Night
  ('b1000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000001', false),
  ('b1000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000004', false),
  ('b1000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000007', false),
  -- Club Fair
  ('b1000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000012', false),
  ('b1000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000013', false),
  ('b1000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000014', false),
  ('b1000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000015', false)
ON CONFLICT DO NOTHING;

-- ── Service hours ──
INSERT INTO service_hours (user_id, org_name, date, hours, description, status)
VALUES
  ('a1000001-0000-0000-0000-000000000001', 'Good Counsel Home',          '2026-06-15', 3.0, 'Mentoring and tutoring residents', 'approved'),
  ('a1000001-0000-0000-0000-000000000002', 'Sparkill Food Pantry',       '2026-06-20', 4.0, 'Sorting and distributing donations', 'approved'),
  ('a1000001-0000-0000-0000-000000000003', 'Rockland BOCES',             '2026-06-22', 2.5, 'Classroom aide for special education', 'approved'),
  ('a1000001-0000-0000-0000-000000000005', 'Sparkill Community Center',  '2026-06-28', 3.5, 'Summer youth program volunteer', 'approved'),
  ('a1000001-0000-0000-0000-000000000007', 'STAC Campus Ministry',       '2026-07-01', 2.0, 'Organizing community outreach event', 'pending'),
  ('a1000001-0000-0000-0000-000000000009', 'St. Thomas Aquinas Parish',  '2026-07-02', 3.0, 'Sunday meal program volunteer', 'pending')
ON CONFLICT DO NOTHING;

-- ── Event feedback ──
INSERT INTO event_feedback (event_id, user_id, rating, comment)
VALUES
  ('b1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 5, 'Amazing connections made. Definitely attending next time!'),
  ('b1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000002', 4, 'Great event, food was good too'),
  ('b1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000004', 5, 'Met someone who offered me an internship!'),
  ('b1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000003', 4, 'Really helpful health info'),
  ('b1000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000007', 3, 'A bit crowded but good overall'),
  ('b1000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000006', 5, 'So fun!! Need to do this every week')
ON CONFLICT DO NOTHING;

-- ── Activity feed posts ──
INSERT INTO activity_feed (user_id, text, type)
VALUES
  ('a1000001-0000-0000-0000-000000000001', 'Just earned the Service Spartan badge! 🏅 Loving being part of this community', 'badge'),
  ('a1000001-0000-0000-0000-000000000002', 'Shoutout to the Wellness Fair organizers — best campus event this semester 💪', 'shoutout'),
  ('a1000001-0000-0000-0000-000000000004', 'RSVPd to the Hospitality Panel — can''t wait to hear from industry pros! 🏨', 'rsvp'),
  ('a1000001-0000-0000-0000-000000000003', 'Just hit 300 points! The leaderboard is getting competitive 🏆', 'achievement'),
  ('a1000001-0000-0000-0000-000000000007', 'Reminder: Observatory Night is July 26 — limited spots, sign up now! 🔭', 'update')
ON CONFLICT DO NOTHING;

SELECT 'Demo data inserted successfully!' as status;
SELECT 'Students: ' || count(*)::text FROM profiles WHERE id LIKE 'a1000001%';
SELECT 'Events: '   || count(*)::text FROM events   WHERE id LIKE 'b1000001%';
