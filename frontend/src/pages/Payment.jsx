import { useRef, useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const payHereRef = useRef(null);

  useEffect(() => {
    setTotalAmount(getCartTotal());
  }, [cart, getCartTotal]);

  const scrollToCheckout = () => {
    payHereRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePayHere = () => {
    if (!customerName || !shippingAddress) {
      alert('Please fill in your name and shipping address.');
      return;
    }

    const paymentData = {
      merchant_id: 1232710, // Replace with your sandbox ID
      return_url: 'https://yourwebsite.com/payment/success',
      cancel_url: 'https://yourwebsite.com/payment/cancel',
      notify_url: ' https://yourwebsite.com/api/orders/notify', // backend endpoint to save order
      order_id: `order_${Date.now()}`,
      items: cart.map(item => item.products.name).join(', '),
      amount: totalAmount,
      currency: 'LKR',
      customer_name: customerName,
      customer_email: user.email || 'demo@example.com',
      customer_phone: user.phone || '0771234567',
      shipping_address: shippingAddress
    };

    window.payhere.open(paymentData);
  };

  if (!user) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="empty-state">
            <h2>Please login to proceed with payment</h2>
            <Link to="/login" className="login-link">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="empty-state">
            <h2>No items in cart</h2>
            <Link to="/shop" className="shop-link">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Payment</h1>

        <div className="payment-content">
          {/* Payment Form Section */}
          <div className="payment-form-section" ref={payHereRef}>
            <h2>Payment Information</h2>
            <p className="demo-notice">
              This is a sandbox payment page. No real payment will be processed.
            </p>

            <form className="payment-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Shipping Address</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street Address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Items</label>
                <textarea
                  value={cart.map(i => `${i.products.name} x${i.quantity} - LKR ${(i.products.price * (1 - i.products.discount_percentage / 100) * i.quantity).toFixed(2)}`).join('\n')}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Total Payment (LKR)</label>
                <input type="number" value={totalAmount} readOnly />
              </div>

              <button type="button" className="pay-btn" onClick={handlePayHere}>
                Pay LKR {totalAmount.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>

            <div className="order-items">
              {cart.map(item => {
                const product = item.products;
                const discountedPrice = product.price * (1 - product.discount_percentage / 100);
                return (
                  <div key={item.id} className="order-item">
                    <img src={product.image_url} alt={product.name} />
                    <div className="order-item-details">
                      <h4>{product.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="item-price">LKR {(discountedPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Total</span>
                <span className="total-amount">LKR {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-badges">
              <div className="badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" strokeWidth="2"/>
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" strokeWidth="2"/>
                </svg>
                <span>Money-back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
