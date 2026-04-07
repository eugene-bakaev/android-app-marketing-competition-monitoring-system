import { Routes, Route } from 'react-router-dom';
import { AppListPage } from './pages/AppListPage';
import { AppMonitorPage } from './pages/AppMonitorPage';

export function App() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <h1 style={{ marginBottom: 24 }}>App Monitor</h1>
      <Routes>
        <Route path="/" element={<AppListPage />} />
        <Route path="/apps/:id" element={<AppMonitorPage />} />
      </Routes>
    </div>
  );
}
