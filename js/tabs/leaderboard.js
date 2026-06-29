/* ============================================================
   STAC Engage v7 — Leaderboard Tab (+ ranks)
   ============================================================ */

function renderLeaderboard() {
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Leaderboard</h1>
      <p>Ranked by total engagement score</p>
    </div>

    <!-- Rank legend -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-shield"></i>Spartan ranks</div></div>
      <div class="card-body" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
        ${RANKS.map(r => `
          <div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:${r.bg};border-radius:var(--radius);">
            <i class="ti ${r.icon}" style="color:${r.color};font-size:20px;flex-shrink:0;"></i>
            <div>
              <div style="font-size:13px;font-weight:500;color:${r.color};">${r.title}</div>
              <div style="font-size:11px;color:#8a8a80;">${r.min}${r.max<99999?'–'+r.max:'+' } pts</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-trophy"></i>All students</div>
        <span class="pill" style="background:#FAEEDA;color:#412402;">Updated daily</span>
      </div>
      <div class="card-body">
        ${DATA.leaderboard.length === 0
          ? `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">
               <i class="ti ti-trophy" style="font-size:32px;display:block;margin-bottom:8px;color:#d0cfc8;"></i>
               No rankings yet — RSVP to events and earn points to appear here
             </div>`
          : DATA.leaderboard.map(l => {
              const rank = getRank(l.score || l.pts || 0);
              return `<div class="lb-row ${l.you?'you':''}">
                <span class="lb-rank">${l.you?'★':l.rank}</span>
                <div class="lb-avatar" style="background:${l.bg||'#FBE6E6'};color:${l.fc||'#6b1a1a'};">${l.ini||l.initials||'?'}</div>
                <span class="lb-name">
                  ${l.name}${l.you?' <span style="font-size:10px;color:#3B6D11;">(you)</span>':''}
                </span>
                <span style="display:flex;align-items:center;gap:6px;">
                  <i class="ti ${rank.icon}" style="color:${rank.color};font-size:13px;" title="${rank.title}"></i>
                  <span class="lb-pts">${(l.score||l.pts||0)} pts</span>
                </span>
              </div>`;
            }).join('')}
      </div>
    </div>
  </div>`;
}

/* ── v17 Supabase live leaderboard ───────────────────── */
async function loadLeaderboardFromDB() {
  try {
    const data = await fetchLeaderboard();
    DATA.leaderboard = data.map((u, i) => ({
      rank: i + 1,
      name: u.first_name + ' ' + u.last_name,
      ini:  (u.first_name[0] || '') + (u.last_name[0] || ''),
      score: u.score,
      major: u.major || '',
      bg: '#FBE6E6', fc: '#6b1a1a',
    }));
    const content = document.getElementById('app-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.dataset.tab === 'leaderboard') {
      content.innerHTML = renderLeaderboard();
    }
  } catch(e) { console.warn('Leaderboard load failed:', e); }
}
