/* ============================================================
   STAC Engage — Admin: Events
   Supabase: insert/update `events`, query attendance per event
   ============================================================ */

function renderAdminEvents() {
  // TODO (Supabase):
  // const { data: events } = await db.from('events').select('*, rsvps(count)').order('event_date');
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Event management</h1>
      <p>Create campus events, track RSVPs, and monitor attendance</p>
    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-plus"></i>Create new event</div>
        <button class="tbtn" onclick="toggleEventForm()" id="event-form-toggle">Expand</button>
      </div>
      <div id="event-form-body" style="display:none;">
        <div class="card-body">
          <div class="event-form-grid">
            <div class="field" style="grid-column:1/-1;">
              <label>Event name</label>
              <input type="text" id="ef-name" placeholder="e.g. Fall Kickoff Mixer">
            </div>
            <div class="field">
              <label>Date</label>
              <input type="date" id="ef-date" value="2026-06-">
            </div>
            <div class="field">
              <label>Event type</label>
              <select id="ef-type">
                <option value="org">Org / club</option>
                <option value="academic">Academic</option>
                <option value="service">Service</option>
                <option value="athletics">Athletics</option>
                <option value="social">Social</option>
                <option value="career">Career</option>
              </select>
            </div>
            <div class="field">
              <label>Start time</label>
              <input type="time" id="ef-start" value="17:00">
            </div>
            <div class="field">
              <label>End time</label>
              <input type="time" id="ef-end" value="19:00">
            </div>
            <div class="field">
              <label>Venue / space</label>
              <select id="ef-space">
                ${SPACES.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label>Points awarded</label>
              <input type="number" id="ef-pts" value="50" min="0" max="200">
            </div>
            <div class="field">
              <label>Capacity</label>
              <input type="number" id="ef-cap" placeholder="Max attendees">
            </div>
            <div class="field" style="grid-column:1/-1;">
              <label>Description</label>
              <input type="text" id="ef-desc" placeholder="Brief description for students">
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px;">
            <button class="btn-secondary" onclick="toggleEventForm()">Cancel</button>
            <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="createEvent()">
              <i class="ti ti-calendar-plus"></i> Create event
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-calendar-event"></i>All events — June 2026</div>
        <span class="pill" style="background:#FBE6E6;color:#7C0C0C;">${ADMIN_EVENTS_CREATED.length} events</span>
      </div>
      <div class="card-body" style="padding:0;overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Type</th>
              <th>RSVPs</th>
              <th>Capacity</th>
              <th>Points</th>
              <th>Check-ins</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${ADMIN_EVENTS_CREATED.map(e => {
              const rsvpCount = Math.floor(e.capacity * 0.6);
              const pct = Math.round(rsvpCount / e.capacity * 100);
              return `<tr>
                <td class="td-name">${e.name}</td>
                <td>${e.date}</td>
                <td><span class="status-badge status-active">${e.type}</span></td>
                <td>
                  <div>${rsvpCount} / ${e.capacity}</div>
                  <div class="bar-wrap" style="width:80px;margin-top:4px;">
                    <div class="bar-fill" style="width:${pct}%;background:#6b1a1a;"></div>
                  </div>
                </td>
                <td>${e.capacity}</td>
                <td>+${e.points}</td>
                <td>
                  ${e.checkins > 0
                    ? `<span class="status-badge status-approved">${e.checkins} checked in</span>`
                    : `<span class="status-badge" style="background:#F1EFE8;color:#5F5E5A;">Not started</span>`}
                </td>
                <td>
                  <div class="action-row">
                    <button class="tbtn" onclick="adminSwitchTab('checkin');loadCheckinEvent(${e.id})">
                      <i class="ti ti-qrcode" style="font-size:12px;"></i> Check-in
                    </button>
                    <button class="btn-secondary" onclick="editEvent(${e.id})">Edit</button>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

let eventFormOpen = false;
function toggleEventForm() {
  eventFormOpen = !eventFormOpen;
  const body = document.getElementById('event-form-body');
  const btn  = document.getElementById('event-form-toggle');
  if (body) body.style.display = eventFormOpen ? 'block' : 'none';
  if (btn)  btn.textContent    = eventFormOpen ? 'Collapse' : 'Expand';
}

function createEvent() {
  const name = document.getElementById('ef-name').value.trim();
  if (!name) { alert('Please enter an event name.'); return; }
  // TODO (Supabase): await db.from('events').insert({ name, event_date, start_time, end_time, type, space_id, points, capacity });
  showToast(`"${name}" created and published to students.`);
  toggleEventForm();
  // Also push it to student-facing DATA.events for live preview
}

function editEvent(id) {
  showToast('Event editor coming in the next release.');
}
