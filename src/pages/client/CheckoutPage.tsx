import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { ordersApi } from '../../services/api';
import { CartSummary } from '../../components/client/CartSummary';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { ChevronLeft, AlertCircle } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { restaurant } = useRestaurant();
  const { items, totalAmount, clearCart } = useCart();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleGoBack = () => {
    navigate(-1);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!customerName.trim()) {
      errors.customerName = 'Name is required';
    }
    
    if (!customerPhone.trim()) {
      errors.customerPhone = 'Phone number is required';
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(customerPhone)) {
      errors.customerPhone = 'Enter a valid phone number: (00) 00000-0000';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatOrderMessage = () => {
    const restaurantName = restaurant?.name || 'Restaurant';
    const formattedDate = new Date().toLocaleString('pt-BR');
    
    let message = `🛍️ *New Order - ${restaurantName}*\n`;
    message += `📅 ${formattedDate}\n\n`;
    message += `👤 *Customer Information*\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${customerPhone}\n\n`;
    
    message += `📝 *Order Details*\n`;
    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.menuItemName}*\n`;
      message += `   Quantity: ${item.quantity}x\n`;
      message += `   Price: ${formatCurrency(item.unitPrice)}\n`;
      
      if (item.selectedOptions?.length > 0) {
        message += `   Options:\n`;
        item.selectedOptions.forEach(option => {
          message += `   - ${option.name}: ${option.option}`;
          if (option.price > 0) {
            message += ` (+${formatCurrency(option.price)})`;
          }
          message += '\n';
        });
      }
      
      if (item.notes) {
        message += `   Notes: ${item.notes}\n`;
      }
    });
    
    message += `\n💰 *Total: ${formatCurrency(totalAmount)}*\n\n`;
    
    if (notes) {
      message += `📌 *Additional Notes*\n${notes}\n\n`;
    }
    
    if (couponCode) {
      message += `🏷️ *Coupon Applied*\n${couponCode}\n\n`;
    }
    
    message += `Thank you for your order! We'll prepare it right away.`;
    
    return encodeURIComponent(message);
  };

  const handleCheckout = async () => {
    if (!restaurant) return;
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create order in the system
      const orderData = {
        restaurantId: restaurant.id,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          menuItemName: item.menuItemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          selectedOptions: item.selectedOptions,
          notes: item.notes,
        })),
        totalAmount,
        customerName,
        customerPhone: customerPhone.replace(/\D/g, ''),
        notes,
        couponCode: couponCode.trim() || undefined,
      };
      
      const response = await ordersApi.create(restaurant.id, orderData);
      
      // Generate WhatsApp message
      const message = formatOrderMessage();
      const whatsappNumber = restaurant.whatsappNumber.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${message}`;
      
      // Clear cart
      clearCart();
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Navigate to confirmation
      navigate('/order-confirmation', { 
        state: { 
          orderId: response.data.id,
          whatsappUrl,
        }
      });
      
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 0) {
      if (cleaned.length <= 2) {
        formatted = `(${cleaned}`;
      } else if (cleaned.length <= 7) {
        formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      } else {
        formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setCustomerPhone(formatted);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            leftIcon={<ChevronLeft size={16} />}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {/* Customer Information */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-bold">Your Information</h2>
              </CardHeader>
              <CardContent>
                <Input
                  label="Name"
                  placeholder="Your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={validationErrors.customerName}
                  fullWidth
                />
                
                <Input
                  label="Phone Number"
                  placeholder="(00) 00000-0000"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  error={validationErrors.customerPhone}
                  fullWidth
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (optional)
                  </label>
                  <textarea
                    placeholder="Special instructions, delivery notes, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Coupon Code */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                    fullWidth
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Apply coupon logic
                      alert('Coupon functionality will be implemented soon.');
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCheckout}
              isLoading={isSubmitting}
              style={{
                backgroundColor: restaurant?.theme?.primaryColor || '#3B82F6',
              }}
            >
              Complete Order via WhatsApp
            </Button>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
          </div>

          <div>
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};