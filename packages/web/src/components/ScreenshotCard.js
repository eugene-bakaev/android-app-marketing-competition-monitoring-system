import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export function ScreenshotCard({ screenshot }) {
    const time = new Date(screenshot.takenAt).toLocaleString();
    if (screenshot.status === 'FAILED') {
        return (_jsxs("div", { style: { marginBottom: 24 }, children: [_jsxs("div", { style: { color: '#666', fontSize: 14, marginBottom: 8 }, children: ["Screenshot time: ", time] }), _jsxs("div", { style: {
                        border: '2px solid #e74c3c',
                        borderRadius: 8,
                        padding: 24,
                        background: '#fdf0ef',
                        color: '#c0392b',
                        textAlign: 'center',
                    }, children: ["Screenshot failed: ", screenshot.error || 'Unknown error'] })] }));
    }
    return (_jsxs("div", { style: { marginBottom: 24 }, children: [_jsxs("div", { style: { color: '#666', fontSize: 14, marginBottom: 8 }, children: ["Screenshot time: ", time] }), _jsx("img", { src: screenshot.s3Url, alt: `Screenshot taken at ${time}`, style: { width: '100%', borderRadius: 8, border: '1px solid #ddd' } })] }));
}
