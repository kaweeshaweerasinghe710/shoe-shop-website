import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    product: '',
    rating: 5,
    comment: '',
  });

  const { user } = useAuth();
  const { t } = useLanguage();

  const [currentSlide, setCurrentSlide] = useState(0);
const itemsPerView = 3; // 3 on desktop, adjust based on screen size

  // Load reviews + products on mount
  useEffect(() => {
    loadReviews();
    loadProducts();
  }, []);

  // ⭐ LOAD REVIEWS
  const loadReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      const data = await response.json();

      setReviews(data.data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  // ⭐ LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  // ⭐ SUBMIT REVIEW
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: formData.product,
          rating: formData.rating,
          comment: formData.comment,
          user: user._id,
        }),
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setFormData({ product: '', rating: 5, comment: '' });
        setShowForm(false);
        loadReviews();
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="reviews-page">
      <div className="reviews-container">
        
        {/* HEADER */}
        <div className="reviews-header">
          <h1>{t('Share your experience with us...')}</h1>
          <button onClick={() => setShowForm(!showForm)} className="add-review-btn">
            {showForm ? 'Cancel' : t('submitReview')}
          </button>
        </div>

        {/* REVIEW FORM */}
        {showForm && (
          <div className="review-form-container">
            <form onSubmit={handleSubmit} className="review-form">
              <h2>Share Your Experience</h2>

              {/* PRODUCT SELECT */}
              <div className="form-group">
                <label>Select Product</label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  required
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* RATING */}
              <div className="form-group">
                <label>{t('rating')}</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`star ${star <= formData.rating ? 'active' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* COMMENT */}
              <div className="form-group">
                <label>{t('comment')}</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows="4"
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                {t('submitReview')}
              </button>
            </form>
          </div>
        )}

        {/* REVIEW LIST */}
        {/* REVIEW CAROUSEL */}
<div className="reviews-list">
  <div 
    className="carousel-track"
    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
  >
    {reviews.map((review) => (
      <div key={review._id} className="review-card">
        <div className="review-header-section">
          <div className="user-avatar">
            {review.user?.name?.charAt(0) || "A"}
          </div>
          <div className="review-info">
            <h3>{review.user?.name || "Anonymous User"}</h3>
            <p className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="review-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
              ★
            </span>
          ))}
        </div>

        {review.product?.name && (
          <div className="review-product">Product: {review.product.name}</div>
        )}

        <p className="review-comment">{review.comment}</p>
      </div>
    ))}
  </div>
</div>

{/* CAROUSEL CONTROLS */}
<div className="carousel-controls">
  <button className="control-btn" onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}>
    ‹
  </button>
  <button className="control-btn" onClick={() => setCurrentSlide(Math.min(Math.ceil(reviews.length / itemsPerView) - 1, currentSlide + 1))}>
    ›
  </button>
</div>

{/* CAROUSEL DOTS */}
<div className="carousel-dots">
  {Array(Math.ceil(reviews.length / itemsPerView)).fill(0).map((_, i) => (
    <button 
      key={i} 
      className={`dot ${i === currentSlide ? 'active' : ''}`}
      onClick={() => setCurrentSlide(i)}
    />
  ))}
</div>
      </div>
    </div>
  );
};

export default Reviews;
