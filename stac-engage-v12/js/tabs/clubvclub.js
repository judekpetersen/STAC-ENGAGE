/* ============================================================
   STAC Engage — Club vs. Club Tab
   Supabase: aggregate `profiles.score` grouped by `org_memberships.org_id`
   ============================================================ */

function renderClubVClub() {
  // TODO (Supabase):
  // const { data } = await db.rpc('get_club_leaderboard');
  // SQL function: SELECT o.name, SUM(p.score) as pts, COUNT(m.user_id) as members
  //               FROM orgs o JOIN org_memberships m ON o.id = m.org_id
  //               JOIN profiles p ON m.user_id = p.id GROUP BY o.id ORDER BY pts DESC;
  const sorted  = [...DATA.clubs].sort((a, b) => b.pts - a.pts);
  const maxPts  = sorted[0].pts;
  const top2    = sorted.slice(0, 2);
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Club vs. club</h1>
      <p>Spring 2026 — ranked by total member engagement points</p>
    </div>
    <div class="cvc-top">
      ${top2.map((c, i) => `
        <div class="cvc-card ${i === 0 ? 'leader' : ''}" style="border-color:${i === 0 ? c.color : 'var(--border)'};">
          ${i === 0 ? `<span class="pill" style="background:#FAEEDA;color:#412402;margin-bottom:8px;display:inline-flex;">
            <i class="ti ti-trophy" style="font-size:10px;"></i> Leading
          </span>` : ''}
          <div style="font-size:13px;font-weight:500;color:var(--text);">
            ${c.name}
            ${c.you ? `<span class="pill" style="background:#EAF3DE;color:#173404;font-size:10px;">your club</span>` : ''}
          </div>
          <div style="font-size:11px;color:#8a8a80;margin-top:2px;">${c.members} members</div>
          <div style="font-size:22px;font-weight:500;color:${c.color};margin-top:8px;letter-spacing:-0.02em;">
            ${c.pts.toLocaleString()} pts
          </div>
          <div class="bar-wrap" style="margin-top:8px;height:7px;">
            <div class="bar-fill" style="width:${Math.round(c.pts / maxPts * 100)}%;background:${c.color};"></div>
          </div>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-head"><div class="card-title"><i class="ti ti-chart-bar"></i>Full standings</div></div>
      <div class="card-body">
        ${sorted.map((c, i) => `
          <div class="lb-row ${c.you ? 'you' : ''}">
            <span class="lb-rank">${i + 1}</span>
            <div style="width:28px;height:28px;border-radius:8px;background:${c.bg};flex-shrink:0;"></div>
            <span class="lb-name">
              ${c.name}
              ${c.you ? `<span style="font-size:10px;color:#3B6D11;">(your club)</span>` : ''}
            </span>
            <span style="font-size:12px;font-weight:500;color:${c.color};">${c.pts.toLocaleString()}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}
