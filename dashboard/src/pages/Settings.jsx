import { useState } from 'react';
import { Save } from 'lucide-react';

function Settings() {
  const [formData, setFormData] = useState({
    shopName: 'My E-Commerce Store',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@mystore.com',
    facebook: 'https://facebook.com/mystore',
    twitter: 'https://twitter.com/mystore',
    instagram: 'https://instagram.com/mystore',
    openHours: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings updated successfully!');
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-container">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h2 className="section-title">Shop Information</h2>
            <div className="form-group">
              <label>Shop Name</label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => handleChange('shopName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows="2"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Open Hours</label>
              <input
                type="text"
                value={formData.openHours}
                onChange={(e) => handleChange('openHours', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="settings-section">
            <h2 className="section-title">Social Media Links</h2>
            <div className="form-group">
              <label>Facebook</label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Twitter</label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Instagram</label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
