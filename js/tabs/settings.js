/* ============================================================
   STAC Engage v17 — Settings Tab
   Dark mode, language, reminders, accessibility, Eventbrite
   ============================================================ */

function renderSettings() {
  const prefs = getPrefs();
  return `<div class="page-animate">
    <div class="page-head"><h1>Settings</h1><p>Customize your STAC Engage experience</p></div>

    <!-- Appearance -->
    <div class="card settings-section">
      <div class="card-head"><div class="card-title"><i class="ti ti-palette"></i>Appearance</div></div>
      <div class="settings-row">
        <div><div class="settings-label">Dark mode</div><div class="settings-sub">Easier on the eyes at night</div></div>
        <div class="toggle-wrap">
          <div class="toggle ${prefs.darkMode?'on':''}" id="toggle-dark" onclick="toggleDarkMode()" role="switch" aria-checked="${prefs.darkMode}" aria-label="Toggle dark mode"></div>
        </div>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Reduce motion</div><div class="settings-sub">Turn off animations</div></div>
        <div class="toggle-wrap">
          <div class="toggle ${prefs.reduceMotion?'on':''}" id="toggle-motion" onclick="toggleReduceMotion()" role="switch" aria-checked="${prefs.reduceMotion}" aria-label="Toggle reduce motion"></div>
        </div>
      </div>
    </div>

    <!-- Language -->
    <div class="card settings-section">
      <div class="card-head"><div class="card-title"><i class="ti ti-language"></i>Language</div></div>
      <div class="settings-row">
        <div><div class="settings-label">Translate page</div><div class="settings-sub">Opens Google Translate for the current page</div></div>
        <button class="tbtn" onclick="openTranslate()" aria-label="Open Google Translate">
          <i class="ti ti-world" style="font-size:13px;"></i> Translate
        </button>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Español</div><div class="settings-sub">Abrir en español</div></div>
        <button class="tbtn" onclick="openSpanish()" aria-label="Open in Spanish">
          <i class="ti ti-world" style="font-size:13px;"></i> Abrir
        </button>
      </div>
    </div>

    <!-- Event reminders -->
    <div class="card settings-section">
      <div class="card-head"><div class="card-title"><i class="ti ti-bell"></i>Event reminders</div></div>
      <div class="settings-row">
        <div><div class="settings-label">Push notifications</div><div class="settings-sub">Allow reminders for RSVPd events</div></div>
        <div class="toggle-wrap">
          <div class="toggle ${prefs.notifications?'on':''}" id="toggle-notif" onclick="toggleNotifications()" role="switch" aria-checked="${prefs.notifications}" aria-label="Toggle notifications"></div>
        </div>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Reminder timing</div><div class="settings-sub">How early to send event reminders</div></div>
        <select onchange="setReminderTiming(this.value)" style="border:1px solid var(--border-md);border-radius:var(--radius);padding:6px 10px;font-size:13px;background:var(--surface);color:var(--text);font-family:var(--font-body);" aria-label="Reminder timing">
          <option value="15"  ${prefs.reminderMins===15 ?'selected':''}>15 minutes before</option>
          <option value="30"  ${prefs.reminderMins===30 ?'selected':''}>30 minutes before</option>
          <option value="60"  ${prefs.reminderMins===60 ?'selected':''}>1 hour before</option>
          <option value="120" ${prefs.reminderMins===120?'selected':''}>2 hours before</option>
          <option value="1440"${prefs.reminderMins===1440?'selected':''}>Day before</option>
        </select>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Game day alerts</div><div class="settings-sub">Notify me about Spartan game days</div></div>
        <div class="toggle-wrap">
          <div class="toggle ${prefs.gameAlerts?'on':''}" id="toggle-game" onclick="toggleGameAlerts()" role="switch" aria-checked="${prefs.gameAlerts}" aria-label="Toggle game alerts"></div>
        </div>
      </div>
    </div>

    <!-- Accessibility -->
    <div class="card settings-section">
      <div class="card-head"><div class="card-title"><i class="ti ti-accessibility"></i>Accessibility</div></div>
      <div class="settings-row">
        <div><div class="settings-label">Large text</div><div class="settings-sub">Increase font size throughout the app</div></div>
        <div class="toggle-wrap">
          <div class="toggle ${prefs.largeText?'on':''}" id="toggle-text" onclick="toggleLargeText()" role="switch" aria-checked="${prefs.largeText}" aria-label="Toggle large text"></div>
        </div>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">High contrast</div><div class="settings-sub">Stronger borders and text contrast</div></div>
        <div class="toggle-wrap">
          <div class="toggle ${prefs.highContrast?'on':''}" id="toggle-contrast" onclick="toggleHighContrast()" role="switch" aria-checked="${prefs.highContrast}" aria-label="Toggle high contrast"></div>
        </div>
      </div>
    </div>

    <!-- About -->
    <div class="card settings-section">
      <div class="card-head"><div class="card-title"><i class="ti ti-info-circle"></i>About</div></div>
      <div class="settings-row">
        <div><div class="settings-label">STAC Engage</div><div class="settings-sub">Version 1.0 · Saint Thomas Aquinas College</div></div>
      </div>
      <div class="settings-row">
        <div><div class="settings-label">Sign out</div><div class="settings-sub">You'll need to sign in again</div></div>
        <button class="tbtn" style="color:#993556;border-color:#993556;" onclick="signOut()" aria-label="Sign out">Sign out</button>
      </div>
    </div>
  </div>`;
}

/* ── Preferences stored in localStorage ── */
const PREFS_KEY = 'stac_engage_prefs';
function getPrefs() {
  try { return Object.assign({ darkMode:false, reduceMotion:false, notifications:false, reminderMins:60, gameAlerts:false, largeText:false, highContrast:false }, JSON.parse(localStorage.getItem(PREFS_KEY)||'{}') ); }
  catch(e) { return { darkMode:false, reduceMotion:false, notifications:false, reminderMins:60, gameAlerts:false, largeText:false, highContrast:false }; }
}
function savePrefs(prefs) { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); }

function applyPrefs() {
  const p = getPrefs();
  document.documentElement.setAttribute('data-theme', p.darkMode ? 'dark' : '');
  document.body.classList.toggle('large-text',     !!p.largeText);
  document.body.classList.toggle('high-contrast',  !!p.highContrast);
  document.body.classList.toggle('reduce-motion',  !!p.reduceMotion);
}

function toggleDarkMode() {
  const p = getPrefs(); p.darkMode = !p.darkMode; savePrefs(p); applyPrefs();
  const t = document.getElementById('toggle-dark');
  if (t) { t.classList.toggle('on', p.darkMode); t.setAttribute('aria-checked', p.darkMode); }
  showToast(p.darkMode ? 'Dark mode on' : 'Dark mode off');
}
function toggleReduceMotion() {
  const p = getPrefs(); p.reduceMotion = !p.reduceMotion; savePrefs(p); applyPrefs();
  const t = document.getElementById('toggle-motion');
  if (t) { t.classList.toggle('on', p.reduceMotion); t.setAttribute('aria-checked', p.reduceMotion); }
}
function toggleLargeText() {
  const p = getPrefs(); p.largeText = !p.largeText; savePrefs(p); applyPrefs();
  const t = document.getElementById('toggle-text');
  if (t) { t.classList.toggle('on', p.largeText); t.setAttribute('aria-checked', p.largeText); }
}
function toggleHighContrast() {
  const p = getPrefs(); p.highContrast = !p.highContrast; savePrefs(p); applyPrefs();
  const t = document.getElementById('toggle-contrast');
  if (t) { t.classList.toggle('on', p.highContrast); t.setAttribute('aria-checked', p.highContrast); }
}
function toggleNotifications() {
  const p = getPrefs();
  if (!p.notifications) {
    if ('Notification' in window) {
      Notification.requestPermission().then(result => {
        p.notifications = result === 'granted';
        savePrefs(p);
        const t = document.getElementById('toggle-notif');
        if (t) { t.classList.toggle('on', p.notifications); t.setAttribute('aria-checked', p.notifications); }
        showToast(p.notifications ? 'Notifications enabled' : 'Notifications blocked — check your browser settings');
      });
    }
  } else {
    p.notifications = false; savePrefs(p);
    const t = document.getElementById('toggle-notif');
    if (t) { t.classList.toggle('on', false); t.setAttribute('aria-checked', false); }
    showToast('Notifications disabled');
  }
}
function toggleGameAlerts() {
  const p = getPrefs(); p.gameAlerts = !p.gameAlerts; savePrefs(p);
  const t = document.getElementById('toggle-game');
  if (t) { t.classList.toggle('on', p.gameAlerts); t.setAttribute('aria-checked', p.gameAlerts); }
  showToast(p.gameAlerts ? 'Game day alerts on' : 'Game day alerts off');
}
function setReminderTiming(val) {
  const p = getPrefs(); p.reminderMins = parseInt(val); savePrefs(p);
  showToast('Reminder timing saved');
}
function openTranslate() {
  // Show language picker modal with Google Translate widget
  if (document.getElementById('translate-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'translate-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeTranslateModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:360px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;"><i class="ti ti-language"></i> Translate page</div>
          <button onclick="closeTranslateModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13px;color:#8a8a80;margin-bottom:1rem;">Select a language to translate the entire app:</p>
          <div id="google_translate_element" style="margin-bottom:1rem;"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${[['es','🇪🇸 Spanish'],['zh-CN','🇨🇳 Chinese'],['ht','🇭🇹 Haitian Creole'],['ar','🇸🇦 Arabic'],['fr','🇫🇷 French'],['pt','🇧🇷 Portuguese'],['ko','🇰🇷 Korean'],['ru','🇷🇺 Russian']].map(([code, label]) =>
              `<button onclick="translateTo('${code}')" style="padding:10px;border:1px solid var(--border-md);border-radius:var(--radius);background:var(--surface);font-size:13px;cursor:pointer;text-align:left;color:var(--text);">${label}</button>`
            ).join('')}
          </div>
          <button onclick="translateTo('')" style="width:100%;margin-top:10px;padding:9px;border:1px solid var(--border-md);border-radius:var(--radius);background:none;font-size:13px;cursor:pointer;color:#993556;">Reset to English</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  loadGoogleTranslate();
}

function openSpanish() {
  loadGoogleTranslate();
  setTimeout(() => translateTo('es'), 800);
  showToast('Switching to Spanish...');
}

function loadGoogleTranslate() {
  if (window.google?.translate) return;
  if (document.getElementById('gt-script')) return;
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement(
      { pageLanguage: 'en', autoDisplay: false },
      'google_translate_element'
    );
  };
  const s = document.createElement('script');
  s.id  = 'gt-script';
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(s);
}

function translateTo(langCode) {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change'));
    closeTranslateModal();
    showToast(langCode ? 'Page translated.' : 'Reset to English.');
  } else {
    // Widget not ready yet — try after short delay
    setTimeout(() => {
      const s2 = document.querySelector('.goog-te-combo');
      if (s2) { s2.value = langCode; s2.dispatchEvent(new Event('change')); }
      closeTranslateModal();
    }, 1000);
  }
}

function closeTranslateModal() {
  const m = document.getElementById('translate-modal');
  if (m) m.remove();
}
async function signOut() {
  if (!confirm('Are you sure you want to sign out?')) return;
  localStorage.removeItem('stac_engage_user');
  localStorage.removeItem('stac_engage_state');
  // Set flag so login page doesn't auto-redirect
  sessionStorage.setItem('signed_out', 'true');
  try {
    if (typeof db !== 'undefined') await db.auth.signOut();
  } catch(e) {}
  window.location.href = 'index.html';
}
