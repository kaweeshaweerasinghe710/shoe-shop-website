import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

function Offers() {
  const [offers, setOffers] = useState([
    { id: 1, type: 'Percentage', product: 'Wireless Headphones', discount: 15 },
    { id: 2, type: 'Percentage', product: 'Running Shoes', discount: 20 },
    { id: 3, type: 'Fixed Amount', product: 'Coffee Maker', discount: 10 },
    { id: 4, type: 'Percentage', product: 'Laptop Stand', discount: 25 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Percentage',
    product: '',
    discount: '',
  });

  const handleAddOffer = () => {
    setEditingOffer(null);
    setFormData({ type: 'Percentage', product: '', discount: '' });
    setIsModalOpen(true);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setFormData({
      type: offer.type,
      product: offer.product,
      discount: offer.discount,
    });
    setIsModalOpen(true);
  };

  const handleDeleteOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOffer) {
      setOffers(offers.map((o) => (o.id === editingOffer.id ? { ...o, ...formData } : o)));
    } else {
      const newOffer = {
        id: offers.length + 1,
        ...formData,
      };
      setOffers([...offers, newOffer]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="offers-page">
      <div className="page-header">
        <h1 className="page-title">Offers</h1>
        <button className="btn btn-primary" onClick={handleAddOffer}>
          <Plus size={20} />
          Add Offer
        </button>
      </div>

      <div className="table-container">
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
              <tr key={offer.id}>
                <td>{offer.type}</td>
                <td>{offer.product}</td>
                <td>
                  {offer.type === 'Percentage' ? `${offer.discount}%` : `$${offer.discount}`}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon btn-edit" onClick={() => handleEditOffer(offer)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => handleDeleteOffer(offer.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingOffer ? 'Edit Offer' : 'Add Offer'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Offer Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
              <option value="Percentage">Percentage</option>
              <option value="Fixed Amount">Fixed Amount</option>
            </select>
          </div>
          <div className="form-group">
            <label>Product</label>
            <input
              type="text"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Discount {formData.type === 'Percentage' ? '(%)' : '($)'}</label>
            <input
              type="number"
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingOffer ? 'Update' : 'Add'} Offer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Offers;
