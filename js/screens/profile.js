/* =====================================================
   REPWELL — Profile Screen
   ===================================================== */

const ProfileScreen = {
  render() {
    const profile = State.profile;
    if (!profile) return;

    const estFemme = profile.genre === 'femme';

    const objectifLabel = { graisse: 'Perte de graisse', muscle: 'Prise de muscle', mixte: 'Mixte', forme: 'Garder la forme' };
    const lieuLabel     = { salle: 'Salle de sport', maison_materiel: 'Maison (matériel)', maison_corps: 'Maison (corps)' };

    document.getElementById('profile-content').innerHTML = `
      <!-- Infos personnelles -->
      <div class="card profile-section">
        <h3 class="card-title">Mes informations</h3>
        <div class="profile-row">
          <span class="profile-key">Prénom</span>
          <span class="profile-val">${profile.prenom}</span>
        </div>
        <div class="profile-row">
          <span class="profile-key">Genre</span>
          <span class="profile-val">${estFemme ? 'Femme' : 'Homme'}</span>
        </div>
        <div class="profile-row">
          <span class="profile-key">Objectif</span>
          <span class="profile-val">${objectifLabel[profile.objectif] || '-'}</span>
        </div>
        <div class="profile-row">
          <span class="profile-key">Lieu</span>
          <span class="profile-val">${lieuLabel[profile.lieu] || '-'}</span>
        </div>
        <div class="profile-row">
          <span class="profile-key">Fréquence</span>
          <span class="profile-val">${profile.frequence || '-'}× / semaine</span>
        </div>
        <div class="profile-row">
          <span class="profile-key">Durée séance</span>
          <span class="profile-val">${profile.duree_seance || '-'} min</span>
        </div>
        ${profile.contraintes && profile.contraintes.length > 0 ? `
        <div class="profile-row">
          <span class="profile-key">Contraintes</span>
          <span class="profile-val">${profile.contraintes.join(', ')}</span>
        </div>` : ''}
      </div>

      <!-- Programme -->
      <div class="card profile-section">
        <h3 class="card-title">Mon programme</h3>
        <div class="profile-row">
          <span class="profile-key">Programme</span>
          <span class="profile-val">${State.programme ? State.programme.nom : '-'}</span>
        </div>
        <div class="profile-row">
          <span class="profile-key">Semaine actuelle</span>
          <span class="profile-val">${Programmes.getSemaineActuelle(profile)}/12</span>
        </div>
      </div>

      <!-- Paramètres -->
      <div class="card profile-section">
        <h3 class="card-title">Paramètres</h3>
        <div class="profile-row profile-row-toggle">
          <span class="profile-key">Mode sombre</span>
          <label class="toggle">
            <input type="checkbox" id="toggle-dark" ${profile.dark_mode ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="profile-row profile-row-toggle">
          <span class="profile-key">Rappels entraînement</span>
          <label class="toggle">
            <input type="checkbox" id="toggle-notif" ${profile.notif_push ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- Planning -->
      <div class="card profile-section">
        <h3 class="card-title">Mon planning</h3>
        <p style="font-size:13px;color:var(--text-soft);margin-bottom:var(--space-md)">Choisis tes jours d'entraînement habituels.</p>
        <div id="planning-days" class="planning-days"></div>
        <button id="btn-save-planning" class="btn-primary btn-full" style="margin-top:var(--space-md)">Enregistrer le planning</button>
      </div>

      <!-- Compte -->
      <div class="card profile-section">
        <h3 class="card-title">Compte</h3>
        <div class="profile-row">
          <span class="profile-key">Email</span>
          <span class="profile-val profile-val-sm">${State.user ? State.user.email : ''}</span>
        </div>
        <button id="btn-logout" class="btn-secondary btn-full profile-logout">Se déconnecter</button>
      </div>
    `;

    // Planning — remplir les cases
    const joursLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const joursValues = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const joursActifs = profile.jours_entrainement || [];
    const planningEl = document.getElementById('planning-days');
    planningEl.innerHTML = joursValues.map((j, i) => `
      <label class="planning-day-btn ${joursActifs.includes(j) ? 'active' : ''}">
        <input type="checkbox" value="${j}" ${joursActifs.includes(j) ? 'checked' : ''} style="display:none">
        <span>${joursLabels[i]}</span>
      </label>
    `).join('');

    // Toggle visuel
    planningEl.querySelectorAll('.planning-day-btn').forEach(label => {
      label.onclick = () => {
        const cb = label.querySelector('input');
        cb.checked = !cb.checked;
        label.classList.toggle('active', cb.checked);
      };
    });

    // Sauvegarde planning
    document.getElementById('btn-save-planning').onclick = async () => {
      const checked = [...planningEl.querySelectorAll('input:checked')].map(cb => cb.value);
      const { error } = await supabase
        .from('user_profiles')
        .update({ jours_entrainement: checked })
        .eq('user_id', State.user.id);
      if (!error) {
        State.profile.jours_entrainement = checked;
        Toast.show('Planning mis à jour !', 'success');
      } else {
        Toast.show('Erreur lors de la sauvegarde.', 'error');
      }
    };

    // Notif toggle
    document.getElementById('toggle-notif').onchange = async (e) => {
      const enabled = e.target.checked;
      if (enabled && Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          e.target.checked = false;
          Toast.show('Notifications refusées par le navigateur.', 'error');
          return;
        }
      }
      await supabase.from('user_profiles').update({ notif_push: enabled }).eq('user_id', State.user.id);
      State.profile.notif_push = enabled;
      Toast.show(enabled ? 'Rappels activés ✓' : 'Rappels désactivés', 'success');
    };

    // Dark mode toggle
    document.getElementById('toggle-dark').onchange = async (e) => {
      const darkMode = e.target.checked;
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '');
      await supabase.from('user_profiles').update({ dark_mode: darkMode }).eq('user_id', State.user.id);
      State.profile.dark_mode = darkMode;
    };

    // Logout
    document.getElementById('btn-logout').onclick = () => Auth.logout();

    // Appliquer le dark mode actuel
    if (profile.dark_mode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  },
};
