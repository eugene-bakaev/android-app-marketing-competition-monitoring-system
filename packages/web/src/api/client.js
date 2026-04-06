const API_BASE = '/api';
async function request(path, options) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }
    if (res.status === 204)
        return undefined;
    return res.json();
}
export const api = {
    getApps: () => request('/apps'),
    getApp: (id) => request(`/apps/${id}`),
    createApp: (data) => request('/apps', { method: 'POST', body: JSON.stringify(data) }),
    updateApp: (id, data) => request(`/apps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteApp: (id) => request(`/apps/${id}`, { method: 'DELETE' }),
    getScreenshots: (appId, cursor, limit = 20) => {
        const params = new URLSearchParams({ limit: String(limit) });
        if (cursor)
            params.set('cursor', cursor);
        return request(`/apps/${appId}/screenshots?${params}`);
    },
};
