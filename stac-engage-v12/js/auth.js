/* ============================================================
   STAC Engage — Auth (localStorage-based, Supabase-ready)
   ============================================================ */

const INTERESTS = [
  { label:'Business & leadership', icon:'ti-briefcase' },
  { label:'Faith & ministry', icon:'ti-building-church' },
  { label:'Athletics & fitness', icon:'ti-run' },
  { label:'Hospitality & events', icon:'ti-building' },
  { label:'Community service', icon:'ti-heart' },
  { label:'Arts & culture', icon:'ti-palette' },
  { label:'Academic & research', icon:'ti-book' },
  { label:'Student government', icon:'ti-star' },
];

let selectedInterests = new Set();

function showView(id) {
  document.querySelectorAll('#view-login,#view-signup,#view-onboard').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;

  if (!email || !pass) {
    alert('Please enter your email and password.');
    return;
  }

  // TODO: Replace with Supabase auth
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

  // Demo: load saved user or use defaults
  try {
    const saved = JSON.parse(localStorage.getItem('stac_engage_user') || 'null');
    if (saved) {
      window.location.href = 'app.html';
      return;
    }
  } catch(e) {}

  // Demo login — any @stac.edu email works
  if (email.endsWith('@stac.edu') || email.includes('@')) {
    const parts = email.split('@')[0].split('.');
    const firstName = parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) : 'Student';
    const lastName = parts[1] ? parts[1][0].toUpperCase() + parts[1].slice(1) : 'User';
    localStorage.setItem('stac_engage_user', JSON.stringify({ firstName, lastName, email }));
    window.location.href = 'app.html';
  } else {
    alert('Please use your STAC email address (@stac.edu).');
  }
}

function doSignup() {
  const first = document.getElementById('su-first').value.trim();
  const last = document.getElementById('su-last').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const major = document.getElementById('su-major').value;
  const year = document.getElementById('su-year').value;
  const pass = document.getElementById('su-pass').value;

  if (!first || !last || !email || !major || !pass) {
    alert('Please fill in all fields.');
    return;
  }
  if (pass.length < 8) {
    alert('Password must be at least 8 characters.');
    return;
  }

  // TODO: Replace with Supabase auth
  // const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { data: { first_name: first, last_name: last, major, year } } });

  localStorage.setItem('stac_engage_user', JSON.stringify({ firstName: first, lastName: last, email, major, year }));

  // Show onboarding
  const av = document.getElementById('ob-avatar');
  const nm = document.getElementById('ob-name');
  if (av) av.textContent = (first[0] + last[0]).toUpperCase();
  if (nm) nm.textContent = 'Welcome, ' + first + '!';
  buildInterestGrid();
  showView('view-onboard');
}

function buildInterestGrid() {
  const grid = document.getElementById('interest-grid');
  if (!grid) return;
  grid.innerHTML = INTERESTS.map(item => `
    <div class="interest-chip" onclick="toggleInterest(this, '${item.label}')">
      <i class="ti ${item.icon}"></i>
      ${item.label}
    </div>`).join('');
}

function toggleInterest(el, label) {
  if (selectedInterests.has(label)) {
    selectedInterests.delete(label);
    el.classList.remove('selected');
  } else {
    selectedInterests.add(label);
    el.classList.add('selected');
  }
}

function finishOnboard() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  user.interests = Array.from(selectedInterests);
  localStorage.setItem('stac_engage_user', JSON.stringify(user));

  // TODO: Supabase — save interests to user profile table
  window.location.href = 'app.html';
}

/* ============================================================
   SUPABASE INTEGRATION GUIDE
   ============================================================
   When you're ready to wire up real auth:

   1. Install Supabase:
      npm install @supabase/supabase-js
      or use CDN: https://cdn.jsdelivr.net/npm/@supabase/supabase-js

   2. Initialize:
      const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_ANON_KEY');

   3. Replace doLogin():
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password: pass
      });
      if (error) alert(error.message);
      else window.location.href = 'app.html';

   4. Replace doSignup():
      const { data, error } = await supabase.auth.signUp({
        email, password: pass,
        options: { data: { first_name: first, last_name: last, major, year } }
      });

   5. Check session on app.html load:
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) window.location.href = 'index.html';

   Tables you'll need in Supabase:
   - profiles (id, first_name, last_name, major, year, score, streak_weeks)
   - events (id, name, date, type, location, points)
   - rsvps (user_id, event_id)
   - activity_feed (id, user_id, text, created_at, likes)
   - org_memberships (user_id, org_id)
   - challenge_claims (user_id, challenge_id, claimed_at)
   - redemptions (user_id, shop_item_id, redeemed_at)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Allow enter key on login form
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const view = document.getElementById('view-login');
      if (view && view.style.display !== 'none') doLogin();
    }
  });
});
