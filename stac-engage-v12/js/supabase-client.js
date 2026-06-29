/* ============================================================
   STAC Engage — Supabase Client
   
   SETUP:
   1. Create a free project at supabase.com
   2. Go to Project Settings → API
   3. Copy your Project URL and anon/public key
   4. Paste them below
   5. Add this script to index.html and app.html BEFORE all other scripts:
      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
      <script src="js/supabase-client.js"></script>
   ============================================================ */

const SUPABASE_URL  = 'YOUR_SUPABASE_PROJECT_URL';   // e.g. https://xyzabc.supabase.co
const SUPABASE_KEY  = 'YOUR_SUPABASE_ANON_KEY';       // starts with eyJ...

// Uncomment once Supabase CDN script is loaded:
// const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- Auth helpers (replace localStorage stubs in auth.js) ----

async function supaSignIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

async function supaSignUp(email, password, meta) {
  const { data, error } = await db.auth.signUp({
    email, password,
    options: { data: meta }  // { first_name, last_name, major, year }
  });
  if (error) throw error;
  return data.user;
}

async function supaSignOut() {
  await db.auth.signOut();
  localStorage.removeItem('stac_engage_user');
  window.location.href = 'index.html';
}

async function getSession() {
  const { data: { session } } = await db.auth.getSession();
  return session;
}

// ---- Profile ----

async function fetchProfile(userId) {
  const { data, error } = await db.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

async function upsertProfile(userId, fields) {
  const { error } = await db.from('profiles').upsert({ id: userId, ...fields });
  if (error) throw error;
}

// ---- Events ----

async function fetchEvents() {
  const { data, error } = await db.from('events').select('*').order('event_date');
  if (error) throw error;
  return data;
}

async function toggleRSVPSupabase(userId, eventId, currentlyRSVPd) {
  if (currentlyRSVPd) {
    await db.from('rsvps').delete().eq('user_id', userId).eq('event_id', eventId);
  } else {
    await db.from('rsvps').insert({ user_id: userId, event_id: eventId });
  }
}

// ---- Feed ----

async function fetchFeed() {
  const { data, error } = await db
    .from('activity_feed')
    .select('*, profiles(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

async function postShoutout(userId, text) {
  const { error } = await db.from('activity_feed').insert({ user_id: userId, text });
  if (error) throw error;
}

async function toggleLikeSupabase(userId, postId, currentlyLiked) {
  if (currentlyLiked) {
    await db.from('post_likes').delete().eq('user_id', userId).eq('post_id', postId);
    await db.rpc('decrement_likes', { post_id: postId });
  } else {
    await db.from('post_likes').insert({ user_id: userId, post_id: postId });
    await db.rpc('increment_likes', { post_id: postId });
  }
}

// ---- Orgs ----

async function fetchOrgs() {
  const { data, error } = await db.from('orgs').select('*').order('name');
  if (error) throw error;
  return data;
}

async function toggleOrgSupabase(userId, orgId, currentlyJoined) {
  if (currentlyJoined) {
    await db.from('org_memberships').delete().eq('user_id', userId).eq('org_id', orgId);
  } else {
    await db.from('org_memberships').insert({ user_id: userId, org_id: orgId });
  }
}

// ---- Challenges ----

async function claimChallengeSupabase(userId, challengeId, pointsValue) {
  await db.from('challenge_claims').insert({ user_id: userId, challenge_id: challengeId });
  await db.rpc('add_score', { user_id: userId, points: pointsValue });
}

// ---- Shop ----

async function redeemItemSupabase(userId, itemId) {
  const { error } = await db.from('redemptions').insert({ user_id: userId, item_id: itemId });
  if (error) throw error;
}

// ---- Bookings ----

async function submitBookingSupabase(userId, spaceId, fields) {
  // fields: { name, date, start_time, end_time, attendee_count, notes }
  const { error } = await db.from('bookings').insert({
    user_id: userId,
    space_id: spaceId,
    status: 'pending',
    ...fields
  });
  if (error) throw error;
}

// ---- Calendar events ----

async function fetchCalendarEvents(userId) {
  const { data, error } = await db
    .from('calendar_events')
    .select('*')
    .or(`public.eq.true,user_id.eq.${userId}`)
    .order('event_date');
  if (error) throw error;
  return data;
}

async function createCalendarEvent(userId, fields) {
  const { error } = await db.from('calendar_events').insert({ user_id: userId, ...fields });
  if (error) throw error;
}

// ---- Realtime subscriptions ----

function subscribeToFeed(onNewPost) {
  return db.channel('feed')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_feed' }, onNewPost)
    .subscribe();
}

function subscribeToNotifications(userId, onNew) {
  return db.channel('notifs-' + userId)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, onNew)
    .subscribe();
}
