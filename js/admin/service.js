/* ============================================================
   STAC Engage — Admin: Service Hours
   ============================================================ */

let liveServiceHours = [];

async function loadServiceHoursFromDB() {
  try {
    liveServiceHours = await fetchAllServiceHours();
    const content = document.getElementById('admin-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.id === 'anav-service') {
      content.innerHTML = renderAdminService();
    }
  } catch(e) { console.warn('Service hours load failed:', e); }
}

function renderAdminService() {
  const pending  = liveServiceHours.filter(h => h.status === 'pending').length;
  const approved = liveServiceHours.filter(h => h.status === 'approved');
  const totalHrs = approved.reduce((s, h) => s + parseFloat(h.hours || 0), 0);

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Service hours</h1>
      <p>${pending} pending approval · ${totalHrs.toFixed(1)} total hours approved</p>
    </div>

    ${pending > 0 ? `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#EAF3DE;border-radius:var(--radius-lg);margin-bottom:1rem;border:1px solid #3B6D11;">
      <div style="display:flex;align-items:center;gap:8px;">
        <i class="ti ti-heart" style="color:#3B6D11;font-size:16px;"></i>
        <span style="font-size:13px;font-weight:500;color:#3B6D11;">${pending} service hour submission${pending>1?'s':''} awaiting approval</span>
      </div>
    </div>` : ''}

    <div class="g3" style="margin-bottom:1rem;">
      <div class="stat-card green"><div class="stat-label">Total approved hours</div><div class="stat-value">${totalHrs.toFixed(1)}</div></div>
      <div class="stat-card amber"><div class="stat-label">Pending</div><div class="stat-value">${pending}</div></div>
      <div class="stat-card blue"><div class="stat-label">Submissions</div><div class="stat-value">${liveServiceHours.length}</div></div>
    </div>

    <div class="filter-pills">
      ${['all','pending','approved','denied'].map(f => `
        <button class="filter-pill" onclick="filterServiceHours('${f}')" id="sf-${f}">${f.charAt(0).toUpperCase()+f.slice(1)}</button>`).join('')}
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-heart"></i>Submissions</div>
        <button class="btn-secondary" onclick="loadServiceHoursFromDB()"><i class="ti ti-refresh" style="font-size:12px;"></i> Refresh</button>
      </div>
      <div class="card-body" style="padding:0;" id="service-list">
        ${serviceListHTML(liveServiceHours)}
      </div>
    </div>
  </div>`;
}

function serviceListHTML(items) {
  if (items.length === 0) {
    return `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No service hour submissions yet</div>`;
  }
  return items.map(h => {
    const statusMap = {
      pending:  { label:'Pending',  bg:'#FAEEDA', color:'#854F0B' },
      approved: { label:'Approved', bg:'#EAF3DE', color:'#3B6D11' },
      denied:   { label:'Denied',   bg:'#FBEAF0', color:'#993556' },
    };
    const s = statusMap[h.status] || statusMap.pending;
    const name = h.profiles ? `${h.profiles.first_name} ${h.profiles.last_name}` : 'Unknown';
    return `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);">
      <div class="row-icon" style="background:#EAF3DE;"><i class="ti ti-heart" style="color:#3B6D11;"></i></div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:500;color:var(--text);">${name} — ${h.org_name}</div>
        <div style="font-size:11px;color:#8a8a80;">${h.date} · ${h.hours} hrs · ${h.description || ''}</div>
        ${h.admin_note ? `<div style="font-size:11px;color:#993556;margin-top:2px;">${h.admin_note}</div>` : ''}
      </div>
      <span class="pill" style="background:${s.bg};color:${s.color};">${s.label}</span>
      ${h.status === 'approved' ? `<span style="font-size:12px;font-weight:500;color:#3B6D11;">+${Math.floor(h.hours*10)} pts</span>` : ''}
      ${h.status === 'pending' ? `
        <div class="action-row">
          <button class="btn-approve" onclick="approveServiceHours('${h.id}')">Approve</button>
          <button class="btn-deny" onclick="denyServiceHours('${h.id}')">Deny</button>
        </div>` : ''}
    </div>`;
  }).join('');
}

window.filterServiceHours = function(f) {
  const filtered = f === 'all' ? liveServiceHours : liveServiceHours.filter(h => h.status === f);
  const list = document.getElementById('service-list');
  if (list) list.innerHTML = serviceListHTML(filtered);
};

window.approveServiceHours = async function(id) {
  try {
    await updateServiceHours(id, 'approved', '');
    const h = liveServiceHours.find(x => x.id === id);
    if (h) h.status = 'approved';
    const pts = Math.floor((h?.hours || 0) * 10);
    // Award points
    if (h?.user_id) {
      await db.rpc('add_score', { p_user_id: h.user_id, p_points: pts });
      // Notify student
      await db.from('notifications').insert({
        user_id: h.user_id, type: 'update', read: false,
        text: `Your service hours for "${h.org_name}" (${h.hours} hrs) were approved! +${pts} pts 🎉`
      });
    }
    showToast(`Approved — student earned ${pts} pts and was notified.`);
    const list = document.getElementById('service-list');
    if (list) list.innerHTML = serviceListHTML(liveServiceHours);
  } catch(e) { console.error(e); showToast('Could not approve — check connection.'); }
};

window.denyServiceHours = async function(id) {
  const note = prompt('Reason for denial (shown to student):') || '';
  try {
    await updateServiceHours(id, 'denied', note);
    const h = liveServiceHours.find(x => x.id === id);
    if (h) { h.status = 'denied'; h.admin_note = note; }
    // Notify student
    if (h?.user_id) {
      await db.from('notifications').insert({
        user_id: h.user_id, type: 'update', read: false,
        text: `Your service hours submission for "${h.org_name}" was not approved.${note ? ' Reason: ' + note : ''}`
      });
    }
    showToast('Submission denied — student notified.');
    const list = document.getElementById('service-list');
    if (list) list.innerHTML = serviceListHTML(liveServiceHours);
  } catch(e) { showToast('Could not deny — check connection.'); }
};
