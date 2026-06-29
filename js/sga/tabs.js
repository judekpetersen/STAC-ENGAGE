/* ============================================================
   STAC Engage v15 — SGA Tab Renderers
   ============================================================ */

/* ── Overview ──────────────────────────────────────────── */
function renderSGAOverview() {
  const totalOrgs   = DATA.orgs.length;
  const totalOfficers = Object.values(STUDENT_POSITIONS).reduce((s,a) => s+a.length, 0);
  const clubVClub   = [...DATA.clubs].sort((a,b) => b.pts-a.pts);
  const maxPts      = clubVClub[0].pts;

  return `<div class="page-animate">
    <div class="page-head"><h1>SGA Overview</h1><p>Student Government Association</p></div>

    <div class="g3" style="margin-bottom:1rem;">
      <div class="stat-card" style="border-top:3px solid #533AB7;">
        <div class="stat-label">Active organizations</div>
        <div class="stat-value">${totalOrgs}</div>
        <div class="stat-sub">On campus</div>
      </div>
      <div class="stat-card" style="border-top:3px solid #533AB7;">
        <div class="stat-label">Club officers</div>
        <div class="stat-value">${totalOfficers}</div>
        <div class="stat-sub">Assigned positions</div>
      </div>
      <div class="stat-card" style="border-top:3px solid #533AB7;">
        <div class="stat-label">Total members</div>
        <div class="stat-value">${DATA.orgs.reduce((s,o)=>s+parseInt(o.meta),0)||'200+'}</div>
        <div class="stat-sub">Across all clubs</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-chart-bar"></i>Club engagement standings</div></div>
        <div class="card-body">
          ${clubVClub.map((c,i) => `
            <div class="chart-bar-wrap">
              <span class="chart-bar-label">${c.name}</span>
              <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width:${Math.round(c.pts/maxPts*100)}%;background:#533AB7;"></div>
              </div>
              <span class="chart-bar-val">${(c.pts/1000).toFixed(1)}k</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-head"><div class="card-title"><i class="ti ti-crown"></i>Club officers</div>
          <span class="card-action" onclick="sgaSwitchTab('messages')">Message officers</span>
        </div>
        <div class="card-body">
          ${Object.entries(STUDENT_POSITIONS).flatMap(([sid, positions]) =>
            positions.map(p => {
              const s = ADMIN_STUDENTS.find(x => x.id === parseInt(sid));
              if (!s) return '';
              const pc = POSITION_COLORS[p.position] || { bg:'#EEEDFE', color:'#533AB7', icon:'ti-star' };
              return `<div class="row">
                <div class="stu-av" style="background:${s.bg};color:${s.fc};">${s.ini}</div>
                <div class="row-info">
                  <div class="row-name">${s.name}</div>
                  <div class="row-meta">${p.org}</div>
                </div>
                <span class="pill" style="background:${pc.bg};color:${pc.color};">
                  <i class="ti ${pc.icon}" style="font-size:10px;"></i> ${p.position}
                </span>
              </div>`;
            })
          ).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* ── Club data ─────────────────────────────────────────── */
function renderSGAClubs() {
  return `<div class="page-animate">
    <div class="page-head"><h1>Club data</h1><p>Membership, engagement, and officer information for all clubs</p></div>

    ${DATA.orgs.map(o => {
      const clubPts = DATA.clubs.find(c => c.name === o.name)?.pts || 0;
      const officers = Object.entries(STUDENT_POSITIONS).flatMap(([sid, positions]) =>
        positions.filter(p => p.org === o.name).map(p => {
          const s = ADMIN_STUDENTS.find(x => x.id === parseInt(sid));
          return s ? { student: s, ...p } : null;
        }).filter(Boolean)
      );
      const memberCount = parseInt(o.meta) || 0;

      return `<div class="card" style="margin-bottom:1rem;">
        <div class="card-head">
          <div class="card-title">
            <div style="width:26px;height:26px;border-radius:6px;background:${o.bg};display:flex;align-items:center;justify-content:center;">
              <i class="ti ${o.icon}" style="color:${o.ic};font-size:13px;"></i>
            </div>
            ${o.name}
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="pill" style="background:#EEEDFE;color:#533AB7;">${memberCount} members</span>
            <span class="pill" style="background:#EAF3DE;color:#3B6D11;">${(clubPts/1000).toFixed(1)}k pts</span>
          </div>
        </div>
        <div class="card-body">
          <div style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:#8a8a80;margin-bottom:8px;">Officers</div>
          ${officers.length === 0
            ? `<div style="font-size:12px;color:#8a8a80;">No officers assigned</div>`
            : `<div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${officers.map(p => {
                  const pc = POSITION_COLORS[p.position] || { bg:'#EEEDFE', color:'#533AB7', icon:'ti-star' };
                  return `<div onclick="openSGAMessage('${p.student.id}')" style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--surface-2);border-radius:var(--radius);cursor:pointer;border:1px solid var(--border);">
                    <div class="stu-av" style="background:${p.student.bg};color:${p.student.fc};width:26px;height:26px;font-size:10px;">${p.student.ini}</div>
                    <div>
                      <div style="font-size:12px;font-weight:500;color:var(--text);">${p.student.name}</div>
                      <span class="pill" style="background:${pc.bg};color:${pc.color};font-size:9px;padding:2px 6px;">${p.position}</span>
                    </div>
                    <i class="ti ti-message-circle" style="font-size:14px;color:#533AB7;margin-left:4px;"></i>
                  </div>`;
                }).join('')}
              </div>`}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

/* ── Messaging — officers only ─────────────────────────── */
let activeSGAThread = null;

// Get all officers as messageable contacts
function getAllOfficers() {
  return Object.entries(STUDENT_POSITIONS).flatMap(([sid, positions]) =>
    positions.map(p => {
      const s = ADMIN_STUDENTS.find(x => x.id === parseInt(sid));
      return s ? { student: s, ...p } : null;
    }).filter(Boolean)
  );
}

function renderSGAMessages() {
  const officers = getAllOfficers();
  if (activeSGAThread === null && officers.length) activeSGAThread = officers[0].student.id;

  return `<div class="page-animate">
    <div class="page-head"><h1>Message officers</h1><p>Direct messaging to club board members only</p></div>

    <div class="card" style="overflow:hidden;">
      <div style="display:grid;grid-template-columns:260px minmax(0,1fr);min-height:480px;">

        <!-- Officer thread list -->
        <div style="border-right:1px solid var(--border);overflow-y:auto;">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border);">
            <button class="tbtn" style="width:100%;justify-content:center;display:flex;gap:6px;" onclick="openNewSGAMessage()">
              <i class="ti ti-edit" style="font-size:12px;"></i> New message
            </button>
          </div>
          ${officers.map(p => {
            const thread = SGA_THREADS[p.student.id];
            const last = thread?.messages[thread.messages.length-1];
            const unread = last?.from === 'officer';
            const pc = POSITION_COLORS[p.position] || { bg:'#EEEDFE', color:'#533AB7' };
            return `<div onclick="selectSGAThread('${p.student.id}')" style="padding:11px 14px;border-bottom:1px solid var(--border);cursor:pointer;${activeSGAThread===p.student.id?'background:var(--surface-2);':''}">
              <div style="display:flex;align-items:center;gap:9px;">
                <div class="stu-av" style="background:${p.student.bg};color:${p.student.fc};">${p.student.ini}</div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:13px;font-weight:500;color:var(--text);display:flex;align-items:center;gap:6px;">
                    ${p.student.name}
                    ${unread?'<span style="width:7px;height:7px;border-radius:50%;background:#533AB7;flex-shrink:0;"></span>':''}
                  </div>
                  <span class="pill" style="background:${pc.bg};color:${pc.color};font-size:9px;padding:1px 6px;">${p.position} — ${p.org}</span>
                  ${last ? `<div style="font-size:11px;color:#8a8a80;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${last.text}</div>` : ''}
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>

        <!-- Active conversation -->
        <div style="display:flex;flex-direction:column;">
          ${activeSGAThread ? (() => {
            const officer = getAllOfficers().find(p => p.student.id === activeSGAThread);
            const thread = SGA_THREADS[activeSGAThread] || { messages: [] };
            const pc = POSITION_COLORS[officer?.position] || { bg:'#EEEDFE', color:'#533AB7' };
            return `<div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;">
              <div class="stu-av" style="background:${officer?.student.bg};color:${officer?.student.fc};">${officer?.student.ini}</div>
              <div>
                <div style="font-size:13px;font-weight:500;color:var(--text);">${officer?.student.name}</div>
                <span class="pill" style="background:${pc.bg};color:${pc.color};font-size:10px;">${officer?.position} — ${officer?.org}</span>
              </div>
            </div>
            <div id="sga-msg-thread" style="flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:10px;max-height:350px;">
              ${thread.messages.length === 0
                ? `<div style="text-align:center;color:#8a8a80;font-size:13px;margin-top:2rem;">No messages yet — start the conversation</div>`
                : thread.messages.map(m => {
                    const isMe = m.from === 'sga';
                    return `<div style="display:flex;${isMe?'justify-content:flex-end;':''}">
                      <div style="max-width:75%;">
                        ${!isMe?`<div style="font-size:11px;font-weight:500;color:#8a8a80;margin-bottom:3px;">${m.sender}</div>`:''}
                        <div style="background:${isMe?'#533AB7':'var(--surface-2)'};color:${isMe?'#fff':'var(--text)'};padding:9px 13px;border-radius:14px;${isMe?'border-bottom-right-radius:4px;':'border-bottom-left-radius:4px;'}font-size:13px;line-height:1.5;">${m.text}</div>
                        <div style="font-size:10px;color:#8a8a80;margin-top:3px;${isMe?'text-align:right;':''}">${m.time}</div>
                      </div>
                    </div>`;
                  }).join('')}
            </div>
            <div style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--border);">
              <input class="shoutout-input" id="sga-msg-input" placeholder="Message ${officer?.student.name}..." onkeydown="if(event.key==='Enter')sendSGAMessage()">
              <button class="shoutout-send" style="background:#533AB7;border-color:#533AB7;" onclick="sendSGAMessage()">Send <i class="ti ti-send"></i></button>
            </div>`;
          })() : `<div style="display:flex;align-items:center;justify-content:center;flex:1;color:#8a8a80;font-size:13px;">Select an officer to message</div>`}
        </div>

      </div>
    </div>
  </div>`;
}

window.selectSGAThread = function(id) {
  activeSGAThread = id;
  const content = document.getElementById('sga-content');
  if (content) content.innerHTML = renderSGAMessages();
};

window.openSGAMessage = function(studentId) {
  activeSGAThread = studentId;
  sgaSwitchTab('messages');
};

window.sendSGAMessage = function() {
  const inp = document.getElementById('sga-msg-input');
  const val = inp ? inp.value.trim() : '';
  if (!val) return;
  if (!SGA_THREADS[activeSGAThread]) SGA_THREADS[activeSGAThread] = { messages: [] };
  SGA_THREADS[activeSGAThread].messages.push({ from:'sga', sender:'SGA', text: val, time:'Just now' });
  inp.value = '';
  const threadEl = document.getElementById('sga-msg-thread');
  if (threadEl) {
    threadEl.innerHTML = SGA_THREADS[activeSGAThread].messages.map(m => {
      const isMe = m.from === 'sga';
      return `<div style="display:flex;${isMe?'justify-content:flex-end;':''}">
        <div style="max-width:75%;">
          ${!isMe?`<div style="font-size:11px;font-weight:500;color:#8a8a80;margin-bottom:3px;">${m.sender}</div>`:''}
          <div style="background:${isMe?'#533AB7':'var(--surface-2)'};color:${isMe?'#fff':'var(--text)'};padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.5;">${m.text}</div>
          <div style="font-size:10px;color:#8a8a80;margin-top:3px;${isMe?'text-align:right;':''}">${m.time}</div>
        </div>
      </div>`;
    }).join('');
    threadEl.scrollTop = threadEl.scrollHeight;
  }
  showToast('Message sent.');
};

window.openNewSGAMessage = function() {
  const officers = getAllOfficers();
  const modal = document.createElement('div');
  modal.id = 'sga-new-msg-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="this.parentElement.remove()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">New message to officer</div>
          <button onclick="this.closest('#sga-new-msg-modal').remove()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>To (officers only)</label>
            <select id="sga-nm-to">
              ${officers.map(p => `<option value="${p.student.id}">${p.student.name} — ${p.position}, ${p.org}</option>`).join('')}
            </select>
          </div>
          <div class="field"><label>Message</label><input type="text" id="sga-nm-text" placeholder="Type your message..."></div>
        </div>
        <div class="modal-footer">
          <button onclick="this.closest('#sga-new-msg-modal').remove()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;background:#533AB7;border-color:#533AB7;" onclick="submitSGANewMsg()">Send</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
};

window.submitSGANewMsg = function() {
  const to   = parseInt(document.getElementById('sga-nm-to').value);
  const text = document.getElementById('sga-nm-text').value.trim();
  if (!text) { alert('Please enter a message.'); return; }
  if (!SGA_THREADS[to]) SGA_THREADS[to] = { messages: [] };
  SGA_THREADS[to].messages.push({ from:'sga', sender:'SGA', text, time:'Just now' });
  activeSGAThread = to;
  document.getElementById('sga-new-msg-modal').remove();
  showToast('Message sent.');
  const content = document.getElementById('sga-content');
  if (content) content.innerHTML = renderSGAMessages();
};
