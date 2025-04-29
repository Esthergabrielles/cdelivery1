import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { categoriesApi, menuItemsApi } from '../../services/api';
import { Category, MenuItem } from '../../types';
import { MenuItemCard } from '../../components/client/MenuItemCard';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MenuPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { restaurant } = useRestaurant();
  const { items, totalAmount } = useCart();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndMenuItems = async () => {
      if (!restaurant || !categoryId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch category details
        const categoryResponse = await categoriesApi.getById(restaurant.id, categoryId);
        setCategory(categoryResponse.data);
        
        // Fetch menu items for this category
        const menuItemsResponse = await menuItemsApi.getAll(restaurant.id, categoryId);
        setMenuItems(menuItemsResponse.data);
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching menu data:', err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurant && categoryId) {
      fetchCategoryAndMenuItems();
    }
  }, [restaurant, categoryId]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleGoToCart = () => {
    navigate('/checkout');
  };

  const handleMenuItemClick = (menuItem: MenuItem) => {
    // Navigate to menu item detail page
    navigate(`/menu-item/${menuItem.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            leftIcon={<ChevronLeft size={16} />}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {category?.name || 'Menu'}
          </h1>
        </div>
        
        {items.length > 0 && (
          <Button
            variant="primary"
            onClick={handleGoToCart}
            rightIcon={<ShoppingCart size={18} />}
            style={{
              backgroundColor: restaurant?.theme?.primaryColor || '#3B82F6',
            }}
          >
            {formatCurrency(totalAmount)}
          </Button>
        )}
      </div>

      {error ? (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setError(null);
                setIsLoading(true);
                if (restaurant && categoryId) {
                  Promise.all([
                    categoriesApi.getById(restaurant.id, categoryId),
                    menuItemsApi.getAll(restaurant.id, categoryId)
                  ]).then(([categoryRes, menuItemsRes]) => {
                    setCategory(categoryRes.data);
                    setMenuItems(menuItemsRes.data);
                    setIsLoading(false);
                  }).catch(err => {
                    console.error('Error retrying fetch:', err);
                    setError('Failed to load menu items. Please try again later.');
                    setIsLoading(false);
                  });
                }
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : menuItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No items available in this category.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleGoBack}
            >
              Go back to categories
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map(menuItem => (
            <MenuItemCard
              key={menuItem.id}
              menuItem={menuItem}
              onClick={() => handleMenuItemClick(menuItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
