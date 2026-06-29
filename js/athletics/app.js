/* ============================================================
   STAC Engage v15 — Athletics Admin Portal
   Separate portal: athletics.html
   Access: Athletics department staff only
   Permissions: view athlete profiles by sport, post game
   announcements, approve/deny athletic space bookings
   ============================================================ */

const ATHLETICS_TABS = [
  { id:'overview',     icon:'ti-layout-dashboard', label:'Overview' },
  { id:'roster',       icon:'ti-users',            label:'Roster by sport' },
  { id:'announcements',icon:'ti-megaphone',        label:'Game announcements' },
  { id:'bookings',     icon:'ti-calendar-check',   label:'Space bookings' },
];

const ATHLETICS_RENDERERS = {
  overview:      renderAthleticsOverview,
  roster:        renderAthleticsRoster,
  announcements: renderAthleticsAnnouncements,
  bookings:      renderAthleticsBookings,
};

const ATHLETICS_TITLES = {
  overview:'Athletics Overview', roster:'Roster by Sport',
  announcements:'Game Announcements', bookings:'Athletic Space Bookings',
};

let currentAthTab = 'overview';
let selectedSport = null;

function buildAthleticsSidebar() {
  const nav = document.getElementById('ath-nav');
  nav.innerHTML = `<div class="nav-section-label">Athletics Admin</div>` +
    ATHLETICS_TABS.map(t => `
      <div class="nav-item ${t.id === currentAthTab ? 'active' : ''}" id="athnav-${t.id}" onclick="athSwitchTab('${t.id}')">
        <i class="ti ${t.icon}"></i>
        <span>${t.label}</span>
      </div>`).join('');

  document.getElementById('ath-sidebar-user').innerHTML = `
    <div class="sidebar-user-inner">
      <div class="su-avatar" style="background:#6b1a1a;color:#c8b560;">A</div>
      <div>
        <div class="su-name">Athletics Admin</div>
        <div class="su-role">Athletic Department</div>
      </div>
    </div>`;
}

function athSwitchTab(tabId) {
  if (!ATHLETICS_RENDERERS[tabId]) return;
  currentAthTab = tabId;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('athnav-' + tabId);
  if (navEl) navEl.classList.add('active');
  const ht = document.getElementById('ath-header-title');
  if (ht) ht.textContent = ATHLETICS_TITLES[tabId];
  const content = document.getElementById('ath-content');
  if (content) { content.innerHTML = ATHLETICS_RENDERERS[tabId](); content.scrollTop = 0; }
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (window.innerWidth <= 900) {
    sidebar.classList.toggle('open');
    overlay && overlay.classList.toggle('visible');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

function showToast(msg) {
  const existing = document.getElementById('stac-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'stac-toast';
  toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#6b1a1a;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.2);display:flex;align-items:center;gap:8px;white-space:nowrap;font-family:var(--font-body);`;
  toast.innerHTML = `<i class="ti ti-check" style="color:#c8b560;font-size:15px;"></i>${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function initAthleticsApp() {
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = () => { document.querySelector('.sidebar').classList.remove('open'); overlay.classList.remove('visible'); };
  document.body.appendChild(overlay);
  buildAthleticsSidebar();
  athSwitchTab('overview');
}

document.addEventListener("DOMContentLoaded", function() {
  if (!requirePortalAuth("athletics", initAthleticsApp)) return;
  initAthleticsApp();
});
