// Common types used throughout the application

export type Restaurant = {
  id: string;
  name: string;
  logoUrl: string;
  theme: RestaurantTheme;
  subdomain: string;
  whatsappNumber: string;
  planType: 'basic' | 'premium' | 'enterprise';
};

export type RestaurantTheme = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

export type Category = {
  id: string;
  restaurantId: string;
  name: string;
  order: number;
};

export type MenuItemOption = {
  name: string;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
  multipleChoice?: boolean;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  isActive: boolean;
  options?: MenuItemOption[];
};

export type OrderItem = {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions?: {
    name: string;
    option: string;
    price: number;
  }[];
  notes?: string;
};

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'delivered' 
  | 'cancelled';

export type Order = {
  id: string;
  restaurantId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  couponCode?: string;
  discountAmount?: number;
};

export type Coupon = {
  id: string;
  restaurantId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  currentUsage: number;
};

export type User = {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
};