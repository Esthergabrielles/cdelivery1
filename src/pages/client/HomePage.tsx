import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Smartphone,
  ShieldCheck,
  Rocket,
  Settings,
  ChefHat,
  MessageCircle,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  ArrowUp,
  PhoneCall,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export const HomePage: React.FC = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [email, setEmail] = useState('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = () => {
    if (email.trim() !== '') {
      setSubscriptionSuccess(true);
      setTimeout(() => setSubscriptionSuccess(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-red-100">
      {/* Header */}
      <header className="bg-white backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Store className="text-red-600 w-8 h-8" />
            <span className="text-2xl font-bold text-gray-800">
              Canhoto<span className="text-red-500">Delivery</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-6 text-gray-700">
            <Link to="#features" className="hover:text-red-600 transition">
              Funcionalidades
            </Link>
            <Link to="#benefits" className="hover:text-red-600 transition">
              Benefícios
            </Link>
            <Link to="#howitworks" className="hover:text-red-600 transition">
              Como Funciona
            </Link>
            <Link to="#integrations" className="hover:text-red-600 transition">
              Integrações
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" leftIcon={<ChefHat size={18} />}>
                Área do Restaurante
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-100 via-white to-red-50 opacity-50 blur-2xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
            Transforme seu restaurante<br /> com nosso sistema digital
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8">
            Gestão eficiente, cardápio online, pedidos no WhatsApp e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                className="bg-red-600 hover:bg-red-700"
                leftIcon={<Store size={22} />}
              >
                Cadastre seu Restaurante
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<ChefHat size={22} />}
              >
                Área do Restaurante
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Offer Section */}
      <section className="py-20 bg-gradient-to-tr from-white to-red-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Seu Restaurante no Digital em Minutos
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Automatize pedidos, aumente suas vendas e conquiste clientes sem complicação. Sem mensalidade até o primeiro pedido!
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg" className="bg-red-600 hover:bg-red-700">
              Comece Agora — É Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <Rocket className="text-red-500 w-10 h-10" />
              <h4 className="font-semibold text-gray-800">Rápido para Começar</h4>
              <p className="text-gray-600 text-sm">Em menos de 5 minutos seu restaurante estará online.</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <ShieldCheck className="text-red-500 w-10 h-10" />
              <h4 className="font-semibold text-gray-800">Seguro e Confiável</h4>
              <p className="text-gray-600 text-sm">Proteção total dos dados e dos pedidos.</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <Smartphone className="text-red-500 w-10 h-10" />
              <h4 className="font-semibold text-gray-800">Pedidos no WhatsApp</h4>
              <p className="text-gray-600 text-sm">Agilidade na comunicação com seus clientes.</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <ChefHat className="text-red-500 w-10 h-10" />
              <h4 className="font-semibold text-gray-800">Fácil de Gerenciar</h4>
              <p className="text-gray-600 text-sm">Atualize pratos e preços rapidamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mantém Features, Benefits, How it Works, Integrations iguais */}

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            O que Nossos Clientes Dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                “Em poucos dias já aumentei meus pedidos em 30%! Muito prático e fácil.”
              </p>
              <h4 className="font-semibold mt-4 text-red-600">— João Silva, Restaurante da Praça</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                “Agora recebo pedidos direto no WhatsApp, sem erro! Simplesmente perfeito.”
              </p>
              <h4 className="font-semibold mt-4 text-red-600">— Ana Paula, Lanches da Ana</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic">
                “O suporte é excelente, me ajudaram a configurar tudo muito rápido.”
              </p>
              <h4 className="font-semibold mt-4 text-red-600">— Carlos Eduardo, Pizzaria do Carlinhos</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Garantia de Satisfação
          </h2>
          <p className="text-gray-600 mb-10">
            Se você não estiver satisfeito nos primeiros 30 dias, pode cancelar sem custo. Sem pegadinhas, sem burocracia.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg" className="bg-red-600 hover:bg-red-700">
              Comece Gratuitamente
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      {/* Mantém seu newsletter igual */}

      {/* Footer */}
      {/* Mantém seu footer igual */}

      {/* Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
