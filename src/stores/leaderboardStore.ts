import { create } from 'zustand';
import { Entry } from '../types/models';
import { leaderboardApi } from '../api';

interface LeaderboardState {
  currentWeek: Entry[];
  hallOfFame: Entry[]; // Reusing Entry for winners for now
  myRank: number | null;
  isLoading: boolean;

  fetchLeaderboard: () => Promise<void>;
  updateCurrentWeek: (entries: Entry[]) => void;
}

export const useLeaderboardStore = create<LeaderboardState>(set => ({
  currentWeek: [],
  hallOfFame: [],
  myRank: null,
  isLoading: false,

  fetchLeaderboard: async () => {
    set({ isLoading: true });
    try {
      const response = await leaderboardApi.getCurrent();
      set({ currentWeek: response.data || [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateCurrentWeek: entries => set({ currentWeek: entries }),
}));
