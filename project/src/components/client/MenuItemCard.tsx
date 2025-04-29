import React from 'react';
import { MenuItem } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { PlusIcon, MinusIcon } from 'lucide-react';

interface MenuItemCardProps {
  menuItem: MenuItem;
  onClick?: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem, onClick }) => {
  const { addItem, removeItem, items } = useCart();
  
  // Check if item is already in cart
  const cartItem = items.find(item => item.menuItemId === menuItem.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(menuItem, 1);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(menuItem.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <Card 
      className="transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {menuItem.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img
            src={menuItem.imageUrl}
            alt={menuItem.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      
      <CardContent>
        <h3 className="font-bold text-lg mb-1">{menuItem.name}</h3>
        
        {menuItem.description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {menuItem.description}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold text-lg">
            {formatCurrency(menuItem.price)}
          </span>
          
          {quantity > 0 ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFromCart}
                leftIcon={<MinusIcon size={16} />}
                aria-label="Remove from cart"
              />
              <span className="font-medium mx-2">{quantity}</span>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                leftIcon={<PlusIcon size={16} />}
                aria-label="Add to cart"
              />
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              leftIcon={<PlusIcon size={16} />}
            >
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};