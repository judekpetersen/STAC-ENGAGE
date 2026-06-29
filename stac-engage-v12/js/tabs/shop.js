/* ============================================================
   STAC Engage v9 — Point Shop (+ prizes & raffles)
   ============================================================ */

function renderShop() {
  const score = getState().user.score;
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Point shop</h1>
      <p>Redeem your engagement points for real campus perks &amp; prizes</p>
    </div>
    <div class="balance-bar">
      <i class="ti ti-star"></i>
      <span class="balance-label">Your balance: <span>${score} pts</span></span>
      <span class="balance-note">Points never expire</span>
    </div>

    <!-- Prizes -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-gift"></i>Prizes</div>
        <span style="font-size:11px;color:#8a8a80;">Raffle entries drawn each semester</span>
      </div>
      <div class="card-body">
        <div class="shop-grid">
          ${SHOP_PRIZES.filter(s=>s.raffle).map(s => prizeCard(s)).join('')}
        </div>
      </div>
    </div>

    <!-- Instant rewards -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-bolt"></i>Instant rewards</div>
        <span style="font-size:11px;color:#8a8a80;">Redeem immediately</span>
      </div>
      <div class="card-body">
        <div class="shop-grid">
          ${SHOP_PRIZES.filter(s=>!s.raffle).map(s => prizeCard(s)).join('')}
        </div>
      </div>
    </div>

    <!-- Campus perks -->
    <div class="card">
      <div class="card-head"><div class="card-title"><i class="ti ti-building"></i>Campus perks</div></div>
      <div class="card-body" id="shop-container">${C_shopGrid(DATA.shop)}</div>
    </div>
  </div>`;
}

function prizeCard(s) {
  const redeemed = isRedeemed(s.id);
  return `
    <div class="shop-card">
      <div class="shop-icon" style="background:${s.bg};">
        <i class="ti ${s.icon}" style="color:${s.ic};font-size:18px;"></i>
      </div>
      <div class="shop-name">${s.name}</div>
      <div class="shop-desc">${s.desc}</div>
      <div class="shop-footer">
        <span class="shop-cost"><i class="ti ti-star"></i> ${s.cost} pts</span>
        <button class="tbtn ${redeemed?'done':''}" onclick="redeemPrize(${s.id})">
          ${redeemed ? (s.raffle?'Entered':'Redeemed') : (s.raffle?'Enter raffle':'Redeem')}
        </button>
      </div>
    </div>`;
}

function redeemPrize(id) {
  const item = SHOP_PRIZES.find(s => s.id === id);
  const score = getState().user.score;
  if (score < item.cost && !isRedeemed(id)) {
    showToast(`You need ${item.cost - score} more points for this.`);
    return;
  }
  redeemItem(id);
  showToast(item.raffle ? `Entered into the ${item.name} raffle!` : `${item.name} redeemed!`);
  const content = document.getElementById('app-content');
  if (content) content.innerHTML = renderShop();
}
