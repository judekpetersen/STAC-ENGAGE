/* ============================================================
   STAC Engage — Notifications Tab
   Supabase: query `notifications` for current user, realtime subscription
   ============================================================ */

function renderNotifications() {
  // TODO (Supabase):
  // const { data } = await db.from('notifications')
  //   .select('*').eq('user_id', currentUser.id)
  //   .order('created_at', { ascending: false }).limit(30);
  //
  // Mark all read:
  // await db.from('notifications').update({ read: true }).eq('user_id', currentUser.id);
  const unread = DATA.notifications.filter(n => n.unread).length;
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
        ${DATA.notifications.map(n => `
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

function markAllRead() {
  // TODO (Supabase): await db.from('notifications').update({ read: true }).eq('user_id', currentUser.id);
  document.querySelectorAll('.notif-item.unread').forEach(el => {
    el.classList.remove('unread');
    const dot = el.querySelector('.notif-dot-sm');
    if (dot) { dot.style.visibility = 'hidden'; }
  });
  // Remove badge from sidebar
  const badge = document.querySelector('#nav-notifications .nav-badge');
  if (badge) badge.remove();
}
