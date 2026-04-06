import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { IntervalUnit } from '@app-monitor/shared';
import { IntervalSelector } from './IntervalSelector';
import { useCreateApp } from '../hooks/useApps';
export function AddAppModal({ onClose }) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [intervalValue, setIntervalValue] = useState(1);
    const [intervalUnit, setIntervalUnit] = useState(IntervalUnit.HOUR);
    const createApp = useCreateApp();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createApp.mutateAsync({
                name,
                playStoreUrl: url,
                intervalValue,
                intervalUnit,
            });
            onClose();
        }
        catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to create app');
        }
    };
    return (_jsx("div", { style: {
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
        }, onClick: onClose, children: _jsxs("div", { style: {
                background: 'white',
                padding: 24,
                borderRadius: 8,
                minWidth: 400,
                maxWidth: 500,
            }, onClick: (e) => e.stopPropagation(), children: [_jsx("h2", { style: { marginTop: 0 }, children: "Add App to Monitor" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { marginBottom: 16 }, children: [_jsx("label", { style: { display: 'block', marginBottom: 4 }, children: "App Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g., Call of Duty Mobile", required: true, style: { width: '100%', padding: '8px', boxSizing: 'border-box' } })] }), _jsxs("div", { style: { marginBottom: 16 }, children: [_jsx("label", { style: { display: 'block', marginBottom: 4 }, children: "Google Play URL" }), _jsx("input", { type: "url", value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://play.google.com/store/apps/details?id=...", required: true, style: { width: '100%', padding: '8px', boxSizing: 'border-box' } })] }), _jsxs("div", { style: { marginBottom: 16 }, children: [_jsx("label", { style: { display: 'block', marginBottom: 4 }, children: "Screenshot Interval" }), _jsx(IntervalSelector, { value: intervalValue, unit: intervalUnit, onValueChange: setIntervalValue, onUnitChange: setIntervalUnit })] }), _jsxs("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' }, children: [_jsx("button", { type: "button", onClick: onClose, children: "Cancel" }), _jsx("button", { type: "submit", disabled: createApp.isPending, children: createApp.isPending ? 'Adding...' : 'Add App' })] })] })] }) }));
}
