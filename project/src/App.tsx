import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { CartProvider } from './context/CartContext';

// Client Pages
import { HomePage } from './pages/client/HomePage';
import { MenuPage } from './pages/client/MenuPage';
import { CheckoutPage } from './pages/client/CheckoutPage';
import { OrderConfirmationPage } from './pages/client/OrderConfirmationPage';

// Restaurant Pages
import { RegisterPage } from './pages/restaurant/RegisterPage';
import { RestaurantLoginPage } from './pages/restaurant/LoginPage';
import { RestaurantDashboardPage } from './pages/restaurant/DashboardPage';
import { SettingsPage } from './pages/restaurant/SettingsPage';

// Admin Pages
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';

// Under Construction Page
import { UnderConstruction } from './pages/UnderConstruction';

// Admin Components
import { Sidebar } from './components/admin/Sidebar';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

// Restaurant Protected Route Component
const RestaurantProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('restaurant_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Layout Component
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
      />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <RestaurantProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/menu/:categoryId" element={<MenuPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              
              {/* Restaurant Routes */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<RestaurantLoginPage />} />
              <Route 
                path="/restaurant/dashboard" 
                element={
                  <RestaurantProtectedRoute>
                    <RestaurantDashboardPage />
                  </RestaurantProtectedRoute>
                } 
              />
              <Route 
                path="/restaurant/settings" 
                element={
                  <RestaurantProtectedRoute>
                    <SettingsPage />
                  </RestaurantProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <DashboardPage />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Protected Routes */}
              <Route
                path="/admin/restaurants"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UnderConstruction />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UnderConstruction />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/billing"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UnderConstruction />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UnderConstruction />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UnderConstruction />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/support"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UnderConstruction />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/security"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UnderConstruction />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <UnderConstruction />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Under Construction Routes */}
              <Route path="/about" element={<UnderConstruction />} />
              <Route path="/careers" element={<UnderConstruction />} />
              <Route path="/press" element={<UnderConstruction />} />
              <Route path="/features" element={<UnderConstruction />} />
              <Route path="/pricing" element={<UnderConstruction />} />
              <Route path="/integrations" element={<UnderConstruction />} />
              <Route path="/help" element={<UnderConstruction />} />
              <Route path="/contact" element={<UnderConstruction />} />
              <Route path="/status" element={<UnderConstruction />} />
              <Route path="/privacy" element={<UnderConstruction />} />
              <Route path="/terms" element={<UnderConstruction />} />
              <Route path="/security" element={<UnderConstruction />} />
              
              {/* Redirect all other paths to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </RestaurantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;