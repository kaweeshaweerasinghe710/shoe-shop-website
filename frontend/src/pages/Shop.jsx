import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Shop.css';

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    loadCategories();
  }, []);

  // Fetch categories from your backend
  const loadCategories = async () => {
    try {
      const res = await fetch('https://your-backend-url.com/api/categories');
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>{t('shopNow')}</h1>
        <p>Browse our collection by category</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" strokeWidth="2"/>
        </svg>
      </div>

      <div className="categories-grid">
        {filteredCategories.map((category) => (
          <Link
            key={category._id || category.id}
            to={`/category/${category.slug}`}
            className="category-card"
          >
            <div className="category-image">
              <img src={category.image_url} alt={category.name} />
              <div className="category-overlay">
                <h2>{category.name}</h2>
                <span className="shop-now-text">Shop Now →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;
