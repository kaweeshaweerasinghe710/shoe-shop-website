import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './Category.css';

const Category = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    loadCategory();
    loadAllCategories();
  }, [slug]);

  useEffect(() => {
    applyFilters();
  }, [products, priceRange, selectedBrands]);

  

  const applyFilters = () => {
    let filtered = [...products];
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }
    setFilteredProducts(filtered);
  };

  const brands = [...new Set(products.map((p) => p.brand))];

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    alert('Product added to cart!');
  };

  if (!category) return <div className="loading">Loading...</div>;

  return (
    <div className="category-page">
      <div className="category-nav">
        <div className="category-tabs">
          {allCategories.map((cat) => (
            <Link
              key={cat._id || cat.id}
              to={`/category/${cat.slug}`}
              className={`category-tab ${cat.slug === slug ? 'active' : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="category-header">
        <h1>{category.name}</h1>
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 6H20M4 12H20M4 18H20" strokeWidth="2"/>
          </svg>
          {t('filterBy')}
        </button>
      </div>

      <div className="category-content">
        {showFilters && (
          <div className="filters-sidebar">
            <div className="filter-section">
              <h3>{t('priceRange')}</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="filter-section">
              <h3>{t('brands')}</h3>
              <div className="brand-filters">
                {brands.map((brand) => (
                  <label key={brand} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="reset-filters"
              onClick={() => {
                setPriceRange([0, 1000]);
                setSelectedBrands([]);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="products-section">
          <p className="results-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id || product.id} className="product-card">
                {product.discount_percentage > 0 && (
                  <span className="discount-badge">-{product.discount_percentage}%</span>
                )}
                <div className="product-image">
                  <img src={product.image_url} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-pricing">
                    {product.discount_percentage > 0 ? (
                      <>
                        <span className="original-price">${product.price}</span>
                        <span className="discounted-price">
                          ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="price">${product.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product._id || product.id)}
                    className="add-to-cart-btn"
                  >
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>

        <div className="go-to-cart-container">
          <Link to="/cart" className="go-to-cart-btn">
            {t('cart') || 'Go to Cart'}
          </Link>
        </div>
      </div>
    </div>
  );
};

const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          productId: productId,
        }),
      });

      const data = await res.json();
      alert(data.message || "Product added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  };

export default Category;
