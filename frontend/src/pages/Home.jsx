import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
  loadFeaturedProducts();
}, []);

const loadFeaturedProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const data = await response.json();

    // ✅ Filter only discounted products and take first 3
    const discountedItems = data
      .filter(item => item.discount > 0) // only items with discount
      .slice(0, 3); 

    setFeaturedProducts(discountedItems);
  } catch (error) {
    console.error('Failed to load featured products:', error);
  }
};
            
  const handleAddToCart = async (productId,quantity) => {
    await addToCart(productId);
    alert('Product added to cart!');
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Onero Shoe House</h1>
          <p>Discover the perfect blend of style, comfort, and quality</p>
          <Link to="/shop" className="cta-button">
            {t('shopNow')}
          </Link>
        </div>
      </section>

      <section className="offers-banner">
        <div className="offer-card">
          <h3>Summer Sale</h3>
          <p>Up to 50% OFF</p>
          <span className="offer-tag">Limited Time</span>
        </div>
        <div className="offer-card">
          <h3>New Arrivals</h3>
          <p>Latest Collection</p>
          <span className="offer-tag">Just In</span>
        </div>
        <div className="offer-card">
          <h3>Free Shipping</h3>
          <p>Orders Over $50</p>
          <span className="offer-tag">Worldwide</span>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>{t('featuredProducts')}</h2>
          <p>Handpicked items just for you</p>
        </div>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
              <div className="product-image">
                <img src={product.image_url} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                <div className="product-pricing">
                  {product.discount > 0 ? (
                    <>
                      <span className="original-price">${product.price}</span>
                      <span className="discounted-price">
                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="price">${product.price}</span>
                  )}
                </div>
                

                <button onClick={() => handleAddToCart(product._id)}
                  className="add-to-cart-btn"
                >
                  {t('addToCart')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all">
          <Link to="/shop" className="view-all-btn">
            View All Products
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-item">
          <div className="feature-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2"/>
              <path d="M9 12L11 14L15 10" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Quality Guaranteed</h3>
          <p>100% authentic products</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12H3M12 21C7.02944 21 3 16.9706 3 12M12 21C13.6569 21 15 16.9706 15 12C15 7.02944 13.6569 3 12 3M12 21C10.3431 21 9 16.9706 9 12C9 7.02944 10.3431 3 12 3M3 12C3 7.02944 7.02944 3 12 3" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Worldwide Shipping</h3>
          <p>We deliver globally</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" strokeWidth="2"/>
              <path d="M11 8L8 12L11 16M13 8L16 12L13 16" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Secure Payment</h3>
          <p>Safe & secure checkout</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
