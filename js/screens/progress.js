/* =====================================================
   REPWELL — Progress Screen (graphiques Chart.js)
   ===================================================== */

const ProgressScreen = {
  charts: {},

  async render() {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, date, type_seance, completee, duree_sec')
      .eq('user_id', State.user.id)
      .eq('completee', true)
      .order('date', { ascending: true });

    if (!sessions || sessions.length < 2) {
      document.getElementById('progress-empty').classList.remove('hidden');
      document.getElementById('progress-charts').classList.add('hidden');
      return;
    }

    document.getElementById('progress-empty').classList.add('hidden');
    document.getElementById('progress-charts').classList.remove('hidden');

    // Détruire les charts existants
    Object.values(this.charts).forEach(c => c && c.destroy());
    this.charts = {};

    // Charger les serie_logs
    const sessionIds = sessions.map(s => s.id);
    const { data: logs } = await supabase
      .from('serie_logs')
      .select('session_id, exercice_id, exercice_nom, poids_kg, reps')
      .in('session_id', sessionIds);

    // Peupler le select d'exercices
    const exerciceMap = {};
    (logs || []).forEach(l => { exerciceMap[l.exercice_id] = l.exercice_nom; });
    const selectEl = document.getElementById('exercise-select');
    selectEl.innerHTML = Object.entries(exerciceMap)
      .map(([id, nom]) => `<option value="${id}">${nom}</option>`)
      .join('');

    const firstExId = selectEl.value;
    this._renderWeightChart(firstExId, sessions, logs || []);

    selectEl.onchange = () => {
      this._renderWeightChart(selectEl.value, sessions, logs || []);
    };

    this._renderVolumeChart(sessions, logs || []);
    this._renderCompletionChart(sessions);
    this._renderStreakChart();
    this._renderHistory();

    const backBtn = document.getElementById('btn-progress-dashboard');
    if (backBtn) backBtn.onclick = () => { Router.go('dashboard'); DashboardScreen.render(); };
  },

  async _renderHistory() {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('date, nom_seance, type_seance, duree_sec')
      .eq('user_id', State.user.id)
      .eq('completee', true)
      .order('date', { ascending: false })
      .limit(10);

    const container = document.getElementById('progress-charts');
    const existing = document.getElementById('history-section');
    if (existing) existing.remove();

    if (!sessions || !sessions.length) return;

    const typeEmoji = { push:'💪', pull:'🏋️', legs:'🦵', full:'⚡', cardio:'🏃' };

    const section = document.createElement('div');
    section.id = 'history-section';
    section.className = 'card chart-card';
    section.innerHTML = `
      <h3 class="card-title">Dernières séances</h3>
      <div class="history-list">
        ${sessions.map(s => {
          const dureeMin = s.duree_sec ? Math.round(s.duree_sec / 60) + ' min' : '—';
          const dateLabel = new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
          const emoji = typeEmoji[s.type_seance] || '🏋️';
          return `<div class="history-row">
            <span class="history-emoji">${emoji}</span>
            <div class="history-info">
              <span class="history-nom">${s.nom_seance || s.type_seance}</span>
              <span class="history-date">${dateLabel}</span>
            </div>
            <span class="history-duree">${dureeMin}</span>
          </div>`;
        }).join('')}
      </div>
    `;

    // Insérer avant le bouton retour
    const backBtn = document.getElementById('btn-progress-dashboard');
    if (backBtn) container.insertBefore(section, backBtn);
    else container.appendChild(section);
  },

  _renderWeightChart(exerciceId, sessions, logs) {
    const sessionDateMap = {};
    sessions.forEach(s => { sessionDateMap[s.id] = s.date; });

    const points = logs
      .filter(l => l.exercice_id === exerciceId)
      .reduce((acc, l) => {
        const date = sessionDateMap[l.session_id];
        if (!acc[date] || l.poids_kg > acc[date]) acc[date] = l.poids_kg;
        return acc;
      }, {});

    const labels = Object.keys(points).sort();
    const data   = labels.map(d => points[d]);

    if (this.charts.weight) this.charts.weight.destroy();
    this.charts.weight = new Chart(document.getElementById('chart-weight'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Poids max (kg)',
          data,
          borderColor: '#F55F2E',
          backgroundColor: 'rgba(245,95,46,0.1)',
          tension: 0.3,
          fill: true,
        }],
      },
      options: this._lineOptions(),
    });
  },

  _renderVolumeChart(sessions, logs) {
    const sessionDateMap = {};
    sessions.forEach(s => { sessionDateMap[s.id] = s.date; });

    // Volume = somme(poids × reps) par semaine
    const volumeByWeek = {};
    logs.forEach(l => {
      const date = sessionDateMap[l.session_id];
      if (!date) return;
      const week = this._weekLabel(date);
      volumeByWeek[week] = (volumeByWeek[week] || 0) + (l.poids_kg * l.reps);
    });

    const labels = Object.keys(volumeByWeek).sort();
    const data   = labels.map(w => Math.round(volumeByWeek[w]));

    if (this.charts.volume) this.charts.volume.destroy();
    this.charts.volume = new Chart(document.getElementById('chart-volume'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Volume (kg·reps)',
          data,
          backgroundColor: '#F55F2E',
        }],
      },
      options: this._barOptions(),
    });
  },

  _renderCompletionChart(sessions) {
    const byWeek = {};
    sessions.forEach(s => {
      const week = this._weekLabel(s.date);
      if (!byWeek[week]) byWeek[week] = 0;
      byWeek[week]++;
    });

    const labels = Object.keys(byWeek).sort();
    const data   = labels.map(w => byWeek[w]);
    const freq   = State.profile ? (State.profile.frequence || 3) : 3;

    if (this.charts.completion) this.charts.completion.destroy();
    this.charts.completion = new Chart(document.getElementById('chart-completion'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Séances faites', data, backgroundColor: '#2D9E5F' },
          { label: 'Objectif', data: labels.map(() => freq), backgroundColor: 'rgba(0,0,0,0.1)', type: 'line', borderDash: [5, 5], borderColor: '#999', fill: false },
        ],
      },
      options: this._barOptions(),
    });
  },

  async _renderStreakChart() {
    // Compter le streak par semaine (nombre de jours avec séance)
    const { data: sessions } = await supabase
      .from('sessions')
      .select('date')
      .eq('user_id', State.user.id)
      .eq('completee', true)
      .order('date', { ascending: true });

    if (!sessions || !sessions.length) return;

    const byWeek = {};
    sessions.forEach(s => {
      const week = this._weekLabel(s.date);
      byWeek[week] = (byWeek[week] || 0) + 1;
    });

    const labels = Object.keys(byWeek).sort();
    const data   = labels.map(w => byWeek[w]);

    if (this.charts.streak) this.charts.streak.destroy();
    this.charts.streak = new Chart(document.getElementById('chart-streak'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Séances / semaine',
          data,
          borderColor: '#6B4EFF',
          backgroundColor: 'rgba(107,78,255,0.1)',
          tension: 0.3,
          fill: true,
        }],
      },
      options: this._lineOptions(),
    });
  },

  _weekLabel(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  },

  _lineOptions() {
    return {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { maxTicksLimit: 6 } },
        y: { beginAtZero: false },
      },
    };
  },

  _barOptions() {
    return {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { maxTicksLimit: 8 } },
        y: { beginAtZero: true },
      },
    };
  },
};
