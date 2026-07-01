/* ============================================================
   STAC Engage — Admin Settings
   ============================================================ */

function renderAdminSettings() {
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Settings</h1>
      <p>Admin portal preferences and configuration</p>
    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-moon"></i>Appearance</div></div>
      <div class="card-body">
        <div class="pref-row">
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text);">Dark mode</div>
            <div style="font-size:11px;color:#8a8a80;">Switch the admin portal to dark theme</div>
          </div>
          <div class="toggle ${getAdminPref('darkMode')?'on':''}" id="admin-toggle-dark" onclick="adminTogglePref('darkMode')" role="switch" aria-checked="${getAdminPref('darkMode')}"></div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-bell"></i>Notifications</div></div>
      <div class="card-body">
        <div class="pref-row">
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text);">RSVP alerts</div>
            <div style="font-size:11px;color:#8a8a80;">Get notified when a student RSVPs to an event</div>
          </div>
          <div class="toggle ${getAdminPref('rsvpAlerts',true)?'on':''}" id="admin-toggle-rsvp" onclick="adminTogglePref('rsvpAlerts')" role="switch"></div>
        </div>
        <div class="pref-row">
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text);">Service hour submissions</div>
            <div style="font-size:11px;color:#8a8a80;">Get notified when a student submits service hours</div>
          </div>
          <div class="toggle ${getAdminPref('serviceAlerts',true)?'on':''}" id="admin-toggle-service" onclick="adminTogglePref('serviceAlerts')" role="switch"></div>
        </div>
        <div class="pref-row">
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text);">Point shop redemptions</div>
            <div style="font-size:11px;color:#8a8a80;">Get notified when a student redeems points</div>
          </div>
          <div class="toggle ${getAdminPref('shopAlerts',true)?'on':''}" id="admin-toggle-shop" onclick="adminTogglePref('shopAlerts')" role="switch"></div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-database"></i>Data</div></div>
      <div class="card-body">
        <div class="pref-row">
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text);">Export student data</div>
            <div style="font-size:11px;color:#8a8a80;">Download all student profiles as CSV</div>
          </div>
          <button class="btn-secondary" style="width:auto;padding:7px 16px;" onclick="exportStudentCSV()">
            <i class="ti ti-download" style="font-size:12px;"></i> Export
          </button>
        </div>
        <div class="pref-row">
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--text);">Export event RSVPs</div>
            <div style="font-size:11px;color:#8a8a80;">Download all RSVP data as CSV</div>
          </div>
          <button class="btn-secondary" style="width:auto;padding:7px 16px;" onclick="exportRSVPCSV()">
            <i class="ti ti-download" style="font-size:12px;"></i> Export
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div class="card-title"><i class="ti ti-info-circle"></i>About</div></div>
      <div class="card-body">
        <div style="font-size:13px;color:var(--text-2);line-height:1.6;">
          <div style="margin-bottom:6px;"><strong>STAC Engage</strong> v1.7.0</div>
          <div style="margin-bottom:6px;">Built by Jude Petersen · Saint Thomas Aquinas College</div>
          <div style="font-size:11px;color:#8a8a80;">Student engagement platform powering co-curricular life at STAC</div>
        </div>
      </div>
    </div>
  </div>`;
}

function getAdminPref(key, defaultVal = false) {
  const prefs = JSON.parse(localStorage.getItem('stac_admin_prefs') || '{}');
  return key in prefs ? prefs[key] : defaultVal;
}

function saveAdminPref(key, val) {
  const prefs = JSON.parse(localStorage.getItem('stac_admin_prefs') || '{}');
  prefs[key] = val;
  localStorage.setItem('stac_admin_prefs', JSON.stringify(prefs));
}

function adminTogglePref(key) {
  const newVal = !getAdminPref(key, true);
  saveAdminPref(key, newVal);
  const togMap = { darkMode:'admin-toggle-dark', rsvpAlerts:'admin-toggle-rsvp', serviceAlerts:'admin-toggle-service', shopAlerts:'admin-toggle-shop' };
  const el = document.getElementById(togMap[key]);
  if (el) { el.classList.toggle('on', newVal); el.setAttribute('aria-checked', newVal); }
  if (key === 'darkMode') {
    document.documentElement.setAttribute('data-theme', newVal ? 'dark' : '');
  }
  showToast('Setting saved.');
}

async function exportStudentCSV() {
  try {
    const { data } = await db.from('profiles').select('first_name,last_name,major,year,score,streak_weeks,role').order('score', { ascending: false });
    if (!data?.length) { showToast('No student data yet.'); return; }
    const header = 'First Name,Last Name,Major,Year,Score,Streak Weeks,Role';
    const rows = data.map(s => `${s.first_name},${s.last_name},${s.major||''},${s.year||''},${s.score||0},${s.streak_weeks||0},${s.role||'student'}`);
    const csv  = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'stac-engage-students.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('Student data exported.');
  } catch(e) { showToast('Export failed — check connection.'); }
}

async function exportRSVPCSV() {
  try {
    const { data } = await db.from('rsvps').select('event_id, user_id, checked_in, events(title,event_date), profiles(first_name,last_name)');
    if (!data?.length) { showToast('No RSVP data yet.'); return; }
    const header = 'Student,Event,Date,Checked In';
    const rows = data.map(r => `${r.profiles?.first_name||''} ${r.profiles?.last_name||''},${r.events?.title||''},${r.events?.event_date||''},${r.checked_in?'Yes':'No'}`);
    const csv  = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'stac-engage-rsvps.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('RSVP data exported.');
  } catch(e) { showToast('Export failed — check connection.'); }
}

// Apply dark mode on load
(function() {
  if (getAdminPref('darkMode')) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
