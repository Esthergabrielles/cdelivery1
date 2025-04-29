import React, { createContext, useState, useContext, useEffect } from 'react';
import { Restaurant } from '../types';
import { api } from '../services/api';

interface RestaurantContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  setCurrentRestaurant: (subdomain: string) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  isLoading: true,
  error: null,
  setCurrentRestaurant: async () => {},
});

export const useRestaurant = () => useContext(RestaurantContext);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch restaurant data by subdomain
  const setCurrentRestaurant = async (subdomain: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add error handling for development environment
      if (process.env.NODE_ENV === 'development' && subdomain === 'demo') {
        // Mock data for development
        setRestaurant({
          id: '1',
          name: 'Demo Restaurant',
          subdomain: 'demo',
          description: 'A demo restaurant for development',
          address: '123 Demo Street',
          phone: '555-0123',
          email: 'demo@example.com',
          logo: 'https://via.placeholder.com/150',
          hours: {
            monday: '9:00-17:00',
            tuesday: '9:00-17:00',
            wednesday: '9:00-17:00',
            thursday: '9:00-17:00',
            friday: '9:00-17:00',
            saturday: 'Closed',
            sunday: 'Closed'
          }
        });
        return;
      }

      const response = await api.get(`/restaurants/${subdomain}`);
      setRestaurant(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load restaurant data.';
      setError(errorMessage);
      console.error('Error loading restaurant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Try to detect restaurant from URL on initial load
  useEffect(() => {
    const detectRestaurantFromUrl = () => {
      // In a real application, you'd extract the subdomain from the hostname
      // For now, we'll simulate with a mock subdomain for development
      const mockSubdomain = 'demo';
      setCurrentRestaurant(mockSubdomain);
    };

    detectRestaurantFromUrl();
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        isLoading,
        error,
        setCurrentRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};