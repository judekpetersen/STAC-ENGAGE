/* ============================================================
   STAC Engage v15 — Athletics Admin Tab Renderers
   ============================================================ */

/* ── Overview ──────────────────────────────────────────── */
function renderAthleticsOverview() {
  const allSports = [...SPORTS.mens, ...SPORTS.womens, ...SPORTS.esports];
  const totalAthletes = ATHLETE_PROFILES.length;
  const upcoming = GAME_ANNOUNCEMENTS.filter(g => !g.result).length;
  const pendingBookings = ADMIN_BOOKINGS.filter(b =>
    bookingState[b.id] === 'pending' &&
    ATHLETIC_SPACE_IDS.some(id => SPACES.find(s => s.id === id && b.space.includes(s.building.split(' ')[0])))
  ).length;

  return `<div class="page-animate">
    <div class="page-head"><h1>Athletics Overview</h1><p>STAC Athletic Department</p></div>

    <div class="g4" style="margin-bottom:1rem;">
      <div class="stat-card blue"><div class="stat-label">Total athletes</div><div class="stat-value">${totalAthletes}</div><div class="stat-sub">Across all sports</div></div>
      <div class="stat-card amber"><div class="stat-label">Sports programs</div><div class="stat-value">${SPORTS.mens.length + SPORTS.womens.length}</div><div class="stat-sub">+ ${SPORTS.esports.length} eSports</div></div>
      <div class="stat-card green"><div class="stat-label">Upcoming games</div><div class="stat-value">${upcoming}</div><div class="stat-sub">Posted this week</div></div>
      <div class="stat-card ${pendingBookings>0?'amber':'green'}"><div class="stat-label">Pending bookings</div><div class="stat-value">${pendingBookings}</div><div class="stat-sub">Athletic spaces</div></div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-megaphone"></i>Recent announcements</div>
          <span class="card-action" onclick="athSwitchTab('announcements')">Manage</span>
        </div>
        <div class="card-body">
          ${GAME_ANNOUNCEMENTS.map(g => `
            <div class="row">
              <div class="row-icon" style="background:#FBE6E6;"><i class="ti ti-trophy" style="color:#6b1a1a;"></i></div>
              <div class="row-info">
                <div class="row-name">${g.sport} ${g.opponent}</div>
                <div class="row-meta">${g.date} · ${g.time} · ${g.location}</div>
              </div>
              ${g.result
                ? `<span class="status-badge" style="background:${g.result.startsWith('W')?'#EAF3DE':'#FBEAF0'};color:${g.result.startsWith('W')?'#3B6D11':'#993556'};">${g.result}</span>`
                : `<span class="status-badge status-active">Upcoming</span>`}
            </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-users"></i>Athletes by sport</div>
          <span class="card-action" onclick="athSwitchTab('roster')">Full roster</span>
        </div>
        <div class="card-body">
          ${allSports.filter(s => ATHLETE_PROFILES.some(a => a.sports.includes(s.id))).map(s => {
            const count = ATHLETE_PROFILES.filter(a => a.sports.includes(s.id)).length;
            return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);">
              <div style="width:26px;height:26px;border-radius:6px;background:${s.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="ti ${s.icon}" style="color:${s.color};font-size:13px;"></i>
              </div>
              <span style="font-size:13px;color:var(--text);flex:1;">${s.name}</span>
              <span style="font-size:12px;font-weight:500;color:#8a8a80;">${count} athlete${count!==1?'s':''}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* ── Roster by sport ───────────────────────────────────── */
function renderAthleticsRoster() {
  const allSports = [...SPORTS.mens, ...SPORTS.womens, ...SPORTS.esports];
  const activeSport = selectedSport || allSports[0].id;
  const sport = allSports.find(s => s.id === activeSport);
  const athletes = ATHLETE_PROFILES.filter(a => a.sports.includes(activeSport));

  return `<div class="page-animate">
    <div class="page-head"><h1>Roster by sport</h1><p>View athlete profiles grouped by program</p></div>

    <div class="g2">
      <!-- Sport selector -->
      <div class="card" style="max-height:600px;overflow-y:auto;">
        <div class="card-head"><div class="card-title"><i class="ti ti-list"></i>Sports programs</div></div>
        <div class="card-body" style="padding:0;">
          ${[
            { label:"Men's Sports", sports: SPORTS.mens },
            { label:"Women's Sports", sports: SPORTS.womens },
            { label:'eSports', sports: SPORTS.esports },
          ].map(group => `
            <div style="font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.06em;color:#8a8a80;padding:10px 16px 5px;background:var(--surface-2);">${group.label}</div>
            ${group.sports.map(s => {
              const count = ATHLETE_PROFILES.filter(a => a.sports.includes(s.id)).length;
              return `<div onclick="selectSport('${s.id}')" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;${activeSport===s.id?'background:rgba(107,26,26,0.05);':''}">
                <div style="width:30px;height:30px;border-radius:6px;background:${s.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="ti ${s.icon}" style="color:${s.color};font-size:14px;"></i>
                </div>
                <span style="font-size:13px;font-weight:${activeSport===s.id?'500':'400'};color:var(--text);flex:1;">${s.name}</span>
                <span style="font-size:11px;color:#8a8a80;">${count}</span>
                ${activeSport===s.id?`<i class="ti ti-chevron-right" style="font-size:13px;color:#6b1a1a;"></i>`:''}
              </div>`;
            }).join('')}`).join('')}
        </div>
      </div>

      <!-- Athlete list for selected sport -->
      <div class="card">
        <div class="card-head">
          <div class="card-title">
            <div style="width:24px;height:24px;border-radius:5px;background:${sport.bg};display:flex;align-items:center;justify-content:center;">
              <i class="ti ${sport.icon}" style="color:${sport.color};font-size:13px;"></i>
            </div>
            ${sport.name}
          </div>
          <span class="pill" style="background:${sport.bg};color:${sport.color};">${athletes.length} athlete${athletes.length!==1?'s':''}</span>
        </div>
        <div class="card-body" style="padding:0;">
          ${athletes.length === 0
            ? `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No athletes registered for this sport yet</div>`
            : athletes.map(a => `
                <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);">
                  <div class="stu-av" style="background:${a.bg};color:${a.fc};">${a.ini}</div>
                  <div style="flex:1;">
                    <div style="font-size:13px;font-weight:500;color:var(--text);">${a.name}</div>
                    <div style="font-size:11px;color:#8a8a80;">${a.major} · Class of ${a.year}</div>
                    ${a.sports.length > 1 ? `<div style="font-size:10px;color:#8a8a80;margin-top:2px;">Also: ${a.sports.filter(s=>s!==activeSport).map(s=>[...SPORTS.mens,...SPORTS.womens,...SPORTS.esports].find(x=>x.id===s)?.name||s).join(', ')}</div>` : ''}
                  </div>
                  <div style="text-align:right;">
                    <div style="font-size:13px;font-weight:500;color:#6b1a1a;">${a.score} pts</div>
                    <div style="font-size:10px;color:#8a8a80;">Engage score</div>
                  </div>
                </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

window.selectSport = function(id) {
  selectedSport = id;
  const content = document.getElementById('ath-content');
  if (content) content.innerHTML = renderAthleticsRoster();
};

/* ── Game announcements ────────────────────────────────── */
let athAnnouncementFilter = 'all';

function renderAthleticsAnnouncements() {
  const allSports = [...SPORTS.mens, ...SPORTS.womens];
  const filtered = athAnnouncementFilter === 'all'
    ? GAME_ANNOUNCEMENTS
    : athAnnouncementFilter === 'upcoming'
      ? GAME_ANNOUNCEMENTS.filter(g => !g.result)
      : GAME_ANNOUNCEMENTS.filter(g => g.result);

  return `<div class="page-animate">
    <div class="page-head"><h1>Game announcements</h1><p>Post upcoming games and results to the student home screen</p></div>

    <!-- Post new announcement -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-plus"></i>Post announcement</div></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">
          <div class="field" style="margin-bottom:0;">
            <label>Sport</label>
            <select id="ann-sport">
              <optgroup label="Men's Sports">
                ${SPORTS.mens.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
              </optgroup>
              <optgroup label="Women's Sports">
                ${SPORTS.womens.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
              </optgroup>
              <optgroup label="eSports">
                ${SPORTS.esports.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
              </optgroup>
            </select>
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>Opponent</label>
            <input type="text" id="ann-opp" placeholder="vs. Adelphi / at Molloy">
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>Location</label>
            <input type="text" id="ann-loc" placeholder="e.g. Soccer Field, Away">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">
          <div class="field" style="margin-bottom:0;">
            <label>Date</label>
            <input type="date" id="ann-date" value="2026-06-">
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>Time</label>
            <input type="time" id="ann-time" value="14:00">
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>Result (leave blank if upcoming)</label>
            <input type="text" id="ann-result" placeholder="e.g. W 5–2 or L 3–7">
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;">
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="postAnnouncement()">
            <i class="ti ti-send"></i> Post to student home screen
          </button>
        </div>
      </div>
    </div>

    <!-- Filter + list -->
    <div class="filter-pills">
      ${['all','upcoming','results'].map(f => `
        <button class="filter-pill ${athAnnouncementFilter===f?'active':''}" onclick="setAnnFilter('${f}')">
          ${f.charAt(0).toUpperCase()+f.slice(1)}
        </button>`).join('')}
    </div>

    <div class="card">
      <div class="card-body" style="padding:0;">
        ${filtered.map(g => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);">
            <div class="row-icon" style="background:#FBE6E6;"><i class="ti ti-trophy" style="color:#6b1a1a;"></i></div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:500;color:var(--text);">${g.sport} — ${g.opponent}</div>
              <div style="font-size:11px;color:#8a8a80;">${g.date} · ${g.time} · ${g.location} · Posted ${g.postedAt}</div>
            </div>
            ${g.result
              ? `<span class="status-badge" style="background:${g.result.startsWith('W')?'#EAF3DE':'#FBEAF0'};color:${g.result.startsWith('W')?'#3B6D11':'#993556'};">${g.result}</span>`
              : `<span class="status-badge status-active">Upcoming</span>`}
            <button class="btn-secondary" style="font-size:11px;" onclick="addResult(${g.id})">
              ${g.result ? 'Edit result' : 'Add result'}
            </button>
            <button class="btn-deny" style="font-size:11px;padding:4px 10px;" onclick="deleteAnnouncement(${g.id})">Remove</button>
          </div>`).join('')}
        ${filtered.length === 0 ? `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No ${athAnnouncementFilter} announcements</div>` : ''}
      </div>
    </div>
  </div>`;
}

window.setAnnFilter = function(f) {
  athAnnouncementFilter = f;
  const content = document.getElementById('ath-content');
  if (content) content.innerHTML = renderAthleticsAnnouncements();
};

window.postAnnouncement = function() {
  const sport  = document.getElementById('ann-sport').value;
  const opp    = document.getElementById('ann-opp').value.trim();
  const loc    = document.getElementById('ann-loc').value.trim();
  const date   = document.getElementById('ann-date').value;
  const time   = document.getElementById('ann-time').value;
  const result = document.getElementById('ann-result').value.trim();
  if (!opp) { alert('Please enter an opponent.'); return; }

  const [y,m,d] = date.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDate = `${months[parseInt(m)-1]} ${parseInt(d)}`;
  const [h,min] = time.split(':').map(Number);
  const fmtTime = `${h>12?h-12:h}:${String(min).padStart(2,'0')}${h>=12?'pm':'am'}`;

  GAME_ANNOUNCEMENTS.unshift({
    id: Date.now(), sport, opponent: opp, date: fmtDate, time: fmtTime,
    location: loc || 'TBD', result: result || null, postedAt: 'Just now',
  });
  showToast('Announcement posted to student home screen.');
  const content = document.getElementById('ath-content');
  if (content) content.innerHTML = renderAthleticsAnnouncements();
};

window.addResult = function(id) {
  const result = prompt('Enter result (e.g. W 5–2 or L 3–7):');
  if (!result) return;
  const ann = GAME_ANNOUNCEMENTS.find(g => g.id === id);
  if (ann) ann.result = result;
  showToast('Result updated.');
  const content = document.getElementById('ath-content');
  if (content) content.innerHTML = renderAthleticsAnnouncements();
};

window.deleteAnnouncement = function(id) {
  const idx = GAME_ANNOUNCEMENTS.findIndex(g => g.id === id);
  if (idx > -1) GAME_ANNOUNCEMENTS.splice(idx, 1);
  showToast('Announcement removed from home screen.');
  const content = document.getElementById('ath-content');
  if (content) content.innerHTML = renderAthleticsAnnouncements();
};

/* ── Athletic space bookings ───────────────────────────── */
function renderAthleticsBookings() {
  // Filter to athletic spaces only
  const athleticBookings = ADMIN_BOOKINGS.filter(b =>
    SPACES.some(s =>
      ATHLETIC_SPACE_IDS.includes(s.id) &&
      (b.space.toLowerCase().includes('gym') ||
       b.space.toLowerCase().includes('soccer') ||
       b.space.toLowerCase().includes('tennis') ||
       b.space.toLowerCase().includes('volleyball') ||
       b.space.toLowerCase().includes('track') ||
       b.space.toLowerCase().includes('athletic') ||
       b.space.toLowerCase().includes('fitness'))
    ) || b.attendees > 30
  );

  const pending = athleticBookings.filter(b => bookingState[b.id] === 'pending').length;

  return `<div class="page-animate">
    <div class="page-head"><h1>Athletic space bookings</h1><p>${pending} pending · Athletic spaces only</p></div>
    <div class="card">
      <div class="card-body" style="padding:0;overflow-x:auto;">
        <table class="data-table">
          <thead><tr>
            <th>Student</th><th>Purpose</th><th>Space</th><th>Date & time</th><th>Attendees</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            ${athleticBookings.length === 0
              ? `<tr><td colspan="7" style="text-align:center;padding:2rem;color:#8a8a80;">No athletic space bookings</td></tr>`
              : athleticBookings.map(b => `
                <tr id="athbrow-${b.id}">
                  <td class="td-name">${b.student}</td>
                  <td><div class="td-name">${b.purpose}</div>${b.notes?`<div class="td-meta">${b.notes}</div>`:''}</td>
                  <td>${b.space}</td>
                  <td><div>${b.date}</div><div class="td-meta">${b.time}</div></td>
                  <td>${b.attendees}</td>
                  <td><span class="status-badge status-${bookingState[b.id]}">${bookingState[b.id].charAt(0).toUpperCase()+bookingState[b.id].slice(1)}</span></td>
                  <td>
                    <div class="action-row" id="athbactions-${b.id}">
                      ${bookingState[b.id]==='pending'
                        ? `<button class="btn-approve" onclick="athApproveBooking(${b.id})">Approve</button>
                           <button class="btn-deny" onclick="athDenyBooking(${b.id})">Deny</button>`
                        : `<button class="btn-secondary" onclick="athResetBooking(${b.id})">Reset</button>`}
                    </div>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

window.athApproveBooking = function(id) {
  bookingState[id] = 'approved';
  const content = document.getElementById('ath-content');
  if (content) content.innerHTML = renderAthleticsBookings();
  showToast('Booking approved.');
};
window.athDenyBooking = function(id) {
  bookingState[id] = 'denied';
  const content = document.getElementById('ath-content');
  if (content) content.innerHTML = renderAthleticsBookings();
  showToast('Booking denied.');
};
window.athResetBooking = function(id) {
  bookingState[id] = 'pending';
  const content = document.getElementById('ath-content');
  if (content) content.innerHTML = renderAthleticsBookings();
};

/* ── Live Supabase wiring ─────────────────────────────── */
const _origPostAnn = postAnnouncement;
window.postAnnouncement = async function() {
  const sport  = document.getElementById('ann-sport')?.value;
  const opp    = document.getElementById('ann-opp')?.value.trim();
  const loc    = document.getElementById('ann-loc')?.value.trim();
  const date   = document.getElementById('ann-date')?.value;
  const time   = document.getElementById('ann-time')?.value;
  const result = document.getElementById('ann-result')?.value.trim();
  if (!opp) { alert('Please enter an opponent.'); return; }

  const [y,m,d] = date.split('-');
  const months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDate = `${months[parseInt(m)-1]} ${parseInt(d)}`;
  const [h,min] = time.split(':').map(Number);
  const fmtTime = `${h>12?h-12:h}:${String(min).padStart(2,'0')}${h>=12?'pm':'am'}`;

  try {
    await createGameAnnouncement({
      sport, opponent: opp, game_date: fmtDate, game_time: fmtTime,
      location: loc || 'TBD', result: result || null,
    });
    showToast('Announcement posted to student home screen.');
    document.getElementById('ann-opp').value = '';
    document.getElementById('ann-result').value = '';
    // Reload
    const anns = await fetchGameAnnouncements();
    GAME_ANNOUNCEMENTS.length = 0;
    anns.forEach(a => GAME_ANNOUNCEMENTS.push({
      id: a.id, sport: a.sport, opponent: a.opponent,
      date: a.game_date, time: a.game_time,
      location: a.location, result: a.result, postedAt: 'Just now',
    }));
    const content = document.getElementById('ath-content');
    if (content) content.innerHTML = renderAthleticsAnnouncements();
  } catch(e) { showToast('Could not post — check connection.'); }
};
