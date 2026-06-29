/* ============================================================
   STAC Engage — Admin: Reports
   Supabase: aggregate queries, export via Edge Function
   ============================================================ */

function renderAdminReports() {
  const totalScore    = ADMIN_STUDENTS.reduce((s, u) => s + u.score, 0);
  const totalEvents   = ADMIN_STUDENTS.reduce((s, u) => s + u.events, 0);
  const avgScore      = Math.round(totalScore / ADMIN_STUDENTS.length);
  const avgEvents     = Math.round(totalEvents / ADMIN_STUDENTS.length);
  const activeRate    = Math.round(ADMIN_STUDENTS.filter(s => s.status === 'active').length / ADMIN_STUDENTS.length * 100);
  const topStudent    = [...ADMIN_STUDENTS].sort((a,b) => b.score - a.score)[0];

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Reports</h1>
      <p>Spring 2026 engagement summary — exportable for the dean's office</p>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:1rem;">
      <button class="btn-secondary" onclick="exportReport('csv')">
        <i class="ti ti-file-spreadsheet" style="font-size:13px;"></i> Export CSV
      </button>
      <button class="btn-secondary" onclick="exportReport('pdf')">
        <i class="ti ti-file-text" style="font-size:13px;"></i> Export PDF
      </button>
    </div>

    <div class="g4" style="margin-bottom:1rem;">
      <div class="stat-card blue">
        <div class="stat-label">Avg. engage score</div>
        <div class="stat-value">${avgScore}</div>
        <div class="stat-sub">All students</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Avg. events attended</div>
        <div class="stat-value">${avgEvents}</div>
        <div class="stat-sub">This semester</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Active rate</div>
        <div class="stat-value">${activeRate}%</div>
        <div class="stat-sub">1+ event this month</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-label">Top student</div>
        <div class="stat-value" style="font-size:16px;">${topStudent.name.split(' ')[0]}</div>
        <div class="stat-sub">${topStudent.score} pts</div>
      </div>
    </div>

    <div class="g2">

      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-users"></i>Engagement by org</div>
        </div>
        <div class="card-body">
          ${ORG_ENGAGEMENT.map((o, i) => `
            <div class="chart-bar-wrap">
              <span class="chart-bar-label">${o.name}</span>
              <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width:${Math.round(o.pts/ORG_ENGAGEMENT[0].pts*100)}%;background:${o.color};"></div>
              </div>
              <span class="chart-bar-val">${(o.pts/1000).toFixed(1)}k</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-chart-pie"></i>Pathway completion</div>
        </div>
        <div class="card-body">
          ${DATA.pathways.map(p => `
            <div class="chart-bar-wrap">
              <span class="chart-bar-label">${p.name.split(' ')[0]} & ${p.name.split(' ')[2]||''}</span>
              <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width:${p.pct}%;background:${p.color};"></div>
              </div>
              <span class="chart-bar-val">${p.pct}%</span>
            </div>`).join('')}
        </div>
      </div>

    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-table"></i>Full student engagement table</div>
        <span class="pill" style="background:#FBE6E6;color:#7C0C0C;">${ADMIN_STUDENTS.length} students</span>
      </div>
      <div class="card-body" style="padding:0;overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Major</th>
              <th>Score</th>
              <th>Events</th>
              <th>Streak</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${[...ADMIN_STUDENTS].sort((a,b) => b.score - a.score).map((s, i) => `
              <tr>
                <td style="color:var(--text-3);font-weight:500;">${i+1}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="stu-av" style="background:${s.bg};color:${s.fc};">${s.ini}</div>
                    <span class="td-name">${s.name}</span>
                  </div>
                </td>
                <td>${s.major}</td>
                <td style="font-weight:500;">${s.score}</td>
                <td>${s.events}</td>
                <td>${s.streak > 0 ? s.streak + ' wks' : '—'}</td>
                <td><span class="status-badge status-${s.status}">${s.status === 'atrisk' ? 'At-risk' : 'Active'}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-calendar-stats"></i>Event performance</div>
      </div>
      <div class="card-body" style="padding:0;overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Type</th>
              <th>RSVPs</th>
              <th>Check-ins</th>
              <th>Pts awarded</th>
              <th>Attendance rate</th>
            </tr>
          </thead>
          <tbody>
            ${ADMIN_EVENTS_CREATED.map(e => {
              const rsvps = Math.floor(e.capacity * 0.6);
              const rate  = e.checkins > 0 ? Math.round(e.checkins / rsvps * 100) : 0;
              return `<tr>
                <td class="td-name">${e.name}</td>
                <td>${e.date}</td>
                <td><span class="status-badge status-active">${e.type}</span></td>
                <td>${rsvps}</td>
                <td>${e.checkins > 0 ? e.checkins : '—'}</td>
                <td>${e.checkins > 0 ? e.checkins * e.points : '—'}</td>
                <td>${e.checkins > 0
                  ? `<div style="display:flex;align-items:center;gap:6px;">
                      <div class="bar-wrap" style="width:60px;"><div class="bar-fill" style="width:${rate}%;background:#6b1a1a;"></div></div>
                      <span>${rate}%</span>
                    </div>`
                  : '—'}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function exportReport(format) {
  showToast(`Report exported as ${format.toUpperCase()} — check your downloads.`);
  // TODO (Supabase Edge Function): call /functions/v1/export-report?format=csv&semester=spring-2026
}
