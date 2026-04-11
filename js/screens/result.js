/* =====================================================
   REPWELL — Result Screen (programme assigné)
   ===================================================== */

const ResultScreen = {
  render() {
    const profile  = State.profile;
    const prog     = State.programme;

    if (!profile || !prog) return;

    const estFemme = profile.genre === 'femme';

    // Titre personnalisé
    document.getElementById('result-title').textContent =
      `${profile.prenom}, ton programme est prêt. 🎉`;

    // Chips infos programme
    const lieuLabel = { salle: '🏋️ Salle', maison_materiel: '🏠 Matériel', maison_corps: '🤸 Corps' };
    const objectifLabel = { graisse: '🔥 Perte de graisse', muscle: '💪 Prise de muscle', mixte: '⚡ Mixte', forme: '❤️ Forme' };

    document.getElementById('result-chips').innerHTML = `
      <span class="chip chip-info">${lieuLabel[profile.lieu] || prog.lieu}</span>
      <span class="chip chip-info">${prog.frequence}× / semaine</span>
      <span class="chip chip-info">${objectifLabel[profile.objectif] || profile.objectif}</span>
      <span class="chip chip-info">${prog.duree} min / séance</span>
      <span class="chip chip-info">${prog.semaines} semaines</span>
    `;

    // Cartes blocs
    const cardsHTML = prog.blocs.map(bloc => `
      <div class="card result-bloc-card">
        <div class="result-bloc-header">
          <span class="result-bloc-num">Bloc ${bloc.num}</span>
          <span class="result-bloc-semaines">Semaines ${bloc.semaines[0]}–${bloc.semaines[bloc.semaines.length - 1]}</span>
        </div>
        <h3 class="result-bloc-nom">${bloc.nom}</h3>
        <p class="result-bloc-desc">${bloc.description}</p>
        <div class="result-bloc-seances">
          ${bloc.seances.map(s => `<span class="session-tag tag-${s.type}">${s.nom}</span>`).join('')}
        </div>
      </div>
    `).join('');

    document.getElementById('result-cards').innerHTML = cardsHTML;

    // Semaine type (Bloc 1)
    const semaineType = Programmes.getSemaineType(prog);
    const jourInitiale = { Lundi: 'L', Mardi: 'M', Mercredi: 'M', Jeudi: 'J', Vendredi: 'V', Samedi: 'S', Dimanche: 'D' };

    document.getElementById('result-week-grid').innerHTML = semaineType.map(({ jour, seance }) => {
      if (seance) {
        return `<div class="week-day-cell has-session">
          <div class="week-day-letter">${jourInitiale[jour]}</div>
          <div class="week-session-dot dot-${seance.type}"></div>
          <div class="week-session-label">${seance.nom}</div>
        </div>`;
      }
      return `<div class="week-day-cell repos">
        <div class="week-day-letter">${jourInitiale[jour]}</div>
        <div class="week-session-dot dot-repos"></div>
        <div class="week-session-label">Repos</div>
      </div>`;
    }).join('');

    // Bouton CTA
    document.getElementById('result-cta').onclick = async () => {
      if (!State.streak) await Auth.loadStreak(State.user.id);
      Router.go('dashboard');
      DashboardScreen.render();
      // Modale thème au premier accès
      setTimeout(() => this._showThemeModal(), 600);
    };
  },

  _showThemeModal() {
    const modal = document.createElement('div');
    modal.className = 'theme-modal-overlay';
    modal.innerHTML = `
      <div class="theme-modal">
        <p class="theme-modal-emoji">🌗</p>
        <h3 class="theme-modal-title">Quel thème préfères-tu ?</h3>
        <div class="theme-modal-btns">
          <button id="theme-light" class="btn-secondary">☀️ Clair</button>
          <button id="theme-dark" class="btn-primary">🌙 Sombre</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const close = async (dark) => {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
      await supabase.from('user_profiles').update({ dark_mode: dark }).eq('user_id', State.user.id);
      if (State.profile) State.profile.dark_mode = dark;
      modal.remove();
    };

    document.getElementById('theme-light').onclick = () => close(false);
    document.getElementById('theme-dark').onclick  = () => close(true);
  },
};
