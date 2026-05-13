-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opposite_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_events ENABLE ROW LEVEL SECURITY;

-- profiles: public read (for leaderboard), owner write
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- opposite_stats: public read
CREATE POLICY "stats_public_read" ON public.opposite_stats FOR SELECT USING (true);

-- journal_entries: owner only
CREATE POLICY "journal_owner_all" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

-- goals: owner only
CREATE POLICY "goals_owner_all" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- habits: owner only
CREATE POLICY "habits_owner_all" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- habit_logs: owner only
CREATE POLICY "habit_logs_owner_all" ON public.habit_logs FOR ALL USING (auth.uid() = user_id);

-- user_badges: public read (for profile viewing), owner insert
CREATE POLICY "badges_public_read" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "badges_owner_insert" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- score_events: owner read + insert
CREATE POLICY "score_events_owner_read" ON public.score_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "score_events_owner_insert" ON public.score_events FOR INSERT WITH CHECK (auth.uid() = user_id);
