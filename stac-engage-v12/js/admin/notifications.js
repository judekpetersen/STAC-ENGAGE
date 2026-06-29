/* ============================================================
   STAC Engage — Admin: Notifications
   Supabase: insert into `notifications` for targeted users
   ============================================================ */

function renderAdminNotifications() {
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Notifications</h1>
      <p>Push announcements to all students or targeted groups</p>
    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-send"></i>Send notification</div>
      </div>
      <div class="card-body">
        <div class="field">
          <label>Audience</label>
          <select id="notif-audience">
            <option value="all">All students (${ADMIN_STUDENTS.length})</option>
            <option value="active">Active students only (${ADMIN_STUDENTS.filter(s=>s.status==='active').length})</option>
            <option value="atrisk">At-risk students (${ADMIN_STUDENTS.filter(s=>s.status==='atrisk').length})</option>
            <option value="rsvpd">RSVPd for next event</option>
            <optgroup label="By organization">
              ${ORG_ENGAGEMENT.map(o => `<option value="org-${o.name}">${o.name} (${o.members} members)</option>`).join('')}
            </optgroup>
          </select>
        </div>
        <div class="field">
          <label>Message</label>
          <input type="text" id="notif-message" placeholder="e.g. Reminder: Business Club Networking Night is tomorrow at 6pm in Sullivan Hall">
        </div>
        <div class="field-row-2">
          <div class="field">
            <label>Type</label>
            <select id="notif-type">
              <option value="event">Event reminder</option>
              <option value="update">General update</option>
              <option value="badge">Badge / achievement</option>
              <option value="reminder">RSVP reminder</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div class="field">
            <label>Schedule</label>
            <select id="notif-schedule">
              <option value="now">Send immediately</option>
              <option value="1h">In 1 hour</option>
              <option value="tomorrow">Tomorrow morning</option>
              <option value="custom">Custom time</option>
            </select>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
          <span id="notif-preview-count" style="font-size:12px;color:var(--text-3);">
            Will reach all ${ADMIN_STUDENTS.length} students
          </span>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="sendNotification()">
            <i class="ti ti-send"></i> Send notification
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-history"></i>Sent notifications</div>
      </div>
      <div class="card-body" style="padding:0;overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Message</th>
              <th>Audience</th>
              <th>Sent</th>
              <th>Opens</th>
              <th>Open rate</th>
            </tr>
          </thead>
          <tbody>
            ${NOTIF_HISTORY.map(n => {
              const audience = n.audience.includes('All') ? ADMIN_STUDENTS.length : parseInt(n.audience);
              const rate = !isNaN(audience) && audience > 0
                ? Math.round(n.opens / audience * 100) : '—';
              return `<tr>
                <td>
                  <div class="td-name">${n.title}</div>
                  <div class="td-meta">${n.type.charAt(0).toUpperCase() + n.type.slice(1)}</div>
                </td>
                <td>${n.audience}</td>
                <td>${n.sent}</td>
                <td>${n.opens}</td>
                <td>
                  ${typeof rate === 'number' ? `
                    <div style="display:flex;align-items:center;gap:6px;">
                      <div class="bar-wrap" style="width:60px;">
                        <div class="bar-fill" style="width:${rate}%;background:#6b1a1a;"></div>
                      </div>
                      <span style="font-size:12px;font-weight:500;">${rate}%</span>
                    </div>` : rate}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function sendNotification() {
  const msg = document.getElementById('notif-message').value.trim();
  if (!msg) { alert('Please enter a message.'); return; }
  const audience = document.getElementById('notif-audience').value;
  const type     = document.getElementById('notif-type').value;
  const schedule = document.getElementById('notif-schedule').value;

  // TODO (Supabase):
  // if audience === 'all': insert notification for every user_id in profiles
  // if audience === 'atrisk': filter profiles where score < threshold
  // if audience starts with 'org-': join through org_memberships
  // await db.from('notifications').insert(targets.map(uid => ({ user_id: uid, text: msg, icon: 'ti-bell', read: false })));

  const scheduleLabel = schedule === 'now' ? 'sent now' : `scheduled for ${schedule}`;
  showToast(`Notification ${scheduleLabel} to ${audience === 'all' ? 'all students' : audience}.`);
  document.getElementById('notif-message').value = '';

  NOTIF_HISTORY.unshift({
    id: Date.now(), title: msg, sent: 'Just now',
    audience: audience === 'all' ? `All students (${ADMIN_STUDENTS.length})` : audience,
    opens: 0, type
  });

  const content = document.getElementById('admin-content');
  if (content) content.innerHTML = renderAdminNotifications();
}
