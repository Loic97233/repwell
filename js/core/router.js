/* =====================================================
   REPWELL — Router SPA
   Gestion de la navigation entre écrans
   ===================================================== */

const Router = {
  current: null,
  screensWithNav: ['dashboard', 'programme', 'progress', 'badges', 'profile'],

  go(screenId) {
    // Masquer tous les écrans
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Afficher le nouvel écran
    const screen = document.getElementById(`screen-${screenId}`);
    if (!screen) return console.warn(`Screen #screen-${screenId} not found`);
    screen.classList.add('active');
    this.current = screenId;

    // Navigation bas
    const nav = document.getElementById('bottom-nav');
    if (this.screensWithNav.includes(screenId)) {
      nav.classList.remove('hidden');
      // Marquer l'onglet actif
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === screenId);
      });
    } else {
      nav.classList.add('hidden');
    }

    // Callback d'initialisation de l'écran
    const callbacks = {
      dashboard:   () => DashboardScreen?.render(),
      programme:   () => ProgrammeScreen?.render(),
      progress:    () => ProgressScreen?.render(),
      badges:      () => BadgesScreen?.render(),
      profile:     () => ProfileScreen?.render(),
      recap:       () => RecapScreen?.render(),
    };

    callbacks[screenId]?.();
  },

  init() {
    // Navigation bas
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.go(btn.dataset.screen));
    });
  },
};
