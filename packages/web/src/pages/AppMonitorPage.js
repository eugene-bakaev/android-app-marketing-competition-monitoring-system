import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../hooks/useApps';
import { useScreenshots } from '../hooks/useScreenshots';
import { ScreenshotCard } from '../components/ScreenshotCard';
export function AppMonitorPage() {
    const { id } = useParams();
    const { data: app, isLoading: appLoading } = useApp(id);
    const { data: screenshotPages, isLoading: screenshotsLoading, fetchNextPage, hasNextPage, isFetchingNextPage, } = useScreenshots(id);
    if (appLoading)
        return _jsx("div", { children: "Loading..." });
    if (!app)
        return _jsx("div", { children: "App not found" });
    const screenshots = screenshotPages?.pages.flatMap((p) => p.data) ?? [];
    const startDate = new Date(app.createdAt).toLocaleDateString();
    return (_jsxs("div", { children: [_jsx(Link, { to: "/", style: { marginBottom: 16, display: 'inline-block', color: '#2196F3' }, children: "\u2190 Back to apps" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, marginTop: 16 }, children: [app.iconUrl ? (_jsx("img", { src: app.iconUrl, alt: "", style: { width: 64, height: 64, borderRadius: 12 } })) : (_jsx("div", { style: { width: 64, height: 64, borderRadius: 12, background: '#eee', flexShrink: 0 } })), _jsxs("div", { children: [_jsx("h2", { style: { margin: 0 }, children: app.name }), _jsx("div", { style: { color: '#666' }, children: app.packageId })] })] }), _jsxs("div", { style: { marginBottom: 24, color: '#666', lineHeight: 1.8 }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Link:" }), ' ', _jsx("a", { href: app.playStoreUrl, target: "_blank", rel: "noopener noreferrer", children: app.playStoreUrl })] }), _jsxs("div", { children: [_jsx("strong", { children: "Start time:" }), " ", startDate] }), _jsxs("div", { children: [_jsx("strong", { children: "Interval:" }), " Every ", app.intervalValue, " ", app.intervalUnit.toLowerCase(), "(s)"] })] }), _jsx("hr", { style: { marginBottom: 24, border: 'none', borderTop: '1px solid #eee' } }), screenshotsLoading && _jsx("div", { children: "Loading screenshots..." }), screenshots.length === 0 && !screenshotsLoading && (_jsx("div", { style: { textAlign: 'center', color: '#999', padding: 48 }, children: "No screenshots yet. The first one will be taken shortly." })), screenshots.map((s) => (_jsx(ScreenshotCard, { screenshot: s }, s.id))), hasNextPage && (_jsx("div", { style: { textAlign: 'center', marginTop: 24 }, children: _jsx("button", { onClick: () => fetchNextPage(), disabled: isFetchingNextPage, style: { padding: '8px 24px', cursor: 'pointer' }, children: isFetchingNextPage ? 'Loading more...' : 'Load More' }) }))] }));
}
