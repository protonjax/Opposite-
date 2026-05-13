import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useJournalStore } from '@/stores/journalStore';
import { addScoreEvent, calcJournalPoints } from '@/lib/score';
import type { JournalEntry } from '@/types/app';

export function useJournal() {
  const { session, profile, setProfile } = useAuthStore();
  const { entries, isLoading, setEntries, addEntry, setLoading } = useJournalStore();

  useEffect(() => {
    if (!session?.user) return;
    load();
  }, [session?.user?.id]);

  async function load() {
    if (!session?.user) return;
    setLoading(true);
    const { data } = await supabase
      .from('journal_entries')
      .select('*, opposite_stats(*)')
      .eq('user_id', session.user.id)
      .order('entry_date', { ascending: false });
    setEntries((data as JournalEntry[]) ?? []);
    setLoading(false);
  }

  async function createEntry(opts: {
    content: string;
    moodScore: number;
    oppositeActions: string[];
    linkedStatId: string | null;
    entryDate: string;
  }) {
    if (!session?.user || !profile) throw new Error('Not authenticated');

    const isFirstEntry = entries.length === 0;
    const points = calcJournalPoints({
      moodScore: opts.moodScore,
      linkedStatId: opts.linkedStatId,
      actionsCount: opts.oppositeActions.length,
      isFirstEntry,
    });

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: session.user.id,
        entry_date: opts.entryDate,
        content: opts.content,
        mood_score: opts.moodScore,
        opposite_actions: opts.oppositeActions,
        linked_stat_id: opts.linkedStatId,
        score_earned: points,
      })
      .select('*, opposite_stats(*)')
      .single();

    if (error) throw error;

    addEntry(data as JournalEntry);
    await addScoreEvent(session.user.id, 'journal', points, data.id);

    // Refresh profile score
    const { data: updated } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    if (updated) setProfile(updated);

    return data as JournalEntry;
  }

  return { entries, isLoading, createEntry, refresh: load };
}
