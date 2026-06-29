/* ============================================================
   STAC Engage — Admin Data
   ============================================================ */

const ADMIN_STUDENTS = [
  { id:1,  ini:'JM', name:'Jude Murphy',      major:'Hospitality Mgmt', year:'2028', score:847,  streak:6,  events:19, status:'active',  bg:'#EAF3DE', fc:'#173404' },
  { id:2,  ini:'SR', name:'Sofia Rodriguez',  major:'Business Admin',   year:'2027', score:1204, streak:9,  events:28, status:'active',  bg:'#FAEEDA', fc:'#412402' },
  { id:3,  ini:'MK', name:'Marcus Kim',        major:'Psychology',       year:'2026', score:1158, streak:8,  events:26, status:'active',  bg:'#EEEDFE', fc:'#26215C' },
  { id:4,  ini:'AT', name:'Aisha Thompson',    major:'Education',        year:'2028', score:1092, streak:7,  events:22, status:'active',  bg:'#E1F5EE', fc:'#04342C' },
  { id:5,  ini:'CL', name:'Chloe Lin',         major:'Biology',          year:'2027', score:801,  streak:4,  events:15, status:'active',  bg:'#FBE6E6', fc:'#530404' },
  { id:6,  ini:'DR', name:'Daniel Rivera',     major:'Criminal Justice', year:'2026', score:754,  streak:3,  events:14, status:'active',  bg:'#FBEAF0', fc:'#4B1528' },
  { id:7,  ini:'PW', name:'Priya Wilson',      major:'English',          year:'2029', score:210,  streak:1,  events:4,  status:'atrisk',  bg:'#F1EFE8', fc:'#5F5E5A' },
  { id:8,  ini:'TN', name:'Tyler Nguyen',      major:'Business Admin',   year:'2029', score:95,   streak:0,  events:2,  status:'atrisk',  bg:'#FAEEDA', fc:'#412402' },
  { id:9,  ini:'EO', name:'Emma O\'Brien',     major:'Psychology',       year:'2028', score:540,  streak:3,  events:11, status:'active',  bg:'#EEEDFE', fc:'#26215C' },
  { id:10, ini:'BF', name:'Ben Foster',        major:'Education',        year:'2027', score:430,  streak:2,  events:9,  status:'active',  bg:'#E1F5EE', fc:'#04342C' },
];

const ADMIN_BOOKINGS = [
  { id:1,  student:'Jude Murphy',     space:'Sullivan Hall — Main Ballroom',    date:'Jun 14', time:'6:00–9:00pm',  purpose:'Business Club End-of-Year Gala',   attendees:80,  status:'pending',  notes:'Need AV setup and round tables' },
  { id:2,  student:'Sofia Rodriguez', space:'Borelli Hall — Room 201',          date:'Jun 12', time:'3:00–5:00pm',  purpose:'Student Gov. Budget Meeting',      attendees:15,  status:'pending',  notes:'' },
  { id:3,  student:'Aisha Thompson',  space:'Aquinas Hall — Conference Room',   date:'Jun 10', time:'1:00–2:30pm',  purpose:'Peer tutoring session',             attendees:6,   status:'approved', notes:'' },
  { id:4,  student:'Marcus Kim',      space:'Lougheed Library — Study Room A',  date:'Jun 9',  time:'2:00–4:00pm',  purpose:'Psych study group',                attendees:4,   status:'approved', notes:'' },
  { id:5,  student:'Chloe Lin',       space:'Athletic Complex — Main Gym',      date:'Jun 18', time:'5:00–7:00pm',  purpose:'Intramural volleyball tournament',  attendees:40,  status:'denied',   notes:'Conflict with scheduled event' },
  { id:6,  student:'Daniel Rivera',   space:'Romano Student Center',            date:'Jun 20', time:'12:00–2:00pm', purpose:'CJ club movie screening',           attendees:25,  status:'pending',  notes:'Need projector and seating rearranged' },
  { id:7,  student:'Priya Wilson',    space:'Borelli Hall — Room 301',          date:'Jun 22', time:'10:00am–12pm', purpose:'English dept. reading group',       attendees:8,   status:'pending',  notes:'' },
];

const ADMIN_EVENTS_CREATED = [
  { id:1,  name:'Business Club Networking Night',  date:'Jun 10', type:'Org',      attendance:34, capacity:80,  points:50,  checkins:34 },
  { id:2,  name:'Hospitality Career Panel',         date:'Jun 13', type:'Career',   attendance:0,  capacity:40,  points:75,  checkins:0  },
  { id:3,  name:'Campus Ministry Retreat',          date:'Jun 15', type:'Service',  attendance:0,  capacity:150, points:60,  checkins:0  },
  { id:4,  name:'Track & Field Alumni Meet',        date:'Jun 18', type:'Athletics',attendance:0,  capacity:200, points:40,  checkins:0  },
  { id:5,  name:"Dean's Roundtable",                date:'Jun 21', type:'Academic', attendance:0,  capacity:16,  points:80,  checkins:0  },
];

const ENGAGEMENT_HEATMAP = [
  // [label, sun, mon, tue, wed, thu, fri, sat] — values 0–4
  ['Week 1',  1, 3, 2, 4, 3, 1, 0],
  ['Week 2',  0, 2, 3, 3, 4, 2, 1],
  ['Week 3',  1, 4, 3, 4, 3, 2, 0],
  ['Week 4',  0, 3, 2, 3, 4, 1, 1],
];

const ORG_ENGAGEMENT = [
  { name:'Campus Ministry',    pts:5340, members:61, color:'#993556' },
  { name:'Business Club',      pts:4820, members:48, color:'#6b1a1a' },
  { name:'Student Government', pts:3910, members:29, color:'#533AB7' },
  { name:'Track & Field',      pts:2760, members:34, color:'#3B6D11' },
  { name:'Hospitality Society',pts:1980, members:22, color:'#854F0B' },
  { name:'Outdoor Adventure',  pts:1540, members:17, color:'#0F6E56' },
];

const NOTIF_HISTORY = [
  { id:1, title:'Business Club Networking Night',  sent:'Jun 8',  audience:'All students',    opens:143, type:'event'    },
  { id:2, title:'Reminder: RSVP closes tonight',   sent:'Jun 7',  audience:'RSVPd students',  opens:31,  type:'reminder' },
  { id:3, title:'New point shop items available',  sent:'Jun 5',  audience:'All students',    opens:98,  type:'update'   },
  { id:4, title:'Streak milestone reached!',       sent:'Jun 4',  audience:'6+ week streaks', opens:12,  type:'badge'    },
];

// Booking state (mutable)
const bookingState = {};
ADMIN_BOOKINGS.forEach(b => bookingState[b.id] = b.status);
