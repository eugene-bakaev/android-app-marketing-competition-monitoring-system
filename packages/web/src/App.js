import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import { AppListPage } from './pages/AppListPage';
import { AppMonitorPage } from './pages/AppMonitorPage';
export function App() {
    return (_jsxs("div", { style: { maxWidth: 1200, margin: '0 auto', padding: '24px' }, children: [_jsx("h1", { style: { marginBottom: 24 }, children: "App Monitor" }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(AppListPage, {}) }), _jsx(Route, { path: "/apps/:id", element: _jsx(AppMonitorPage, {}) })] })] }));
}
