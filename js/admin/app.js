/* ============================================================
   STAC Engage — Admin App Router
   ============================================================ */

const ADMIN_TABS = [
  { id:'overview',       icon:'ti-layout-dashboard', label:'Overview',         group:'main' },
  { id:'bookings',       icon:'ti-calendar-check',   label:'Bookings',         group:'main', badge: () => ADMIN_BOOKINGS.filter(b => bookingState[b.id] === 'pending').length || null },
  { id:'events',         icon:'ti-calendar-event',   label:'Events',           group:'main' },
  { id:'calendar',       icon:'ti-calendar',         label:'Calendar',         group:'main' },
  { id:'checkin',        icon:'ti-qrcode',           label:'QR check-in',      group:'main' },
  { id:'students',       icon:'ti-users',            label:'Students',         group:'main', badge: () => ADMIN_STUDENTS.filter(s => s.status === 'atrisk').length || null },
  { id:'reports',        icon:'ti-chart-bar',        label:'Reports',          group:'main' },
  { id:'academic',      icon:'ti-calendar-event',  label:'Academic calendar', group:'main' },
  { id:'service',       icon:'ti-heart',           label:'Service hours',    group:'main', badge: () => liveServiceHours.filter(h=>h.status==='pending').length || null },
  { id:'positions',     icon:'ti-crown',           label:'Positions & Orgs',  group:'main', badge: () => Object.values(STUDENT_POSITIONS).reduce((s,a) => s+a.length, 0) || null },
  { id:'requests',      icon:'ti-calendar-plus',   label:'Event requests',   group:'main', badge: () => EVENT_REQUESTS.filter(r => eventRequestState[r.id] === 'pending').length || null },
  { id:'messages',      icon:'ti-message-circle',   label:'Messages',         group:'main', badge: () => Object.values(MESSAGE_THREADS).filter(t => t.messages.length && t.messages[t.messages.length-1].from==='student').length || null },
  { id:'notifications',  icon:'ti-send',             label:'Notifications',    group:'main' },
  { id:'feedback',       icon:'ti-star',              label:'Event feedback',   group:'main' },
  { id:'settings',       icon:'ti-settings',          label:'Settings',         group:'main' },
];

const ADMIN_RENDERERS = {
  overview:       renderAdminOverview,
  bookings:       renderAdminBookings,
  events:         renderAdminEvents,
  calendar:       () => typeof renderAdminCalendar === 'function' ? renderAdminCalendar() : '',
  checkin:        renderAdminCheckin,
  students:       renderAdminStudents,
  reports:        renderAdminReports,
  notifications:  renderAdminNotifications,
  messages:       renderAdminMessages,
  requests:       renderAdminRequests,
  positions:      renderAdminPositions,
  academic:       renderAdminAcademic,
  service:        renderAdminService,
  feedback:       () => typeof renderAdminFeedback === 'function' ? renderAdminFeedback() : '',
  settings:       () => typeof renderAdminSettings === 'function' ? renderAdminSettings() : '',
};

const ADMIN_TITLES = {
  overview:'Overview', bookings:'Space Bookings', events:'Event Management',
  calendar:'Campus Calendar', checkin:'QR Check-in', students:'Students', reports:'Reports',
  notifications:'Notifications', requests:'Event Requests', messages:'Messages', positions:'Officer Positions', academic:'Academic Calendar', service:'Service Hours', feedback:'Event Feedback', settings:'Settings',
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
        <div class="su-name">Jude Petersen</div>
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

  // Load live data when switching to these tabs
  if (tabId === 'students')  loadStudentsFromDB();
  if (tabId === 'messages')  loadAdminThreads();
  if (tabId === 'bookings')  loadBookingsFromDB();
  if (tabId === 'requests')  loadEventRequestsFromDB();
  if (tabId === 'service')   loadServiceHoursFromDB();
  if (tabId === 'academic')  loadAcademicDatesFromDB();
  if (tabId === 'positions') loadPositionsFromDB();
  if (tabId === 'messages')  loadAdminThreads();
  if (tabId === 'events')    loadAdminEventsFromDB();
  if (tabId === 'calendar')  loadAdminCalendarFromDB();
  if (tabId === 'feedback')  loadFeedbackFromDB();
  if (tabId === 'overview') { loadStudentsFromDB(); }

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
  // Passcode gate — blocks portal until correct code entered
  if (!requirePortalAuth('admin', initAdminApp)) return;

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

/* ── Confetti for admin ───────────────────────────────── */
function launchConfetti() {
  const colors = ['#6b1a1a','#c8b560','#3B6D11','#1a3a6b','#993556','#854F0B'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = Math.random() * 8 + 5;
    el.style.cssText = `
      position:absolute;top:-20px;left:${Math.random()*100}%;
      width:${size}px;height:${size}px;background:${color};
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation:confettiFall ${Math.random()*1.5+1.5}s ${Math.random()*0.5}s ease-in forwards;
    `;
    container.appendChild(el);
  }
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `@keyframes confettiFall {
      0%   { transform:translateY(0) rotate(0deg); opacity:1; }
      100% { transform:translateY(100vh) rotate(720deg); opacity:0; }
    }`;
    document.head.appendChild(style);
  }
  setTimeout(() => container.remove(), 3000);
}
