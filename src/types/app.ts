export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  opposite_score: number;
  streak_days: number;
  longest_streak: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
};

export type OppositeStat = {
  id: string;
  category: string;
  stat_label: string;
  opposite_label: string;
  stat_value: string;
  opposite_value: string;
  source: string | null;
  impact_score: number;
  is_daily: boolean;
  published_date: string | null;
  created_at: string;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  content: string;
  mood_score: number | null;
  opposite_actions: string[];
  linked_stat_id: string | null;
  score_earned: number;
  created_at: string;
  updated_at: string;
  opposite_stats?: OppositeStat | null;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  target_date: string | null;
  is_active: boolean;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  habits?: Habit[];
};

export type Habit = {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  frequency: string;
  target_count: number;
  is_active: boolean;
  created_at: string;
  logs?: HabitLog[];
  streak?: number;
  completedToday?: boolean;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  completed: boolean;
  score_earned: number;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
};

export type ScoreEvent = {
  id: string;
  user_id: string;
  event_type: string;
  source_id: string | null;
  points: number;
  event_date: string;
  created_at: string;
};

export type LeaderboardEntry = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  weekly_score?: number;
  total_score?: number;
  rank: number;
};

export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};
