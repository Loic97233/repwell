/* =====================================================
   REPWELL — Programme Screen (vue 12 semaines)
   ===================================================== */

const ProgrammeScreen = {
  render() {
    const profile = State.profile;
    const prog    = State.programme;

    if (!profile || !prog) return;

    const semaine = Programmes.getSemaineActuelle(profile);

    // Meta
    document.getElementById('programme-meta').innerHTML = `
      <span class="chip chip-info">${prog.nom}</span>
      <span class="chip chip-info">${prog.frequence}× / semaine</span>
      <span class="chip chip-info">${prog.semaines} semaines</span>
    `;

    // Blocs
    document.getElementById('programme-blocs').innerHTML = prog.blocs.map(bloc => {
      const isCurrent = bloc.semaines.includes(semaine);

      const seancesHTML = bloc.seances.map(seance => {
        const exercicesHTML = seance.exercices.map(ex => {
          const isWarmup = !!ex.isWarmup;
          return `<div class="prog-exercise ${isWarmup ? 'warmup' : ''}">
            <span class="prog-ex-name">${ex.nom}</span>
            <span class="prog-ex-specs">
              ${isWarmup ? ex.reps : `${ex.series}×${ex.reps}`}
              ${!isWarmup && ex.repos > 0 ? ` · ${ex.repos}s` : ''}
            </span>
          </div>`;
        }).join('');

        return `<div class="prog-seance">
          <div class="prog-seance-header">
            <span class="session-tag tag-${seance.type}">${seance.nom}</span>
            <span class="prog-seance-jours">${(seance.jours || []).join(', ')}</span>
          </div>
          <div class="prog-exercises">${exercicesHTML}</div>
        </div>`;
      }).join('');

      return `<div class="card prog-bloc-card ${isCurrent ? 'current-bloc' : ''}">
        <div class="prog-bloc-header">
          <div>
            <span class="prog-bloc-num">Bloc ${bloc.num}</span>
            ${isCurrent ? '<span class="prog-current-badge">En cours</span>' : ''}
          </div>
          <span class="prog-bloc-semaines">Sem. ${bloc.semaines[0]}–${bloc.semaines[bloc.semaines.length - 1]}</span>
        </div>
        <h3 class="prog-bloc-nom">${bloc.nom}</h3>
        <p class="prog-bloc-desc">${bloc.description}</p>
        <details class="prog-details">
          <summary class="prog-details-toggle">Voir les exercices ↓</summary>
          <div class="prog-seances-list">${seancesHTML}</div>
        </details>
      </div>`;
    }).join('');
  },
};
