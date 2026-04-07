import { useState } from 'react';
import { toast } from 'sonner';
import type { App } from '@app-monitor/shared';
import { IntervalUnit } from '@app-monitor/shared';
import { IntervalSelector } from './IntervalSelector';
import { useUpdateApp, useDeleteApp } from '../hooks/useApps';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

interface EditAppModalProps {
  app: App;
  open: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export function EditAppModal({ app, open, onClose, onDelete }: EditAppModalProps) {
  const [name, setName] = useState(app.name);
  const [intervalValue, setIntervalValue] = useState(app.intervalValue);
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>(app.intervalUnit as IntervalUnit);
  const [confirming, setConfirming] = useState(false);

  const updateApp = useUpdateApp();
  const deleteApp = useDeleteApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateApp.mutateAsync({ id: app.id, data: { name, intervalValue, intervalUnit } });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update app');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApp.mutateAsync(app.id);
      onDelete ? onDelete() : onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete app');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirming(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {confirming ? (
          <>
            <DialogHeader>
              <DialogTitle>Delete {app.name}?</DialogTitle>
              <p className="text-sm text-muted-foreground">
                This will permanently remove the app and all its screenshots. This cannot be undone.
              </p>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteApp.isPending}
              >
                {deleteApp.isPending ? 'Deleting...' : 'Yes, delete'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Edit App</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Update the name or screenshot interval for this app.
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">App Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
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

              <div className="flex items-center justify-between pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setConfirming(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete app
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateApp.isPending}>
                    {updateApp.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
