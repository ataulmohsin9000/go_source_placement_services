import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck2,
  DollarSign,
  Bot,
  Plane,
  ChevronRight,
  PanelLeftClose,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/leads', label: 'Leads & enquiries', icon: Users },
    { to: '/cases', label: 'Visa cases', icon: Briefcase },
    { to: '/clients', label: 'Clients & applicants', icon: FileCheck2 },
    { to: '/invoices', label: 'Invoices & finance', icon: DollarSign },
    { to: '/ai-assistant', label: 'AI assistant', icon: Bot },
  ];

  return (
    <aside
      id="app-navigation"
      className={`app-sidebar ${isOpen ? 'app-sidebar-open' : ''}`}
      aria-hidden={!isOpen}
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand-content">
          <div className="brand-mark">
            <Plane className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold tracking-tight leading-tight">Go Source</h1>
            <p className="mt-1 text-[11px]">VISA OPERATIONS</p>
          </div>
        </div>
        <button
          type="button"
          className="sidebar-close-button"
          aria-label="Close navigation"
          aria-expanded={isOpen}
          aria-controls="app-navigation"
          onClick={onClose}
          tabIndex={isOpen ? undefined : -1}
        >
          <PanelLeftClose className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <p className="sidebar-section-label">WORKSPACE</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            tabIndex={isOpen ? undefined : -1}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                <span>{item.label}</span>
                {isActive && <span className="sidebar-link-indicator" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-workspace-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Team workspace</span>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
          <p className="mt-1 truncate text-[11px]">Go Source Placement Services</p>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Development environment
          </div>
        </div>
      </div>
    </aside>
  );
};

