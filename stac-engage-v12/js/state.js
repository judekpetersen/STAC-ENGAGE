/* ============================================================
   STAC Engage — State (localStorage-backed)
   ============================================================ */

const STATE_KEY = 'stac_engage_state';

const DEFAULT_STATE = {
  user: {
    firstName: 'Jude',
    lastName: 'Murphy',
    initials: 'JM',
    email: 'jmurphy@stac.edu',
    major: 'Hospitality Management',
    year: '2028',
    score: 847,
    streakWeeks: 6,
  },
  rsvp: { 1: true },
  liked: {},
  claimed: {},
  redeemed: {},
  orgJoined: { 0: true, 1: true, 2: true },
  feed: null,
  currentTab: 'dashboard',
};

let _state = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      _state = Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
      if (!_state.feed) _state.feed = JSON.parse(JSON.stringify(DATA.feed));
    } else {
      _state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      _state.feed = JSON.parse(JSON.stringify(DATA.feed));
    }
  } catch(e) {
    _state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    _state.feed = JSON.parse(JSON.stringify(DATA.feed));
  }
}

function saveState() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(_state)); } catch(e) {}
}

function getState() { return _state; }

function setState(key, value) {
  _state[key] = value;
  saveState();
}

function setNested(key, subKey, value) {
  _state[key][subKey] = value;
  saveState();
}

/* ---- User helpers ---- */
function getUser() { return _state.user; }

function getUserInitials() {
  const u = _state.user;
  return (u.firstName[0] + u.lastName[0]).toUpperCase();
}

/* ---- RSVP ---- */
function toggleRSVP(id) {
  _state.rsvp[id] = !_state.rsvp[id];
  saveState();
  return _state.rsvp[id];
}
function isRSVP(id) { return !!_state.rsvp[id]; }

/* ---- Likes ---- */
function toggleLike(id) {
  _state.liked[id] = !_state.liked[id];
  const item = _state.feed.find(f => f.id === id);
  if (item) item.likes += _state.liked[id] ? 1 : -1;
  saveState();
  return _state.liked[id];
}
function isLiked(id) { return !!_state.liked[id]; }

/* ---- Challenges ---- */
function claimChallenge(id) {
  _state.claimed[id] = true;
  _state.user.score += 75;
  saveState();
}
function isClaimed(id) { return !!_state.claimed[id]; }

/* ---- Shop ---- */
function redeemItem(id) {
  _state.redeemed[id] = true;
  saveState();
}
function isRedeemed(id) { return !!_state.redeemed[id]; }

/* ---- Orgs ---- */
function toggleOrg(id) {
  _state.orgJoined[id] = !_state.orgJoined[id];
  saveState();
  return _state.orgJoined[id];
}
function isOrgJoined(id) { return !!_state.orgJoined[id]; }

/* ---- Feed ---- */
let _feedIdCtr = 1000;
function addPost(text) {
  const u = getUser();
  const post = {
    id: _feedIdCtr++,
    initials: getUserInitials(),
    name: u.firstName + ' ' + u.lastName[0] + '.',
    bg: '#EAF3DE',
    fc: '#173404',
    text: text,
    time: 'Just now',
    likes: 0,
    you: true,
  };
  _state.feed.unshift(post);
  _state.liked[post.id] = false;
  saveState();
  return post;
}

/* ---- Score display ---- */
function updateScoreDisplay() {
  const el = document.getElementById('score-display');
  if (el) el.textContent = _state.user.score;
}
