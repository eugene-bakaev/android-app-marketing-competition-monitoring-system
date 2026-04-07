import { Link } from 'react-router-dom';
import type { App } from '@app-monitor/shared';
import { useDeleteApp } from '../hooks/useApps';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  const deleteApp = useDeleteApp();

  const handleDelete = async () => {
    if (!confirm(`Delete ${app.name}? All screenshots will be removed.`)) return;
    await deleteApp.mutateAsync(app.id);
  };

  const statusVariant =
    app.lastStatus === 'SUCCESS'
      ? 'success'
      : app.lastStatus === 'FAILED'
        ? 'destructive'
        : 'secondary';

  const statusLabel = app.lastStatus ?? 'No data';

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
      {app.iconUrl ? (
        <img src={app.iconUrl} alt="" className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-muted flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <Link
          to={`/apps/${app.id}`}
          className="text-base font-semibold text-foreground hover:underline"
        >
          {app.name}
        </Link>
        <p className="text-sm text-muted-foreground truncate">{app.packageId}</p>
        <p className="text-sm text-muted-foreground">
          Every {app.intervalValue} {app.intervalUnit.toLowerCase()}(s)
        </p>
      </div>
      <Badge variant={statusVariant} className={cn('flex-shrink-0')}>
        {statusLabel}
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={deleteApp.isPending}
        className="flex-shrink-0 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        Delete
      </Button>
    </div>
  );
}
