import axios from 'axios';

// Plans configuration
export const PLANS = {
  TRIAL: {
    id: 'trial',
    name: 'Trial',
    duration: 30, // days
    price: 0,
    features: ['Cardápio Digital', 'Pedidos via WhatsApp', 'Suporte Básico']
  },
  BASIC: {
    id: 'basic',
    name: 'Básico',
    price: 49.90,
    features: ['Cardápio Digital', 'Pedidos via WhatsApp', 'Suporte Básico', 'Relatórios Básicos']
  },
  PRO: {
    id: 'pro',
    name: 'Profissional',
    price: 99.90,
    features: ['Tudo do Plano Básico', 'Personalização Avançada', 'Relatórios Detalhados', 'Suporte Prioritário']
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199.90,
    features: ['Tudo do Plano Profissional', 'API Personalizada', 'Gerente de Conta Dedicado', 'SLA Garantido']
  }
};

// Mock admin credentials
const mockAdmins = [
  {
    id: '1',
    email: 'admin@canhoto.com',
    password: 'admin123', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'admin'
  }
];

// Mock data for development
const mockRestaurants = [
  {
    id: '1',
    name: 'Pizzaria Bella',
    cnpj: '12.345.678/0001-90',
    email: 'contato@pizzariabella.com',
    password: 'password123', // In a real app, this would be hashed
    phone: '(11) 99999-9999',
    address: 'Rua das Pizzas, 123',
    registrationDate: '2024-01-15',
    status: 'active',
    plan: PLANS.PRO.id,
    planStartDate: '2024-01-15',
    planEndDate: '2025-01-15',
    totalOrders: 1250,
    revenue: 45000,
    region: 'South'
  },
  // Add more mock restaurants...
];

// Mock registration requests
const mockRegistrationRequests = [
  {
    id: '1',
    restaurantName: 'Sushi Express',
    ownerName: 'Maria Santos',
    email: 'maria@sushiexpress.com',
    phone: '(11) 98888-8888',
    cnpj: '98.765.432/0001-10',
    address: 'Av. dos Sushis, 456',
    requestDate: '2024-03-15T10:30:00',
    status: 'pending'
  },
  // Add more mock requests...
];

// Mock system stats
const mockSystemStats = {
  activeRestaurants: 156,
  monthlyRevenue: 45678,
  pendingRequests: 12,
  newRestaurantsThisMonth: 24,
  orderStats: {
    total: 15678,
    lastMonth: 2345,
    growth: 12.5
  },
  revenueStats: {
    total: 789012.34,
    lastMonth: 98765.43,
    growth: 15.8
  }
};

// Base API configuration
const api = {
  async get(url: string) {
    // Check authentication status
    if (url === '/auth/me') {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return Promise.reject({ message: 'No token found' });
      }
      
      // In a real app, we would decode the token and verify it
      const [userId, timestamp] = atob(token).split(':');
      const admin = mockAdmins.find(a => a.id === userId);
      
      if (admin) {
        const { password, ...adminData } = admin;
        return Promise.resolve({ data: adminData });
      }
      
      return Promise.reject({ message: 'Invalid token' });
    }

    // System stats
    if (url === '/admin/stats') {
      return Promise.resolve({ data: mockSystemStats });
    }

    // Registration requests
    if (url === '/admin/registration-requests') {
      return Promise.resolve({ data: mockRegistrationRequests });
    }

    // Restaurants list
    if (url === '/admin/restaurants') {
      return Promise.resolve({ data: mockRestaurants });
    }

    // Restaurant stats
    if (url === '/restaurants/stats') {
      // Use the first restaurant's data for mock stats
      const restaurant = mockRestaurants[0];
      return Promise.resolve({
        data: {
          totalOrders: restaurant.totalOrders,
          totalRevenue: restaurant.revenue,
          activeMenuItems: 45, // Mock value
          totalCustomers: 850 // Mock value
        }
      });
    }

    // Restaurant stats by ID
    if (url.startsWith('/restaurants/') && url.endsWith('/stats')) {
      const restaurantId = url.split('/')[2];
      const restaurant = mockRestaurants.find(r => r.id === restaurantId);
      
      if (restaurant) {
        return Promise.resolve({
          data: {
            totalOrders: restaurant.totalOrders,
            totalRevenue: restaurant.revenue,
            activeMenuItems: 45, // Mock value
            totalCustomers: 850, // Mock value
            recentOrders: [
              {
                id: '1',
                customerName: 'João Silva',
                total: 89.90,
                status: 'completed',
                date: new Date().toISOString()
              },
              {
                id: '2',
                customerName: 'Maria Oliveira',
                total: 125.50,
                status: 'preparing',
                date: new Date().toISOString()
              }
            ],
            ordersByDay: [
              { date: '2024-03-01', count: 25 },
              { date: '2024-03-02', count: 30 },
              { date: '2024-03-03', count: 28 }
            ]
          }
        });
      }
    }

    // Get restaurant profile
    if (url === '/restaurants/me') {
      // In a real app, we would use the token to identify the restaurant
      // For mock purposes, we'll return the first restaurant
      const restaurant = mockRestaurants[0];
      return Promise.resolve({
        data: {
          id: restaurant.id,
          name: restaurant.name,
          email: restaurant.email,
          plan: restaurant.plan,
          planEndDate: restaurant.planEndDate
        }
      });
    }

    // Mock category data
    if (url.includes('/categories/')) {
      return Promise.resolve({
        data: {
          id: url.split('/').pop(),
          name: 'Sample Category',
          description: 'A sample category description'
        }
      });
    }

    // Mock menu items data
    if (url.includes('/menu-items')) {
      return Promise.resolve({
        data: [
          {
            id: '1',
            name: 'Sample Item',
            description: 'A sample menu item',
            price: 19.90,
            imageUrl: 'https://example.com/image.jpg'
          }
        ]
      });
    }

    return Promise.reject({ message: 'Endpoint not implemented' });
  },

  async post(url: string, data: any) {
    // Handle admin login
    if (url === '/auth/login') {
      const { email, password } = data;
      const admin = mockAdmins.find(a => a.email === email && a.password === password);
      
      if (admin) {
        // Generate a mock token
        const token = btoa(`${admin.id}:${Date.now()}`);
        const { password: _, ...adminData } = admin;
        return Promise.resolve({
          data: {
            token,
            user: adminData
          }
        });
      } else {
        return Promise.reject({
          response: {
            data: {
              message: 'Invalid email or password'
            }
          }
        });
      }
    }

    // Handle restaurant login
    if (url === '/restaurants/login') {
      const { email, password } = data;
      const restaurant = mockRestaurants.find(r => r.email === email && r.password === password);
      
      if (restaurant) {
        // Generate a mock token
        const token = btoa(`${restaurant.id}:${Date.now()}`);
        return Promise.resolve({
          data: {
            token,
            restaurant: {
              id: restaurant.id,
              name: restaurant.name,
              email: restaurant.email
            }
          }
        });
      } else {
        return Promise.reject({
          message: 'Invalid email or password'
        });
      }
    }

    // Handle registration approval
    if (url.startsWith('/admin/registration-requests/') && url.endsWith('/approve')) {
      const requestId = url.split('/')[3];
      const request = mockRegistrationRequests.find(r => r.id === requestId);
      
      if (request) {
        const { planType, trialDays } = data;
        
        // Create new restaurant
        const newRestaurant = {
          id: String(mockRestaurants.length + 1),
          name: request.restaurantName,
          cnpj: request.cnpj,
          email: request.email,
          phone: request.phone,
          address: request.address,
          registrationDate: new Date().toISOString(),
          status: 'active',
          plan: planType,
          planStartDate: new Date().toISOString(),
          planEndDate: new Date(Date.now() + (trialDays || 0) * 24 * 60 * 60 * 1000).toISOString(),
          totalOrders: 0,
          revenue: 0
        };

        mockRestaurants.push(newRestaurant);
        
        // Remove from pending requests
        const index = mockRegistrationRequests.findIndex(r => r.id === requestId);
        if (index > -1) {
          mockRegistrationRequests.splice(index, 1);
        }

        return Promise.resolve({ data: newRestaurant });
      }
    }

    // Handle registration rejection
    if (url.startsWith('/admin/registration-requests/') && url.endsWith('/reject')) {
      const requestId = url.split('/')[3];
      const index = mockRegistrationRequests.findIndex(r => r.id === requestId);
      
      if (index > -1) {
        mockRegistrationRequests.splice(index, 1);
        return Promise.resolve({ data: { success: true } });
      }
    }

    // Handle order creation
    if (url.includes('/orders')) {
      return Promise.resolve({
        data: {
          id: Math.random().toString(36).substr(2, 9),
          ...data,
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
      });
    }

    return Promise.reject({ message: 'Endpoint not implemented' });
  },

  async patch(url: string, data: any) {
    // Update restaurant plan
    if (url.startsWith('/admin/restaurants/') && url.includes('/plan')) {
      const restaurantId = url.split('/')[3];
      const restaurant = mockRestaurants.find(r => r.id === restaurantId);
      
      if (restaurant) {
        Object.assign(restaurant, {
          plan: data.planType,
          planStartDate: new Date().toISOString(),
          planEndDate: new Date(Date.now() + data.duration * 24 * 60 * 60 * 1000).toISOString()
        });
        
        return Promise.resolve({ data: restaurant });
      }
    }

    return Promise.reject({ message: 'Endpoint not implemented' });
  }
};

// API endpoints
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getRegistrationRequests: () => api.get('/admin/registration-requests'),
  getRestaurants: () => api.get('/admin/restaurants'),
  approveRegistration: (requestId: string, data: { planType: string; trialDays?: number }) => 
    api.post(`/admin/registration-requests/${requestId}/approve`, data),
  rejectRegistration: (requestId: string) => 
    api.post(`/admin/registration-requests/${requestId}/reject`, {}),
  updateRestaurantPlan: (restaurantId: string, data: { planType: string; duration: number }) =>
    api.patch(`/admin/restaurants/${restaurantId}/plan`, data)
};

// Restaurant API endpoints
export const restaurantApi = {
  getProfile: () => api.get('/restaurants/me'),
  getStats: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/stats`)
};

// Client API endpoints
export const categoriesApi = {
  getById: (restaurantId: string, categoryId: string) => 
    api.get(`/restaurants/${restaurantId}/categories/${categoryId}`)
};

export const menuItemsApi = {
  getAll: (restaurantId: string, categoryId: string) => 
    api.get(`/restaurants/${restaurantId}/categories/${categoryId}/menu-items`)
};

export const ordersApi = {
  create: (restaurantId: string, data: any) => 
    api.post(`/restaurants/${restaurantId}/orders`, data)
};

export { api };