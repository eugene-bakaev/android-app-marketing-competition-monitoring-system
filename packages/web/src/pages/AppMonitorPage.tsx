import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApps';
import { useScreenshots } from '../hooks/useScreenshots';
import type { Screenshot } from '@app-monitor/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EditAppModal } from '../components/EditAppModal';
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, AlertCircle, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

function groupByDate(screenshots: Screenshot[]) {
  const groups: { date: string; items: Screenshot[] }[] = [];
  for (const s of screenshots) {
    const date = new Date(s.takenAt).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const last = groups[groups.length - 1];
    if (last && last.date === date) {
      last.items.push(s);
    } else {
      groups.push({ date, items: [s] });
    }
  }
  return groups;
}

export function AppMonitorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: app, isLoading: appLoading } = useApp(id!);
  const {
    data: screenshotPages,
    isLoading: screenshotsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useScreenshots(id!);

  const allScreenshots = screenshotPages?.pages.flatMap((p) => p.data) ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-select first screenshot when loaded
  useEffect(() => {
    if (!selectedId && allScreenshots.length > 0) {
      setSelectedId(allScreenshots[0].id);
    }
  }, [allScreenshots.length]);

  const selectedIndex = allScreenshots.findIndex((s) => s.id === selectedId);
  const selected = selectedIndex >= 0 ? allScreenshots[selectedIndex] : null;

  const goTo = (index: number) => {
    if (index >= 0 && index < allScreenshots.length) {
      setSelectedId(allScreenshots[index].id);
    }
  };

  // Page title
  useEffect(() => {
    document.title = app ? `${app.name} — App Monitor` : 'App Monitor';
    return () => { document.title = 'App Monitor'; };
  }, [app?.name]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') goTo(selectedIndex - 1);
      if (e.key === 'ArrowRight') goTo(selectedIndex + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIndex, allScreenshots.length]);

  if (appLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex gap-6">
          <div className="w-56 flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Skeleton className="flex-1 h-96 rounded-lg" />
        </div>
      </div>
    );
  }
  if (!app) {
    return <div className="text-muted-foreground py-12 text-center">App not found</div>;
  }

  const startDate = new Date(app.createdAt).toLocaleDateString();
  const groups = groupByDate(allScreenshots);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to apps
        </Link>

        <div className="flex items-center gap-4 mt-2">
          {app.iconUrl ? (
            <img src={app.iconUrl} alt="" className="h-14 w-14 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="h-14 w-14 rounded-xl bg-muted flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{app.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground flex-shrink-0"
                onClick={() => setShowEdit(true)}
                title="Edit app"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-sm text-muted-foreground flex-wrap">
              <span>{app.packageId}</span>
              <a
                href={app.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Play Store <ExternalLink className="h-3 w-3" />
              </a>
              <span>Since {startDate}</span>
              <span>
                Every {app.intervalValue} {app.intervalUnit.toLowerCase()}(s)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t" />

      {/* Timeline + Viewer */}
      {screenshotsLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          Loading screenshots...
        </div>
      )}

      {!screenshotsLoading && allScreenshots.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
          <p>No screenshots yet.</p>
          <p className="text-sm">The first one will be taken shortly.</p>
        </div>
      )}

      {allScreenshots.length > 0 && (
        <div className="flex flex-col gap-4 md:flex-row md:gap-6 md:items-start">
          {/* Timeline — horizontal strip on mobile, vertical sidebar on desktop */}
          <div
            ref={sidebarRef}
            className="flex flex-row gap-2 overflow-x-auto pb-2 md:flex-col md:w-56 md:flex-shrink-0 md:gap-4 md:max-h-[80vh] md:overflow-x-hidden md:overflow-y-auto md:pb-0 md:pr-1"
          >
            {groups.map((group) => (
              <div key={group.date} className="flex flex-row items-center gap-1 flex-shrink-0 md:flex-col md:items-stretch md:flex-shrink">
                {/* Date label */}
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap px-1 md:uppercase md:tracking-wide md:sticky md:top-0 md:bg-background md:py-0.5 md:mb-1 md:px-0">
                  {group.date}
                </span>
                {/* Entries */}
                <div className="flex flex-row gap-1 md:flex-col">
                  {group.items.map((s) => {
                    const time = new Date(s.takenAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedId(s.id)}
                        className={cn(
                          'flex-shrink-0 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors md:w-full md:justify-between',
                          s.id === selectedId
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-foreground'
                        )}
                      >
                        <span className="font-mono text-xs">{time}</span>
                        {s.status === 'FAILED' ? (
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-destructive" />
                        ) : (
                          <span
                            className={cn(
                              'h-2 w-2 rounded-full flex-shrink-0',
                              s.id === selectedId ? 'bg-primary-foreground' : 'bg-green-500'
                            )}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {hasNextPage && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 text-muted-foreground md:w-full"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load more'}
              </Button>
            )}
          </div>

          {/* Screenshot viewer */}
          <div className="flex-1 min-w-0">
            {selected ? (
              <div>
                {/* Nav bar */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">
                    {new Date(selected.takenAt).toLocaleString()}
                    {selected.status === 'FAILED' && (
                      <Badge variant="destructive" className="ml-2">Failed</Badge>
                    )}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={selectedIndex <= 0}
                      onClick={() => goTo(selectedIndex - 1)}
                      title="Previous"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground px-2">
                      {selectedIndex + 1} / {allScreenshots.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={selectedIndex >= allScreenshots.length - 1}
                      onClick={() => goTo(selectedIndex + 1)}
                      title="Next"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selected.status === 'FAILED' ? (
                  <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">
                      Screenshot failed: {selected.error || 'Unknown error'}
                    </span>
                  </div>
                ) : (
                  <img
                    key={selected.id}
                    src={selected.s3Url}
                    alt={`Screenshot taken at ${new Date(selected.takenAt).toLocaleString()}`}
                    className="w-full rounded-lg border"
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {app && (
        <EditAppModal
          app={app}
          open={showEdit}
          onClose={() => setShowEdit(false)}
          onDelete={() => navigate('/')}
        />
      )}
    </div>
  );
}
