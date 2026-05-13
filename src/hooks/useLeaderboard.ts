import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import type { LeaderboardEntry } from '@/types/app';

export function useLeaderboard() {
  const { weekly, allTime, isLoading, setWeekly, setAllTime, setLoading } = useLeaderboardStore();

  async function loadWeekly() {
    setLoading(true);
    const { data } = await supabase.rpc('get_weekly_leaderboard');
    setWeekly((data as LeaderboardEntry[]) ?? []);
    setLoading(false);
  }

  async function loadAllTime() {
    setLoading(true);
    const { data } = await supabase.rpc('get_alltime_leaderboard');
    setAllTime((data as LeaderboardEntry[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadWeekly();
    loadAllTime();

    // Live updates via score_events channel
    const channel = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'score_events' }, () => {
        loadWeekly();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { weekly, allTime, isLoading, refreshWeekly: loadWeekly, refreshAllTime: loadAllTime };
}
