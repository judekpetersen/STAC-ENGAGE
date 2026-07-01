/* ============================================================
   STAC Engage v2 — Calendar Tab
   ============================================================ */

(function() {
  let calView = 'month'; // 'month' | 'week'
  let calYear = 2026;
  let calMonth = 5; // 0-indexed, June
  let calWeekStart = new Date(2026, 5, 8); // Mon June 8
  let selectedDay = null;
  let bookingSpace = null;

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const TYPE_LABELS = { org:'Org', academic:'Academic', service:'Service', athletics:'Athletics', study:'Study', social:'Social' };

  function eventsForDate(dateStr) {
    return CALENDAR_EVENTS.filter(e => e.date === dateStr);
  }

  function fmtTime(t) {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'pm' : 'am';
    return (h % 12 || 12) + (m ? ':' + String(m).padStart(2,'0') : '') + ampm;
  }

  function dateStr(y, m, d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  function renderMonthGrid() {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = '2026-06-08';
    let html = '';
    // Day headers
    html += `<div class="cal-day-headers">${DAY_NAMES.map(d => `<div class="cal-dh">${d}</div>`).join('')}</div>`;
    html += `<div class="cal-grid">`;
    // Empty cells
    for (let i = 0; i < firstDay; i++) html += `<div class="cal-cell empty"></div>`;
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = dateStr(calYear, calMonth, d);
      const evts = eventsForDate(ds);
      const isToday = ds === today;
      const isSel = selectedDay === ds;
      html += `<div class="cal-cell ${isToday?'today':''} ${isSel?'selected':''} ${evts.length?'has-events':''}" onclick="calSelectDay('${ds}')">
        <div class="cal-cell-num">${d}</div>
        <div class="cal-cell-dots">
          ${evts.slice(0,3).map(e => `<div class="cal-dot" style="background:${e.color};"></div>`).join('')}
        </div>
      </div>`;
    }
    html += `</div>`;
    return html;
  }

  function renderWeekGrid() {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(calWeekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    const hours = Array.from({length: 13}, (_, i) => i + 8); // 8am–8pm
    let html = `<div class="week-grid">
      <div class="week-time-col">
        <div class="week-header-cell"></div>
        ${hours.map(h => `<div class="week-hour-label">${h > 12 ? h-12 : h}${h >= 12 ? 'pm':'am'}</div>`).join('')}
      </div>`;
    days.forEach(day => {
      const ds = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
      const isToday = ds === '2026-06-08';
      const evts = eventsForDate(ds);
      html += `<div class="week-day-col ${isToday?'today':''}">
        <div class="week-header-cell ${isToday?'today':''}">
          <div class="week-hd">${DAY_NAMES[day.getDay()]}</div>
          <div class="week-hn ${isToday?'today':''}">${day.getDate()}</div>
        </div>
        <div class="week-day-body">
          ${hours.map(h => `<div class="week-slot"></div>`).join('')}
          ${evts.map(e => {
            const [sh, sm] = e.start.split(':').map(Number);
            const [eh, em] = e.end.split(':').map(Number);
            const top = ((sh - 8) + sm/60) * 52;
            const height = Math.max(((eh - sh) + (em - sm)/60) * 52 - 3, 24);
            return `<div class="week-event" style="top:${top}px;height:${height}px;background:${e.bg};border-left:3px solid ${e.color};border-radius:6px;padding:4px 6px;position:absolute;left:2px;right:2px;overflow:hidden;cursor:pointer;" title="${e.title}">
              <div style="font-size:10px;font-weight:500;color:${e.color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.title}</div>
              ${height > 36 ? `<div style="font-size:10px;color:${e.color};opacity:0.7;">${fmtTime(e.start)}</div>` : ''}
            </div>`;
          }).join('')}
        </div>
      </div>`;
    });
    html += `</div>`;
    return html;
  }

  function renderDayPanel() {
    if (!selectedDay) return `<div style="padding:1rem;text-align:center;color:#8a8a80;font-size:13px;">Select a day to see events</div>`;
    const evts = eventsForDate(selectedDay);
    const [y, m, d] = selectedDay.split('-').map(Number);
    const label = `${MONTH_NAMES[m-1]} ${d}, ${y}`;
    if (!evts.length) return `<div style="padding:1rem;">
      <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:4px;">${label}</div>
      <div style="font-size:12px;color:#8a8a80;">No events — <span style="color:#6b1a1a;cursor:pointer;" onclick="showScheduleForm()">schedule something</span></div>
    </div>`;
    return `<div style="padding:1rem 0;">
      <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:10px;padding:0 1rem;">${label}</div>
      ${evts.map(e => `
        <div style="display:flex;gap:10px;padding:8px 1rem;border-bottom:1px solid var(--border);cursor:pointer;" onclick="">
          <div style="width:3px;background:${e.color};border-radius:2px;flex-shrink:0;"></div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:500;color:var(--text);">${e.title}</div>
            <div style="font-size:11px;color:#8a8a80;margin-top:2px;">${fmtTime(e.start)} – ${fmtTime(e.end)}</div>
            <div style="font-size:11px;color:#8a8a80;"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${e.space}</div>
          </div>
          ${e.mine ? `<span style="font-size:10px;background:#EAF3DE;color:#173404;padding:2px 7px;border-radius:999px;align-self:flex-start;">Mine</span>` : ''}
        </div>`).join('')}
      <div style="padding:10px 1rem 0;">
        <button class="tbtn" style="width:100%;justify-content:center;display:flex;gap:6px;align-items:center;" onclick="showScheduleForm('${selectedDay}')">
          <i class="ti ti-plus" style="font-size:13px;"></i> Add event on this day
        </button>
      </div>
    </div>`;
  }

  function renderScheduleModal(prefillDate) {
    const dateVal = prefillDate || '2026-06-';
    return `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;color:var(--text);">Schedule an event</div>
          <button onclick="closeModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;line-height:1;">&times;</button>
        </div>
        <div class="modal-body">
          <div class="field"><label>Event name</label><input type="text" id="sch-name" placeholder="e.g. Study group, Club meeting..."></div>
          <div class="field-row-2">
            <div class="field"><label>Date</label><input type="date" id="sch-date" value="${dateVal}"></div>
            <div class="field">
              <label>Type</label>
              <select id="sch-type">
                <option value="study">Study group</option>
                <option value="org">Org meeting</option>
                <option value="social">Social</option>
                <option value="academic">Academic</option>
              </select>
            </div>
          </div>
          <div class="field-row-2">
            <div class="field"><label>Start time</label><input type="time" id="sch-start" value="14:00"></div>
            <div class="field"><label>End time</label><input type="time" id="sch-end" value="15:00"></div>
          </div>
          <div class="field">
            <label>Space / location</label>
            <select id="sch-space">
              <option value="">No space needed / Off campus</option>
              ${SPACES.map(s => `<option value="${s.name}" ${s.available?'':'disabled'}>${s.name} (cap. ${s.capacity})${s.available?'':' — unavailable'}</option>`).join('')}
            </select>
          </div>
          <div class="field"><label>Description (optional)</label><input type="text" id="sch-desc" placeholder="What's this for?"></div>
        </div>
        <div class="modal-footer">
          <button onclick="closeModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="submitSchedule()">Schedule event</button>
        </div>
      </div>
    </div>`;
  }

  /* Exposed globals */
  window.calSelectDay = function(ds) {
    selectedDay = ds;
    const panel = document.getElementById('cal-day-panel');
    if (panel) panel.innerHTML = renderDayPanel();
    document.querySelectorAll('.cal-cell').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.cal-cell').forEach(el => {
      if (el.querySelector('.cal-cell-num') && el.onclick) {
        const num = parseInt(el.querySelector('.cal-cell-num').textContent);
        const [y,m,d] = ds.split('-').map(Number);
        if (num === d) el.classList.add('selected');
      }
    });
    // Re-render day panel
    const newPanel = document.getElementById('cal-day-panel');
    if (newPanel) newPanel.innerHTML = renderDayPanel();
  };

  window.calSetView = function(v) {
    calView = v;
    document.querySelectorAll('.cal-view-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('cal-view-' + v).classList.add('active');
    document.getElementById('cal-main-grid').innerHTML = calView === 'month' ? renderMonthGrid() : renderWeekGrid();
  };

  window.calNav = function(dir) {
    if (calView === 'month') {
      calMonth += dir;
      if (calMonth < 0) { calMonth = 11; calYear--; }
      if (calMonth > 11) { calMonth = 0; calYear++; }
      document.getElementById('cal-month-label').textContent = MONTH_NAMES[calMonth] + ' ' + calYear;
      document.getElementById('cal-main-grid').innerHTML = renderMonthGrid();
    } else {
      const d = new Date(calWeekStart);
      d.setDate(d.getDate() + dir * 7);
      calWeekStart = d;
      const we = new Date(d); we.setDate(we.getDate() + 6);
      document.getElementById('cal-month-label').textContent = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()} – ${we.getDate()}, ${d.getFullYear()}`;
      document.getElementById('cal-main-grid').innerHTML = renderWeekGrid();
    }
  };

  window.showScheduleForm = function(prefillDate) {
    const modal = document.createElement('div');
    modal.id = 'cal-modal';
    modal.innerHTML = renderScheduleModal(prefillDate);
    document.body.appendChild(modal);
  };

  window.closeModal = function() {
    const m = document.getElementById('cal-modal');
    if (m) m.remove();
    const m2 = document.getElementById('booking-modal');
    if (m2) m2.remove();
  };

  window.submitSchedule = function() {
    const name = document.getElementById('sch-name').value.trim();
    if (!name) { alert('Please enter an event name.'); return; }
    const type = document.getElementById('sch-type').value;
    const date = document.getElementById('sch-date').value;
    const start = document.getElementById('sch-start').value;
    const end = document.getElementById('sch-end').value;
    const space = document.getElementById('sch-space').value;
    const colors = { study:'#533AB7', org:'#6b1a1a', social:'#854F0B', academic:'#0F6E56' };
    const bgs = { study:'#EEEDFE', org:'#FBE6E6', social:'#FAEEDA', academic:'#E1F5EE' };
    CALENDAR_EVENTS.push({ id:'u'+Date.now(), title:name, date, start, end, type, color:colors[type]||'#6b1a1a', bg:bgs[type]||'#FBE6E6', space:space||'TBD', mine:true });
    closeModal();
    switchTab('calendar');
  };

  window.renderCalendar = function() {
    selectedDay = '2026-06-08';
    return `<div class="page-animate">
      <div class="page-head">
        <h1>Campus calendar</h1>
        <p>All events, your RSVPs, and scheduled bookings in one view</p>
      </div>

      <div class="card" style="margin-bottom:1rem;">
        <div class="card-head">
          <div style="display:flex;align-items:center;gap:10px;">
            <button onclick="calNav(-1)" style="width:28px;height:28px;border-radius:7px;border:1px solid var(--border-md);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-2);">
              <i class="ti ti-chevron-left" style="font-size:14px;"></i>
            </button>
            <span id="cal-month-label" style="font-size:14px;font-weight:500;color:var(--text);min-width:160px;text-align:center;">June 2026</span>
            <button onclick="calNav(1)" style="width:28px;height:28px;border-radius:7px;border:1px solid var(--border-md);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-2);">
              <i class="ti ti-chevron-right" style="font-size:14px;"></i>
            </button>
          </div>
          <div style="display:flex;gap:4px;">
            <button id="cal-view-month" class="cal-view-btn active" onclick="calSetView('month')">Month</button>
            <button id="cal-view-week" class="cal-view-btn" onclick="calSetView('week')">Week</button>
            <button class="tbtn" style="margin-left:6px;" onclick="showScheduleForm()">
              <i class="ti ti-plus" style="font-size:13px;"></i> Add event
            </button>
          </div>
        </div>

        <div class="cal-detail-grid">
          <div style="border-right:1px solid var(--border);padding:12px;">
            <div id="cal-main-grid">${renderMonthGrid()}</div>
          </div>
          <div id="cal-day-panel" style="overflow-y:auto;">${renderDayPanel()}</div>
        </div>
      </div>

      <div class="g2">
        <div class="card">
          <div class="card-head"><div class="card-title"><i class="ti ti-calendar-check"></i>Your upcoming events</div></div>
          <div class="card-body">
            ${CALENDAR_EVENTS.filter(e => e.rsvp || e.mine).sort((a,b) => a.date.localeCompare(b.date)).map(e => `
              <div class="row">
                <div class="date-box" style="background:${e.bg};border:1px solid ${e.color}25;">
                  <span class="dmonth" style="color:${e.color};">${e.date.split('-')[1]==='06'?'JUN':'JUL'}</span>
                  <span class="dday" style="color:${e.color};">${parseInt(e.date.split('-')[2])}</span>
                </div>
                <div class="row-info">
                  <div class="row-name">${e.title}</div>
                  <div class="row-meta">${fmtTime(e.start)} · ${e.space}</div>
                </div>
                ${e.mine ? `<span class="pill" style="background:#EAF3DE;color:#173404;">Mine</span>` : `<span class="pill" style="background:${e.bg};color:${e.color};">RSVPd</span>`}
              </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><i class="ti ti-tag"></i>Legend</div></div>
          <div class="card-body">
            ${[
              {label:'Org / club event', color:'#6b1a1a', bg:'#FBE6E6'},
              {label:'Academic', color:'#0F6E56', bg:'#E1F5EE'},
              {label:'Service', color:'#993556', bg:'#FBEAF0'},
              {label:'Athletics', color:'#3B6D11', bg:'#EAF3DE'},
              {label:'Study group', color:'#533AB7', bg:'#EEEDFE'},
              {label:'Social', color:'#854F0B', bg:'#FAEEDA'},
            ].map(l => `
              <div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--border);">
                <div style="width:12px;height:12px;border-radius:3px;background:${l.color};flex-shrink:0;"></div>
                <span style="font-size:13px;color:var(--text);">${l.label}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  };
})();

/* ── Load events from Supabase into CALENDAR_EVENTS ──────── */
async function loadCalendarEventsFromDB() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  try {
    const { data, error } = await db
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    if (error) throw error;

    // Get user's RSVPs
    const { data: rsvps } = user.id
      ? await db.from('rsvps').select('event_id').eq('user_id', user.id)
      : { data: [] };
    const rsvpSet = new Set((rsvps || []).map(r => r.event_id));

    // Remove ALL existing events and replace with fresh Supabase data
    // (Static placeholder events from spaces-data.js are intentionally cleared)
    CALENDAR_EVENTS.length = 0;

    (data || []).forEach(e => {
      CALENDAR_EVENTS.push({
        id:    e.id,
        title: e.title,
        date:  e.event_date,
        start: e.start_time || '',
        end:   e.end_time || '',
        type:  e.type || 'general',
        color: e.color || '#6b1a1a',
        bg:    e.bg || '#FBE6E6',
        space: e.location || '',
        rsvp:  rsvpSet.has(e.id),
        points: e.points || 50,
        description: e.description || '',
      });
    });

    // Re-render calendar if on that tab
    const content = document.getElementById('app-content');
    if (content && typeof currentTab !== 'undefined' && currentTab === 'calendar') {
      content.innerHTML = typeof renderCalendar === 'function' ? renderCalendar() : '';
    }
    if (typeof currentTab !== 'undefined' && currentTab === 'calendar') {
      const content = document.getElementById('app-content');
      if (content && typeof renderCalendar === 'function') {
        content.innerHTML = renderCalendar();
      }
    }
  } catch(e) { console.warn('Calendar events load failed:', e); }
}
