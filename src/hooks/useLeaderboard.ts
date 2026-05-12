import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from '../api';
import { useLeaderboardStore } from '../stores/leaderboardStore';
import { useEffect } from 'react';

export const useLeaderboard = () => {
  const query = useQuery({
    queryKey: ['leaderboard', 'current'],
    queryFn: async () => {
      const response = await leaderboardApi.getCurrent();
      return response.data || [];
    },
    refetchInterval: 30000, // auto refresh every 30 seconds as per spec
    staleTime: 10000,
  });

  const { data } = query;
  useEffect(() => {
    if (data) {
      useLeaderboardStore.setState({ currentWeek: data });
    }
  }, [data]);

  return query;
};
