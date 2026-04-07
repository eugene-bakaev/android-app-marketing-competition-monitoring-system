import { useState } from 'react';
import { IntervalUnit } from '@app-monitor/shared';
import { IntervalSelector } from './IntervalSelector';
import { useCreateApp } from '../hooks/useApps';

interface AddAppModalProps {
  onClose: () => void;
}

export function AddAppModal({ onClose }: AddAppModalProps) {
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
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create app');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          padding: 24,
          borderRadius: 8,
          minWidth: 400,
          maxWidth: 500,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>Add App to Monitor</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>App Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Call of Duty Mobile"
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Google Play URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=..."
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Screenshot Interval</label>
            <IntervalSelector
              value={intervalValue}
              unit={intervalUnit}
              onValueChange={setIntervalValue}
              onUnitChange={setIntervalUnit}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={createApp.isPending}>
              {createApp.isPending ? 'Adding...' : 'Add App'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
