import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext({});
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [user]);

  // Load cart from backend
  const loadCart = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user.email}`); // backend endpoint
      const data = await res.json();
      setCart(data || []);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  // Add product to cart
  const addToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, productId, quantity: 1 }),
      });
      await loadCart();
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      await loadCart();
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  // Remove item
  const removeFromCart = async (itemId) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${itemId}`, { method: 'DELETE' });
      await loadCart();
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) return;
    try {
      await fetch(`http://localhost:5000/api/cart/clear/${user.email}`, { method: 'DELETE' });
      setCart([]);
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  // Get total price
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.price;
      const discount = item.product.discount_percentage || 0;
      const discountedPrice = price * (1 - discount / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  // Get total count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
