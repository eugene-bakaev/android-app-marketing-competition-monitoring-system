import { useState } from 'react';
import { useApps } from '../hooks/useApps';
import { AppCard } from '../components/AppCard';
import { AddAppModal } from '../components/AddAppModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AppListPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: apps, isLoading, error } = useApps();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Loading apps...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
        Error loading apps: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Tracked Apps</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Add App
        </Button>
      </div>

      {apps && apps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
          <p>No apps being monitored.</p>
          <p className="text-sm">Click &ldquo;Add App&rdquo; to start tracking.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {apps?.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      <AddAppModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
