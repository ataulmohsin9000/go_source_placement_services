import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import api from './api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AiAssistant } from './pages/AiAssistant';
import { Cases } from './pages/Cases';
import { Clients } from './pages/Clients';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { Login } from './pages/Login';
import { Leads } from './pages/Leads';

type ColorTheme = 'light' | 'dark';

export const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    window.matchMedia('(min-width: 1024px)').matches
  );
  const [theme, setTheme] = useState<ColorTheme>(() =>
    window.localStorage.getItem('go-source-theme') === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res: any) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setCheckingAuth(false));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('go-source-theme', theme);
  }, [theme]);

  useEffect(() => {
    const desktopSidebarQuery = window.matchMedia('(min-width: 1024px)');
    const updateSidebarVisibility = (event: MediaQueryListEvent) =>
      setSidebarOpen(event.matches);

    desktopSidebarQuery.addEventListener('change', updateSidebarVisibility);
    return () => desktopSidebarQuery.removeEventListener('change', updateSidebarVisibility);
  }, []);

  if (checkingAuth) {
    return <div className="p-8 text-slate-500">Checking your session...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />}
      />
      <Route
        path="/*"
        element={
          user ? (
            <div className={`app-shell${theme === 'dark' ? ' theme-dark' : ''}`}>
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onNavigate={() => {
                  if (!window.matchMedia('(min-width: 1024px)').matches) {
                    setSidebarOpen(false);
                  }
                }}
              />
              <button
                type="button"
                aria-label="Dismiss navigation overlay"
                className={`sidebar-backdrop${sidebarOpen ? ' sidebar-backdrop-open' : ''}`}
                onClick={() => setSidebarOpen(false)}
                tabIndex={sidebarOpen ? 0 : -1}
                aria-hidden={!sidebarOpen}
              />
              <div className="app-content">
                <Header
                  user={user}
                  onLogout={() => setUser(null)}
                  onMenuClick={() => setSidebarOpen((open) => !open)}
                  sidebarOpen={sidebarOpen}
                  theme={theme}
                  onThemeToggle={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
                />
                <main className="app-main">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/cases" element={<Cases />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/ai-assistant" element={<AiAssistant />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
