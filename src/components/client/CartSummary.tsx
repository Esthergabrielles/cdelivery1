import React from 'react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { ShoppingCart, Trash2 } from 'lucide-react';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCart();
  const { restaurant } = useRestaurant();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Start adding items to your cart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Your Order</h2>
          <Button
            variant="text"
            size="sm"
            onClick={clearCart}
            leftIcon={<Trash2 size={16} />}
          >
            Clear
          </Button>
        </div>
      </CardHeader>

      <CardContent className="divide-y divide-gray-200">
        {items.map(item => (
          <div key={item.menuItemId} className="py-3 flex justify-between">
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="flex items-start">
                  <span className="inline-block bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                    {item.quantity}
                  </span>
                  <div>
                    <h4 className="font-medium">{item.menuItemName}</h4>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <ul className="text-xs text-gray-500 mt-1">
                        {item.selectedOptions.map((option, index) => (
                          <li key={index}>
                            {option.name}: {option.option} 
                            {option.price > 0 && ` (+${formatCurrency(option.price)})`}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.notes && (
                      <p className="text-xs italic text-gray-500 mt-1">Note: {item.notes}</p>
                    )}
                  </div>
                </div>
                <span className="font-medium">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
              <div className="flex mt-2 space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                >
                  -
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => removeItem(item.menuItemId)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t border-gray-200">
        <div className="w-full">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={onCheckout}
            className="mt-4"
            style={{
              backgroundColor: restaurant?.theme?.primaryColor || '#3B82F6',
            }}
          >
            Checkout with WhatsApp
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};