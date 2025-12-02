import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const success = await signUp(formData.name, formData.email, formData.password);
        if (success) {
          setIsSignUp(false);
          setFormData({ name: '', email: '', password: '' });
        }
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>{isSignUp ? t('signUp') : t('signIn')}</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="form-group">
                <label>{t('name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="form-group">
              <label>{t('email')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>{t('password')}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Please wait...' : isSignUp ? t('signUp') : t('signIn')}
            </button>
          </form>

          <div className="toggle-form">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? t('signIn') : t('signUp')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
