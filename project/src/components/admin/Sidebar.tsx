import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart2,
  Bell,
  HelpCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileOpen, 
  toggleMobileSidebar 
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Restaurantes',
      path: '/admin/restaurants',
      icon: <Building2 size={20} />,
    },
    {
      name: 'Usuários',
      path: '/admin/users',
      icon: <Users size={20} />,
    },
    {
      name: 'Faturamento',
      path: '/admin/billing',
      icon: <CreditCard size={20} />,
    },
    {
      name: 'Relatórios',
      path: '/admin/reports',
      icon: <BarChart2 size={20} />,
    },
    {
      name: 'Notificações',
      path: '/admin/notifications',
      icon: <Bell size={20} />,
    },
    {
      name: 'Suporte',
      path: '/admin/support',
      icon: <HelpCircle size={20} />,
    },
    {
      name: 'Segurança',
      path: '/admin/security',
      icon: <Shield size={20} />,
    },
    {
      name: 'Configurações',
      path: '/admin/settings',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform 
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">
                Admin Master
              </span>
            </div>
            
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={toggleMobileSidebar}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-4 py-2 rounded-md transition-colors
                      ${isActive(item.path) 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                    `}
                    onClick={() => {
                      if (isMobileOpen) toggleMobileSidebar();
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info */}
          <div className="border-t border-gray-800 px-4 py-3">
            <div className="flex items-center">
              <div className="mr-3">
                <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-300 font-medium">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || 'admin@system.com'}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle button */}
      <button
        className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-900 text-white shadow-lg z-20 lg:hidden"
        onClick={toggleMobileSidebar}
      >
        <Menu size={24} />
      </button>
    </>
  );
};