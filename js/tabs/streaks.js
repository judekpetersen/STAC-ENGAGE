/* ============================================================
   STAC Engage — Streaks & Challenges Tab
   ============================================================ */

let liveStreakData = null;

async function loadStreaksFromDB() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) return;
  try {
    const { data: profile } = await db.from('profiles').select('score, streak_weeks').eq('id', user.id).single();
    if (profile) {
      liveStreakData = { streakWeeks: profile.streak_weeks || 0, score: profile.score || 0 };
      const s = getState();
      s.user.streakWeeks = liveStreakData.streakWeeks;
      s.user.score = liveStreakData.score;
      saveState();
    }
    const content = document.getElementById('app-content');
    if (content && typeof currentTab !== 'undefined' && currentTab === 'streaks') {
      content.innerHTML = renderStreaks();
    }
  } catch(e) { console.warn('Streaks load failed:', e); }
}

function renderStreaks() {
  const u = getUser();
  const streakWeeks = liveStreakData?.streakWeeks ?? u.streakWeeks ?? 0;
  const done = DATA.challenges.filter(c => c.state === 'done' || isClaimed(c.id)).length;
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Streaks &amp; challenges</h1>
      <p>Consistency earns bonus points — keep your streak alive</p>
    </div>
    <div class="g3">
      <div class="stat-card amber">
        <div class="stat-label">Current streak</div>
        <div class="stat-value">${streakWeeks} weeks</div>
        <div class="stat-delta delta-gold">Personal best</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Challenges done</div>
        <div class="stat-value">${done} / ${DATA.challenges.length}</div>
        <div class="stat-sub">This month</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">Engage score</div>
        <div class="stat-value">${liveStreakData?.score ?? u.score ?? 0}</div>
        <div class="stat-sub">Total points</div>
      </div>
    </div>
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-flame"></i>Weekly streak</div>
        <span style="font-size:11px;color:#8a8a80;">+25 pts/week sustained</span>
      </div>
      <div class="card-body">
        <p style="font-size:12px;color:#5a5a52;margin-bottom:10px;">
          Attend at least 1 event per week to keep your streak alive
        </p>
        <div class="streak-row">${C_streakRow(DATA.streakDays, DATA.dayLabels)}</div>
        <div class="streak-milestone">
          <span class="pill" style="background:#FAEEDA;color:#412402;">
            <i class="ti ti-flame" style="font-size:10px;"></i> ${streakWeeks}-week streak
          </span>
          <span>Next milestone: 8 weeks (+100 pts)</span>
        </div>
        <div class="bar-wrap" style="margin-top:8px;height:6px;">
          <div class="bar-fill" style="width:${Math.min(Math.round(streakWeeks/8*100),100)}%;background:#c8b560;"></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-target"></i>Monthly challenges</div>
        <span style="font-size:11px;color:#8a8a80;">June 2026</span>
      </div>
      <div class="card-body">
        <div id="challenge-container">${C_challengeRows(DATA.challenges)}</div>
      </div>
    </div>
  </div>`;
}
