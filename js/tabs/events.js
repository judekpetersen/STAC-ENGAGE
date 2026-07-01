/* ============================================================
   STAC Engage v7 — Events Tab (+ dining menu, waitlist, feedback)
   ============================================================ */

let diningMeal = 'lunch';

function renderEvents() {
  return `<div class="page-animate">
    <div class="page-head"><h1>Events & dining</h1><p>Browse events, check today's menu, and leave feedback</p></div>

    <!-- Dining menu -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-tools-kitchen-2"></i>Aramark dining — today</div>
        <div style="display:flex;gap:4px;">
          ${['breakfast','lunch','dinner'].map(m => `
            <button class="cal-view-btn ${diningMeal===m?'active':''}" onclick="setDiningMeal('${m}')">
              ${m.charAt(0).toUpperCase()+m.slice(1)}
            </button>`).join('')}
        </div>
      </div>
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:12px;color:#8a8a80;"><i class="ti ti-clock" style="font-size:12px;"></i> ${DINING_MENU.hours[diningMeal]}</span>
          <div style="display:flex;gap:8px;font-size:11px;">
            <span style="background:#EAF3DE;color:#3B6D11;padding:2px 7px;border-radius:999px;">VG = Vegetarian</span>
            <span style="background:#EEEDFE;color:#533AB7;padding:2px 7px;border-radius:999px;">GF = Gluten Free</span>
          </div>
        </div>
        <div id="dining-items">${renderDiningItems()}</div>
      </div>
    </div>

    <!-- Events -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-calendar-event"></i>June 2026</div>
        <span class="pill" style="background:#EAF3DE;color:#3B6D11;">5 events this month</span>
      </div>
      <div class="card-body">${DATA.events.map(e => C_eventRowV7(e)).join('')}</div>
    </div>

    <!-- Feedback needed -->
    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-star"></i>Leave feedback</div>
        <span style="font-size:11px;color:#8a8a80;">+10 pts for each review</span>
      </div>
      <div class="card-body" id="feedback-section">
        ${renderFeedbackSection()}
      </div>
    </div>
  </div>`;
}

function renderDiningItems() {
  return `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
    ${DINING_MENU.meals[diningMeal].map(item => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:var(--surface-2);border-radius:var(--radius);border:1px solid var(--border);">
        <div>
          <div style="font-size:13px;font-weight:500;color:var(--text);">${item.name}</div>
          <div style="font-size:11px;color:#8a8a80;margin-top:1px;">${item.station}</div>
        </div>
        <div style="display:flex;gap:4px;">
          ${item.tags.map(t => `<span style="font-size:9px;background:${t==='VG'?'#EAF3DE':t==='GF'?'#EEEDFE':'#F1EFE8'};color:${t==='VG'?'#3B6D11':t==='GF'?'#533AB7':'#5F5E5A'};padding:2px 6px;border-radius:999px;font-weight:500;">${t}</span>`).join('')}
        </div>
      </div>`).join('')}
  </div>`;
}

function setDiningMeal(meal) {
  diningMeal = meal;
  const content = document.getElementById('admin-content') || document.getElementById('app-content');
  if (content) content.innerHTML = renderEvents();
}

function C_eventRowV7(e) {
  const isFull     = e.capacity && e.rsvpCount >= e.capacity;
  const onWaitlist = waitlistState[e.id];
  const needsFeedback = false; // feedback prompts disabled until post-launch

  return `<div class="row">
    <div class="date-box" style="background:${e.tc};border:1px solid ${e.bc}25;">
      <span class="dmonth" style="color:${e.bc};">${e.month}</span>
      <span class="dday" style="color:${e.bc};">${e.day}</span>
    </div>
    <div class="row-info">
      <div class="row-name">${e.name}</div>
      <div class="row-meta"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${e.loc} · +${e.pts} pts
        ${isFull ? `<span style="margin-left:6px;font-size:10px;background:#FBEAF0;color:#993556;padding:1px 6px;border-radius:999px;">Full</span>` : ''}
      </div>
    </div>
    ${needsFeedback
      ? `<button class="tbtn" style="background:#FAEEDA;color:#854F0B;border-color:#854F0B;" onclick="openFeedback('${e.id}')">Rate it</button>`
      : isFull
        ? `<button class="tbtn ${onWaitlist?'on':''}" onclick="toggleWaitlist('${e.id}',this)">${onWaitlist?'On waitlist':'Join waitlist'}</button>`
        : `<button class="tbtn ${isRSVP(e.id)?'on':''}" onclick="doRSVP('${e.id}',this)">${isRSVP(e.id)?'RSVPd':'RSVP'}</button>`}
  </div>`;
}

function renderFeedbackSection() {
  const needsFeedback = DATA.events.filter(e => !feedbackState[e.id]);
  if (!needsFeedback.length) return `<div style="text-align:center;padding:1rem;color:#8a8a80;font-size:13px;">No feedback needed right now — check back after events.</div>`;
  return needsFeedback.map(e => `
    <div id="fb-${e.id}" class="row">
      <div class="row-icon" style="background:${e.tc};"><i class="ti ti-calendar" style="color:${e.bc};"></i></div>
      <div class="row-info">
        <div class="row-name">${e.name}</div>
        <div class="row-meta">How was it? Your feedback is anonymous.</div>
      </div>
      <button class="tbtn" style="background:#FAEEDA;color:#854F0B;border-color:#854F0B;" onclick="openFeedback('${e.id}')">Rate</button>
    </div>`).join('');
}

function toggleWaitlist(id, btn) {
  waitlistState[id] = !waitlistState[id];
  btn.className = 'tbtn' + (waitlistState[id] ? ' on' : '');
  btn.textContent = waitlistState[id] ? 'On waitlist' : 'Join waitlist';
  if (waitlistState[id]) showToast('Added to waitlist — you\'ll be notified if a spot opens.');
}

function openFeedback(eventId) {
  const e = DATA.events.find(x => x.id === eventId);
  const modal = document.createElement('div');
  modal.id = 'feedback-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeFeedbackModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;color:var(--text);">Rate: ${e.name}</div>
          <button onclick="closeFeedbackModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:#5a5a52;margin-bottom:1rem;">Your feedback is completely anonymous and helps improve future events.</p>
          <div style="margin-bottom:1rem;">
            <div style="font-size:12px;font-weight:500;color:#8a8a80;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;">Overall rating</div>
            <div style="display:flex;gap:8px;" id="star-row">
              ${[1,2,3,4,5].map(n => `<button onclick="setStars('${n}')" id="star-${n}" style="font-size:28px;background:none;border:none;cursor:pointer;color:#d0cfc8;transition:color .1s;">★</button>`).join('')}
            </div>
          </div>
          <div class="field"><label>What did you enjoy?</label><input type="text" id="fb-good" placeholder="e.g. Great speakers, good food..."></div>
          <div class="field"><label>What could be improved?</label><input type="text" id="fb-improve" placeholder="e.g. Needed more seating..."></div>
          <div class="field">
            <label>Would you attend again?</label>
            <select id="fb-again"><option value="">Select</option><option>Definitely</option><option>Probably</option><option>Not sure</option><option>Probably not</option></select>
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="closeFeedbackModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="submitFeedback('${eventId}')">Submit anonymously</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

let selectedStars = 0;
function setStars(n) {
  selectedStars = n;
  for (let i = 1; i <= 5; i++) {
    const s = document.getElementById('star-' + i);
    if (s) s.style.color = i <= n ? '#c8b560' : '#d0cfc8';
  }
}

function closeFeedbackModal() {
  const m = document.getElementById('feedback-modal');
  if (m) m.remove();
  selectedStars = 0;
}

function submitFeedback(eventId) {
  feedbackState[eventId] = { stars: selectedStars, submitted: true };
  closeFeedbackModal();
  showToast('Feedback submitted — +10 pts added!');
  const section = document.getElementById('feedback-section');
  if (section) section.innerHTML = renderFeedbackSection();
  const evtContent = document.getElementById('app-content');
  if (evtContent) evtContent.innerHTML = renderEvents();
}

function showToast(msg) {
  const existing = document.getElementById('stac-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'stac-toast';
  toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#6b1a1a;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.2);display:flex;align-items:center;gap:8px;white-space:nowrap;font-family:var(--font-body);`;
  toast.innerHTML = `<i class="ti ti-check" style="color:#c8b560;font-size:15px;"></i>${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ── v8 — Event request flow ─────────────────────────── */

function openEventRequestForm() {
  const modal = document.createElement('div');
  modal.id = 'event-req-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeEventReqModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:520px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;color:var(--text);">Request a campus event</div>
          <button onclick="closeEventReqModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:#FBE6E6;border-radius:var(--radius);margin-bottom:1rem;font-size:12px;color:#6b1a1a;">
            <i class="ti ti-info-circle" style="font-size:15px;flex-shrink:0;"></i>
            Your request will be reviewed by the admin team. You'll be notified once it's approved or denied.
          </div>
          <div class="field"><label>Event name</label>
            <input type="text" id="er-name" placeholder="e.g. Business Club Spring Mixer">
          </div>
          <div class="field-row-2">
            <div class="field"><label>Date</label>
              <input type="date" id="er-date" value="2026-06-">
            </div>
            <div class="field"><label>Organization</label>
              <select id="er-org">
                ${(STUDENT_POSITIONS[CURRENT_STUDENT_ID]||[]).map(p =>
                  `<option value="${p.org}" selected>${p.org} (${p.position})</option>`
                ).join('')}
                ${DATA.orgs.filter(o => !(STUDENT_POSITIONS[CURRENT_STUDENT_ID]||[]).some(p => p.org === o.name)).map(o =>
                  `<option value="${o.name}">${o.name}</option>`
                ).join('')}
              </select>
            </div>
          </div>
          <div class="field-row-2">
            <div class="field"><label>Start time</label>
              <input type="time" id="er-start" value="17:00">
            </div>
            <div class="field"><label>End time</label>
              <input type="time" id="er-end" value="19:00">
            </div>
          </div>
          <div class="field"><label>Preferred space</label>
            <select id="er-space">
              <option value="">No preference / TBD</option>
              ${SPACES.map(s => `<option value="${s.name}" ${s.available?'':'disabled'}>${s.name} (cap. ${s.capacity})${s.available?'':' — unavailable'}</option>`).join('')}
            </select>
          </div>
          <div class="field-row-2">
            <div class="field"><label>Expected attendance</label>
              <input type="number" id="er-attend" placeholder="How many students?">
            </div>
            <div class="field"><label>Points to award</label>
              <input type="number" id="er-pts" value="50" min="0" max="150">
            </div>
          </div>
          <div class="field"><label>Event description</label>
            <input type="text" id="er-desc" placeholder="Brief description for the campus calendar...">
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="closeEventReqModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="submitEventRequest()">
            <i class="ti ti-send"></i> Submit for approval
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function closeEventReqModal() {
  const m = document.getElementById('event-req-modal');
  if (m) m.remove();
}

async function submitEventRequest() {
  const name = document.getElementById('er-name').value.trim();
  if (!name) { alert('Please enter an event name.'); return; }
  const date    = document.getElementById('er-date').value;
  const org     = document.getElementById('er-org').value;
  const start   = document.getElementById('er-start').value;
  const end     = document.getElementById('er-end').value;
  const space   = document.getElementById('er-space').value;
  const attend  = document.getElementById('er-attend').value;
  const pts     = document.getElementById('er-pts').value;
  const desc    = document.getElementById('er-desc').value;
  const user    = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');

  try {
    const { data, error } = await db.from('event_requests').insert({
      user_id:     user.id,
      title:       name,
      event_date:  date || null,
      start_time:  start || null,
      end_time:    end || null,
      space:       space || 'TBD',
      org:         org || 'Independent',
      attendance:  parseInt(attend) || 0,
      description: desc,
      points:      parseInt(pts) || 50,
      status:      'pending',
    }).select().single();
    if (error) throw error;

    const newReq = {
      id: data.id, title: name, date, start, end,
      space: space || 'TBD', org: org || 'Independent',
      attendance: parseInt(attend) || 0, description: desc,
      submittedBy: (user.firstName || 'Student') + ' ' + (user.lastName || ''),
      submittedAt: 'Just now', status: 'pending',
      points: parseInt(pts) || 50, adminNote: '',
    };
    EVENT_REQUESTS.unshift(newReq);
    eventRequestState[newReq.id] = 'pending';

    closeEventReqModal();
    showToast('Event request submitted — you\'ll be notified once reviewed.');

    const content = document.getElementById('app-content');
    if (content) content.innerHTML = renderEvents();
  } catch(e) {
    console.error('Event request failed:', e);
    showToast('Could not submit — check your connection.');
  }
}

/* Patch renderEvents to add the request button for OFFICERS ONLY */
const _origRenderEvents = renderEvents;
window.renderEvents = function() {
  const base = _origRenderEvents();
  const officer = isOfficer(CURRENT_STUDENT_ID);
  const myPositions = STUDENT_POSITIONS[CURRENT_STUDENT_ID] || [];
  const _u=JSON.parse(localStorage.getItem('stac_engage_user')||'{}'); const _myName=(_u.firstName||'')+' '+(_u.lastName||''); const myRequests = EVENT_REQUESTS.filter(r => r.submittedBy.trim() === _myName.trim() || r.submittedBy === 'Student');

  // Non-officers: just show a note that only officers can request events
  const requestSection = officer ? `
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title">
          <i class="ti ti-calendar-plus"></i>Officer event requests
          ${myPositions.map(p => {
            const pc = POSITION_COLORS[p.position] || { bg:'#FBE6E6', color:'#6b1a1a' };
            return `<span class="pill" style="background:${pc.bg};color:${pc.color};font-size:10px;margin-left:4px;">${p.position} — ${p.org}</span>`;
          }).join('')}
        </div>
        <button class="btn-primary" style="width:auto;padding:7px 16px;font-size:12px;" onclick="openEventRequestForm()">
          <i class="ti ti-plus"></i> New request
        </button>
      </div>
      <div class="card-body">
        ${myRequests.length === 0
          ? `<div style="text-align:center;padding:1rem;color:#8a8a80;font-size:13px;">
               You haven't submitted any event requests yet.<br>
               <span style="color:#6b1a1a;cursor:pointer;font-weight:500;" onclick="openEventRequestForm()">Submit your first request →</span>
             </div>`
          : myRequests.map(r => {
              const status = eventRequestState[r.id];
              const statusMap = {
                pending:  { label:'Pending review', bg:'#FAEEDA', color:'#854F0B' },
                approved: { label:'Approved',       bg:'#EAF3DE', color:'#3B6D11' },
                denied:   { label:'Denied',         bg:'#FBEAF0', color:'#993556' },
              };
              const s = statusMap[status] || statusMap.pending;
              const [y,m,d] = r.date.split('-');
              return `
                <div class="row">
                  <div class="date-box" style="background:#FBE6E6;border:1px solid #6b1a1a25;">
                    <span class="dmonth" style="color:#6b1a1a;">${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m)-1]}</span>
                    <span class="dday"   style="color:#6b1a1a;">${parseInt(d)}</span>
                  </div>
                  <div class="row-info">
                    <div class="row-name">${r.title}</div>
                    <div class="row-meta">${r.org} · ${r.space} · Submitted ${r.submittedAt}</div>
                    ${r.adminNote ? `<div style="font-size:11px;color:#993556;margin-top:2px;"><i class="ti ti-message" style="font-size:10px;"></i> Admin: ${r.adminNote}</div>` : ''}
                  </div>
                  <span class="pill" style="background:${s.bg};color:${s.color};">${s.label}</span>
                </div>`;
            }).join('')}
      </div>
    </div>` : `
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-calendar-plus"></i>Event requests</div></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:12px;padding:8px;background:var(--surface-2);border-radius:var(--radius);">
          <i class="ti ti-lock" style="color:#8a8a80;font-size:20px;flex-shrink:0;"></i>
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text);">Officer access only</div>
            <div style="font-size:12px;color:#8a8a80;margin-top:2px;">Only club officers (President, VP, Secretary, Treasurer) can submit event requests. Contact an admin to be assigned a position.</div>
          </div>
        </div>
      </div>
    </div>`;

  // Insert before the feedback card
  return base.replace(
    '<div class="card">\n      <div class="card-head">\n        <div class="card-title"><i class="ti ti-star"></i>Leave feedback</div>',
    requestSection + '\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title"><i class="ti ti-star"></i>Leave feedback</div>'
  );
};

/* ── v17 Supabase live events ─────────────────────────── */
async function loadEventsFromDB() {
  try {
    const events = await fetchEvents();
    DATA.events = events.map(e => {
      const color  = e.color || '#6b1a1a';
      const bg     = e.bg    || '#FBE6E6';
      const date   = e.event_date || '';
      const parts  = date.split('-');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const month  = parts[1] ? months[parseInt(parts[1]) - 1] : '';
      const day    = parts[2] ? parseInt(parts[2]).toString() : '';
      return {
        id: e.id, name: e.title, title: e.title, date,
        start: e.start_time, end: e.end_time,
        location: e.location, space: e.location || e.space || '',
        capacity: e.capacity || 100, points: e.points || 50,
        type: e.type || 'general', color, bg, rsvp: false,
        // Shorthand aliases used by C_eventRowV7
        tc: bg, bc: color,
        month, day,
        loc: e.location || e.space || 'STAC Campus',
        pts: e.points || 50,
        rsvpCount: 0,
      };
    });
    // Load this user's RSVPs
    const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
    if (user.id) {
      const myRSVPs = await fetchMyRSVPs(user.id);
      DATA.events.forEach(e => { e.rsvp = myRSVPs.includes(e.id); });
    }
    // Refresh tab if currently visible
    const content = document.getElementById('app-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.dataset.tab === 'events') {
      content.innerHTML = renderEvents();
    }
  } catch(e) { console.warn('Events load failed:', e); }
}

/* ── Post-event: auto-notify attendees when event date passes ── */
async function checkPastEvents() {
  const today = new Date().toISOString().split('T')[0];
  const user  = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) return;
  try {
    // Find past events this student RSVPd to that haven't been notified yet
    const { data: rsvps } = await db
      .from('rsvps')
      .select('event_id, events(title, event_date, points)')
      .eq('user_id', user.id)
      .eq('checked_in', false);
    if (!rsvps) return;
    for (const r of rsvps) {
      const e = r.events;
      if (!e || !e.event_date) continue;
      if (e.event_date < today) {
        // Event has passed — remind student to check in or give feedback
        await db.from('notifications').insert({
          user_id: user.id, type: 'event', read: false,
          text: `"${e.title}" has ended. If you attended, ask your admin to check you in for ${e.points || 50} points!`
        });
      }
    }
  } catch(e) { /* silent */ }
}
