import type { Screenshot } from '@app-monitor/shared';
import { AlertCircle } from 'lucide-react';

interface ScreenshotCardProps {
  screenshot: Screenshot;
}

export function ScreenshotCard({ screenshot }: ScreenshotCardProps) {
  const time = new Date(screenshot.takenAt).toLocaleString();

  if (screenshot.status === 'FAILED') {
    return (
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-2">{time}</p>
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">
            Screenshot failed: {screenshot.error || 'Unknown error'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <p className="text-xs text-muted-foreground mb-2">{time}</p>
      <img
        src={screenshot.s3Url}
        alt={`Screenshot taken at ${time}`}
        className="w-full rounded-lg border object-cover"
      />
    </div>
  );
}
