/* =====================================================
   REPWELL — Chronomètre de repos SVG animé
   ===================================================== */

const RestTimer = {
  _interval: null,
  _remaining: 0,
  _total: 0,

  // Circonférence du cercle SVG (r=52, C=2πr≈327)
  CIRCUMFERENCE: 327,

  start(seconds, onEnd) {
    this.stop();
    this._total     = seconds;
    this._remaining = seconds;

    const zone      = document.getElementById('rest-timer-zone');
    const countdown = document.getElementById('rest-countdown');
    const arc       = document.getElementById('rest-arc');
    const btnReady  = document.getElementById('btn-ready');
    const btnSkip   = document.getElementById('btn-skip-rest');

    zone.classList.remove('hidden');
    btnReady.classList.add('hidden');
    btnSkip.classList.remove('hidden');

    this._update(countdown, arc);

    this._interval = setInterval(() => {
      this._remaining--;
      this._update(countdown, arc);

      if (this._remaining <= 0) {
        this.stop();
        Sounds.restEnd();
        // Bouton "Prêt" apparaît — ne passe PAS automatiquement
        btnReady.classList.remove('hidden');
        btnSkip.classList.add('hidden');

        btnReady.onclick = () => {
          zone.classList.add('hidden');
          btnReady.classList.add('hidden');
          onEnd?.();
        };

        btnSkip.onclick = null;
      }
    }, 1000);

    btnSkip.onclick = () => {
      this.stop();
      zone.classList.add('hidden');
      onEnd?.();
    };
  },

  stop() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  },

  hide() {
    this.stop();
    const zone = document.getElementById('rest-timer-zone');
    zone?.classList.add('hidden');
  },

  _update(countdown, arc) {
    countdown.textContent = this._remaining;
    const progress = this._remaining / this._total;
    const offset   = this.CIRCUMFERENCE * (1 - progress);
    arc.style.strokeDashoffset = offset;
  },
};
