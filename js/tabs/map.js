/* ============================================================
   STAC Engage v12 — Campus Map Tab (card-based site plan)
   Matches real STAC campus layout: West (academic) and East
   (athletics/residential) zones, separated by Route 340
   ============================================================ */

(function() {
  let selectedSpace = null;
  let selectedBuilding = null;
  let activeZone = 'west';

  const TAG_LABELS = {
    R: { label:'Rentable', bg:'#FAEEDA', color:'#854F0B' },
    O: { label:'Outdoor',  bg:'#EAF3DE', color:'#3B6D11' },
  };

  function buildingCard(b) {
    const isSelected = selectedBuilding === b.name;
    const spacesHere = SPACES.filter(s => s.building === b.name);
    const hasSpaces  = spacesHere.length > 0;

    if (b.oval) {
      return `<div onclick="selectBuilding('${b.name.replace(/'/g,"\\'")}')"
        style="position:absolute;left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;
        border-radius:50%;background:${b.color}30;border:6px solid ${b.color}55;
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        ${isSelected?'outline:2px solid #c8b560;outline-offset:2px;':''}">
        <div style="text-align:center;">
          <div style="font-size:13px;font-weight:600;color:${b.color};">${b.label}</div>
          ${b.construction ? `<span style="font-size:10px;background:#FAEEDA;color:#854F0B;padding:2px 8px;border-radius:999px;display:inline-flex;align-items:center;gap:3px;margin-top:4px;"><i class="ti ti-cone" style="font-size:10px;"></i> Under construction</span>` : ''}
        </div>
      </div>`;
    }

    if (b.field) {
      return `<div onclick="selectBuilding('${b.name.replace(/'/g,"\\'")}')"
        style="position:absolute;left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;
        border-radius:10px;background:${b.color};cursor:pointer;
        display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;
        ${isSelected?'outline:2px solid #c8b560;outline-offset:2px;':''}">
        <div style="position:absolute;top:8px;left:50%;width:1px;height:calc(100% - 16px);background:#fff;opacity:0.5;"></div>
        <div style="position:absolute;top:50%;left:50%;width:60px;height:60px;border:1px solid #fff;border-radius:50%;opacity:0.5;transform:translate(-50%,-50%);"></div>
        <div style="font-size:13px;font-weight:600;color:#fff;">${b.label}</div>
      </div>`;
    }

    if (b.outdoor) {
      return `<div onclick="selectBuilding('${b.name.replace(/'/g,"\\'")}')"
        style="position:absolute;left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;
        border:2px dashed ${b.color}80;border-radius:10px;background:${b.color}12;cursor:pointer;
        padding:8px;display:flex;flex-direction:column;
        ${isSelected?'outline:2px solid #c8b560;outline-offset:2px;':''}">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:12px;font-weight:600;color:${b.color};">${b.label}</span>
          ${b.tag ? `<span style="font-size:9px;background:${TAG_LABELS[b.tag].bg};color:${TAG_LABELS[b.tag].color};padding:1px 6px;border-radius:999px;font-weight:600;">${TAG_LABELS[b.tag].label}</span>` : ''}
        </div>
        <span style="font-size:10px;color:#8a8a80;margin-top:2px;">${b.sub}</span>
      </div>`;
    }

    // Standard building card
    return `<div onclick="selectBuilding('${b.name.replace(/'/g,"\\'")}')"
      style="position:absolute;left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;
      border-radius:8px;background:var(--surface);border:1px solid var(--border);
      cursor:pointer;overflow:hidden;box-shadow:var(--shadow);
      ${isSelected?'outline:2px solid #c8b560;outline-offset:1px;':''}
      transition:box-shadow .15s;">
      <div style="background:${b.color};color:#fff;padding:6px 9px;display:flex;align-items:center;justify-content:space-between;gap:6px;">
        <span style="font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.label}</span>
        ${b.tag ? `<span style="width:16px;height:16px;border-radius:50%;background:${TAG_LABELS[b.tag]?TAG_LABELS[b.tag].color:'#fff'};color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid #fff;">${b.tag}</span>` : ''}
      </div>
      <div style="padding:6px 9px;font-size:10px;color:#8a8a80;line-height:1.4;">${b.sub}</div>
      ${hasSpaces ? `<div style="padding:0 9px 6px;font-size:9px;color:#6b1a1a;font-weight:500;">${spacesHere.length} bookable space${spacesHere.length>1?'s':''}</div>` : ''}
    </div>`;
  }

  function zoneCanvas(zone) {
    const buildings = BUILDINGS.filter(b => b.zone === zone);
    return `<div style="position:relative;width:100%;height:480px;background:#EAF3DE;border-radius:var(--radius-lg);overflow:hidden;padding:20px;">
      ${buildings.map(b => buildingCard(b)).join('')}
    </div>`;
  }

  function spacePanelHTML() {
    if (!selectedSpace && !selectedBuilding) {
      return `<div style="padding:1.25rem;text-align:center;">
        <i class="ti ti-map-pin" style="font-size:32px;color:#d0cfc8;display:block;margin-bottom:8px;"></i>
        <div style="font-size:13px;color:#8a8a80;">Click a building to see<br>bookable spaces and details</div>
      </div>`;
    }

    if (selectedBuilding && !selectedSpace) {
      const b = BUILDINGS.find(x => x.name === selectedBuilding);
      const spacesHere = SPACES.filter(s => s.building === selectedBuilding);
      return `<div style="padding:1rem;">
        <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:2px;">${b.label}</div>
        <div style="font-size:12px;color:#8a8a80;margin-bottom:12px;">${b.sub}</div>
        ${b.tag && TAG_LABELS[b.tag] ? `<span class="pill" style="background:${TAG_LABELS[b.tag].bg};color:${TAG_LABELS[b.tag].color};margin-bottom:12px;display:inline-flex;">${TAG_LABELS[b.tag].label}</span>` : ''}
        ${spacesHere.length === 0
          ? `<div style="font-size:12px;color:#8a8a80;margin-top:8px;">No bookable spaces in this building yet.</div>`
          : `<div style="margin-top:8px;">
              <div style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:#8a8a80;margin-bottom:6px;">Bookable spaces</div>
              ${spacesHere.map(s => `
                <div onclick="selectSpace('${s.id}')" style="display:flex;align-items:center;gap:9px;padding:8px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:6px;cursor:pointer;">
                  <div style="width:30px;height:30px;border-radius:6px;background:${s.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i class="ti ${s.icon}" style="color:${s.color};font-size:14px;"></i>
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.name.split(' — ')[1] || s.name}</div>
                    <div style="font-size:10px;color:#8a8a80;">Cap. ${s.capacity} · ${s.type}</div>
                  </div>
                  <div style="width:7px;height:7px;border-radius:50%;background:${s.available?'#3B6D11':'#8a8a80'};flex-shrink:0;"></div>
                </div>`).join('')}
            </div>`}
      </div>`;
    }

    const s = SPACES.find(sp => sp.id === selectedSpace);
    if (!s) return '';
    return `
      <div style="padding:1rem;">
        <div onclick="backToBuilding()" style="font-size:11px;color:#6b1a1a;cursor:pointer;margin-bottom:8px;display:flex;align-items:center;gap:4px;">
          <i class="ti ti-arrow-left" style="font-size:11px;"></i> Back to ${s.building}
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
          <div style="width:40px;height:40px;border-radius:8px;background:${s.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="ti ${s.icon}" style="color:${s.color};font-size:18px;"></i>
          </div>
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text);line-height:1.4;">${s.name}</div>
            <div style="font-size:11px;color:#8a8a80;margin-top:2px;">${s.building}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
          <span class="pill" style="background:${s.bg};color:${s.color};">${s.type}</span>
          <span class="pill" style="background:${s.available?'#EAF3DE':'#F1EFE8'};color:${s.available?'#173404':'#5F5E5A'};">
            <i class="ti ${s.available?'ti-check':'ti-x'}" style="font-size:10px;"></i>
            ${s.available?'Available':'Unavailable'}
          </span>
          <span class="pill" style="background:#FBE6E6;color:#6b1a1a;">
            <i class="ti ti-users" style="font-size:10px;"></i> ${s.capacity}
          </span>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;color:#8a8a80;margin-bottom:6px;">Features</div>
          ${s.features.map(f => `<div style="font-size:12px;color:var(--text-2);padding:3px 0;display:flex;align-items:center;gap:6px;"><i class="ti ti-check" style="font-size:11px;color:${s.color};"></i>${f}</div>`).join('')}
        </div>
        ${s.rate > 0 ? `<div style="font-size:12px;color:#8a8a80;margin-bottom:10px;"><i class="ti ti-coin" style="font-size:12px;"></i> $${s.rate}/hr (external events)</div>` : ''}
        <button class="btn-primary" style="${s.available?'':'opacity:0.4;pointer-events:none;'}" onclick="showBookingModal('${s.id}')">
          ${s.available ? '<i class="ti ti-calendar-plus"></i> Book this space' : 'Currently unavailable'}
        </button>
      </div>`;
  }

  function bookingModalHTML(spaceId) {
    const s = SPACES.find(sp => sp.id === spaceId);
    return `
      <div class="modal-backdrop" onclick="closeModal()">
        <div class="modal-box" onclick="event.stopPropagation()">
          <div class="modal-head">
            <div style="font-size:16px;font-weight:500;color:var(--text);">Book ${s.name}</div>
            <button onclick="closeModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;line-height:1;">&times;</button>
          </div>
          <div class="modal-body">
            <div style="display:flex;gap:8px;margin-bottom:1rem;padding:10px;background:var(--surface-2);border-radius:8px;">
              <i class="ti ti-info-circle" style="color:${s.color};font-size:16px;flex-shrink:0;margin-top:1px;"></i>
              <div style="font-size:12px;color:var(--text-2);">Capacity: ${s.capacity} people. ${s.rate>0?'Rate: $'+s.rate+'/hr for external events.':'Free for student use.'}</div>
            </div>
            <div class="field"><label>Event / purpose</label><input type="text" id="bk-name" placeholder="e.g. Business Club meeting, Study group..."></div>
            <div class="field-row-2">
              <div class="field"><label>Date</label><input type="date" id="bk-date" value="2026-06-"></div>
              <div class="field"><label>Expected attendees</label><input type="number" id="bk-count" min="1" max="${s.capacity}" placeholder="How many?"></div>
            </div>
            <div class="field-row-2">
              <div class="field"><label>Start time</label><input type="time" id="bk-start" value="14:00"></div>
              <div class="field"><label>End time</label><input type="time" id="bk-end" value="15:30"></div>
            </div>
            <div class="field"><label>Additional notes</label><input type="text" id="bk-notes" placeholder="AV needs, setup requests, etc."></div>
          </div>
          <div class="modal-footer">
            <button onclick="closeModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
            <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="submitBooking('${s.id}')">Submit request</button>
          </div>
        </div>
      </div>`;
  }

  window.selectBuilding = function(name) {
    selectedBuilding = selectedBuilding === name ? null : name;
    selectedSpace = null;
    refreshMap();
  };

  window.selectSpace = function(id) {
    selectedSpace = id;
    refreshMap();
  };

  window.backToBuilding = function() {
    selectedSpace = null;
    refreshMap();
  };

  window.setMapZone = function(zone) {
    activeZone = zone;
    selectedBuilding = null;
    selectedSpace = null;
    document.querySelectorAll('.cal-view-btn[data-zone]').forEach(b => b.classList.toggle('active', b.dataset.zone === zone));
    const canvas = document.getElementById('map-canvas');
    if (canvas) canvas.innerHTML = zoneCanvas(activeZone);
    refreshPanel();
  };

  window.showBookingModal = function(spaceId) {
    const modal = document.createElement('div');
    modal.id = 'booking-modal';
    modal.innerHTML = bookingModalHTML(spaceId);
    document.body.appendChild(modal);
  };

  window.submitBooking = function(spaceId) {
    const name = document.getElementById('bk-name').value.trim();
    if (!name) { alert('Please enter a purpose for the booking.'); return; }
    closeModal();
    showToast('Booking request submitted!');
  };

  function refreshPanel() {
    const spacePanel = document.getElementById('space-detail-panel');
    if (spacePanel) spacePanel.innerHTML = spacePanelHTML();
  }

  function refreshMap() {
    const canvas = document.getElementById('map-canvas');
    if (canvas) canvas.innerHTML = zoneCanvas(activeZone);
    refreshPanel();
    const listEl = document.getElementById('all-spaces-list');
    if (listEl) listEl.innerHTML = allSpacesListHTML();
  }

  function allSpacesListHTML() {
    return BUILDINGS.filter(b => SPACES.some(s => s.building === b.name)).map(b => {
      const spacesHere = SPACES.filter(s => s.building === b.name);
      return `<div>
        <div style="font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:0.06em;color:#8a8a80;padding:10px 1rem 5px;background:var(--surface-2);">${b.label} <span style="text-transform:none;font-weight:400;">· ${b.zone === 'west' ? 'West of Rt. 340' : 'East of Rt. 340'}</span></div>
        ${spacesHere.map(s => `
          <div style="display:flex;align-items:center;gap:9px;padding:9px 1rem;border-bottom:1px solid var(--border);cursor:pointer;${selectedSpace===s.id?'background:var(--surface-2);':''}" onclick="setMapZone('${b.zone}');selectSpace(${s.id})">
            <div style="width:30px;height:30px;border-radius:6px;background:${s.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="ti ${s.icon}" style="color:${s.color};font-size:14px;"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:12px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.name.split(' — ')[1] || s.name}</div>
              <div style="font-size:10px;color:#8a8a80;">Cap. ${s.capacity} · ${s.type}</div>
            </div>
            <div style="width:7px;height:7px;border-radius:50%;background:${s.available?'#3B6D11':'#8a8a80'};flex-shrink:0;"></div>
          </div>`).join('')}
      </div>`;
    }).join('');
  }

  window.renderMap = function() {
    const avail = SPACES.filter(s => s.available).length;
    return `<div class="page-animate">
      <div class="page-head">
        <h1>Campus map</h1>
        <p>${avail} of ${SPACES.length} spaces available · STAC campus is divided by Route 340</p>
      </div>

      <div style="display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:1rem;margin-bottom:1rem;">
        <div class="card" style="overflow:hidden;">
          <div class="card-head">
            <div class="card-title"><i class="ti ti-map"></i>${activeZone === 'west' ? 'West of Route 340 — Main campus' : 'East of Route 340 — Athletics & residential'}</div>
            <div style="display:flex;gap:4px;">
              <button class="cal-view-btn ${activeZone==='west'?'active':''}" data-zone="west" onclick="setMapZone('west')">West campus</button>
              <button class="cal-view-btn ${activeZone==='east'?'active':''}" data-zone="east" onclick="setMapZone('east')">East campus</button>
            </div>
          </div>
          <div style="padding:12px;" id="map-canvas">${zoneCanvas(activeZone)}</div>
          <div style="display:flex;align-items:center;gap:14px;padding:10px 16px;border-top:1px solid var(--border);flex-wrap:wrap;">
            <span style="font-size:11px;color:#8a8a80;font-weight:500;">Legend:</span>
            <span style="display:flex;align-items:center;gap:4px;font-size:11px;color:#854F0B;"><span style="width:14px;height:14px;border-radius:50%;background:#854F0B;color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;">R</span>Rentable</span>
            <span style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3B6D11;"><span style="width:14px;height:14px;border-radius:50%;background:#3B6D11;color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;">O</span>Outdoor</span>
            <span style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3B6D11;"><div style="width:8px;height:8px;border-radius:50%;background:#3B6D11;"></div>Space available</span>
            <span style="display:flex;align-items:center;gap:4px;font-size:11px;color:#8a8a80;"><div style="width:8px;height:8px;border-radius:50%;background:#8a8a80;"></div>Unavailable</span>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><div class="card-title"><i class="ti ti-info-circle"></i>Details</div></div>
          <div id="space-detail-panel">${spacePanelHTML()}</div>
        </div>
      </div>

      <div class="g2">
        <div class="card">
          <div class="card-head">
            <div class="card-title"><i class="ti ti-building"></i>All bookable spaces</div>
            <span class="pill" style="background:#EAF3DE;color:#173404;">${avail} available</span>
          </div>
          <div style="max-height:380px;overflow-y:auto;" id="all-spaces-list">
            ${allSpacesListHTML()}
          </div>
        </div>

        <div class="card">
          <div class="card-head"><div class="card-title"><i class="ti ti-calendar-time"></i>Upcoming bookings</div></div>
          <div class="card-body">
            ${CALENDAR_EVENTS.slice(0,5).map(e => `
              <div class="row">
                <div class="row-icon" style="background:${e.bg};"><i class="ti ti-map-pin" style="color:${e.color};"></i></div>
                <div class="row-info">
                  <div class="row-name">${e.title}</div>
                  <div class="row-meta">${e.space} · Jun ${parseInt(e.date.split('-')[2])}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  };
})();
