-- =====================================================
-- REPWELL — Script de création des tables
-- À exécuter dans Supabase > SQL Editor
-- =====================================================

-- 1. Profils utilisateurs
CREATE TABLE user_profiles (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  prenom          TEXT NOT NULL DEFAULT '',
  genre           TEXT CHECK (genre IN ('homme', 'femme')),
  age             INTEGER,
  poids           NUMERIC(5,1),
  taille          INTEGER,
  objectif        TEXT CHECK (objectif IN ('graisse', 'muscle', 'mixte', 'forme')),
  niveau          TEXT DEFAULT 'debutant',
  lieu            TEXT CHECK (lieu IN ('salle', 'maison_materiel', 'maison_corps')),
  frequence       INTEGER,
  duree_seance    INTEGER,
  contraintes     TEXT[] DEFAULT '{}',
  programme_id    TEXT,
  dark_mode       BOOLEAN DEFAULT FALSE,
  notif_heure     TEXT DEFAULT '09:00',
  notif_push      BOOLEAN DEFAULT FALSE,
  notif_email     BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile"
  ON user_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Séances
CREATE TABLE sessions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  programme_id    TEXT NOT NULL,
  semaine         INTEGER NOT NULL,
  num_seance      INTEGER NOT NULL,
  type_seance     TEXT NOT NULL,
  nom_seance      TEXT,
  duree_sec       INTEGER DEFAULT 0,
  completee       BOOLEAN DEFAULT FALSE,
  date            DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions"
  ON sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Logs des séries
CREATE TABLE serie_logs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id      UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercice_id     TEXT NOT NULL,
  exercice_nom    TEXT,
  serie_num       INTEGER NOT NULL,
  poids_kg        NUMERIC(6,2) DEFAULT 0,
  reps            INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE serie_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own serie_logs"
  ON serie_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Streaks
CREATE TABLE streaks (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak    INTEGER DEFAULT 0,
  best_streak       INTEGER DEFAULT 0,
  last_session_date DATE,
  freeze_available  BOOLEAN DEFAULT TRUE,
  freeze_used_date  DATE,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streak"
  ON streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Badges débloqués
CREATE TABLE badges_unlocked (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id    TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE badges_unlocked ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own badges"
  ON badges_unlocked FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Tables créées avec succès !
-- =====================================================
