import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useTrackerStore } from '@/stores/trackerStore';
import { addScoreEvent } from '@/lib/score';
import { POINTS } from '@/lib/score';
import type { Goal } from '@/types/app';

export function useGoals() {
  const { session, profile, setProfile } = useAuthStore();
  const { goals, isLoading, setGoals, addGoal, updateGoal, setLoading } = useTrackerStore();

  useEffect(() => {
    if (!session?.user) return;
    load();
  }, [session?.user?.id]);

  async function load() {
    if (!session?.user) return;
    setLoading(true);
    const { data } = await supabase
      .from('goals')
      .select('*, habits(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    setGoals((data as Goal[]) ?? []);
    setLoading(false);
  }

  async function createGoal(opts: {
    title: string;
    description?: string;
    category?: string;
    targetDate?: string;
  }) {
    if (!session?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('goals')
      .insert({ user_id: session.user.id, ...opts })
      .select('*, habits(*)')
      .single();
    if (error) throw error;

    addGoal(data as Goal);

    // Badge: first goal
    const isFirst = goals.length === 0;
    if (isFirst) {
      await supabase
        .from('user_badges')
        .upsert({ user_id: session.user.id, badge_id: 'goals_1' }, { onConflict: 'user_id,badge_id' });
    }

    return data as Goal;
  }

  async function completeGoal(goalId: string) {
    if (!session?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('goals')
      .update({ is_completed: true, completed_at: new Date().toISOString() })
      .eq('id', goalId)
      .eq('user_id', session.user.id)
      .select()
      .single();
    if (error) throw error;

    updateGoal(goalId, { is_completed: true });
    await addScoreEvent(session.user.id, 'goal_complete', POINTS.GOAL_COMPLETE, goalId);

    const completedCount = goals.filter((g) => g.is_completed).length + 1;
    if (completedCount === 1) {
      await supabase
        .from('user_badges')
        .upsert({ user_id: session.user.id, badge_id: 'goals_complete_1' }, { onConflict: 'user_id,badge_id' });
    }
    if (completedCount === 5) {
      await supabase
        .from('user_badges')
        .upsert({ user_id: session.user.id, badge_id: 'goals_complete_5' }, { onConflict: 'user_id,badge_id' });
    }

    const { data: updated } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (updated) setProfile(updated);

    return data;
  }

  return { goals, isLoading, createGoal, completeGoal, refresh: load };
}
