/* ============================================================
   STAC Engage v8 — Admin: Event Requests
   Supabase: query `event_requests` joined with `profiles`
   ============================================================ */

let requestFilter = 'all';

function renderAdminRequests() {
  // TODO (Supabase):
  // const { data } = await db.from('event_requests')
  //   .select('*, profiles(first_name, last_name)')
  //   .order('created_at', { ascending: false });

  const pending  = EVENT_REQUESTS.filter(r => eventRequestState[r.id] === 'pending').length;
  const filtered = requestFilter === 'all'
    ? EVENT_REQUESTS
    : EVENT_REQUESTS.filter(r => eventRequestState[r.id] === requestFilter);

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Event requests</h1>
      <p>Review and approve student-submitted event requests</p>
    </div>

    ${pending > 0 ? `
    <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#FAEEDA;border-radius:var(--radius-lg);margin-bottom:1rem;border:1px solid #c8b560;">
      <i class="ti ti-clock" style="color:#854F0B;font-size:20px;flex-shrink:0;"></i>
      <div>
        <div style="font-size:13px;font-weight:500;color:#854F0B;">${pending} request${pending>1?'s':''} awaiting review</div>
        <div style="font-size:11px;color:#854F0B;opacity:.8;">Approve to publish to the campus calendar</div>
      </div>
    </div>` : ''}

    <div class="filter-pills">
      ${['all','pending','approved','denied'].map(f => `
        <button class="filter-pill ${requestFilter===f?'active':''}" onclick="setRequestFilter('${f}')">
          ${f.charAt(0).toUpperCase()+f.slice(1)}
          ${f==='pending'?`(${pending})`:''}
        </button>`).join('')}
    </div>

    <div class="card">
      <div class="card-body" style="padding:0;">
        ${filtered.length === 0
          ? `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No ${requestFilter} requests</div>`
          : filtered.map(r => requestCard(r)).join('')}
      </div>
    </div>
  </div>`;
}

function requestCard(r) {
  const status = eventRequestState[r.id];
  const [y,m,d] = r.date.split('-');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return `
    <div id="req-card-${r.id}" style="padding:16px;border-bottom:1px solid var(--border);">
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
        <div style="width:44px;height:48px;border-radius:var(--radius);background:#FBE6E6;border:1px solid #6b1a1a25;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:9px;font-weight:600;color:#6b1a1a;text-transform:uppercase;letter-spacing:.04em;">${monthNames[parseInt(m)-1]}</span>
          <span style="font-size:19px;font-weight:500;color:#6b1a1a;line-height:1.1;">${parseInt(d)}</span>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px;">
            <div style="font-size:14px;font-weight:500;color:var(--text);">${r.title}</div>
            <span class="status-badge status-${status}">${status.charAt(0).toUpperCase()+status.slice(1)}</span>
          </div>
          <div style="font-size:12px;color:#8a8a80;margin-bottom:4px;">
            <i class="ti ti-users" style="font-size:11px;"></i> ${r.org} &nbsp;·&nbsp;
            <i class="ti ti-clock" style="font-size:11px;"></i> ${fmtTime12(r.start)} – ${fmtTime12(r.end)} &nbsp;·&nbsp;
            <i class="ti ti-map-pin" style="font-size:11px;"></i> ${r.space}
          </div>
          <div style="font-size:12px;color:#8a8a80;">
            <i class="ti ti-user" style="font-size:11px;"></i> Submitted by ${r.submittedBy} · ${r.submittedAt} &nbsp;·&nbsp;
            <i class="ti ti-users" style="font-size:11px;"></i> Est. ${r.attendance} attendees &nbsp;·&nbsp;
            <i class="ti ti-star" style="font-size:11px;"></i> +${r.points} pts
          </div>
        </div>
      </div>

      ${r.description ? `
        <div style="padding:10px 12px;background:var(--surface-2);border-radius:var(--radius);font-size:12px;color:#5a5a52;margin-bottom:12px;line-height:1.5;">
          ${r.description}
        </div>` : ''}

      ${status === 'pending' ? `
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <button class="btn-approve" onclick="approveRequest('${r.id}')">
            <i class="ti ti-check" style="font-size:11px;"></i> Approve &amp; publish
          </button>
          <button class="btn-deny" onclick="showDenyForm('${r.id}')">
            <i class="ti ti-x" style="font-size:11px;"></i> Deny
          </button>
          <button class="btn-secondary" onclick="showRequestNote('${r.id}')">
            <i class="ti ti-message" style="font-size:11px;"></i> Request changes
          </button>
        </div>
        <div id="deny-form-${r.id}" style="display:none;margin-top:10px;">
          <div style="display:flex;gap:8px;">
            <input type="text" id="deny-note-${r.id}"
              style="flex:1;border:1px solid var(--border-md);border-radius:var(--radius);padding:7px 10px;font-size:12px;font-family:var(--font-body);background:var(--surface);color:var(--text);outline:none;"
              placeholder="Reason for denial (shown to student)...">
            <button class="btn-deny" onclick="confirmDenyRequest('${r.id}')">Confirm denial</button>
            <button class="btn-secondary" onclick="hideDenyForm('${r.id}')">Cancel</button>
          </div>
        </div>` :
        status === 'approved' ? `
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#3B6D11;display:flex;align-items:center;gap:5px;">
            <i class="ti ti-check-circle" style="font-size:15px;"></i>
            Published to campus calendar
          </span>
          <button class="btn-secondary" onclick="revokeRequest('${r.id}')">Revoke</button>
        </div>` :
        `<div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#993556;display:flex;align-items:center;gap:5px;">
            <i class="ti ti-x-circle" style="font-size:15px;"></i>
            Denied${eventRequestNotes[r.id]?` — "${eventRequestNotes[r.id]}"`:''}
          </span>
          <button class="btn-secondary" onclick="approveRequest('${r.id}')">Approve instead</button>
        </div>`}
    </div>`;
}

function fmtTime12(t) {
  const [h, m] = t.split(':').map(Number);
  return (h % 12 || 12) + (m ? ':' + String(m).padStart(2,'0') : '') + (h >= 12 ? 'pm' : 'am');
}

function setRequestFilter(f) {
  requestFilter = f;
  const content = document.getElementById('admin-content');
  if (content) content.innerHTML = renderAdminRequests();
}

function approveRequest(id) {
  eventRequestState[id] = 'approved';
  // Also add to student-visible calendar
  const r = EVENT_REQUESTS.find(x => x.id === id);
  if (r) {
    CALENDAR_EVENTS.push({
      id: 'req-' + id,
      title: r.title,
      date: r.date,
      start: r.start,
      end: r.end,
      type: 'org',
      color: '#6b1a1a',
      bg: '#FBE6E6',
      space: r.space,
      rsvp: false,
    });
  }
  refreshRequestCard(id);
  showToast('Event approved and published to the campus calendar.');
  updateRequestBadge();
  // TODO (Supabase): await db.from('event_requests').update({ status: 'approved' }).eq('id', id);
  // await db.from('events').insert({ ...r, public: true });
  // await db.from('notifications').insert({ user_id: r.user_id, text: `Your event "${r.title}" was approved!` });
}

function showDenyForm(id) {
  const form = document.getElementById('deny-form-' + id);
  if (form) form.style.display = 'block';
}

function hideDenyForm(id) {
  const form = document.getElementById('deny-form-' + id);
  if (form) form.style.display = 'none';
}

async function confirmDenyRequest(id) {
  const note = document.getElementById('deny-note-' + id)?.value.trim() || '';
  const r = EVENT_REQUESTS.find(x => x.id === id);
  try {
    await db.from('event_requests').update({ status: 'denied', admin_note: note }).eq('id', id);
    if (r?.userId) await db.from('notifications').insert({
      user_id: r.userId, type: 'update', read: false,
      text: `Your event request "${r.title}" was not approved.${note ? ' Note: ' + note : ''}`
    });
  } catch(e) { console.warn('Deny request failed:', e); }
  eventRequestState[id] = 'denied';
  eventRequestNotes[id] = note;
  refreshRequestCard(id);
  showToast('Request denied — student notified.');
  updateRequestBadge();
}

function showRequestNote(id) {
  showToast('Messaging feature coming with Supabase wiring.');
}

function revokeRequest(id) {
  eventRequestState[id] = 'denied';
  // Remove from calendar
  const idx = CALENDAR_EVENTS.findIndex(e => e.id === 'req-' + id);
  if (idx > -1) CALENDAR_EVENTS.splice(idx, 1);
  refreshRequestCard(id);
  showToast('Event removed from campus calendar.');
  updateRequestBadge();
}

function refreshRequestCard(id) {
  const card = document.getElementById('req-card-' + id);
  const r = EVENT_REQUESTS.find(x => x.id === id);
  if (card && r) {
    const tmp = document.createElement('div');
    tmp.innerHTML = requestCard(r);
    card.replaceWith(tmp.firstElementChild);
  }
}

function updateRequestBadge() {
  const pending = EVENT_REQUESTS.filter(r => eventRequestState[r.id] === 'pending').length;
  const badge   = document.querySelector('#anav-requests .nav-badge');
  if (badge) badge.textContent = pending || '';
  if (badge && !pending) badge.style.display = 'none';
}

/* ── Live Supabase wiring ─────────────────────────────── */
async function loadEventRequestsFromDB() {
  try {
    const data = await fetchAllEventRequests();
    EVENT_REQUESTS.length = 0;
    data.forEach(r => {
      EVENT_REQUESTS.push({
        id: r.id, title: r.title,
        date: r.event_date, start: r.start_time, end: r.end_time,
        space: r.space || 'TBD', org: r.org || '',
        attendance: r.attendance || 0,
        description: r.description || '',
        userId: r.user_id,
        submittedBy: r.profiles ? `${r.profiles.first_name} ${r.profiles.last_name}` : 'Student',
        submittedAt: timeAgoAdmin ? timeAgoAdmin(r.created_at) : 'Recently',
        status: r.status || 'pending',
        points: r.points || 50,
        adminNote: r.admin_note || '',
      });
      eventRequestState[r.id] = r.status || 'pending';
    });
    const content = document.getElementById('admin-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.id === 'anav-requests') {
      content.innerHTML = renderAdminRequests();
    }
  } catch(e) { console.warn('Event requests load failed:', e); }
}

// Approve/deny wired directly in approveRequest and confirmDenyRequest above
