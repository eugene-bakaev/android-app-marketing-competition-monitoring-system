import { IntervalUnit } from '@app-monitor/shared';

interface IntervalSelectorProps {
  value: number;
  unit: IntervalUnit;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: IntervalUnit) => void;
}

export function IntervalSelector({
  value,
  unit,
  onValueChange,
  onUnitChange,
}: IntervalSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label>
        Every
        <input
          type="number"
          min={1}
          value={value}
          onChange={(e) => onValueChange(Math.max(1, parseInt(e.target.value) || 1))}
          style={{ width: 60, marginLeft: 8, marginRight: 8, padding: '4px 8px' }}
        />
      </label>
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value as IntervalUnit)}
        style={{ padding: '4px 8px' }}
      >
        {Object.values(IntervalUnit).map((u) => (
          <option key={u} value={u}>
            {u.toLowerCase()}(s)
          </option>
        ))}
      </select>
    </div>
  );
}
