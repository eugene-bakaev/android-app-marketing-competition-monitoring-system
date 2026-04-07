import { IntervalUnit } from '@app-monitor/shared';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Every</span>
      <Input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onValueChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-20"
      />
      <Select value={unit} onValueChange={(v) => onUnitChange(v as IntervalUnit)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(IntervalUnit).map((u) => (
            <SelectItem key={u} value={u}>
              {u.toLowerCase()}(s)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
