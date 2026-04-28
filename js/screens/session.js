/* =====================================================
   REPWELL — Session Screen (séance interactive)
   ===================================================== */

const SessionScreen = {
  globalTimerInterval: null,
  exercices: [],
  currentEx: 0,
  currentSerie: 0,   // 0-based index de la série active
  seriesState: [],   // [{done: bool, poids: number, reps: number}]
  weight: 20,
  sessionId: null,
  startTime: null,

  async start() {
    const sessionData = State.session.data;
    if (!sessionData) return;

    // Verrouillage quotidien — empêcher 2 séances le même jour
    const today = new Date().toISOString().split('T')[0];
    const { data: dejaFaite } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', State.user.id)
      .eq('date', today)
      .eq('completee', true)
      .limit(1)
      .single();

    if (dejaFaite) {
      this._showRestModal(sessionData.seance.nom);
      return;
    }

    const seance = sessionData.seance;
    this.exercices = seance.exercices;

    // Réinitialiser l'état
    this.currentEx    = 0;
    this.currentSerie = 0;
    this.startTime    = Date.now();
    this.sessionId    = null;

    // Créer la session en BDD
    const { data: sess, error } = await supabase
      .from('sessions')
      .insert({
        user_id:     State.user.id,
        programme_id: sessionData.programme_id,
        semaine:     sessionData.semaine,
        num_seance:  1,
        type_seance: seance.type,
        nom_seance:  seance.nom,
        completee:   false,
        date:        new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (!error) this.sessionId = sess.id;

    State.session.sessionId = this.sessionId;
    State.session.active    = true;
    State.session.startTime = this.startTime;
    State.session.prs       = [];

    // Initialiser l'état des séries pour le premier exercice
    this._initSeriesState();

    Router.go('session');
    this._render();
    this._startGlobalTimer(); // démarre dès l'arrivée sur l'écran

    // Bouton retour
    document.getElementById('session-back').onclick = () => this._confirmBack();
  },

  _initSeriesState() {
    const ex = this.exercices[this.currentEx];
    if (!ex) return;
    const nb = ex.series || 4;
    this.seriesState = Array.from({ length: nb }, () => ({ done: false, poids: this.weight, reps: ex.reps || 0 }));
    this.currentSerie = 0;
  },

  async _render() {
    const ex = this.exercices[this.currentEx];
    if (!ex) { this._finishSession(); return; }

    // Barre de progression
    const nbEx    = this.exercices.filter(e => !e.isWarmup).length;
    const doneEx  = this.exercices.slice(0, this.currentEx).filter(e => !e.isWarmup).length;
    const pct     = nbEx > 0 ? Math.round((doneEx / nbEx) * 100) : 0;
    document.getElementById('session-progress-fill').style.width = pct + '%';
    document.getElementById('session-progress-label').textContent =
      `Exercice ${Math.min(doneEx + 1, nbEx)} sur ${nbEx}`;

    // Titre séance
    const seance = State.session.data.seance;
    document.getElementById('session-title').textContent = seance.nom;
    document.getElementById('session-week-label').textContent =
      `Semaine ${State.session.data.semaine}`;

    // Carte exercice
    document.getElementById('exercise-name').textContent = ex.nom;
    document.getElementById('exercise-muscles').textContent = ex.muscles;
    document.getElementById('exercise-specs').innerHTML =
      `<span class="spec-chip">${ex.series} séries</span>
       <span class="spec-chip">${ex.reps} reps</span>
       <span class="spec-chip">${ex.repos > 0 ? ex.repos + 's repos' : 'Sans repos'}</span>`;

    // SVG placeholder avec initiales
    document.getElementById('exercise-svg').innerHTML =
      `<div class="exercise-svg-placeholder">${ex.nom.charAt(0)}</div>`;

    // Conseils techniques
    const tipsList  = document.getElementById('exercise-tips-list');
    const tipsPanel = document.getElementById('exercise-tips-panel');
    const tipsBtn   = document.getElementById('btn-tips-toggle');
    if (ex.notes) {
      tipsList.innerHTML = ex.notes.split('—').map(t => `<li>${t.trim()}</li>`).join('');
    } else {
      tipsList.innerHTML = '<li>Effectue le mouvement avec une amplitude complète.</li>';
    }
    tipsPanel.classList.add('hidden');
    tipsBtn.textContent = '💡 Conseils techniques';
    tipsBtn.onclick = () => {
      const open = tipsPanel.classList.toggle('hidden');
      tipsBtn.textContent = open ? '💡 Conseils techniques' : '💡 Masquer les conseils';
    };

    // Masquer/afficher la zone de saisie de poids
    const weightZone = document.getElementById('weight-input-zone');
    const isWarmup   = !!ex.isWarmup;
    const isHIIT     = !!ex.isHIIT;

    if (isWarmup || isHIIT) {
      weightZone.classList.add('hidden');
      // Pour HIIT: chrono 40s par exercice
      if (isHIIT) {
        document.getElementById('rest-timer-zone').classList.remove('hidden');
        RestTimer.start(40, () => this._advanceExercise());
      } else {
        // Échauffement: bouton "Passer l'échauffement"
        document.getElementById('rest-timer-zone').classList.add('hidden');
        this._showWarmupControls();
      }
    } else {
      weightZone.classList.remove('hidden');
      document.getElementById('rest-timer-zone').classList.add('hidden');
      this._renderSeriesTracker();
      this._initWeightInput(ex);
      this._bindWeightEvents(ex);
    }
  },

  _showWarmupControls() {
    const tracker = document.getElementById('series-tracker');
    tracker.innerHTML = `
      <div class="warmup-card">
        <p class="warmup-label">Échauffement — effectue les 10 minutes à intensité modérée</p>
        <button id="btn-done-warmup" class="btn-primary btn-full">Échauffement terminé ✓</button>
        <button id="btn-skip-warmup" class="btn-secondary btn-full" style="margin-top:8px">Passer →</button>
      </div>`;
    document.getElementById('btn-done-warmup').onclick = () => this._advanceExercise();
    document.getElementById('btn-skip-warmup').onclick = () => this._advanceExercise();
  },

  _renderSeriesTracker() {
    const ex = this.exercices[this.currentEx];
    const tracker = document.getElementById('series-tracker');

    tracker.innerHTML = this.seriesState.map((s, i) => {
      let cls = 'serie-card';
      if (s.done)           cls += ' done';
      else if (i === this.currentSerie) cls += ' active';
      else                  cls += ' locked';

      return `<div class="${cls}" data-serie="${i}">
        <div class="serie-num">Série ${i + 1}</div>
        <div class="serie-info">
          ${s.done
            ? `<span class="serie-done-info">${s.poids} kg × ${s.reps} reps ✓</span>`
            : `<span class="serie-target">${ex.reps} reps</span>`
          }
        </div>
      </div>`;
    }).join('');
  },

  async _initWeightInput(ex) {
    // Charger le dernier poids utilisé pour cet exercice
    const { data: last } = await supabase
      .from('serie_logs')
      .select('poids_kg')
      .eq('user_id', State.user.id)
      .eq('exercice_id', ex.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    this.weight = last ? last.poids_kg : 20;
    document.getElementById('weight-display').textContent = this.weight;
  },

    _bindWeightEvents(ex) {
    document.getElementById('weight-minus').onclick = () => {
      if (this.weight > 0) {
        this.weight = Math.round((this.weight - 2.5) * 10) / 10;
        document.getElementById('weight-display').textContent = this.weight;
      }
    };
    document.getElementById('weight-plus').onclick = () => {
      this.weight = Math.round((this.weight + 2.5) * 10) / 10;
      document.getElementById('weight-display').textContent = this.weight;
    };

    const btn = document.getElementById('btn-validate-serie');
    btn.disabled    = false;
    btn.textContent = 'Valider la série ✓';
    btn.onclick = () => this._validateSerie(ex);
    document.getElementById('btn-skip-rest').onclick = () => RestTimer.hide();
    document.getElementById('btn-ready').onclick = () => this._onReady();
  },



  async _validateSerie(ex) {
    const serie = this.seriesState[this.currentSerie];
    serie.done  = true;
    serie.poids = this.weight;
    serie.reps  = ex.reps;

    Sounds.tick();

    // Vérifier PR
    const isPR = await this._checkPR(ex, this.weight);
    if (isPR) {
      document.getElementById('pr-badge').classList.remove('hidden');
      Animations.flashPR(document.getElementById('weight-input-zone'));
      State.session.prs.push({ exercice_id: ex.id, nom: ex.nom, poids: this.weight });
      Sounds.pr();
    }

    // Sauvegarder en BDD
    if (this.sessionId) {
      await supabase.from('serie_logs').insert({
        session_id:   this.sessionId,
        user_id:      State.user.id,
        exercice_id:  ex.id,
        exercice_nom: ex.nom,
        serie_num:    this.currentSerie + 1,
        poids_kg:     this.weight,
        reps:         ex.reps,
      });
    }

    // Renouveler le tracker
    this._renderSeriesTracker();

    // Vérifier si toutes les séries sont faites
    const allDone = this.seriesState.every(s => s.done);
    if (allDone) {
      // Dernier exercice ?
      if (this.currentEx >= this.exercices.length - 1) {
        this._finishSession();
      } else {
        this._advanceExercise();
      }
      return;
    }

    // Avancer à la série suivante + démarrer le repos
    this.currentSerie++;
    this._renderSeriesTracker();

    if (ex.repos > 0) {
      document.getElementById('weight-input-zone').classList.add('hidden');
      document.getElementById('pr-badge').classList.add('hidden');
      // onEnd = appelé par RestTimer quand "Prêt" ou "Passer" est cliqué
      RestTimer.start(ex.repos, () => this._onReady());
    }
  },

  _onReady() {
    document.getElementById('rest-timer-zone').classList.add('hidden');
    document.getElementById('weight-input-zone').classList.remove('hidden');
    this._renderSeriesTracker();
    this._bindWeightEvents(this.exercices[this.currentEx]);
    Sounds.tick();
  },

  _advanceExercise() {
    RestTimer.stop();
    const prevEx = this.exercices[this.currentEx];
    this.currentEx++;

    if (this.currentEx >= this.exercices.length) {
      this._finishSession();
      return;
    }

    this._initSeriesState();
    document.getElementById('weight-input-zone').classList.add('hidden');
    document.getElementById('pr-badge').classList.add('hidden');

    if (!prevEx?.isWarmup && !prevEx?.isHIIT) {
      const lbl = document.querySelector('.rest-label');
      if (lbl) lbl.textContent = 'Repos entre exercices';
      RestTimer.start(120, () => {
        const lbl2 = document.querySelector('.rest-label');
        if (lbl2) lbl2.textContent = 'Temps de repos';
        this._render();
      });
    } else {
      document.getElementById('rest-timer-zone').classList.add('hidden');
      this._render();
    }
  },

  async _checkPR(ex, poids) {
    const { data } = await supabase
      .from('serie_logs')
      .select('poids_kg')
      .eq('user_id', State.user.id)
      .eq('exercice_id', ex.id)
      .order('poids_kg', { ascending: false })
      .limit(1)
      .single();

    if (!data) return false;
    return poids > data.poids_kg;
  },

  async _finishSession() {
    this._stopGlobalTimer();
    Sounds.sessionEnd();
    const duree = Math.round((Date.now() - (this.startTime || Date.now())) / 1000);

    // Marquer la session comme complète
    if (this.sessionId) {
      await supabase.from('sessions')
        .update({ completee: true, duree_sec: duree })
        .eq('id', this.sessionId);
    }

    // Mettre à jour le streak
    await this._updateStreak();

    // Vérifier les badges
    await BadgesScreen.checkAfterSession({
      startTime: this.startTime,
      prs: State.session.prs,
    });

    // Préparer le récap
    State.recap = {
      shown: false,
      data: {
        duree,
        prs: [...State.session.prs],
        exercices: this.exercices.filter(e => !e.isWarmup).length,
        series: this.seriesState.length,
      },
    };

    State.session.active = false;
    Router.go('recap');
    RecapScreen.render();
  },

  async _updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const streak = State.streak;
    if (!streak) return;

    // Déjà compté aujourd'hui ?
    if (streak.last_session_date === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrent = 1;
    if (streak.last_session_date === yesterdayStr) {
      newCurrent = streak.current_streak + 1;
    }

    const newBest = Math.max(newCurrent, streak.best_streak);

    await supabase.from('streaks').update({
      current_streak:    newCurrent,
      best_streak:       newBest,
      last_session_date: today,
      updated_at:        new Date().toISOString(),
    }).eq('user_id', State.user.id);

    State.streak.current_streak    = newCurrent;
    State.streak.best_streak       = newBest;
    State.streak.last_session_date = today;
  },

  _startGlobalTimer() {
    const start = Date.now();
    this.globalTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const s = (elapsed % 60).toString().padStart(2, '0');
      const el = document.getElementById('session-global-timer');
      if (el) el.textContent = `${m}:${s}`;
    }, 1000);
  },

  _stopGlobalTimer() {
    clearInterval(this.globalTimerInterval);
    this.globalTimerInterval = null;
  },

  _showRestModal(seanceNom) {
    const modal = document.createElement('div');
    modal.className = 'theme-modal-overlay';
    modal.innerHTML = `
      <div class="theme-modal">
        <p class="theme-modal-emoji">😴🌙</p>
        <h3 class="theme-modal-title">Séance déjà complétée aujourd'hui !</h3>
        <p style="font-size:14px;color:var(--text-soft);margin-bottom:var(--space-lg);line-height:1.5">
          Récupération nécessaire — prochaine séance disponible demain.<br><br>
          Le repos fait partie de la progression. C'est pendant la récupération que les muscles se renforcent. 💪
        </p>
        <div class="theme-modal-btns">
          <button id="rest-modal-ok" class="btn-primary" style="flex:1">Compris ✓</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('rest-modal-ok').onclick = () => modal.remove();
  },

  _confirmBack() {
    if (confirm('Quitter la séance ? Ta progression sera perdue.')) {
      this._stopGlobalTimer();
      RestTimer.stop();
      State.session.active = false;
      Router.go('dashboard');
      DashboardScreen.render();
    }
  },
};
