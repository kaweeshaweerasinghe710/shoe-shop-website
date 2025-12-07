import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import './Offers.css';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    offerType: 'percentage',
    product: '',
    discount: '',
  });

  // Fetch offers from backend
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/offers');
      if (!response.ok) throw new Error('Failed to fetch offers');
      const data = await response.json();
      setOffers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = () => {
    setEditingOffer(null);
    setFormData({ offerType: 'percentage', product: '', discount: '' });
    setIsModalOpen(true);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setFormData({
      offerType: offer.offerType,
      product: offer.product,
      discount: offer.discount,
    });
    setIsModalOpen(true);
  };

  const handleDeleteOffer = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/offers/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete offer');
        setOffers(offers.filter((o) => o._id !== id));
      } catch (err) {
        alert('Error deleting offer: ' + err.message);
        console.error('Error deleting offer:', err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingOffer) {
        // Update existing offer
        const response = await fetch(`http://localhost:5000/api/offers/${editingOffer._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update offer');
        const updatedOffer = await response.json();
        setOffers(offers.map((o) => (o._id === editingOffer._id ? updatedOffer : o)));
      } else {
        // Create new offer
        const response = await fetch('http://localhost:5000/api/offers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create offer');
        const newOffer = await response.json();
        setOffers([...offers, newOffer]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving offer: ' + err.message);
      console.error('Error saving offer:', err);
    }
  };

  const formatDiscount = (offer) => {
    return offer.offerType === 'percentage' 
      ? `${offer.discount}%` 
      : `$${offer.discount.toFixed(2)}`;
  };

  const getOfferTypeDisplay = (type) => {
    return type === 'percentage' ? 'Percentage' : 'Fixed Amount';
  };

  if (loading) {
    return (
      <div className="offers-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="offers-page">
      <div className="page-header">
        <h1 className="page-title">Offers Management</h1>
        <button className="btn btn-primary" onClick={handleAddOffer}>
          <Plus size={20} />
          Add Offer
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="table-container">
        {offers.length === 0 ? (
          <div className="empty-state">
            <p>No offers found. Create your first offer to get started!</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Offer Type</th>
                <th>Product</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer._id}>
                  <td>
                    <span className={`offer-type-badge ${offer.offerType}`}>
                      {getOfferTypeDisplay(offer.offerType)}
                    </span>
                  </td>
                  <td>{offer.product || 'N/A'}</td>
                  <td>
                    <span className="discount-value">{formatDiscount(offer)}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-edit" 
                        onClick={() => handleEditOffer(offer)}
                        title="Edit offer"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => handleDeleteOffer(offer._id)}
                        title="Delete offer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingOffer ? 'Edit Offer' : 'Add Offer'}
      >
        <div className="offer-form">
          <div className="form-group">
            <label htmlFor="offerType">Offer Type</label>
            <select 
              id="offerType"
              value={formData.offerType} 
              onChange={(e) => setFormData({ ...formData, offerType: e.target.value })}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="product">Product</label>
            <input
              id="product"
              type="text"
              placeholder="Enter product name"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">
              Discount {formData.offerType === 'percentage' ? '(%)' : '($)'}
            </label>
            <input
              id="discount"
              type="number"
              step="0.01"
              min="0"
              max={formData.offerType === 'percentage' ? '100' : undefined}
              placeholder={formData.offerType === 'percentage' ? '0-100' : '0.00'}
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            />
            {formData.offerType === 'percentage' && (
              <small className="form-hint">Enter a value between 0 and 100</small>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {editingOffer ? 'Update' : 'Add'} Offer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Offers;