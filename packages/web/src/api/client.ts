import type {
  App,
  CreateAppRequest,
  UpdateAppRequest,
  PaginatedResponse,
  Screenshot,
} from '@app-monitor/shared';

const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getApps: () => request<App[]>('/apps'),

  getApp: (id: string) => request<App>(`/apps/${id}`),

  createApp: (data: CreateAppRequest) =>
    request<App>('/apps', { method: 'POST', body: JSON.stringify(data) }),

  updateApp: (id: string, data: UpdateAppRequest) =>
    request<App>(`/apps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteApp: (id: string) => request<void>(`/apps/${id}`, { method: 'DELETE' }),

  getScreenshots: (appId: string, cursor?: string, limit = 20) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    return request<PaginatedResponse<Screenshot>>(`/apps/${appId}/screenshots?${params}`);
  },
};
