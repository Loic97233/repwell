/* =====================================================
   REPWELL — Écran Auth (Login / Signup)
   ===================================================== */

const AuthScreen = {
  init() {
    // Tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Formulaires
    document.getElementById('form-login').addEventListener('submit', e => {
      e.preventDefault(); this.login();
    });
    document.getElementById('form-signup').addEventListener('submit', e => {
      e.preventDefault(); this.signup();
    });

    // Mot de passe oublié
    document.getElementById('btn-forgot-password').addEventListener('click', () => this.forgotPassword());
  },

  switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === tab)
    );
    document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
    document.getElementById('form-signup').classList.toggle('hidden', tab !== 'signup');
  },

  async login() {
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl    = document.getElementById('login-error');
    errEl.classList.add('hidden');

    if (!supabase) { Toast.error('Supabase non configuré'); return; }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      errEl.textContent = 'Email ou mot de passe incorrect.';
      errEl.classList.remove('hidden');
    }
  },

  async forgotPassword() {
    const email  = document.getElementById('login-email').value.trim();
    const errEl  = document.getElementById('login-error');
    errEl.classList.add('hidden');

    if (!email) {
      errEl.textContent = 'Entre ton email pour recevoir le lien.';
      errEl.classList.remove('hidden');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      errEl.textContent = 'Erreur — vérifie ton adresse email.';
      errEl.classList.remove('hidden');
    } else {
      errEl.textContent = '✓ Email envoyé ! Vérifie ta boîte mail.';
      errEl.style.color = 'var(--green)';
      errEl.classList.remove('hidden');
    }
  },

  async signup() {
    const prenom   = document.getElementById('signup-prenom').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const errEl    = document.getElementById('signup-error');
    errEl.classList.add('hidden');

    if (!prenom) { errEl.textContent = 'Entre ton prénom.'; errEl.classList.remove('hidden'); return; }
    if (password.length < 8) { errEl.textContent = 'Mot de passe trop court (8 caractères min).'; errEl.classList.remove('hidden'); return; }
    if (!supabase) { Toast.error('Supabase non configuré'); return; }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      errEl.textContent = error.message;
      errEl.classList.remove('hidden');
      return;
    }

    // Stocker le prénom temporairement (sera sauvé après l'audit)
    sessionStorage.setItem('rw_prenom', prenom);
  },
};
