/* ============================================================
   STAC Engage v15 — SGA Portal
   Single shared account for Student Government Association
   Permissions: view club data, message club officers only
   ============================================================ */

const SGA_TABS = [
  { id:'overview',  icon:'ti-layout-dashboard', label:'Overview' },
  { id:'clubs',     icon:'ti-users',            label:'Club data' },
  { id:'messages',  icon:'ti-message-circle',   label:'Message officers', badge: () => sgaUnreadCount() || null },
];

const SGA_RENDERERS = {
  overview: renderSGAOverview,
  clubs:    renderSGAClubs,
  messages: renderSGAMessages,
};

const SGA_TITLES = { overview:'SGA Overview', clubs:'Club Data', messages:'Message Officers' };

let currentSGATab = 'overview';

// SGA message threads — keyed by student id (officers only)
const SGA_THREADS = {};

function sgaUnreadCount() {
  return Object.values(SGA_THREADS).filter(t => t.messages.length && t.messages[t.messages.length-1].from === 'officer').length;
}

function buildSGASidebar() {
  const nav = document.getElementById('sga-nav');
  nav.innerHTML = `<div class="nav-section-label">SGA Portal</div>` +
    SGA_TABS.map(t => {
      const badge = typeof t.badge === 'function' ? t.badge() : null;
      return `<div class="nav-item ${t.id===currentSGATab?'active':''}" id="sganav-${t.id}" onclick="sgaSwitchTab('${t.id}')">
        <i class="ti ${t.icon}"></i>
        <span>${t.label}</span>
        ${badge ? `<span class="nav-badge">${badge}</span>` : ''}
      </div>`;
    }).join('');

  document.getElementById('sga-sidebar-user').innerHTML = `
    <div class="sidebar-user-inner">
      <div class="su-avatar" style="background:#533AB7;color:#EEEDFE;">SGA</div>
      <div>
        <div class="su-name">Student Gov. Assoc.</div>
        <div class="su-role">Shared account</div>
      </div>
    </div>`;
}

function sgaSwitchTab(tabId) {
  if (!SGA_RENDERERS[tabId]) return;
  currentSGATab = tabId;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('sganav-' + tabId);
  if (navEl) navEl.classList.add('active');
  const ht = document.getElementById('sga-header-title');
  if (ht) ht.textContent = SGA_TITLES[tabId];
  const content = document.getElementById('sga-content');
  if (content) { content.innerHTML = SGA_RENDERERS[tabId](); content.scrollTop = 0; }
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
  toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#533AB7;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.2);display:flex;align-items:center;gap:8px;white-space:nowrap;font-family:var(--font-body);`;
  toast.innerHTML = `<i class="ti ti-check" style="color:#EEEDFE;font-size:15px;"></i>${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function initSGAApp() {
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = () => { document.querySelector('.sidebar').classList.remove('open'); overlay.classList.remove('visible'); };
  document.body.appendChild(overlay);
  buildSGASidebar();
  sgaSwitchTab('overview');
}

document.addEventListener("DOMContentLoaded", function() {
  if (!requirePortalAuth("sga", initSGAApp)) return;
  initSGAApp();
});
