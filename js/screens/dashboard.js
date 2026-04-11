/* =====================================================
   REPWELL — Dashboard Screen
   ===================================================== */

const DashboardScreen = {
  async render() {
    const profile  = State.profile;
    const prog     = State.programme;
    const streak   = State.streak;

    if (!profile || !prog) return;

    const estFemme = profile.genre === 'femme';

    // Vérifier fin de programme
    const semaineCourante = Programmes.getSemaineActuelle(profile);
    if (semaineCourante > 12) {
      this._renderProgrammeTermine(profile);
      return;
    }

    // Salutation selon heure
    const h = new Date().getHours();
    let salut = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
    document.getElementById('dashboard-greeting').textContent = salut + ',';
    document.getElementById('dashboard-name').textContent = profile.prenom + ' 👋';

    // Avatar initiale
    document.getElementById('dashboard-avatar').textContent =
      (profile.prenom || '?')[0].toUpperCase();

    // Streak
    this._renderStreak(streak);

    // Vue semaine
    await this._renderWeek(profile, prog);

    // Prochaine séance
    this._renderNextSession(profile, prog);

    // Stats du mois
    await this._renderMonthStats();

    // Badges
    await this._renderBadges();

    // Bouton démarrer séance
    document.getElementById('btn-start-session').onclick = () => {
      SessionScreen.start();
    };

    // Rappel entraînement
    this._renderTrainingReminder(profile, prog);
  },

  _renderStreak(streak) {
    if (!streak) return;

    document.getElementById('streak-count').textContent = streak.current_streak;
    document.getElementById('streak-record-label').textContent =
      `Record : ${streak.best_streak} jour${streak.best_streak > 1 ? 's' : ''}`;

    // Barre : progression vers le record
    const pct = streak.best_streak > 0
      ? Math.min((streak.current_streak / streak.best_streak) * 100, 100)
      : 0;
    document.getElementById('streak-bar-fill').style.width = pct + '%';

    // Flamme animée si streak > 0
    const flame = document.getElementById('streak-flame');
    if (streak.current_streak > 0) flame.classList.add('flame-active');
    else flame.classList.remove('flame-active');

    // Joker freeze
    const freezeBtn = document.getElementById('streak-freeze-btn');
    if (streak.freeze_available && streak.current_streak > 0) {
      freezeBtn.classList.remove('hidden');
      freezeBtn.onclick = () => this._useFreeze();
    } else {
      freezeBtn.classList.add('hidden');
    }
  },

  async _useFreeze() {
    const { error } = await supabase
      .from('streaks')
      .update({ freeze_available: false, freeze_used_date: new Date().toISOString().split('T')[0] })
      .eq('user_id', State.user.id);

    if (!error) {
      State.streak.freeze_available = false;
      document.getElementById('streak-freeze-btn').classList.add('hidden');
      Toast.show('Joker freeze utilisé ! Ton streak est protégé pour ce jour.', 'success');
    }
  },

  async _renderWeek(profile, prog) {
    const semaine = Programmes.getSemaineActuelle(profile);
    const bloc    = Programmes.getBloc(prog, semaine);

    // Récupérer les séances de cette semaine depuis Supabase
    const debutSemaine = this._debutSemaine();
    const finSemaine   = this._finSemaine();

    const { data: sessionsDB } = await supabase
      .from('sessions')
      .select('date, type_seance, completee')
      .eq('user_id', State.user.id)
      .gte('date', debutSemaine)
      .lte('date', finSemaine);

    const doneByDate = {};
    (sessionsDB || []).forEach(s => {
      if (s.completee) doneByDate[s.date] = s.type_seance;
    });

    // Construire les 7 jours
    const aujourd = new Date().toISOString().split('T')[0];
    const jours   = ['L','M','M','J','V','S','D'];
    const dates   = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(debutSemaine);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    // Séances planifiées — utiliser jours personnalisés si définis, sinon ceux du programme
    const seancesJours = {};
    const joursMap = { lundi:0, mardi:1, mercredi:2, jeudi:3, vendredi:4, samedi:5, dimanche:6,
                       Lundi:0, Mardi:1, Mercredi:2, Jeudi:3, Vendredi:4, Samedi:5, Dimanche:6 };
    const joursPerso = profile.jours_entrainement && profile.jours_entrainement.length > 0
      ? profile.jours_entrainement
      : null;

    if (joursPerso) {
      // Répartir les séances du bloc sur les jours perso (round-robin)
      joursPerso.forEach((j, idx) => {
        const seance = bloc.seances[idx % bloc.seances.length];
        if (seance && joursMap[j] !== undefined) seancesJours[joursMap[j]] = seance;
      });
    } else {
      bloc.seances.forEach(s => {
        (s.jours || []).forEach(j => {
          if (joursMap[j] !== undefined) seancesJours[joursMap[j]] = s;
        });
      });
    }

    document.getElementById('week-dots').innerHTML = dates.map((date, i) => {
      const done   = !!doneByDate[date];
      const today  = date === aujourd;
      const seance = seancesJours[i];
      const repos  = !seance;

      let cls  = 'week-dot';
      let type = 'repos';
      if (done) { cls += ' done'; type = doneByDate[date]; }
      else if (today && seance) { cls += ' today'; type = seance.type; }
      else if (repos) { cls += ' repos'; }

      return `<div class="${cls}">
        <div class="week-dot-circle dot-${type}">
          ${done ? '✓' : today ? '•' : ''}
        </div>
        <span class="week-dot-label">${jours[i]}</span>
      </div>`;
    }).join('');

    // Numéro de semaine
    const semLabel = document.querySelector('.card-title');
    if (semLabel) semLabel.textContent = `Semaine ${semaine}/12`;
  },

  _renderNextSession(profile, prog) {
    const semaine = Programmes.getSemaineActuelle(profile);
    const bloc    = Programmes.getBloc(prog, semaine);

    // Trouver la prochaine séance (selon le jour de la semaine)
    const today   = new Date().getDay(); // 0=dim, 1=lun...
    const joursMapNum = { lundi:1, mardi:2, mercredi:3, jeudi:4, vendredi:5, samedi:6, dimanche:0,
                          Lundi:1, Mardi:2, Mercredi:3, Jeudi:4, Vendredi:5, Samedi:6, Dimanche:0 };
    const joursPersoNext = profile.jours_entrainement && profile.jours_entrainement.length > 0
      ? profile.jours_entrainement
      : null;

    let nextSeance = bloc.seances[0];
    let minDiff = 8;

    if (joursPersoNext) {
      joursPersoNext.forEach((j, idx) => {
        const jourd = joursMapNum[j];
        if (jourd === undefined) return;
        let diff = jourd - today;
        if (diff < 0) diff += 7;
        if (diff < minDiff) { minDiff = diff; nextSeance = bloc.seances[idx % bloc.seances.length]; }
      });
    } else {
      bloc.seances.forEach(s => {
        (s.jours || []).forEach(j => {
          const jourd = joursMapNum[j];
          if (jourd === undefined) return;
          let diff = jourd - today;
          if (diff < 0) diff += 7;
          if (diff < minDiff) { minDiff = diff; nextSeance = s; }
        });
      });
    }

    // Stocker pour le bouton start
    State.session.data = {
      programme_id: prog.id,
      semaine,
      seance: nextSeance,
      bloc,
    };

    const tagEl  = document.getElementById('next-session-tag');
    const nameEl = document.getElementById('next-session-name');
    const metaEl = document.getElementById('next-session-meta');

    tagEl.textContent  = nextSeance.nom;
    tagEl.className    = `session-tag tag-${nextSeance.type}`;
    nameEl.textContent = nextSeance.nom;

    const nbEx = nextSeance.exercices.filter(e => !e.isWarmup).length;
    metaEl.innerHTML = `<span>${profile.duree_seance || prog.duree} min</span><span>${nbEx} exercices</span><span>Semaine ${semaine}</span>`;
  },

  async _renderMonthStats() {
    const debut = new Date();
    debut.setDate(1);
    const debutStr = debut.toISOString().split('T')[0];

    const { data: sessions } = await supabase
      .from('sessions')
      .select('completee, duree_sec, date, nom_seance')
      .eq('user_id', State.user.id)
      .gte('date', debutStr)
      .order('date', { ascending: false });

    const completees   = (sessions || []).filter(s => s.completee);
    const streakVal    = State.streak ? State.streak.current_streak : 0;
    const nextSeance   = State.session.data?.seance?.nom || '—';

    // Dernière séance
    const derniere = completees[0];
    const derniereLabel = derniere
      ? new Date(derniere.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
      : '—';

    document.getElementById('month-stats').innerHTML = `
      <div class="month-stat">
        <span class="month-stat-value">${completees.length}</span>
        <div class="month-stat-label">Séances ce mois</div>
      </div>
      <div class="month-stat">
        <span class="month-stat-value">${streakVal}🔥</span>
        <div class="month-stat-label" style="text-align:center">Série en cours</div>
      </div>
      <div class="month-stat month-stat-wide">
        <span class="month-stat-value month-stat-sm">${derniereLabel}</span>
        <div class="month-stat-label">Dernière séance</div>
      </div>
      <div class="month-stat month-stat-wide">
        <span class="month-stat-value month-stat-sm">${nextSeance}</span>
        <div class="month-stat-label">Prochaine séance</div>
      </div>
    `;
  },

  async _renderBadges() {
    const { data: unlocked } = await supabase
      .from('badges_unlocked')
      .select('badge_id')
      .eq('user_id', State.user.id);

    const unlockedIds = new Set((unlocked || []).map(b => b.badge_id));
    State.badges = [...unlockedIds];

    const allBadges = BadgesScreen.ALL_BADGES;
    const container = document.getElementById('dashboard-badges');

    container.innerHTML = allBadges.map(b => {
      const done = unlockedIds.has(b.id);
      return `<div class="badge-mini ${done ? 'earned' : 'locked'}" title="${b.nom}">
        <div class="badge-mini-circle">${b.emoji}</div>
        <span class="badge-mini-name">${b.nom}</span>
      </div>`;
    }).join('');
  },

  async _renderTrainingReminder(profile, prog) {
    // Supprimer bannière existante
    const existing = document.getElementById('training-reminder');
    if (existing) existing.remove();

    if (!profile.notif_push) return;

    const today = new Date().toISOString().split('T')[0];
    const h = new Date().getHours();
    if (h < 9) return; // pas avant 9h

    // Vérifier si séance faite aujourd'hui
    const { data: dejaFaite } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', State.user.id)
      .eq('date', today)
      .eq('completee', true)
      .limit(1)
      .single();

    if (dejaFaite) return;

    // Vérifier si aujourd'hui est un jour d'entraînement
    const joursMap = { 0:'dimanche', 1:'lundi', 2:'mardi', 3:'mercredi', 4:'jeudi', 5:'vendredi', 6:'samedi' };
    const jourAujourd = joursMap[new Date().getDay()];
    const joursPerso = profile.jours_entrainement && profile.jours_entrainement.length > 0
      ? profile.jours_entrainement
      : null;

    let estJourEntrainement = false;
    if (joursPerso) {
      estJourEntrainement = joursPerso.includes(jourAujourd);
    } else {
      const semaine = Programmes.getSemaineActuelle(profile);
      const bloc = Programmes.getBloc(prog, semaine);
      const joursProgMap = { lundi:1, mardi:2, mercredi:3, jeudi:4, vendredi:5, samedi:6, dimanche:0,
                              Lundi:1, Mardi:2, Mercredi:3, Jeudi:4, Vendredi:5, Samedi:6, Dimanche:0 };
      bloc.seances.forEach(s => {
        (s.jours || []).forEach(j => {
          if (joursProgMap[j] === new Date().getDay()) estJourEntrainement = true;
        });
      });
    }

    if (!estJourEntrainement) return;

    const estFemme = profile.genre === 'femme';
    const banner = document.createElement('div');
    banner.id = 'training-reminder';
    banner.className = 'training-reminder';
    banner.innerHTML = `
      <span>💪 C'est ton jour d'entraînement ! Prêt${estFemme ? 'e' : ''} ?</span>
      <button onclick="this.parentElement.remove()" class="reminder-close">✕</button>
    `;

    const scroll = document.querySelector('#screen-dashboard .screen-scroll');
    if (scroll) scroll.prepend(banner);

    // Browser notification si permission accordée
    if (Notification.permission === 'granted') {
      new Notification('RepWell — Séance du jour !', {
        body: `C'est ton jour d'entraînement, ${profile.prenom} ! 💪`,
        icon: '/assets/images/logo-repwell.png',
      });
    }
  },

  async _renderProgrammeTermine(profile) {
    // Afficher un écran de félicitations dans le dashboard
    const scroll = document.querySelector('#screen-dashboard .screen-scroll');
    if (!scroll) return;

    scroll.innerHTML = `
      <div class="dashboard-header">
        <div>
          <p class="greeting">Félicitations,</p>
          <h1 class="dashboard-name">${profile.prenom} 🏆</h1>
        </div>
        <div class="avatar">${(profile.prenom || '?')[0].toUpperCase()}</div>
      </div>
      <div class="card" style="text-align:center;padding:var(--space-xl)">
        <div style="font-size:64px;margin-bottom:var(--space-md)">🎉</div>
        <h2 style="font-family:var(--font-serif);font-size:22px;color:var(--text);margin-bottom:var(--space-sm)">Programme terminé !</h2>
        <p style="font-size:14px;color:var(--text-soft);line-height:1.6;margin-bottom:var(--space-xl)">
          Tu as complété les 12 semaines de ton programme. C'est une vraie réussite — ton corps a changé, ta discipline aussi.
        </p>
        <button id="btn-restart-programme" class="btn-primary btn-full">🔄 Recommencer le programme</button>
        <button id="btn-voir-progression" class="btn-secondary btn-full" style="margin-top:var(--space-sm)">📈 Voir ma progression</button>
      </div>
    `;

    document.getElementById('btn-restart-programme').onclick = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('user_profiles')
        .update({ programme_start_date: today })
        .eq('user_id', State.user.id);
      if (!error) {
        State.profile.programme_start_date = today;
        Toast.show('Programme relancé ! Bonne semaine 1 💪', 'success');
        this.render();
      }
    };

    document.getElementById('btn-voir-progression').onclick = () => {
      Router.go('progress');
    };
  },

  _debutSemaine() {
    const d = new Date();
    const day = d.getDay(); // 0=dim
    const diff = day === 0 ? -6 : 1 - day; // lundi
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  },

  _finSemaine() {
    const d = new Date(this._debutSemaine());
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  },
};
