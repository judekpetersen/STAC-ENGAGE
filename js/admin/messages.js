/* ============================================================
   STAC Engage — Admin: Messages (live Supabase)
   ============================================================ */

let activeThreadId  = null;
let adminThreads    = {}; // { studentId: { name, messages: [] } }
let adminStudentMap = {}; // { studentId: { name, ini, bg, fc } }

async function loadAdminThreads() {
  try {
    // Get all messages involving admin (recipient = admin or sent by admin)
    const { data, error } = await db
      .from('messages')
      .select('*, sender:profiles!sender_id(id,first_name,last_name), recipient:profiles!recipient_id(id,first_name,last_name)')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Also load all students for new message dropdown
    const { data: students } = await db.from('profiles').select('id,first_name,last_name,major,year').order('first_name');
    adminStudentMap = {};
    const adminUser = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
    const adminId   = adminUser.id;
    (students || []).forEach(s => {
      if (s.id === adminId) return; // skip admin's own profile
      adminStudentMap[s.id] = {
        id: s.id,
        name: (s.first_name||'') + ' ' + (s.last_name||''),
        ini:  ((s.first_name||'?')[0] + (s.last_name||'?')[0]).toUpperCase(),
        major: s.major || '',
        bg: '#EAF3DE', fc: '#173404',
      };
    });

    // Group messages into threads by student
    adminThreads = {};
    (data || []).forEach(m => {
      // Determine which side is the student (not the admin)
      const studentId = m.sender?.id !== adminId ? m.sender?.id : m.recipient?.id;
      const student   = adminStudentMap[studentId];
      if (!student) return;

      if (!adminThreads[studentId]) {
        adminThreads[studentId] = { ...student, messages: [] };
      }
      adminThreads[studentId].messages.push({
        from:   m.sender?.id === studentId ? 'student' : 'admin',
        sender: m.sender?.id === studentId
          ? (m.sender.first_name || 'Student')
          : 'You',
        text:   m.text,
        time:   timeAgoAdmin(m.created_at),
        id:     m.id,
      });
    });

    if (activeThreadId === null) {
      const ids = Object.keys(adminThreads);
      if (ids.length) activeThreadId = ids[0];
    }

    // Refresh if on messages tab
    const content = document.getElementById('admin-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.id === 'anav-messages') {
      content.innerHTML = renderAdminMessages();
    }
  } catch(e) { console.warn('Admin threads load failed:', e); }
}

function timeAgoAdmin(ts) {
  if (!ts) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}

function renderAdminMessages() {
  const threadIds = Object.keys(adminThreads);
  if (activeThreadId && !adminThreads[activeThreadId]) activeThreadId = threadIds[0] || null;

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Messages</h1>
      <p>Conversations with students</p>
    </div>

    <div class="card" style="overflow:hidden;">
      <div class="messages-layout-grid">

        <!-- Thread list -->
        <div style="border-right:1px solid var(--border);overflow-y:auto;">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;gap:6px;">
            <button class="tbtn" style="flex:1;justify-content:center;display:flex;gap:6px;" onclick="openNewMessageModal()">
              <i class="ti ti-edit" style="font-size:12px;"></i> New message
            </button>
            <button class="tbtn" onclick="loadAdminThreads()" title="Refresh">
              <i class="ti ti-refresh" style="font-size:12px;"></i>
            </button>
          </div>
          <div id="admin-thread-list">
            ${threadIds.length === 0
              ? `<div style="text-align:center;padding:2rem 1rem;color:#8a8a80;font-size:12px;">
                  No messages yet.<br>Click "New message" to reach out to a student.
                 </div>`
              : threadIds.map(id => {
                  const t    = adminThreads[id];
                  const last = t.messages[t.messages.length - 1];
                  const unread = last?.from === 'student';
                  return `<div onclick="selectAdminThread('${id}')"
                    style="padding:11px 14px;border-bottom:1px solid var(--border);cursor:pointer;${activeThreadId===id?'background:var(--surface-2);':''}">
                    <div style="display:flex;align-items:center;gap:9px;">
                      <div class="stu-av" style="background:${t.bg};color:${t.fc};">${t.ini}</div>
                      <div style="flex:1;min-width:0;">
                        <div style="font-size:13px;font-weight:500;color:var(--text);display:flex;align-items:center;gap:6px;">
                          ${t.name}
                          ${unread ? '<span style="width:7px;height:7px;border-radius:50%;background:#6b1a1a;flex-shrink:0;"></span>' : ''}
                        </div>
                        ${last ? `<div style="font-size:11px;color:#8a8a80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${last.text}</div>` : ''}
                      </div>
                    </div>
                  </div>`;
                }).join('')}
          </div>
        </div>

        <!-- Active conversation -->
        <div style="display:flex;flex-direction:column;">
          ${activeThreadId && adminThreads[activeThreadId] ? (() => {
            const t = adminThreads[activeThreadId];
            return `
              <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;">
                <div class="stu-av" style="background:${t.bg};color:${t.fc};">${t.ini}</div>
                <div>
                  <div style="font-size:13px;font-weight:500;color:var(--text);">${t.name}</div>
                  <div style="font-size:11px;color:#8a8a80;">${t.major || ''}</div>
                </div>
              </div>
              <div id="admin-msg-thread" style="flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:10px;max-height:360px;">
                ${t.messages.length === 0
                  ? `<div style="text-align:center;color:#8a8a80;font-size:13px;margin-top:2rem;">No messages yet — start the conversation</div>`
                  : t.messages.map(m => {
                      const isMe = m.from === 'admin';
                      return `<div style="display:flex;${isMe?'justify-content:flex-end;':''}">
                        <div style="max-width:75%;">
                          ${!isMe ? `<div style="font-size:11px;color:#8a8a80;margin-bottom:3px;">${m.sender}</div>` : ''}
                          <div style="background:${isMe?'#6b1a1a':'var(--surface-2)'};color:${isMe?'#fff':'var(--text)'};padding:9px 13px;border-radius:14px;${isMe?'border-bottom-right-radius:4px;':'border-bottom-left-radius:4px;'}font-size:13px;line-height:1.5;">${m.text}</div>
                          <div style="font-size:10px;color:#8a8a80;margin-top:3px;${isMe?'text-align:right;':''}">${m.time}</div>
                        </div>
                      </div>`;
                    }).join('')}
              </div>
              <div style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--border);">
                <input class="shoutout-input" id="admin-msg-input"
                  placeholder="Reply to ${t.name}..."
                  onkeydown="if(event.key==='Enter')sendAdminMessage()">
                <button class="shoutout-send" onclick="sendAdminMessage()">Send <i class="ti ti-send"></i></button>
              </div>`;
          })() : `<div style="display:flex;align-items:center;justify-content:center;flex:1;color:#8a8a80;font-size:13px;text-align:center;padding:2rem;">
            <div>
              <i class="ti ti-message-circle" style="font-size:36px;display:block;margin-bottom:8px;color:#d0cfc8;"></i>
              Select a conversation or start a new one
            </div>
          </div>`}
        </div>
      </div>
    </div>
  </div>`;
}

function selectAdminThread(id) {
  activeThreadId = id;
  const content = document.getElementById('admin-content');
  if (content) content.innerHTML = renderAdminMessages();
}

async function sendAdminMessage() {
  const inp = document.getElementById('admin-msg-input');
  const val = inp ? inp.value.trim() : '';
  if (!val || !activeThreadId) return;

  // Get admin's real UUID from localStorage
  const adminUser = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!adminUser.id) { showToast('Not signed in.'); return; }

  try {
    const { error } = await db.from('messages').insert({
      sender_id:    adminUser.id,
      recipient_id: activeThreadId,
      text:         val,
    });
    if (error) throw error;

    // Add to local thread immediately
    if (!adminThreads[activeThreadId]) adminThreads[activeThreadId] = { messages: [] };
    adminThreads[activeThreadId].messages.push({
      from: 'admin', sender: 'You', text: val, time: 'Just now'
    });

    if (inp) inp.value = '';
    const threadEl = document.getElementById('admin-msg-thread');
    if (threadEl) {
      const t = adminThreads[activeThreadId];
      threadEl.innerHTML = t.messages.map(m => {
        const isMe = m.from === 'admin';
        return `<div style="display:flex;${isMe?'justify-content:flex-end;':''}">
          <div style="max-width:75%;">
            ${!isMe?`<div style="font-size:11px;color:#8a8a80;margin-bottom:3px;">${m.sender}</div>`:''}
            <div style="background:${isMe?'#6b1a1a':'var(--surface-2)'};color:${isMe?'#fff':'var(--text)'};padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.5;">${m.text}</div>
            <div style="font-size:10px;color:#8a8a80;margin-top:3px;${isMe?'text-align:right;':''}">${m.time}</div>
          </div>
        </div>`;
      }).join('');
      threadEl.scrollTop = threadEl.scrollHeight;
    }
    showToast('Message sent.');
  } catch(e) {
    console.error('Send failed:', e);
    showToast('Could not send — check connection.');
  }
}

function messageStudent(studentId, studentName) {
  if (!adminThreads[studentId]) {
    adminThreads[studentId] = {
      id: studentId, name: studentName,
      ini: studentName.split(' ').map(w=>w[0]).join('').toUpperCase(),
      bg: '#EAF3DE', fc: '#173404', major: '', messages: [],
    };
  }
  activeThreadId = studentId;
  adminSwitchTab('messages');
}

function openNewMessageModal() {
  const students = Object.values(adminStudentMap);
  const modal = document.createElement('div');
  modal.id = 'new-msg-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeNewMsgModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">New message</div>
          <button onclick="closeNewMsgModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>To</label>
            <select id="nm-student">
              ${students.length === 0
                ? '<option value="">No students yet</option>'
                : students.map(s=>`<option value="${s.id}">${s.name} ${s.major?'— '+s.major:''}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>Message</label>
            <input type="text" id="nm-text" placeholder="Type your message...">
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="closeNewMsgModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="submitNewAdminMessage()">Send</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function closeNewMsgModal() {
  const m = document.getElementById('new-msg-modal');
  if (m) m.remove();
}

async function submitNewAdminMessage() {
  const studentId = document.getElementById('nm-student')?.value;
  const text      = document.getElementById('nm-text')?.value.trim();
  if (!studentId || !text) { alert('Please select a student and enter a message.'); return; }

  const adminUser = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!adminUser.id) { showToast('Not signed in.'); return; }

  try {
    const { error } = await db.from('messages').insert({
      sender_id: adminUser.id, recipient_id: studentId, text,
    });
    if (error) throw error;

    const s = adminStudentMap[studentId];
    if (!adminThreads[studentId]) {
      adminThreads[studentId] = { ...s, messages: [] };
    }
    adminThreads[studentId].messages.push({ from:'admin', sender:'You', text, time:'Just now' });
    activeThreadId = studentId;
    closeNewMsgModal();
    showToast('Message sent.');
    const content = document.getElementById('admin-content');
    if (content) content.innerHTML = renderAdminMessages();
  } catch(e) {
    console.error('Send failed:', e);
    alert('Could not send message — check connection.');
  }
}
