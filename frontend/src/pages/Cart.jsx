import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  // Filter out items with null products
  const validCartItems = cart.filter((item) => item.products);

  if (validCartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <Link to="/shop" className="shop-link">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = validCartItems.reduce((total, item) => {
    return total + item.products.price * item.quantity;
  }, 0);

  const totalDiscount = validCartItems.reduce((total, item) => {
    const discount = (item.products.price * (item.products.discount || 0)) / 100;
    return total + discount * item.quantity;
  }, 0);

  const total = subtotal - totalDiscount;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>My Cart</h1>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {validCartItems.map((item) => {
              const product = item.products;
              const discountedPrice =
                product.price * (1 - (product.discount|| 0) / 100);
                

              return (
                <div key={product._id} className="cart-item">
                  <div className="item-image">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="item-details">
                    <h3>{product.name}</h3>
                    {product.brand && <p className="item-brand">{product.brand}</p>}
                    {product.discount > 0 && (
                      <span className="discount-tag">
                        -{product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="item-pricing">
                    {product.discount > 0 ? (
                      <>
                        <span className="original-price">${product.price}</span>
                        <span className="discounted-price">
                          {product.discount}%
                        </span>
                      </>
                    ) : (
                      <span className="price">${product.price}</span>
                    )}
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(product._id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(product._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(discountedPrice * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount</span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <Link to="/payment" className="checkout-btn">
              Checkout
            </Link>

            <Link to="/shop" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
