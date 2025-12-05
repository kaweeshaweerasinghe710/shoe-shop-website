import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './Categories.css';

const API_URL = 'http://localhost:5000/api/categories'; // Update with your backend URL

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      alert('Error fetching categories');
    }
  };

  // Add or Update category
  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.image) {
      alert('All fields are required');
      return;
    }
    
    setLoading(true);
    
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory ? `${API_URL}/${editingCategory._id}` : API_URL;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        fetchCategories();
        setIsModalOpen(false);
        setFormData({ name: '', description: '', image: '' });
      } else {
        alert('Error saving category');
      }
    } catch (err) {
      alert('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
      } else {
        alert('Error deleting category');
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  // Open modal for adding
  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description, image: category.image });
    setIsModalOpen(true);
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category._id} className="category-card">
            <img src={category.image} alt={category.name} className="category-image" />
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
            <div className="category-actions">
              <button onClick={() => handleEdit(category)} className="btn-icon btn-edit">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(category._id)} className="btn-icon btn-delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <div className="form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="data:image/jpeg;base64,... or https://..."
            />
          </div>
          
          <div className="form-actions">
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Categories;