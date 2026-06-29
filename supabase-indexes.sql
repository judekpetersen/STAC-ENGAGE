-- ============================================================
-- STAC Engage — Performance indexes for scale
-- Run this in Supabase SQL Editor
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_score      ON profiles (score DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_user          ON rsvps (user_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_event         ON rsvps (event_id);
CREATE INDEX IF NOT EXISTS idx_feed_created        ON activity_feed (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender     ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient  ON messages (recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user  ON notifications (user_id, read);
CREATE INDEX IF NOT EXISTS idx_bookings_user       ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status     ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_event_requests_status ON event_requests (status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date  ON calendar_events (event_date);
CREATE INDEX IF NOT EXISTS idx_academic_date       ON academic_calendar (event_date);
CREATE INDEX IF NOT EXISTS idx_org_memberships_user ON org_memberships (user_id);
