/* ============================================================
   STAC Engage — Admin: Overview
   ============================================================ */

function renderAdminOverview() {
  const totalStudents  = ADMIN_STUDENTS.length;
  const activeStudents = ADMIN_STUDENTS.filter(s => s.status === 'active').length;
  const atRisk         = ADMIN_STUDENTS.filter(s => s.status === 'atrisk').length;
  const pending        = ADMIN_BOOKINGS.filter(b => bookingState[b.id] === 'pending').length;
  const avgScore       = totalStudents
    ? Math.round(ADMIN_STUDENTS.reduce((s, u) => s + u.score, 0) / totalStudents)
    : 0;
  const reqPending = EVENT_REQUESTS.filter(r => eventRequestState[r.id] === 'pending').length;
  const heatColors = ['#f0efe9','#f0d4d4','#d48f8f','#b85555','#6b1a1a'];

  const empty = n => `<div style="text-align:center;padding:1.5rem;color:#8a8a80;font-size:13px;">${n}</div>`;

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Overview</h1>
      <p>${totalStudents === 0 ? 'No students yet — share the link and watch it fill up' : `${totalStudents} students enrolled`}</p>
    </div>

    <div class="g4" style="margin-bottom:1rem;">
      <div class="stat-card blue"><div class="stat-label">Active students</div><div class="stat-value">${activeStudents}</div><div class="stat-sub">${totalStudents} total enrolled</div></div>
      <div class="stat-card amber"><div class="stat-label">Avg. score</div><div class="stat-value">${avgScore}</div><div class="stat-sub">Across all students</div></div>
      <div class="stat-card ${atRisk>0?'amber':'green'}"><div class="stat-label">At-risk students</div><div class="stat-value">${atRisk}</div><div class="stat-sub">${atRisk>0?'Low engagement':'All engaged'}</div></div>
      <div class="stat-card blue"><div class="stat-label">Pending bookings</div><div class="stat-value">${pending}</div><div class="stat-sub">${reqPending} event requests</div></div>
    </div>

    ${reqPending > 0 ? `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#FAEEDA;border-radius:var(--radius-lg);margin-bottom:1rem;border:1px solid #c8b560;cursor:pointer;" onclick="adminSwitchTab('requests')">
      <div style="display:flex;align-items:center;gap:8px;">
        <i class="ti ti-calendar-plus" style="color:#854F0B;font-size:16px;"></i>
        <span style="font-size:13px;font-weight:500;color:#854F0B;">${reqPending} event request${reqPending>1?'s':''} awaiting approval</span>
      </div>
      <span style="font-size:12px;color:#854F0B;">Review →</span>
    </div>` : ''}

    <div class="g2">
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-clock"></i>Pending bookings</div><span class="card-action" onclick="adminSwitchTab('bookings')">Manage all</span></div>
        <div class="card-body">${pending === 0 ? empty('No pending bookings') : ADMIN_BOOKINGS.filter(b=>bookingState[b.id]==='pending').map(b=>`
          <div class="row">
            <div class="row-icon" style="background:#FAEEDA;"><i class="ti ti-building" style="color:#854F0B;"></i></div>
            <div class="row-info"><div class="row-name">${b.purpose}</div><div class="row-meta">${b.space} · ${b.date}</div></div>
            <div class="action-row">
              <button class="btn-approve" onclick="adminApproveBooking('${b.id}')">Approve</button>
              <button class="btn-deny" onclick="adminDenyBooking('${b.id}')">Deny</button>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-alert-triangle"></i>At-risk students</div><span class="card-action" onclick="adminSwitchTab('students')">View all</span></div>
        <div class="card-body">${atRisk === 0
          ? `<div style="display:flex;align-items:center;gap:10px;padding:8px;background:#EAF3DE;border-radius:var(--radius);">
               <i class="ti ti-check" style="color:#3B6D11;font-size:18px;"></i>
               <span style="font-size:13px;color:#3B6D11;font-weight:500;">${totalStudents === 0 ? 'No students yet' : 'All students actively engaged'}</span>
             </div>`
          : ADMIN_STUDENTS.filter(s=>s.status==='atrisk').map(s=>`
            <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#FBE6E6;border-radius:var(--radius);margin-bottom:8px;">
              <div class="stu-av" style="background:${s.bg};color:${s.fc};">${s.ini}</div>
              <div style="flex:1;"><div style="font-size:13px;font-weight:500;color:var(--text);">${s.name}</div>
              <div style="font-size:11px;color:#8a8a80;">${s.score} pts · ${s.events} events</div></div>
              <div class="action-row">
                <button class="btn-secondary" onclick="messageStudent('${s.id}')"><i class="ti ti-message-circle" style="font-size:11px;"></i> Message</button>
                <button class="btn-secondary" onclick="flagForAdvisor('${s.id}')">Flag</button>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-chart-bar"></i>Org engagement</div><span class="card-action" onclick="adminSwitchTab('reports')">Full report</span></div>
        <div class="card-body">${ORG_ENGAGEMENT.length === 0 ? `<div style="text-align:center;padding:1.5rem;color:#8a8a80;font-size:13px;">No org data yet</div>` : ORG_ENGAGEMENT.map(o=>`
          <div class="chart-bar-wrap">
            <span class="chart-bar-label">${o.name}</span>
            <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${Math.round(o.pts/ORG_ENGAGEMENT[0].pts*100)}%;background:${o.color};"></div></div>
            <span class="chart-bar-val">${(o.pts/1000).toFixed(1)}k</span>
          </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-calendar-event"></i>Upcoming events</div><span class="card-action" onclick="adminSwitchTab('events')">Manage</span></div>
        <div class="card-body">${ADMIN_EVENTS_CREATED.length === 0 ? empty('No events created yet') : ADMIN_EVENTS_CREATED.map(e=>`
          <div class="row">
            <div class="row-icon" style="background:#FBE6E6;"><i class="ti ti-calendar" style="color:#6b1a1a;"></i></div>
            <div class="row-info"><div class="row-name">${e.name}</div><div class="row-meta">${e.date} · Cap. ${e.capacity}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function adminApproveBooking(id) {
  bookingState[id] = 'approved';
  adminSwitchTab('overview');
  showToast('Booking approved — student notified.');
}
function adminDenyBooking(id) {
  bookingState[id] = 'denied';
  adminSwitchTab('overview');
  showToast('Booking denied.');
}
function adminNotifyStudent(id) {
  const s = ADMIN_STUDENTS.find(x => x.id === id);
  if (s) showToast(`Outreach sent to ${s.name}.`);
}
function flagForAdvisor(id) {
  const s = ADMIN_STUDENTS.find(x => x.id === id);
  if (s) showToast(`${s.name} flagged for advisor follow-up.`);
}
function openSpotForWaitlist() {
  showToast('First student on waitlist notified of available spot.');
}
