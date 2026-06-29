/* ============================================================
   STAC Engage — Portal passcode auth (sandbox only)
   Replace with Supabase SSO before production
   ============================================================ */

const PORTAL_CODES = {
  admin:     '12345',
  athletics: '11111',
  sga:       '22222',
};

// Stores the init callback so we can call it after correct code entry
const PORTAL_CALLBACKS = {};

function requirePortalAuth(portal, initCallback) {
  const key = 'stac_portal_' + portal;

  // Already authenticated this session
  if (sessionStorage.getItem(key) === 'true') return true;

  // Store callback to fire after successful code entry
  if (initCallback) PORTAL_CALLBACKS[portal] = initCallback;

  // Build lock screen
  const modal = document.createElement('div');
  modal.id = 'portal-lock-' + portal;
  modal.style.cssText = [
    'position:fixed;inset:0;z-index:9999;',
    'background:linear-gradient(135deg,#500f0f 0%,#6b1a1a 60%,#8a2020 100%);',
    'display:flex;align-items:center;justify-content:center;',
    'font-family:DM Sans,sans-serif;',
  ].join('');

  const portalNames = { admin:'Admin Portal', athletics:'Athletics Admin', sga:'SGA Portal' };

  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px;padding:2.5rem 2rem;width:340px;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,0.4);">
      <div style="width:56px;height:56px;border-radius:50%;background:#FBE6E6;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;auto;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6b1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#c8b560;margin-bottom:6px;">STAC Engage</div>
      <div style="font-size:20px;font-weight:600;color:#1a1a18;margin-bottom:4px;">${portalNames[portal]}</div>
      <div style="font-size:13px;color:#8a8a80;margin-bottom:1.75rem;">Enter your 5-digit access code</div>
      <input id="portal-code-input-${portal}"
        type="password"
        inputmode="numeric"
        maxlength="5"
        autocomplete="off"
        style="width:100%;padding:14px;border:2px solid #e8e6e0;border-radius:12px;font-size:28px;text-align:center;letter-spacing:10px;outline:none;font-family:monospace;box-sizing:border-box;transition:border-color .2s;"
        placeholder="·····"
        oninput="this.value=this.value.replace(/[^0-9]/g,'');if(this.value.length===5)checkPortalCode('${portal}')"
        onkeydown="if(event.key==='Enter')checkPortalCode('${portal}')"
        onfocus="this.style.borderColor='#6b1a1a'"
        onblur="this.style.borderColor='#e8e6e0'">
      <div id="portal-code-error-${portal}" style="color:#993556;font-size:12px;margin-top:10px;min-height:18px;"></div>
      <button onclick="checkPortalCode('${portal}')"
        style="width:100%;margin-top:1rem;padding:13px;background:#6b1a1a;color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:500;cursor:pointer;font-family:DM Sans,sans-serif;letter-spacing:.01em;transition:background .15s;"
        onmouseover="this.style.background='#500f0f'"
        onmouseout="this.style.background='#6b1a1a'">
        Enter portal
      </button>
      <a href="index.html" style="display:block;margin-top:1rem;font-size:12px;color:#8a8a80;text-decoration:none;">← Back to student login</a>
    </div>`;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Auto-focus the input
  setTimeout(() => {
    const inp = document.getElementById('portal-code-input-' + portal);
    if (inp) inp.focus();
  }, 100);

  return false; // Block init until code entered
}

function checkPortalCode(portal) {
  const input = document.getElementById('portal-code-input-' + portal);
  const error = document.getElementById('portal-code-error-' + portal);
  const val   = input ? input.value.trim() : '';

  if (val === PORTAL_CODES[portal]) {
    // Correct — mark authenticated for this session
    sessionStorage.setItem('stac_portal_' + portal, 'true');

    // Remove lock screen
    const modal = document.getElementById('portal-lock-' + portal);
    if (modal) modal.remove();
    document.body.style.overflow = '';

    // Fire the stored init callback
    if (PORTAL_CALLBACKS[portal]) {
      PORTAL_CALLBACKS[portal]();
    }
  } else {
    if (error) {
      error.textContent = 'Incorrect code — try again';
      setTimeout(() => { if (error) error.textContent = ''; }, 2500);
    }
    if (input) {
      input.value = '';
      input.style.borderColor = '#993556';
      setTimeout(() => { input.style.borderColor = '#e8e6e0'; input.focus(); }, 600);
    }
  }
}
