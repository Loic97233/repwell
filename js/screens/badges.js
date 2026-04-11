/* =====================================================
   REPWELL — Badges Screen
   ===================================================== */

const BadgesScreen = {
  ALL_BADGES: [
    { id: 'first-session',  emoji: '🎯', nom: 'Première séance',   desc: 'Tu as complété ta première séance !' },
    { id: 'streak-7',       emoji: '🔥', nom: 'Semaine de feu',    desc: '7 jours de streak consécutifs' },
    { id: 'streak-30',      emoji: '🌟', nom: 'Mois légendaire',   desc: '30 jours de streak' },
    { id: 'sessions-10',    emoji: '💪', nom: 'Régulier',          desc: '10 séances complétées' },
    { id: 'sessions-50',    emoji: '🏆', nom: 'Demi-centenaire',   desc: '50 séances complétées' },
    { id: 'pr-first',       emoji: '⚡', nom: 'Premier record',    desc: 'Premier record personnel battu' },
    { id: 'programme-done', emoji: '🎓', nom: 'Programme complet', desc: '12 semaines terminées' },
    { id: 'early-bird',     emoji: '🌅', nom: 'Lève-tôt',         desc: 'Séance avant 8h du matin' },
  ],

  async render() {
    const { data: unlocked } = await supabase
      .from('badges_unlocked')
      .select('badge_id, unlocked_at')
      .eq('user_id', State.user.id);

    const unlockedMap = {};
    (unlocked || []).forEach(b => { unlockedMap[b.badge_id] = b.unlocked_at; });

    document.getElementById('badges-grid').innerHTML = this.ALL_BADGES.map(b => {
      const done = !!unlockedMap[b.id];
      const date = done ? new Date(unlockedMap[b.id]).toLocaleDateString('fr-FR') : null;

      return `<div class="badge-card ${done ? 'earned' : 'locked'}">
        <div class="badge-emoji-lg">${b.emoji}</div>
        <div class="badge-nom">${b.nom}</div>
        <div class="badge-desc">${done ? 'Obtenu le ' + date : b.desc}</div>
        ${done ? '<div class="badge-earned-mark">✓</div>' : '<div class="badge-locked-mark">🔒</div>'}
      </div>`;
    }).join('');
  },

  // Vérifier et débloquer les badges après une séance
  async checkAfterSession(sessionData) {
    const userId = State.user.id;

    // Compter les séances totales
    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('completee', true);

    const toUnlock = [];

    if (totalSessions === 1) toUnlock.push('first-session');
    if (totalSessions >= 10) toUnlock.push('sessions-10');
    if (totalSessions >= 50) toUnlock.push('sessions-50');

    if (State.streak) {
      if (State.streak.current_streak >= 7)  toUnlock.push('streak-7');
      if (State.streak.current_streak >= 30) toUnlock.push('streak-30');
    }

    if (sessionData.prs && sessionData.prs.length > 0) {
      toUnlock.push('pr-first');
    }

    // Heure matinale
    const startHour = new Date(sessionData.startTime).getHours();
    if (startHour < 8) toUnlock.push('early-bird');

    // Insérer les nouveaux badges (ignorer les doublons)
    const { data: existing } = await supabase
      .from('badges_unlocked')
      .select('badge_id')
      .eq('user_id', userId);

    const existingIds = new Set((existing || []).map(b => b.badge_id));
    const newBadges = toUnlock.filter(id => !existingIds.has(id));

    for (const badgeId of newBadges) {
      await supabase.from('badges_unlocked').insert({ user_id: userId, badge_id: badgeId });
      const badge = this.ALL_BADGES.find(b => b.id === badgeId);
      if (badge) Animations.showBadgeUnlock(badge, () => {});
    }
  },
};
