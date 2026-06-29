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
              <input type="date" id="ef-date">
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
            <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="adminCreateEvent()">
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
              const rsvpCount = e.rsvps || 0;
              const pct = e.capacity ? Math.round(rsvpCount / e.capacity * 100) : 0;
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
                    <button class="tbtn" onclick="showCheckinQR('${e.id}')">
                      <i class="ti ti-qrcode" style="font-size:12px;"></i> Check-in
                    </button>
                    <button class="btn-secondary" onclick="editEvent('${e.id}')">Edit</button>
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

async function adminCreateEvent() {
  const name     = document.getElementById('ef-name')?.value.trim();
  const date     = document.getElementById('ef-date')?.value;
  const start    = document.getElementById('ef-start')?.value;
  const end      = document.getElementById('ef-end')?.value;
  const location = document.getElementById('ef-location')?.value.trim();
  const capacity = parseInt(document.getElementById('ef-capacity')?.value) || 100;
  const points   = parseInt(document.getElementById('ef-points')?.value) || 50;
  const type     = document.getElementById('ef-type')?.value || 'general';

  if (!name) { alert('Please enter an event name.'); return; }
  if (!date)  { alert('Please select a date.'); return; }

  try {
    const { data, error } = await db.from('events').insert({
      title:      name,
      event_date: date,
      start_time: start || null,
      end_time:   end   || null,
      location:   location || '',
      capacity,
      points,
      type,
      color: '#6b1a1a',
      bg:    '#FBE6E6',
    }).select().single();

    if (error) throw error;

    // Also push to local array so admin sees it immediately
    ADMIN_EVENTS_CREATED.push({ id: data.id, name, date, capacity, points, type, checkins: 0 });

    showToast(`"${name}" published to students.`);
    toggleEventForm();
    await loadAdminEventsFromDB();
  } catch(e) {
    console.error('Create event failed:', e);
    showToast('Could not create event — check connection.');
  }
}

function editEvent(id) {
  const e = ADMIN_EVENTS_CREATED.find(ev => ev.id === id);
  if (!e) { showToast('Event not found.'); return; }
  const modal = document.createElement('div');
  modal.id = 'edit-event-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeEditEventModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:500px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Edit event</div>
          <button onclick="closeEditEventModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div class="field"><label>Event name</label><input type="text" id="ee-name" value="${e.name}"></div>
          <div class="field-row-2">
            <div class="field"><label>Date</label><input type="date" id="ee-date" value="${e.date}"></div>
            <div class="field"><label>Points</label><input type="number" id="ee-pts" value="${e.points}"></div>
          </div>
          <div class="field-row-2">
            <div class="field"><label>Capacity</label><input type="number" id="ee-cap" value="${e.capacity}"></div>
            <div class="field"><label>Location</label><input type="text" id="ee-loc" value="${e.location || ''}"></div>
          </div>
        </div>
        <div class="modal-footer" style="justify-content:space-between;">
          <button onclick="deleteEvent('${id}')" style="background:none;border:1px solid #993556;border-radius:8px;padding:9px 18px;font-size:13px;color:#993556;cursor:pointer;">Delete event</button>
          <div style="display:flex;gap:8px;">
            <button onclick="closeEditEventModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;">Cancel</button>
            <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="saveEditEvent('${id}')">Save changes</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function saveEditEvent(id) {
  const name = document.getElementById('ee-name')?.value.trim();
  const date = document.getElementById('ee-date')?.value;
  const pts  = parseInt(document.getElementById('ee-pts')?.value) || 50;
  const cap  = parseInt(document.getElementById('ee-cap')?.value) || 100;
  const loc  = document.getElementById('ee-loc')?.value.trim();
  if (!name) { showToast('Please enter an event name.'); return; }
  try {
    const { error } = await db.from('events').update({
      title: name, event_date: date, points: pts, capacity: cap, location: loc
    }).eq('id', id);
    if (error) throw error;
    closeEditEventModal();
    showToast('Event updated.');
    await loadAdminEventsFromDB();
  } catch(e) {
    console.error('Edit event failed:', e);
    showToast('Could not save — check connection.');
  }
}

async function deleteEvent(id) {
  if (!confirm('Delete this event? This cannot be undone.')) return;
  try {
    const { error } = await db.from('events').delete().eq('id', id);
    if (error) throw error;
    closeEditEventModal();
    showToast('Event deleted.');
    await loadAdminEventsFromDB();
  } catch(e) {
    showToast('Could not delete — check connection.');
  }
}

function closeEditEventModal() {
  const m = document.getElementById('edit-event-modal');
  if (m) m.remove();
}

function showCheckinQR(id) {
  const e = ADMIN_EVENTS_CREATED.find(ev => ev.id === id);
  if (!e) return;
  const url = `${location.origin}/app.html?checkin=${id}`;
  const modal = document.createElement('div');
  modal.id = 'checkin-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeCheckinModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:380px;text-align:center;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Check-in: ${e.name}</div>
          <button onclick="closeCheckinModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <div id="qr-container" style="padding:16px;background:#fff;border-radius:12px;border:1px solid var(--border);"></div>
          <p style="font-size:12px;color:#8a8a80;margin:0;">Students scan this QR code to check in and earn ${e.points} points</p>
          <div style="display:flex;gap:8px;width:100%;">
            <button class="btn-secondary" style="flex:1;" onclick="copyCheckinLink('${url}')">
              <i class="ti ti-copy" style="font-size:12px;"></i> Copy link
            </button>
            <button class="btn-primary" style="flex:1;width:auto;" onclick="window.print()">
              <i class="ti ti-printer" style="font-size:12px;"></i> Print QR
            </button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  // Generate QR code using free API
  const qrImg = document.createElement('img');
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  qrImg.style.cssText = 'width:200px;height:200px;display:block;';
  qrImg.alt = 'Check-in QR code';
  document.getElementById('qr-container').appendChild(qrImg);
}

function copyCheckinLink(url) {
  navigator.clipboard.writeText(url).then(() => showToast('Check-in link copied!'));
}

function closeCheckinModal() {
  const m = document.getElementById('checkin-modal');
  if (m) m.remove();
}

/* ── Load events from Supabase ───────────────────────────── */
async function loadAdminEventsFromDB() {
  try {
    const { data, error } = await db
      .from('events')
      .select('*, rsvps(count)')
      .order('event_date', { ascending: true });
    if (error) throw error;

    ADMIN_EVENTS_CREATED.length = 0;
    (data || []).forEach(e => {
      ADMIN_EVENTS_CREATED.push({
        id:       e.id,
        name:     e.title,
        date:     e.event_date,
        type:     e.type || 'general',
        capacity: e.capacity || 100,
        points:   e.points || 50,
        checkins: 0,
        rsvps:    e.rsvps?.[0]?.count || 0,
        location: e.location || '',
      });
    });

    const content = document.getElementById('admin-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.id === 'anav-events') {
      content.innerHTML = renderAdminEvents();
    }
  } catch(e) {
    console.warn('Admin events load failed:', e);
  }
}
