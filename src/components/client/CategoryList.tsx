import React from 'react';
import { Category } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { useRestaurant } from '../../context/RestaurantContext';
import { useNavigate } from 'react-router-dom';

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  isLoading = false 
}) => {
  const { restaurant } = useRestaurant();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className="h-24 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No categories available.</p>
      </div>
    );
  }

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/menu/${categoryId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map(category => (
        <Card 
          key={category.id}
          className="transition-transform transform hover:scale-105 cursor-pointer"
          onClick={() => handleCategoryClick(category.id)}
        >
          <CardContent className="p-0">
            <div 
              className="h-24 flex items-center justify-center p-4"
              style={{
                backgroundColor: restaurant?.theme?.primaryColor || '#3B82F6',
                color: '#ffffff'
              }}
            >
              <h3 className="text-xl font-bold text-center">{category.name}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};