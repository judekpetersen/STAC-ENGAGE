/* ============================================================
   STAC Engage v17 — Tickets Tab (Eventbrite integration)
   ============================================================ */

// TODO (Eventbrite API):
// Replace DEMO_EB_EVENTS with real API call:
// const res = await fetch(`https://www.eventbriteapi.com/v3/organizations/${ORG_ID}/events/?status=live&token=${EB_TOKEN}`);
// const data = await res.json();

const EVENTBRITE_ORG = 'Saint Thomas Aquinas College';

// Seeded with empty array — admin posts real events via Eventbrite
const DEMO_EB_EVENTS = [];

function renderTickets() {
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Event tickets</h1>
      <p>Purchase tickets for STAC ticketed events powered by Eventbrite</p>
    </div>

    <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);margin-bottom:1rem;box-shadow:var(--shadow);">
      <svg width="24" height="24" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" aria-label="Eventbrite logo">
        <rect width="135" height="135" rx="12" fill="#f05537"/>
        <text x="67" y="95" text-anchor="middle" font-family="sans-serif" font-size="80" font-weight="700" fill="#fff">e</text>
      </svg>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:500;color:var(--text);">Powered by Eventbrite</div>
        <div style="font-size:11px;color:var(--text-3);">${EVENTBRITE_ORG}</div>
      </div>
      <a href="https://www.eventbrite.com/o/saint-thomas-aquinas-college-stac" target="_blank" rel="noopener"
         style="font-size:12px;color:#f05537;font-weight:500;text-decoration:none;display:flex;align-items:center;gap:4px;"
         aria-label="View all events on Eventbrite">
        View all <i class="ti ti-external-link" style="font-size:12px;"></i>
      </a>
    </div>

    ${DEMO_EB_EVENTS.length === 0 ? `
    <div class="card">
      <div class="card-body" style="text-align:center;padding:2.5rem 1rem;">
        <i class="ti ti-ticket" style="font-size:40px;color:#d0cfc8;display:block;margin-bottom:12px;" aria-hidden="true"></i>
        <div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:6px;">No ticketed events right now</div>
        <div style="font-size:13px;color:var(--text-3);margin-bottom:1rem;">Check back when STAC posts ticketed events on Eventbrite</div>
        <a href="https://www.eventbrite.com/o/saint-thomas-aquinas-college-stac"
           target="_blank" rel="noopener"
           style="display:inline-flex;align-items:center;gap:6px;background:#f05537;color:#fff;padding:10px 20px;border-radius:var(--radius);font-size:13px;font-weight:500;text-decoration:none;"
           aria-label="Browse STAC events on Eventbrite">
          Browse on Eventbrite <i class="ti ti-external-link" style="font-size:13px;" aria-hidden="true"></i>
        </a>
      </div>
    </div>` : DEMO_EB_EVENTS.map(ev => eventbriteCard(ev)).join('')}

    <div class="card" style="margin-top:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-info-circle"></i>About ticketed events</div></div>
      <div class="card-body">
        <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:8px;">Ticketed events are managed through Eventbrite. Clicking "Buy tickets" will take you to a secure Eventbrite checkout page.</p>
        <p style="font-size:13px;color:var(--text-2);line-height:1.6;">Free events on campus are RSVP'd through the <span style="color:#6b1a1a;cursor:pointer;font-weight:500;" onclick="switchTab('events')">Events tab</span> — no tickets required.</p>
      </div>
    </div>
  </div>`;
}

function eventbriteCard(ev) {
  return `<div class="eb-event" role="article" aria-label="${ev.name}">
    <div class="eb-event-header">
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:4px;">${ev.name}</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="eb-badge" aria-label="Eventbrite">
            <svg width="12" height="12" viewBox="0 0 135 135" aria-hidden="true"><rect width="135" height="135" rx="4" fill="#f05537"/><text x="67" y="100" text-anchor="middle" font-size="90" font-weight="700" fill="#fff">e</text></svg>
            Eventbrite
          </span>
          ${ev.isFree ? `<span class="pill" style="background:#EAF3DE;color:#3B6D11;">Free</span>` : `<span style="font-size:12px;font-weight:600;color:#6b1a1a;">${ev.price}</span>`}
        </div>
      </div>
    </div>
    <div class="eb-event-body">
      <div style="font-size:12px;color:var(--text-3);margin-bottom:10px;display:flex;flex-direction:column;gap:3px;">
        <span><i class="ti ti-calendar" style="font-size:12px;" aria-hidden="true"></i> ${ev.date} · ${ev.time}</span>
        <span><i class="ti ti-map-pin" style="font-size:12px;" aria-hidden="true"></i> ${ev.location}</span>
        ${ev.spotsLeft != null ? `<span><i class="ti ti-users" style="font-size:12px;" aria-hidden="true"></i> ${ev.spotsLeft} spots left</span>` : ''}
      </div>
      <a href="${ev.url}" target="_blank" rel="noopener"
         style="display:inline-flex;align-items:center;gap:6px;background:#f05537;color:#fff;padding:9px 18px;border-radius:var(--radius);font-size:13px;font-weight:500;text-decoration:none;"
         aria-label="Buy tickets for ${ev.name} on Eventbrite">
        ${ev.isFree ? 'Register free' : 'Buy tickets'} <i class="ti ti-external-link" style="font-size:12px;" aria-hidden="true"></i>
      </a>
    </div>
  </div>`;
}
