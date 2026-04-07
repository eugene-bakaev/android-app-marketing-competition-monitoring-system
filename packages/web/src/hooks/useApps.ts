import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { CreateAppRequest, UpdateAppRequest } from '@app-monitor/shared';

export function useApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: api.getApps,
  });
}

export function useApp(id: string) {
  return useQuery({
    queryKey: ['apps', id],
    queryFn: () => api.getApp(id),
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppRequest) => api.createApp(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apps'] }),
  });
}

export function useUpdateApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppRequest }) =>
      api.updateApp(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apps'] }),
  });
}

export function useDeleteApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteApp(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apps'] }),
  });
}
