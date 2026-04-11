/* =====================================================
   REPWELL — Animations de victoire
   ===================================================== */

const Animations = {
  // Confettis légers (fin de séance)
  confetti(canvas, intense = false) {
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const count   = intense ? 120 : 40;
    const colors  = ['#F55F2E', '#2D9E5F', '#F59E0B', '#ffffff', '#3B82F6'];
    const pieces  = [];

    for (let i = 0; i < count; i++) {
      pieces.push({
        x:   Math.random() * canvas.width,
        y:   -10 - Math.random() * 80,
        w:   6 + Math.random() * 8,
        h:   4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx:  (Math.random() - 0.5) * 4,
        vy:  2 + Math.random() * 4,
        rot: Math.random() * 360,
        vr:  (Math.random() - 0.5) * 8,
      });
    }

    let frame;
    const duration = intense ? 4000 : 3000;
    const start    = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - start;
      const alpha   = Math.max(0, 1 - elapsed / duration);

      pieces.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (elapsed < duration) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  },

  // Flash orange pour PR
  flashPR(container) {
    container.classList.add('flash-victory');
    container.addEventListener('animationend', () => {
      container.classList.remove('flash-victory');
    }, { once: true });
  },

  // Overlay badge débloqué
  showBadgeUnlock(badge, onClose) {
    const overlay = document.createElement('div');
    overlay.className = 'badge-unlock-overlay';
    overlay.innerHTML = `
      <div class="badge-unlock-card">
        <span class="badge-unlock-emoji">${badge.emoji}</span>
        <div class="badge-unlock-label">Badge débloqué !</div>
        <div class="badge-unlock-name">${badge.name}</div>
        <div class="badge-unlock-desc">${badge.desc}</div>
        <button class="btn-primary btn-full">Super !</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.btn-primary').addEventListener('click', () => {
      overlay.remove();
      onClose?.();
    });
  },

  // Overlay passage de bloc
  showBlocTransition(blocNum, onClose) {
    const messages = {
      2: { title: 'Bloc 2 débloqué !', sub: 'Le programme monte en intensité. Tu es prêt(e).', emoji: '🚀' },
      3: { title: 'Bloc 3 — Intensification !', sub: 'Les dernières 4 semaines. Donne tout.', emoji: '💎' },
    };
    const m = messages[blocNum] || { title: 'Nouveau bloc !', sub: '', emoji: '🔥' };

    const overlay = document.createElement('div');
    overlay.className = 'bloc-transition-overlay';
    overlay.innerHTML = `
      <div class="bloc-transition-emoji">${m.emoji}</div>
      <div class="bloc-transition-title">${m.title}</div>
      <div class="bloc-transition-sub">${m.sub}</div>
      <br>
      <button class="btn-secondary" style="background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.4);color:white;margin-top:24px;">
        Continuer
      </button>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('button').addEventListener('click', () => {
      overlay.remove();
      onClose?.();
    });
  },
};
