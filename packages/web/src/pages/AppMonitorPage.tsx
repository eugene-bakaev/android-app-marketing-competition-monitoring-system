import { useParams, Link } from 'react-router-dom';
import { useApp } from '../hooks/useApps';
import { useScreenshots } from '../hooks/useScreenshots';
import { ScreenshotCard } from '../components/ScreenshotCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

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

  if (appLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-muted-foreground py-12 text-center">App not found</div>
    );
  }

  const screenshots = screenshotPages?.pages.flatMap((p) => p.data) ?? [];
  const startDate = new Date(app.createdAt).toLocaleDateString();

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to apps
      </Link>

      <div className="flex items-center gap-4 mt-4 mb-3">
        {app.iconUrl ? (
          <img src={app.iconUrl} alt="" className="h-16 w-16 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-muted flex-shrink-0" />
        )}
        <div>
          <h2 className="text-2xl font-bold">{app.name}</h2>
          <p className="text-sm text-muted-foreground">{app.packageId}</p>
        </div>
      </div>

      <div className="mb-6 space-y-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="font-medium text-foreground">Link:</span>
          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Play Store
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div>
          <span className="font-medium text-foreground">Monitoring since:</span> {startDate}
        </div>
        <div>
          <span className="font-medium text-foreground">Interval:</span> Every {app.intervalValue}{' '}
          {app.intervalUnit.toLowerCase()}(s)
        </div>
      </div>

      <div className="border-t mb-6" />

      {screenshotsLoading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
          Loading screenshots...
        </div>
      )}

      {screenshots.length === 0 && !screenshotsLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
          <p>No screenshots yet.</p>
          <p className="text-sm">The first one will be taken shortly.</p>
        </div>
      )}

      {screenshots.map((s) => (
        <ScreenshotCard key={s.id} screenshot={s} />
      ))}

      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
