/* ============================================================
   STAC Engage — Supabase Client v2
   Using legacy anon key format for compatibility
   ============================================================ */

const SUPABASE_URL = 'https://vknmyojdgtavtwnluhqm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r2CO_wdWcvWVuvVZgJVEyw_sYDL0Npk';

// Initialize with explicit auth options
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  }
});

// ── Auth ─────────────────────────────────────────────────────

async function supaSignIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

async function supaSignUp(email, password, meta) {
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: meta,
      emailRedirectTo: 'https://stac-engage.netlify.app/app.html',
    }
  });
  if (error) throw error;
  // data.user exists even before email confirmation
  return data.user;
}

async function supaSignOut() {
  await db.auth.signOut();
  localStorage.removeItem('stac_engage_user');
  localStorage.removeItem('stac_engage_state');
  window.location.href = 'index.html';
}

async function getSession() {
  const { data: { session } } = await db.auth.getSession();
  return session;
}

async function getCurrentUser() {
  const { data: { user } } = await db.auth.getUser();
  return user;
}

// ── Profiles ─────────────────────────────────────────────────

async function fetchProfile(userId) {
  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

async function upsertProfile(userId, fields) {
  const { error } = await db
    .from('profiles')
    .upsert({ id: userId, updated_at: new Date().toISOString(), ...fields });
  if (error) throw error;
}

// ── Events ───────────────────────────────────────────────────

async function fetchEvents() {
  const { data, error } = await db
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function fetchMyRSVPs(userId) {
  const { data, error } = await db
    .from('rsvps')
    .select('event_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map(r => r.event_id);
}

async function toggleRSVP(userId, eventId, currentlyRSVPd) {
  if (currentlyRSVPd) {
    await db.from('rsvps').delete().eq('user_id', userId).eq('event_id', eventId);
  } else {
    await db.from('rsvps').insert({ user_id: userId, event_id: eventId });
    await db.rpc('add_score', { p_user_id: userId, p_points: 50 });
  }
}

// ── Feed ─────────────────────────────────────────────────────

async function fetchFeed() {
  const { data, error } = await db
    .from('activity_feed')
    .select('*, profiles(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

async function postToFeed(userId, text) {
  const { error } = await db
    .from('activity_feed')
    .insert({ user_id: userId, text, likes: 0 });
  if (error) throw error;
  await db.rpc('add_score', { p_user_id: userId, p_points: 10 });
}

// ── Leaderboard ──────────────────────────────────────────────

async function fetchLeaderboard() {
  const { data, error } = await db
    .from('profiles')
    .select('id, first_name, last_name, score, major, year')
    .order('score', { ascending: false })
    .limit(25);
  if (error) throw error;
  return data || [];
}

// ── Orgs ─────────────────────────────────────────────────────

async function fetchOrgs() {
  const { data, error } = await db.from('orgs').select('*').order('name');
  if (error) throw error;
  return data || [];
}

async function fetchMyOrgs(userId) {
  const { data, error } = await db
    .from('org_memberships')
    .select('org_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map(m => m.org_id);
}

async function toggleOrg(userId, orgId, currentlyJoined) {
  if (currentlyJoined) {
    await db.from('org_memberships').delete().eq('user_id', userId).eq('org_id', orgId);
  } else {
    await db.from('org_memberships').insert({ user_id: userId, org_id: orgId });
    await db.rpc('add_score', { p_user_id: userId, p_points: 25 });
  }
}

// ── Bookings ─────────────────────────────────────────────────

async function submitBooking(userId, fields) {
  const { error } = await db
    .from('bookings')
    .insert({ user_id: userId, status: 'pending', ...fields });
  if (error) throw error;
}

// ── Calendar ─────────────────────────────────────────────────

async function fetchCalendarEvents(userId) {
  const { data, error } = await db
    .from('calendar_events')
    .select('*')
    .or(`is_public.eq.true,user_id.eq.${userId}`)
    .order('event_date');
  if (error) throw error;
  return data || [];
}

async function fetchAcademicCalendar() {
  const { data, error } = await db
    .from('academic_calendar')
    .select('*')
    .order('event_date');
  if (error) throw error;
  return data || [];
}

// ── Messages ─────────────────────────────────────────────────

async function fetchMessages(userId) {
  const { data, error } = await db
    .from('messages')
    .select('*, sender:profiles!sender_id(first_name, last_name)')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function sendMessage(senderId, recipientId, text) {
  const { error } = await db
    .from('messages')
    .insert({ sender_id: senderId, recipient_id: recipientId, text });
  if (error) throw error;
}

// ── Event requests ────────────────────────────────────────────

async function submitEventRequest(userId, fields) {
  const { error } = await db
    .from('event_requests')
    .insert({ user_id: userId, status: 'pending', ...fields });
  if (error) throw error;
}

async function fetchMyEventRequests(userId) {
  const { data, error } = await db
    .from('event_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Shop ─────────────────────────────────────────────────────

async function redeemItem(userId, itemId, itemCost) {
  const { error } = await db
    .from('redemptions')
    .insert({ user_id: userId, item_id: itemId });
  if (error) throw error;
  await db.rpc('add_score', { p_user_id: userId, p_points: -itemCost });
}

async function fetchMyRedemptions(userId) {
  const { data, error } = await db
    .from('redemptions')
    .select('item_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map(r => r.item_id);
}

// ── Notifications ─────────────────────────────────────────────

async function fetchNotifications(userId) {
  const { data, error } = await db
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data || [];
}

// ── Game announcements ────────────────────────────────────────

async function fetchGameAnnouncements() {
  const { data, error } = await db
    .from('game_announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data || [];
}

// ── Realtime ──────────────────────────────────────────────────

function subscribeToFeed(onNewPost) {
  return db.channel('feed')
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'activity_feed'
    }, onNewPost)
    .subscribe();
}

function subscribeToMessages(userId, onNew) {
  return db.channel('messages-' + userId)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `recipient_id=eq.${userId}`
    }, onNew)
    .subscribe();
}

// ── Service hours ─────────────────────────────────────────────

async function submitServiceHours(userId, fields) {
  const { error } = await db.from('service_hours').insert({
    user_id: userId, status: 'pending', ...fields
  });
  if (error) throw error;
}

async function fetchMyServiceHours(userId) {
  const { data, error } = await db
    .from('service_hours')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchAllServiceHours() {
  const { data, error } = await db
    .from('service_hours')
    .select('*, profiles(first_name, last_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function updateServiceHours(id, status, adminNote) {
  const { error } = await db
    .from('service_hours')
    .update({ status, admin_note: adminNote || '' })
    .eq('id', id);
  if (error) throw error;
}

// ── Bookings (full wiring) ────────────────────────────────────

async function fetchAllBookings() {
  const { data, error } = await db
    .from('bookings')
    .select('*, profiles(first_name, last_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function updateBooking(id, status) {
  const { error } = await db
    .from('bookings')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

async function submitBookingRequest(userId, fields) {
  const { error } = await db.from('bookings').insert({
    user_id: userId, status: 'pending', ...fields
  });
  if (error) throw error;
}

// ── Event requests (full wiring) ─────────────────────────────

async function fetchAllEventRequests() {
  const { data, error } = await db
    .from('event_requests')
    .select('*, profiles(first_name, last_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function updateEventRequest(id, status, adminNote) {
  const { error } = await db
    .from('event_requests')
    .update({ status, admin_note: adminNote || '' })
    .eq('id', id);
  if (error) throw error;
}

async function submitEventRequest(userId, fields) {
  const { error } = await db.from('event_requests').insert({
    user_id: userId, status: 'pending', ...fields
  });
  if (error) throw error;
}

// ── Notifications ─────────────────────────────────────────────

async function sendNotification(userId, text, type='info') {
  const { error } = await db.from('notifications').insert({
    user_id: userId, text, type, read: false
  });
  if (error) throw error;
}

async function broadcastNotification(text, type='info') {
  const { data: profiles } = await db.from('profiles').select('id');
  if (!profiles) return;
  const rows = profiles.map(p => ({ user_id: p.id, text, type, read: false }));
  await db.from('notifications').insert(rows);
}

async function fetchMyNotifications(userId) {
  const { data, error } = await db
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data || [];
}

async function markNotifRead(id) {
  await db.from('notifications').update({ read: true }).eq('id', id);
}

// ── Academic calendar ─────────────────────────────────────────

async function fetchAcademicDates() {
  const { data, error } = await db
    .from('academic_calendar')
    .select('*')
    .order('event_date');
  if (error) throw error;
  return data || [];
}

async function addAcademicDate(fields) {
  const { error } = await db.from('academic_calendar').insert(fields);
  if (error) throw error;
}

async function removeAcademicDate(id) {
  const { error } = await db.from('academic_calendar').delete().eq('id', id);
  if (error) throw error;
}

// ── Student positions ─────────────────────────────────────────

async function fetchAllPositions() {
  const { data, error } = await db
    .from('student_positions')
    .select('*, profiles(first_name, last_name)');
  if (error) throw error;
  return data || [];
}

async function assignPosition(userId, position, org) {
  const { error } = await db.from('student_positions').insert({
    user_id: userId, position, org
  });
  if (error) throw error;
  await sendNotification(userId, `You've been assigned as ${position} of ${org}!`, 'info');
}

async function removePosition(userId, position, org) {
  const { error } = await db.from('student_positions')
    .delete()
    .eq('user_id', userId)
    .eq('position', position)
    .eq('org', org);
  if (error) throw error;
}

// ── Orgs ─────────────────────────────────────────────────────

async function createOrg(fields) {
  const { data, error } = await db.from('orgs').insert(fields).select().single();
  if (error) throw error;
  return data;
}

async function fetchAllOrgs() {
  const { data, error } = await db.from('orgs').select('*').order('name');
  if (error) throw error;
  return data || [];
}

// ── Game announcements ────────────────────────────────────────

async function createGameAnnouncement(fields) {
  const { error } = await db.from('game_announcements').insert(fields);
  if (error) throw error;
}

async function updateGameResult(id, result) {
  const { error } = await db.from('game_announcements').update({ result }).eq('id', id);
  if (error) throw error;
}

async function deleteGameAnnouncement(id) {
  const { error } = await db.from('game_announcements').delete().eq('id', id);
  if (error) throw error;
}

// ── Transcript / co-curricular ────────────────────────────────

async function fetchMyTranscript(userId) {
  const [rsvps, hours] = await Promise.all([
    db.from('rsvps').select('*, events(title, event_date, points, type)').eq('user_id', userId),
    db.from('service_hours').select('*').eq('user_id', userId).eq('status', 'approved'),
  ]);
  return {
    events:  (rsvps.data  || []).map(r => r.events).filter(Boolean),
    service: (hours.data  || []),
  };
}
