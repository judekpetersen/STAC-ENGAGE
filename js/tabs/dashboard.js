/* ============================================================
   STAC Engage — Dashboard Tab
   ============================================================ */

function renderDashboard() {
  const u    = getUser();
  const rank = getRank(u.score);
  const nextRank  = RANKS.find(r => r.min > u.score);
  const ptsToNext = nextRank ? nextRank.min - u.score : 0;

  const empty = (msg, action) => `
    <div style="text-align:center;padding:1.5rem;color:#8a8a80;font-size:13px;">
      ${msg}
      ${action ? `<br><span style="color:#6b1a1a;cursor:pointer;font-weight:500;margin-top:6px;display:inline-block;" onclick="${action.fn}">${action.label}</span>` : ''}
    </div>`;

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Welcome, ${u.firstName}!</h1>
      <p>Saint Thomas Aquinas College · ${u.major || 'Student'}</p>
    </div>

    <div class="g4">
      <div class="stat-card blue">
        <div class="stat-label">Engage score</div>
        <div class="stat-value">${u.score}</div>
        <div class="stat-sub">Just getting started</div>
      </div>
      <div class="stat-card" style="border-top:3px solid ${rank.color};">
        <div class="stat-label">Rank</div>
        <div class="stat-value" style="font-size:16px;color:${rank.color};">
          <i class="ti ${rank.icon}" style="font-size:18px;vertical-align:middle;margin-right:4px;"></i>${rank.title}
        </div>
        ${nextRank ? `<div class="stat-sub">${ptsToNext} pts to ${nextRank.title}</div>` : ''}
      </div>
      <div class="stat-card green">
        <div class="stat-label">Events attended</div>
        <div class="stat-value">0</div>
        <div class="stat-sub">RSVP to your first event</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Weekly streak</div>
        <div class="stat-value">–</div>
        <div class="stat-sub">Attend an event to start</div>
      </div>
    </div>

    ${GAME_ANNOUNCEMENTS.length ? `
    <div class="card" style="margin-bottom:1rem;border-left:4px solid #6b1a1a;">
      <div class="card-head" style="padding:10px 14px 8px;">
        <div class="card-title" style="color:#6b1a1a;"><i class="ti ti-trophy" style="color:#6b1a1a;"></i>Spartan Athletics</div>
        <span style="font-size:11px;color:#8a8a80;">Posted by Athletics</span>
      </div>
      <div style="display:flex;gap:0;overflow-x:auto;padding:0 14px 12px;">
        ${GAME_ANNOUNCEMENTS.map(g => `
          <div style="flex-shrink:0;min-width:180px;padding:10px 12px;background:var(--surface-2);border-radius:var(--radius);margin-right:8px;border:1px solid var(--border);">
            <div style="font-size:10px;font-weight:600;color:#6b1a1a;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">${g.sport}</div>
            <div style="font-size:13px;font-weight:500;color:var(--text);">${g.opponent}</div>
            <div style="font-size:11px;color:#8a8a80;margin-top:2px;">${g.date} · ${g.time}</div>
            <div style="font-size:11px;color:#8a8a80;">${g.location}</div>
            ${g.result ? `<div style="margin-top:5px;font-size:12px;font-weight:600;color:${g.result.startsWith('W')?'#3B6D11':'#993556'};">${g.result}</div>` : `<span style="margin-top:5px;display:inline-block;font-size:10px;background:#FBE6E6;color:#6b1a1a;padding:2px 7px;border-radius:999px;">Upcoming</span>`}
          </div>`).join('')}
      </div>
    </div>` : ''}

    <div class="g2">
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-calendar-event"></i>Upcoming events</div><span class="card-action" onclick="switchTab('events')">View all</span></div>
        <div class="card-body">
          ${DATA.events.length === 0 ? empty('No events posted yet — check back soon') : DATA.events.slice(0,3).map(e => C_eventRow(e)).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-shield-star"></i>Spartan Spirits</div><span class="card-action" onclick="switchTab('pathways')">Details</span></div>
        <div class="card-body">${C_pathwayListSpirits(SPARTAN_SPIRITS)}</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-trophy"></i>Leaderboard</div><span class="card-action" onclick="switchTab('leaderboard')">Full board</span></div>
        <div class="card-body">
          ${DATA.leaderboard.length === 0 ? empty('Be the first on the leaderboard — attend an event!') : C_lbRows(DATA.leaderboard.slice(0,4))}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-activity"></i>Activity feed</div><span class="card-action" onclick="switchTab('feed')">View all</span></div>
        <div class="card-body">
          ${getState().feed.length === 0 ? empty('No posts yet — send a shoutout to a classmate!', { fn:"switchTab('feed')", label:'Go to feed →' }) :
            getState().feed.slice(0,2).map(f => `
              <div class="feed-item">
                <div class="feed-avatar" style="background:${f.bg};color:${f.fc};">${f.initials}</div>
                <div class="feed-body"><div class="feed-text">${f.text}</div><div class="feed-time">${f.time}</div></div>
              </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}
