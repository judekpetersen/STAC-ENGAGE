/* ============================================================
   STAC Engage — Admin: Students
   Supabase: query `profiles` with engagement metrics
   ============================================================ */

let studentFilter = 'all';
let studentSearch  = '';

function renderAdminStudents() {
  // TODO (Supabase):
  // const { data } = await db.from('profiles')
  //   .select('*, rsvps(count), event_checkins(count), challenge_claims(count)')
  //   .order('score', { ascending: false });
  const filtered = ADMIN_STUDENTS.filter(s => {
    const matchesFilter = studentFilter === 'all' || s.status === studentFilter;
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase())
      || s.major.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Students</h1>
      <p>${ADMIN_STUDENTS.length} enrolled · ${ADMIN_STUDENTS.filter(s=>s.status==='atrisk').length} at-risk</p>
    </div>

    <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap;">
      <div class="search-bar" style="flex:1;min-width:220px;margin-bottom:0;">
        <i class="ti ti-search"></i>
        <input
          placeholder="Search by name or major..."
          value="${studentSearch}"
          oninput="setStudentSearch(this.value)"
          id="student-search"
        >
      </div>
      <div class="filter-pills" style="margin-bottom:0;">
        ${['all','active','atrisk'].map(f => `
          <button class="filter-pill ${studentFilter === f ? 'active' : ''}"
            onclick="setStudentFilter('${f}')">
            ${f === 'atrisk' ? 'At-risk' : f.charAt(0).toUpperCase() + f.slice(1)}
            ${f === 'atrisk' ? `(${ADMIN_STUDENTS.filter(s=>s.status==='atrisk').length})` : ''}
          </button>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-body" style="padding:0;overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Major</th>
              <th>Score</th>
              <th>Events</th>
              <th>Streak</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(s => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:9px;">
                    <div class="stu-av" style="background:${s.bg};color:${s.fc};">${s.ini}</div>
                    <div>
                      <div class="td-name">${s.name}</div>
                      <div class="td-meta">Class of ${s.year}</div>
                    </div>
                  </div>
                </td>
                <td>${s.major}</td>
                <td>
                  <div style="font-weight:500;">${s.score}</div>
                  <div class="bar-wrap" style="width:70px;margin-top:3px;">
                    <div class="bar-fill" style="width:${Math.round(s.score/1204*100)}%;background:#6b1a1a;"></div>
                  </div>
                </td>
                <td>${s.events}</td>
                <td>${s.streak > 0 ? `${s.streak} wks` : '<span style="color:#8a8a80;">—</span>'}</td>
                <td>
                  <span class="status-badge status-${s.status}">
                    ${s.status === 'atrisk' ? 'At-risk' : 'Active'}
                  </span>
                </td>
                <td>
                  <div class="action-row">
                    <button class="tbtn" onclick="viewStudentProfile(${s.id})">
                      <i class="ti ti-eye" style="font-size:12px;"></i> View
                    </button>
                    <button class="btn-secondary" onclick="sendStudentNotif(${s.id})">
                      <i class="ti ti-send" style="font-size:12px;"></i> Notify
                    </button>
                  </div>
                </td>
              </tr>`).join('')}
            ${filtered.length === 0 ? `
              <tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-3);">No students match your filter</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function setStudentFilter(f) {
  studentFilter = f;
  refreshStudentsTab();
}

function setStudentSearch(q) {
  studentSearch = q;
  refreshStudentsTab();
}

function refreshStudentsTab() {
  const content = document.getElementById('admin-content');
  if (content) content.innerHTML = renderAdminStudents();
  // Re-focus search input
  const inp = document.getElementById('student-search');
  if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
}

function viewStudentProfile(id) {
  const s = ADMIN_STUDENTS.find(x => x.id === id);
  showToast(`Viewing ${s.name}'s full profile — coming in next release.`);
}

function sendStudentNotif(id) {
  const s = ADMIN_STUDENTS.find(x => x.id === id);
  showToast(`Push notification sent to ${s.name}.`);
  // TODO (Supabase): await db.from('notifications').insert({ user_id: s.supabaseId, text: '...', read: false });
}
