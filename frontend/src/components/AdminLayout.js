import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  House,
  Users,
  FileText,
  Certificate,
  Scroll,
  ClipboardText,
  Gear,
  SignOut,
  Seal
} from '@phosphor-icons/react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: House },
  { path: '/admin/recipients', label: 'Recipients', icon: Users },
  { path: '/admin/templates', label: 'Templates', icon: FileText },
  { path: '/admin/issue', label: 'Issue Credential', icon: Certificate },
  { path: '/admin/credentials', label: 'Issued Credentials', icon: Scroll },
  { path: '/admin/logs', label: 'Verification Logs', icon: ClipboardText },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#F8F9FA] border-r border-[#E2E8F0] h-screen fixed left-0 top-0 flex flex-col" data-testid="admin-sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <Link to="/" className="flex items-center gap-3" data-testid="sidebar-logo">
          <div className="w-10 h-10 bg-[#5B21B6] rounded-sm flex items-center justify-center">
            <Seal className="w-6 h-6 text-white" weight="fill" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-[#2A1B38] text-lg leading-tight">Badge & Cert</h1>
            <p className="text-xs text-[#52525B]">Management System</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#5B21B6] text-white'
                  : 'text-[#52525B] hover:bg-[#F1F5F9] hover:text-[#2A1B38]'
              }`}
            >
              <Icon className="w-5 h-5" weight={isActive ? 'fill' : 'regular'} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-1">
        <Link
          to="/admin/settings"
          data-testid="nav-settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 ${
            location.pathname === '/admin/settings'
              ? 'bg-[#5B21B6] text-white'
              : 'text-[#52525B] hover:bg-[#F1F5F9] hover:text-[#2A1B38]'
          }`}
        >
          <Gear className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[#E11D48] hover:bg-[#FFE4E6] transition-all duration-200"
        >
          <SignOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="ml-64 p-8" data-testid="admin-main-content">
        {children}
      </main>
    </div>
  );
}
