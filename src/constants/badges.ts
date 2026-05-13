import type { BadgeDefinition } from '@/types/app';

export const BADGES: BadgeDefinition[] = [
  { id: 'first_entry',       name: 'Contrarian',       description: 'Submitted your first journal entry',                icon: 'flame',          color: '#39FF14' },
  { id: 'streak_3',          name: 'Odd One Out',       description: 'Maintained a 3-day streak',                         icon: 'trending-up',    color: '#39FF14' },
  { id: 'streak_7',          name: 'Week Warrior',      description: 'Maintained a 7-day streak',                         icon: 'star',           color: '#FFD700' },
  { id: 'streak_30',         name: 'The 1%er',          description: 'Maintained a 30-day streak',                        icon: 'trophy',         color: '#FFD700' },
  { id: 'streak_100',        name: 'Untouchable',       description: 'Maintained a 100-day streak',                       icon: 'shield',         color: '#FF6B00' },
  { id: 'score_100',         name: 'Rising Rebel',      description: 'Reached 100 Opposite Score',                        icon: 'zap',            color: '#39FF14' },
  { id: 'score_500',         name: 'Uncommon',          description: 'Reached 500 Opposite Score',                        icon: 'award',          color: '#FFD700' },
  { id: 'score_1000',        name: 'Legend',            description: 'Reached 1,000 Opposite Score',                      icon: 'crown',          color: '#FF6B00' },
  { id: 'goals_1',           name: 'Goal Setter',       description: 'Created your first goal',                           icon: 'target',         color: '#39FF14' },
  { id: 'goals_complete_1',  name: 'Finisher',          description: 'Completed your first goal',                         icon: 'check-circle',   color: '#39FF14' },
  { id: 'goals_complete_5',  name: 'Serial Achiever',   description: 'Completed 5 goals',                                 icon: 'layers',         color: '#FFD700' },
  { id: 'top_10',            name: 'Top Dog',           description: 'Reached the top 10 on the weekly leaderboard',      icon: 'bar-chart-2',    color: '#FF6B00' },
  { id: 'all_habits_week',   name: 'Locked In',         description: 'Completed every habit for an entire week',          icon: 'lock',           color: '#FFD700' },
  { id: 'mood_5_streak',     name: 'On Fire',           description: 'Logged a mood score of 5 for 5 consecutive days',   icon: 'sun',            color: '#FF6B00' },
];

export const BADGE_MAP = Object.fromEntries(BADGES.map((b) => [b.id, b]));
