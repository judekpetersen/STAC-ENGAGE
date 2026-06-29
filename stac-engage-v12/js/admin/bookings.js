/* ============================================================
   STAC Engage — Admin: Bookings
   Supabase: query `bookings` joined with `profiles` and `spaces`
   ============================================================ */

let bookingFilter = 'all';

function renderAdminBookings() {
  // TODO (Supabase):
  // const { data } = await db.from('bookings')
  //   .select('*, profiles(first_name, last_name), spaces(name, building)')
  //   .order('event_date');
  const filtered = bookingFilter === 'all'
    ? ADMIN_BOOKINGS
    : ADMIN_BOOKINGS.filter(b => bookingState[b.id] === bookingFilter);

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Space bookings</h1>
      <p>Review and approve student booking requests</p>
    </div>

    <div class="filter-pills">
      ${['all','pending','approved','denied'].map(f => `
        <button class="filter-pill ${bookingFilter === f ? 'active' : ''}"
          onclick="setBookingFilter('${f}')">
          ${f.charAt(0).toUpperCase() + f.slice(1)}
          ${f === 'pending' ? `(${ADMIN_BOOKINGS.filter(b => bookingState[b.id] === 'pending').length})` : ''}
        </button>`).join('')}
    </div>

    <div class="card">
      <div class="card-body" style="padding:0;overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Purpose</th>
              <th>Space</th>
              <th>Date & time</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="bookings-tbody">
            ${filtered.map(b => bookingRow(b)).join('')}
          </tbody>
        </table>
        ${filtered.length === 0 ? `<div style="text-align:center;padding:2rem;color:var(--text-3);font-size:13px;">No ${bookingFilter} bookings</div>` : ''}
      </div>
    </div>
  </div>`;
}

function bookingRow(b) {
  const status = bookingState[b.id];
  return `<tr id="brow-${b.id}">
    <td class="td-name">${b.student}</td>
    <td>
      <div class="td-name">${b.purpose}</div>
      ${b.notes ? `<div class="td-meta">${b.notes}</div>` : ''}
    </td>
    <td>
      <div>${b.space.split(' — ')[0]}</div>
      <div class="td-meta">${b.space.split(' — ')[1] || ''}</div>
    </td>
    <td>
      <div>${b.date}</div>
      <div class="td-meta">${b.time}</div>
    </td>
    <td>${b.attendees}</td>
    <td><span class="status-badge status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
    <td>
      <div class="action-row" id="bactions-${b.id}">
        ${status === 'pending' ? `
          <button class="btn-approve" onclick="approveBooking(${b.id})">Approve</button>
          <button class="btn-deny" onclick="denyBooking(${b.id})">Deny</button>` :
          `<button class="btn-secondary" onclick="resetBooking(${b.id})">Reset</button>`}
      </div>
    </td>
  </tr>`;
}

function setBookingFilter(f) {
  bookingFilter = f;
  const content = document.getElementById('admin-content');
  if (content) content.innerHTML = renderAdminBookings();
}

function approveBooking(id) {
  bookingState[id] = 'approved';
  refreshBookingRow(id);
  showToast('Booking approved — student notified.');
  // TODO (Supabase): await db.from('bookings').update({ status: 'approved' }).eq('id', id);
  // Then insert a notification for the student
}

function denyBooking(id) {
  bookingState[id] = 'denied';
  refreshBookingRow(id);
  showToast('Booking denied.');
  // TODO (Supabase): await db.from('bookings').update({ status: 'denied' }).eq('id', id);
}

function resetBooking(id) {
  bookingState[id] = 'pending';
  refreshBookingRow(id);
}

function refreshBookingRow(id) {
  const row = document.getElementById('brow-' + id);
  if (!row) return;
  const b = ADMIN_BOOKINGS.find(x => x.id === id);
  const status = bookingState[id];
  row.querySelector('td:nth-child(6)').innerHTML =
    `<span class="status-badge status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
  const actions = document.getElementById('bactions-' + id);
  if (actions) {
    actions.innerHTML = status === 'pending'
      ? `<button class="btn-approve" onclick="approveBooking(${id})">Approve</button>
         <button class="btn-deny" onclick="denyBooking(${id})">Deny</button>`
      : `<button class="btn-secondary" onclick="resetBooking(${id})">Reset</button>`;
  }
}
