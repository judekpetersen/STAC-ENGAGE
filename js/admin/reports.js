/* ============================================================
   STAC Engage — Admin: Reports
   Supabase: aggregate queries, export via Edge Function
   ============================================================ */

function renderAdminReports() {
  const empty = ADMIN_STUDENTS.length === 0;
  const totalScore  = ADMIN_STUDENTS.reduce((s, u) => s + (u.score||0), 0);
  const totalEvents = ADMIN_STUDENTS.reduce((s, u) => s + (u.events||0), 0);
  const avgScore    = empty ? 0 : Math.round(totalScore / ADMIN_STUDENTS.length);
  const avgEvents   = empty ? 0 : Math.round(totalEvents / ADMIN_STUDENTS.length);
  const activeRate  = empty ? 0 : Math.round(ADMIN_STUDENTS.filter(s => s.status === 'active').length / ADMIN_STUDENTS.length * 100);
  const topStudent  = empty ? null : [...ADMIN_STUDENTS].sort((a,b) => b.score - a.score)[0];

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Reports</h1>
      <p>Current semester engagement — exportable for the dean's office</p>
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
        <div class="stat-value" style="font-size:16px;">${topStudent ? topStudent.name.split(' ')[0] : '—'}</div>
        <div class="stat-sub">${topStudent ? topStudent.score + ' pts' : 'No students yet'}</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-users"></i>Engagement by org</div></div>
        <div class="card-body">
          ${ORG_ENGAGEMENT.length === 0
            ? `<div style="text-align:center;padding:1.5rem;color:#8a8a80;font-size:13px;">No org data yet — available once students join orgs</div>`
            : ORG_ENGAGEMENT.map(o => `
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
        <div class="card-head"><div class="card-title"><i class="ti ti-chart-pie"></i>Spartan Spirit completion</div></div>
        <div class="card-body">
          ${SPARTAN_SPIRITS.map(p => `
            <div class="chart-bar-wrap">
              <span class="chart-bar-label">${p.name.replace(' Spartan','')}</span>
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
        ${ADMIN_STUDENTS.length === 0
          ? `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No students yet — data populates as students sign up</div>`
          : `<table class="data-table">
              <thead><tr>
                <th>#</th><th>Student</th><th>Major</th>
                <th>Score</th><th>Events</th><th>Streak</th><th>Status</th>
              </tr></thead>
              <tbody>
                ${[...ADMIN_STUDENTS].sort((a,b) => b.score - a.score).map((s, i) => `
                  <tr>
                    <td style="color:var(--text-3);font-weight:500;">${i+1}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px;">
                        <div class="stu-av" style="background:${s.bg||'#FBE6E6'};color:${s.fc||'#6b1a1a'};">${s.ini||'?'}</div>
                        <span class="td-name">${s.name}</span>
                      </div>
                    </td>
                    <td>${s.major||'—'}</td>
                    <td style="font-weight:500;">${s.score||0}</td>
                    <td>${s.events||0}</td>
                    <td>${s.streak > 0 ? s.streak + ' wks' : '—'}</td>
                    <td><span class="status-badge status-${s.status||'active'}">${s.status === 'atrisk' ? 'At-risk' : 'Active'}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>`}
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div class="card-title"><i class="ti ti-calendar-stats"></i>Event performance</div></div>
      <div class="card-body" style="padding:0;overflow-x:auto;">
        ${ADMIN_EVENTS_CREATED.length === 0
          ? `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No events created yet</div>`
          : `<table class="data-table">
              <thead><tr>
                <th>Event</th><th>Date</th><th>Type</th>
                <th>RSVPs</th><th>Check-ins</th><th>Pts awarded</th><th>Rate</th>
              </tr></thead>
              <tbody>
                ${ADMIN_EVENTS_CREATED.map(e => {
                  const rsvps = Math.floor((e.capacity||0) * 0.6);
                  const rate  = e.checkins > 0 ? Math.round(e.checkins / Math.max(rsvps,1) * 100) : 0;
                  return `<tr>
                    <td class="td-name">${e.name}</td>
                    <td>${e.date}</td>
                    <td><span class="status-badge status-active">${e.type||'general'}</span></td>
                    <td>${rsvps}</td>
                    <td>${e.checkins > 0 ? e.checkins : '—'}</td>
                    <td>${e.checkins > 0 ? e.checkins * (e.points||50) : '—'}</td>
                    <td>${e.checkins > 0
                      ? `<div style="display:flex;align-items:center;gap:6px;">
                          <div class="bar-wrap" style="width:60px;"><div class="bar-fill" style="width:${rate}%;background:#6b1a1a;"></div></div>
                          <span>${rate}%</span>
                        </div>` : '—'}
                    </td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>`}
      </div>
    </div>
  </div>`;
}

async function exportReport(format) {
  try {
    if (format === 'csv') {
      // Fetch full data from Supabase
      const { data: students } = await db
        .from('profiles')
        .select('first_name, last_name, major, year, score, streak_weeks')
        .order('score', { ascending: false });

      const { data: rsvps } = await db
        .from('rsvps')
        .select('user_id, checked_in, events(title, event_date)');

      const { data: service } = await db
        .from('service_hours')
        .select('user_id, hours, status');

      // Build CSV
      const rows = (students || []).map(s => {
        const myRsvps   = (rsvps || []).filter(r => r.user_id === s.id);
        const myService = (service || []).filter(h => h.user_id === s.id && h.status === 'approved');
        const totalHrs  = myService.reduce((t, h) => t + parseFloat(h.hours || 0), 0);
        return [
          `${s.first_name} ${s.last_name}`,
          s.major || '',
          s.year || '',
          s.score || 0,
          myRsvps.length,
          myRsvps.filter(r => r.checked_in).length,
          totalHrs.toFixed(1),
          s.streak_weeks || 0,
        ].join(',');
      });

      const header = 'Name,Major,Year,Score,RSVPs,Check-ins,Service Hours,Streak Weeks';
      const csv    = [header, ...rows].join('\n');
      const blob   = new Blob([csv], { type: 'text/csv' });
      const url    = URL.createObjectURL(blob);
      const a      = document.createElement('a');
      a.href = url;
      a.download = `stac-engage-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Report exported as CSV.');
    } else {
      showToast('PDF export coming soon — use CSV for now.');
    }
  } catch(e) {
    console.error('Export failed:', e);
    showToast('Export failed — check connection.');
  }
}
