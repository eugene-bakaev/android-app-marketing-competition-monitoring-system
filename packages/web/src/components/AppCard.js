import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useDeleteApp } from '../hooks/useApps';
export function AppCard({ app }) {
    const deleteApp = useDeleteApp();
    const handleDelete = async () => {
        if (!confirm(`Delete ${app.name}? All screenshots will be removed.`))
            return;
        await deleteApp.mutateAsync(app.id);
    };
    const statusColor = app.lastStatus === 'SUCCESS'
        ? '#2ecc71'
        : app.lastStatus === 'FAILED'
            ? '#e74c3c'
            : '#bdc3c7';
    return (_jsxs("div", { style: {
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
        }, children: [app.iconUrl ? (_jsx("img", { src: app.iconUrl, alt: "", style: { width: 48, height: 48, borderRadius: 8 } })) : (_jsx("div", { style: { width: 48, height: 48, borderRadius: 8, background: '#eee', flexShrink: 0 } })), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx(Link, { to: `/apps/${app.id}`, style: { fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#2c3e50' }, children: app.name }), _jsx("div", { style: { color: '#666', fontSize: 14 }, children: app.packageId }), _jsxs("div", { style: { color: '#666', fontSize: 14 }, children: ["Every ", app.intervalValue, " ", app.intervalUnit.toLowerCase(), "(s)"] })] }), _jsx("div", { title: app.lastStatus || 'No data yet', style: {
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: statusColor,
                    flexShrink: 0,
                } }), _jsx("button", { onClick: handleDelete, disabled: deleteApp.isPending, style: { color: '#e74c3c', background: 'none', border: '1px solid #e74c3c', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }, children: "Delete" })] }));
}
