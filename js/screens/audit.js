/* =====================================================
   REPWELL — Audit Screen (7 étapes)
   ===================================================== */

const AuditScreen = {
  step: 1,
  total: 7,
  answers: {},

  steps: [
    { id:'prenom',      titre:'Comment tu t\'appelles ?',           sous:'On va personnaliser ton expérience.',             type:'text',         key:'prenom',       placeholder:'Ton prénom' },
    { id:'genre',       titre:'Es-tu un homme ou une femme ?',       sous:null,                                              type:'chips-single', key:'genre',        options:[{ label:'Homme', value:'homme' },{ label:'Femme', value:'femme' }] },
    { id:'objectif',    titre:'Ton objectif principal ?',           sous:'On peut ajuster plus tard.',                      type:'chips-single', key:'objectif',     options:[{ label:'🔥 Perdre de la graisse', value:'graisse' },{ label:'💪 Gagner du muscle', value:'muscle' },{ label:'⚡ Les deux à la fois', value:'mixte' },{ label:'❤️ Garder la forme', value:'forme' }] },
    { id:'lieu',        titre:'Où tu t\'entraînes ?',               sous:null,                                              type:'chips-single', key:'lieu',         options:[{ label:'🏋️ Salle de sport', value:'salle' },{ label:'🏠 Maison avec matériel', value:'maison_materiel' },{ label:'🤸 Maison sans matériel', value:'maison_corps' }] },
    { id:'frequence',   titre:'Combien de fois par semaine ?',      sous:'Choisis un rythme tenable sur la durée.',         type:'chips-single', key:'frequence',    options:[{ label:'2×', value:2 },{ label:'3×', value:3 },{ label:'4×', value:4 },{ label:'5×', value:5 }] },
    { id:'duree',       titre:'Durée de ta séance idéale ?',        sous:'Échauffement inclus.',                            type:'chips-single', key:'duree_seance', options:[{ label:'30 min', value:30 },{ label:'45 min', value:45 },{ label:'60 min', value:60 },{ label:'90 min', value:90 }] },
    { id:'contraintes', titre:'Contraintes physiques ?',            sous:'Plusieurs choix possibles. Aucune si tout va bien.', type:'chips-multi', key:'contraintes', options:[{ label:'🔴 Dos', value:'dos' },{ label:'🔴 Genoux', value:'genoux' },{ label:'🔴 Épaules', value:'epaules' },{ label:'🔴 Poignets', value:'poignets' },{ label:'🔴 Chevilles', value:'chevilles' },{ label:'✅ Aucune', value:'aucune' }] },
  ],

  init() {
    this.step = 1;
    this.answers = {};
    const prenom = sessionStorage.getItem('rw_prenom');
    if (prenom) this.answers.prenom = prenom;
    this.render();
  },

  render() {
    const s = this.steps[this.step - 1];

    const pct = Math.round((this.step / this.total) * 100);
    document.getElementById('audit-progress-fill').style.width = pct + '%';
    document.getElementById('audit-step-label').textContent = `Étape ${this.step}/${this.total}`;

    const backBtn = document.getElementById('audit-back');
    this.step > 1 ? backBtn.classList.remove('hidden') : backBtn.classList.add('hidden');

    document.getElementById('audit-content').innerHTML = this._buildHtml(s);
    this._restore(s);
    this._bind(s);
  },

  _buildHtml(s) {
    let h = `<div class="audit-step">
      <h2 class="audit-question">${s.titre}</h2>
      ${s.sous ? `<p class="audit-subtitle">${s.sous}</p>` : ''}`;

    if (s.type === 'text') {
      h += `<input type="text" id="audit-input" class="field-input" placeholder="${s.placeholder}" autocomplete="off">`;
    }

    if (s.type === 'chips-single' || s.type === 'chips-multi') {
      h += `<div class="audit-chips audit-choices${s.options.length === 2 ? ' two-col' : ''}">`;
      s.options.forEach(o => {
        h += `<button class="audit-chip" data-value="${o.value}">${o.label}</button>`;
      });
      h += `</div>`;
    }

    h += `</div>`;

    if (s.type !== 'chips-single') {
      h += `<button id="audit-next" class="btn-primary btn-full audit-cta">Continuer</button>`;
    }

    return h;
  },

  _restore(s) {
    const val = this.answers[s.key];
    if (val === undefined) return;

    if (s.type === 'text') {
      const el = document.getElementById('audit-input');
      if (el) el.value = val;
    } else if (s.type === 'chips-single') {
      document.querySelectorAll('.audit-chip').forEach(btn => {
        const bv = isNaN(btn.dataset.value) ? btn.dataset.value : Number(btn.dataset.value);
        if (bv === val) btn.classList.add('selected');
      });
    } else if (s.type === 'chips-multi' && Array.isArray(val)) {
      document.querySelectorAll('.audit-chip').forEach(btn => {
        if (val.includes(btn.dataset.value)) btn.classList.add('selected');
      });
    }
  },

  _bind(s) {
    document.getElementById('audit-back').onclick = () => {
      if (this.step > 1) { this.step--; this.render(); }
    };

    if (s.type === 'chips-single') {
      document.querySelectorAll('.audit-chip').forEach(btn => {
        btn.onclick = () => {
          const raw = btn.dataset.value;
          this.answers[s.key] = isNaN(raw) ? raw : Number(raw);
          this._advance();
        };
      });
    }

    if (s.type === 'chips-multi') {
      document.querySelectorAll('.audit-chip').forEach(btn => {
        btn.onclick = () => {
          const val = btn.dataset.value;
          if (val === 'aucune') {
            document.querySelectorAll('.audit-chip').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
          } else {
            document.querySelector('.audit-chip[data-value="aucune"]')?.classList.remove('selected');
            btn.classList.toggle('selected');
          }
        };
      });
      document.getElementById('audit-next').onclick = () => {
        this.answers[s.key] = [...document.querySelectorAll('.audit-chip.selected')]
          .map(b => b.dataset.value).filter(v => v !== 'aucune');
        this._advance();
      };
    }

    if (s.type === 'text') {
      const input = document.getElementById('audit-input');
      if (input) input.focus();
      document.getElementById('audit-next').onclick = () => {
        const val = input?.value.trim();
        if (!val) { input?.classList.add('field-error'); return; }
        input.classList.remove('field-error');
        this.answers[s.key] = val;
        this._advance();
      };
      input?.addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('audit-next')?.click();
      });
    }
  },

  _advance() {
    if (this.step < this.total) { this.step++; this.render(); }
    else this._submit();
  },

  async _submit() {
    const btn = document.getElementById('audit-next');
    if (btn) { btn.disabled = true; btn.textContent = 'Enregistrement…'; }

    const programmeId = Programmes.assign(this.answers);

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id:      State.user.id,
        prenom:       this.answers.prenom || '',
        genre:        this.answers.genre || null,
        objectif:     this.answers.objectif || null,
        lieu:         this.answers.lieu || null,
        frequence:    this.answers.frequence || null,
        duree_seance: this.answers.duree_seance || null,
        contraintes:  this.answers.contraintes || [],
        programme_id: programmeId,
        niveau:       'debutant',
      })
      .select()
      .single();

    if (error) {
      Toast.show('Erreur lors de l\'enregistrement. Réessaie.', 'error');
      if (btn) { btn.disabled = false; btn.textContent = 'Continuer'; }
      return;
    }

    sessionStorage.removeItem('rw_prenom');
    State.profile   = data;
    State.programme = Programmes.get(programmeId);
    await Auth.loadStreak(State.user.id);

    Router.go('result');
    ResultScreen.render();
  },
};
