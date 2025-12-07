import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './Products.css';

const API_URL = 'http://localhost:5000/api/products'; // Update with your backend URL
const CATEGORIES_API_URL = 'http://localhost:5000/api/categories'; // Update with your backend URL

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

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: 0,
    countInStock: '',
    image: '',
    category: '',
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORIES_API_URL);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const url = selectedCategory 
        ? `${API_URL}?category=${selectedCategory}`
        : API_URL;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      alert('Error fetching products');
    }
  };

  // Add or Update product
  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.countInStock || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount) || 0,
      countInStock: parseInt(formData.countInStock),
    };

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `${API_URL}/${editingProduct._id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        fetchProducts();
        setIsModalOpen(false);
        setFormData({
          name: '',
          description: '',
          price: '',
          discount: 0,
          countInStock: '',
          image: '',
          category: '',
        });
      } else {
        alert('Error saving product');
      }
    } catch (err) {
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Error deleting product');
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  // Open modal for adding
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: 0,
      countInStock: '',
      image: '',
      category: selectedCategory || '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discount: product.discount || 0,
      countInStock: product.countInStock,
      image: product.image || '',
      category: product.category,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <div className="header-actions">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <button onClick={handleAdd} className="btn btn-primary">
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Discount (%)</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No products found</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} className="product-image" />
                  </td>
                  <td>{product.name}</td>
                  <td>Rs.{product.price.toFixed(2)}</td>
                  <td>{product.discount}%</td>
                  <td>{product.countInStock}</td>
                  <td>{product.category}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(product)} className="btn-icon btn-edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="btn-icon btn-delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <div className="form">
          <div className="form-group">
            <label>Product Name *</label>
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

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                value={formData.countInStock}
                onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : editingProduct ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Products;