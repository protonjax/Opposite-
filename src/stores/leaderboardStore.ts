import { create } from 'zustand';
import type { LeaderboardEntry } from '@/types/app';

type LeaderboardState = {
  weekly: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
  isLoading: boolean;
  setWeekly: (entries: LeaderboardEntry[]) => void;
  setAllTime: (entries: LeaderboardEntry[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  weekly: [],
  allTime: [],
  isLoading: false,
  setWeekly: (weekly) => set({ weekly }),
  setAllTime: (allTime) => set({ allTime }),
  setLoading: (isLoading) => set({ isLoading }),
}));
