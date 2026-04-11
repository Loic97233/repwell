/* =====================================================
   REPWELL — Recap Screen (post-séance)
   ===================================================== */

const RecapScreen = {
  render() {
    const recap = State.recap;
    if (!recap || !recap.data) return;

    const firstTime = !recap.shown;
    recap.shown = true;

    const { duree, prs, exercices, series } = recap.data;
    const profile  = State.profile;
    const estFemme = profile && profile.genre === 'femme';
    const prenom   = profile ? profile.prenom : '';

    // Message principal — jamais "undefined"
    const messages = [
      `Bravo ${prenom}, séance terminée ! 💪`,
      'Super séance ! Continue comme ça 🔥',
      'C\'est fait ! La régularité paye. ✅',
      `Bien joué${estFemme ? 'e' : ''} ! Chaque séance te rapproche de ton objectif.`,
    ];
    const msg = (prs && prs.length > 0)
      ? `${prs.length} record${prs.length > 1 ? 's' : ''} battu${estFemme ? 's' : ''} ! 🏆`
      : messages[Math.floor(Math.random() * messages.length)];

    document.getElementById('recap-message').textContent = msg;

    // Badge titre si PR
    const badgeTitle = document.getElementById('recap-badge-title');
    if (prs && prs.length > 0) {
      badgeTitle.classList.remove('hidden');
      badgeTitle.textContent = `⚡ ${prs.length} nouveau${prs.length > 1 ? 'x' : ''} record${prs.length > 1 ? 's' : ''}`;
    } else {
      badgeTitle.classList.add('hidden');
    }

    // Stats
    const m   = Math.floor(duree / 60);
    const s   = duree % 60;
    const dur = m > 0 ? `${m}min${s > 0 ? ' ' + s + 's' : ''}` : `${s}s`;
    const streakVal = State.streak ? State.streak.current_streak : 0;

    document.getElementById('recap-stats').innerHTML = `
      <div class="recap-stat">
        <div class="recap-stat-value">${dur}</div>
        <div class="recap-stat-label">Durée</div>
      </div>
      <div class="recap-stat">
        <div class="recap-stat-value">${exercices}</div>
        <div class="recap-stat-label">Exercices</div>
      </div>
      <div class="recap-stat">
        <div class="recap-stat-value">${series}</div>
        <div class="recap-stat-label">Séries</div>
      </div>
      <div class="recap-stat">
        <div class="recap-stat-value">${streakVal}🔥</div>
        <div class="recap-stat-label">Série en cours</div>
      </div>
    `;

    // Records battus — nom complet
    const prsEl = document.getElementById('recap-prs');
    if (prs && prs.length > 0) {
      prsEl.classList.remove('hidden');
      prsEl.innerHTML = `
        <h3 class="recap-prs-title">Records battus</h3>
        ${prs.map(pr => `<div class="recap-pr-item">🏆 ${pr.nom || pr.exercice_id} — ${pr.poids} kg</div>`).join('')}
      `;
    } else {
      prsEl.classList.add('hidden');
    }

    // Navigation
    document.getElementById('btn-recap-progress').onclick = () => {
      Router.go('progress');
      ProgressScreen.render();
    };
    document.getElementById('btn-recap-dashboard').onclick = () => {
      Router.go('dashboard');
      DashboardScreen.render();
    };

    if (firstTime) {
      const canvas = document.getElementById('confetti-canvas');
      Animations.confetti(canvas, prs && prs.length > 0);
    }
  },
};
