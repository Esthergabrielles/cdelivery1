import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, AlertCircle, Store } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Canhoto Delivery</h1>
          <p className="mt-2 text-gray-600">Sistema de Gestão de Restaurantes</p>
        </div>

        <Card>
          <CardHeader className="text-center border-b pb-6">
            <h2 className="text-xl font-bold">Área Administrativa</h2>
            <p className="text-gray-600 mt-1">Acesse o painel de controle</p>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleLogin}>
              {authError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                  <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-red-600 text-sm">{authError}</span>
                </div>
              )}
              
              <Input
                label="Email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<Mail size={18} className="text-gray-400" />}
                fullWidth
              />
              
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock size={18} className="text-gray-400" />}
                fullWidth
              />
              
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-red-600" />
                  <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                </label>
                
                <a href="#" className="text-sm text-red-600 hover:text-red-800">
                  Esqueceu a senha?
                </a>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Precisa de ajuda? <a href="#" className="text-red-600 hover:text-red-800">Entre em contato</a></p>
        </div>
      </div>
    </div>
  );
};