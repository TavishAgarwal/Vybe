import { useQuery } from '@tanstack/react-query';
import { supabase } from '../api/supabase';
import { logger } from '../utils/logger';

interface ProfileStats {
  entries: number;
  totalVotes: number;
  wins: number;
}

export const useProfileStats = (userId: string | undefined) => {
  return useQuery<ProfileStats>({
    queryKey: ['profile-stats', userId],
    queryFn: async () => {
      if (!userId) {
        return { entries: 0, totalVotes: 0, wins: 0 };
      }

      try {
        // Count entries
        const { count: entryCount, error: countError } = await supabase
          .from('entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (countError) {
          logger.warn('Failed to fetch entry count', countError);
        }

        // Sum vote_count across all entries
        const { data: voteData, error: voteError } = await supabase
          .from('entries')
          .select('vote_count')
          .eq('user_id', userId);

        if (voteError) {
          logger.warn('Failed to fetch vote totals', voteError);
        }

        const totalVotes = (voteData ?? []).reduce(
          (sum, row) => sum + ((row as { vote_count: number }).vote_count || 0),
          0,
        );

        // Count wins (entries with status 'winner')
        const { count: winCount, error: winError } = await supabase
          .from('entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'winner');

        if (winError) {
          logger.warn('Failed to fetch win count', winError);
        }

        return {
          entries: entryCount ?? 0,
          totalVotes,
          wins: winCount ?? 0,
        };
      } catch (e) {
        logger.error('useProfileStats failed', e);
        return { entries: 0, totalVotes: 0, wins: 0 };
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
