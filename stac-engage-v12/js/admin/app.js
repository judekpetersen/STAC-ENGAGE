/* ============================================================
   STAC Engage — Admin App Router
   ============================================================ */

const ADMIN_TABS = [
  { id:'overview',       icon:'ti-layout-dashboard', label:'Overview',         group:'main' },
  { id:'bookings',       icon:'ti-calendar-check',   label:'Bookings',         group:'main', badge: () => ADMIN_BOOKINGS.filter(b => bookingState[b.id] === 'pending').length || null },
  { id:'events',         icon:'ti-calendar-event',   label:'Events',           group:'main' },
  { id:'checkin',        icon:'ti-qrcode',           label:'QR check-in',      group:'main' },
  { id:'students',       icon:'ti-users',            label:'Students',         group:'main', badge: () => ADMIN_STUDENTS.filter(s => s.status === 'atrisk').length || null },
  { id:'reports',        icon:'ti-chart-bar',        label:'Reports',          group:'main' },
  { id:'requests',      icon:'ti-calendar-plus',   label:'Event requests',   group:'main', badge: () => EVENT_REQUESTS.filter(r => eventRequestState[r.id] === 'pending').length || null },
  { id:'notifications',  icon:'ti-send',             label:'Notifications',    group:'main' },
];

const ADMIN_RENDERERS = {
  overview:       renderAdminOverview,
  bookings:       renderAdminBookings,
  events:         renderAdminEvents,
  checkin:        renderAdminCheckin,
  students:       renderAdminStudents,
  reports:        renderAdminReports,
  notifications:  renderAdminNotifications,
  requests:       renderAdminRequests,
};

const ADMIN_TITLES = {
  overview:'Overview', bookings:'Space Bookings', events:'Event Management',
  checkin:'QR Check-in', students:'Students', reports:'Reports',
  notifications:'Notifications', requests:'Event Requests',
};

let currentAdminTab = 'overview';

function buildAdminSidebar() {
  const nav = document.getElementById('admin-nav');
  let html  = `<div class="nav-section-label">Admin tools</div>`;

  ADMIN_TABS.forEach(t => {
    const badgeVal = typeof t.badge === 'function' ? t.badge() : null;
    html += `<div class="nav-item ${t.id === currentAdminTab ? 'active' : ''}" id="anav-${t.id}" onclick="adminSwitchTab('${t.id}')">
      <i class="ti ${t.icon}"></i>
      <span>${t.label}</span>
      ${badgeVal ? `<span class="nav-badge">${badgeVal}</span>` : ''}
    </div>`;
  });

  nav.innerHTML = html;

  document.getElementById('admin-sidebar-user').innerHTML = `
    <div class="sidebar-user-inner">
      <div class="su-avatar">JM</div>
      <div>
        <div class="su-name">Jude Murphy</div>
        <div class="su-role">Administrator</div>
      </div>
    </div>`;
}

function adminSwitchTab(tabId) {
  if (!ADMIN_RENDERERS[tabId]) return;
  currentAdminTab = tabId;

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('anav-' + tabId);
  if (navEl) navEl.classList.add('active');

  const ht = document.getElementById('admin-header-title');
  if (ht) ht.textContent = ADMIN_TITLES[tabId] || tabId;

  const content = document.getElementById('admin-content');
  if (content) {
    content.innerHTML = ADMIN_RENDERERS[tabId]();
    content.scrollTop = 0;
  }

  closeSidebar();
  window.location.hash = tabId;
}

function toggleSidebar() {
  const sidebar  = document.querySelector('.sidebar');
  const overlay  = document.querySelector('.sidebar-overlay');
  if (window.innerWidth <= 900) {
    sidebar.classList.toggle('open');
    overlay && overlay.classList.toggle('visible');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

function closeSidebar() {
  if (window.innerWidth <= 900) {
    document.querySelector('.sidebar').classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    overlay && overlay.classList.remove('visible');
  }
}

function showToast(msg) {
  const existing = document.getElementById('stac-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'stac-toast';
  toast.style.cssText = `
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
    background:#6b1a1a;color:#fff;padding:12px 20px;border-radius:10px;
    font-size:13px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.2);
    display:flex;align-items:center;gap:8px;white-space:nowrap;
    animation:slideUp .2s ease;font-family:var(--font-body);
  `;
  toast.innerHTML = `<i class="ti ti-check" style="color:#c8b560;font-size:15px;"></i>${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function initAdminApp() {
  // TODO (Supabase): check session and verify admin role before loading
  // const session = await getSession();
  // if (!session) window.location.href = 'index.html';
  // const profile = await fetchProfile(session.user.id);
  // if (!profile.is_admin) window.location.href = 'app.html';

  const overlay  = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick   = closeSidebar;
  document.body.appendChild(overlay);

  buildAdminSidebar();

  const hash     = window.location.hash.replace('#', '');
  const startTab = ADMIN_RENDERERS[hash] ? hash : 'overview';
  adminSwitchTab(startTab);
}

document.addEventListener('DOMContentLoaded', initAdminApp);
