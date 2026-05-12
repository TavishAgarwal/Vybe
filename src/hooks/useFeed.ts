import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { entriesApi } from '../api';
import { useFeedStore } from '../stores/feedStore';
import { useEffect } from 'react';
import { supabase } from '../api/supabase';
import { DbVote } from '../types/database';

export const useFeed = (challengeId: string) => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['feed', challengeId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await entriesApi.getFeed(challengeId, pageParam);
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Sync with Zustand store to allow optimistic vote updates on the feed array
  const { data } = query;
  useEffect(() => {
    if (data) {
      const flatEntries = data.pages.flatMap(page => page.data || []);
      useFeedStore.setState({
        entries: flatEntries,
        hasMore: query.hasNextPage,
      });
    }
  }, [data, query.hasNextPage]);

  // --- Supabase Realtime: live vote count updates ---
  useEffect(() => {
    if (!challengeId) {
      return;
    }

    const channel = supabase
      .channel(`votes:${challengeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
        },
        payload => {
          // When a new vote is inserted, bump the local vote count optimistically
          const nextVote = payload.new as Partial<DbVote> | null;
          const entryId = nextVote?.entry_id;
          if (!entryId) {
            return;
          }

          const { entries, votedEntryIds } = useFeedStore.getState();
          if (votedEntryIds.has(entryId)) {
            return;
          }
          const match = entries.find(e => e.id === entryId);
          if (match) {
            useFeedStore.setState({
              entries: entries.map(e =>
                e.id === entryId ? { ...e, voteCount: e.voteCount + 1 } : e,
              ),
            });
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'votes',
        },
        payload => {
          const previousVote = payload.old as Partial<DbVote> | null;
          const entryId = previousVote?.entry_id;
          if (!entryId) {
            return;
          }

          const { entries } = useFeedStore.getState();
          const match = entries.find(e => e.id === entryId);
          if (match) {
            useFeedStore.setState({
              entries: entries.map(e =>
                e.id === entryId
                  ? { ...e, voteCount: Math.max(0, e.voteCount - 1) }
                  : e,
              ),
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [challengeId]);

  // --- Realtime: new entries appearing in the feed ---
  useEffect(() => {
    if (!challengeId) {
      return;
    }

    const channel = supabase
      .channel(`entries:${challengeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'entries',
          filter: `challenge_id=eq.${challengeId}`,
        },
        () => {
          // A new entry was published — invalidate the feed query to pick it up
          queryClient.invalidateQueries({ queryKey: ['feed', challengeId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [challengeId, queryClient]);

  return query;
};
