import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api';

export const useComments = (entryId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['comments', entryId],
    queryFn: async () => {
      const response = await commentsApi.getByEntry(entryId);
      return response.data || [];
    },
    staleTime: 1000 * 60, // 1 minute
  });

  const postComment = useMutation({
    mutationFn: async (text: string) => {
      const res = await commentsApi.postComment(entryId, text);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['comments', entryId] });
    },
  });

  return {
    ...query,
    postComment,
  };
};
