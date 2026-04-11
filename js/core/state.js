/* =====================================================
   REPWELL — State global de l'application
   ===================================================== */

const State = {
  user: null,           // Objet Supabase auth user
  profile: null,        // user_profiles row
  programme: null,      // Programme assigné (depuis programmes.js)
  streak: null,         // streaks row
  badges: [],           // badges_unlocked rows

  // Session en cours
  session: {
    active: false,
    data: null,         // Métadonnées de la séance (programme, semaine, type...)
    startTime: null,    // Date.now() au démarrage
    exerciseIndex: 0,   // Index exercice actuel
    series: [],         // État de chaque série [{done, poids, reps}]
    prs: [],            // Records battus [{exercice_id, ancien, nouveau}]
    sessionId: null,    // ID en base Supabase
  },

  // Récap (pour éviter de rejouer les animations)
  recap: {
    shown: false,
    data: null,
  },

  reset() {
    this.session = {
      active: false,
      data: null,
      startTime: null,
      exerciseIndex: 0,
      series: [],
      prs: [],
      sessionId: null,
    };
    this.recap = { shown: false, data: null };
  },
};
