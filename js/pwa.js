/* ============================================================
   STAC Engage — PWA Registration & Install Prompt
   Include on every HTML page after other scripts
   ============================================================ */

/* ---- Service Worker Registration ---- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('[PWA] Service worker registered:', reg.scope);

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              // Auto-apply update silently
              worker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          });
        });
      })
      .catch(err => console.warn('[PWA] SW registration failed:', err));
  });
}

/* ---- Install prompt (Android Chrome / desktop) ---- */
let _deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  _deferredInstallPrompt = event;

  // Only show install banner if not already installed
  if (!isAppInstalled()) {
    setTimeout(showInstallBanner, 2000);
  }
});

window.addEventListener('appinstalled', () => {
  _deferredInstallPrompt = null;
  hideInstallBanner();
  console.log('[PWA] App installed successfully');
});

function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
    || document.referrer.includes('android-app://');
}

/* ---- Install banner UI ---- */
function showInstallBanner() {
  if (document.getElementById('pwa-install-banner')) return;
  if (isAppInstalled()) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position:fixed;bottom:0;left:0;right:0;
      background:#6b1a1a;color:#fff;
      padding:14px 16px;
      display:flex;align-items:center;gap:12px;
      z-index:9998;
      box-shadow:0 -4px 16px rgba(0,0,0,0.2);
      font-family:var(--font-body,system-ui,sans-serif);
    ">
      <div style="width:38px;height:38px;background:#c8b560;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="font-size:20px;font-weight:700;color:#6b1a1a;font-family:Georgia,serif;">S</span>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:500;">Add STAC Engage to your home screen</div>
        <div style="font-size:12px;opacity:.7;margin-top:1px;">Works offline · No App Store needed</div>
      </div>
      <button onclick="triggerInstall()" style="
        background:#c8b560;color:#6b1a1a;
        border:none;border-radius:8px;
        padding:8px 16px;font-size:13px;font-weight:600;
        cursor:pointer;flex-shrink:0;
        font-family:var(--font-body,system-ui,sans-serif);
      ">Install</button>
      <button onclick="hideInstallBanner()" style="
        background:none;border:none;color:rgba(255,255,255,.6);
        font-size:20px;cursor:pointer;line-height:1;padding:4px;
        flex-shrink:0;
      ">&times;</button>
    </div>`;
  document.body.appendChild(banner);
}

function hideInstallBanner() {
  const b = document.getElementById('pwa-install-banner');
  if (b) b.remove();
  // Don't show again for 7 days
  localStorage.setItem('stac_install_dismissed', Date.now());
}

async function triggerInstall() {
  if (!_deferredInstallPrompt) {
    showIOSInstallGuide();
    return;
  }
  _deferredInstallPrompt.prompt();
  const { outcome } = await _deferredInstallPrompt.userChoice;
  _deferredInstallPrompt = null;
  hideInstallBanner();
  console.log('[PWA] Install outcome:', outcome);
}

/* ---- iOS install guide (Safari doesn't support beforeinstallprompt) ---- */
function showIOSInstallGuide() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!isIOS) return;

  const modal = document.createElement('div');
  modal.id = 'pwa-ios-guide';
  modal.innerHTML = `
    <div style="
      position:fixed;inset:0;background:rgba(0,0,0,.5);
      z-index:9999;display:flex;align-items:flex-end;
      font-family:var(--font-body,system-ui,sans-serif);
    " onclick="this.remove()">
      <div style="
        background:#fff;border-radius:20px 20px 0 0;
        padding:1.5rem;width:100%;
        box-shadow:0 -8px 30px rgba(0,0,0,.15);
      " onclick="event.stopPropagation()">
        <div style="width:40px;height:4px;background:#d0cfc8;border-radius:2px;margin:0 auto 1.25rem;"></div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.25rem;">
          <div style="width:48px;height:48px;background:#6b1a1a;border-radius:12px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:26px;font-weight:700;color:#c8b560;font-family:Georgia,serif;">S</span>
          </div>
          <div>
            <div style="font-size:16px;font-weight:600;color:#1a1a18;">Add STAC Engage to Home Screen</div>
            <div style="font-size:13px;color:#8a8a80;margin-top:2px;">Works offline, feels like a native app</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:1.25rem;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:36px;height:36px;background:#FBE6E6;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="font-size:18px;">⬆️</span>
            </div>
            <div style="font-size:14px;color:#1a1a18;">Tap the <strong>Share</strong> button in Safari's toolbar</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:36px;height:36px;background:#EAF3DE;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="font-size:18px;">➕</span>
            </div>
            <div style="font-size:14px;color:#1a1a18;">Scroll down and tap <strong>Add to Home Screen</strong></div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:36px;height:36px;background:#EEEDFE;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="font-size:18px;">✅</span>
            </div>
            <div style="font-size:14px;color:#1a1a18;">Tap <strong>Add</strong> — STAC Engage appears on your home screen</div>
          </div>
        </div>
        <button onclick="this.closest('#pwa-ios-guide').remove()" style="
          width:100%;height:46px;background:#6b1a1a;color:#fff;
          border:none;border-radius:12px;font-size:15px;font-weight:500;
          cursor:pointer;font-family:var(--font-body,system-ui,sans-serif);
        ">Got it</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

/* ---- Update banner ---- */
function showUpdateBanner() {
  const banner = document.createElement('div');
  banner.id = 'pwa-update-banner';
  banner.innerHTML = `
    <div style="
      position:fixed;top:0;left:0;right:0;
      background:#c8b560;color:#6b1a1a;
      padding:10px 16px;
      display:flex;align-items:center;justify-content:space-between;gap:12px;
      z-index:9999;
      font-family:var(--font-body,system-ui,sans-serif);
      font-size:13px;font-weight:500;
    ">
      <span>A new version of STAC Engage is ready.</span>
      <button onclick="applyUpdate()" style="
        background:#6b1a1a;color:#fff;
        border:none;border-radius:6px;
        padding:6px 14px;font-size:12px;font-weight:600;
        cursor:pointer;font-family:var(--font-body,system-ui,sans-serif);
      ">Update now</button>
    </div>`;
  document.body.appendChild(banner);
}

function applyUpdate() {
  navigator.serviceWorker.ready.then(reg => {
    reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  });
}

/* ---- Push notification permission ---- */
async function requestPushPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/* ---- Expose helper for push subscribe ---- */
async function subscribeToPush() {
  const granted = await requestPushPermission();
  if (!granted) return null;

  const reg = await navigator.serviceWorker.ready;

  // TODO: replace with your VAPID public key from Supabase or a push service
  const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY';

  try {
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    console.log('[PWA] Push subscription:', sub);
    // TODO (Supabase): await db.from('push_subscriptions').upsert({ user_id, subscription: JSON.stringify(sub) });
    return sub;
  } catch(e) {
    console.warn('[PWA] Push subscribe failed:', e);
    return null;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

/* ---- Online/offline indicator ---- */
function updateOnlineStatus() {
  const existing = document.getElementById('offline-banner');
  if (!navigator.onLine) {
    if (!existing) {
      const el = document.createElement('div');
      el.id = 'offline-banner';
      el.style.cssText = `
        position:fixed;top:0;left:0;right:0;
        background:#5a5a52;color:#fff;
        padding:8px 16px;text-align:center;
        font-size:12px;z-index:9997;
        font-family:var(--font-body,system-ui,sans-serif);
      `;
      el.innerHTML = '<i class="ti ti-wifi-off" style="font-size:13px;margin-right:6px;"></i>You\'re offline — using cached data';
      document.body.appendChild(el);
    }
  } else {
    if (existing) existing.remove();
  }
}

window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();
