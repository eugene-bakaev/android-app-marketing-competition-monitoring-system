import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useScreenshots(appId: string) {
  return useInfiniteQuery({
    queryKey: ['screenshots', appId],
    queryFn: ({ pageParam }) => api.getScreenshots(appId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
  });
}
