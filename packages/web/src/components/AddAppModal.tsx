import { useState } from 'react';
import { toast } from 'sonner';
import { IntervalUnit, validatePlayStoreUrl } from '@app-monitor/shared';
import { IntervalSelector } from './IntervalSelector';
import { useCreateApp } from '../hooks/useApps';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddAppModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddAppModal({ open, onClose }: AddAppModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [urlTouched, setUrlTouched] = useState(false);
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>(IntervalUnit.HOUR);

  const urlError = urlTouched && url.length > 0 && !validatePlayStoreUrl(url)
    ? 'Must be a valid Google Play URL: play.google.com/store/apps/details?id=…'
    : null;

  const createApp = useCreateApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlTouched(true);
    if (!validatePlayStoreUrl(url)) return;
    try {
      await createApp.mutateAsync(
        { name, playStoreUrl: url, intervalValue, intervalUnit },
        {
          onSuccess: () => {
            setName('');
            setUrl('');
            setUrlTouched(false);
            onClose();
          },
        }
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create app');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add App to Monitor</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Paste a Google Play URL and set how often to take screenshots.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="app-name">App Name</Label>
            <Input
              id="app-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="play-url">Google Play URL</Label>
            <Input
              id="play-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setUrlTouched(true)}
              required
              className={urlError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {urlError && (
              <p className='text-xs text-destructive'>{urlError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Screenshot Interval</Label>
            <IntervalSelector
              value={intervalValue}
              unit={intervalUnit}
              onValueChange={setIntervalValue}
              onUnitChange={setIntervalUnit}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createApp.isPending}>
              {createApp.isPending ? 'Adding...' : 'Add App'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
