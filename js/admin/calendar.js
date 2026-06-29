/* ============================================================
   STAC Engage — Admin: Calendar
   Same view as student calendar but admin-only (no schedule form,
   shows all events, clicking a day shows event details)
   ============================================================ */

(function() {
  let adminCalView    = 'month';
  let adminCalYear    = 2026;
  let adminCalMonth   = 5; // 0-indexed June
  let adminCalWeekStart = new Date(2026, 5, 8);
  let adminSelectedDay  = null;

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function eventsForDate(dateStr) {
    return CALENDAR_EVENTS.filter(e => e.date === dateStr);
  }

  function fmtTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'pm' : 'am';
    return (h % 12 || 12) + (m ? ':' + String(m).padStart(2,'0') : '') + ampm;
  }

  function dateStr(y, m, d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  function renderAdminMonthGrid() {
    const firstDay    = new Date(adminCalYear, adminCalMonth, 1).getDay();
    const daysInMonth = new Date(adminCalYear, adminCalMonth + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];
    let html = '';
    html += `<div class="cal-day-headers">${DAY_NAMES.map(d => `<div class="cal-dh">${d}</div>`).join('')}</div>`;
    html += `<div class="cal-grid">`;
    for (let i = 0; i < firstDay; i++) html += `<div class="cal-cell empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const ds   = dateStr(adminCalYear, adminCalMonth, d);
      const evts = eventsForDate(ds);
      const isToday = ds === today;
      const isSel   = adminSelectedDay === ds;
      html += `<div class="cal-cell ${isToday?'today':''} ${isSel?'selected':''} ${evts.length?'has-events':''}" onclick="adminCalSelectDay('${ds}')">
        <div class="cal-cell-num">${d}</div>
        <div class="cal-cell-dots">
          ${evts.slice(0,3).map(e => `<div class="cal-dot" style="background:${e.color};"></div>`).join('')}
        </div>
      </div>`;
    }
    html += `</div>`;
    return html;
  }

  function renderAdminWeekGrid() {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(adminCalWeekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    const hours = Array.from({length: 13}, (_, i) => i + 8);
    const today = new Date().toISOString().split('T')[0];
    let html = `<div class="week-grid">
      <div class="week-time-col">
        <div class="week-header-cell"></div>
        ${hours.map(h => `<div class="week-hour-label">${h > 12 ? h-12 : h}${h >= 12 ? 'pm':'am'}</div>`).join('')}
      </div>`;
    days.forEach(day => {
      const ds = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
      const isToday = ds === today;
      const evts = eventsForDate(ds);
      html += `<div class="week-day-col ${isToday?'today':''}">
        <div class="week-header-cell ${isToday?'today':''}">
          <div class="week-hd">${DAY_NAMES[day.getDay()]}</div>
          <div class="week-hn ${isToday?'today':''}">${day.getDate()}</div>
        </div>
        <div class="week-day-body">
          ${hours.map(() => `<div class="week-slot"></div>`).join('')}
          ${evts.map(e => {
            if (!e.start) return '';
            const [sh, sm] = e.start.split(':').map(Number);
            const [eh, em] = (e.end || '23:59').split(':').map(Number);
            const top    = ((sh - 8) + sm/60) * 52;
            const height = Math.max(((eh - sh) + (em - sm)/60) * 52 - 3, 24);
            return `<div style="top:${top}px;height:${height}px;background:${e.bg};border-left:3px solid ${e.color};border-radius:6px;padding:4px 6px;position:absolute;left:2px;right:2px;overflow:hidden;cursor:pointer;" title="${e.title}">
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

  function renderAdminDayPanel() {
    if (!adminSelectedDay) return `<div style="padding:1rem;text-align:center;color:#8a8a80;font-size:13px;">Select a day to see events</div>`;
    const evts = eventsForDate(adminSelectedDay);
    const [y, m, d] = adminSelectedDay.split('-').map(Number);
    const label = `${MONTH_NAMES[m-1]} ${d}, ${y}`;
    if (!evts.length) return `<div style="padding:1rem;">
      <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:4px;">${label}</div>
      <div style="font-size:12px;color:#8a8a80;">No events scheduled</div>
      <button class="btn-primary" style="width:100%;margin-top:10px;padding:8px;" onclick="adminSwitchTab('events')">
        <i class="ti ti-plus"></i> Create event
      </button>
    </div>`;
    return `<div style="padding:1rem 0;">
      <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:10px;padding:0 1rem;">${label}</div>
      ${evts.map(e => `
        <div style="display:flex;gap:10px;padding:8px 1rem;border-bottom:1px solid var(--border);">
          <div style="width:3px;background:${e.color};border-radius:2px;flex-shrink:0;"></div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:500;color:var(--text);">${e.title}</div>
            ${e.start ? `<div style="font-size:11px;color:#8a8a80;margin-top:2px;">${fmtTime(e.start)}${e.end ? ' – ' + fmtTime(e.end) : ''}</div>` : ''}
            ${e.space ? `<div style="font-size:11px;color:#8a8a80;"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${e.space}</div>` : ''}
            <div style="font-size:11px;color:#8a8a80;">+${e.points || 50} pts</div>
          </div>
          <span class="status-badge status-active" style="align-self:flex-start;">${e.type || 'event'}</span>
        </div>`).join('')}
      <div style="padding:10px 1rem 0;">
        <button class="btn-primary" style="width:100%;padding:8px;justify-content:center;display:flex;gap:6px;align-items:center;" onclick="adminSwitchTab('events')">
          <i class="ti ti-plus" style="font-size:13px;"></i> Create event
        </button>
      </div>
    </div>`;
  }

  /* Exposed globals */
  window.adminCalSelectDay = function(ds) {
    adminSelectedDay = ds;
    document.querySelectorAll('#admin-content .cal-cell').forEach(el => el.classList.remove('selected'));
    event?.target?.closest('.cal-cell')?.classList.add('selected');
    const panel = document.getElementById('admin-cal-day-panel');
    if (panel) panel.innerHTML = renderAdminDayPanel();
  };

  window.adminCalSetView = function(v) {
    adminCalView = v;
    document.querySelectorAll('.admin-cal-view-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('admin-cal-view-' + v);
    if (btn) btn.classList.add('active');
    const grid = document.getElementById('admin-cal-main-grid');
    if (grid) grid.innerHTML = adminCalView === 'month' ? renderAdminMonthGrid() : renderAdminWeekGrid();
  };

  window.adminCalNav = function(dir) {
    if (adminCalView === 'month') {
      adminCalMonth += dir;
      if (adminCalMonth < 0)  { adminCalMonth = 11; adminCalYear--; }
      if (adminCalMonth > 11) { adminCalMonth = 0;  adminCalYear++; }
      const lbl = document.getElementById('admin-cal-month-label');
      if (lbl) lbl.textContent = MONTH_NAMES[adminCalMonth] + ' ' + adminCalYear;
      const grid = document.getElementById('admin-cal-main-grid');
      if (grid) grid.innerHTML = renderAdminMonthGrid();
    } else {
      const d = new Date(adminCalWeekStart);
      d.setDate(d.getDate() + dir * 7);
      adminCalWeekStart = d;
      const we = new Date(d); we.setDate(we.getDate() + 6);
      const lbl = document.getElementById('admin-cal-month-label');
      if (lbl) lbl.textContent = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()} – ${we.getDate()}, ${d.getFullYear()}`;
      const grid = document.getElementById('admin-cal-main-grid');
      if (grid) grid.innerHTML = renderAdminWeekGrid();
    }
  };

  window.renderAdminCalendar = function() {
    return `<div class="page-animate">
      <div class="page-head">
        <h1>Campus calendar</h1>
        <p>All scheduled events across campus</p>
      </div>

      <div class="card" style="margin-bottom:1rem;">
        <div class="card-head">
          <div style="display:flex;align-items:center;gap:10px;">
            <button onclick="adminCalNav(-1)" style="width:28px;height:28px;border-radius:7px;border:1px solid var(--border-md);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-2);">
              <i class="ti ti-chevron-left" style="font-size:14px;"></i>
            </button>
            <span id="admin-cal-month-label" style="font-size:14px;font-weight:500;color:var(--text);min-width:160px;text-align:center;">${MONTH_NAMES[adminCalMonth]} ${adminCalYear}</span>
            <button onclick="adminCalNav(1)" style="width:28px;height:28px;border-radius:7px;border:1px solid var(--border-md);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-2);">
              <i class="ti ti-chevron-right" style="font-size:14px;"></i>
            </button>
          </div>
          <div style="display:flex;gap:4px;">
            <button id="admin-cal-view-month" class="admin-cal-view-btn cal-view-btn active" onclick="adminCalSetView('month')">Month</button>
            <button id="admin-cal-view-week" class="admin-cal-view-btn cal-view-btn" onclick="adminCalSetView('week')">Week</button>
            <button class="btn-primary" style="width:auto;padding:7px 16px;margin-left:6px;" onclick="adminSwitchTab('events')">
              <i class="ti ti-plus" style="font-size:13px;"></i> Create event
            </button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 220px;min-height:420px;">
          <div style="border-right:1px solid var(--border);padding:12px;">
            <div id="admin-cal-main-grid">${renderAdminMonthGrid()}</div>
          </div>
          <div id="admin-cal-day-panel" style="overflow-y:auto;">${renderAdminDayPanel()}</div>
        </div>
      </div>

      <div class="g2">
        <div class="card">
          <div class="card-head"><div class="card-title"><i class="ti ti-calendar-check"></i>Upcoming events</div></div>
          <div class="card-body">
            ${CALENDAR_EVENTS.length === 0
              ? `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No events yet — create one in Event Management</div>`
              : CALENDAR_EVENTS.sort((a,b) => a.date.localeCompare(b.date)).slice(0,10).map(e => {
                  const [,mm,dd] = e.date.split('-');
                  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  return `<div class="row">
                    <div class="date-box" style="background:${e.bg};border:1px solid ${e.color}25;">
                      <span class="dmonth" style="color:${e.color};">${months[parseInt(mm)-1]}</span>
                      <span class="dday" style="color:${e.color};">${parseInt(dd)}</span>
                    </div>
                    <div class="row-info">
                      <div class="row-name">${e.title}</div>
                      <div class="row-meta">${e.start ? fmtTime(e.start) : ''} ${e.space ? '· ' + e.space : ''}</div>
                    </div>
                    <span class="status-badge status-active">${e.type || 'event'}</span>
                  </div>`;
                }).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><i class="ti ti-tag"></i>Legend</div></div>
          <div class="card-body">
            ${[
              {label:'Org / club event', color:'#6b1a1a', bg:'#FBE6E6'},
              {label:'Academic',         color:'#0F6E56', bg:'#E1F5EE'},
              {label:'Service',          color:'#993556', bg:'#FBEAF0'},
              {label:'Athletics',        color:'#3B6D11', bg:'#EAF3DE'},
              {label:'Study group',      color:'#533AB7', bg:'#EEEDFE'},
              {label:'Social',           color:'#854F0B', bg:'#FAEEDA'},
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

  /* Load Supabase events into CALENDAR_EVENTS then re-render */
  window.loadAdminCalendarFromDB = async function() {
    try {
      const { data, error } = await db
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (error) throw error;

      const staticIds = new Set(['ce1','ce2','ce3','ce4','ce5','ce6','ce7','ce8','ce9']);
      for (let i = CALENDAR_EVENTS.length - 1; i >= 0; i--) {
        if (!staticIds.has(CALENDAR_EVENTS[i].id)) CALENDAR_EVENTS.splice(i, 1);
      }
      (data || []).forEach(e => {
        if (!CALENDAR_EVENTS.find(c => c.id === e.id)) {
          CALENDAR_EVENTS.push({
            id: e.id, title: e.title, date: e.event_date,
            start: e.start_time || '', end: e.end_time || '',
            type: e.type || 'general', color: e.color || '#6b1a1a',
            bg: e.bg || '#FBE6E6', space: e.location || '',
            points: e.points || 50,
          });
        }
      });

      const content = document.getElementById('admin-content');
      const active  = document.querySelector('.nav-item.active');
      if (content && active && active.id === 'anav-calendar') {
        content.innerHTML = renderAdminCalendar();
      }
    } catch(e) { console.warn('Admin calendar load failed:', e); }
  };
})();
