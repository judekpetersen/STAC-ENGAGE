/* ============================================================
   STAC Engage — Post-Event Feedback System
   Auto-triggers survey for students after attending events
   ============================================================ */

let pendingFeedbackEvents = [];

/* Called on app load and on notifications tab visit */
async function checkAndSendFeedbackPrompts() {
  const user = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  if (!user.id) return;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Find events student was checked in to that ended before today
    const { data: checkins } = await db
      .from('rsvps')
      .select('event_id, events(id, title, event_date, points)')
      .eq('user_id', user.id)
      .eq('checked_in', true);

    if (!checkins?.length) return;

    // Check which ones already have feedback
    const { data: existing } = await db
      .from('event_feedback')
      .select('event_id')
      .eq('user_id', user.id);

    const alreadyRated = new Set((existing || []).map(f => f.event_id));

    pendingFeedbackEvents = checkins
      .filter(c => c.events && c.events.event_date < today && !alreadyRated.has(c.event_id))
      .map(c => c.events);

    if (pendingFeedbackEvents.length > 0) {
      // Show feedback badge on notifications
      const badge = document.querySelector('#nav-notifications .nav-badge, #bnav-notifications .notif-dot');
      if (badge) badge.style.display = 'block';
      // Auto-show first pending survey after short delay
      setTimeout(() => showFeedbackModal(pendingFeedbackEvents[0]), 1500);
    }
  } catch(e) { console.warn('Feedback check failed:', e); }
}

function showFeedbackModal(event) {
  if (!event) return;
  const existing = document.getElementById('feedback-survey-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'feedback-survey-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" onclick="closeFeedbackSurvey()">
      <div class="modal-box" onclick="event.stopPropagation()" style="max-width:400px;">
        <div class="modal-head">
          <div style="font-size:16px;font-weight:500;">Rate this event</div>
          <button onclick="closeFeedbackSurvey()" style="color:#8a8a80;font-size:20px;background:none;border:none;cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body" style="text-align:center;">
          <div style="font-size:13px;color:#8a8a80;margin-bottom:4px;">How was</div>
          <div style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:1.25rem;">${event.title}</div>
          <div style="display:flex;justify-content:center;gap:8px;margin-bottom:1rem;" id="survey-stars">
            ${[1,2,3,4,5].map(n => `
              <button onclick="setSurveyStars(${n})" id="survey-star-${n}"
                style="font-size:36px;background:none;border:none;cursor:pointer;color:#d0cfc8;transition:color .1s;line-height:1;">★</button>
            `).join('')}
          </div>
          <div style="font-size:11px;color:#8a8a80;margin-bottom:1rem;" id="survey-star-label">Tap to rate</div>
          <div class="field">
            <label>Comments (optional)</label>
            <input type="text" id="survey-comment" placeholder="What did you think?">
          </div>
          <p style="font-size:11px;color:#8a8a80;margin-top:8px;">Your feedback is anonymous · +10 pts for reviewing</p>
        </div>
        <div class="modal-footer">
          <button onclick="skipFeedback('${event.id}')" style="background:none;border:1px solid var(--border-md);border-radius:8px;padding:9px 18px;font-size:13px;color:var(--text-2);cursor:pointer;">Skip</button>
          <button class="btn-primary" style="width:auto;padding:9px 22px;" onclick="submitFeedbackSurvey('${event.id}', ${event.points || 50})">Submit</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

let surveyStars = 0;

window.setSurveyStars = function(n) {
  surveyStars = n;
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`survey-star-${i}`);
    if (el) el.style.color = i <= n ? '#c8b560' : '#d0cfc8';
  }
  const labels = ['','Terrible','Poor','OK','Good','Excellent!'];
  const lbl = document.getElementById('survey-star-label');
  if (lbl) lbl.textContent = labels[n] || '';
};

window.submitFeedbackSurvey = async function(eventId, eventPoints) {
  if (!surveyStars) { showToast('Please tap a star to rate.'); return; }
  const user    = JSON.parse(localStorage.getItem('stac_engage_user') || '{}');
  const comment = document.getElementById('survey-comment')?.value.trim() || '';

  try {
    await db.from('event_feedback').insert({
      event_id: eventId, user_id: user.id,
      rating: surveyStars, comment,
    });
    // Award +10 pts for reviewing
    await db.rpc('add_score', { p_user_id: user.id, p_points: 10 });
    const s = getState();
    s.user.score = (s.user.score || 0) + 10;
    saveState();
    updateScoreDisplay();
    // Notify admins about new feedback
    const { data: admins } = await db.from('profiles').select('id').eq('role','admin');
    const eventName = pendingFeedbackEvents.find(e => e.id === eventId)?.title || 'an event';
    const stars = '★'.repeat(surveyStars) + '☆'.repeat(5 - surveyStars);
    if (admins?.length) {
      await db.from('notifications').insert(admins.map(a => ({
        user_id: a.id, type: 'update', read: false,
        text: `New feedback for "${eventName}": ${stars}${comment ? ' — "' + comment + '"' : ''}`,
      })));
    }
  } catch(e) { console.warn('Feedback submit failed:', e); }

  surveyStars = 0;
  closeFeedbackSurvey();
  showToast('Thanks for your feedback! +10 pts 🎉');
  launchConfetti();

  // Show next pending survey if any
  pendingFeedbackEvents = pendingFeedbackEvents.filter(e => e.id !== eventId);
  if (pendingFeedbackEvents.length > 0) {
    setTimeout(() => showFeedbackModal(pendingFeedbackEvents[0]), 1000);
  }
};

window.skipFeedback = function(eventId) {
  surveyStars = 0;
  pendingFeedbackEvents = pendingFeedbackEvents.filter(e => e.id !== eventId);
  closeFeedbackSurvey();
};

window.closeFeedbackSurvey = function() {
  surveyStars = 0;
  const m = document.getElementById('feedback-survey-modal');
  if (m) m.remove();
};
