/* ============================================================
   STAC Engage — Data
   ============================================================ */

const DATA = {
  events: [
    { id:1, name:'Business Club Networking Night', month:'JUN', day:10, type:'Club', tc:'#FBE6E6', bc:'#6b1a1a', loc:'Sullivan Hall', pts:50, rsvp:true },
    { id:2, name:'Hospitality Career Panel', month:'JUN', day:13, type:'Career', tc:'#FAEEDA', bc:'#854F0B', loc:'Borelli Hall 201', pts:75, rsvp:false },
    { id:3, name:'Campus Ministry Retreat', month:'JUN', day:15, type:'Service', tc:'#EAF3DE', bc:'#3B6D11', loc:'Chapel & Grounds', pts:60, rsvp:false },
    { id:4, name:'Track & Field Alumni Meet', month:'JUN', day:18, type:'Athletics', tc:'#FBEAF0', bc:'#993556', loc:'Athletic Complex', pts:40, rsvp:false },
    { id:5, name:"Dean's Roundtable: Student Voice", month:'JUN', day:21, type:'Academic', tc:'#EEEDFE', bc:'#533AB7', loc:"President's Office", pts:80, rsvp:false },
  ],

  badges: [
    { name:'Event Pioneer', icon:'ti-calendar-event', bg:'#FBE6E6', ic:'#6b1a1a', pts:'150 pts', earned:true },
    { name:'Leader', icon:'ti-crown', bg:'#FAEEDA', ic:'#854F0B', pts:'200 pts', earned:true },
    { name:'Servant Heart', icon:'ti-heart', bg:'#EAF3DE', ic:'#3B6D11', pts:'120 pts', earned:true },
    { name:'Scholar', icon:'ti-book', bg:'#EEEDFE', ic:'#533AB7', pts:'100 pts', earned:true },
    { name:'Connector', icon:'ti-users', bg:'#E1F5EE', ic:'#0F6E56', pts:'175 pts', earned:true },
    { name:'Faith & Service', icon:'ti-star', bg:'#FBEAF0', ic:'#993556', pts:'250 pts', earned:true },
    { name:'100 hrs Club', icon:'ti-award', bg:'#F1EFE8', ic:'#5F5E5A', pts:'300 pts', earned:false },
    { name:"Dean's Circle", icon:'ti-certificate', bg:'#F1EFE8', ic:'#5F5E5A', pts:'350 pts', earned:false },
    { name:'Diplomat', icon:'ti-world', bg:'#F1EFE8', ic:'#5F5E5A', pts:'275 pts', earned:false },
  ],

  pathways: [
    { name:'Leadership & Civic Engagement', pct:72, color:'#6b1a1a' },
    { name:'Career & Professional Readiness', pct:61, color:'#c8b560' },
    { name:'Community & Faith Service', pct:85, color:'#3B6D11' },
    { name:'Wellness & Athletics', pct:90, color:'#854F0B' },
    { name:'Academic Excellence', pct:55, color:'#533AB7' },
  ],

  leaderboard: [
    { rank:1, initials:'SR', name:'Sofia R.', pts:1204, bg:'#FAEEDA', fc:'#412402' },
    { rank:2, initials:'MK', name:'Marcus K.', pts:1158, bg:'#EEEDFE', fc:'#26215C' },
    { rank:3, initials:'AT', name:'Aisha T.', pts:1092, bg:'#E1F5EE', fc:'#04342C' },
    { rank:4, initials:'JM', name:'Jude M.', pts:847, bg:'#EAF3DE', fc:'#173404', you:true },
    { rank:5, initials:'CL', name:'Chloe L.', pts:801, bg:'#FBE6E6', fc:'#530404' },
    { rank:6, initials:'DR', name:'Daniel R.', pts:754, bg:'#FBEAF0', fc:'#4B1528' },
  ],

  transcript: [
    { name:'Business Club VP', type:'Leadership', icon:'ti-briefcase', bg:'#FBE6E6', ic:'#6b1a1a', date:'Fall 2025–Present', pts:200 },
    { name:'Hotel Hershey — The Circular', type:'Professional Experience', icon:'ti-building', bg:'#FAEEDA', ic:'#854F0B', date:'Summer 2025', pts:150 },
    { name:'STAC Venues Project Lead', type:'Campus Initiative', icon:'ti-tool', bg:'#EAF3DE', ic:'#3B6D11', date:'Fall 2025–Present', pts:175 },
    { name:'Campus Ministry Volunteer', type:'Service', icon:'ti-heart', bg:'#FBEAF0', ic:'#993556', date:'Ongoing', pts:120 },
    { name:"Dean's Student Representative", type:'Civic Engagement', icon:'ti-star', bg:'#EEEDFE', ic:'#533AB7', date:'Spring 2026', pts:100 },
    { name:'Track & Field — 400m / Hurdles', type:'Athletics', icon:'ti-run', bg:'#E1F5EE', ic:'#0F6E56', date:'2023–Present', pts:80 },
  ],

  challenges: [
    { id:0, name:'Attend 3 events this week', meta:'2 of 3 done', pct:66, pts:'+50', ic:'#6b1a1a', bg:'#FBE6E6', icon:'ti-calendar-event', state:'progress' },
    { id:1, name:'Log 4 service hours', meta:'4 of 4 done', pct:100, pts:'+75', ic:'#3B6D11', bg:'#EAF3DE', icon:'ti-heart', state:'claim' },
    { id:2, name:'Join a new student org', meta:'Completed', pct:100, pts:'+40', ic:'#533AB7', bg:'#EEEDFE', icon:'ti-users', state:'done' },
    { id:3, name:'Attend a career event', meta:'Not started', pct:0, pts:'+60', ic:'#854F0B', bg:'#FAEEDA', icon:'ti-briefcase', state:'locked' },
    { id:4, name:'Send 2 peer shoutouts', meta:'1 of 2 done', pct:50, pts:'+30', ic:'#993556', bg:'#FBEAF0', icon:'ti-megaphone', state:'progress' },
    { id:5, name:'8-week streak bonus', meta:'6 of 8 weeks', pct:75, pts:'+100', ic:'#0F6E56', bg:'#E1F5EE', icon:'ti-flame', state:'progress' },
  ],

  shop: [
    { id:0, name:'Priority room booking', desc:'Skip the queue on STAC Venues for 1 reservation', cost:200, icon:'ti-building', bg:'#FBE6E6', ic:'#6b1a1a' },
    { id:1, name:'Dining hall guest pass', desc:'Bring a guest to the dining hall for free', cost:150, icon:'ti-utensils', bg:'#EAF3DE', ic:'#3B6D11' },
    { id:2, name:'Reserved study room', desc:'2-hr private library room, any day', cost:100, icon:'ti-book', bg:'#EEEDFE', ic:'#533AB7' },
    { id:3, name:'Campus store $5 credit', desc:'Redeemable at the STAC bookstore', cost:300, icon:'ti-shopping-cart', bg:'#FAEEDA', ic:'#854F0B' },
    { id:4, name:'Event fee waiver', desc:'Free admission to one ticketed campus event', cost:250, icon:'ti-ticket', bg:'#FBEAF0', ic:'#993556' },
    { id:5, name:"President's coffee chat", desc:'Exclusive student leadership roundtable invite', cost:500, icon:'ti-star', bg:'#E1F5EE', ic:'#0F6E56' },
  ],

  feed: [
    { id:0, initials:'SR', name:'Sofia R.', bg:'#FAEEDA', fc:'#412402', text:"Just earned the <b>Dean's Circle</b> badge — thanks everyone who came to the roundtable!", time:'2 min ago', likes:7 },
    { id:1, initials:'MK', name:'Marcus K.', bg:'#EEEDFE', fc:'#26215C', text:'Shoutout to <b>Jude M.</b> — most organized Business Club meeting this semester. VP energy.', time:'18 min ago', likes:14 },
    { id:2, initials:'AT', name:'Aisha T.', bg:'#E1F5EE', fc:'#04342C', text:'Campus Ministry retreat was genuinely moving. Highly recommend.', time:'1 hr ago', likes:9 },
    { id:3, initials:'JM', name:'Jude M.', bg:'#EAF3DE', fc:'#173404', text:'STAC Venues is live — booking wizard makes reserving a space 10x easier.', time:'3 hrs ago', likes:21, you:true },
    { id:4, initials:'CL', name:'Chloe L.', bg:'#FBE6E6', fc:'#530404', text:'Just hit <b>800 engagement points</b> — leaderboard watch out!', time:'Yesterday', likes:5 },
  ],

  orgs: [
    { id:0, name:'Business Club', meta:'48 members · Leadership & career', icon:'ti-briefcase', bg:'#FBE6E6', ic:'#6b1a1a', joined:true },
    { id:1, name:'Campus Ministry', meta:'61 members · Faith & service', icon:'ti-building-church', bg:'#FBEAF0', ic:'#993556', joined:true },
    { id:2, name:'Track & Field', meta:'34 members · Athletics', icon:'ti-run', bg:'#EAF3DE', ic:'#3B6D11', joined:true },
    { id:3, name:'Hospitality Society', meta:'22 members · Academic & career', icon:'ti-building', bg:'#FAEEDA', ic:'#854F0B', joined:false },
    { id:4, name:'Student Government', meta:'29 members · Civic engagement', icon:'ti-star', bg:'#EEEDFE', ic:'#533AB7', joined:false },
    { id:5, name:'Outdoor Adventure Club', meta:'17 members · Wellness & rec', icon:'ti-mountain', bg:'#E1F5EE', ic:'#0F6E56', joined:false },
    { id:6, name:'Intl Students Assoc.', meta:'25 members · Culture & community', icon:'ti-world', bg:'#F1EFE8', ic:'#5F5E5A', joined:false },
  ],

  clubs: [
    { name:'Campus Ministry', pts:5340, members:61, color:'#993556', bg:'#FBEAF0' },
    { name:'Student Government', pts:3910, members:29, color:'#533AB7', bg:'#EEEDFE' },
    { name:'Business Club', pts:4820, members:48, color:'#6b1a1a', bg:'#FBE6E6', you:true },
    { name:'Track & Field', pts:2760, members:34, color:'#3B6D11', bg:'#EAF3DE' },
    { name:'Hospitality Society', pts:1980, members:22, color:'#854F0B', bg:'#FAEEDA' },
    { name:'Outdoor Adventure', pts:1540, members:17, color:'#0F6E56', bg:'#E1F5EE' },
  ],

  notifications: [
    { id:0, icon:'ti-rosette', iconBg:'#FAEEDA', iconC:'#854F0B', text:'You earned the <b>Leader</b> badge — keep it up!', time:'Just now', unread:true },
    { id:1, icon:'ti-calendar-event', iconBg:'#FBE6E6', iconC:'#6b1a1a', text:'<b>Business Club Networking Night</b> is tomorrow — you\'re RSVPd.', time:'2 hrs ago', unread:true },
    { id:2, icon:'ti-flame', iconBg:'#FAEEDA', iconC:'#854F0B', text:'6-week streak — you\'re on fire! Next milestone at 8 weeks (+100 pts).', time:'1 day ago', unread:true },
    { id:3, icon:'ti-megaphone', iconBg:'#EEEDFE', iconC:'#533AB7', text:'<b>Marcus K.</b> mentioned you in a shoutout.', time:'2 days ago', unread:false },
    { id:4, icon:'ti-trophy', iconBg:'#EAF3DE', iconC:'#3B6D11', text:'Your Business Club is ranked #3 in Club vs. Club this semester.', time:'3 days ago', unread:false },
  ],

  streakDays: [true,true,true,false,true,true,true,false,true,true,true,true,true,true],
  dayLabels: ['M','T','W','T','F','S','S'],
};

/* ============================================================
   v7 additions — Dining, Ranks, Badges, Marketplace, etc.
   ============================================================ */

const RANKS = [
  { title:'Spartan Recruit',  min:0,    max:199,  color:'#5F5E5A', bg:'#F1EFE8', icon:'ti-shield'         },
  { title:'Spartan Scholar',  min:200,  max:499,  color:'#533AB7', bg:'#EEEDFE', icon:'ti-book'           },
  { title:'Spartan Leader',   min:500,  max:899,  color:'#854F0B', bg:'#FAEEDA', icon:'ti-star'           },
  { title:'Spartan Elite',    min:900,  max:99999, color:'#6b1a1a', bg:'#FBE6E6', icon:'ti-crown'         },
];

function getRank(score) {
  return RANKS.find(r => score >= r.min && score <= r.max) || RANKS[0];
}

const DINING_MENU = {
  provider: 'Aramark',
  updated: 'Today, June 9',
  meals: {
    breakfast: [
      { name:'Scrambled Eggs', station:'Grill', tags:['GF'] },
      { name:'Buttermilk Pancakes', station:'Grill', tags:[] },
      { name:'Oatmeal Bar', station:'Comfort', tags:['VG','GF'] },
      { name:'Assorted Pastries', station:'Bakery', tags:[] },
      { name:'Fresh Fruit Cup', station:'Deli', tags:['VG','GF'] },
    ],
    lunch: [
      { name:'Grilled Chicken Caesar Wrap', station:'Deli', tags:[] },
      { name:'Tomato Basil Soup', station:'Soup', tags:['VG'] },
      { name:'Beef Tacos', station:'Action', tags:[] },
      { name:'Veggie Stir Fry', station:'Action', tags:['VG','GF'] },
      { name:'Classic Cheeseburger', station:'Grill', tags:[] },
      { name:'Sweet Potato Fries', station:'Grill', tags:['VG','GF'] },
    ],
    dinner: [
      { name:'Roasted Salmon', station:'Entrée', tags:['GF'] },
      { name:'Chicken Marsala', station:'Entrée', tags:[] },
      { name:'Penne Arrabiata', station:'Pasta', tags:['VG'] },
      { name:'Caesar Salad', station:'Salad Bar', tags:['GF'] },
      { name:'Garlic Bread', station:'Bakery', tags:['VG'] },
      { name:'Chocolate Lava Cake', station:'Dessert', tags:[] },
    ],
  },
  hours: {
    breakfast: '7:00 – 10:00am',
    lunch:     '11:00am – 2:00pm',
    dinner:    '5:00 – 8:00pm',
  },
};

const SEASONAL_BADGES = [
  { name:'Spring 2026', icon:'ti-flower', bg:'#EAF3DE', ic:'#3B6D11', pts:'200 pts', earned:true,  season:'Spring 2026' },
  { name:'Fall 2025',   icon:'ti-leaf',   bg:'#FAEEDA', ic:'#854F0B', pts:'200 pts', earned:true,  season:'Fall 2025'   },
  { name:'Fall 2026',   icon:'ti-snowflake', bg:'#F1EFE8', ic:'#5F5E5A', pts:'200 pts', earned:false, season:'Fall 2026' },
];

const MARKETPLACE_LISTINGS = [
  { id:1, title:'Intro to Psychology Textbook', price:35, condition:'Good', seller:'Marcus K.', posted:'2 days ago', category:'Textbook', bg:'#EEEDFE', ic:'#533AB7' },
  { id:2, title:'Mini Fridge — barely used', price:60, condition:'Excellent', seller:'Chloe L.', posted:'1 day ago', category:'Dorm', bg:'#E1F5EE', ic:'#0F6E56' },
  { id:3, title:'Calculus: Early Transcendentals', price:25, condition:'Fair', seller:'Aisha T.', posted:'3 days ago', category:'Textbook', bg:'#EEEDFE', ic:'#533AB7' },
  { id:4, title:'Desk Lamp', price:15, condition:'Good', seller:'Sofia R.', posted:'Today', category:'Dorm', bg:'#FAEEDA', ic:'#854F0B' },
  { id:5, title:'Hospitality Management 101', price:40, condition:'Like new', seller:'Daniel R.', posted:'1 day ago', category:'Textbook', bg:'#EEEDFE', ic:'#533AB7' },
  { id:6, title:'Twin XL Bedding Set', price:20, condition:'Good', seller:'Priya W.', posted:'4 days ago', category:'Dorm', bg:'#FBE6E6', ic:'#6b1a1a' },
];

const MEETING_MINUTES = {
  0: [ // Business Club
    { date:'Jun 7', title:'End-of-year planning', summary:'Discussed gala logistics, venue confirmed as Sullivan Hall Main Ballroom. Jude leading AV coordination. Budget approved at $1,200.', author:'Jude M.' },
    { date:'May 31', title:'Guest speaker recap', summary:'Dr. Torres from Marriott spoke on hospitality leadership. 34 attendees. Follow-up networking session scheduled for June 14.', author:'Sofia R.' },
  ],
  1: [ // Campus Ministry
    { date:'Jun 6', title:'Retreat planning', summary:'June 15 retreat confirmed at Chapel. Transportation arranged for 40 students. Reflection packets being prepared by ministry team.', author:'Aisha T.' },
  ],
  2: [ // Track & Field
    { date:'Jun 5', title:'Alumni meet prep', summary:'June 18 meet logistics finalized. 12 alumni confirmed. Practice schedule adjusted for final week. Uniforms distributed.', author:'Marcus K.' },
  ],
};

const WAITLIST_EVENTS = { 5: true }; // event id 5 is full
const FEEDBACK_EVENTS  = { 1: true }; // event id 1 is past and needs feedback
const feedbackState    = {};
const waitlistState    = {};

/* ── v8 — Event requests ─────────────────────────────── */

const EVENT_REQUESTS = [
  {
    id: 1,
    title: 'Business Club End-of-Year Gala',
    date: '2026-06-20',
    start: '18:00', end: '21:00',
    space: 'Sullivan Hall — Main Ballroom',
    org: 'Business Club',
    attendance: 80,
    description: 'Annual end-of-year celebration for Business Club members and guests. Awards ceremony, dinner, and networking.',
    submittedBy: 'Jude M.',
    submittedAt: '2 days ago',
    status: 'pending',
    points: 60,
    adminNote: '',
  },
  {
    id: 2,
    title: 'Hospitality Society Info Night',
    date: '2026-06-16',
    start: '17:00', end: '18:30',
    space: 'Borelli Hall — Room 201',
    org: 'Hospitality Society',
    attendance: 25,
    description: 'Open info night for students interested in joining the Hospitality Society. Light refreshments provided.',
    submittedBy: 'Sofia R.',
    submittedAt: '1 day ago',
    status: 'pending',
    points: 40,
    adminNote: '',
  },
  {
    id: 3,
    title: 'Outdoor Movie Night',
    date: '2026-06-19',
    start: '20:00', end: '22:30',
    space: 'Outdoor Quad',
    org: 'Student Government',
    attendance: 120,
    description: 'Free outdoor movie screening on the quad. Bring a blanket. Snacks provided by Student Gov.',
    submittedBy: 'Marcus K.',
    submittedAt: '3 days ago',
    status: 'approved',
    points: 50,
    adminNote: '',
  },
];

// Mutable state for requests
const eventRequestState = {};
EVENT_REQUESTS.forEach(r => eventRequestState[r.id] = r.status);
const eventRequestNotes = {};

/* ── v9 — Spartan Spirits, avatars, prizes, contacts ────── */

// Replace career pathways with Spartan Spirits (STAC's real orientation framework)
const SPARTAN_SPIRITS = [
  { name:'Service Spartan',     desc:'Volunteering, clubs like Spartans in Service, Paws 4 Change, APO', pct:85, color:'#3B6D11', icon:'ti-heart' },
  { name:'Unstoppable Spartan', desc:'Health, wellness, fitness, and on-the-go dining engagement',       pct:70, color:'#854F0B', icon:'ti-bolt' },
  { name:'Adventurous Spartan', desc:'Off-campus trips and Student Engagement excursions',               pct:55, color:'#1a3a6b', icon:'ti-compass' },
  { name:'Social Spartan',      desc:'Campus events, org meetings, and community building',              pct:90, color:'#993556', icon:'ti-users' },
  { name:'Scholar Spartan',     desc:'Academic services, Career Center, and tutoring engagement',         pct:60, color:'#533AB7', icon:'ti-book' },
];

// Avatar customization options
const AVATAR_HELMETS = [
  { id:'maroon',  name:'Maroon',  color:'#6b1a1a', accent:'#c8b560', style:'spartan' },
  { id:'gold',    name:'Gold',    color:'#c8b560', accent:'#6b1a1a', style:'spartan' },
  { id:'navy',    name:'Navy',    color:'#1a3a6b', accent:'#c8b560', style:'spartan' },
  { id:'green',   name:'Green',   color:'#3B6D11', accent:'#EAF3DE', style:'spartan' },
  { id:'silver',  name:'Silver',  color:'#8a8a80', accent:'#f5f4f0', style:'spartan' },
  { id:'black',   name:'Black',   color:'#1a1a18', accent:'#c8b560', style:'spartan' },
  { id:'racing',  name:'Racing',  color:'#6b1a1a', accent:'#c8b560', style:'racing' },
];

const AVATAR_LOGOS = [
  { id:'none',       name:'No logo',    icon:null },
  { id:'track',      name:'Track & Field', icon:'ti-run' },
  { id:'basketball', name:'Basketball', icon:'ti-basketball' },
  { id:'soccer',     name:'Soccer',     icon:'ti-ball-football' },
  { id:'volleyball', name:'Volleyball', icon:'ti-ball-volleyball' },
  { id:'baseball',   name:'Baseball',   icon:'ti-ball-baseball' },
  { id:'hospitality',name:'Hospitality',icon:'ti-bed' },
  { id:'business',   name:'Business',   icon:'ti-briefcase' },
  { id:'ministry',   name:'Ministry',   icon:'ti-cross' },
];

// Staff contacts
const STAFF_CONTACTS = [
  { name:'Samantha Bazille', role:'Director, Student Engagement', email:'sbazille@stac.edu', phone:'(845) 398-4173', icon:'ti-user-star', bg:'#FBE6E6', ic:'#6b1a1a' },
  { name:'Paolo Bruzzese',   role:'Associate Director, Campus Life', email:'pbruzzese@stac.edu', phone:'(845) 398-4173', icon:'ti-user-star', bg:'#FAEEDA', ic:'#854F0B' },
  { name:'Norman Huling',    role:'Events & Venue Coordinator', email:'nhuling@stac.edu', phone:'(845) 398-4000', icon:'ti-building', bg:'#E1F5EE', ic:'#0F6E56' },
];

// Updated shop with real-world prizes
const SHOP_PRIZES = [
  { id:10, name:'43" Roku Smart TV', desc:'Grand prize raffle entry — drawn at end of semester', cost:1000, icon:'ti-device-tv', bg:'#EEEDFE', ic:'#533AB7', raffle:true },
  { id:11, name:'Nintendo Switch', desc:'Raffle entry — drawn at end of semester', cost:750, icon:'ti-device-gamepad-2', bg:'#FBE6E6', ic:'#6b1a1a', raffle:true },
  { id:12, name:'AirPods (3rd gen)', desc:'Raffle entry — drawn monthly', cost:400, icon:'ti-headphones', bg:'#E1F5EE', ic:'#0F6E56', raffle:true },
  { id:13, name:'Snack pack bundle', desc:'Variety pack delivered to your mailbox', cost:75, icon:'ti-popcorn', bg:'#FAEEDA', ic:'#854F0B' },
  { id:14, name:'Spartan Grille $10 credit', desc:'Redeemable at the Romano Center grille', cost:120, icon:'ti-burger', bg:'#EAF3DE', ic:'#3B6D11' },
  { id:15, name:'STAC hoodie', desc:'Maroon & gold, your size, pickup at bookstore', cost:600, icon:'ti-shirt', bg:'#FBE6E6', ic:'#6b1a1a' },
];

const userAvatar = { helmet: 'maroon', logo: 'hospitality' };
