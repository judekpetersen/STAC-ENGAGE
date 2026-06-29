/* ============================================================
   STAC Engage — Admin: Students (live from Supabase)
   ============================================================ */

let studentFilter = 'all';
let studentSearch = '';
let liveStudents  = [];

async function loadStudentsFromDB() {
  try {
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .order('score', { ascending: false });
    if (error) throw error;

    liveStudents = (data || []).map(p => ({
      id:     p.id,
      name:   (p.first_name || '') + ' ' + (p.last_name || ''),
      ini:    ((p.first_name||'?')[0] + (p.last_name||'?')[0]).toUpperCase(),
      major:  p.major || '—',
      year:   p.year  || '—',
      score:  p.score || 0,
      events: 0,
      streak: p.streak_weeks || 0,
      status: p.score > 0 ? 'active' : 'active',
      bg:     '#EAF3DE',
      fc:     '#173404',
    }));

    // Sync to ADMIN_STUDENTS for reports etc.
    ADMIN_STUDENTS.length = 0;
    liveStudents.forEach(s => ADMIN_STUDENTS.push(s));

    // Refresh if on students tab
    const content = document.getElementById('admin-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.id === 'anav-students') {
      content.innerHTML = renderAdminStudents();
    }
  } catch(e) {
    console.warn('Students load failed:', e);
  }
}

function renderAdminStudents() {
  const students = liveStudents.length > 0 ? liveStudents : ADMIN_STUDENTS;
  const filtered = students.filter(s => {
    if (studentFilter === 'atrisk') return s.status === 'atrisk';
    if (studentSearch) return s.name.toLowerCase().includes(studentSearch.toLowerCase()) || (s.major||'').toLowerCase().includes(studentSearch.toLowerCase());
    return true;
  });

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Students</h1>
      <p>${students.length} enrolled · ${students.filter(s=>s.status==='atrisk').length} at-risk</p>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:1rem;align-items:center;flex-wrap:wrap;">
      <div class="search-bar" style="flex:1;min-width:200px;">
        <i class="ti ti-search"></i>
        <input type="text" placeholder="Search students..." value="${studentSearch}"
          oninput="studentSearch=this.value;const c=document.getElementById('admin-content');if(c)c.innerHTML=renderAdminStudents();">
      </div>
      <div class="filter-pills" style="margin-bottom:0;">
        ${['all','atrisk'].map(f=>`
          <button class="filter-pill ${studentFilter===f?'active':''}" onclick="studentFilter='${f}';const c=document.getElementById('admin-content');if(c)c.innerHTML=renderAdminStudents();">
            ${f==='all'?'All students':'At-risk'}
          </button>`).join('')}
      </div>
      <button class="btn-secondary" onclick="loadStudentsFromDB()">
        <i class="ti ti-refresh" style="font-size:12px;"></i> Refresh
      </button>
    </div>

    <div class="card">
      <div class="card-body" style="padding:0;overflow-x:auto;">
        ${filtered.length === 0
          ? `<div style="text-align:center;padding:3rem;color:#8a8a80;font-size:13px;">
              <i class="ti ti-users" style="font-size:36px;display:block;margin-bottom:10px;color:#d0cfc8;"></i>
              ${students.length === 0 ? 'No students have signed up yet' : 'No students match your search'}
             </div>`
          : `<table class="data-table">
              <thead><tr>
                <th>Student</th><th>Major</th><th>Year</th>
                <th>Score</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                ${filtered.map(s => `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:9px;">
                        <div class="stu-av" style="background:${s.bg};color:${s.fc};">${s.ini}</div>
                        <div>
                          <div class="td-name">${s.name}</div>
                          ${(STUDENT_POSITIONS[s.id]||[]).length ? `
                            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:2px;">
                              ${(STUDENT_POSITIONS[s.id]||[]).map(p=>{
                                const pc=POSITION_COLORS[p.position]||{bg:'#FBE6E6',color:'#6b1a1a'};
                                return `<span class="pill" style="background:${pc.bg};color:${pc.color};font-size:9px;padding:2px 6px;">${p.position} — ${p.org}</span>`;
                              }).join('')}
                            </div>` : ''}
                        </div>
                      </div>
                    </td>
                    <td>${s.major}</td>
                    <td>${s.year}</td>
                    <td style="font-weight:500;">${s.score}</td>
                    <td><span class="status-badge status-${s.status||'active'}">${s.status==='atrisk'?'At-risk':'Active'}</span></td>
                    <td>
                      <div class="action-row">
                        <button class="btn-secondary" onclick="messageStudent('${s.id}','${s.name}')">
                          <i class="ti ti-message-circle" style="font-size:11px;"></i> Message
                        </button>
                        <button class="btn-secondary" onclick="sendStudentNotif('${s.id}')">
                          <i class="ti ti-send" style="font-size:11px;"></i> Notify
                        </button>
                      </div>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>`}
      </div>
    </div>
  </div>`;
}

function sendStudentNotif(id) {
  showToast('Notification sent to student.');
}

function viewStudentProfile(id) {
  adminSwitchTab('students');
}
