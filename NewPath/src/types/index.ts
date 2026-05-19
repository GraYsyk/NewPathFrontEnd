interface ProductVariant {
  color: string;
  size: string;
  quantity: number;
}

interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  frontImage: string;
  images: string[];
  variants: ProductVariant[];
}

interface CartItem {
  cartItemId?: number | null;
  id: number;
  name: string;
  price: number;
  image: string;
  frontImage?: string;
  color: string | null;
  size: string | null;
  quantity: number;
  stockQuantity: number;
}

interface CartError {
  msg: string;
  item: CartItem | null;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: number | null, id: number, color: string, size: string) => void;
  updateQuantity: (cartItemId: number | null, id: number, color: string, size: string, quantity: number) => void;
  totalPrice: number;
  fetchCart: () => void;
  cartError: CartError | null;
  setCartError: (error: CartError | null) => void;
  clearError: () => void;
}

interface IncomePoint {
  label: string;
  income: number;
}

interface MonthlyGrowth {
  month: string;
  orders: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface Bestseller {
  itemId: number;
  itemName: string;
  frontImage: string;
  totalSold: number;
}