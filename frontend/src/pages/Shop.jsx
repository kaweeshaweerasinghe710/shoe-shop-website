import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Shop.css';

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/categories'); // your backend URL
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCategories(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading categories...</p>;

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
        {filteredCategories.length === 0 && <p>No categories found.</p>}
        {filteredCategories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}`} // use _id as unique URL
            className="category-card"
          >
            <div className="category-image">
              <img src={category.image} alt={category.name} /> {/* use 'image' field */}
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

const loadCategories = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/categories');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    console.log('Categories from backend:', data); // <-- check this
    setCategories(data || []);
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};


export default Shop;
