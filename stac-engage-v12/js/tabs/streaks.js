/* ============================================================
   STAC Engage — Streaks & Challenges Tab
   Supabase: query `challenge_claims` and `streak_log` for current user
   ============================================================ */

function renderStreaks() {
  // TODO (Supabase):
  // const { data: claims }  = await db.from('challenge_claims').select('challenge_id').eq('user_id', currentUser.id);
  // const { data: streakLog } = await db.from('streak_log').select('week_of').eq('user_id', currentUser.id).order('week_of', { ascending: false }).limit(14);
  const u = getUser();
  const done = DATA.challenges.filter(c => c.state === 'done' || isClaimed(c.id)).length;
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Streaks &amp; challenges</h1>
      <p>Consistency earns bonus points — keep your streak alive</p>
    </div>
    <div class="g3">
      <div class="stat-card amber">
        <div class="stat-label">Current streak</div>
        <div class="stat-value">${u.streakWeeks} weeks</div>
        <div class="stat-delta delta-gold">Personal best</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Challenges done</div>
        <div class="stat-value">${done} / ${DATA.challenges.length}</div>
        <div class="stat-sub">This month</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">Bonus pts earned</div>
        <div class="stat-value">340</div>
        <div class="stat-sub">From challenges</div>
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
            <i class="ti ti-flame" style="font-size:10px;"></i> ${u.streakWeeks}-week streak
          </span>
          <span>Next milestone: 8 weeks (+100 pts)</span>
        </div>
        <div class="bar-wrap" style="margin-top:8px;height:6px;">
          <div class="bar-fill" style="width:${Math.round(u.streakWeeks/8*100)}%;background:#c8b560;"></div>
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
