/* ============================================================
   STAC Engage — Admin: QR Check-in
   Supabase: insert `event_checkins`, update student score
   ============================================================ */

let activeCheckinEvent = null;
let checkedInStudents  = new Set([1, 3, 4]); // seed: Jude, Aisha, Marcus checked in

function renderAdminCheckin() {
  const event = activeCheckinEvent
    ? ADMIN_EVENTS_CREATED.find(e => e.id === activeCheckinEvent)
    : ADMIN_EVENTS_CREATED[0];

  return `<div class="page-animate">
    <div class="page-head">
      <h1>QR check-in</h1>
      <p>Generate a QR code for students to scan at the door</p>
    </div>

    <div class="g2">

      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-calendar-event"></i>Select event</div>
        </div>
        <div class="card-body">
          ${ADMIN_EVENTS_CREATED.map(e => `
            <div class="row" style="cursor:pointer;${activeCheckinEvent===e.id||(!activeCheckinEvent&&e.id===1)?'background:rgba(26,58,107,0.05);border-radius:8px;padding:10px 8px;margin:0 -8px;':''}"
              onclick="loadCheckinEvent('${e.id}')">
              <div class="row-icon" style="background:#FBE6E6;"><i class="ti ti-calendar" style="color:#6b1a1a;"></i></div>
              <div class="row-info">
                <div class="row-name">${e.name}</div>
                <div class="row-meta">${e.date} · +${e.points} pts</div>
              </div>
              ${(activeCheckinEvent===e.id||(!activeCheckinEvent&&e.id===1))
                ? `<i class="ti ti-check" style="color:#6b1a1a;font-size:16px;"></i>` : ''}
            </div>`).join('')}
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:1rem;">
          <div class="card-head">
            <div class="card-title"><i class="ti ti-qrcode"></i>QR code</div>
            <button class="tbtn" onclick="downloadQR()"><i class="ti ti-download" style="font-size:12px;"></i> Download</button>
          </div>
          <div class="qr-block">
            <div class="qr-frame">
              ${generateQRSVG(event ? event.id : 1)}
            </div>
            <div class="qr-label">${event ? event.name : 'Select an event'}</div>
            <div class="qr-sub">Students scan this to check in and earn ${event ? event.points : 0} pts</div>
            <div style="display:flex;gap:8px;margin-top:4px;">
              <button class="tbtn" onclick="showToast('Link copied to clipboard.')">
                <i class="ti ti-link" style="font-size:12px;"></i> Copy link
              </button>
              <button class="tbtn" onclick="showToast('QR code sent to your email.')">
                <i class="ti ti-mail" style="font-size:12px;"></i> Email
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div class="card-title"><i class="ti ti-user-check"></i>Manual check-in</div>
            <span style="font-size:12px;color:var(--text-3);">${checkedInStudents.size} checked in</span>
          </div>
          <div class="card-body">
            <div class="search-bar" style="margin-bottom:10px;">
              <i class="ti ti-search"></i>
              <input placeholder="Search by student name..." oninput="filterCheckinList(this.value)" id="checkin-search">
            </div>
            <div id="checkin-student-list">
              ${renderCheckinList('')}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>`;
}

function renderCheckinList(query) {
  const filtered = ADMIN_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );
  return filtered.map(s => {
    const checked = checkedInStudents.has(s.id);
    return `<div class="row" id="ci-row-${s.id}">
      <div class="stu-av" style="background:${s.bg};color:${s.fc};">${s.ini}</div>
      <div class="row-info">
        <div class="row-name">${s.name}</div>
        <div class="row-meta">${s.major} · ${s.score} pts</div>
      </div>
      <button class="tbtn ${checked ? 'done' : ''}" onclick="toggleCheckin('${s.id}')">
        ${checked ? '<i class="ti ti-check" style="font-size:12px;"></i> In' : 'Check in'}
      </button>
    </div>`;
  }).join('');
}

function filterCheckinList(q) {
  const el = document.getElementById('checkin-student-list');
  if (el) el.innerHTML = renderCheckinList(q);
}

async function toggleCheckin(studentId) {
  const eventId = activeCheckinEvent;
  if (checkedInStudents.has(studentId)) {
    checkedInStudents.delete(studentId);
    try { await db.from('rsvps').delete().eq('event_id', eventId).eq('user_id', studentId); } catch(e) {}
  } else {
    checkedInStudents.add(studentId);
    try {
      await db.from('rsvps').upsert({ event_id: eventId, user_id: studentId, checked_in: true });
      const evt = ADMIN_EVENTS_CREATED.find(e => e.id === eventId);
      const pts = evt?.points || 50;
      await db.rpc('add_score', { p_user_id: studentId, p_points: pts });
      await db.from('notifications').insert({
        user_id: studentId, type: 'event', read: false,
        text: `You were checked in to "${evt?.name || 'an event'}" and earned ${pts} points!`
      });
    } catch(e) { console.warn('Checkin failed:', e); }
  }
  const list   = document.getElementById('checkin-student-list');
  const search = document.getElementById('checkin-search');
  if (list) list.innerHTML = renderCheckinList(search ? search.value : '');
  const countEl = document.querySelector('.card-head span[style*="text-3"]');
  if (countEl) countEl.textContent = checkedInStudents.size + ' checked in';
}

function loadCheckinEvent(id) {
  activeCheckinEvent = id;
  const content = document.getElementById('admin-content');
  if (content) content.innerHTML = renderAdminCheckin();
}

function downloadQR() {
  showToast('QR code downloaded as PNG.');
}

function generateQRSVG(eventId) {
  // Deterministic QR-like pattern from event ID
  const seed  = eventId * 137;
  const size  = 11;
  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Finder patterns (corners)
      const inFinder =
        (r < 3 && c < 3) || (r < 3 && c > size-4) || (r > size-4 && c < 3);
      const val = inFinder ? true : ((seed * (r+1) * (c+1) * 31) % 7 < 3);
      cells.push({ r, c, v: val });
    }
  }
  const cell = 148 / size;
  return `<svg viewBox="0 0 148 148" xmlns="http://www.w3.org/2000/svg">
    <rect width="148" height="148" fill="white"/>
    ${cells.map(({r,c,v}) => v
      ? `<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}" fill="#6b1a1a"/>`
      : '').join('')}
  </svg>`;
}
