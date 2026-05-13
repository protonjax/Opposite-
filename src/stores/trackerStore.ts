import { create } from 'zustand';
import type { Goal } from '@/types/app';

type TrackerState = {
  goals: Goal[];
  isLoading: boolean;
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  setLoading: (loading: boolean) => void;
};

export const useTrackerStore = create<TrackerState>((set) => ({
  goals: [],
  isLoading: false,
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),
  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
