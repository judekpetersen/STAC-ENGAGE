/* ============================================================
   STAC Engage v9 — Profile Tab (+ avatar customization, contacts)
   ============================================================ */

function renderProfile() {
  const u    = getUser();
  const rank = getRank(u.score);
  const nextRank   = RANKS.find(r => r.min > u.score);
  const ptsToNext  = nextRank ? nextRank.min - u.score : 0;
  const rankPct    = nextRank
    ? Math.round((u.score - rank.min) / (rank.max - rank.min) * 100)
    : 100;

  return `<div class="page-animate">
    <div class="profile-header">
      ${avatarSVG(userAvatar.helmet, userAvatar.logo, 72)}
      <div style="flex:1;">
        <div class="profile-name">${u.firstName} ${u.lastName}</div>
        <div class="profile-role">${u.major} · Class of ${u.year}</div>
        <div style="display:inline-flex;align-items:center;gap:8px;margin-top:8px;padding:8px 12px;background:${rank.bg};border-radius:var(--radius);">
          <i class="ti ${rank.icon}" style="color:${rank.color};font-size:18px;"></i>
          <div>
            <div style="font-size:13px;font-weight:500;color:${rank.color};">${rank.title}</div>
            ${nextRank
              ? `<div style="font-size:10px;color:#8a8a80;">${ptsToNext} pts to ${nextRank.title}</div>`
              : `<div style="font-size:10px;color:#3B6D11;">Maximum rank achieved</div>`}
          </div>
        </div>
        ${nextRank ? `<div class="bar-wrap" style="margin-top:6px;height:5px;max-width:200px;"><div class="bar-fill" style="width:${rankPct}%;background:${rank.color};"></div></div>` : ''}
        <div class="profile-pills" style="margin-top:8px;">
          ${(STUDENT_POSITIONS[CURRENT_STUDENT_ID] || []).map(p => {
            const pc = POSITION_COLORS[p.position] || { bg:'#FBE6E6', color:'#6b1a1a', icon:'ti-star' };
            return `<span class="pill" style="background:${pc.bg};color:${pc.color};padding:4px 10px;font-size:11px;">
              <i class="ti ${pc.icon}" style="font-size:11px;"></i>
              ${p.position} — ${p.org}
            </span>`;
          }).join('')}
          <span class="pill" style="background:#EAF3DE;color:#173404;">Track &amp; Field</span>
          <span class="pill" style="background:#FBEAF0;color:#4B1528;">Campus Ministry</span>
        </div>
      </div>
      <button class="tbtn" style="align-self:flex-start;" onclick="openAvatarPicker()">
        <i class="ti ti-helmet" style="font-size:13px;"></i> Customize avatar
      </button>
      <button class="tbtn" style="align-self:flex-start;" onclick="editProfile()">
        <i class="ti ti-pencil" style="font-size:13px;"></i> Edit profile
      </button>
    </div>

    <div class="g3">
      <div class="stat-card blue">
        <div class="stat-label">Engage score</div>
        <div class="stat-value">${u.score}</div>
        <div class="stat-sub">Rank #4 overall</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Events attended</div>
        <div class="stat-value">19</div>
        <div class="stat-sub">This semester</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Streak</div>
        <div class="stat-value">${u.streakWeeks} wks</div>
        <div class="stat-sub">Personal best</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-certificate"></i>Recent involvement</div>
          <span class="card-action" onclick="switchTab('transcript')">Full transcript</span>
        </div>
        <div class="card-body">${C_transcriptRows(DATA.transcript.slice(0,4))}</div>
      </div>
      <div class="card">
        <div class="card-head">
          <div class="card-title"><i class="ti ti-shield-star"></i>Spartan Spirits</div>
          <span class="card-action" onclick="switchTab('pathways')">Details</span>
        </div>
        <div class="card-body">${C_pathwayListSpirits(SPARTAN_SPIRITS)}</div>
      </div>
    </div>

    <!-- Staff contacts -->
    <div class="card">
      <div class="card-head"><div class="card-title"><i class="ti ti-address-book"></i>Student Engagement contacts</div></div>
      <div class="card-body">
        ${STAFF_CONTACTS.map(c => `
          <div class="row">
            <div class="row-icon" style="background:${c.bg};"><i class="ti ${c.icon}" style="color:${c.ic};"></i></div>
            <div class="row-info">
              <div class="row-name">${c.name}</div>
              <div class="row-meta">${c.role}</div>
            </div>
            <div style="text-align:right;">
              <a href="mailto:${c.email}" style="font-size:12px;color:#6b1a1a;display:block;">${c.email}</a>
              <span style="font-size:11px;color:#8a8a80;">${c.phone}</span>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

/* ── Avatar rendering ──────────────────────────────────── */
function avatarSVG(helmetId, logoId, size) {
  const helmet = AVATAR_HELMETS.find(h => h.id === helmetId) || AVATAR_HELMETS[0];
  const logo   = AVATAR_LOGOS.find(l => l.id === logoId) || AVATAR_LOGOS[0];

  const helmetGraphic = helmet.style === 'racing'
    ? racingHelmetSVG(helmet, size)
    : `<img src="icons/avatars/spartan-helmet.png" style="width:${size*0.82}px;height:${size*0.82}px;object-fit:contain;${helmet.id!=='maroon'?`filter:${helmetFilter(helmet.id)};`:''}" alt="">`;

  return `<div class="profile-avatar-lg" style="background:${helmet.style==='spartan'?'var(--surface-2)':helmet.color};position:relative;flex-shrink:0;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;">
    ${helmetGraphic}
    ${logo.icon ? `<div style="position:absolute;bottom:0px;right:0px;width:${size*0.38}px;height:${size*0.38}px;border-radius:50%;background:${helmet.accent};display:flex;align-items:center;justify-content:center;border:2px solid var(--surface);">
      <i class="ti ${logo.icon}" style="color:${helmet.style==='spartan'?helmet.color:'#1a1a18'};font-size:${size*0.2}px;"></i>
    </div>` : ''}
  </div>`;
}

/* CSS filter recipes to retint the maroon/gold logo for other color options */
function helmetFilter(id) {
  switch(id) {
    case 'gold':   return 'hue-rotate(150deg) saturate(1.3)';
    case 'navy':   return 'hue-rotate(180deg) saturate(1.4) brightness(0.9)';
    case 'green':  return 'hue-rotate(90deg) saturate(1.2)';
    case 'silver': return 'grayscale(1) brightness(1.25) contrast(0.9)';
    case 'black':  return 'grayscale(1) brightness(0.55)';
    default:       return 'none';
  }
}

/* Spartan helmets now use the school logo image (icons/avatars/spartan-helmet.png) */

/* Racing helmet — front-facing visor style */
function racingHelmetSVG(helmet, size) {
  return `<svg width="${size*0.78}" height="${size*0.78}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <!-- Shell -->
    <path d="M32 6 C 46 6, 54 18, 54 32 C 54 44, 46 52, 32 52 C 18 52, 10 44, 10 32 C 10 18, 18 6, 32 6 Z"
      fill="${helmet.color}"/>
    <!-- Visor -->
    <path d="M14 28 C 14 22, 22 18, 32 18 C 42 18, 50 22, 50 28 L 50 38 C 50 42, 42 45, 32 45 C 22 45, 14 42, 14 38 Z"
      fill="#1a1a18"/>
    <!-- Visor shine -->
    <path d="M18 26 C 22 23, 28 21, 34 21 L 34 30 C 28 30, 22 31, 18 33 Z" fill="${helmet.accent}" opacity="0.35"/>
    <!-- Center stripe -->
    <path d="M30 6 L 34 6 L 34 52 L 30 52 Z" fill="${helmet.accent}"/>
    <!-- Side vents -->
    <rect x="8" y="30" width="6" height="10" rx="2" fill="${helmet.accent}"/>
    <rect x="50" y="30" width="6" height="10" rx="2" fill="${helmet.accent}"/>
    <!-- Chin guard -->
    <path d="M22 46 C 26 50, 38 50, 42 46 L 42 52 C 38 55, 26 55, 22 52 Z" fill="${helmet.color}"/>
  </svg>`;
}

function openAvatarPicker() {
  const modal = document.createElement('div');
  modal.id = 'avatar-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeAvatarModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:480px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Customize your avatar</div>
          <button onclick="closeAvatarModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display:flex;justify-content:center;margin-bottom:1.25rem;">
            <div id="avatar-preview">${avatarSVG(userAvatar.helmet, userAvatar.logo, 96)}</div>
          </div>

          <div style="font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:#8a8a80;margin-bottom:8px;">Helmet style</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:1.25rem;">
            ${AVATAR_HELMETS.map(h => `
              <div onclick="selectHelmet('${h.id}')" id="helmet-${h.id}" style="
                display:flex;flex-direction:column;align-items:center;gap:4px;
                padding:8px 4px;border-radius:var(--radius);cursor:pointer;
                border:2px solid ${userAvatar.helmet===h.id?'#c8b560':'transparent'};
                background:${userAvatar.helmet===h.id?'var(--surface-2)':'transparent'};
                transition:all .15s;">
                <div style="width:40px;height:40px;border-radius:50%;background:${h.style==='spartan'?'var(--surface-2)':h.color};display:flex;align-items:center;justify-content:center;overflow:hidden;">
                  ${h.style==='spartan'
                    ? `<img src="icons/avatars/spartan-helmet.png" style="width:34px;height:34px;object-fit:contain;${h.id!=='maroon'?`filter:${helmetFilter(h.id)};`:''}" alt="">`
                    : racingHelmetSVG(h,40)}
                </div>
                <span style="font-size:10px;color:var(--text-2);">${h.name}</span>
              </div>`).join('')}
          </div>

          <div style="font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:#8a8a80;margin-bottom:8px;">Sport / department badge</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${AVATAR_LOGOS.map(l => `
              <div onclick="selectLogo('${l.id}')" id="logo-${l.id}" style="
                display:flex;align-items:center;gap:8px;padding:9px 10px;
                border:1px solid ${userAvatar.logo===l.id?'#6b1a1a':'var(--border-md)'};
                background:${userAvatar.logo===l.id?'#FBE6E6':'transparent'};
                border-radius:var(--radius);cursor:pointer;font-size:12px;
                color:${userAvatar.logo===l.id?'#6b1a1a':'var(--text-2)'};transition:all .15s;">
                ${l.icon ? `<i class="ti ${l.icon}" style="font-size:15px;"></i>` : `<i class="ti ti-x" style="font-size:15px;"></i>`}
                ${l.name}
              </div>`).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="closeAvatarModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="saveAvatar()">Save avatar</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

let tempAvatar = null;
function selectHelmet(id) {
  if (!tempAvatar) tempAvatar = { ...userAvatar };
  tempAvatar.helmet = id;
  AVATAR_HELMETS.forEach(h => {
    const el = document.getElementById('helmet-' + h.id);
    if (el) {
      const active = h.id === id;
      el.style.borderColor = active ? '#c8b560' : 'transparent';
      el.style.background  = active ? 'var(--surface-2)' : 'transparent';
    }
  });
  updatePreview();
}

function selectLogo(id) {
  if (!tempAvatar) tempAvatar = { ...userAvatar };
  tempAvatar.logo = id;
  AVATAR_LOGOS.forEach(l => {
    const el = document.getElementById('logo-' + l.id);
    if (el) {
      const active = l.id === id;
      el.style.borderColor = active ? '#6b1a1a' : 'var(--border-md)';
      el.style.background  = active ? '#FBE6E6' : 'transparent';
      el.style.color       = active ? '#6b1a1a' : 'var(--text-2)';
    }
  });
  updatePreview();
}

function updatePreview() {
  const el = document.getElementById('avatar-preview');
  if (el && tempAvatar) el.innerHTML = avatarSVG(tempAvatar.helmet, tempAvatar.logo, 96);
}

function saveAvatar() {
  if (tempAvatar) {
    userAvatar.helmet = tempAvatar.helmet;
    userAvatar.logo   = tempAvatar.logo;
    tempAvatar = null;
  }
  closeAvatarModal();
  showToast('Avatar updated!');
  const content = document.getElementById('app-content');
  if (content) content.innerHTML = renderProfile();
  // Update header avatar too
  const ha = document.getElementById('header-avatar');
  if (ha) ha.innerHTML = avatarSVG(userAvatar.helmet, userAvatar.logo, 34).replace('profile-avatar-lg','');
}

function closeAvatarModal() {
  const m = document.getElementById('avatar-modal');
  if (m) m.remove();
  tempAvatar = null;
}

function editProfile() {
  const u = getUser();
  const modal = document.createElement('div');
  modal.id = 'edit-profile-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeEditProfileModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:420px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Edit profile</div>
          <button onclick="closeEditProfileModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div class="field-row-2">
            <div class="field">
              <label>First name</label>
              <input type="text" id="ep-first" value="${u.firstName || ''}">
            </div>
            <div class="field">
              <label>Last name</label>
              <input type="text" id="ep-last" value="${u.lastName || ''}">
            </div>
          </div>
          <div class="field">
            <label>Major</label>
            <input type="text" id="ep-major" value="${u.major || ''}">
          </div>
          <div class="field">
            <label>Class year</label>
            <select id="ep-year">
              ${['2025','2026','2027','2028','2029'].map(y =>
                `<option value="${y}" ${u.year === y ? 'selected' : ''}>${y}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="closeEditProfileModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="saveProfile()">Save changes</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function saveProfile() {
  const first = document.getElementById('ep-first')?.value.trim();
  const last  = document.getElementById('ep-last')?.value.trim();
  const major = document.getElementById('ep-major')?.value.trim();
  const year  = document.getElementById('ep-year')?.value;
  const user  = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!first) { alert('Please enter your first name.'); return; }

  try {
    const { error } = await db.from('profiles').update({
      first_name: first, last_name: last, major, year
    }).eq('id', user.id);
    if (error) throw error;

    // Update local state
    user.firstName = first;
    user.lastName  = last;
    user.major     = major;
    user.year      = year;
    localStorage.setItem('stac_engage_user', JSON.stringify(user));
    const s = getState();
    Object.assign(s.user, { firstName: first, lastName: last, major, year });
    saveState();

    closeEditProfileModal();
    showToast('Profile updated!');
    const content = document.getElementById('app-content');
    if (content) content.innerHTML = renderProfile();
  } catch(e) {
    console.error('Profile save failed:', e);
    showToast('Could not save — check your connection.');
  }
}

function closeEditProfileModal() {
  const m = document.getElementById('edit-profile-modal');
  if (m) m.remove();
}
