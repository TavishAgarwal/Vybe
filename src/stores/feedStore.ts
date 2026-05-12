import { create } from 'zustand';
import { Entry, ReactionCountKey } from '../types/models';
import { entriesApi, votesApi } from '../api';

interface FeedState {
  entries: Entry[];
  currentIndex: number;
  isLoading: boolean;
  hasMore: boolean;
  nextCursor?: number;
  votedEntryIds: Set<string>;

  loadFeed: (challengeId: string, refresh?: boolean) => Promise<void>;
  setCurrentIndex: (index: number) => void;
  vote: (entryId: string) => Promise<void>;
  react: (entryId: string, type: ReactionCountKey) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  entries: [],
  currentIndex: 0,
  isLoading: false,
  hasMore: true,
  votedEntryIds: new Set(),

  loadFeed: async (challengeId, refresh = false) => {
    const { isLoading, hasMore, nextCursor, entries } = get();
    if (isLoading || (!hasMore && !refresh)) {
      return;
    }

    set({ isLoading: true });
    try {
      const cursor = refresh ? 0 : nextCursor;
      const response = await entriesApi.getFeed(challengeId, cursor);

      set({
        entries: refresh
          ? response.data || []
          : [...entries, ...(response.data || [])],
        nextCursor: response.nextCursor,
        hasMore: !!response.nextCursor,
        isLoading: false,
        currentIndex: refresh ? 0 : get().currentIndex,
      });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  setCurrentIndex: index => set({ currentIndex: index }),

  vote: async entryId => {
    const { votedEntryIds, entries } = get();
    if (votedEntryIds.has(entryId)) {
      return;
    }

    // Optimistic update
    const newVoted = new Set(votedEntryIds).add(entryId);

    set({
      votedEntryIds: newVoted,
      entries: entries.map(e =>
        e.id === entryId ? { ...e, voteCount: e.voteCount + 1 } : e,
      ),
    });

    try {
      await votesApi.vote(entryId);
    } catch (error) {
      // Rollback
      const rollVoted = new Set(votedEntryIds);
      rollVoted.delete(entryId);
      set({
        votedEntryIds: rollVoted,
        entries: entries.map(e =>
          e.id === entryId ? { ...e, voteCount: e.voteCount - 1 } : e,
        ),
      });
      throw error;
    }
  },

  react: async (entryId, type) => {
    // Simplified optimistic update for reactions
    const { entries } = get();
    set({
      entries: entries.map(e => {
        if (e.id !== entryId) {
          return e;
        }
        const currentCount = e.reactionCounts[type];
        return {
          ...e,
          reactionCounts: {
            ...e.reactionCounts,
            [type]: currentCount + 1,
          },
        };
      }),
    });
  },
}));
