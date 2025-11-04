import { useState } from 'react';
import { Trash2, Star } from 'lucide-react';

function Reviews() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'John Doe',
      product: 'Wireless Headphones',
      rating: 5,
      comment: 'Excellent product! Great sound quality and comfortable to wear.',
      date: '2024-01-15',
    },
    {
      id: 2,
      userName: 'Jane Smith',
      product: 'Running Shoes',
      rating: 4,
      comment: 'Good quality shoes, but took a while to break in.',
      date: '2024-01-14',
    },
    {
      id: 3,
      userName: 'Bob Wilson',
      product: 'Coffee Maker',
      rating: 5,
      comment: 'Makes perfect coffee every time. Highly recommended!',
      date: '2024-01-13',
    },
    {
      id: 4,
      userName: 'Alice Brown',
      product: 'Laptop Stand',
      rating: 3,
      comment: 'Decent stand but a bit wobbly.',
      date: '2024-01-12',
    },
    {
      id: 5,
      userName: 'Charlie Davis',
      product: 'Yoga Mat',
      rating: 5,
      comment: 'Very comfortable and non-slip. Perfect for yoga practice.',
      date: '2024-01-11',
    },
  ]);

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={16} fill={star <= rating ? '#f59e0b' : 'none'} color="#f59e0b" />
        ))}
      </div>
    );
  };

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h1 className="page-title">Reviews</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.userName}</td>
                <td>{review.product}</td>
                <td>{renderStars(review.rating)}</td>
                <td className="review-comment">{review.comment}</td>
                <td>{review.date}</td>
                <td>
                  <button className="btn-icon btn-delete" onClick={() => handleDeleteReview(review.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reviews;
