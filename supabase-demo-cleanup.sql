-- ================================================================
-- STAC Engage Demo Cleanup
-- Run this AFTER the demo to remove all fake data
-- ================================================================

DELETE FROM event_feedback  WHERE user_id  LIKE 'a1000001%' OR event_id LIKE 'b1000001%';
DELETE FROM rsvps           WHERE user_id  LIKE 'a1000001%' OR event_id LIKE 'b1000001%';
DELETE FROM service_hours   WHERE user_id  LIKE 'a1000001%';
DELETE FROM activity_feed   WHERE user_id  LIKE 'a1000001%';
DELETE FROM notifications   WHERE user_id  LIKE 'a1000001%';
DELETE FROM messages        WHERE sender_id LIKE 'a1000001%' OR recipient_id LIKE 'a1000001%';
DELETE FROM events          WHERE id       LIKE 'b1000001%';
DELETE FROM profiles        WHERE id       LIKE 'a1000001%';

SELECT 'Demo data cleaned up successfully!' as status;
