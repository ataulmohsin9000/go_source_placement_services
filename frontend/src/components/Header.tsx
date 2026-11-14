import React from 'react';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../api';

type ColorTheme = 'light' | 'dark';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onMenuClick: () => void;
  sidebarOpen: boolean;
  theme: ColorTheme;
  onThemeToggle: () => void;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/leads': 'Leads & enquiries',
  '/cases': 'Visa cases',
  '/clients': 'Clients & applicants',
  '/invoices': 'Invoices & finance',
  '/ai-assistant': 'AI assistant',
};

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onMenuClick,
  sidebarOpen,
  theme,
  onThemeToggle,
}) => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      onLogout();
    }
  };

  return (
    <header className="app-header">
      <div className="flex min-w-0 items-center gap-3">
        {!sidebarOpen && (
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            aria-controls="app-navigation"
            onClick={onMenuClick}
            className="header-menu-button"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:block">
            Visa Services CRM
          </p>
          <h2 className="truncate text-sm font-semibold text-slate-800 sm:mt-0.5">
            {pageTitles[location.pathname] || 'Workspace'}
          </h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="header-icon-button"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="user-avatar">
            {(user?.firstName?.[0] || 'U').toUpperCase()}
          </div>
          <div className="hidden text-left sm:block">
            <p className="max-w-36 truncate text-xs font-semibold leading-tight text-slate-800">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">{user?.roles?.[0] || 'Owner'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="header-icon-button"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
};

