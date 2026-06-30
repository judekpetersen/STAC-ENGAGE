/* ============================================================
   STAC Engage — Auth (Supabase live)
   ============================================================ */

const INTERESTS = [
  { label:'Business & leadership', icon:'ti-briefcase' },
  { label:'Faith & ministry',      icon:'ti-building-church' },
  { label:'Athletics & fitness',   icon:'ti-run' },
  { label:'Hospitality & events',  icon:'ti-building' },
  { label:'Community service',     icon:'ti-heart' },
  { label:'Arts & culture',        icon:'ti-palette' },
  { label:'Academic & research',   icon:'ti-book' },
  { label:'Student government',    icon:'ti-star' },
];

let selectedInterests = new Set();

function showView(id) {
  document.querySelectorAll('#view-login,#view-signup,#view-onboard').forEach(el => el.style.display='none');
  document.getElementById(id).style.display = 'block';
}

function showAuthError(msg) {
  let el = document.getElementById('auth-error');
  if (!el) {
    el = document.createElement('div');
    el.id = 'auth-error';
    el.style.cssText = 'background:#FBE6E6;color:#6b1a1a;padding:10px 14px;border-radius:8px;font-size:13px;margin-top:10px;text-align:center;';
    const form = document.getElementById('view-login');
    if (form) form.appendChild(el);
  }
  el.textContent = msg;
  setTimeout(() => { if (el.parentNode) el.remove(); }, 4000);
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email || !pass) { showAuthError('Please enter your email and password.'); return; }
  if (!email.endsWith('@stac.edu')) { showAuthError('Please use your STAC email (@stac.edu).'); return; }

  const btn = document.querySelector('#view-login .btn-primary:last-of-type');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader"></i> Signing in...'; }

  try {
    const { data, error } = await db.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;

    const profile = await fetchProfile(data.user.id);
    localStorage.setItem('stac_engage_user', JSON.stringify({
      id:          data.user.id,
      firstName:   profile.first_name,
      lastName:    profile.last_name,
      email:       data.user.email,
      major:       profile.major,
      year:        profile.year,
      score:       profile.score,
      streakWeeks: profile.streak_weeks,
    }));
    window.location.href = 'app.html';
  } catch(err) {
    if (btn) { btn.disabled = false; btn.innerHTML = 'Sign in <i class="ti ti-arrow-right"></i>'; }
    const msg = err?.message || 'Sign in failed';
    showAuthError(msg.includes('Invalid') ? 'Incorrect email or password.' : msg);
  }
}

async function doSAMLLogin() {
  showAuthError('SSO not configured yet — please use email sign in below.');
}

async function doSignup() {
  const first = document.getElementById('su-first').value.trim();
  const last  = document.getElementById('su-last').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const major = document.getElementById('su-major').value.trim();
  const year  = document.getElementById('su-year').value;
  const pass  = document.getElementById('su-pass').value;

  if (!first || !last || !email || !pass) { alert('Please fill in all required fields.'); return; }
  if (!email.endsWith('@stac.edu')) { alert('Please use your STAC email (@stac.edu).'); return; }
  if (pass.length < 6) { alert('Password must be at least 6 characters.'); return; }

  const btn = document.querySelector('#view-signup .btn-primary');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-loader"></i> Creating account...'; }

  try {
    const { data, error } = await db.auth.signUp({
      email,
      password: pass,
      options: {
        data: { first_name: first, last_name: last, major, year },
        emailRedirectTo: window.location.origin + window.location.pathname.replace('index.html','') + 'app.html',
      }
    });
    if (error) throw error;

    localStorage.setItem('stac_engage_user', JSON.stringify({
      id: data.user.id, firstName: first, lastName: last,
      email, major, year, score: 0, streakWeeks: 0,
    }));

    const av = document.getElementById('ob-avatar');
    const nm = document.getElementById('ob-name');
    if (av) av.textContent = (first[0] + last[0]).toUpperCase();
    if (nm) nm.textContent = 'Welcome, ' + first + '!';
    buildInterestGrid();
    showView('view-onboard');
  } catch(err) {
    if (btn) { btn.disabled = false; btn.innerHTML = 'Create account <i class="ti ti-arrow-right"></i>'; }
    const msg = err?.message || err?.error_description || 'Sign up failed';
    console.error('Signup error:', err);
    alert(msg.includes('already') ? 'An account with this email already exists. Please sign in.' : msg);
  }
}

function buildInterestGrid() {
  const grid = document.getElementById('interest-grid');
  if (!grid) return;
  grid.innerHTML = INTERESTS.map(item => `
    <div class="interest-chip" onclick="toggleInterest(this,'${item.label}')" role="button" tabindex="0">
      <i class="ti ${item.icon}" aria-hidden="true"></i>${item.label}
    </div>`).join('');
}

function toggleInterest(el, label) {
  if (selectedInterests.has(label)) { selectedInterests.delete(label); el.classList.remove('selected'); }
  else { selectedInterests.add(label); el.classList.add('selected'); }
}

async function finishOnboard() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (user.id) {
    try { await upsertProfile(user.id, { interests: Array.from(selectedInterests) }); }
    catch(e) { console.warn('Could not save interests:', e); }
  }
  window.location.href = 'app.html';
}

async function getSession() {
  const { data: { session } } = await db.auth.getSession();
  return session;
}

function signOut() {
  if (!confirm('Are you sure you want to sign out?')) return;
  db.auth.signOut();
  localStorage.removeItem('stac_engage_user');
  localStorage.removeItem('stac_engage_state');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', async function() {
  // Don't auto-redirect if user just signed out
  const justSignedOut = sessionStorage.getItem('signed_out');
  if (justSignedOut) {
    sessionStorage.removeItem('signed_out');
    return;
  }

  // If already logged in via Supabase, go straight to app
  try {
    const { data: { session } } = await db.auth.getSession();
    if (session && localStorage.getItem('stac_engage_user')) {
      window.location.href = 'app.html';
      return;
    }
  } catch(e) {}

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const v = document.getElementById('view-login');
      if (v && v.style.display !== 'none') doLogin();
    }
  });
});
