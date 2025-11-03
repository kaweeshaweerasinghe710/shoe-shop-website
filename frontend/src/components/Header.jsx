import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './Header.css';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const { getCartCount } = useCart();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="logo">
            <h1>{t('shopName')}</h1>
          </div>

          <div className="header-actions">
            <div className="language-selector">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-dropdown"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <Link to="/cart" className="cart-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 2L6 6H3L4 20H20L21 6H18L15 2H9Z" strokeWidth="2"/>
              </svg>
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>

            {user ? (
              <div className="account-menu">
                <div className="account-icon">
                  {profile?.photo_url ? (
                    <img src={profile.photo_url} alt="Profile" />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="8" r="4" strokeWidth="2"/>
                      <path d="M6 21V19C6 17 8 15 12 15C16 15 18 17 18 19V21" strokeWidth="2"/>
                    </svg>
                  )}
                </div>
                <div className="account-dropdown">
                  <p className="user-name">{profile?.name || user.email}</p>
                  <p className="user-email">{user.email}</p>
                  <button onClick={handleLogout} className="logout-btn">
                    {t('logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-btn">{t('login')}</Link>
            )}
          </div>
        </div>
      </div>

      <nav className="nav">
        <div className="container">
          <ul className="nav-links">
            <li><Link to="/">{t('home')}</Link></li>
            <li><Link to="/about">{t('aboutUs')}</Link></li>
            <li><Link to="/shop">{t('shopNow')}</Link></li>
            <li><Link to="/reviews">{t('customerReviews')}</Link></li>
            <li><Link to="/payment">{t('payHere')}</Link></li>
            <li><Link to="/contact">{t('contactUs')}</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
