import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useApps } from '../hooks/useApps';
import { AppCard } from '../components/AppCard';
import { AddAppModal } from '../components/AddAppModal';
export function AppListPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const { data: apps, isLoading, error } = useApps();
    if (isLoading)
        return _jsx("div", { children: "Loading apps..." });
    if (error)
        return _jsxs("div", { children: ["Error loading apps: ", error.message] });
    return (_jsxs("div", { children: [_jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }, children: [_jsx("h2", { style: { margin: 0 }, children: "Tracked Apps" }), _jsx("button", { onClick: () => setShowAddModal(true), style: {
                            padding: '8px 16px',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 14,
                        }, children: "+ Add App" })] }), apps && apps.length === 0 && (_jsx("div", { style: { textAlign: 'center', color: '#999', padding: 48 }, children: "No apps being monitored. Click \u201CAdd App\u201D to start tracking." })), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: apps?.map((app) => (_jsx(AppCard, { app: app }, app.id))) }), showAddModal && _jsx(AddAppModal, { onClose: () => setShowAddModal(false) })] }));
}
