/* ============================================================
   STAC Engage v7 — Dashboard Tab
   ============================================================ */

function renderDashboard() {
  const u    = getUser();
  const rank = getRank(u.score);
  const nextRank = RANKS.find(r => r.min > u.score);
  const ptsToNext = nextRank ? nextRank.min - u.score : 0;
  const mealTime = new Date().getHours() < 10 ? 'breakfast' : new Date().getHours() < 14 ? 'lunch' : 'dinner';
  const meal = DINING_MENU.meals[mealTime];

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Good morning, ${u.firstName}</h1>
      <p>Spring 2026 · Junior · ${u.major}</p>
    </div>

    <div class="g4">
      <div class="stat-card blue">
        <div class="stat-label">Engage score</div>
        <div class="stat-value">${u.score}</div>
        <div class="stat-delta delta-up"><i class="ti ti-arrow-up" style="font-size:11px;"></i> +42 this week</div>
      </div>
      <div class="stat-card" style="border-top:3px solid ${rank.color};">
        <div class="stat-label">Rank</div>
        <div class="stat-value" style="font-size:16px;color:${rank.color};">
          <i class="ti ${rank.icon}" style="font-size:18px;vertical-align:middle;margin-right:4px;"></i>${rank.title}
        </div>
        ${nextRank ? `<div class="stat-sub">${ptsToNext} pts to ${nextRank.title}</div>` : '<div class="stat-sub" style="color:#3B6D11;">Max rank!</div>'}
      </div>
      <div class="stat-card green">
        <div class="stat-label">Service hours</div>
        <div class="stat-value">24</div>
        <div class="stat-delta delta-up"><i class="ti ti-arrow-up" style="font-size:11px;"></i> +4 this month</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Weekly streak</div>
        <div class="stat-value">6 wks</div>
        <div class="stat-delta delta-gold">Personal best</div>
      </div>
    </div>

    <!-- Dining snapshot -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-tools-kitchen-2"></i>Dining today — ${mealTime.charAt(0).toUpperCase()+mealTime.slice(1)}</div>
        <span style="font-size:11px;color:#8a8a80;">${DINING_MENU.hours[mealTime]} · Aramark</span>
      </div>
      <div class="card-body" style="display:flex;flex-wrap:wrap;gap:8px;">
        ${meal.slice(0,4).map(item => `
          <div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--surface-2);border-radius:8px;font-size:12px;">
            <span style="color:var(--text);">${item.name}</span>
            ${item.tags.map(t => `<span style="font-size:9px;background:${t==='VG'?'#EAF3DE':t==='GF'?'#EEEDFE':'#F1EFE8'};color:${t==='VG'?'#3B6D11':t==='GF'?'#533AB7':'#5F5E5A'};padding:1px 5px;border-radius:999px;font-weight:500;">${t}</span>`).join('')}
          </div>`).join('')}
        <span class="card-action" onclick="switchTab('events')" style="padding:6px 10px;display:flex;align-items:center;">Full menu →</span>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-calendar-event"></i>Upcoming events</div>
          <span class="card-action" onclick="switchTab('events')">View all</span>
        </div>
        <div class="card-body">${DATA.events.slice(0,3).map(e => C_eventRow(e)).join('')}</div>
      </div>
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-rosette"></i>Badges earned</div>
          <span class="card-action" onclick="switchTab('transcript')">All badges</span>
        </div>
        <div class="card-body">${C_badgeGrid(DATA.badges.slice(0,6))}</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-shield-star"></i>Spartan Spirits</div>
          <span class="card-action" onclick="switchTab('pathways')">Details</span>
        </div>
        <div class="card-body">${C_pathwayListSpirits(SPARTAN_SPIRITS.slice(0,3))}</div>
      </div>
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-trophy"></i>Leaderboard</div>
          <span class="card-action" onclick="switchTab('leaderboard')">Full board</span>
        </div>
        <div class="card-body">${C_lbRows(DATA.leaderboard.slice(0,4))}</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-target"></i>Active challenges</div>
          <span class="card-action" onclick="switchTab('streaks')">All challenges</span>
        </div>
        <div class="card-body">
          <div id="dash-challenges">${C_challengeRows(DATA.challenges.slice(0,3))}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-activity"></i>Activity feed</div>
          <span class="card-action" onclick="switchTab('feed')">View all</span>
        </div>
        <div class="card-body">
          ${getState().feed.slice(0,2).map(f => `
            <div class="feed-item">
              <div class="feed-avatar" style="background:${f.bg};color:${f.fc};">${f.initials}</div>
              <div class="feed-body">
                <div class="feed-text">${f.text}</div>
                <div class="feed-time">${f.time}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}
