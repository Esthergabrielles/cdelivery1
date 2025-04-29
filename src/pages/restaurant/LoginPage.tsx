import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';  // Adicionando o useLocation
import { Card, CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, AlertCircle, CheckCircle, Store } from 'lucide-react';
import { api } from '../../services/api';

export const RestaurantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Agora está corretamente importado
  const successMessage = location.state?.message;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, insira seu e-mail e senha');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/restaurants/login', { email, password });
      localStorage.setItem('restaurant_token', response.data.token);
      navigate('/restaurant/dashboard');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          {/* Logo Subindo */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Store className="w-8 h-8 text-red-600" />
          </div>

          {/* Card de Login */}
          <Card className="w-full max-w-md">
            <CardHeader className="text-center border-b pb-6">
              <h1 className="text-2xl font-bold text-gray-900">Área do Restaurante</h1>
              <p className="text-gray-600 mt-1">Acesse seu painel de controle</p>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Mensagens de Sucesso e Erro */}
              {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3 flex items-start">
                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-green-600 text-sm">{successMessage}</span>
                </div>
              )}
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                  <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              )}
              
              {/* Formulário de Login */}
              <form onSubmit={handleLogin}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="restaurant@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={18} className="text-gray-400" />}
                  fullWidth
                />
                
                <Input
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock size={18} className="text-gray-400" />}
                  fullWidth
                />
                
                {/* Lembrar-me e Esqueceu a Senha */}
                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600" />
                    <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                  </label>
                  
                  <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-800">
                    Esqueceu a senha?
                  </Link>
                </div>
                
                {/* Botão de Login */}
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
            
            {/* Link para Cadastro */}
            <CardFooter className="text-center border-t pt-4">
              <p className="text-sm text-gray-600">
                Ainda não tem uma conta?{' '}
                <Link to="/register" className="text-red-600 hover:text-red-800">
                  Cadastre seu restaurante
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
