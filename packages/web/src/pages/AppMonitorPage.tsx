import { useParams, Link } from 'react-router-dom';
import { useApp } from '../hooks/useApps';
import { useScreenshots } from '../hooks/useScreenshots';
import { ScreenshotCard } from '../components/ScreenshotCard';

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

  if (appLoading) return <div>Loading...</div>;
  if (!app) return <div>App not found</div>;

  const screenshots = screenshotPages?.pages.flatMap((p) => p.data) ?? [];
  const startDate = new Date(app.createdAt).toLocaleDateString();

  return (
    <div>
      <Link to="/" style={{ marginBottom: 16, display: 'inline-block', color: '#2196F3' }}>
        &larr; Back to apps
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, marginTop: 16 }}>
        {app.iconUrl ? (
          <img src={app.iconUrl} alt="" style={{ width: 64, height: 64, borderRadius: 12 }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: 12, background: '#eee', flexShrink: 0 }} />
        )}
        <div>
          <h2 style={{ margin: 0 }}>{app.name}</h2>
          <div style={{ color: '#666' }}>{app.packageId}</div>
        </div>
      </div>

      <div style={{ marginBottom: 24, color: '#666', lineHeight: 1.8 }}>
        <div>
          <strong>Link:</strong>{' '}
          <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer">
            {app.playStoreUrl}
          </a>
        </div>
        <div>
          <strong>Start time:</strong> {startDate}
        </div>
        <div>
          <strong>Interval:</strong> Every {app.intervalValue} {app.intervalUnit.toLowerCase()}(s)
        </div>
      </div>

      <hr style={{ marginBottom: 24, border: 'none', borderTop: '1px solid #eee' }} />

      {screenshotsLoading && <div>Loading screenshots...</div>}

      {screenshots.length === 0 && !screenshotsLoading && (
        <div style={{ textAlign: 'center', color: '#999', padding: 48 }}>
          No screenshots yet. The first one will be taken shortly.
        </div>
      )}

      {screenshots.map((s) => (
        <ScreenshotCard key={s.id} screenshot={s} />
      ))}

      {hasNextPage && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={{ padding: '8px 24px', cursor: 'pointer' }}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
