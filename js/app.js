/* ============================================================
   STAC Engage — App Init & Router
   ============================================================ */

const TABS = [
  { id:'dashboard',    icon:'ti-layout-dashboard', label:'Dashboard',     group:'main' },
  { id:'calendar',     icon:'ti-calendar',         label:'Calendar',      group:'main' },
  { id:'events',       icon:'ti-calendar-event',   label:'Events',        group:'main' },
  { id:'transcript',   icon:'ti-certificate',      label:'Transcript',    group:'main' },
  { id:'pathways',     icon:'ti-route',            label:'Pathways',      group:'main' },
  { id:'leaderboard',  icon:'ti-trophy',           label:'Leaderboard',   group:'main' },
  { id:'streaks',      icon:'ti-flame',            label:'Streaks',       group:'engage' },
  { id:'shop',         icon:'ti-shopping-bag',     label:'Point shop',    group:'engage' },
  { id:'feed',         icon:'ti-activity',         label:'Activity feed', group:'engage' },
  { id:'orgs',         icon:'ti-users',            label:'Student orgs',  group:'engage' },
  { id:'clubvclub',    icon:'ti-tournament',       label:'Club vs. club', group:'engage' },
  { id:'service',      icon:'ti-heart',            label:'Service hours', group:'engage' },
  { id:'notifications',icon:'ti-bell',             label:'Notifications', group:'account' },
  { id:'profile',      icon:'ti-user-circle',      label:'My profile',    group:'account' },
];

const RENDERERS = {
  dashboard:     renderDashboard,
  events:        renderEvents,
  calendar:      () => typeof renderCalendar === 'function' ? renderCalendar() : '',
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
};

const TAB_TITLES = {
  dashboard:'Dashboard', events:'Upcoming Events', calendar:'Calendar',
  transcript:'Co-Curricular Transcript', pathways:'Career Pathways',
  leaderboard:'Leaderboard', streaks:'Streaks & Challenges',
  shop:'Point Shop', feed:'Activity Feed', orgs:'Student Organizations',
  clubvclub:'Club vs. Club', service:'Service Hours',
  profile:'My Profile', notifications:'Notifications',
};

let currentTab = 'dashboard';

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const u = getUser();
  const groups = { main: 'Spark', engage: 'Engage', account: 'Account' };
  let html = '';
  let lastGroup = null;
  TABS.filter(t => t.group !== 'account').forEach(t => {
    if (t.group !== lastGroup) {
      html += `<div class="nav-section-label">${groups[t.group]}</div>`;
      lastGroup = t.group;
    }
    html += `<div class="nav-item ${t.id === currentTab ? 'active' : ''}" id="nav-${t.id}" onclick="switchTab('${t.id}')">
      <i class="ti ${t.icon}"></i>
      <span>${t.label}</span>
      ${t.badge ? `<span class="nav-badge">${t.badge}</span>` : ''}
    </div>`;
  });
  nav.innerHTML = html;

  // Sidebar user
  const ini = getUserInitials();
  document.getElementById('sidebar-user').innerHTML = `
    <div class="sidebar-user-inner" onclick="switchTab('profile')">
      <div class="su-avatar">${ini}</div>
      <div>
        <div class="su-name">${u.firstName} ${u.lastName}</div>
        <div class="su-role">${u.major}</div>
      </div>
    </div>`;

  // Header avatar
  const ha = document.getElementById('header-avatar');
  if (ha) ha.textContent = ini;
}

function switchTab(tabId) {
  if (!RENDERERS[tabId]) return;
  currentTab = tabId;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('nav-' + tabId);
  if (navEl) navEl.classList.add('active');

  // Update header title
  const ht = document.getElementById('header-title');
  if (ht) ht.textContent = TAB_TITLES[tabId] || tabId;

  // Render content
  const content = document.getElementById('app-content');
  if (content) content.innerHTML = RENDERERS[tabId]();

  // Load live data per tab
  if (tabId === 'notifications') loadNotificationsFromDB();
  if (tabId === 'calendar')      loadCalendarEventsFromDB();
  if (tabId === 'events')        loadEventsFromDB();
  if (tabId === 'streaks')       loadStreaksFromDB();
  if (tabId === 'service')       loadStudentServiceHours();

  // Close mobile sidebar
  closeSidebar();

  // Scroll to top
  if (content) content.scrollTop = 0;
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

function initApp() {
  // Guard: redirect to login if no user saved
  const saved = localStorage.getItem('stac_engage_user');
  if (!saved && !window.location.search.includes('demo')) {
    // Allow demo mode without login
  }

  // Load state
  loadState();

  // Check for saved user from login flow
  try {
    const u = JSON.parse(localStorage.getItem('stac_engage_user') || 'null');
    if (u) {
      const s = getState();
      s.user = Object.assign(s.user, u);
    }
  } catch(e) {}

  // Build sidebar overlay for mobile
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = closeSidebar;
  document.body.appendChild(overlay);

  // Build sidebar
  buildSidebar();

  // Update score display
  updateScoreDisplay();

  // Load initial tab from hash or default
  const hash = window.location.hash.replace('#', '');
  const startTab = RENDERERS[hash] ? hash : 'dashboard';
  switchTab(startTab);
}

document.addEventListener('DOMContentLoaded', initApp);
