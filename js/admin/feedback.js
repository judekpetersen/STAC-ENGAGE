/* ============================================================
   STAC Engage — Admin: Event Feedback Dashboard
   ============================================================ */

let liveFeedback = [];

async function loadFeedbackFromDB() {
  try {
    const { data, error } = await db
      .from('event_feedback')
      .select('*, events(title, event_date)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    liveFeedback = data || [];
    const content = document.getElementById('admin-content');
    const active  = document.querySelector('.nav-item.active');
    if (content && active && active.id === 'anav-feedback') {
      content.innerHTML = renderAdminFeedback();
    }
  } catch(e) { console.warn('Feedback load failed:', e); }
}

function renderAdminFeedback() {
  // Group by event
  const byEvent = {};
  liveFeedback.forEach(f => {
    const key = f.event_id;
    if (!byEvent[key]) byEvent[key] = { title: f.events?.title || 'Unknown', date: f.events?.event_date || '', ratings: [], comments: [] };
    byEvent[key].ratings.push(f.rating);
    if (f.comment) byEvent[key].comments.push(f.comment);
  });

  const events = Object.values(byEvent).sort((a,b) => b.date.localeCompare(a.date));

  return `<div class="page-animate">
    <div class="page-head">
      <h1>Event feedback</h1>
      <p>${liveFeedback.length} response${liveFeedback.length !== 1 ? 's' : ''} across ${events.length} event${events.length !== 1 ? 's' : ''}</p>
    </div>

    ${events.length === 0
      ? `<div class="card"><div class="card-body" style="text-align:center;padding:3rem;color:#8a8a80;">
          <i class="ti ti-star" style="font-size:32px;display:block;margin-bottom:8px;"></i>
          No feedback yet — students will be prompted to rate events after attending.
        </div></div>`
      : events.map(e => {
          const avg    = e.ratings.reduce((s,r) => s+r, 0) / e.ratings.length;
          const stars  = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
          const dist   = [1,2,3,4,5].map(n => ({ n, count: e.ratings.filter(r => r === n).length }));
          return `<div class="card" style="margin-bottom:1rem;">
            <div class="card-head">
              <div>
                <div class="card-title"><i class="ti ti-star"></i>${e.title}</div>
                <div style="font-size:11px;color:#8a8a80;">${e.date} · ${e.ratings.length} response${e.ratings.length !== 1 ? 's' : ''}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:24px;color:#c8b560;">${avg.toFixed(1)}</div>
                <div style="font-size:14px;color:#c8b560;">${stars}</div>
              </div>
            </div>
            <div class="card-body">
              ${dist.map(d => `
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                  <span style="font-size:12px;color:#8a8a80;width:12px;">${d.n}</span>
                  <div style="flex:1;height:8px;background:var(--surface-2);border-radius:4px;overflow:hidden;">
                    <div style="height:100%;width:${e.ratings.length ? Math.round(d.count/e.ratings.length*100) : 0}%;background:#c8b560;border-radius:4px;transition:width .3s;"></div>
                  </div>
                  <span style="font-size:11px;color:#8a8a80;width:20px;">${d.count}</span>
                </div>`).join('')}
              ${e.comments.length > 0 ? `
                <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
                  <div style="font-size:11px;font-weight:500;color:#8a8a80;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;">Anonymous comments</div>
                  ${e.comments.map(c => `
                    <div style="font-size:12px;color:var(--text);padding:8px 10px;background:var(--surface-2);border-radius:6px;margin-bottom:6px;">"${c}"</div>
                  `).join('')}
                </div>` : ''}
            </div>
          </div>`;
        }).join('')}
  </div>`;
}
