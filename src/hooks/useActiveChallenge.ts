import { useQuery } from '@tanstack/react-query';
import { challengesApi } from '../api';

export const useActiveChallenge = () => {
  return useQuery({
    queryKey: ['challenge', 'active'],
    queryFn: async () => {
      const response = await challengesApi.getActive();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
