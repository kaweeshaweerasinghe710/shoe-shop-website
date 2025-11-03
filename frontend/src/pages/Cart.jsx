import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Please login to view your cart</h2>
          <Link to="/login" className="login-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 2L6 6H3L4 20H20L21 6H18L15 2H9Z" strokeWidth="2"/>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <Link to="/shop" className="shop-link">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((total, item) => {
    return total + item.products.price * item.quantity;
  }, 0);

  const totalDiscount = cart.reduce((total, item) => {
    const discount = (item.products.price * item.products.discount_percentage / 100) * item.quantity;
    return total + discount;
  }, 0);

  const total = getCartTotal();

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>{t('cart')}</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => {
              const product = item.products;
              const discountedPrice = product.price * (1 - product.discount_percentage / 100);

              return (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={product.image_url} alt={product.name} />
                  </div>

                  <div className="item-details">
                    <h3>{product.name}</h3>
                    <p className="item-brand">{product.brand}</p>
                    {product.discount_percentage > 0 && (
                      <span className="discount-tag">-{product.discount_percentage}% OFF</span>
                    )}
                  </div>

                  <div className="item-pricing">
                    {product.discount_percentage > 0 ? (
                      <>
                        <span className="original-price">${product.price}</span>
                        <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="price">${product.price}</span>
                    )}
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(discountedPrice * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M18 6L6 18M6 6L18 18" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>{t('subtotal')}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="summary-row discount-row">
                <span>{t('discount')}</span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>{t('total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link to="/payment" className="checkout-btn">
              {t('checkout')}
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
