/* ============================================================
   STAC Engage v17 — Admin: Academic Calendar
   Admins post/edit/remove academic dates that appear on
   every student's calendar tab
   ============================================================ */

function renderAdminAcademic() {
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Academic calendar</h1>
      <p>Post important dates that appear on every student's calendar</p>
    </div>

    <!-- Add new date -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-plus"></i>Add academic date</div></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">
          <div class="field" style="margin-bottom:0;">
            <label>Title</label>
            <input type="text" id="ac-title" placeholder="e.g. Last day to withdraw">
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>Date</label>
            <input type="date" id="ac-date">
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>Type</label>
            <select id="ac-type">
              ${ACADEMIC_EVENT_TYPES.map(t => `<option value="${t.id}">${t.label}</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;">
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="addAcademicDate()">
            <i class="ti ti-calendar-plus"></i> Add to calendar
          </button>
        </div>
      </div>
    </div>

    <!-- Current academic dates -->
    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-calendar-event"></i>Posted dates</div>
        <span class="pill" style="background:#FBE6E6;color:#6b1a1a;">${ACADEMIC_CALENDAR.length} dates</span>
      </div>
      <div class="card-body" style="padding:0;" id="academic-list">
        ${academicListHTML()}
      </div>
    </div>
  </div>`;
}

function academicListHTML() {
  if (ACADEMIC_CALENDAR.length === 0) {
    return `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No academic dates posted yet</div>`;
  }
  const sorted = [...ACADEMIC_CALENDAR].sort((a,b) => a.date.localeCompare(b.date));
  return sorted.map(ev => {
    const type = ACADEMIC_EVENT_TYPES.find(t => t.id === ev.type) || ACADEMIC_EVENT_TYPES[5];
    const [y,m,d] = ev.date.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid var(--border);">
      <div style="width:44px;height:44px;border-radius:var(--radius);background:${type.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="font-size:9px;font-weight:600;color:${type.color};text-transform:uppercase;">${months[parseInt(m)-1]}</span>
        <span style="font-size:16px;font-weight:500;color:${type.color};line-height:1.1;">${parseInt(d)}</span>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:500;color:var(--text);">${ev.title}</div>
        <span class="pill" style="background:${type.bg};color:${type.color};margin-top:3px;display:inline-flex;">${type.label}</span>
      </div>
      <button class="btn-deny" style="font-size:11px;padding:4px 10px;" onclick="removeAcademicDate('${ev.id}')">Remove</button>
    </div>`;
  }).join('');
}

async function addAcademicDate() {
  const title = document.getElementById('ac-title').value.trim();
  const date  = document.getElementById('ac-date').value;
  const type  = document.getElementById('ac-type').value;
  if (!title || !date) { alert('Please enter a title and date.'); return; }

  const typeObj = ACADEMIC_EVENT_TYPES.find(t => t.id === type);
  try {
    const { data, error } = await db.from('academic_calendar').insert({
      title, event_date: date, type, color: typeObj.color, bg: typeObj.bg
    }).select().single();
    if (error) throw error;

    ACADEMIC_CALENDAR.push({
      id: data.id, title, date, type, color: typeObj.color, bg: typeObj.bg
    });
    showToast(`"${title}" added to student calendars.`);
    document.getElementById('ac-title').value = '';
    document.getElementById('ac-date').value  = '';
    const list = document.getElementById('academic-list');
    if (list) list.innerHTML = academicListHTML();
  } catch(e) {
    console.error('Add academic date failed:', e);
    showToast('Could not add — check connection.');
  }
}

async function removeAcademicDate(id) {
  try {
    const { error } = await db.from('academic_calendar').delete().eq('id', id);
    if (error) throw error;
    const idx = ACADEMIC_CALENDAR.findIndex(e => e.id === id);
    if (idx > -1) ACADEMIC_CALENDAR.splice(idx, 1);
    showToast('Date removed from student calendars.');
    const list = document.getElementById('academic-list');
    if (list) list.innerHTML = academicListHTML();
  } catch(e) {
    console.error('Remove academic date failed:', e);
    showToast('Could not remove — check connection.');
  }
}

async function loadAcademicDatesFromDB() {
  try {
    const data = await fetchAcademicDates();
    ACADEMIC_CALENDAR.length = 0;
    data.forEach(d => ACADEMIC_CALENDAR.push({
      id: d.id, title: d.title, date: d.event_date, type: d.type, color: d.color, bg: d.bg
    }));
    const list = document.getElementById('academic-list');
    if (list) list.innerHTML = academicListHTML();
  } catch(e) { console.warn('Academic calendar load failed:', e); }
}
