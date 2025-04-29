import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { PLANS } from '../../services/api';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planType: string, trialDays?: number) => void;
}

export const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [trialDays, setTrialDays] = useState(30);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-b">
          <h2 className="text-xl font-bold">Selecionar Plano</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período Trial
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={trialDays}
                onChange={(e) => setTrialDays(parseInt(e.target.value))}
                className="w-24 rounded-md border-gray-300"
                min="0"
                max="90"
              />
              <span className="text-sm text-gray-500">dias</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(PLANS).map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors
                  ${selectedPlan === plan.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-200'}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <h3 className="font-bold mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold mb-2">
                  {plan.price === 0 ? 'Grátis' : `R$ ${plan.price}`}
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => onConfirm(selectedPlan, trialDays)}
              disabled={!selectedPlan}
            >
              Confirmar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};