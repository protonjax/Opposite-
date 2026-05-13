import { supabase } from './supabase';

export const POINTS = {
  JOURNAL_BASE: 10,
  JOURNAL_MOOD_BONUS: 5,       // mood >= 4
  JOURNAL_STAT_LINK: 5,
  JOURNAL_ACTION: 2,            // per action, max 5 actions
  JOURNAL_ACTION_MAX: 10,
  HABIT_COMPLETE: 8,
  STREAK_3: 15,
  STREAK_7: 40,
  STREAK_30: 150,
  GOAL_COMPLETE: 50,
  FIRST_JOURNAL: 20,
} as const;

export function calcJournalPoints(opts: {
  moodScore: number;
  linkedStatId: string | null;
  actionsCount: number;
  isFirstEntry: boolean;
}): number {
  let pts = POINTS.JOURNAL_BASE;
  if (opts.moodScore >= 4) pts += POINTS.JOURNAL_MOOD_BONUS;
  if (opts.linkedStatId) pts += POINTS.JOURNAL_STAT_LINK;
  pts += Math.min(opts.actionsCount * POINTS.JOURNAL_ACTION, POINTS.JOURNAL_ACTION_MAX);
  if (opts.isFirstEntry) pts += POINTS.FIRST_JOURNAL;
  return pts;
}

export function calcHabitPoints(streakDays: number): number {
  let pts = POINTS.HABIT_COMPLETE;
  if (streakDays === 3) pts += POINTS.STREAK_3;
  if (streakDays === 7) pts += POINTS.STREAK_7;
  if (streakDays === 30) pts += POINTS.STREAK_30;
  return pts;
}

export async function addScoreEvent(
  userId: string,
  eventType: string,
  points: number,
  sourceId?: string,
) {
  const { error } = await supabase.from('score_events').insert({
    user_id: userId,
    event_type: eventType,
    points,
    source_id: sourceId ?? null,
  });
  if (error) throw error;

  await supabase.rpc('recalculate_opposite_score', { p_user_id: userId });
}
