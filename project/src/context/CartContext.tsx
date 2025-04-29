import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MenuItem, OrderItem } from '../types';

interface CartItem extends OrderItem {
  menuItem: MenuItem;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  restaurantId: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_RESTAURANT'; payload: string };

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  restaurantId: null,
};

const calculateTotalAmount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.totalPrice, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.menuItemId === action.payload.menuItemId
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + action.payload.quantity,
          totalPrice: (existingItem.quantity + action.payload.quantity) * existingItem.unitPrice,
        };
        
        updatedItems[existingItemIndex] = updatedItem;
        
        return {
          ...state,
          items: updatedItems,
          totalAmount: calculateTotalAmount(updatedItems),
        };
      }

      // Add new item
      const updatedItems = [...state.items, action.payload];
      
      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotalAmount(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.menuItemId !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotalAmount(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { menuItemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: menuItemId });
      }

      const updatedItems = state.items.map(item => {
        if (item.menuItemId === menuItemId) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice,
          };
        }
        return item;
      });

      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotalAmount(updatedItems),
      };
    }

    case 'CLEAR_CART':
      return {
        ...initialState,
        restaurantId: state.restaurantId,
      };

    case 'SET_RESTAURANT':
      // Clear cart if restaurant changes
      if (state.restaurantId && state.restaurantId !== action.payload) {
        return {
          items: [],
          totalAmount: 0,
          restaurantId: action.payload,
        };
      }
      
      return {
        ...state,
        restaurantId: action.payload,
      };

    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addItem: (menuItem: MenuItem, quantity: number, selectedOptions?: any[]) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (restaurantId: string) => void;
}

const CartContext = createContext<CartContextType>({
  ...initialState,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  setRestaurant: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialState;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (menuItem: MenuItem, quantity: number, selectedOptions: any[] = []) => {
    const optionsPrice = selectedOptions.reduce((total, opt) => total + (opt.price || 0), 0);
    
    const cartItem: CartItem = {
      menuItemId: menuItem.id,
      menuItemName: menuItem.name,
      quantity,
      unitPrice: menuItem.price + optionsPrice,
      totalPrice: (menuItem.price + optionsPrice) * quantity,
      selectedOptions: selectedOptions.map(opt => ({
        name: opt.name,
        option: opt.value,
        price: opt.price || 0,
      })),
      menuItem,
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  const removeItem = (menuItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: menuItemId });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setRestaurant = (restaurantId: string) => {
    dispatch({ type: 'SET_RESTAURANT', payload: restaurantId });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setRestaurant,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};