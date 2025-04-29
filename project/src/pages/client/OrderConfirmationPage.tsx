import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Home, MessageCircle } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, whatsappUrl } = location.state || {};

  if (!orderId) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Your order #{orderId.substring(0, 8)} has been received.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<MessageCircle size={18} />}
              onClick={() => {
                if (whatsappUrl) {
                  window.open(whatsappUrl, '_blank');
                }
              }}
            >
              Open WhatsApp Chat
            </Button>

            <Button
              variant="outline"
              fullWidth
              leftIcon={<Home size={18} />}
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            We'll start preparing your order right away. You can track your order status through WhatsApp.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};