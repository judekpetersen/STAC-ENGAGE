/* ============================================================
   STAC Engage v7 — Feed Tab (+ marketplace)
   ============================================================ */

let marketFilter = 'all';

function renderFeed() {
  const filtered = marketFilter === 'all'
    ? MARKETPLACE_LISTINGS
    : MARKETPLACE_LISTINGS.filter(l => l.category === marketFilter);

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Activity feed</h1>
      <p>Shoutouts, updates, and the student marketplace</p>
    </div>

    <!-- Shoutout feed -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-megaphone"></i>Send a shoutout</div></div>
      <div class="card-body">
        <div class="shoutout-form">
          <input class="shoutout-input" id="shout-input" placeholder="Shout out a classmate..."/>
          <button class="shoutout-send" onclick="doPost()">Send <i class="ti ti-send"></i></button>
        </div>
        <div id="feed-container">${C_feedItems(getState().feed)}</div>
      </div>
    </div>

    <!-- Marketplace -->
    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-shopping-bag"></i>Student marketplace</div>
        <button class="tbtn" onclick="openNewListing()" style="display:flex;align-items:center;gap:5px;">
          <i class="ti ti-plus" style="font-size:12px;"></i> Post listing
        </button>
      </div>
      <div class="card-body">
        <div style="display:flex;gap:6px;margin-bottom:12px;">
          ${['all','Textbook','Dorm'].map(f => `
            <button class="filter-pill ${marketFilter===f?'active':''}" onclick="setMarketFilter('${f}')">
              ${f === 'all' ? 'All' : f+'s'}
            </button>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;">
          ${filtered.map(l => `
            <div style="border:1px solid var(--border);border-radius:var(--radius-lg);padding:12px;background:var(--surface);cursor:pointer;" onclick="viewListing('${l.id}')">
              <div style="width:36px;height:36px;border-radius:var(--radius);background:${l.bg};display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                <i class="ti ${l.category==='Textbook'?'ti-book':'ti-home'}" style="color:${l.ic};font-size:17px;"></i>
              </div>
              <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:2px;">${l.title}</div>
              <div style="font-size:11px;color:#8a8a80;margin-bottom:6px;">${l.condition} · ${l.posted}</div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:14px;font-weight:600;color:#3B6D11;">$${l.price}</span>
                <button class="tbtn" style="font-size:10px;padding:3px 9px;" onclick="event.stopPropagation();contactSeller('${l.id}')">Contact</button>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function setMarketFilter(f) {
  marketFilter = f;
  const content = document.getElementById('app-content');
  if (content) content.innerHTML = renderFeed();
}

function viewListing(id) {
  const l = MARKETPLACE_LISTINGS.find(x => x.id === id);
  showToast(`Viewing ${l.title} — messaging coming with Supabase.`);
}

function contactSeller(id) {
  const l = MARKETPLACE_LISTINGS.find(x => x.id === id);
  showToast(`Opening messages — reach out to ${l.seller} directly.`);
  setTimeout(() => switchTab('messages'), 500);
}

function openNewListing() {
  const modal = document.createElement('div');
  modal.id = 'listing-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeListingModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Post a listing</div>
          <button onclick="closeListingModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div class="field"><label>Title</label><input type="text" id="lst-title" placeholder="e.g. Intro to Psychology Textbook"></div>
          <div class="field-row-2">
            <div class="field"><label>Price ($)</label><input type="number" id="lst-price" placeholder="0"></div>
            <div class="field"><label>Category</label>
              <select id="lst-cat"><option value="Textbook">Textbook</option><option value="Dorm">Dorm item</option><option value="Other">Other</option></select>
            </div>
          </div>
          <div class="field"><label>Condition</label>
            <select id="lst-cond"><option>Like new</option><option>Excellent</option><option>Good</option><option>Fair</option></select>
          </div>
          <div class="field"><label>Description (optional)</label><input type="text" id="lst-desc" placeholder="Any extra details..."></div>
        </div>
        <div class="modal-footer">
          <button onclick="closeListingModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="submitListing()">Post listing</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function closeListingModal() {
  const m = document.getElementById('listing-modal');
  if (m) m.remove();
}

function submitListing() {
  const title = document.getElementById('lst-title').value.trim();
  if (!title) { alert('Please enter a title.'); return; }
  const price = document.getElementById('lst-price').value;
  const cat   = document.getElementById('lst-cat').value;
  const cond  = document.getElementById('lst-cond').value;
  MARKETPLACE_LISTINGS.unshift({
    id: Date.now(), title, price: parseInt(price)||0,
    condition: cond, seller: (function(){ const u=JSON.parse(localStorage.getItem('stac_engage_user')||'{}'); return (u.firstName||'Student')+' '+(u.lastName||'').charAt(0)+'.'; })(), posted: 'Just now',
    category: cat, bg: '#FBE6E6', ic: '#6b1a1a'
  });
  closeListingModal();
  showToast('Listing posted to the marketplace.');
  const content = document.getElementById('app-content');
  if (content) content.innerHTML = renderFeed();
}

/* ── v17 Supabase live feed ───────────────────────────── */
async function loadFeedFromDB() {
  try {
    const posts = await fetchFeed();
    const state = getState();
    state.feed = posts.map(p => ({
      id:       p.id,
      text:     p.text,
      initials: ((p.profiles?.first_name||'?')[0] + (p.profiles?.last_name||'?')[0]).toUpperCase(),
      name:     (p.profiles?.first_name || '') + ' ' + (p.profiles?.last_name || ''),
      time:     timeAgo(p.created_at),
      likes:    p.likes || 0,
      liked:    false,
      bg:       '#FBE6E6',
      fc:       '#6b1a1a',
    }));
    const content = document.getElementById('app-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.dataset.tab === 'feed') {
      content.innerHTML = renderFeed();
    }
  } catch(e) { console.warn('Feed load failed:', e); }
}

function timeAgo(ts) {
  if (!ts) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400)return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}

/* Override postShoutout to save to DB */
const _origPost = typeof postShoutout === 'function' ? postShoutout : null;
window.postShoutout = async function() {
  const inp = document.getElementById('shoutout-input');
  const val = inp ? inp.value.trim() : '';
  if (!val) return;
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  try {
    await postToFeed(user.id, val);
    inp.value = '';
    await loadFeedFromDB();
    showToast('Shoutout posted!');
    // Award points locally too
    const s = getState();
    s.user.score = (s.user.score || 0) + 10;
    updateScoreDisplay();
  } catch(e) {
    console.warn('Post failed:', e);
    showToast('Could not post — check your connection.');
  }
};
