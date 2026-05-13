import { create } from 'zustand';
import type { JournalEntry } from '@/types/app';

type JournalState = {
  entries: JournalEntry[];
  isLoading: boolean;
  setEntries: (entries: JournalEntry[]) => void;
  addEntry: (entry: JournalEntry) => void;
  setLoading: (loading: boolean) => void;
};

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  isLoading: false,
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  setLoading: (isLoading) => set({ isLoading }),
}));
