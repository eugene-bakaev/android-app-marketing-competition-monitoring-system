import { Routes, Route } from 'react-router-dom';
import { AppListPage } from './pages/AppListPage';
import { AppMonitorPage } from './pages/AppMonitorPage';

export function App() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-foreground">App Monitor</h1>
      <Routes>
        <Route path="/" element={<AppListPage />} />
        <Route path="/apps/:id" element={<AppMonitorPage />} />
      </Routes>
    </div>
  );
}
