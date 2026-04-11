/* =====================================================
   REPWELL — Authentification Supabase
   ===================================================== */

const Auth = {
  async init() {
    Router.init();

    // Vérifier la session existante
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      await this.onLogin(session.user);
    } else {
      this.showAuth();
    }

    // Écouter les changements d'auth
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await this.onLogin(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.showAuth();
      } else if (event === 'TOKEN_REFRESH_FAILED') {
        Toast.show('Session expirée — reconnecte-toi.', 'error');
        await supabase.auth.signOut();
        this.showAuth();
      }
    });

    // Surveillance réseau
    window.addEventListener('offline', () => {
      document.getElementById('network-banner').classList.remove('hidden');
    });
    window.addEventListener('online', () => {
      document.getElementById('network-banner').classList.add('hidden');
      Toast.show('Connexion rétablie ✓', 'success');
    });
  },

  async onLogin(user) {
    State.user = user;

    // Charger le profil
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    document.getElementById('screen-loading').classList.remove('active');

    if (!profile) {
      // Premier login → audit
      State.profile = null;
      Router.go('audit');
      AuditScreen.init();
    } else {
      State.profile = profile;
      State.programme = Programmes.get(profile.programme_id);
      await this.loadStreak(user.id);
      Router.go('dashboard');
    }
  },

  async loadStreak(userId) {
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      State.streak = data;
    } else {
      const { data: created } = await supabase
        .from('streaks')
        .insert({
          user_id: userId,
          current_streak: 0,
          best_streak: 0,
          freeze_available: true,
        })
        .select()
        .single();
      State.streak = created;
    }
  },

  async logout() {
    await supabase.auth.signOut();
  },

  showAuth() {
    document.getElementById('screen-loading').classList.remove('active');
    Router.go('auth');
    AuthScreen.init();
  },
};
