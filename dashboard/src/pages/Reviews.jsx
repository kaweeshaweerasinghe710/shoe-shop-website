import { useEffect, useState } from 'react';
import { Trash2, Star } from 'lucide-react';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch Reviews from Backend
  // -----------------------------
  const loadReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();

      if (Array.isArray(data.data)) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // -----------------------------
  // Delete Review
  // -----------------------------
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // -----------------------------
  // Stars Renderer
  // -----------------------------
  const renderStars = (rating) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? '#f59e0b' : 'none'}
          color="#f59e0b"
        />
      ))}
    </div>
  );

  if (loading) return <p>Loading reviews...</p>;

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
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No reviews found</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.user?.name || "Unknown User"}</td>
                  <td>{renderStars(review.rating)}</td>
                  <td className="review-comment">{review.comment}</td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Reviews;
