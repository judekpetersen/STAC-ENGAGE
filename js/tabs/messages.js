/* ============================================================
   STAC Engage — Messages Tab (student side, live Supabase)
   ============================================================ */

let studentMessages = [];

async function loadStudentMessages() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) return;
  try {
    const { data, error } = await db
      .from('messages')
      .select('*, sender:profiles!sender_id(first_name,last_name)')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: true });
    if (error) throw error;
    studentMessages = (data || []).map(m => ({
      id:     m.id,
      from:   m.sender_id === user.id ? 'student' : 'admin',
      sender: m.sender_id === user.id
        ? 'You'
        : ((m.sender?.first_name||'Admin') + ' ' + (m.sender?.last_name||'')).trim(),
      text:   m.text,
      time:   timeAgoMsg(m.created_at),
    }));
    // Refresh if on messages tab
    const threadEl = document.getElementById('msg-thread');
    if (threadEl) {
      threadEl.innerHTML = studentMessages.length > 0
        ? renderMsgBubbles(studentMessages)
        : `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">
            <i class="ti ti-message-circle" style="font-size:32px;display:block;margin-bottom:8px;color:#d0cfc8;"></i>
            No messages yet — send a message below
           </div>`;
      threadEl.scrollTop = threadEl.scrollHeight;
    }
  } catch(e) { console.warn('Messages load failed:', e); }
}

function timeAgoMsg(ts) {
  if (!ts) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}

function renderMsgBubbles(msgs) {
  return msgs.map(m => {
    const isMe = m.from === 'student';
    return `<div style="display:flex;${isMe?'justify-content:flex-end;':''}">
      <div style="max-width:75%;">
        ${!isMe ? `<div style="font-size:11px;font-weight:500;color:#8a8a80;margin-bottom:3px;">${m.sender}</div>` : ''}
        <div style="background:${isMe?'#6b1a1a':'var(--surface-2)'};color:${isMe?'#fff':'var(--text)'};padding:9px 13px;border-radius:14px;${isMe?'border-bottom-right-radius:4px;':'border-bottom-left-radius:4px;'}font-size:13px;line-height:1.5;">
          ${m.text}
        </div>
        <div style="font-size:10px;color:#8a8a80;margin-top:3px;${isMe?'text-align:right;':''}">${m.time}</div>
      </div>
    </div>`;
  }).join('');
}

function renderMessages() {
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Messages</h1>
      <p>Chat directly with Student Engagement staff</p>
    </div>

    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-message-circle"></i>Student Engagement</div>
        <button class="tbtn" onclick="loadStudentMessages()" style="font-size:11px;">
          <i class="ti ti-refresh" style="font-size:11px;"></i> Refresh
        </button>
      </div>
      <div class="card-body" style="padding:0;">
        <div id="msg-thread" style="max-height:420px;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:10px;">
          ${studentMessages.length > 0
            ? renderMsgBubbles(studentMessages)
            : `<div style="text-align:center;padding:2rem;color:#8a8a80;font-size:13px;">
                <i class="ti ti-message-circle" style="font-size:32px;display:block;margin-bottom:8px;color:#d0cfc8;"></i>
                No messages yet — send a message below
               </div>`}
        </div>
        <div style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--border);">
          <input class="shoutout-input" id="msg-input"
            placeholder="Type a message to Student Engagement..."
            onkeydown="if(event.key==='Enter')sendStudentMessage()">
          <button class="shoutout-send" onclick="sendStudentMessage()">Send <i class="ti ti-send"></i></button>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-address-book"></i>Student Engagement contacts</div></div>
      <div class="card-body">
        ${STAFF_CONTACTS.map(c=>`
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

async function sendStudentMessage() {
  const inp  = document.getElementById('msg-input');
  const val  = inp ? inp.value.trim() : '';
  if (!val) return;
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) { showToast('Please sign in to send messages.'); return; }

  try {
    // Look up an admin to send to
    const { data: admins } = await db
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    const adminId = admins?.[0]?.id;
    if (!adminId) { showToast('No admin available yet.'); return; }

    const { error } = await db.from('messages').insert({
      sender_id:    user.id,
      recipient_id: adminId,
      text: val,
    });
    if (error) throw error;
    if (inp) inp.value = '';
    // Add optimistically
    studentMessages.push({ from:'student', sender:'You', text:val, time:'Just now' });
    const threadEl = document.getElementById('msg-thread');
    if (threadEl) {
      threadEl.innerHTML = renderMsgBubbles(studentMessages);
      threadEl.scrollTop = threadEl.scrollHeight;
    }
    showToast('Message sent to Student Engagement.');
  } catch(e) {
    console.error('Send failed:', e);
    showToast('Could not send — check your connection.');
  }
}

// Load messages when tab opens
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(loadStudentMessages, 800);
});

/* ── Auto-poll messages every 5s when on tab ──────────── */
let _msgPollInterval = null;

function startMessagePolling() {
  stopMessagePolling();
  _msgPollInterval = setInterval(() => {
    if (typeof currentTab !== 'undefined' && currentTab === 'messages') {
      loadStudentMessages();
    }
  }, 5000);
}

function stopMessagePolling() {
  if (_msgPollInterval) { clearInterval(_msgPollInterval); _msgPollInterval = null; }
}
