import React, { useState } from 'react';
import { Bell, Search, Settings, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';

interface Notification {
  id: string;
  type: 'registration' | 'plan_expiring' | 'payment';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'registration',
    title: 'Nova Solicitação de Cadastro',
    message: 'Pizzaria Bella solicitou cadastro na plataforma',
    time: '5 minutos atrás',
    read: false
  },
  {
    id: '2',
    type: 'plan_expiring',
    title: 'Plano Expirando',
    message: 'O plano do Sushi Express vence em 3 dias',
    time: '1 hora atrás',
    read: false
  }
];

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
              alt="Logo"
              className="h-8 w-8 rounded-full"
            />
            <span className="ml-2 text-lg font-semibold text-gray-900">
              Master Admin
            </span>
          </div>

          <div className="flex-1 px-4 lg:px-6">
            <div className="max-w-lg w-full lg:max-w-xs ml-auto">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  placeholder="Buscar restaurantes..."
                  type="search"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="sr-only">Notificações</span>
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 z-50">
                  <Card>
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Notificações</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Nenhuma notificação
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between">
                              <p className="font-medium text-sm">
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </div>

            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">Settings</span>
              <Settings className="h-6 w-6" />
            </button>

            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full bg-gray-200"
                src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0D8ABC&color=fff`}
                alt={user?.name}
              />
              <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:block">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};