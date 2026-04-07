import { useState } from 'react';
import { useApps } from '../hooks/useApps';
import { AppCard } from '../components/AppCard';
import { AddAppModal } from '../components/AddAppModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

function AppCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
      <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-2.5 w-2.5 rounded-full" />
      <Skeleton className="h-5 w-9 rounded-full" />
      <Skeleton className="h-8 w-14 rounded-md" />
    </div>
  );
}

export function AppListPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: apps, isLoading, error } = useApps();

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

      {isLoading && (
        <div className="flex flex-col gap-3">
          <AppCardSkeleton />
          <AppCardSkeleton />
          <AppCardSkeleton />
        </div>
      )}

      {!isLoading && apps?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
          <p>No apps being monitored.</p>
          <p className="text-sm">Click &ldquo;Add App&rdquo; to start tracking.</p>
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-3">
          {apps?.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}

      <AddAppModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
