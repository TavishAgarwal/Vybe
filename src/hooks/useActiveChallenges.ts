import { useQuery } from '@tanstack/react-query';
import { challengesApi } from '../api';

export const useActiveChallenges = () => {
  return useQuery({
    queryKey: ['challenges', 'active', 'all'],
    queryFn: async () => {
      const response = await challengesApi.getAll();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
