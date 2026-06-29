/* ============================================================
   STAC Engage v2 — App Router (adds Calendar, Map, Spaces)
   ============================================================ */

const TABS = [
  { id:'dashboard',     icon:'ti-layout-dashboard', label:'Dashboard',       group:'main' },
  { id:'calendar',      icon:'ti-calendar',          label:'Calendar',        group:'main' },
  { id:'map',           icon:'ti-map',               label:'Campus map',      group:'main' },
  { id:'events',        icon:'ti-calendar-event',    label:'Events',          group:'main' },
  { id:'transcript',    icon:'ti-certificate',       label:'Transcript',      group:'main' },
  { id:'pathways',      icon:'ti-route',             label:'Pathways',        group:'main' },
  { id:'leaderboard',   icon:'ti-trophy',            label:'Leaderboard',     group:'engage' },
  { id:'streaks',       icon:'ti-flame',             label:'Streaks',         group:'engage' },
  { id:'shop',          icon:'ti-shopping-bag',      label:'Point shop',      group:'engage' },
  { id:'feed',          icon:'ti-activity',          label:'Activity feed',   group:'engage' },
  { id:'orgs',          icon:'ti-users',             label:'Student orgs',    group:'engage' },
  { id:'clubvclub',     icon:'ti-tournament',        label:'Club vs. club',   group:'engage' },
  { id:'service',       icon:'ti-heart',             label:'Service hours',   group:'engage' },
  { id:'messages',      icon:'ti-message-circle',    label:'Messages',        group:'account' },
  { id:'tickets',       icon:'ti-ticket',            label:'Tickets',         group:'account' },
  { id:'notifications', icon:'ti-bell',              label:'Notifications',   group:'account' },
  { id:'settings',      icon:'ti-settings',          label:'Settings',        group:'account' },
  { id:'profile',       icon:'ti-user-circle',       label:'My profile',      group:'account' },
];

const RENDERERS = {
  dashboard:     renderDashboard,
  calendar:      renderCalendar,
  map:           renderMap,
  events:        renderEvents,
  transcript:    renderTranscript,
  pathways:      renderPathways,
  leaderboard:   renderLeaderboard,
  streaks:       renderStreaks,
  shop:          renderShop,
  feed:          renderFeed,
  orgs:          renderOrgs,
  clubvclub:     renderClubVClub,
  service:       () => typeof renderServiceHours === 'function' ? renderServiceHours() : '',
  profile:       renderProfile,
  notifications: renderNotifications,
  messages:      renderMessages,
  settings:      renderSettings,
  tickets:       renderTickets,
};

const TAB_TITLES = {
  dashboard:'Dashboard', calendar:'Campus Calendar', map:'Campus Map',
  events:'Upcoming Events', transcript:'Co-Curricular Transcript',
  pathways:'Career Pathways', leaderboard:'Leaderboard', streaks:'Streaks & Challenges',
  shop:'Point Shop', feed:'Activity Feed', orgs:'Student Organizations',
  clubvclub:'Club vs. Club', service:'Service Hours', profile:'My Profile',
  notifications:'Notifications', messages:'Messages', settings:'Settings', tickets:'Event Tickets',
};

let currentTab = 'dashboard';

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const u = getUser();
  const groupLabels = { main:'Campus', engage:'Engage', account:'Account' };
  let html = '';
  let lastGroup = null;

  TABS.filter(t => t.group !== 'account').forEach(t => {
    if (t.group !== lastGroup) {
      html += `<div class="nav-section-label">${groupLabels[t.group]}</div>`;
      lastGroup = t.group;
    }
    html += `<div class="nav-item ${t.id === currentTab ? 'active' : ''}" id="nav-${t.id}" onclick="switchTab('${t.id}')">
      <i class="ti ${t.icon}"></i>
      <span>${t.label}</span>
      ${t.badge ? `<span class="nav-badge">${t.badge}</span>` : ''}
    </div>`;
  });

  // Account section
  html += `<div class="nav-section-label">Account</div>`;
  TABS.filter(t => t.group === 'account').forEach(t => {
    html += `<div class="nav-item ${t.id === currentTab ? 'active' : ''}" id="nav-${t.id}" onclick="switchTab('${t.id}')">
      <i class="ti ${t.icon}"></i>
      <span>${t.label}</span>
      ${t.badge ? `<span class="nav-badge">${t.badge}</span>` : ''}
    </div>`;
  });

  nav.innerHTML = html;

  const ini = getUserInitials();
  document.getElementById('sidebar-user').innerHTML = `
    <div class="sidebar-user-inner" onclick="switchTab('profile')">
      <div class="su-avatar">${ini}</div>
      <div>
        <div class="su-name">${u.firstName} ${u.lastName}</div>
        <div class="su-role">${u.major}</div>
      </div>
    </div>`;

  const ha = document.getElementById('header-avatar');
  if (ha && typeof avatarSVG === 'function') {
    ha.innerHTML = avatarSVG(userAvatar.helmet, userAvatar.logo, 34);
    ha.style.background = 'none';
  } else if (ha) {
    ha.textContent = ini;
  }
}

function switchTab(tabId) {
  if (!RENDERERS[tabId]) return;
  currentTab = tabId;

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('nav-' + tabId);
  if (navEl) navEl.classList.add('active');

  const ht = document.getElementById('header-title');
  if (ht) ht.textContent = TAB_TITLES[tabId] || tabId;

  const content = document.getElementById('app-content');
  if (content) {
    content.innerHTML = RENDERERS[tabId]();
    content.scrollTop = 0;
  }

  closeSidebar();
  window.location.hash = tabId;
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (window.innerWidth <= 900) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

function closeSidebar() {
  if (window.innerWidth <= 900) {
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay').classList.remove('visible');
  }
}

async function initApp() {
  // Check Supabase session
  try {
    const { data: { session } } = await db.auth.getSession();
    if (!session) { window.location.href = 'index.html'; return; }

    // Sync latest score from DB
    try {
      const profile = await fetchProfile(session.user.id);
      const stored  = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
      stored.id          = session.user.id;
      stored.score       = profile.score || 0;
      stored.streakWeeks = profile.streak_weeks || 0;
      stored.firstName   = stored.firstName || profile.first_name || '';
      stored.lastName    = stored.lastName  || profile.last_name  || '';
      localStorage.setItem('stac_engage_user', JSON.stringify(stored));
    } catch(e) { console.warn('Profile sync:', e); }
  } catch(e) {
    // Supabase unreachable — fall back to localStorage
    if (!localStorage.getItem('stac_engage_user')) {
      window.location.href = 'index.html'; return;
    }
  }

  // Load state and user
  try {
    const u = JSON.parse(localStorage.getItem('stac_engage_user') || 'null');
    loadState();
    if (u) { const s = getState(); s.user = Object.assign(s.user, u); }
  } catch(e) { loadState(); }

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = closeSidebar;
  document.body.appendChild(overlay);

  buildSidebar();
  updateScoreDisplay();

  const hash = window.location.hash.replace('#', '');
  const startTab = RENDERERS[hash] ? hash : 'dashboard';
  switchTab(startTab);
}

document.addEventListener('DOMContentLoaded', initApp);

/* ---- Bottom navigation (PWA standalone mode) ---- */
const BOTTOM_NAV_TABS = [
  { id:'dashboard', icon:'ti-layout-dashboard', label:'Home' },
  { id:'calendar',  icon:'ti-calendar',          label:'Calendar' },
  { id:'map',       icon:'ti-map',               label:'Map' },
  { id:'feed',      icon:'ti-activity',          label:'Feed' },
  { id:'profile',   icon:'ti-user-circle',       label:'Profile' },
];

function buildBottomNav() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;
  nav.innerHTML = BOTTOM_NAV_TABS.map(t => `
    <div class="bottom-nav-item ${currentTab === t.id ? 'active' : ''}" id="bnav-${t.id}" onclick="switchTab('${t.id}')">
      <i class="ti ${t.icon}"></i>
      <span>${t.label}</span>
    </div>`).join('');
}

/* Patch switchTab to also update bottom nav */
const _origSwitch = switchTab;
window.switchTab = function(tabId) {
  _origSwitch(tabId);
  document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));
  const bnav = document.getElementById('bnav-' + tabId);
  if (bnav) bnav.classList.add('active');
};

/* Build bottom nav after app init */
const _origInit = initApp;
window.initApp = function() {
  _origInit();
  buildBottomNav();
};

/* ── Apply saved preferences on load ── */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof applyPrefs === 'function') applyPrefs();
});

/* ── v17 Live data loading ───────────────────────────── */

// Load all shared data from Supabase on app start
async function loadLiveData() {
  try { await loadEventsFromDB(); }    catch(e) {}
  try { await loadLeaderboardFromDB(); } catch(e) {}
  try { await loadFeedFromDB(); }      catch(e) {}
  try {
    const anns = await fetchGameAnnouncements();
    if (anns.length) {
      GAME_ANNOUNCEMENTS.length = 0;
      anns.forEach(a => GAME_ANNOUNCEMENTS.push({
        id: a.id, sport: a.sport, opponent: a.opponent,
        date: a.game_date, time: a.game_time,
        location: a.location, result: a.result,
        postedAt: timeAgo ? timeAgo(a.created_at) : 'Recently',
      }));
    }
  } catch(e) {}
}

// Reload live data when switching to data-heavy tabs
const _origSwitchLive = switchTab;
window.switchTab = function(tabId) {
  _origSwitchLive(tabId);
  if (tabId === 'events')      { try { loadEventsFromDB(); }      catch(e) {} }
  if (tabId === 'leaderboard') { try { loadLeaderboardFromDB(); } catch(e) {} }
  if (tabId === 'feed')        { try { loadFeedFromDB(); }        catch(e) {} }
  if (tabId === 'service')     { try { loadStudentServiceHours(); } catch(e) {} }
  if (tabId === 'streaks')     { try { loadStreaksFromDB(); }     catch(e) {} }
  if (tabId === 'calendar')    { try { loadCalendarEventsFromDB(); } catch(e) {} }
};

// Subscribe to realtime feed updates
function initRealtime() {
  try {
    subscribeToFeed(() => { loadFeedFromDB(); });
  } catch(e) { console.warn('Realtime unavailable:', e); }
}

// Kick off after app loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(async () => {
    await loadLiveData();
    initRealtime();
  }, 500);
});

// Enhanced tab switch — load live data for each tab
const _origSwitchFull = window.switchTab;
window.switchTab = function(tabId) {
  _origSwitchFull(tabId);
  setTimeout(() => {
    if (tabId === 'transcript')     { try { loadTranscriptFromDB(); }      catch(e){} }
    if (tabId === 'notifications')  { try { loadNotificationsFromDB(); }   catch(e){} }
    if (tabId === 'pathways')       { try { loadMyServiceHours(); }        catch(e){} }
  }, 100);
};

/* ── QR Code Check-in Handler ─────────────────────────── */
async function handleCheckinFromURL() {
  const params   = new URLSearchParams(window.location.search);
  const eventId  = params.get('checkin');
  if (!eventId) return;

  // Wait for auth
  await new Promise(r => setTimeout(r, 800));
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) {
    showToast('Please sign in to check in to this event.');
    return;
  }

  try {
    // Get event details
    const { data: evt, error: evtErr } = await db
      .from('events').select('*').eq('id', eventId).single();
    if (evtErr || !evt) { showToast('Event not found.'); return; }

    // Check if already checked in
    const { data: existing } = await db
      .from('rsvps')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();
    if (existing) {
      showToast(`Already checked in to ${evt.title}!`);
      return;
    }

    // Insert RSVP/checkin
    const { error: rsvpErr } = await db.from('rsvps').insert({
      event_id:   eventId,
      user_id:    user.id,
      checked_in: true,
    });
    if (rsvpErr) throw rsvpErr;

    // Award points
    const pts = evt.points || 50;
    await db.rpc('add_score', { p_user_id: user.id, p_points: pts });

    // Notify student
    await db.from('notifications').insert({
      user_id: user.id,
      text:    `You checked in to "${evt.title}" and earned ${pts} points!`,
      type:    'event',
      read:    false,
    });

    showToast(`Checked in to ${evt.title}! +${pts} pts`);

    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  } catch(e) {
    console.error('Check-in failed:', e);
    showToast('Check-in failed — try again.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(handleCheckinFromURL, 1000);
});
