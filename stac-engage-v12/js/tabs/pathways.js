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
