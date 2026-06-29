/* ============================================================
   STAC Engage v12 — Real campus layout (Sparkill, NY)
   Two zones: West of Route 340 (main academic campus) and
   East of Route 340 (athletics & residential complex)
   Grid units: x/y/w/h are in % of each zone's canvas (1000x500)
   ============================================================ */

const BUILDINGS = [
  // ── WEST OF ROUTE 340 — Main campus ──
  { name:'Tennis Courts',    x: 56, y: 2,  w: 18, h: 11, color:'#1a3a6b', label:'Tennis Courts', sub:'On-campus · Rental available', zone:'west', tag:'R' },
  { name:'Aquinas Village',  x: 76, y: 2,  w: 20, h: 11, color:'#993556', label:'Aquinas Village', sub:'Student housing · North end', zone:'west', tag:'' },
  { name:'Costello Hall',    x: 46, y: 16, w: 17, h: 13, color:'#1a3a6b', label:'Costello Hall', sub:'Art Gallery · Science Labs', zone:'west', tag:'' },
  { name:'Spellman Hall',    x: 65, y: 16, w: 17, h: 13, color:'#1a3a6b', label:'Spellman Hall', sub:'Classrooms · Library · Labs', zone:'west', tag:'R' },
  { name:'Aquinas Hall',     x: 46, y: 31, w: 17, h: 13, color:'#1a3a6b', label:'Aquinas Hall', sub:'Central connector · Offices', zone:'west', tag:'' },
  { name:'Gymnasium & Fitness Ctr', x: 65, y: 31, w: 17, h: 13, color:'#1a3a6b', label:'Gym & Fitness Ctr', sub:'Events & sports · Cap. ~300', zone:'west', tag:'R' },
  { name:'Maguire Hall',     x: 46, y: 46, w: 17, h: 13, color:'#1a3a6b', label:'Maguire Hall', sub:'Sullivan Theatre · Art studios', zone:'west', tag:'R' },
  { name:'Romano Student Alumni Ctr', x: 4,  y: 31, w: 22, h: 13, color:'#6b1a1a', label:'Romano Alumni Ctr', sub:'Grille · Bookstore · Stage', zone:'west', tag:'R' },
  { name:'The Quad / Main Lawn', x: 4,  y: 46, w: 22, h: 17, color:'#3B6D11', label:'The Quad / Main Lawn', sub:'Outdoor · Cap. ~400', zone:'west', tag:'O', outdoor:true },
  { name:'Borelli Hall',     x: 4,  y: 65, w: 22, h: 11, color:'#1a3a6b', label:'Borelli Hall', sub:'Meeting room · Cap. ~25', zone:'west', tag:'R' },
  { name:'Naughton Hall',    x: 46, y: 65, w: 19, h: 11, color:'#1a3a6b', label:'Naughton Hall', sub:'Admissions · Faculty offices', zone:'west', tag:'' },
  { name:'Marian Gardens',   x: 28, y: 79, w: 17, h: 18, color:'#3B6D11', label:'Marian Gardens', sub:'Outdoor · Cap. ~100', zone:'west', tag:'O', outdoor:true },
  { name:'SKAE Astronomy Center', x: 46, y: 81, w: 19, h: 11, color:'#854F0B', label:'SKAE Astronomy Ctr', sub:'Observatory · Lecture · Cap. ~40', zone:'west', tag:'R' },

  // ── EAST OF ROUTE 340 — Athletics & residential ──
  { name:'Volleyball Center', x: 4,  y: 6,  w: 24, h: 12, color:'#1a3a6b', label:'Volleyball Center', sub:'Indoor courts · Rentable', zone:'east', tag:'R' },
  { name:'Track & Field',    x: 38, y: 2,  w: 38, h: 30, color:'#3B6D11', label:'Track & Field', sub:'Under construction', zone:'east', tag:'', oval:true, construction:true },
  { name:'Dorm A',           x: 4,  y: 44, w: 16, h: 10, color:'#993556', label:'Dorm A', sub:'Residence hall', zone:'east', tag:'' },
  { name:'Dorm B',           x: 32, y: 44, w: 16, h: 10, color:'#993556', label:'Dorm B', sub:'Residence hall', zone:'east', tag:'' },
  { name:'McNelis Dining Hall', x: 17, y: 58, w: 22, h: 14, color:'#993556', label:'McNelis Dining Hall', sub:'Main: Cap. 150+ · Private: 10–15', zone:'east', tag:'R' },
  { name:'Dorm C',           x: 4,  y: 76, w: 16, h: 10, color:'#993556', label:'Dorm C', sub:'Residence hall', zone:'east', tag:'' },
  { name:'Dorm D',           x: 32, y: 76, w: 16, h: 10, color:'#993556', label:'Dorm D', sub:'Residence hall', zone:'east', tag:'' },
  { name:'Soccer Field',     x: 58, y: 44, w: 38, h: 42, color:'#3B6D11', label:'Soccer Field', sub:'', zone:'east', tag:'', field:true },
];

/* Bookable spaces — mapped to real STAC buildings */
const SPACES = [
  { id: 1, name:'Spellman Hall — Library Study Room', building:'Spellman Hall', capacity:40, type:'Classroom', icon:'ti-school', color:'#1a3a6b', bg:'#FBE6E6', features:['Projector','Whiteboard','WiFi'], rate:0, available:true },
  { id: 2, name:'Gymnasium & Fitness Center — Main Court', building:'Gymnasium & Fitness Ctr', capacity:300, type:'Athletic', icon:'ti-run', color:'#1a3a6b', bg:'#FBE6E6', features:['Full court','Bleachers','Sound system','Scoreboard'], rate:100, available:true },
  { id: 3, name:'Maguire Hall — Sullivan Theatre', building:'Maguire Hall', capacity:180, type:'Theatre', icon:'ti-presentation', color:'#1a3a6b', bg:'#FBE6E6', features:['Stage','Lighting rig','Sound system','Tiered seating'], rate:75, available:true },
  { id: 4, name:'Romano Student Alumni Center — Grille', building:'Romano Student Alumni Ctr', capacity:80, type:'Lounge', icon:'ti-armchair', color:'#6b1a1a', bg:'#FBE6E6', features:['Lounge seating','TV screens','Café adjacent','Game area'], rate:0, available:true },
  { id: 5, name:'The Quad / Main Lawn', building:'The Quad / Main Lawn', capacity:400, type:'Outdoor', icon:'ti-tree', color:'#3B6D11', bg:'#EAF3DE', features:['Open lawn','Power outlets','Tent-ready'], rate:50, available:true },
  { id: 6, name:'Borelli Hall — Meeting Room', building:'Borelli Hall', capacity:25, type:'Conference', icon:'ti-presentation', color:'#1a3a6b', bg:'#FBE6E6', features:['Conference table','Display screen','Video conferencing'], rate:25, available:true },
  { id: 7, name:'Marian Gardens', building:'Marian Gardens', capacity:100, type:'Outdoor', icon:'ti-flower', color:'#3B6D11', bg:'#EAF3DE', features:['Garden seating','Quiet space','Reflection area'], rate:0, available:true },
  { id: 8, name:'SKAE Astronomy Center — Observatory', building:'SKAE Astronomy Center', capacity:40, type:'Lecture', icon:'ti-telescope', color:'#854F0B', bg:'#FAEEDA', features:['Telescope dome','Lecture seating','Projector'], rate:0, available:true },
  { id: 9, name:'Tennis Courts', building:'Tennis Courts', capacity:20, type:'Athletic', icon:'ti-ball-tennis', color:'#1a3a6b', bg:'#FBE6E6', features:['Outdoor courts','Lighting','Rental available'], rate:30, available:true },
  { id:10, name:'Volleyball Center — Indoor Courts', building:'Volleyball Center', capacity:120, type:'Athletic', icon:'ti-ball-volleyball', color:'#1a3a6b', bg:'#FBE6E6', features:['Indoor courts','Bleachers','Rentable'], rate:80, available:true },
  { id:11, name:'McNelis Dining Hall — Private Dining', building:'McNelis Dining Hall', capacity:15, type:'Dining', icon:'ti-utensils', color:'#993556', bg:'#FBEAF0', features:['Private room','Catering','Cap. 10–15'], rate:50, available:true },
  { id:12, name:'McNelis Dining Hall — Main', building:'McNelis Dining Hall', capacity:150, type:'Dining', icon:'ti-tools-kitchen-2', color:'#993556', bg:'#FBEAF0', features:['Full dining hall','Cap. 150+'], rate:0, available:true },
  { id:13, name:'Soccer Field', building:'Soccer Field', capacity:300, type:'Athletic', icon:'ti-ball-football', color:'#3B6D11', bg:'#EAF3DE', features:['Full pitch','Lined field','Goals'], rate:60, available:true },
  { id:14, name:'Track & Field', building:'Track & Field', capacity:200, type:'Athletic', icon:'ti-run', color:'#3B6D11', bg:'#EAF3DE', features:['400m track','Field events area'], rate:0, available:false },
];

/* Calendar event data — combines campus events + bookings */
const CALENDAR_EVENTS = [
  { id:'ce1', title:'Business Club Networking Night', date:'2026-06-10', start:'18:00', end:'20:00', type:'org', color:'#6b1a1a', bg:'#FBE6E6', space:'Romano Student Alumni Center — Grille', rsvp:true },
  { id:'ce2', title:'Hospitality Career Panel', date:'2026-06-13', start:'14:00', end:'16:00', type:'academic', color:'#854F0B', bg:'#FAEEDA', space:'Spellman Hall — Library Study Room', rsvp:false },
  { id:'ce3', title:'Campus Ministry Retreat', date:'2026-06-15', start:'09:00', end:'17:00', type:'service', color:'#993556', bg:'#FBEAF0', space:'Marian Gardens', rsvp:false },
  { id:'ce4', title:'Track & Field Alumni Meet', date:'2026-06-18', start:'10:00', end:'14:00', type:'athletics', color:'#3B6D11', bg:'#EAF3DE', space:'Soccer Field', rsvp:false },
  { id:'ce5', title:"Dean's Roundtable", date:'2026-06-21', start:'11:00', end:'12:30', type:'academic', color:'#0F6E56', bg:'#E1F5EE', space:'Borelli Hall — Meeting Room', rsvp:false },
  { id:'ce6', title:'Study Group — Hospitality Mgmt', date:'2026-06-09', start:'15:00', end:'17:00', type:'study', color:'#533AB7', bg:'#EEEDFE', space:'Spellman Hall — Library Study Room', rsvp:true, mine:true },
  { id:'ce7', title:'Business Club Officer Meeting', date:'2026-06-11', start:'12:00', end:'13:00', type:'org', color:'#6b1a1a', bg:'#FBE6E6', space:'Romano Student Alumni Center — Grille', rsvp:true, mine:true },
  { id:'ce8', title:'Finals Study Session', date:'2026-06-16', start:'13:00', end:'16:00', type:'study', color:'#533AB7', bg:'#EEEDFE', space:'Borelli Hall — Meeting Room', rsvp:false },
  { id:'ce9', title:'Summer Send-Off Party', date:'2026-06-27', start:'17:00', end:'21:00', type:'social', color:'#854F0B', bg:'#FAEEDA', space:'The Quad / Main Lawn', rsvp:false },
];
