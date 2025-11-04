import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

function Categories() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', image: '/placeholder.jpg' },
    { id: 2, name: 'Sports', description: 'Sports equipment and gear', image: '/placeholder.jpg' },
    { id: 3, name: 'Home', description: 'Home appliances and decor', image: '/placeholder.jpg' },
    { id: 4, name: 'Fashion', description: 'Clothing and accessories', image: '/placeholder.jpg' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } : c)));
    } else {
      const newCategory = {
        id: categories.length + 1,
        ...formData,
        image: '/placeholder.jpg',
      };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button className="btn btn-primary" onClick={handleAddCategory}>
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-image-placeholder"></div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
            <div className="category-actions">
              <button className="btn-icon btn-edit" onClick={() => handleEditCategory(category)}>
                <Edit2 size={18} />
              </button>
              <button className="btn-icon btn-delete" onClick={() => handleDeleteCategory(category.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              required
            />
          </div>
          <div className="form-group">
            <label>Category Photo</label>
            <input type="file" accept="image/*" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Update' : 'Add'} Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;
