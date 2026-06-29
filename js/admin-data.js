/* ============================================================
   STAC Engage — Admin Data
   Blank on launch. Populated by real student accounts
   via Supabase once students sign up.
   ============================================================ */

// Student list — populated from Supabase `profiles` table
const ADMIN_STUDENTS = [];

// Booking requests — populated from Supabase `bookings` table
const ADMIN_BOOKINGS = [];

// Mutable booking status (keyed by booking id)
const bookingState = {};

// Events created via admin portal
const ADMIN_EVENTS_CREATED = [];

// Engagement heatmap data (populated from Supabase analytics)
const ENGAGEMENT_HEATMAP = [];

// Org engagement data (populated from Supabase aggregate query)
const ORG_ENGAGEMENT = [];

// Notification history
const NOTIF_HISTORY = [];
