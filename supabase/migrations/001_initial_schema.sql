-- profiles: extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username         text UNIQUE NOT NULL,
  display_name     text,
  avatar_url       text,
  opposite_score   integer NOT NULL DEFAULT 0,
  streak_days      integer NOT NULL DEFAULT 0,
  longest_streak   integer NOT NULL DEFAULT 0,
  last_active_date date,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- opposite_stats: seeded content cards
CREATE TABLE IF NOT EXISTS public.opposite_stats (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category        text NOT NULL,
  stat_label      text NOT NULL,
  opposite_label  text NOT NULL,
  stat_value      text NOT NULL,
  opposite_value  text NOT NULL,
  source          text,
  impact_score    smallint NOT NULL DEFAULT 5 CHECK (impact_score BETWEEN 1 AND 10),
  is_daily        boolean NOT NULL DEFAULT true,
  published_date  date,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- journal_entries: one per user per day
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entry_date       date NOT NULL,
  content          text NOT NULL,
  mood_score       smallint CHECK (mood_score BETWEEN 1 AND 5),
  opposite_actions text[] NOT NULL DEFAULT '{}',
  linked_stat_id   uuid REFERENCES public.opposite_stats(id),
  score_earned     integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

-- goals
CREATE TABLE IF NOT EXISTS public.goals (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        text NOT NULL,
  description  text,
  category     text,
  target_date  date,
  is_active    boolean NOT NULL DEFAULT true,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- habits: belong to a goal
CREATE TABLE IF NOT EXISTS public.habits (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id      uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        text NOT NULL,
  frequency    text NOT NULL DEFAULT 'daily',
  target_count integer NOT NULL DEFAULT 1,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- habit_logs: one per habit per day
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id     uuid NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date     date NOT NULL DEFAULT CURRENT_DATE,
  completed    boolean NOT NULL DEFAULT true,
  score_earned integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(habit_id, log_date)
);

-- user_badges: awarded badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id  text NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- score_events: audit log for leaderboard
CREATE TABLE IF NOT EXISTS public.score_events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  source_id  uuid,
  points     integer NOT NULL,
  event_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
