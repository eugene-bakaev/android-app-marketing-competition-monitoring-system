import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { App } from '@app-monitor/shared';
import { useUpdateApp } from '../hooks/useApps';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { EditAppModal } from './EditAppModal';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: App;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AppCard({ app }: AppCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const updateApp = useUpdateApp();

  const handleToggleActive = async (isActive: boolean) => {
    try {
      await updateApp.mutateAsync({ id: app.id, data: { isActive } });
    } catch {
      toast.error('Failed to update app');
    }
  };

  const statusDot =
    app.lastStatus === 'SUCCESS'
      ? 'bg-green-500'
      : app.lastStatus === 'FAILED'
        ? 'bg-destructive'
        : 'bg-muted-foreground/30';

  const statusTitle =
    app.lastStatus === 'SUCCESS'
      ? 'Last screenshot succeeded'
      : app.lastStatus === 'FAILED'
        ? 'Last screenshot failed'
        : 'No screenshots yet';

  return (
    <div className={cn(
      'flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-opacity',
      !app.isActive && 'opacity-60'
    )}>
      <Link to={`/apps/${app.id}`} className="flex items-center gap-4 flex-1 min-w-0 group">
        {app.iconUrl ? (
          <img src={app.iconUrl} alt="" className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-muted flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground group-hover:underline truncate">{app.name}</p>
          <p className="text-sm text-muted-foreground truncate">{app.packageId}</p>
          <p className="text-sm text-muted-foreground">
            Every {app.intervalValue} {app.intervalUnit.toLowerCase()}(s)
            {app.lastCheckedAt && (
              <span className="ml-2 text-muted-foreground/60">· {timeAgo(app.lastCheckedAt)}</span>
            )}
          </p>
        </div>
      </Link>
      <span
        title={statusTitle}
        className={cn('h-2.5 w-2.5 rounded-full flex-shrink-0', statusDot)}
      />
      <Switch
        checked={app.isActive}
        onCheckedChange={handleToggleActive}
        disabled={updateApp.isPending}
        title={app.isActive ? 'Pause monitoring' : 'Resume monitoring'}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowEdit(true)}
        className="flex-shrink-0"
      >
        Edit
      </Button>

      <EditAppModal app={app} open={showEdit} onClose={() => setShowEdit(false)} />
    </div>
  );
}
