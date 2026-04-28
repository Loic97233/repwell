/* =====================================================
   REPWELL — Bibliothèque de programmes
   Source : repwell_programmes.xlsx
   ===================================================== */

const PROGRAMMES = {

  /* ══════════════════════════════════════════════════
     PROGRAMME A — 3 séances / semaine — Salle
     ══════════════════════════════════════════════════ */
  'prog-a-3j': {
    id:        'prog-a-3j',
    nom:       'Programme A',
    lieu:      'salle',
    frequence: 3,
    objectif:  'mixte',
    niveau:    'debutant',
    duree:     60,
    semaines:  12,

    blocs: [
      /* ── BLOC 1 : Semaines 1-4 — Full Body x3 ── */
      {
        num: 1, semaines: [1,2,3,4], nom: 'Fondations',
        description: 'Apprentissage des mouvements. Charges légères. Temps de repos longs.',
        seances: [
          {
            type: 'full', nom: 'Full Body',
            jours: ['Lundi', 'Mercredi', 'Vendredi'],
            exercices: [
              { id:'a1-warmup',  ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',    materiel:'Machine cardio',        series:1,  reps:'10 min', repos:0,  notes:'Intensité modérée — essoufflement léger', isWarmup:true },
              { id:'a1-presse',  ordre:1, nom:'Presse à cuisses',               muscles:'Cuisses, fessiers', materiel:'Machine',                series:4,  reps:12,       repos:90, notes:"Pieds à largeur d'épaules — descendre jusqu'à 90°" },
              { id:'a1-dc-halt', ordre:2, nom:'Développé couché haltères',      muscles:'Pectoraux, épaules, triceps', materiel:'Haltères + banc plat', series:4,  reps:12,       repos:90, notes:'Coudes à 45° — contrôler la descente' },
              { id:'a1-tir-h',   ordre:3, nom:'Tirage horizontal assis poulie', muscles:'Dos, biceps',      materiel:'Machine poulie basse',   series:4,  reps:12,       repos:90, notes:'Tirer vers le nombril — serrer les omoplates' },
              { id:'a1-shprs',   ordre:4, nom:'Shoulder press machine',         muscles:'Épaules, triceps', materiel:'Machine guidée',         series:4,  reps:12,       repos:90, notes:'Ne pas verrouiller les coudes en haut' },
            ]
          },
        ]
      },

      /* ── BLOC 2 : Semaines 5-8 — Full Body x3 Progression ── */
      {
        num: 2, semaines: [5,6,7,8], nom: 'Progression',
        description: 'Volume augmente. Charges progressent. Temps de repos réduits.',
        seances: [
          {
            type: 'full', nom: 'Full Body',
            jours: ['Lundi', 'Mercredi', 'Vendredi'],
            exercices: [
              { id:'a2-warmup',  ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',    materiel:'Machine cardio',        series:1,  reps:'10 min', repos:0,  notes:'Légèrement plus intense qu\'au Bloc 1', isWarmup:true },
              { id:'a2-presse',  ordre:1, nom:'Presse à cuisses',               muscles:'Cuisses, fessiers', materiel:'Machine',                series:4,  reps:10,       repos:75, notes:'Augmenter les charges par rapport au Bloc 1' },
              { id:'a2-dc-halt', ordre:2, nom:'Développé couché haltères',      muscles:'Pectoraux, épaules, triceps', materiel:'Haltères + banc plat', series:4,  reps:10,       repos:75, notes:'Augmenter les charges — garder la forme' },
              { id:'a2-tir-h',   ordre:3, nom:'Tirage horizontal assis poulie', muscles:'Dos, biceps',      materiel:'Machine poulie basse',   series:4,  reps:10,       repos:75, notes:'Augmenter les charges — amplitude complète' },
              { id:'a2-shprs',   ordre:4, nom:'Shoulder press machine',         muscles:'Épaules, triceps', materiel:'Machine guidée',         series:4,  reps:10,       repos:75, notes:'Augmenter les charges progressivement' },
              { id:'a2-tir-v',   ordre:5, nom:'Tirage vertical poulie',         muscles:'Dos large, biceps',materiel:'Machine poulie haute',   series:4,  reps:10,       repos:75, notes:'Prise large — tirer vers la clavicule' },
            ]
          },
        ]
      },

      /* ── BLOC 3 : Semaines 9-12 — Push / Pull / Legs ── */
      {
        num: 3, semaines: [9,10,11,12], nom: 'Intensification',
        description: 'Surcharge progressive maximale. Intensité maximale.',
        seances: [
          {
            type: 'push', nom: 'Push',
            jours: ['Lundi'],
            exercices: [
              { id:'a3p-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',       materiel:'Machine cardio',          series:1, reps:'10 min', repos:0,  notes:'', isWarmup:true },
              { id:'a3p-dc',     ordre:1, nom:'Développé couché haltères',      muscles:'Pectoraux',           materiel:'Haltères + banc plat',    series:4, reps:10, repos:75, notes:'Charges maximales maîtrisées' },
              { id:'a3p-dci',    ordre:2, nom:'Développé incliné haltères',     muscles:'Pectoraux haut',      materiel:'Haltères + banc incliné', series:4, reps:10, repos:75, notes:'Inclinaison 30-45° — cibler le haut des pecs' },
              { id:'a3p-shprs',  ordre:3, nom:'Shoulder press machine',         muscles:'Épaules, triceps',    materiel:'Machine guidée',          series:4, reps:10, repos:75, notes:'' },
              { id:'a3p-elev',   ordre:4, nom:'Élévations latérales haltères',  muscles:'Épaules latérales',   materiel:'Haltères',                series:3, reps:12, repos:60, notes:"Coudes légèrement fléchis — monter à hauteur des épaules" },
              { id:'a3p-tri',    ordre:5, nom:'Extension triceps poulie',        muscles:'Triceps',             materiel:'Machine poulie haute',    series:3, reps:12, repos:60, notes:'Coudes collés au corps — extension complète' },
            ]
          },
          {
            type: 'pull', nom: 'Pull',
            jours: ['Mercredi'],
            exercices: [
              { id:'a3l-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',       materiel:'Machine cardio',        series:1, reps:'10 min', repos:0,  notes:'', isWarmup:true },
              { id:'a3l-tir-v',  ordre:1, nom:'Tirage vertical poulie',         muscles:'Dos large, biceps',   materiel:'Machine poulie haute',  series:4, reps:10, repos:75, notes:'Prise large — tirer vers la clavicule' },
              { id:'a3l-tir-h',  ordre:2, nom:'Tirage horizontal assis poulie', muscles:'Dos moyen, biceps',   materiel:'Machine poulie basse',  series:4, reps:10, repos:75, notes:'Tirer vers le nombril — serrer les omoplates' },
              { id:'a3l-row',    ordre:3, nom:'Rowing haltère unilatéral',      muscles:'Dos, biceps',         materiel:'Haltère + banc plat',   series:4, reps:10, repos:75, notes:'Dos horizontal — tirer le coude vers le plafond' },
              { id:'a3l-curl',   ordre:4, nom:'Curl biceps haltères',           muscles:'Biceps',              materiel:'Haltères',              series:3, reps:12, repos:60, notes:'Coudes fixes — supination en haut du mouvement' },
              { id:'a3l-cmar',   ordre:5, nom:'Curl marteau haltères',          muscles:'Biceps, avant-bras',  materiel:'Haltères',              series:3, reps:12, repos:60, notes:'Prise neutre — mouvement contrôlé' },
            ]
          },
          {
            type: 'legs', nom: 'Legs',
            jours: ['Vendredi'],
            exercices: [
              { id:'a3j-warmup', ordre:0, nom:"Vélo d'appartement (échauffement)", muscles:'Cardio bas du corps', materiel:"Vélo d'appartement", series:1, reps:'10 min', repos:0,  notes:'Cadence modérée — activation des jambes', isWarmup:true },
              { id:'a3j-fente',  ordre:1, nom:'Fentes marchées haltères',          muscles:'Cuisses, fessiers',  materiel:'Haltères',           series:3, reps:12, repos:60, notes:'Genou arrière proche du sol — buste droit' },
              { id:'a3j-hip',    ordre:2, nom:'Hip thrust (barre ou machine)',      muscles:'Fessiers',           materiel:'Barre / Machine hip thrust', series:4, reps:12, repos:75, notes:'Utiliser la machine si disponible — sinon barre' },
              { id:'a3j-presse', ordre:3, nom:'Presse à cuisses',                  muscles:'Cuisses, fessiers',  materiel:'Machine',            series:4, reps:10, repos:75, notes:"Pieds à largeur d'épaules — 90° de flexion" },
              { id:'a3j-legext', ordre:4, nom:'Leg extension',                     muscles:'Quadriceps',         materiel:'Machine',            series:4, reps:12, repos:60, notes:'Extension complète — contrôler la descente' },
              { id:'a3j-legcrl', ordre:5, nom:'Leg curl couché',                   muscles:'Ischio-jambiers',    materiel:'Machine',            series:4, reps:12, repos:60, notes:"Flexion complète — pas d'à-coups" },
            ]
          },
        ]
      },
    ],
  },

  /* ══════════════════════════════════════════════════
     PROGRAMME B — 4 séances / semaine — Salle
     ══════════════════════════════════════════════════ */
  'prog-b-4j': {
    id:        'prog-b-4j',
    nom:       'Programme B',
    lieu:      'salle',
    frequence: 4,
    objectif:  'mixte',
    niveau:    'debutant',
    duree:     60,
    semaines:  12,

    blocs: [
      /* ── BLOC 1 : Semaines 1-4 — Push / Pull / Legs / Full Body ── */
      {
        num: 1, semaines: [1,2,3,4], nom: 'Fondations',
        description: '12 reps — 90 sec repos — Apprentissage des mouvements.',
        seances: [
          {
            type: 'push', nom: 'Push',
            jours: ['Lundi'],
            exercices: [
              { id:'b1p-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',       materiel:'Machine cardio',          series:1, reps:'10 min', repos:0,  isWarmup:true },
              { id:'b1p-dc',     ordre:1, nom:'Développé couché haltères',      muscles:'Pectoraux, épaules, triceps', materiel:'Haltères + banc plat', series:4, reps:12, repos:90, notes:'Coudes à 45° — descente contrôlée' },
              { id:'b1p-btfly',  ordre:2, nom:'Machine butterfly',              muscles:'Pectoraux',            materiel:'Machine',                 series:4, reps:12, repos:90, notes:'Amplitude complète — tension constante' },
              { id:'b1p-shprs',  ordre:3, nom:'Shoulder press machine',         muscles:'Épaules, triceps',     materiel:'Machine guidée',          series:4, reps:12, repos:90, notes:'' },
              { id:'b1p-elev',   ordre:4, nom:'Élévations latérales haltères',  muscles:'Épaules latérales',    materiel:'Haltères',                series:3, reps:12, repos:60, notes:'Coudes légèrement fléchis' },
              { id:'b1p-tri',    ordre:5, nom:'Extension triceps poulie',        muscles:'Triceps',              materiel:'Machine poulie haute',    series:3, reps:12, repos:60, notes:'Coudes fixes — extension complète' },
            ]
          },
          {
            type: 'pull', nom: 'Pull',
            jours: ['Mardi'],
            exercices: [
              { id:'b1l-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',       materiel:'Machine cardio',        series:1, reps:'10 min', repos:0, isWarmup:true },
              { id:'b1l-tir-v',  ordre:1, nom:'Tirage vertical poulie',         muscles:'Dos large, biceps',   materiel:'Machine poulie haute',  series:4, reps:12, repos:90, notes:'Prise large — tirer vers la clavicule' },
              { id:'b1l-tir-h',  ordre:2, nom:'Tirage horizontal assis poulie', muscles:'Dos moyen, biceps',   materiel:'Machine poulie basse',  series:4, reps:12, repos:90, notes:'Serrer les omoplates en fin de mouvement' },
              { id:'b1l-row',    ordre:3, nom:'Rowing haltère unilatéral',      muscles:'Dos, biceps',         materiel:'Haltère + banc plat',   series:4, reps:12, repos:90, notes:'Tirer le coude vers le plafond' },
              { id:'b1l-curl',   ordre:4, nom:'Curl biceps haltères',           muscles:'Biceps',              materiel:'Haltères',              series:3, reps:12, repos:60, notes:'Supination en haut du mouvement' },
              { id:'b1l-cmar',   ordre:5, nom:'Curl marteau haltères',          muscles:'Biceps, avant-bras',  materiel:'Haltères',              series:3, reps:12, repos:60, notes:'Prise neutre — mouvement contrôlé' },
            ]
          },
          {
            type: 'legs', nom: 'Legs',
            jours: ['Jeudi'],
            exercices: [
              { id:'b1j-warmup', ordre:0, nom:"Vélo d'appartement (échauffement)", muscles:'Cardio bas du corps', materiel:"Vélo d'appartement", series:1, reps:'10 min', repos:0, notes:'Activation des jambes', isWarmup:true },
              { id:'b1j-fente',  ordre:1, nom:'Fentes marchées haltères',          muscles:'Cuisses, fessiers',  materiel:'Haltères',           series:3, reps:12, repos:60, notes:'Genou arrière proche du sol' },
              { id:'b1j-hip',    ordre:2, nom:'Hip thrust (barre ou machine)',      muscles:'Fessiers',           materiel:'Barre / Machine hip thrust', series:4, reps:12, repos:75, notes:'Utiliser la machine si disponible' },
              { id:'b1j-presse', ordre:3, nom:'Presse à cuisses',                  muscles:'Cuisses, fessiers',  materiel:'Machine',            series:4, reps:12, repos:90, notes:"Pieds à largeur d'épaules" },
              { id:'b1j-legext', ordre:4, nom:'Leg extension',                     muscles:'Quadriceps',         materiel:'Machine',            series:4, reps:12, repos:60, notes:'Extension complète' },
              { id:'b1j-legcrl', ordre:5, nom:'Leg curl couché',                   muscles:'Ischio-jambiers',    materiel:'Machine',            series:4, reps:12, repos:60, notes:'Flexion complète' },
            ]
          },
          {
            type: 'full', nom: 'Full Body',
            jours: ['Vendredi'],
            exercices: [
              { id:'b1f-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',       materiel:'Machine cardio',          series:1, reps:'10 min', repos:0, isWarmup:true },
              { id:'b1f-gobsq',  ordre:1, nom:'Goblet squat',                   muscles:'Cuisses, fessiers',   materiel:'Haltère',                 series:4, reps:12, repos:90, notes:"Haltère tenu contre la poitrine — descendre à 90°" },
              { id:'b1f-dci',    ordre:2, nom:'Développé incliné haltères',     muscles:'Pectoraux haut',      materiel:'Haltères + banc incliné', series:4, reps:12, repos:90, notes:'Inclinaison 30-45°' },
              { id:'b1f-tir-v',  ordre:3, nom:'Tirage vertical poulie',         muscles:'Dos large, biceps',   materiel:'Machine poulie haute',    series:4, reps:12, repos:90, notes:'Prise large' },
              { id:'b1f-curl',   ordre:4, nom:'Curl biceps haltères',           muscles:'Biceps',              materiel:'Haltères',                series:3, reps:12, repos:60, notes:'' },
              { id:'b1f-tri',    ordre:5, nom:'Extension triceps poulie',        muscles:'Triceps',             materiel:'Machine poulie haute',    series:3, reps:12, repos:60, notes:'' },
            ]
          },
        ]
      },

      /* ── BLOC 2 : Semaines 5-8 — Mêmes exercices, 10 reps, 75s ── */
      {
        num: 2, semaines: [5,6,7,8], nom: 'Progression',
        description: 'Mêmes exercices — 10 reps — 75 sec repos — Augmenter les charges.',
        seances: [
          {
            type: 'push', nom: 'Push', jours: ['Lundi'],
            exercices: [
              { id:'b2p-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',       materiel:'Machine cardio',          series:1, reps:'10 min', repos:0, isWarmup:true },
              { id:'b2p-dc',     ordre:1, nom:'Développé couché haltères',      muscles:'Pectoraux, épaules, triceps', materiel:'Haltères + banc plat', series:4, reps:10, repos:75, notes:'Augmenter les charges' },
              { id:'b2p-btfly',  ordre:2, nom:'Machine butterfly',              muscles:'Pectoraux',            materiel:'Machine',                 series:4, reps:10, repos:75, notes:'Amplitude complète' },
              { id:'b2p-shprs',  ordre:3, nom:'Shoulder press machine',         muscles:'Épaules, triceps',     materiel:'Machine guidée',          series:4, reps:10, repos:75, notes:'' },
              { id:'b2p-elev',   ordre:4, nom:'Élévations latérales haltères',  muscles:'Épaules latérales',    materiel:'Haltères',                series:3, reps:10, repos:75, notes:'' },
              { id:'b2p-tri',    ordre:5, nom:'Extension triceps poulie',        muscles:'Triceps',              materiel:'Machine poulie haute',    series:3, reps:10, repos:75, notes:'' },
            ]
          },
          {
            type: 'pull', nom: 'Pull', jours: ['Mardi'],
            exercices: [
              { id:'b2l-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',   materiel:'Machine cardio',       series:1, reps:'10 min', repos:0, isWarmup:true },
              { id:'b2l-tir-v',  ordre:1, nom:'Tirage vertical poulie',         muscles:'Dos large, biceps', materiel:'Machine poulie haute', series:4, reps:10, repos:75, notes:'' },
              { id:'b2l-tir-h',  ordre:2, nom:'Tirage horizontal assis poulie', muscles:'Dos moyen, biceps', materiel:'Machine poulie basse', series:4, reps:10, repos:75, notes:'' },
              { id:'b2l-row',    ordre:3, nom:'Rowing haltère unilatéral',      muscles:'Dos, biceps',      materiel:'Haltère + banc plat',  series:4, reps:10, repos:75, notes:'' },
              { id:'b2l-curl',   ordre:4, nom:'Curl biceps haltères',           muscles:'Biceps',           materiel:'Haltères',             series:3, reps:10, repos:75, notes:'' },
              { id:'b2l-cmar',   ordre:5, nom:'Curl marteau haltères',          muscles:'Biceps, avant-bras', materiel:'Haltères',           series:3, reps:10, repos:75, notes:'' },
            ]
          },
          {
            type: 'legs', nom: 'Legs', jours: ['Jeudi'],
            exercices: [
              { id:'b2j-warmup', ordre:0, nom:"Vélo d'appartement (échauffement)", muscles:'Cardio bas du corps', materiel:"Vélo d'appartement", series:1, reps:'10 min', repos:0, isWarmup:true },
              { id:'b2j-fente',  ordre:1, nom:'Fentes marchées haltères',          muscles:'Cuisses, fessiers', materiel:'Haltères',            series:3, reps:10, repos:75, notes:'' },
              { id:'b2j-hip',    ordre:2, nom:'Hip thrust (barre ou machine)',      muscles:'Fessiers',         materiel:'Barre / Machine hip thrust', series:4, reps:10, repos:75, notes:'' },
              { id:'b2j-presse', ordre:3, nom:'Presse à cuisses',                  muscles:'Cuisses, fessiers', materiel:'Machine',            series:4, reps:10, repos:75, notes:'' },
              { id:'b2j-legext', ordre:4, nom:'Leg extension',                     muscles:'Quadriceps',       materiel:'Machine',             series:4, reps:10, repos:75, notes:'' },
              { id:'b2j-legcrl', ordre:5, nom:'Leg curl couché',                   muscles:'Ischio-jambiers', materiel:'Machine',              series:4, reps:10, repos:75, notes:'' },
            ]
          },
          {
            type: 'full', nom: 'Full Body', jours: ['Vendredi'],
            exercices: [
              { id:'b2f-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',   materiel:'Machine cardio',          series:1, reps:'10 min', repos:0, isWarmup:true },
              { id:'b2f-gobsq',  ordre:1, nom:'Goblet squat',                   muscles:'Cuisses, fessiers', materiel:'Haltère',                series:4, reps:10, repos:75, notes:'' },
              { id:'b2f-dci',    ordre:2, nom:'Développé incliné haltères',     muscles:'Pectoraux haut',  materiel:'Haltères + banc incliné', series:4, reps:10, repos:75, notes:'' },
              { id:'b2f-tir-v',  ordre:3, nom:'Tirage vertical poulie',         muscles:'Dos large, biceps', materiel:'Machine poulie haute',  series:4, reps:10, repos:75, notes:'' },
              { id:'b2f-curl',   ordre:4, nom:'Curl biceps haltères',           muscles:'Biceps',           materiel:'Haltères',               series:3, reps:10, repos:75, notes:'' },
              { id:'b2f-tri',    ordre:5, nom:'Extension triceps poulie',        muscles:'Triceps',         materiel:'Machine poulie haute',    series:3, reps:10, repos:75, notes:'' },
            ]
          },
        ]
      },

      /* ── BLOC 3 : Semaines 9-12 — Push / Pull / Legs / Cardio HIIT ── */
      {
        num: 3, semaines: [9,10,11,12], nom: 'Intensification',
        description: 'Intensité maximale. Cardio HIIT le vendredi.',
        seances: [
          {
            type: 'push', nom: 'Push', jours: ['Lundi'],
            exercices: [
              { id:'b3p-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',       materiel:'Machine cardio',          series:1, reps:'10 min', repos:0, isWarmup:true },
              { id:'b3p-dc',     ordre:1, nom:'Développé couché haltères',      muscles:'Pectoraux',           materiel:'Haltères + banc plat',    series:4, reps:10, repos:75, notes:'Charges maximales maîtrisées' },
              { id:'b3p-dci',    ordre:2, nom:'Développé incliné haltères',     muscles:'Pectoraux haut',      materiel:'Haltères + banc incliné', series:4, reps:10, repos:75, notes:'Inclinaison 30-45° — cibler le haut des pecs' },
              { id:'b3p-shprs',  ordre:3, nom:'Shoulder press machine',         muscles:'Épaules, triceps',    materiel:'Machine guidée',          series:4, reps:10, repos:75, notes:'' },
              { id:'b3p-elev',   ordre:4, nom:'Élévations latérales haltères',  muscles:'Épaules latérales',   materiel:'Haltères',                series:3, reps:12, repos:60, notes:'Coudes légèrement fléchis — monter à hauteur des épaules' },
              { id:'b3p-tri',    ordre:5, nom:'Extension triceps poulie',        muscles:'Triceps',             materiel:'Machine poulie haute',    series:3, reps:12, repos:60, notes:'Coudes collés au corps — extension complète' },
            ]
          },
          {
            type: 'pull', nom: 'Pull', jours: ['Mardi'],
            exercices: [
              { id:'b3l-warmup', ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',   materiel:'Machine cardio',       series:1, reps:'10 min', repos:0, isWarmup:true },
              { id:'b3l-tir-v',  ordre:1, nom:'Tirage vertical poulie',         muscles:'Dos large, biceps', materiel:'Machine poulie haute', series:4, reps:10, repos:75, notes:'Prise large — tirer vers la clavicule' },
              { id:'b3l-tir-h',  ordre:2, nom:'Tirage horizontal assis poulie', muscles:'Dos moyen, biceps', materiel:'Machine poulie basse', series:4, reps:10, repos:75, notes:'Tirer vers le nombril — serrer les omoplates' },
              { id:'b3l-row',    ordre:3, nom:'Rowing haltère unilatéral',      muscles:'Dos, biceps',      materiel:'Haltère + banc plat',  series:4, reps:10, repos:75, notes:'Dos horizontal — tirer le coude vers le plafond' },
              { id:'b3l-curl',   ordre:4, nom:'Curl biceps haltères',           muscles:'Biceps',           materiel:'Haltères',             series:3, reps:12, repos:60, notes:'Coudes fixes — supination en haut du mouvement' },
              { id:'b3l-cmar',   ordre:5, nom:'Curl marteau haltères',          muscles:'Biceps, avant-bras', materiel:'Haltères',           series:3, reps:12, repos:60, notes:'Prise neutre — mouvement contrôlé' },
            ]
          },
          {
            type: 'legs', nom: 'Legs', jours: ['Jeudi'],
            exercices: [
              { id:'b3j-warmup', ordre:0, nom:"Vélo d'appartement (échauffement)", muscles:'Cardio bas du corps', materiel:"Vélo d'appartement", series:1, reps:'10 min', repos:0, notes:'Cadence modérée — activation des jambes', isWarmup:true },
              { id:'b3j-fente',  ordre:1, nom:'Fentes marchées haltères',          muscles:'Cuisses, fessiers', materiel:'Haltères',            series:3, reps:12, repos:60, notes:'Genou arrière proche du sol — buste droit' },
              { id:'b3j-hip',    ordre:2, nom:'Hip thrust (barre ou machine)',      muscles:'Fessiers',         materiel:'Barre / Machine hip thrust', series:4, reps:12, repos:75, notes:'Utiliser la machine si disponible — sinon barre' },
              { id:'b3j-presse', ordre:3, nom:'Presse à cuisses',                  muscles:'Cuisses, fessiers', materiel:'Machine',            series:4, reps:10, repos:75, notes:"Pieds à largeur d'épaules — 90° de flexion" },
              { id:'b3j-legext', ordre:4, nom:'Leg extension',                     muscles:'Quadriceps',       materiel:'Machine',             series:4, reps:12, repos:60, notes:'Extension complète — contrôler la descente' },
              { id:'b3j-legcrl', ordre:5, nom:'Leg curl couché',                   muscles:'Ischio-jambiers', materiel:'Machine',              series:4, reps:12, repos:60, notes:"Flexion complète — pas d'à-coups" },
            ]
          },
          {
            type: 'cardio', nom: 'Cardio HIIT',
            jours: ['Vendredi'],
            isHIIT: true,
            exercices: [
              { id:'b3c-warmup',  ordre:0, nom:'Vélo elliptique (échauffement)', muscles:'Cardio général',          materiel:'Machine cardio',  series:1,       reps:'10 min', repos:0,  notes:'Intensité progressive', isWarmup:true },
              { id:'b3c-burp',    ordre:1, nom:'Burpees',                         muscles:'Full body, cardio',       materiel:'Poids du corps',  series:'4 tours', reps:'40 sec', repos:20, notes:'Mouvement complet — sauter en haut', isHIIT:true },
              { id:'b3c-mtnclb',  ordre:2, nom:'Mountain climbers',               muscles:'Core, cardio',            materiel:'Poids du corps',  series:'4 tours', reps:'40 sec', repos:20, notes:'Rythme rapide — gainage actif', isHIIT:true },
              { id:'b3c-sqjmp',   ordre:3, nom:'Squat sauté',                     muscles:'Cuisses, fessiers, cardio',materiel:'Poids du corps', series:'4 tours', reps:'40 sec', repos:20, notes:'Atterrissage doux — genoux dans l\'axe', isHIIT:true },
              { id:'b3c-pompes',  ordre:4, nom:'Pompes',                           muscles:'Pectoraux, triceps',      materiel:'Poids du corps',  series:'4 tours', reps:'40 sec', repos:20, notes:'Version genoux si nécessaire', isHIIT:true },
              { id:'b3c-fjmp',    ordre:5, nom:'Fentes alternées sautées',         muscles:'Cuisses, fessiers',       materiel:'Poids du corps',  series:'4 tours', reps:'40 sec', repos:20, notes:'Alterner les jambes — sauter entre chaque', isHIIT:true },
              { id:'b3c-gailatl', ordre:6, nom:'Gainage latéral',                  muscles:'Core, obliques',          materiel:'Poids du corps',  series:'4 tours', reps:'40 sec', repos:20, notes:'Alterner côté gauche et droit', isHIIT:true },
              { id:'b3c-jjacks',  ordre:7, nom:'Jumping jacks',                    muscles:'Full body, cardio',       materiel:'Poids du corps',  series:'4 tours', reps:'40 sec', repos:20, notes:'Rythme régulier', isHIIT:true },
              { id:'b3c-sprint',  ordre:8, nom:'Sprint sur place genoux hauts',    muscles:'Cardio, jambes',          materiel:'Poids du corps',  series:'4 tours', reps:'40 sec', repos:20, notes:'Genoux à hauteur des hanches', isHIIT:true },
            ]
          },
        ]
      },
    ],
  },
     'prog-home-corps-3j': {
    id:        'prog-home-corps-3j',
    nom:       'Programme Corps Libre',
    lieu:      'maison_corps',
    frequence: 3,
    objectif:  'mixte',
    niveau:    'debutant',
    duree:     30,
    semaines:  12,
    blocs: [
      {
        num: 1, semaines: [1,2,3,4], nom: 'Fondations',
        description: 'Apprentissage des mouvements. Technique avant les répétitions.',
        seances: [{
          type: 'full', nom: 'Full Body',
          jours: ['Lundi', 'Mercredi', 'Vendredi'],
          exercices: [
            { id:'hc1-warmup', ordre:0, nom:'Jumping jacks (échauffement)',  muscles:'Cardio général',              materiel:'Poids du corps', series:1, reps:'5 min',  repos:0,  notes:'Rythme modéré pour activer tout le corps', isWarmup:true },
            { id:'hc1-pompes', ordre:1, nom:'Pompes standard',               muscles:'Pectoraux, triceps, épaules', materiel:'Poids du corps', series:3, reps:12,       repos:60, notes:"Corps droit — descendre jusqu'à toucher presque le sol" },
            { id:'hc1-squat',  ordre:2, nom:'Squat au poids du corps',       muscles:'Cuisses, fessiers',           materiel:'Poids du corps', series:3, reps:15,       repos:60, notes:"Pieds à largeur d'épaules — descendre à 90° — regard devant" },
            { id:'hc1-fente',  ordre:3, nom:'Fentes marchées',               muscles:'Cuisses, fessiers',           materiel:'Poids du corps', series:3, reps:12,       repos:60, notes:'Genou arrière proche du sol — buste droit' },
            { id:'hc1-plank',  ordre:4, nom:'Gainage ventral',               muscles:'Core, abdominaux',            materiel:'Poids du corps', series:3, reps:'30 sec', repos:45, notes:'Corps droit comme une planche — contracter les abdos' },
            { id:'hc1-glute',  ordre:5, nom:'Glute bridge',                  muscles:'Fessiers, ischio-jambiers',   materiel:'Poids du corps', series:3, reps:15,       repos:45, notes:'Monter les hanches — serrer les fessiers en haut' },
          ]
        }]
      },
      {
        num: 2, semaines: [5,6,7,8], nom: 'Progression',
        description: 'Variantes plus difficiles — intensité augmente.',
        seances: [{
          type: 'full', nom: 'Full Body',
          jours: ['Lundi', 'Mercredi', 'Vendredi'],
          exercices: [
            { id:'hc2-warmup',  ordre:0, nom:'Jumping jacks (échauffement)', muscles:'Cardio général',             materiel:'Poids du corps', series:1, reps:'5 min',  repos:0,  notes:'Rythme plus soutenu', isWarmup:true },
            { id:'hc2-pompes2', ordre:1, nom:'Pompes pieds surélevés',       muscles:'Pectoraux haut, épaules',   materiel:'Chaise ou banc', series:4, reps:10,       repos:60, notes:"Pieds sur une chaise — cible le haut des pectoraux" },
            { id:'hc2-sqjmp',   ordre:2, nom:'Squat sauté',                  muscles:'Cuisses, fessiers, cardio', materiel:'Poids du corps', series:4, reps:12,       repos:60, notes:"Atterrissage doux — genoux dans l'axe des pieds" },
            { id:'hc2-fentej',  ordre:3, nom:'Fentes sautées alternées',     muscles:'Cuisses, fessiers',         materiel:'Poids du corps', series:3, reps:10,       repos:60, notes:'Alterner les jambes — sauter entre chaque fente' },
            { id:'hc2-plankl',  ordre:4, nom:'Gainage latéral',              muscles:'Obliques, core',            materiel:'Poids du corps', series:3, reps:'30 sec', repos:45, notes:'Alterner côté gauche et droit — corps bien aligné' },
            { id:'hc2-htrust1', ordre:5, nom:'Hip thrust unilatéral',        muscles:'Fessiers',                  materiel:'Poids du corps', series:3, reps:12,       repos:45, notes:'Une jambe tendue — pousser avec la jambe au sol — alterner les côtés' },
          ]
        }]
      },
      {
        num: 3, semaines: [9,10,11,12], nom: 'Intensification',
        description: 'Séances spécialisées + circuit HIIT.',
        seances: [
          {
            type: 'push', nom: 'Push & Core', jours: ['Lundi'],
            exercices: [
              { id:'hc3a-warmup', ordre:0, nom:'Jumping jacks (échauffement)', muscles:'Cardio général',      materiel:'Poids du corps', series:1, reps:'5 min',  repos:0,  isWarmup:true },
              { id:'hc3a-pompes', ordre:1, nom:'Pompes standard',              muscles:'Pectoraux, triceps', materiel:'Poids du corps', series:4, reps:15,       repos:60, notes:"Corps droit — amplitude complète" },
              { id:'hc3a-dips',   ordre:2, nom:'Dips sur chaise',              muscles:'Triceps, épaules',   materiel:'Chaise solide',  series:4, reps:12,       repos:60, notes:"Bras serrés — descendre à 90°" },
              { id:'hc3a-pike',   ordre:3, nom:'Pompes Pike',                  muscles:'Épaules, triceps',   materiel:'Poids du corps', series:3, reps:12,       repos:60, notes:"Corps en V inversé — viser vers les pieds" },
              { id:'hc3a-mtnclb', ordre:4, nom:'Mountain climbers',            muscles:'Core, cardio',        materiel:'Poids du corps', series:3, reps:'40 sec', repos:20, notes:'Rythme rapide — gainage actif' },
            ]
          },
          {
            type: 'legs', nom: 'Jambes & Fessiers', jours: ['Mercredi'],
            exercices: [
              { id:'hc3b-warmup', ordre:0, nom:'Jumping jacks (échauffement)',    muscles:'Cardio général',     materiel:'Poids du corps', series:1, reps:'5 min', repos:0,  isWarmup:true },
              { id:'hc3b-squat',  ordre:1, nom:'Squat profond',                   muscles:'Cuisses, fessiers', materiel:'Poids du corps', series:4, reps:20,      repos:60, notes:'Descente lente (3 sec) — montée explosive' },
              { id:'hc3b-fente',  ordre:2, nom:'Fentes marchées',                 muscles:'Cuisses, fessiers', materiel:'Poids du corps', series:4, reps:12,      repos:60, notes:'Amplitude complète — buste droit' },
              { id:'hc3b-glute',  ordre:3, nom:'Hip thrust bilatéral',            muscles:'Fessiers',           materiel:'Poids du corps', series:4, reps:20,      repos:45, notes:'Monter et maintenir 2 secondes en haut' },
              { id:'hc3b-step',   ordre:4, nom:'Step-ups sur chaise',             muscles:'Cuisses, fessiers', materiel:'Chaise solide',  series:3, reps:12,      repos:45, notes:'Alterner les jambes — buste droit' },
              { id:'hc3b-calf',   ordre:5, nom:'Élévations sur pointe des pieds', muscles:'Mollets',            materiel:'Marche ou sol',  series:3, reps:20,      repos:30, notes:'Amplitude complète — tenir 1 seconde en haut' },
            ]
          },
          {
            type: 'full', nom: 'Full Body HIIT', jours: ['Vendredi'], isHIIT: true,
            exercices: [
              { id:'hc3c-warmup',  ordre:0, nom:'Jumping jacks (échauffement)', muscles:'Cardio général',     materiel:'Poids du corps', series:1,        reps:'5 min',  repos:0,  notes:'Activation progressive', isWarmup:true },
              { id:'hc3c-burp',    ordre:1, nom:'Burpees',                       muscles:'Full body, cardio', materiel:'Poids du corps', series:'4 tours', reps:'40 sec', repos:20, notes:'Mouvement complet — sauter en haut', isHIIT:true },
              { id:'hc3c-sqjmp',   ordre:2, nom:'Squat sauté',                   muscles:'Cuisses, fessiers', materiel:'Poids du corps', series:'4 tours', reps:'40 sec', repos:20, notes:"Atterrissage doux — genoux dans l'axe", isHIIT:true },
              { id:'hc3c-pompes',  ordre:3, nom:'Pompes',                         muscles:'Pectoraux, triceps',materiel:'Poids du corps', series:'4 tours', reps:'40 sec', repos:20, notes:'Version genoux si nécessaire', isHIIT:true },
              { id:'hc3c-mtnclb',  ordre:4, nom:'Mountain climbers',              muscles:'Core, cardio',      materiel:'Poids du corps', series:'4 tours', reps:'40 sec', repos:20, notes:'Rythme rapide — gainage actif', isHIIT:true },
              { id:'hc3c-fentej',  ordre:5, nom:'Fentes sautées alternées',       muscles:'Cuisses, fessiers', materiel:'Poids du corps', series:'4 tours', reps:'40 sec', repos:20, notes:'Alterner les jambes — sauter entre chaque', isHIIT:true },
              { id:'hc3c-gailatl', ordre:6, nom:'Gainage latéral',                muscles:'Core, obliques',    materiel:'Poids du corps', series:'4 tours', reps:'40 sec', repos:20, notes:'Alterner côté gauche et droit', isHIIT:true },
            ]
          },
        ]
      },
    ],
  },
     'prog-home-materiel-3j': {
    id:        'prog-home-materiel-3j',
    nom:       'Programme Haltères Maison',
    lieu:      'maison_materiel',
    frequence: 3,
    objectif:  'mixte',
    niveau:    'debutant',
    duree:     45,
    semaines:  12,
    blocs: [
      {
        num: 1, semaines: [1,2,3,4], nom: 'Fondations',
        description: 'Apprentissage des mouvements avec haltères. Charges légères. Repos longs.',
        seances: [{
          type: 'full', nom: 'Full Body',
          jours: ['Lundi', 'Mercredi', 'Vendredi'],
          exercices: [
            { id:'hm1-warmup', ordre:0, nom:'Jumping jacks (échauffement)',        muscles:'Cardio général',              materiel:'Poids du corps',   series:1, reps:'5 min', repos:0,  notes:'Rythme modéré', isWarmup:true },
            { id:'hm1-dc',     ordre:1, nom:'Développé couché haltères au sol',    muscles:'Pectoraux, épaules, triceps', materiel:'Haltères + tapis', series:4, reps:12,      repos:90, notes:"Allongé au sol — coudes à 45° — contrôler la descente" },
            { id:'hm1-gobsq',  ordre:2, nom:'Goblet squat',                        muscles:'Cuisses, fessiers',           materiel:'Haltère',          series:4, reps:12,      repos:90, notes:"Haltère contre la poitrine — descendre à 90° — dos droit" },
            { id:'hm1-row',    ordre:3, nom:'Rowing haltère unilatéral',           muscles:'Dos, biceps',                 materiel:'Haltère + appui',  series:4, reps:12,      repos:90, notes:'Main sur un appui — tirer le coude vers le plafond — dos horizontal' },
            { id:'hm1-shprs',  ordre:4, nom:'Shoulder press haltères assis',       muscles:'Épaules, triceps',            materiel:'Haltères',         series:4, reps:12,      repos:90, notes:'Assis sur une chaise — pousser vers le haut — coudes à 90° en bas' },
            { id:'hm1-curl',   ordre:5, nom:'Curl biceps haltères',                muscles:'Biceps',                      materiel:'Haltères',         series:3, reps:12,      repos:60, notes:'Coudes fixes — supination en haut du mouvement' },
          ]
        }]
      },
      {
        num: 2, semaines: [5,6,7,8], nom: 'Progression',
        description: 'Mêmes exercices — 10 reps — Charges plus lourdes — Repos réduits.',
        seances: [{
          type: 'full', nom: 'Full Body',
          jours: ['Lundi', 'Mercredi', 'Vendredi'],
          exercices: [
            { id:'hm2-warmup', ordre:0, nom:'Jumping jacks (échauffement)',        muscles:'Cardio général',              materiel:'Poids du corps',   series:1, reps:'5 min', repos:0,  isWarmup:true },
            { id:'hm2-dc',     ordre:1, nom:'Développé couché haltères au sol',    muscles:'Pectoraux, épaules, triceps', materiel:'Haltères + tapis', series:4, reps:10,      repos:75, notes:'Augmenter les charges' },
            { id:'hm2-gobsq',  ordre:2, nom:'Goblet squat',                        muscles:'Cuisses, fessiers',           materiel:'Haltère',          series:4, reps:10,      repos:75, notes:'Haltère plus lourd — maintenir la technique' },
            { id:'hm2-row',    ordre:3, nom:'Rowing haltère unilatéral',           muscles:'Dos, biceps',                 materiel:'Haltère + appui',  series:4, reps:10,      repos:75, notes:'Charges plus lourdes — amplitude complète' },
            { id:'hm2-shprs',  ordre:4, nom:'Shoulder press haltères assis',       muscles:'Épaules, triceps',            materiel:'Haltères',         series:4, reps:10,      repos:75, notes:'Augmenter les charges progressivement' },
            { id:'hm2-curl',   ordre:5, nom:'Curl biceps haltères',                muscles:'Biceps',                      materiel:'Haltères',         series:3, reps:10,      repos:75, notes:'Charges plus lourdes — coudes fixes' },
            { id:'hm2-fente',  ordre:6, nom:'Fentes marchées haltères',            muscles:'Cuisses, fessiers',           materiel:'Haltères',         series:3, reps:10,      repos:75, notes:'Haltères dans les mains — buste droit' },
          ]
        }]
      },
      {
        num: 3, semaines: [9,10,11,12], nom: 'Intensification',
        description: 'Séances Push / Pull / Legs — Intensité maximale.',
        seances: [
          {
            type: 'push', nom: 'Push', jours: ['Lundi'],
            exercices: [
              { id:'hm3p-warmup', ordre:0, nom:'Jumping jacks (échauffement)',     muscles:'Cardio général',     materiel:'Poids du corps',   series:1, reps:'5 min', repos:0,  isWarmup:true },
              { id:'hm3p-dc',     ordre:1, nom:'Développé couché haltères au sol', muscles:'Pectoraux',          materiel:'Haltères + tapis', series:4, reps:10,      repos:75, notes:'Charges maximales maîtrisées' },
              { id:'hm3p-ecarte', ordre:2, nom:'Écarté sol haltères',              muscles:'Pectoraux',          materiel:'Haltères + tapis', series:4, reps:10,      repos:75, notes:'Bras en croix — remonter lentement en arc de cercle' },
              { id:'hm3p-shprs',  ordre:3, nom:'Shoulder press haltères assis',    muscles:'Épaules, triceps',   materiel:'Haltères',         series:4, reps:10,      repos:75, notes:'' },
              { id:'hm3p-elev',   ordre:4, nom:'Élévations latérales haltères',    muscles:'Épaules latérales',  materiel:'Haltères',         series:3, reps:12,      repos:60, notes:"Coudes légèrement fléchis — monter à hauteur des épaules" },
              { id:'hm3p-tri',    ordre:5, nom:'Extension triceps haltère',        muscles:'Triceps',            materiel:'Haltère',          series:3, reps:12,      repos:60, notes:'Haltère derrière la tête — extension complète — coudes fixes' },
            ]
          },
          {
            type: 'pull', nom: 'Pull', jours: ['Mercredi'],
            exercices: [
              { id:'hm3l-warmup', ordre:0, nom:'Jumping jacks (échauffement)', muscles:'Cardio général',               materiel:'Poids du corps',  series:1, reps:'5 min', repos:0,  isWarmup:true },
              { id:'hm3l-row',    ordre:1, nom:'Rowing haltère unilatéral',    muscles:'Dos, biceps',                  materiel:'Haltère + appui', series:4, reps:10,      repos:75, notes:'Dos horizontal — tirer le coude vers le plafond' },
              { id:'hm3l-rdelt',  ordre:2, nom:'Oiseau haltères (rear delt)',  muscles:'Dos, deltoïdes postérieurs',    materiel:'Haltères',        series:4, reps:12,      repos:75, notes:'Penché en avant — bras en croix — coudes légèrement fléchis' },
              { id:'hm3l-shrug',  ordre:3, nom:'Shrugs haltères',              muscles:'Trapèzes',                      materiel:'Haltères',        series:3, reps:15,      repos:60, notes:'Élever les épaules vers les oreilles — tenir 1 seconde' },
              { id:'hm3l-curl',   ordre:4, nom:'Curl biceps haltères',         muscles:'Biceps',                        materiel:'Haltères',        series:3, reps:12,      repos:60, notes:'Supination en haut du mouvement' },
              { id:'hm3l-cmar',   ordre:5, nom:'Curl marteau haltères',        muscles:'Biceps, avant-bras',            materiel:'Haltères',        series:3, reps:12,      repos:60, notes:'Prise neutre — mouvement contrôlé' },
            ]
          },
          {
            type: 'legs', nom: 'Legs', jours: ['Vendredi'],
            exercices: [
              { id:'hm3j-warmup', ordre:0, nom:'Jumping jacks (échauffement)',   muscles:'Cardio général',            materiel:'Poids du corps',    series:1, reps:'5 min', repos:0,  isWarmup:true },
              { id:'hm3j-gobsq',  ordre:1, nom:'Goblet squat',                   muscles:'Cuisses, fessiers',         materiel:'Haltère',           series:4, reps:10,      repos:75, notes:'Descente lente — montée explosive' },
              { id:'hm3j-fente',  ordre:2, nom:'Fentes marchées haltères',       muscles:'Cuisses, fessiers',         materiel:'Haltères',          series:4, reps:12,      repos:60, notes:'Buste droit — genou arrière proche du sol' },
              { id:'hm3j-hip',    ordre:3, nom:'Hip thrust sol avec haltère',    muscles:'Fessiers',                  materiel:'Haltère + tapis',   series:4, reps:12,      repos:75, notes:'Haltère sur les hanches — serrer les fessiers en haut' },
              { id:'hm3j-rdl',    ordre:4, nom:'Romanian deadlift haltères',     muscles:'Ischio-jambiers, fessiers', materiel:'Haltères',          series:4, reps:12,      repos:75, notes:"Dos droit — haltères le long des jambes — ressentir l'étirement" },
              { id:'hm3j-calf',   ordre:5, nom:'Élévations mollets haltères',    muscles:'Mollets',                   materiel:'Haltères + marche', series:3, reps:20,      repos:30, notes:'Amplitude complète — tenir 1 seconde en haut' },
            ]
          },
        ]
      },
    ],
  },


   
};

/* ══════════════════════════════════════════════════
   API Programmes
   ══════════════════════════════════════════════════ */
const Programmes = {
  // Récupérer un programme par ID
  get(id) {
    return PROGRAMMES[id] || null;
  },

  // Logique d'assignation : lieu + fréquence → programme
   assign(profil) {
    const freq = profil.frequence;

    if (profil.lieu === 'salle') {
      if (freq <= 3) return 'prog-a-3j';
      return 'prog-b-4j';
    }
    if (profil.lieu === 'maison_materiel') return 'prog-home-materiel-3j';
    if (profil.lieu === 'maison_corps')    return 'prog-home-corps-3j';

    return 'prog-a-3j';
  },

  // Obtenir le bloc actuel selon la semaine
  getBloc(programme, semaine) {
    return programme.blocs.find(b => b.semaines.includes(semaine)) || programme.blocs[0];
  },

  // Obtenir la séance du jour dans un bloc
  getSeanceByType(bloc, type) {
    return bloc.seances.find(s => s.type === type) || bloc.seances[0];
  },

  // Calculer la semaine en cours depuis la date de début du programme
  getSemaineActuelle(profile) {
    const dateRef = profile.programme_start_date || profile.created_at;
    if (!dateRef) return 1;
    const debut = new Date(dateRef);
    const now   = new Date();
    const jours = Math.floor((now - debut) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.floor(jours / 7) + 1);
  },

  // Générer la semaine type (pour la page résultat)
  getSemaineType(programme) {
    const bloc1 = programme.blocs[0];
    const jours = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
    const result = [];

    jours.forEach(jour => {
      let seance = null;
      bloc1.seances.forEach(s => {
        if (s.jours?.includes(jour)) seance = s;
      });
      result.push({ jour, seance });
    });

    return result;
  },
};
