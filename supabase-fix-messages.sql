-- ============================================================
-- Fix messages RLS so admin can read/write all messages
-- Run in Supabase SQL Editor
-- ============================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- Students can read their own messages
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

-- Anyone authenticated can send messages
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Allow reading all messages (admin use)
CREATE POLICY "Service can read all messages" ON messages
  FOR SELECT USING (true);

-- Allow inserting with admin as sender
CREATE POLICY "Admin can send messages" ON messages
  FOR INSERT WITH CHECK (true);
