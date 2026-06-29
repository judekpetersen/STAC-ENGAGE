/* ============================================================
   STAC Engage v7 — Orgs Tab (+ meeting minutes)
   ============================================================ */

let expandedMinutes = null;

function renderOrgs() {
  const joined = Object.values(getState().orgJoined).filter(Boolean).length;
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Student organizations</h1>
      <p>Find your community — ${joined} joined</p>
    </div>
    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-users"></i>All organizations</div>
        <span class="pill" style="background:#FBE6E6;color:#6b1a1a;">${DATA.orgs.length} total</span>
      </div>
      <div class="card-body" id="org-container">
        ${renderOrgList()}
      </div>
    </div>
  </div>`;
}

function renderOrgList() {
  if (DATA.orgs.length === 0) {
    return `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">
      <i class="ti ti-users" style="font-size:32px;display:block;margin-bottom:8px;color:#d0cfc8;"></i>
      No organizations yet — check back soon or ask your admin to add clubs
    </div>`;
  }
  return DATA.orgs.map((o, i) => {
    const minutes    = MEETING_MINUTES[i] || [];
    const isExpanded = expandedMinutes === i;
    return `
      <div class="org-item" style="flex-direction:column;align-items:stretch;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="org-icon" style="background:${o.bg};">
            <i class="ti ${o.icon}" style="color:${o.ic};font-size:18px;"></i>
          </div>
          <div class="org-info">
            <div class="org-name">${o.name}</div>
            <div class="org-meta">${o.meta}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-left:auto;">
            ${minutes.length ? `
              <button class="tbtn" style="font-size:10px;padding:3px 9px;" onclick="toggleMinutes(${i})">
                <i class="ti ti-notes" style="font-size:11px;"></i> Minutes
              </button>` : ''}
            <button class="tbtn ${isOrgJoined(i)?'on':''}" onclick="doJoinOrg(${i},this)">
              ${isOrgJoined(i)?'Joined':'Join'}
            </button>
          </div>
        </div>
        ${isExpanded && minutes.length ? `
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);">
            <div style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:#8a8a80;margin-bottom:8px;">Meeting minutes</div>
            ${minutes.map(m => `
              <div style="padding:10px;background:var(--surface-2);border-radius:var(--radius);margin-bottom:6px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <div style="font-size:13px;font-weight:500;color:var(--text);">${m.title}</div>
                  <span style="font-size:11px;color:#8a8a80;">${m.date}</span>
                </div>
                <div style="font-size:12px;color:#5a5a52;line-height:1.5;">${m.summary}</div>
                <div style="font-size:11px;color:#8a8a80;margin-top:4px;">Recorded by ${m.author}</div>
              </div>`).join('')}
          </div>` : ''}
      </div>`;
  }).join('');
}

function toggleMinutes(i) {
  expandedMinutes = expandedMinutes === i ? null : i;
  const container = document.getElementById('org-container');
  if (container) container.innerHTML = renderOrgList();
}

function doJoinOrg(i, btn) {
  const on = toggleOrg(i);
  btn.className = 'tbtn ' + (on ? 'on' : '');
  btn.textContent = on ? 'Joined' : 'Join';
}
