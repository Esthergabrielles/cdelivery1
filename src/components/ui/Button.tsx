import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const { restaurant } = useRestaurant();
  
  // Dynamically apply restaurant's theme when available
  const getPrimaryColor = () => {
    return restaurant?.theme?.primaryColor || '#3B82F6';
  };

  const getSecondaryColor = () => {
    return restaurant?.theme?.secondaryColor || '#14B8A6';
  };

  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  }[size];
  
  // Dynamic variant styles
  const getVariantClasses = () => {
    const primaryColor = getPrimaryColor();
    const secondaryColor = getSecondaryColor();
    
    switch (variant) {
      case 'primary':
        return `bg-[${primaryColor}] hover:bg-opacity-90 text-white`;
      case 'secondary':
        return `bg-[${secondaryColor}] hover:bg-opacity-90 text-white`;
      case 'outline':
        return `border border-[${primaryColor}] text-[${primaryColor}] bg-transparent hover:bg-[${primaryColor}] hover:bg-opacity-10`;
      case 'text':
        return `bg-transparent text-[${primaryColor}] hover:bg-gray-100`;
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return `bg-[${primaryColor}] hover:bg-opacity-90 text-white`;
    }
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${getVariantClasses()} ${widthClass} ${disabledClass} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};