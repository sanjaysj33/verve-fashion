export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Essentials' | 'Luxury' | 'Accessories' | 'Outerwear';
  image: string;
  colors: string[];
  sizes: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface UserPreferences {
  newsletter: boolean;
  currency: 'INR' | 'USD';
  theme: 'light' | 'dark';
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface User {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  tier: string;
  preferences: UserPreferences;
  wishlist: string[]; // Array of product IDs
  orders: Order[];
}

export interface AccountData {
  user: User | null;
}
