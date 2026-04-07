import { useState } from 'react';
import { IntervalUnit } from '@app-monitor/shared';
import { IntervalSelector } from './IntervalSelector';
import { useCreateApp } from '../hooks/useApps';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>(IntervalUnit.HOUR);

  const createApp = useCreateApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createApp.mutateAsync({
        name,
        playStoreUrl: url,
        intervalValue,
        intervalUnit,
      });
      setName('');
      setUrl('');
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create app');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add App to Monitor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-name">App Name</Label>
            <Input
              id="app-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Call of Duty Mobile"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="play-url">Google Play URL</Label>
            <Input
              id="play-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Screenshot Interval</Label>
            <IntervalSelector
              value={intervalValue}
              unit={intervalUnit}
              onValueChange={setIntervalValue}
              onUnitChange={setIntervalUnit}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createApp.isPending}>
              {createApp.isPending ? 'Adding...' : 'Add App'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
