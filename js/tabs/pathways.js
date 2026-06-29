/* ============================================================
   STAC Engage v9 — Spartan Spirits (Pathways) Tab
   Based on STAC's real New Student Orientation framework
   ============================================================ */

function renderPathways() {
  const overall = Math.round(SPARTAN_SPIRITS.reduce((s,p)=>s+p.pct,0)/SPARTAN_SPIRITS.length);
  const strongest = [...SPARTAN_SPIRITS].sort((a,b)=>b.pct-a.pct)[0];
  const weakest   = [...SPARTAN_SPIRITS].sort((a,b)=>a.pct-b.pct)[0];

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Spartan Spirits</h1>
      <p>Your engagement across STAC's five Spartan Spirit categories</p>
    </div>

    <div class="g3" style="margin-bottom:1rem;">
      <div class="stat-card blue">
        <div class="stat-label">Overall engagement</div>
        <div class="stat-value">${overall}%</div>
        <div class="stat-sub">Across all spirits</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Strongest spirit</div>
        <div class="stat-value" style="font-size:16px;">${strongest.name.split(' ')[0]}</div>
        <div class="stat-sub">${strongest.pct}% complete</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Growth area</div>
        <div class="stat-value" style="font-size:16px;">${weakest.name.split(' ')[0]}</div>
        <div class="stat-sub">${weakest.pct}% — explore more</div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-shield-star"></i>Your Spartan Spirit profile</div>
        <span style="font-size:11px;color:#8a8a80;">From STAC New Student Orientation</span>
      </div>
      <div class="card-body">
        ${SPARTAN_SPIRITS.map(p => `
          <div class="pathway-item">
            <div class="pathway-top">
              <span class="pathway-name" style="display:flex;align-items:center;gap:8px;">
                <i class="ti ${p.icon}" style="color:${p.color};font-size:16px;"></i>
                ${p.name}
              </span>
              <span class="pathway-pct">${p.pct}%</span>
            </div>
            <div class="bar-wrap" style="height:7px;">
              <div class="bar-fill" style="width:${p.pct}%;background:${p.color};"></div>
            </div>
            <div style="font-size:11px;color:#8a8a80;margin-top:5px;">${p.desc}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

/* ── Service hours log ───────────────────────────────── */
/* myServiceHours is declared in service.js */

async function loadMyServiceHours() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) return;
  try {
    myServiceHours = await fetchMyServiceHours(user.id);
    const el = document.getElementById('service-hours-list');
    if (el) el.innerHTML = renderServiceHoursList();
  } catch(e) { console.warn('Service hours load failed:', e); }
}

function renderServiceHoursList() {
  if (myServiceHours.length === 0) {
    return `<div style="text-align:center;padding:1.5rem;color:#8a8a80;font-size:13px;">
      No service hours logged yet — click "Log hours" to get started
    </div>`;
  }
  const statusMap = {
    pending:  { label:'Pending', bg:'#FAEEDA', color:'#854F0B' },
    approved: { label:'Approved', bg:'#EAF3DE', color:'#3B6D11' },
    denied:   { label:'Denied', bg:'#FBEAF0', color:'#993556' },
  };
  return myServiceHours.map(h => {
    const s = statusMap[h.status] || statusMap.pending;
    return `<div class="row">
      <div class="row-icon" style="background:#EAF3DE;"><i class="ti ti-heart" style="color:#3B6D11;"></i></div>
      <div class="row-info">
        <div class="row-name">${h.org_name}</div>
        <div class="row-meta">${h.date} · ${h.hours} hr${h.hours !== 1 ? 's' : ''} · ${h.description || ''}</div>
        ${h.admin_note ? `<div style="font-size:11px;color:#993556;margin-top:2px;">${h.admin_note}</div>` : ''}
      </div>
      <div style="text-align:right;">
        <span class="pill" style="background:${s.bg};color:${s.color};">${s.label}</span>
        ${h.status === 'approved' ? `<div style="font-size:11px;color:#3B6D11;margin-top:3px;">+${Math.floor(h.hours * 10)} pts</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function openServiceHoursModal() {
  const modal = document.createElement('div');
  modal.id = 'service-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeServiceModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:480px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Log service hours</div>
          <button onclick="closeServiceModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#EAF3DE;border-radius:var(--radius);margin-bottom:1rem;font-size:12px;color:#3B6D11;">
            <i class="ti ti-info-circle"></i> You earn 10 points per approved service hour
          </div>
          <div class="field"><label>Organization / place served</label>
            <input type="text" id="sh-org" placeholder="e.g. Sparkill Food Pantry, Paws 4 Change">
          </div>
          <div class="field-row-2">
            <div class="field"><label>Date of service</label>
              <input type="date" id="sh-date">
            </div>
            <div class="field"><label>Hours</label>
              <input type="number" id="sh-hours" min="0.5" max="24" step="0.5" placeholder="e.g. 2.5">
            </div>
          </div>
          <div class="field"><label>Brief description</label>
            <input type="text" id="sh-desc" placeholder="What did you do?">
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="closeServiceModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="submitServiceHoursForm()">
            <i class="ti ti-send"></i> Submit for approval
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function closeServiceModal() {
  const m = document.getElementById('service-modal');
  if (m) m.remove();
}

async function submitServiceHoursForm() {
  const org   = document.getElementById('sh-org')?.value.trim();
  const date  = document.getElementById('sh-date')?.value;
  const hours = parseFloat(document.getElementById('sh-hours')?.value);
  const desc  = document.getElementById('sh-desc')?.value.trim();

  if (!org)         { alert('Please enter the organization name.'); return; }
  if (!date)        { alert('Please select the date of service.'); return; }
  if (!hours || hours < 0.5) { alert('Please enter valid hours (minimum 0.5).'); return; }

  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  try {
    await submitServiceHours(user.id, { org_name: org, date, hours, description: desc });
    closeServiceModal();
    showToast('Service hours submitted — pending admin approval.');
    await loadMyServiceHours();
  } catch(e) {
    console.error('Submit failed:', e);
    showToast('Could not submit — check your connection.');
  }
}

// Patch renderPathways to add service hours section
const _origPathways = renderPathways;
window.renderPathways = function() {
  const base = _origPathways();
  const totalApproved = myServiceHours.filter(h => h.status === 'approved').reduce((s, h) => s + h.hours, 0);

  const serviceSection = `
    <div class="card" style="margin-top:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-heart" style="color:#3B6D11;"></i>Service hours</div>
        <button class="btn-primary" style="width:auto;padding:7px 14px;font-size:12px;background:#3B6D11;border-color:#3B6D11;" onclick="openServiceHoursModal()">
          <i class="ti ti-plus"></i> Log hours
        </button>
      </div>
      <div class="card-body">
        <div class="g3" style="margin-bottom:1rem;">
          <div class="stat-card green"><div class="stat-label">Total hours</div><div class="stat-value">${totalApproved}</div><div class="stat-sub">Approved</div></div>
          <div class="stat-card green"><div class="stat-label">Points earned</div><div class="stat-value">${Math.floor(totalApproved * 10)}</div><div class="stat-sub">10 pts/hr</div></div>
          <div class="stat-card amber"><div class="stat-label">Pending</div><div class="stat-value">${myServiceHours.filter(h=>h.status==='pending').length}</div><div class="stat-sub">Awaiting approval</div></div>
        </div>
        <div id="service-hours-list">${renderServiceHoursList()}</div>
      </div>
    </div>`;

  return base + serviceSection;
};

// Load on tab open
document.addEventListener('DOMContentLoaded', () => setTimeout(loadMyServiceHours, 1000));
