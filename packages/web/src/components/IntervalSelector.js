import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IntervalUnit } from '@app-monitor/shared';
export function IntervalSelector({ value, unit, onValueChange, onUnitChange, }) {
    return (_jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsxs("label", { children: ["Every", _jsx("input", { type: "number", min: 1, value: value, onChange: (e) => onValueChange(Math.max(1, parseInt(e.target.value) || 1)), style: { width: 60, marginLeft: 8, marginRight: 8, padding: '4px 8px' } })] }), _jsx("select", { value: unit, onChange: (e) => onUnitChange(e.target.value), style: { padding: '4px 8px' }, children: Object.values(IntervalUnit).map((u) => (_jsxs("option", { value: u, children: [u.toLowerCase(), "(s)"] }, u))) })] }));
}
