import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext({});
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart
  const loadCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart");
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      await loadCart();
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      await loadCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "DELETE",
      });
      await loadCart();
    } catch (err) {
      console.error("Failed to remove cart item", err);
    }
  };

  // Total price
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.products.price;
      const discount = item.products.discount || 0;
      const finalPrice = price;
      return total + finalPrice * item.quantity;
    }, 0);
  };

  // Total items
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
