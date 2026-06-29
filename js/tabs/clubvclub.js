/* ============================================================
   STAC Engage — Club vs. Club Tab
   ============================================================ */

function renderClubVClub() {
  const sorted = [...DATA.clubs].sort((a, b) => b.pts - a.pts);
  const maxPts = sorted.length > 0 ? (sorted[0].pts || 1) : 1;
  const top2   = sorted.slice(0, 2);

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Club vs. club</h1>
      <p>Ranked by total member engagement points</p>
    </div>

    ${sorted.length === 0 ? `
    <div class="card">
      <div class="card-body" style="text-align:center;padding:3rem 1rem;">
        <i class="ti ti-users" style="font-size:40px;color:#d0cfc8;display:block;margin-bottom:12px;"></i>
        <div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:6px;">No clubs yet</div>
        <div style="font-size:13px;color:#8a8a80;">Club standings will appear here once clubs are created and students join them.</div>
      </div>
    </div>` : `

    <div class="cvc-top">
      ${top2.map((c, i) => `
        <div class="cvc-card ${i === 0 ? 'leader' : ''}" style="border-color:${i === 0 ? (c.color||'#6b1a1a') : 'var(--border)'};">
          ${i === 0 ? `<span class="pill" style="background:#FAEEDA;color:#412402;margin-bottom:8px;display:inline-flex;">
            <i class="ti ti-trophy" style="font-size:10px;"></i> Leading
          </span>` : ''}
          <div style="font-size:13px;font-weight:500;color:var(--text);">
            ${c.name}
            ${c.you ? `<span class="pill" style="background:#EAF3DE;color:#173404;font-size:10px;">your club</span>` : ''}
          </div>
          <div style="font-size:11px;color:#8a8a80;margin-top:2px;">${c.members || 0} members</div>
          <div style="font-size:22px;font-weight:500;color:${c.color||'#6b1a1a'};margin-top:8px;letter-spacing:-0.02em;">
            ${(c.pts||0).toLocaleString()} pts
          </div>
          <div class="bar-wrap" style="margin-top:8px;height:7px;">
            <div class="bar-fill" style="width:${Math.round((c.pts||0) / maxPts * 100)}%;background:${c.color||'#6b1a1a'};"></div>
          </div>
        </div>`).join('')}
    </div>

    <div class="card">
      <div class="card-head"><div class="card-title"><i class="ti ti-chart-bar"></i>Full standings</div></div>
      <div class="card-body">
        ${sorted.map((c, i) => `
          <div class="lb-row ${c.you ? 'you' : ''}">
            <span class="lb-rank">${i + 1}</span>
            <div style="width:28px;height:28px;border-radius:8px;background:${c.bg||'#FBE6E6'};flex-shrink:0;"></div>
            <span class="lb-name">
              ${c.name}
              ${c.you ? `<span style="font-size:10px;color:#3B6D11;">(your club)</span>` : ''}
            </span>
            <span style="font-size:12px;font-weight:500;color:${c.color||'#6b1a1a'};">${(c.pts||0).toLocaleString()}</span>
          </div>`).join('')}
      </div>
    </div>`}
  </div>`;
}
