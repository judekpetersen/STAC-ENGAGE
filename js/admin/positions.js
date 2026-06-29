/* ============================================================
   STAC Engage v14 — Admin: Positions
   Assign/remove officer roles to students
   Supabase: `student_positions` table (user_id, position, org_id)
   ============================================================ */

function renderAdminPositions() {
  // Build a flat list of all current position holders
  const allPositions = [];
  Object.entries(STUDENT_POSITIONS).forEach(([studentId, positions]) => {
    const s = ADMIN_STUDENTS.find(x => x.id === parseInt(studentId));
    if (!s) return;
    positions.forEach(p => allPositions.push({ student: s, ...p }));
  });

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Officer positions</h1>
      <p>Assign and manage club officer roles for students</p>
    </div>

    <!-- New organization button -->
    <div style="display:flex;justify-content:flex-end;margin-bottom:1rem;">
      <button class="btn-primary" style="width:auto;padding:9px 20px;" onclick="openNewOrgModal()">
        <i class="ti ti-plus"></i> New organization
      </button>
    </div>

    <!-- Assign new position -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-crown"></i>Assign a position</div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;align-items:end;">
          <div class="field" style="margin-bottom:0;">
            <label>Student</label>
            <select id="pos-student">
              ${ADMIN_STUDENTS.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>Position</label>
            <select id="pos-position">
              ${OFFICER_POSITIONS.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="margin-bottom:0;">
            <label>Organization</label>
            <select id="pos-org">
              ${DATA.orgs.map(o => `<option value="${o.name}">${o.name}</option>`).join('')}
            </select>
          </div>
          <button class="btn-approve" style="height:42px;padding:0 18px;border-radius:8px;" onclick="assignPosition()">
            Assign
          </button>
        </div>
        <div style="font-size:11px;color:#8a8a80;margin-top:8px;">
          <i class="ti ti-info-circle" style="font-size:11px;"></i>
          Assigned positions appear on the student's profile and grant them officer-only event request access.
        </div>
      </div>
    </div>

    <!-- Current position holders -->
    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-list"></i>Current officers</div>
        <span class="pill" style="background:#FBE6E6;color:#6b1a1a;">${allPositions.length} positions assigned</span>
      </div>
      <div class="card-body" style="padding:0;" id="positions-list">
        ${positionsListHTML(allPositions)}
      </div>
    </div>

    <!-- All orgs overview -->
    <div class="card" style="margin-top:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-users"></i>Officer roster by organization</div></div>
      <div class="card-body">
        ${DATA.orgs.map(o => {
          const officers = allPositions.filter(p => p.org === o.name);
          return `<div class="pathway-item">
            <div class="pathway-top">
              <span class="pathway-name" style="display:flex;align-items:center;gap:8px;">
                <div style="width:26px;height:26px;border-radius:6px;background:${o.bg};display:flex;align-items:center;justify-content:center;">
                  <i class="ti ${o.icon}" style="color:${o.ic};font-size:13px;"></i>
                </div>
                ${o.name}
              </span>
              <span style="font-size:12px;color:#8a8a80;">${officers.length} officer${officers.length!==1?'s':''}</span>
            </div>
            ${officers.length > 0
              ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                  ${officers.map(p => {
                    const pc = POSITION_COLORS[p.position] || { bg:'#FBE6E6', color:'#6b1a1a', icon:'ti-star' };
                    return `<span class="pill" style="background:${pc.bg};color:${pc.color};">
                      <i class="ti ${pc.icon}" style="font-size:10px;"></i>
                      ${p.position}: ${p.student.name}
                    </span>`;
                  }).join('')}
                </div>`
              : `<div style="font-size:11px;color:#8a8a80;margin-top:4px;">No officers assigned yet</div>`}
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

function positionsListHTML(allPositions) {
  if (allPositions.length === 0) {
    return `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">No positions assigned yet</div>`;
  }
  return allPositions.map(p => {
    const pc = POSITION_COLORS[p.position] || { bg:'#FBE6E6', color:'#6b1a1a', icon:'ti-star' };
    return `<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid var(--border);">
      <div class="stu-av" style="background:${p.student.bg};color:${p.student.fc};">${p.student.ini}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:500;color:var(--text);">${p.student.name}</div>
        <div style="font-size:11px;color:#8a8a80;">${p.student.major} · Class of ${p.student.year}</div>
      </div>
      <span class="pill" style="background:${pc.bg};color:${pc.color};padding:5px 12px;">
        <i class="ti ${pc.icon}" style="font-size:11px;"></i>
        ${p.position}
      </span>
      <span style="font-size:12px;color:#8a8a80;min-width:120px;">${p.org}</span>
      <button class="btn-deny" style="font-size:11px;padding:4px 10px;" onclick="removePosition(${p.student.id}, '${p.position}', '${p.org.replace(/'/g,"\\'")}')">
        Remove
      </button>
    </div>`;
  }).join('');
}

async function assignPosition() {
  const studentId = document.getElementById('pos-student').value;
  const position  = document.getElementById('pos-position').value;
  const org       = document.getElementById('pos-org').value;
  if (!studentId) { showToast('Please select a student.'); return; }

  if (!STUDENT_POSITIONS[studentId]) STUDENT_POSITIONS[studentId] = [];
  const exists = STUDENT_POSITIONS[studentId].some(p => p.position === position && p.org === org);
  if (exists) { showToast('This position is already assigned to that student.'); return; }

  try {
    await db.from('student_positions').insert({ user_id: studentId, position, org });
    await db.from('notifications').insert({
      user_id: studentId, type: 'badge', read: false,
      text: `You've been assigned as ${position} of ${org}!`
    });
  } catch(e) { console.warn('Assign position failed:', e); }

  STUDENT_POSITIONS[studentId].push({ position, org });
  showToast(`${position} of ${org} assigned to ${ADMIN_STUDENTS.find(s=>s.id===studentId)?.name}.`);
  refreshPositionsList();
  updatePositionsBadge();
}

async function removePosition(studentId, position, org) {
  try {
    await db.from('student_positions').delete()
      .eq('user_id', studentId).eq('position', position).eq('org', org);
  } catch(e) { console.warn('Remove position failed:', e); }

  if (!STUDENT_POSITIONS[studentId]) return;
  STUDENT_POSITIONS[studentId] = STUDENT_POSITIONS[studentId].filter(
    p => !(p.position === position && p.org === org)
  );
  if (STUDENT_POSITIONS[studentId].length === 0) delete STUDENT_POSITIONS[studentId];
  showToast('Position removed.');
  refreshPositionsList();
  updatePositionsBadge();
}

function refreshPositionsList() {
  const allPositions = [];
  Object.entries(STUDENT_POSITIONS).forEach(([studentId, positions]) => {
    const s = ADMIN_STUDENTS.find(x => x.id === parseInt(studentId));
    if (!s) return;
    positions.forEach(p => allPositions.push({ student: s, ...p }));
  });
  const list = document.getElementById('positions-list');
  if (list) list.innerHTML = positionsListHTML(allPositions);
  // Re-render full page to update org roster too
  const content = document.getElementById('admin-content');
  if (content) content.innerHTML = renderAdminPositions();
}

function updatePositionsBadge() {
  const total = Object.values(STUDENT_POSITIONS).reduce((sum, arr) => sum + arr.length, 0);
  const badge = document.querySelector('#anav-positions .nav-badge');
  if (badge) badge.textContent = total;
}

/* ── New organization ─────────────────────────────────── */
function openNewOrgModal() {
  const modal = document.createElement('div');
  modal.id = 'new-org-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeNewOrgModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:480px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Create new organization</div>
          <button onclick="closeNewOrgModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Organization name</label>
            <input type="text" id="no-name" placeholder="e.g. Astronomy Club">
          </div>
          <div class="field">
            <label>Description</label>
            <input type="text" id="no-desc" placeholder="Brief description of the organization">
          </div>
          <div class="field-row-2">
            <div class="field">
              <label>Category</label>
              <select id="no-cat">
                <option value="academic">Academic</option>
                <option value="service">Service</option>
                <option value="social">Social</option>
                <option value="cultural">Cultural</option>
                <option value="faith">Faith</option>
                <option value="arts">Arts & Media</option>
                <option value="sport">Club Sport</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="field">
              <label>Icon</label>
              <select id="no-icon">
                <option value="ti-users">👥 General</option>
                <option value="ti-book">📚 Academic</option>
                <option value="ti-heart">❤️ Service</option>
                <option value="ti-building-church">✝️ Faith</option>
                <option value="ti-palette">🎨 Arts</option>
                <option value="ti-music">🎵 Music</option>
                <option value="ti-run">🏃 Sport</option>
                <option value="ti-globe">🌍 Cultural</option>
                <option value="ti-briefcase">💼 Business</option>
                <option value="ti-flask">🔬 Science</option>
                <option value="ti-device-tv">📺 Media</option>
                <option value="ti-star">⭐ Other</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="closeNewOrgModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="createNewOrg()">
            <i class="ti ti-plus"></i> Create organization
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('no-name')?.focus(), 100);
}

function closeNewOrgModal() {
  const m = document.getElementById('new-org-modal');
  if (m) m.remove();
}

async function createNewOrg() {
  const name = document.getElementById('no-name')?.value.trim();
  const desc = document.getElementById('no-desc')?.value.trim();
  const cat  = document.getElementById('no-cat')?.value;
  const icon = document.getElementById('no-icon')?.value;

  if (!name) { alert('Please enter an organization name.'); return; }

  // Color map by category
  const colorMap = {
    academic: { color:'#1a3a6b', bg:'#FBE6E6', ic:'#1a3a6b' },
    service:  { color:'#3B6D11', bg:'#EAF3DE', ic:'#3B6D11' },
    social:   { color:'#854F0B', bg:'#FAEEDA', ic:'#854F0B' },
    cultural: { color:'#0F6E56', bg:'#E1F5EE', ic:'#0F6E56' },
    faith:    { color:'#993556', bg:'#FBEAF0', ic:'#993556' },
    arts:     { color:'#533AB7', bg:'#EEEDFE', ic:'#533AB7' },
    sport:    { color:'#6b1a1a', bg:'#FBE6E6', ic:'#6b1a1a' },
    other:    { color:'#5a5a52', bg:'#F1EFE8', ic:'#5a5a52' },
  };
  const colors = colorMap[cat] || colorMap.other;

  const newOrg = {
    id:   'org-' + Date.now(),
    name,
    desc: desc || '',
    icon,
    color: colors.color,
    bg:    colors.bg,
    ic:    colors.ic,
    meta:  '0',
    pts:   0,
  };

  // Add to DATA.orgs so students see it immediately
  DATA.orgs.push(newOrg);
  DATA.clubs.push({ name, pts: 0, color: colors.color });

  // TODO (Supabase): await db.from('orgs').insert({ name, description: desc, icon, ...colors });

  closeNewOrgModal();
  showToast(`"${name}" created and visible to students.`);

  // Refresh positions page to show updated org list
  const content = document.getElementById('admin-content');
  if (content) content.innerHTML = renderAdminPositions();
}

/* ── Live Supabase wiring ─────────────────────────────── */
async function loadPositionsFromDB() {
  try {
    const data = await fetchAllPositions();
    // Clear and rebuild STUDENT_POSITIONS from DB
    Object.keys(STUDENT_POSITIONS).forEach(k => delete STUDENT_POSITIONS[k]);
    data.forEach(p => {
      const uid = p.user_id;
      if (!STUDENT_POSITIONS[uid]) STUDENT_POSITIONS[uid] = [];
      STUDENT_POSITIONS[uid].push({ position: p.position, org: p.org });
    });
  } catch(e) { console.warn('Positions load failed:', e); }
}

// Positions wired directly in assignPosition and removePosition above
