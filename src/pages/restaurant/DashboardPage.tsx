import React, { useState, useEffect } from 'react';
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
  Star,
  Truck,
  Palette,
  CreditCard,
  FileText,
  BarChart2,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { Bar, Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';

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
  deliveryStats: {
    active: number;
    completed: number;
    avgDeliveryTime: number;
  };
  financialStats: {
    monthlyRevenue: number;
    pendingPayments: number;
    revenueByCategory: Array<{
      category: string;
      amount: number;
    }>;
  };
}

const MENU_SECTIONS = [
  { id: 'overview', label: 'Visão Geral', icon: <BarChart2 size={20} /> },
  { id: 'financial', label: 'Financeiro', icon: <CreditCard size={20} /> },
  { id: 'delivery', label: 'Entregadores', icon: <Truck size={20} /> },
  { id: 'customize', label: 'Personalizar Site', icon: <Palette size={20} /> },
  { id: 'reports', label: 'Relatórios', icon: <FileText size={20} /> },
  { id: 'support', label: 'Suporte', icon: <MessageSquare size={20} /> }
];

export const RestaurantDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
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
        toast.error('Erro ao carregar dados do dashboard');
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

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverviewSection();
      case 'financial':
        return renderFinancialSection();
      case 'delivery':
        return renderDeliverySection();
      case 'customize':
        return renderCustomizeSection();
      default:
        return (
          <div className="p-8 text-center">
            <Card>
              <CardContent className="p-12">
                <h2 className="text-2xl font-bold mb-4">Página em Construção</h2>
                <p className="text-gray-600">Esta funcionalidade estará disponível em breve.</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  const renderOverviewSection = () => {
    const orderData = {
      labels: stats?.ordersByDay?.map(day => format(new Date(day.date), 'dd/MM')) || [],
      datasets: [
        {
          label: 'Pedidos por Dia',
          data: stats?.ordersByDay?.map(day => day.count) || [],
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        }
      ]
    };

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ 
            { 
              label: 'Total de Pedidos', 
              value: stats?.totalOrders || 0, 
              icon: <ShoppingBag className="h-6 w-6 text-purple-600" />,
              bgColor: 'bg-purple-100'
            },
            { 
              label: 'Receita Total', 
              value: `R$ ${stats?.totalRevenue?.toFixed(2) || '0.00'}`, 
              icon: <DollarSign className="h-6 w-6 text-green-600" />,
              bgColor: 'bg-green-100'
            },
            { 
              label: 'Itens no Cardápio', 
              value: stats?.activeMenuItems || 0, 
              icon: <Store className="h-6 w-6 text-blue-600" />,
              bgColor: 'bg-blue-100'
            },
            { 
              label: 'Total de Clientes', 
              value: stats?.totalCustomers || 0, 
              icon: <Users className="h-6 w-6 text-orange-600" />,
              bgColor: 'bg-orange-100'
            }
          ].map((stat, index) => (
            <Card key={index} className="transform transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="transform transition-all hover:scale-105">
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                Pedidos por Dia
              </h2>
            </CardHeader>
            <CardContent className="p-4">
              <Bar data={orderData} />
            </CardContent>
          </Card>

          <Card className="transform transition-all hover:scale-105">
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <Clock className="mr-2 h-5 w-5 text-purple-600" />
                Pedidos Recentes
              </h2>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200">
                {(stats?.recentOrders || []).map((order) => (
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
      </div>
    );
  };

  const renderFinancialSection = () => {
    const revenueData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Receita Mensal',
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Receita Mensal</p>
                  <h3 className="text-xl font-bold">R$ 30.000,00</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Pagamentos Pendentes</p>
                  <h3 className="text-xl font-bold">R$ 5.200,00</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Crescimento</p>
                  <h3 className="text-xl font-bold">+15%</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">Receita ao Longo do Tempo</h2>
          </CardHeader>
          <CardContent>
            <Line data={revenueData} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Métodos de Pagamento</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Cartão de Crédito</span>
                  <span className="font-bold">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>PIX</span>
                  <span className="font-bold">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dinheiro</span>
                  <span className="font-bold">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Próximos Pagamentos</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Fornecedor A</p>
                    <p className="text-sm text-gray-500">Vencimento: 25/03/2024</p>
                  </div>
                  <span className="font-bold">R$ 1.500,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Fornecedor B</p>
                    <p className="text-sm text-gray-500">Vencimento: 28/03/2024</p>
                  </div>
                  <span className="font-bold">R$ 2.300,00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderDeliverySection = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Entregas Ativas</p>
                  <h3 className="text-xl font-bold">8</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Tempo Médio</p>
                  <h3 className="text-xl font-bold">25 min</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Entregadores Ativos</p>
                  <h3 className="text-xl font-bold">12</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">Entregas em Andamento</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((delivery) => (
                <div key={delivery} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Pedido #123{delivery}</p>
                    <p className="text-sm text-gray-500">João Silva</p>
                    <p className="text-sm text-gray-500">Rua das Flores, 123</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">25 min</p>
                    <p className="text-sm text-green-600">Em rota</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Entregadores Disponíveis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((deliverer) => (
                  <div key={deliverer} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="ml-3">
                        <p className="font-medium">Carlos Silva</p>
                        <p className="text-sm text-gray-500">4.8 ⭐</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Disponível
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Áreas de Entrega</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Zona Norte</span>
                  <span className="font-bold">5 entregas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Zona Sul</span>
                  <span className="font-bold">3 entregas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Centro</span>
                  <span className="font-bold">7 entregas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderCustomizeSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">Personalização do Site</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Cores do Tema</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cor Principal</label>
                    <div className="mt-1">
                      <input type="color" className="w-full h-10 rounded-md" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cor Secundária</label>
                    <div className="mt-1">
                      <input type="color" className="w-full h-10 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Logo do Restaurante</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                    <Button variant="outline" size="sm">Alterar Logo</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-4">Layout da Página</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20">Layout 1</Button>
                <Button variant="outline" className="h-20">Layout 2</Button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-4">Informações do Restaurante</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Restaurante</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={3}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Horário de Funcionamento</label>
                  <div className="mt-1 grid grid-cols-2 gap-4">
                    <input type="time" className="rounded-md border-gray-300 shadow-sm" />
                    <input type="time" className="rounded-md border-gray-300 shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-4">Redes Sociais</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline">Cancelar</Button>
              <Button variant="primary">Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">Prévia do Site</h2>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Prévia do site será exibida aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {restaurant?.name || 'Meu Restaurante'}
                </h1>
                <p className="text-sm text-gray-500">
                  Bem-vindo ao seu painel de controle
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                leftIcon={<LogOut size={18} />}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {MENU_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  className={`
                    flex items-center px-1 py-4 border-b-2 text-sm font-medium
                    ${activeSection === section.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Section Content */}
        {renderContent()}
      </div>
    </div>
  );
};