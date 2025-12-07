import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

const BACKEND_URL = "http://localhost:5000/api/users"; // adjust if needed

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  // LOGIN
  const signIn = async (email, password) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid response from server');
      }

      if (!res.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      
// Save user data first
setUser(data.user);
localStorage.setItem('user', JSON.stringify(data.user));
if (data.user.role === 'admin' || data.user.role === 'manager') {
  window.location.href = `http://localhost:5175?user=${encodeURIComponent(JSON.stringify(data.user))}`;
} else {
 
  navigate('/');
}

      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  // SIGNUP (customer only)
  const signUp = async (name, email, password) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid response from server');
      }

      if (!res.ok) throw new Error(data.error || 'Signup failed');

      
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  // LOGOUT
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
