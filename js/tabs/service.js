/* ============================================================
   STAC Engage — Student: Service Hours Tab
   ============================================================ */

let myServiceHours = [];

function renderServiceHours() {
  const approved = myServiceHours.filter(h => h.status === 'approved');
  const pending  = myServiceHours.filter(h => h.status === 'pending');
  const totalHrs = approved.reduce((s, h) => s + parseFloat(h.hours || 0), 0);

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Service hours</h1>
      <p>${totalHrs.toFixed(1)} hours approved · ${pending.length} pending</p>
    </div>

    <div class="g3" style="margin-bottom:1rem;">
      <div class="stat-card green">
        <div class="stat-label">Approved hours</div>
        <div class="stat-value">${totalHrs.toFixed(1)}</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Pending</div>
        <div class="stat-value">${pending.length}</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">Total submissions</div>
        <div class="stat-value">${myServiceHours.length}</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-plus"></i>Log service hours</div>
      </div>
      <div class="card-body">
        <div class="field-row-2">
          <div class="field">
            <label>Organization / cause</label>
            <input type="text" id="sh-org" placeholder="e.g. St. Thomas Food Pantry">
          </div>
          <div class="field">
            <label>Date</label>
            <input type="date" id="sh-date">
          </div>
        </div>
        <div class="field-row-2">
          <div class="field">
            <label>Hours</label>
            <input type="number" id="sh-hours" min="0.5" max="24" step="0.5" placeholder="2.5">
          </div>
          <div class="field">
            <label>Supervisor name</label>
            <input type="text" id="sh-supervisor" placeholder="Optional">
          </div>
        </div>
        <div class="field">
          <label>Description</label>
          <input type="text" id="sh-desc" placeholder="Briefly describe your service activity">
        </div>
        <button class="btn-primary" style="width:auto;padding:9px 22px;margin-top:4px;" onclick="submitServiceHours()">
          <i class="ti ti-send" style="font-size:13px;"></i> Submit for approval
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-heart"></i>My submissions</div>
        <button class="tbtn" onclick="loadStudentServiceHours()"><i class="ti ti-refresh" style="font-size:12px;"></i> Refresh</button>
      </div>
      <div class="card-body" id="my-service-list">
        ${renderMyServiceList()}
      </div>
    </div>
  </div>`;
}

function renderMyServiceList() {
  if (myServiceHours.length === 0) {
    return `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No submissions yet — log your first service hours above</div>`;
  }
  const statusMap = {
    pending:  { label:'Pending',  bg:'#FAEEDA', color:'#854F0B' },
    approved: { label:'Approved', bg:'#EAF3DE', color:'#3B6D11' },
    denied:   { label:'Denied',   bg:'#FBEAF0', color:'#993556' },
  };
  return myServiceHours.map(h => {
    const s = statusMap[h.status] || statusMap.pending;
    return `<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">
      <div class="row-icon" style="background:#EAF3DE;"><i class="ti ti-heart" style="color:#3B6D11;"></i></div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:500;color:var(--text);">${h.org_name}</div>
        <div style="font-size:11px;color:#8a8a80;">${h.date} · ${h.hours} hrs${h.description ? ' · ' + h.description : ''}</div>
        ${h.admin_note ? `<div style="font-size:11px;color:#993556;margin-top:2px;">${h.admin_note}</div>` : ''}
      </div>
      <span class="pill" style="background:${s.bg};color:${s.color};">${s.label}</span>
      ${h.status === 'approved' ? `<span style="font-size:12px;font-weight:500;color:#3B6D11;">+${Math.floor(h.hours*10)} pts</span>` : ''}
    </div>`;
  }).join('');
}

async function loadStudentServiceHours() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) return;
  try {
    const { data, error } = await db
      .from('service_hours')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    myServiceHours = data || [];
    const list = document.getElementById('my-service-list');
    if (list) list.innerHTML = renderMyServiceList();
    const hdr = document.querySelector('.page-head p');
    const approved = myServiceHours.filter(h => h.status === 'approved');
    const pending  = myServiceHours.filter(h => h.status === 'pending');
    const totalHrs = approved.reduce((s, h) => s + parseFloat(h.hours || 0), 0);
    if (hdr) hdr.textContent = `${totalHrs.toFixed(1)} hours approved · ${pending.length} pending`;
  } catch(e) { console.warn('Service hours load failed:', e); }
}

async function submitServiceHours() {
  const org   = document.getElementById('sh-org')?.value.trim();
  const date  = document.getElementById('sh-date')?.value;
  const hours = parseFloat(document.getElementById('sh-hours')?.value);
  const desc  = document.getElementById('sh-desc')?.value.trim();
  const sup   = document.getElementById('sh-supervisor')?.value.trim();

  if (!org)        { showToast('Please enter an organization name.'); return; }
  if (!date)       { showToast('Please select a date.'); return; }
  if (!hours || hours <= 0) { showToast('Please enter valid hours.'); return; }

  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id)    { showToast('Please sign in to submit hours.'); return; }

  try {
    const { error } = await db.from('service_hours').insert({
      user_id:     user.id,
      org_name:    org,
      date,
      hours,
      description: desc || '',
      status:      'pending',
    });
    if (error) throw error;

    showToast('Hours submitted — you\'ll be notified once approved.');
    document.getElementById('sh-org').value   = '';
    document.getElementById('sh-date').value  = '';
    document.getElementById('sh-hours').value = '';
    document.getElementById('sh-desc').value  = '';
    if (document.getElementById('sh-supervisor')) document.getElementById('sh-supervisor').value = '';
    await loadStudentServiceHours();
  } catch(e) {
    console.error('Service hours submit failed:', e);
    showToast('Could not submit — check your connection.');
  }
}
