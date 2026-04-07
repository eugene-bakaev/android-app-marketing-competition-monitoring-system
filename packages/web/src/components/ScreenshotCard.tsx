import type { Screenshot } from '@app-monitor/shared';

interface ScreenshotCardProps {
  screenshot: Screenshot;
}

export function ScreenshotCard({ screenshot }: ScreenshotCardProps) {
  const time = new Date(screenshot.takenAt).toLocaleString();

  if (screenshot.status === 'FAILED') {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
          Screenshot time: {time}
        </div>
        <div
          style={{
            border: '2px solid #e74c3c',
            borderRadius: 8,
            padding: 24,
            background: '#fdf0ef',
            color: '#c0392b',
            textAlign: 'center',
          }}
        >
          Screenshot failed: {screenshot.error || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
        Screenshot time: {time}
      </div>
      <img
        src={screenshot.s3Url}
        alt={`Screenshot taken at ${time}`}
        style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd' }}
      />
    </div>
  );
}
