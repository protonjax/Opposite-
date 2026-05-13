import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { OppositeStat } from '@/types/app';

export function useOppositeStats() {
  const [stats, setStats] = useState<OppositeStat[]>([]);
  const [dailyStat, setDailyStat] = useState<OppositeStat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    const { data } = await supabase
      .from('opposite_stats')
      .select('*')
      .order('impact_score', { ascending: false });

    if (data) {
      setStats(data);
      // Pick today's daily stat deterministically by day-of-year
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
      );
      setDailyStat(data[dayOfYear % data.length] ?? data[0]);
    }
    setIsLoading(false);
  }

  useEffect(() => { load(); }, []);

  return { stats, dailyStat, isLoading, refresh: load };
}

export function useOppositeStat(id: string) {
  const [stat, setStat] = useState<OppositeStat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('opposite_stats')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setStat(data ?? null);
        setIsLoading(false);
      });
  }, [id]);

  return { stat, isLoading };
}
