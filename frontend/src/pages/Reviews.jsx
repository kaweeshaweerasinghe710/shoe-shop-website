import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    rating: 5,
    comment: '',
  });
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    loadReviews();
    loadProducts();
  }, []);

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        products (name, image_url)
      `)
      .order('created_at', { ascending: false });

    setReviews(data || []);
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name');

    setProducts(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      product_id: formData.product_id,
      user_id: user.id,
      user_name: profile?.name || user.email,
      user_photo_url: profile?.photo_url || null,
      rating: formData.rating,
      comment: formData.comment,
    });

    if (!error) {
      alert('Review submitted successfully!');
      setFormData({ product_id: '', rating: 5, comment: '' });
      setShowForm(false);
      loadReviews();
    } else {
      alert('Error submitting review');
    }
  };

  return (
    <div className="reviews-page">
      <div className="reviews-container">
        <div className="reviews-header">
          <h1>{t('customerReviews')}</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="add-review-btn"
          >
            {showForm ? 'Cancel' : t('submitReview')}
          </button>
        </div>

        {showForm && (
          <div className="review-form-container">
            <form onSubmit={handleSubmit} className="review-form">
              <h2>Share Your Experience</h2>

              <div className="form-group">
                <label>Select Product</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  required
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

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

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header-section">
                  <div className="reviewer-info">
                    {review.user_photo_url ? (
                      <img
                        src={review.user_photo_url}
                        alt={review.user_name}
                        className="reviewer-photo"
                      />
                    ) : (
                      <div className="reviewer-avatar">
                        {review.user_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3>{review.user_name}</h3>
                      <p className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${i < review.rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="review-product">
                  <img
                    src={review.products.image_url}
                    alt={review.products.name}
                  />
                  <span>{review.products.name}</span>
                </div>

                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
