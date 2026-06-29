/* ============================================================
let liveNotifications = [];
   STAC Engage — Notifications Tab
   Supabase: query `notifications` for current user, realtime subscription
   ============================================================ */

function renderNotifications() {
  const notifs = liveNotifications.length > 0
    ? liveNotifications.map(n => ({
        id: n.id, text: n.text, unread: !n.read,
        icon: n.type === 'event' ? 'ti-calendar-event' : n.type === 'badge' ? 'ti-medal' : 'ti-bell',
        iconBg: n.type === 'event' ? '#FBE6E6' : n.type === 'badge' ? '#FAEEDA' : '#E1F5EE',
        iconC:  n.type === 'event' ? '#6b1a1a' : n.type === 'badge' ? '#854F0B' : '#0F6E56',
        time: timeAgoNotif(n.created_at),
      }))
    : DATA.notifications;

  const unread = notifs.filter(n => n.unread).length;
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Notifications</h1>
      <p>${unread} unread</p>
    </div>
    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-bell"></i>Recent</div>
        <span class="card-action" onclick="markAllRead()">Mark all read</span>
      </div>
      <div class="card-body" id="notif-list">
        ${notifs.length === 0
          ? `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No notifications yet</div>`
          : notifs.map(n => `
          <div class="notif-item ${n.unread ? 'unread' : ''}" id="notif-${n.id}">
            ${n.unread
              ? '<div class="notif-dot-sm"></div>'
              : '<div style="width:7px;flex-shrink:0;"></div>'}
            <div style="width:34px;height:34px;border-radius:8px;background:${n.iconBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="ti ${n.icon}" style="color:${n.iconC};font-size:16px;"></i>
            </div>
            <div class="notif-content">
              <div class="notif-text">${n.text}</div>
              <div class="notif-time">${n.time}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

async function markAllRead() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (user.id) {
    try {
      await db.from('notifications').update({ read: true }).eq('user_id', user.id);
      liveNotifications = liveNotifications.map(n => ({ ...n, read: true }));
    } catch(e) { console.warn('Mark read failed:', e); }
  }
  document.querySelectorAll('.notif-item.unread').forEach(el => {
    el.classList.remove('unread');
    const dot = el.querySelector('.notif-dot-sm');
    if (dot) dot.style.visibility = 'hidden';
  });
  const badge = document.querySelector('#nav-notifications .nav-badge');
  if (badge) badge.remove();
  const hdr = document.querySelector('.page-head p');
  if (hdr) hdr.textContent = '0 unread';
}

/* ── Live Supabase wiring ─────────────────────────────── */

async function loadNotificationsFromDB() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) return;
  try {
    liveNotifications = await fetchMyNotifications(user.id);
    DATA.notifications = liveNotifications.map(n => ({
      id: n.id, text: n.text, type: n.type, read: n.read,
      time: timeAgoNotif(n.created_at),
    }));
    const content = document.getElementById('app-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.dataset?.tab === 'notifications') {
      content.innerHTML = renderNotifications();
    }
    // Update badge
    const unread = liveNotifications.filter(n => !n.read).length;
    const badge  = document.querySelector('#bnav-notifications .notif-dot');
    if (badge) badge.style.display = unread ? 'block' : 'none';
  } catch(e) { console.warn('Notifications load failed:', e); }
}

function timeAgoNotif(ts) {
  if (!ts) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}
