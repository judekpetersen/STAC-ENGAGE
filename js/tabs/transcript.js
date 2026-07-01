/* ============================================================
   STAC Engage v7 — Transcript Tab (+ resume builder, LinkedIn, seasonal badges)
   ============================================================ */

function renderTranscript() {
  return `<div class="page-animate">
    <div class="page-head">
      <h1>Co-curricular transcript</h1>
      <p>Your verified record of campus involvement</p>
    </div>

    <!-- Export actions -->
    <div style="display:flex;gap:8px;margin-bottom:1rem;flex-wrap:wrap;">
      <button class="btn-primary" style="width:auto;padding:9px 18px;" onclick="openResumeBuilder()">
        <i class="ti ti-file-cv"></i> Build resume
      </button>
      <button class="tbtn" onclick="exportLinkedIn()" style="display:flex;align-items:center;gap:6px;">
        <i class="ti ti-brand-linkedin" style="font-size:15px;color:#0A66C2;"></i> Export to LinkedIn
      </button>
      <button class="tbtn" onclick="exportTranscriptPDF()" style="display:flex;align-items:center;gap:6px;">
        <i class="ti ti-download" style="font-size:13px;"></i> Export PDF
      </button>
    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-certificate"></i>Involvement record</div></div>
      <div class="card-body">${C_transcriptRows(DATA.transcript)}</div>
    </div>

    <!-- Earned badges -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-head"><div class="card-title"><i class="ti ti-rosette"></i>Badges</div></div>
      <div class="card-body">${C_badgeGrid(DATA.badges)}</div>
    </div>

    <!-- Seasonal badges -->
    <div class="card">
      <div class="card-head">
        <div class="card-title"><i class="ti ti-calendar-star"></i>Seasonal badges</div>
        <span style="font-size:11px;color:#8a8a80;">Limited — one per semester</span>
      </div>
      <div class="card-body">
        <div class="badge-grid">
          ${SEASONAL_BADGES.map(b => `
            <div class="badge-item ${b.earned?'':'locked'}">
              <div class="badge-icon" style="background:${b.earned?b.bg:'#f0efe9'};border-color:${b.earned?b.ic:'#d0cfc8'};">
                <i class="ti ${b.icon}" style="color:${b.ic};font-size:20px;"></i>
              </div>
              <div class="badge-nm">${b.name}</div>
              <div class="badge-pts">${b.earned?'Earned':'Upcoming'}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function openResumeBuilder() {
  const u = getUser();
  const modal = document.createElement('div');
  modal.id = 'resume-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeResumeModal()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:560px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Resume builder</div>
          <button onclick="closeResumeModal()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background:var(--surface-2);border-radius:var(--radius);padding:1rem;margin-bottom:1rem;">
            <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:2px;">${u.firstName} ${u.lastName}</div>
            <div style="font-size:12px;color:#8a8a80;">${u.major} · Class of ${u.year} · ${u.email}</div>
          </div>
          <div style="font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:#8a8a80;margin-bottom:8px;">Co-curricular activities</div>
          ${DATA.transcript.map(t => `
            <div style="display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);">
              <div style="width:28px;height:28px;border-radius:6px;background:${t.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="ti ${t.icon}" style="color:${t.ic};font-size:13px;"></i>
              </div>
              <div>
                <div style="font-size:13px;font-weight:500;color:var(--text);">${t.name}</div>
                <div style="font-size:11px;color:#8a8a80;">${t.type} · ${t.date}</div>
              </div>
            </div>`).join('')}
          <div style="margin-top:1rem;">
            <div class="field"><label>Objective statement (optional)</label>
              <input type="text" id="res-obj" placeholder="e.g. Hospitality management student seeking...">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="closeResumeModal()" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;font-family:var(--font-body);">Cancel</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="downloadResume()">
            <i class="ti ti-download"></i> Download PDF
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function closeResumeModal() {
  const m = document.getElementById('resume-modal');
  if (m) m.remove();
}

function downloadResume() {
  closeResumeModal();
  exportTranscriptPDF();
}

function exportLinkedIn() {
  const u    = getUser();
  const text = DATA.transcript.map(t => `• ${t.title} (${t.type}, ${t.date})`).join('%0A');
  const summary = `${u.firstName || ''} ${u.lastName || ''} — Co-Curricular Transcript%0ASaint Thomas Aquinas College · ${u.major || 'Student'}%0A%0A${text}`;
  const url  = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://judekpetersen.github.io/STAC-ENGAGE/')}&summary=${summary}`;
  window.open(url, '_blank');
  showToast('Opening LinkedIn to share your transcript.');
}

async function exportTranscriptPDF() {
  const u = getUser();
  // Load jsPDF dynamically
  if (!window.jspdf) {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Header
  doc.setFillColor(107, 26, 26);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Co-Curricular Transcript', margin, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Saint Thomas Aquinas College · STAC Engage', margin, 25);

  y = 45;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${u.firstName || ''} ${u.lastName || ''}`, margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  doc.text(`${u.major || 'Student'} · Class of ${u.year || ''}`, margin, y);
  y += 4;
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);

  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, 210 - margin, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Activities & Engagement', margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  if (!DATA.transcript.length) {
    doc.setTextColor(130, 130, 130);
    doc.text('No activities recorded yet.', margin, y);
  } else {
    DATA.transcript.forEach(t => {
      if (y > 270) { doc.addPage(); y = margin; }
      doc.setTextColor(107, 26, 26);
      doc.text(`• ${t.title || t.name}`, margin, y);
      doc.setTextColor(90, 90, 90);
      doc.text(`${t.type} · ${t.date} · +${t.pts} pts`, margin + 4, y + 5);
      y += 12;
    });
  }

  y += 6;
  doc.line(margin, y, 210 - margin, y);
  y += 8;
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(9);
  doc.text('This transcript is generated by STAC Engage and reflects student co-curricular participation.', margin, y);
  doc.text('Saint Thomas Aquinas College · Sparkill, NY 10976', margin, y + 5);

  doc.save(`STAC-Transcript-${u.firstName || 'Student'}-${u.lastName || ''}.pdf`);
  showToast('PDF transcript downloaded!');
}

/* ── Live Supabase wiring ─────────────────────────────── */
async function loadTranscriptFromDB() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) return;
  try {
    const { events, service } = await fetchMyTranscript(user.id);
    DATA.transcript = [
      ...events.map(e => ({
        title: e.title, type: 'Event', date: e.event_date,
        pts: e.points || 50, icon: 'ti-calendar-event',
        color: e.color || '#6b1a1a', bg: e.bg || '#FBE6E6',
      })),
      ...service.map(h => ({
        title: `Service: ${h.org_name}`, type: 'Service',
        date: h.date, pts: Math.floor(h.hours * 10),
        icon: 'ti-heart', color: '#3B6D11', bg: '#EAF3DE',
      })),
    ].sort((a,b) => new Date(b.date) - new Date(a.date));

    const content = document.getElementById('app-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && (active.id === 'nav-transcript' || active.id === 'bnav-transcript')) {
      content.innerHTML = renderTranscript();
    }
  } catch(e) { console.warn('Transcript load failed:', e); }
}
