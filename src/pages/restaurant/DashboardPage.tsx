import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Store, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeMenuItems: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
  ordersByDay: Array<{
    date: string;
    count: number;
  }>;
}

export const RestaurantDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [restaurantResponse, statsResponse] = await Promise.all([
          api.get('/restaurants/me'),
          api.get('/restaurants/stats')
        ]);
        
        setRestaurant(restaurantResponse.data);
        setStats(statsResponse.data);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurant_token');
    navigate('/login');
  };

  const chartData = {
    labels: stats?.ordersByDay.map(day => format(new Date(day.date), 'dd/MM')) || [],
    datasets: [
      {
        label: 'Pedidos por Dia',
        data: stats?.ordersByDay.map(day => day.count) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-300 via-indigo-400 to-pink-300 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-200 rounded-lg shadow-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-300 via-indigo-400 to-pink-300 flex items-center justify-center p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-indigo-400 to-pink-300">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-b-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-300 to-yellow-200 rounded-full flex items-center justify-center shadow-lg">
                <Store className="h-8 w-8 text-white transition-transform transform hover:scale-110" />
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {restaurant?.name || 'Painel do Restaurante'}
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              <Button
                variant="outline"
                leftIcon={<Settings size={18} />}
                onClick={() => navigate('/restaurant/settings')}
                className="transition-transform transform hover:scale-105"
              >
                Configurações
              </Button>
              
              <Button
                variant="outline"
                leftIcon={<LogOut size={18} />}
                onClick={handleLogout}
                className="transition-transform transform hover:scale-105"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[ 
            { label: 'Total de Pedidos', value: stats?.totalOrders, icon: <ShoppingBag className="h-6 w-6 text-red-600" /> },
            { label: 'Receita Total', value: `R$ ${stats?.totalRevenue.toFixed(2)}`, icon: <DollarSign className="h-6 w-6 text-green-600" /> },
            { label: 'Itens no Cardápio', value: stats?.activeMenuItems, icon: <Store className="h-6 w-6 text-purple-600" /> },
            { label: 'Total de Clientes', value: stats?.totalCustomers, icon: <Users className="h-6 w-6 text-yellow-600" /> }
          ].map((stat, index) => (
            <Card key={index} className="transition-all transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gradient-to-br from-pink-100 to-yellow-200">
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart */}
          <Card className="transition-all transform hover:scale-105">
            <CardHeader>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-red-600 mr-2" />
                <h2 className="text-lg font-bold">Pedidos por Dia</h2>
              </div>
            </CardHeader>
            <CardContent>
              <Bar data={chartData} />
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="transition-all transform hover:scale-105">
            <CardHeader>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-600 mr-2" />
                <h2 className="text-lg font-bold">Pedidos Recentes</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200">
                {stats?.recentOrders.map((order) => (
                  <div key={order.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.date), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {order.total.toFixed(2)}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? 'Concluído' : 'Em Preparo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="transition-all transform hover:scale-105">
          <CardHeader>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-red-600 mr-2" />
              <h2 className="text-lg font-bold">Ações Rápidas</h2>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <Button variant="secondary" onClick={() => navigate('/restaurant/orders')}>
                Ver Pedidos
              </Button>
              <Button variant="secondary" onClick={() => navigate('/restaurant/menu')}>
                Gerenciar Cardápio
              </Button>
              <Button variant="secondary" onClick={() => navigate('/restaurant/reports')}>
                Relatórios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
