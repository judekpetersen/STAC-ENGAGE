/* ============================================================
   STAC Engage — Live Data
   All data loaded from Supabase in production.
   Static arrays here are empty — ready for real users.
   ============================================================ */

// ── Events ──────────────────────────────────────────────────
const DATA = {
  events: [],
  badges: [
    { name:'Event Pioneer',  icon:'ti-calendar-event', bg:'#FBE6E6', ic:'#6b1a1a', pts:'150 pts', earned:false },
    { name:'Leader',         icon:'ti-crown',          bg:'#FAEEDA', ic:'#854F0B', pts:'200 pts', earned:false },
    { name:'Servant Heart',  icon:'ti-heart',          bg:'#EAF3DE', ic:'#3B6D11', pts:'120 pts', earned:false },
    { name:'Scholar',        icon:'ti-book',           bg:'#EEEDFE', ic:'#533AB7', pts:'100 pts', earned:false },
    { name:'Connector',      icon:'ti-users',          bg:'#E1F5EE', ic:'#0F6E56', pts:'175 pts', earned:false },
    { name:'Faith & Service',icon:'ti-star',           bg:'#FBEAF0', ic:'#993556', pts:'250 pts', earned:false },
    { name:'100 hrs Club',   icon:'ti-award',          bg:'#F1EFE8', ic:'#5F5E5A', pts:'300 pts', earned:false },
    { name:"Dean's Circle",  icon:'ti-certificate',    bg:'#F1EFE8', ic:'#5F5E5A', pts:'350 pts', earned:false },
    { name:'Diplomat',       icon:'ti-world',          bg:'#F1EFE8', ic:'#5F5E5A', pts:'275 pts', earned:false },
  ],
  pathways: [],
  leaderboard: [],
  transcript: [],
  challenges: [],
  shop: [
    { id:0, name:'Priority room booking',    desc:'Skip the queue on STAC Venues for 1 reservation', cost:200, icon:'ti-building',       bg:'#FBE6E6', ic:'#6b1a1a' },
    { id:1, name:'Dining hall guest pass',   desc:'Bring a guest to the dining hall for free',        cost:150, icon:'ti-utensils',       bg:'#EAF3DE', ic:'#3B6D11' },
    { id:2, name:'Reserved study room',      desc:'2-hr private library room, any day',              cost:100, icon:'ti-book',           bg:'#EEEDFE', ic:'#533AB7' },
    { id:3, name:'Campus store $5 credit',   desc:'Redeemable at the STAC bookstore',                cost:300, icon:'ti-shopping-cart',  bg:'#FAEEDA', ic:'#854F0B' },
    { id:4, name:'Event fee waiver',         desc:'Free admission to one ticketed campus event',     cost:250, icon:'ti-ticket',         bg:'#FBEAF0', ic:'#993556' },
    { id:5, name:"President's coffee chat",  desc:'Exclusive student leadership roundtable invite',   cost:500, icon:'ti-star',           bg:'#E1F5EE', ic:'#0F6E56' },
  ],
  feed: [],
  orgs: [],
  clubs: [],
  notifications: [],
  streakDays: [],
  dayLabels: ['M','T','W','T','F','S','S'],
};

// ── Spartan Spirits ─────────────────────────────────────────
const SPARTAN_SPIRITS = [
  { name:'Service Spartan',     desc:'Volunteering, clubs like Spartans in Service, Paws 4 Change, APO', pct:0, color:'#3B6D11', icon:'ti-heart' },
  { name:'Unstoppable Spartan', desc:'Health, wellness, fitness, and on-the-go dining engagement',       pct:0, color:'#854F0B', icon:'ti-bolt' },
  { name:'Adventurous Spartan', desc:'Off-campus trips and Student Engagement excursions',               pct:0, color:'#6b1a1a', icon:'ti-compass' },
  { name:'Social Spartan',      desc:'Campus events, org meetings, and community building',              pct:0, color:'#993556', icon:'ti-users' },
  { name:'Scholar Spartan',     desc:'Academic services, Career Center, and tutoring engagement',        pct:0, color:'#533AB7', icon:'ti-book' },
];

// ── Ranks ────────────────────────────────────────────────────
const RANKS = [
  { title:'Spartan Recruit',  min:0,    max:199,   color:'#5F5E5A', bg:'#F1EFE8', icon:'ti-shield'  },
  { title:'Spartan Scholar',  min:200,  max:499,   color:'#533AB7', bg:'#EEEDFE', icon:'ti-book'    },
  { title:'Spartan Leader',   min:500,  max:899,   color:'#854F0B', bg:'#FAEEDA', icon:'ti-star'    },
  { title:'Spartan Elite',    min:900,  max:99999, color:'#6b1a1a', bg:'#FBE6E6', icon:'ti-crown'   },
];
function getRank(score) { return RANKS.find(r => score >= r.min && score <= r.max) || RANKS[0]; }

// ── Avatar options ───────────────────────────────────────────
const AVATAR_HELMETS = [
  { id:'maroon',  name:'Maroon',  color:'#6b1a1a', accent:'#c8b560', style:'spartan' },
  { id:'gold',    name:'Gold',    color:'#c8b560', accent:'#6b1a1a', style:'spartan' },
  { id:'navy',    name:'Navy',    color:'#1a3a6b', accent:'#c8b560', style:'spartan' },
  { id:'green',   name:'Green',   color:'#3B6D11', accent:'#EAF3DE', style:'spartan' },
  { id:'silver',  name:'Silver',  color:'#8a8a80', accent:'#f5f4f0', style:'spartan' },
  { id:'black',   name:'Black',   color:'#1a1a18', accent:'#c8b560', style:'spartan' },
  { id:'racing',  name:'Racing',  color:'#6b1a1a', accent:'#c8b560', style:'racing'  },
];
const AVATAR_LOGOS = [
  { id:'none',        name:'No logo',     icon:null },
  { id:'track',       name:'Track & Field',  icon:'ti-run' },
  { id:'basketball',  name:'Basketball',     icon:'ti-basketball' },
  { id:'soccer',      name:'Soccer',         icon:'ti-ball-football' },
  { id:'volleyball',  name:'Volleyball',     icon:'ti-ball-volleyball' },
  { id:'baseball',    name:'Baseball',       icon:'ti-ball-baseball' },
  { id:'hospitality', name:'Hospitality',    icon:'ti-bed' },
  { id:'business',    name:'Business',       icon:'ti-briefcase' },
  { id:'ministry',    name:'Ministry',       icon:'ti-cross' },
];
const userAvatar = { helmet:'maroon', logo:'none' };

// ── Staff contacts ────────────────────────────────────────────
const STAFF_CONTACTS = [
  { name:'Samantha Bazille', role:'Director, Student Engagement',       email:'sbazille@stac.edu', phone:'(845) 398-4173', icon:'ti-user-star', bg:'#FBE6E6', ic:'#6b1a1a' },
  { name:'Paolo Bruzzese',   role:'Associate Director, Campus Life',    email:'pbruzzese@stac.edu', phone:'(845) 398-4173', icon:'ti-user-star', bg:'#FAEEDA', ic:'#854F0B' },
  { name:'Norman Huling',    role:'Events & Venue Coordinator',         email:'nhuling@stac.edu',   phone:'(845) 398-4000', icon:'ti-building',  bg:'#E1F5EE', ic:'#0F6E56' },
];

// ── Dining menu (real, update each semester) ──────────────────
const DINING_MENU = {
  provider: 'Aramark',
  updated: 'Today',
  meals: {
    breakfast: [],
    lunch:     [],
    dinner:    [],
  },
  hours: {
    breakfast: '7:00 – 10:00am',
    lunch:     '11:00am – 2:00pm',
    dinner:    '5:00 – 8:00pm',
  },
};

// ── Officer positions ─────────────────────────────────────────
const OFFICER_POSITIONS = ['President', 'Vice President', 'Secretary', 'Treasurer'];
const STUDENT_POSITIONS = {};
const POSITION_COLORS = {
  'President':      { bg:'#FAEEDA', color:'#854F0B', icon:'ti-crown'     },
  'Vice President': { bg:'#FBE6E6', color:'#6b1a1a', icon:'ti-star'      },
  'Secretary':      { bg:'#EEEDFE', color:'#533AB7', icon:'ti-clipboard' },
  'Treasurer':      { bg:'#EAF3DE', color:'#3B6D11', icon:'ti-coin'      },
};
function isOfficer(studentId) {
  if (!studentId) return false;
  return !!(STUDENT_POSITIONS[studentId] && STUDENT_POSITIONS[studentId].length > 0);
}
const CURRENT_STUDENT_ID = null; // Set from Supabase session

// ── Shop prizes ───────────────────────────────────────────────
const SHOP_PRIZES = [
  { id:10, name:'43" Roku Smart TV',  desc:'Grand prize raffle — drawn end of semester', cost:1000, icon:'ti-device-tv',        bg:'#EEEDFE', ic:'#533AB7', raffle:true },
  { id:11, name:'Nintendo Switch',    desc:'Raffle entry — drawn end of semester',        cost:750,  icon:'ti-device-gamepad-2', bg:'#FBE6E6', ic:'#6b1a1a', raffle:true },
  { id:12, name:'AirPods (3rd gen)',  desc:'Raffle entry — drawn monthly',                cost:400,  icon:'ti-headphones',       bg:'#E1F5EE', ic:'#0F6E56', raffle:true },
  { id:13, name:'Snack pack bundle',  desc:'Variety pack delivered to your mailbox',      cost:75,   icon:'ti-popcorn',          bg:'#FAEEDA', ic:'#854F0B' },
  { id:14, name:'Spartan Grille $10', desc:'Redeemable at the Romano Center grille',      cost:120,  icon:'ti-burger',           bg:'#EAF3DE', ic:'#3B6D11' },
  { id:15, name:'STAC hoodie',        desc:'Maroon & gold, your size, pickup at bookstore', cost:600, icon:'ti-shirt',           bg:'#FBE6E6', ic:'#6b1a1a' },
];

// ── Seasonal badges ───────────────────────────────────────────
const SEASONAL_BADGES = [
  { name:'Fall 2026',   icon:'ti-snowflake', bg:'#F1EFE8', ic:'#5F5E5A', pts:'200 pts', earned:false, season:'Fall 2026'   },
  { name:'Spring 2027', icon:'ti-flower',    bg:'#F1EFE8', ic:'#5F5E5A', pts:'200 pts', earned:false, season:'Spring 2027' },
];

// ── Event requests ────────────────────────────────────────────
const EVENT_REQUESTS = [];
const eventRequestState = {};
const feedbackState = {};
const waitlistState = {};

// ── Marketplace ───────────────────────────────────────────────
const MARKETPLACE_LISTINGS = [];

// ── Meeting minutes ───────────────────────────────────────────
const MEETING_MINUTES = {};

// ── Messages ─────────────────────────────────────────────────
const MESSAGE_THREADS = {};
let messageThreadCtr = 1000;

// ── Sports programs (STAC) ────────────────────────────────────
const SPORTS = {
  mens: [
    { id:'bsb',   name:"Men's Baseball",        icon:'ti-ball-baseball',         color:'#6b1a1a', bg:'#FBE6E6' },
    { id:'mbkb',  name:"Men's Basketball",      icon:'ti-ball-basketball',       color:'#854F0B', bg:'#FAEEDA' },
    { id:'mxc',   name:"Men's Cross Country",   icon:'ti-run',                   color:'#3B6D11', bg:'#EAF3DE' },
    { id:'golf',  name:"Men's Golf",            icon:'ti-golf',                  color:'#0F6E56', bg:'#E1F5EE' },
    { id:'mice',  name:"Men's Ice Hockey",      icon:'ti-snowflake',             color:'#6b1a1a', bg:'#FBE6E6' },
    { id:'mlax',  name:"Men's Lacrosse",        icon:'ti-ball-football',         color:'#993556', bg:'#FBEAF0' },
    { id:'msoc',  name:"Men's Soccer",          icon:'ti-ball-football',         color:'#3B6D11', bg:'#EAF3DE' },
    { id:'spfb',  name:'Sprint Football',       icon:'ti-ball-american-football',color:'#854F0B', bg:'#FAEEDA' },
    { id:'mten',  name:"Men's Tennis",          icon:'ti-ball-tennis',           color:'#533AB7', bg:'#EEEDFE' },
    { id:'mtrk',  name:"Men's Track & Field",   icon:'ti-run',                   color:'#6b1a1a', bg:'#FBE6E6' },
    { id:'mvb',   name:"Men's Volleyball",      icon:'ti-ball-volleyball',       color:'#6b1a1a', bg:'#FBE6E6' },
  ],
  womens: [
    { id:'wbkb',  name:"Women's Basketball",    icon:'ti-ball-basketball',       color:'#993556', bg:'#FBEAF0' },
    { id:'wbowl', name:"Women's Bowling",       icon:'ti-ball-bowling',          color:'#533AB7', bg:'#EEEDFE' },
    { id:'wxc',   name:"Women's Cross Country", icon:'ti-run',                   color:'#3B6D11', bg:'#EAF3DE' },
    { id:'fh',    name:'Field Hockey',          icon:'ti-ball-football',         color:'#854F0B', bg:'#FAEEDA' },
    { id:'ffb',   name:'Flag Football',         icon:'ti-ball-american-football',color:'#6b1a1a', bg:'#FBE6E6' },
    { id:'wlax',  name:"Women's Lacrosse",      icon:'ti-ball-football',         color:'#0F6E56', bg:'#E1F5EE' },
    { id:'wsoc',  name:"Women's Soccer",        icon:'ti-ball-football',         color:'#993556', bg:'#FBEAF0' },
    { id:'sball', name:'Softball',              icon:'ti-ball-baseball',         color:'#854F0B', bg:'#FAEEDA' },
    { id:'wten',  name:"Women's Tennis",        icon:'ti-ball-tennis',           color:'#533AB7', bg:'#EEEDFE' },
    { id:'wtrk',  name:"Women's Track & Field", icon:'ti-run',                   color:'#6b1a1a', bg:'#FBE6E6' },
    { id:'wvb',   name:"Women's Volleyball",    icon:'ti-ball-volleyball',       color:'#3B6D11', bg:'#EAF3DE' },
  ],
  esports: [
    { id:'apex',  name:'Apex Legends',          icon:'ti-device-gamepad-2',      color:'#533AB7', bg:'#EEEDFE' },
    { id:'fort',  name:'Fortnite',              icon:'ti-device-gamepad-2',      color:'#854F0B', bg:'#FAEEDA' },
    { id:'lol',   name:'League of Legends',     icon:'ti-device-gamepad-2',      color:'#0F6E56', bg:'#E1F5EE' },
    { id:'ow2',   name:'Overwatch 2',           icon:'ti-device-gamepad-2',      color:'#6b1a1a', bg:'#FBE6E6' },
    { id:'rl',    name:'Rocket League',         icon:'ti-device-gamepad-2',      color:'#993556', bg:'#FBEAF0' },
    { id:'val',   name:'Valorant',              icon:'ti-device-gamepad-2',      color:'#6b1a1a', bg:'#FBE6E6' },
  ],
};

// ── Athletes roster (blank — populated via admin/Supabase) ────
const ATHLETE_PROFILES = [];

// ── Game announcements (blank — posted by athletics admin) ────
const GAME_ANNOUNCEMENTS = [];

// ── Athletic space IDs ────────────────────────────────────────
const ATHLETIC_SPACE_IDS = [2, 9, 10, 13, 14];

// ── SGA ───────────────────────────────────────────────────────
const SGA_ACCOUNT = { name:'Student Government Assoc.', ini:'SGA', bg:'#EEEDFE', fc:'#26215C' };
const SGA_THREADS = {};

/* ── v17 — Academic calendar (admin-editable) ─────────── */
const ACADEMIC_CALENDAR = [
  // Admins add/edit/remove these via the admin portal
  // { id, title, date, type, color, bg }
];

const ACADEMIC_EVENT_TYPES = [
  { id:'holiday',     label:'Holiday / No class', color:'#993556', bg:'#FBEAF0' },
  { id:'deadline',    label:'Academic deadline',  color:'#854F0B', bg:'#FAEEDA' },
  { id:'exam',        label:'Exam / Finals',      color:'#533AB7', bg:'#EEEDFE' },
  { id:'break',       label:'Break',              color:'#3B6D11', bg:'#EAF3DE' },
  { id:'registration',label:'Registration',       color:'#0F6E56', bg:'#E1F5EE' },
  { id:'other',       label:'Other',              color:'#6b1a1a', bg:'#FBE6E6' },
];
