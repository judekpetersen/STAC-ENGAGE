/* ============================================================
   STAC Engage v7 — Admin Overview (+ early alert, waitlist mgmt)
   ============================================================ */

function renderAdminOverview() {
  const totalStudents  = ADMIN_STUDENTS.length;
  const activeStudents = ADMIN_STUDENTS.filter(s => s.status === 'active').length;
  const atRisk         = ADMIN_STUDENTS.filter(s => s.status === 'atrisk').length;
  const pending        = ADMIN_BOOKINGS.filter(b => bookingState[b.id] === 'pending').length;
  const avgScore       = Math.round(ADMIN_STUDENTS.reduce((s, u) => s + u.score, 0) / totalStudents);
  const heatColors     = ['#f0efe9','#f0d4d4','#d48f8f','#b85555','#6b1a1a'];
  const waitlistCount  = Object.values(waitlistState).filter(Boolean).length;

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Overview</h1>
      <p>Spring 2026 · ${totalStudents} students enrolled</p>
    </div>

    <div class="g4" style="margin-bottom:1rem;">
      <div class="stat-card blue">
        <div class="stat-label">Active students</div>
        <div class="stat-value">${activeStudents}</div>
        <div class="stat-delta delta-up">${Math.round(activeStudents/totalStudents*100)}% of enrolled</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Avg. score</div>
        <div class="stat-value">${avgScore}</div>
        <div class="stat-sub">Across all students</div>
      </div>
      <div class="stat-card ${atRisk>0?'amber':'green'}">
        <div class="stat-label">At-risk students</div>
        <div class="stat-value">${atRisk}</div>
        <div class="stat-sub" style="color:${atRisk>0?'var(--amber)':'var(--green)'};">
          ${atRisk>0?'Needs attention':'All engaged'}
        </div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">Pending bookings</div>
        <div class="stat-value">${pending}</div>
        <div class="stat-sub">${waitlistCount} on waitlists</div>
      </div>
    </div>

    <!-- Early alert system -->
    <div class="card" style="margin-bottom:1rem;${atRisk>0?'border-color:#993556;border-width:1.5px;':''}">
      <div class="card-head">
        <div class="card-title" style="color:${atRisk>0?'#993556':'var(--text)'};">
          <i class="ti ti-alert-triangle" style="color:${atRisk>0?'#993556':'#8a8a80'};"></i>
          Early alert system
        </div>
        <span class="card-action" onclick="adminSwitchTab('students')">View all students</span>
      </div>
      <div class="card-body">
        ${atRisk===0
          ? `<div style="display:flex;align-items:center;gap:10px;padding:8px;background:#EAF3DE;border-radius:var(--radius);">
               <i class="ti ti-check" style="color:#3B6D11;font-size:18px;"></i>
               <span style="font-size:13px;color:#3B6D11;font-weight:500;">All students are actively engaged this week</span>
             </div>`
          : ADMIN_STUDENTS.filter(s => s.status==='atrisk').map(s => `
              <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#FBE6E6;border-radius:var(--radius);margin-bottom:8px;">
                <div class="stu-av" style="background:${s.bg};color:${s.fc};">${s.ini}</div>
                <div style="flex:1;">
                  <div style="font-size:13px;font-weight:500;color:var(--text);">${s.name}</div>
                  <div style="font-size:11px;color:#8a8a80;">${s.score} pts · ${s.events} events · ${s.streak}-wk streak · ${s.major}</div>
                  <div style="font-size:11px;color:#993556;margin-top:2px;">
                    <i class="ti ti-info-circle" style="font-size:11px;"></i>
                    ${s.score < 100 ? 'Very low engagement — may need outreach' : 'Below average engagement — monitor closely'}
                  </div>
                </div>
                <div class="action-row">
                  <button class="btn-secondary" onclick="sendStudentNotif(${s.id})">
                    <i class="ti ti-send" style="font-size:11px;"></i> Notify
                  </button>
                  <button class="btn-secondary" onclick="flagForAdvisor(${s.id})">
                    Flag
                  </button>
                </div>
              </div>`).join('')}
        <div style="margin-top:${atRisk>0?'10px':'0'};padding-top:${atRisk>0?'10px':'0'};${atRisk>0?'border-top:1px solid var(--border);':''}">
          <div style="font-size:12px;color:#8a8a80;margin-bottom:6px;">Alert thresholds</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span style="font-size:11px;background:#FAEEDA;color:#854F0B;padding:3px 9px;border-radius:999px;">Score &lt; 200 pts</span>
            <span style="font-size:11px;background:#FAEEDA;color:#854F0B;padding:3px 9px;border-radius:999px;">0 events in 2 weeks</span>
            <span style="font-size:11px;background:#FAEEDA;color:#854F0B;padding:3px 9px;border-radius:999px;">Streak broken 2+ weeks</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Waitlist management -->
    ${waitlistCount > 0 ? `
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-list-check"></i>Waitlists</div>
        <span class="pill" style="background:#FAEEDA;color:#412402;">${waitlistCount} waiting</span>
      </div>
      <div class="card-body">
        ${DATA.events.filter(e => WAITLIST_EVENTS[e.id]).map(e => `
          <div class="row">
            <div class="row-icon" style="background:${e.tc};"><i class="ti ti-calendar" style="color:${e.bc};"></i></div>
            <div class="row-info">
              <div class="row-name">${e.name}</div>
              <div class="row-meta">${e.loc} · ${e.month} ${e.day}</div>
            </div>
            <button class="btn-approve" onclick="openSpotForWaitlist(${e.id})">Open a spot</button>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <div class="g2">
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-clock"></i>Pending bookings</div>
          <span class="card-action" onclick="adminSwitchTab('bookings')">Manage all</span>
        </div>
        <div class="card-body">
          ${pending===0
            ? `<div style="text-align:center;padding:1rem;color:#8a8a80;font-size:13px;">No pending bookings</div>`
            : ADMIN_BOOKINGS.filter(b => bookingState[b.id]==='pending').map(b => `
                <div class="row">
                  <div class="row-icon" style="background:#FAEEDA;"><i class="ti ti-building" style="color:#854F0B;"></i></div>
                  <div class="row-info">
                    <div class="row-name">${b.purpose}</div>
                    <div class="row-meta">${b.space.split(' — ')[0]} · ${b.date}</div>
                  </div>
                  <div class="action-row">
                    <button class="btn-approve" onclick="adminApproveBooking(${b.id})">Approve</button>
                    <button class="btn-deny" onclick="adminDenyBooking(${b.id})">Deny</button>
                  </div>
                </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-chart-bar"></i>Org engagement</div>
          <span class="card-action" onclick="adminSwitchTab('reports')">Full report</span>
        </div>
        <div class="card-body">
          ${ORG_ENGAGEMENT.map(o => `
            <div class="chart-bar-wrap">
              <span class="chart-bar-label">${o.name}</span>
              <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width:${Math.round(o.pts/ORG_ENGAGEMENT[0].pts*100)}%;background:${o.color};"></div>
              </div>
              <span class="chart-bar-val">${(o.pts/1000).toFixed(1)}k</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-chart-dots"></i>Engagement heatmap — June 2026</div>
      </div>
      <div class="card-body">
        <div class="heatmap-grid">
          <div class="heatmap-label"></div>
          ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="heatmap-header">${d}</div>`).join('')}
          ${ENGAGEMENT_HEATMAP.map(row=>`
            <div class="heatmap-label">${row[0]}</div>
            ${row.slice(1).map(v=>`<div class="heatmap-cell" style="background:${heatColors[v]};color:${v>2?'#fff':'var(--text-3)'};">${v>0?v:''}</div>`).join('')}`).join('')}
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:10px;justify-content:flex-end;">
          <span style="font-size:11px;color:#8a8a80;">Less</span>
          ${heatColors.map(c=>`<div style="width:16px;height:16px;border-radius:3px;background:${c};border:1px solid var(--border);"></div>`).join('')}
          <span style="font-size:11px;color:#8a8a80;">More</span>
        </div>
      </div>
    </div>
  </div>`;
}

function flagForAdvisor(id) {
  const s = ADMIN_STUDENTS.find(x => x.id === id);
  showToast(`${s.name} flagged for advisor follow-up.`);
}

function openSpotForWaitlist(eventId) {
  showToast('First student on waitlist notified of available spot.');
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
  showToast(`Outreach sent to ${s.name}.`);
}

// Patch overview to show event request count
const _origOverview = renderAdminOverview;
window.renderAdminOverview = function() {
  const html = _origOverview();
  const reqPending = EVENT_REQUESTS.filter(r => eventRequestState[r.id] === 'pending').length;
  if (reqPending > 0) {
    const alertEl = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#FAEEDA;border-radius:var(--radius);margin-bottom:10px;cursor:pointer;" onclick="adminSwitchTab('requests')">
        <div style="display:flex;align-items:center;gap:8px;">
          <i class="ti ti-calendar-plus" style="color:#854F0B;font-size:16px;"></i>
          <span style="font-size:13px;font-weight:500;color:#854F0B;">${reqPending} event request${reqPending>1?'s':''} awaiting approval</span>
        </div>
        <span style="font-size:12px;color:#854F0B;">Review →</span>
      </div>`;
    return html.replace(
      '<div class="card" style="margin-bottom:1rem;">',
      alertEl + '<div class="card" style="margin-bottom:1rem;">'
    );
  }
  return html;
};
