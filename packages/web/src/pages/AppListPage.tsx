import { useState } from 'react';
import { useApps } from '../hooks/useApps';
import { AppCard } from '../components/AppCard';
import { AddAppModal } from '../components/AddAppModal';

export function AppListPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: apps, isLoading, error } = useApps();

  if (isLoading) return <div>Loading apps...</div>;
  if (error) return <div>Error loading apps: {error.message}</div>;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Tracked Apps</h2>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '8px 16px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          + Add App
        </button>
      </div>

      {apps && apps.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999', padding: 48 }}>
          No apps being monitored. Click &ldquo;Add App&rdquo; to start tracking.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {apps?.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      {showAddModal && <AddAppModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
