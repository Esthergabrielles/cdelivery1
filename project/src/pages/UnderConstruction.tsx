import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const UnderConstruction: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Página em Desenvolvimento
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Esta seção está sendo desenvolvida e estará disponível em breve. 
              Estamos trabalhando para trazer as melhores funcionalidades para você.
            </p>
            <Link to="/admin/dashboard">
              <Button
                variant="outline"
                leftIcon={<ArrowLeft size={18} />}
              >
                Voltar para Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};