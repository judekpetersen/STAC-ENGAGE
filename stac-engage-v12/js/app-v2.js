/* ============================================================
   STAC Engage v2 — App Router (adds Calendar, Map, Spaces)
   ============================================================ */

const TABS = [
  { id:'dashboard',     icon:'ti-layout-dashboard', label:'Dashboard',       group:'main' },
  { id:'calendar',      icon:'ti-calendar',          label:'Calendar',        group:'main', badge:'9' },
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
  { id:'notifications', icon:'ti-bell',              label:'Notifications',   group:'account', badge:'3' },
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
  profile:       renderProfile,
  notifications: renderNotifications,
};

const TAB_TITLES = {
  dashboard:'Dashboard', calendar:'Campus Calendar', map:'Campus Map',
  events:'Upcoming Events', transcript:'Co-Curricular Transcript',
  pathways:'Career Pathways', leaderboard:'Leaderboard', streaks:'Streaks & Challenges',
  shop:'Point Shop', feed:'Activity Feed', orgs:'Student Organizations',
  clubvclub:'Club vs. Club', profile:'My Profile', notifications:'Notifications',
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

function initApp() {
  loadState();

  try {
    const u = JSON.parse(localStorage.getItem('stac_engage_user') || 'null');
    if (u) {
      const s = getState();
      s.user = Object.assign(s.user, u);
    }
  } catch(e) {}

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
