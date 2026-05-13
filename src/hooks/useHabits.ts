import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { addScoreEvent, calcHabitPoints } from '@/lib/score';
import type { Habit, HabitLog } from '@/types/app';

export function useHabits(goalId: string) {
  const { session, setProfile } = useAuthStore();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function load() {
    if (!session?.user) return;
    setIsLoading(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

    const { data: habitsData } = await supabase
      .from('habits')
      .select('*')
      .eq('goal_id', goalId)
      .eq('is_active', true);

    if (!habitsData) { setIsLoading(false); return; }

    const habitIds = habitsData.map((h) => h.id);
    const { data: logsData } = await supabase
      .from('habit_logs')
      .select('*')
      .in('habit_id', habitIds)
      .gte('log_date', thirtyDaysAgo);

    const logsMap: Record<string, HabitLog[]> = {};
    for (const log of logsData ?? []) {
      if (!logsMap[log.habit_id]) logsMap[log.habit_id] = [];
      logsMap[log.habit_id].push(log);
    }

    const enriched: Habit[] = habitsData.map((h) => {
      const logs = logsMap[h.id] ?? [];
      const completedToday = logs.some((l) => l.log_date === today && l.completed);
      const streak = calcStreak(logs);
      return { ...h, logs, streak, completedToday };
    });

    setHabits(enriched);
    setIsLoading(false);
  }

  async function createHabit(opts: { title: string; frequency?: string }) {
    if (!session?.user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('habits')
      .insert({ goal_id: goalId, user_id: session.user.id, ...opts })
      .select()
      .single();
    if (error) throw error;
    setHabits((prev) => [...prev, { ...data, logs: [], streak: 0, completedToday: false }]);
    return data as Habit;
  }

  async function logHabit(habitId: string) {
    if (!session?.user) throw new Error('Not authenticated');
    const today = format(new Date(), 'yyyy-MM-dd');

    const habit = habits.find((h) => h.id === habitId);
    if (!habit || habit.completedToday) return;

    const newStreak = (habit.streak ?? 0) + 1;
    const points = calcHabitPoints(newStreak);

    const { data, error } = await supabase
      .from('habit_logs')
      .upsert({ habit_id: habitId, user_id: session.user.id, log_date: today, completed: true, score_earned: points },
               { onConflict: 'habit_id,log_date' })
      .select()
      .single();
    if (error) throw error;

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? { ...h, completedToday: true, streak: newStreak, logs: [...(h.logs ?? []), data] }
          : h,
      ),
    );

    await addScoreEvent(session.user.id, 'habit_log', points, data.id);

    // Update streak on profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('streak_days, longest_streak')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      const nextStreak = (profile.streak_days ?? 0) + 1;
      const longest = Math.max(nextStreak, profile.longest_streak ?? 0);
      await supabase
        .from('profiles')
        .update({ streak_days: nextStreak, longest_streak: longest, last_active_date: today })
        .eq('id', session.user.id);

      // streak badges
      const badgeMap: Record<number, string> = { 3: 'streak_3', 7: 'streak_7', 30: 'streak_30', 100: 'streak_100' };
      if (badgeMap[nextStreak]) {
        await supabase
          .from('user_badges')
          .upsert({ user_id: session.user.id, badge_id: badgeMap[nextStreak] }, { onConflict: 'user_id,badge_id' });
      }
    }

    const { data: updated } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (updated) setProfile(updated);
  }

  return { habits, isLoading, load, createHabit, logHabit };
}

function calcStreak(logs: HabitLog[]): number {
  const completed = logs
    .filter((l) => l.completed)
    .map((l) => l.log_date)
    .sort()
    .reverse();

  if (completed.length === 0) return 0;

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const dateStr of completed) {
    const d = new Date(dateStr + 'T00:00:00');
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86_400_000);
    if (diff === 0 || diff === 1) {
      streak++;
      cursor = d;
    } else {
      break;
    }
  }
  return streak;
}
