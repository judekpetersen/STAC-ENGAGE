/* ============================================================
   STAC Engage — Shared Components
   ============================================================ */

function C_eventRow(e) {
  const r = isRSVP(e.id);
  return `<div class="row">
    <div class="date-box" style="background:${e.tc};border:1px solid ${e.bc}25;">
      <span class="dmonth" style="color:${e.bc};">${e.month}</span>
      <span class="dday" style="color:${e.bc};">${e.day}</span>
    </div>
    <div class="row-info">
      <div class="row-name">${e.name}</div>
      <div class="row-meta"><i class="ti ti-map-pin" style="font-size:10px;"></i> ${e.loc} · +${e.pts} pts</div>
    </div>
    <button class="tbtn ${r?'on':''}" onclick="doRSVP('${e.id}',this)">${r?'RSVPd':'RSVP'}</button>
  </div>`;
}

function C_badgeGrid(badges) {
  return `<div class="badge-grid">${badges.map(b => `
    <div class="badge-item ${b.earned?'':'locked'}">
      <div class="badge-icon" style="background:${b.earned?b.bg:'#f0efe9'};border-color:${b.earned?b.ic:'#d0cfc8'};">
        <i class="ti ${b.icon}" style="color:${b.ic};font-size:20px;"></i>
      </div>
      <div class="badge-nm">${b.name}</div>
      <div class="badge-pts">${b.pts}</div>
    </div>`).join('')}</div>`;
}

function C_pathwayList(pathways) {
  return pathways.map(p => `
    <div class="pathway-item">
      <div class="pathway-top">
        <span class="pathway-name">${p.name}</span>
        <span class="pathway-pct">${p.pct}%</span>
      </div>
      <div class="bar-wrap" style="height:6px;">
        <div class="bar-fill" style="width:${p.pct}%;background:${p.color};"></div>
      </div>
    </div>`).join('');
}

function C_lbRows(leaders) {
  return leaders.map(l => `
    <div class="lb-row ${l.you?'you':''}">
      <span class="lb-rank">${l.you?'★':l.rank}</span>
      <div class="lb-avatar" style="background:${l.bg};color:${l.fc};">${l.initials}</div>
      <span class="lb-name">${l.name}${l.you?' <span style="font-size:10px;color:#3B6D11;">(you)</span>':''}</span>
      <span class="lb-pts">${l.pts} pts</span>
    </div>`).join('');
}

function C_transcriptRows(items) {
  return items.map(t => `
    <div class="row">
      <div class="row-icon" style="background:${t.bg};">
        <i class="ti ${t.icon}" style="color:${t.ic};"></i>
      </div>
      <div class="row-info">
        <div class="row-name">${t.name}</div>
        <div class="row-meta">${t.type} · ${t.date}</div>
      </div>
      <span style="font-size:13px;font-weight:500;color:#6b1a1a;">+${t.pts}</span>
    </div>`).join('');
}

function C_challengeRows(challenges) {
  return challenges.map(c => {
    const done = isClaimed(c.id) || c.state === 'done';
    const claimable = c.state === 'claim' && !isClaimed(c.id);
    return `<div class="row">
      <div class="row-icon" style="background:${c.bg};">
        <i class="ti ${c.icon}" style="color:${c.ic};"></i>
      </div>
      <div class="row-info">
        <div class="row-name">${c.name}</div>
        <div class="row-meta">${c.meta}</div>
        ${c.pct > 0 && c.pct < 100 ? `<div class="bar-wrap"><div class="bar-fill" style="width:${c.pct}%;background:${c.ic};"></div></div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
        <span style="font-size:12px;font-weight:500;color:${c.ic};">${c.pts} pts</span>
        ${claimable ? `<button class="tbtn" onclick="doClaim('${c.id}')">Claim</button>` :
          done ? `<button class="tbtn done" disabled>Claimed</button>` :
          c.state === 'locked' ? `<button class="tbtn lock" disabled>Locked</button>` :
          `<span style="font-size:10px;color:#8a8a80;">In progress</span>`}
      </div>
    </div>`;
  }).join('');
}

function C_feedItems(feedItems) {
  return feedItems.map(f => `
    <div class="feed-item" id="fi-${f.id}">
      <div class="feed-avatar" style="background:${f.bg};color:${f.fc};">${f.initials}</div>
      <div class="feed-body">
        <div class="feed-text"><b>${f.name}${f.you?' <span style="font-size:10px;color:#3B6D11;font-weight:400;">(you)</span>':''}</b> — ${f.text}</div>
        <div class="feed-time">${f.time}</div>
        <div class="feed-actions">
          <span class="feed-act ${isLiked(f.id)?'liked':''}" onclick="doLike('${f.id}')">
            <i class="ti ti-heart"></i>
            <span id="lc-${f.id}">${f.likes}</span>
          </span>
          <span class="feed-act"><i class="ti ti-message"></i> Reply</span>
          <span class="feed-act"><i class="ti ti-share"></i> Share</span>
        </div>
      </div>
    </div>`).join('');
}

function C_shopGrid(items) {
  return `<div class="shop-grid">${items.map(s => `
    <div class="shop-card">
      <div class="shop-icon" style="background:${s.bg};">
        <i class="ti ${s.icon}" style="color:${s.ic};font-size:18px;"></i>
      </div>
      <div class="shop-name">${s.name}</div>
      <div class="shop-desc">${s.desc}</div>
      <div class="shop-footer">
        <span class="shop-cost"><i class="ti ti-star"></i> ${s.cost} pts</span>
        <button class="tbtn ${isRedeemed(s.id)?'done':''}" onclick="doRedeem('${s.id}')">${isRedeemed(s.id)?'Redeemed':'Redeem'}</button>
      </div>
    </div>`).join('')}</div>`;
}

function C_orgList(orgs) {
  return orgs.map(o => `
    <div class="org-item">
      <div class="org-icon" style="background:${o.bg};">
        <i class="ti ${o.icon}" style="color:${o.ic};font-size:18px;"></i>
      </div>
      <div class="org-info">
        <div class="org-name">${o.name}</div>
        <div class="org-meta">${o.meta}</div>
      </div>
      <button class="tbtn ${isOrgJoined(o.id)?'on':''}" onclick="doJoinOrg('${o.id}',this)">${isOrgJoined(o.id)?'Joined':'Join'}</button>
    </div>`).join('');
}

function C_streakRow(days, labels) {
  return days.map((hit, i) => `
    <div class="streak-day ${hit?'hit':''}">
      <span class="sd-check">${hit?'✓':'·'}</span>
      <span class="sd-label">${labels[i % 7]}</span>
    </div>`).join('');
}

/* ---- Shared event handlers (global) ---- */
async function doRSVP(id, btn) {
  const on = toggleRSVP(id);
  btn.className = 'tbtn ' + (on ? 'on' : '');
  btn.textContent = on ? 'RSVPd' : 'RSVP';

  // Save to Supabase
  try {
    const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
    if (user.id) {
      await toggleRSVP(user.id, id, !on);
      if (on) {
        const event = DATA.events.find(e => e.id === id);
        const pts = event?.points || 50;
        const s = getState();
        s.user.score = (s.user.score || 0) + pts;
        saveState();
        updateScoreDisplay();
        showToast('RSVP confirmed! +' + pts + ' pts 🎉');
        launchConfetti();
        // Notify admins
        const { data: admins } = await db.from('profiles').select('id').eq('role','admin').limit(3);
        if (admins?.length) {
          await db.from('notifications').insert(admins.map(a => ({
            user_id: a.id, type: 'event', read: false,
            text: `${s.user.firstName || 'A student'} RSVPd to "${event?.name || 'an event'}"`
          })));
        }
      } else {
        showToast('RSVP cancelled.');
      }
    }
  } catch(e) { console.warn('RSVP save failed:', e); }
}

function doClaim(id) {
  claimChallenge(id);
  updateScoreDisplay();
  const container = document.getElementById('challenge-container');
  if (container) container.innerHTML = C_challengeRows(DATA.challenges);
  const dashChall = document.getElementById('dash-challenges');
  if (dashChall) dashChall.innerHTML = C_challengeRows(DATA.challenges.slice(0, 3));
}

function doRedeem(id) {
  redeemItem(id);
  const container = document.getElementById('shop-container');
  if (container) container.innerHTML = C_shopGrid(DATA.shop);
}

function doLike(id) {
  const on = toggleLike(id);
  const cnt = document.getElementById('lc-' + id);
  const act = document.querySelector(`#fi-${id} .feed-act`);
  const item = getState().feed.find(f => f.id === id);
  if (cnt && item) cnt.textContent = item.likes;
  if (act) act.className = 'feed-act' + (on ? ' liked' : '');
}

function doJoinOrg(id, btn) {
  const on = toggleOrg(id);
  btn.className = 'tbtn ' + (on ? 'on' : '');
  btn.textContent = on ? 'Joined' : 'Join';
}

function doPost() {
  const inp = document.getElementById('shout-input');
  const val = inp ? inp.value.trim() : '';
  if (!val) return;
  addPost(val);
  inp.value = '';
  const container = document.getElementById('feed-container');
  if (container) container.innerHTML = C_feedItems(getState().feed);
}

/* ── v9 — Spartan Spirits mini list for dashboard ─────── */
function C_pathwayListSpirits(spirits) {
  return spirits.map(p => `
    <div class="pathway-item">
      <div class="pathway-top">
        <span class="pathway-name" style="display:flex;align-items:center;gap:6px;">
          <i class="ti ${p.icon}" style="color:${p.color};font-size:14px;"></i>
          ${p.name}
        </span>
        <span class="pathway-pct">${p.pct}%</span>
      </div>
      <div class="bar-wrap" style="height:6px;">
        <div class="bar-fill" style="width:${p.pct}%;background:${p.color};"></div>
      </div>
    </div>`).join('');
}

/* ── Confetti animation ───────────────────────────────── */
function launchConfetti() {
  const colors = ['#6b1a1a','#c8b560','#3B6D11','#1a3a6b','#993556','#854F0B'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = Math.random() * 8 + 5;
    const left  = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const duration = Math.random() * 1.5 + 1.5;
    el.style.cssText = `
      position:absolute;top:-20px;left:${left}%;
      width:${size}px;height:${size}px;
      background:${color};border-radius:${Math.random()>0.5?'50%':'2px'};
      animation:confettiFall ${duration}s ${delay}s ease-in forwards;
      transform:rotate(${Math.random()*360}deg);
    `;
    container.appendChild(el);
  }
  // Add keyframe if not already added
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `@keyframes confettiFall {
      0%   { transform:translateY(0) rotate(0deg); opacity:1; }
      100% { transform:translateY(100vh) rotate(720deg); opacity:0; }
    }`;
    document.head.appendChild(style);
  }
  setTimeout(() => container.remove(), 3000);
}
