import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import './Settings.css';

function Settings() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    social: {
      facebook: '',
      twitter: '',
      instagram: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [shopExists, setShopExists] = useState(false);

  // Fetch shop details on component mount
  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/shop');
      const data = await response.json();

      if (data._id) {
        setShopExists(true);
        setFormData({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          openingHours: data.openingHours || '',
          social: {
            facebook: data.social?.facebook || '',
            twitter: data.social?.twitter || '',
            instagram: data.social?.instagram || ''
          }
        });
      } else {
        setShopExists(false);
      }
    } catch (error) {
      console.error('Error fetching shop details:', error);
      setMessage({ type: 'error', text: 'Failed to load shop details' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const method = shopExists ? 'PUT' : 'POST';
      const response = await fetch('http://localhost:5000/api/shop', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShopExists(true);
        setMessage({ 
          type: 'success', 
          text: shopExists ? 'Shop details updated successfully!' : 'Shop created successfully!' 
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save shop details' });
      }
    } catch (error) {
      console.error('Error saving shop details:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.startsWith('social.')) {
      const socialField = field.split('.')[1];
      setFormData({
        ...formData,
        social: {
          ...formData.social,
          [socialField]: value
        }
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="shop-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading shop details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="page-header">
        <h1 className="page-title">Shop Settings</h1>
        <p className="page-subtitle">
          {shopExists ? 'Manage your shop information' : 'Set up your shop details'}
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="shop-container">
        <form onSubmit={handleSubmit} className="shop-form">
          <div className="form-section">
            <h2 className="section-title">Shop Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Shop Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter shop name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows="3"
                placeholder="Enter shop address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+94 77 999 8888"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="info@myshop.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="openingHours">Opening Hours *</label>
              <input
                id="openingHours"
                type="text"
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder="Everyday 9am - 8pm"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Social Media Links</h2>
            
            <div className="form-group">
              <label htmlFor="facebook">Facebook</label>
              <input
                id="facebook"
                type="url"
                value={formData.social.facebook}
                onChange={(e) => handleChange('social.facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="form-group">
              <label htmlFor="twitter">Twitter</label>
              <input
                id="twitter"
                type="url"
                value={formData.social.twitter}
                onChange={(e) => handleChange('social.twitter', e.target.value)}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div className="form-group">
              <label htmlFor="instagram">Instagram</label>
              <input
                id="instagram"
                type="url"
                value={formData.social.instagram}
                onChange={(e) => handleChange('social.instagram', e.target.value)}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              <Save size={20} />
              {saving ? 'Saving...' : shopExists ? 'Update Shop' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;