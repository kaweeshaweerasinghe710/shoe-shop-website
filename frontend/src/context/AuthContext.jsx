import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores logged-in user info
  const navigate = useNavigate();

  // Login function
  const signIn = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', { // your backend login route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return false;
      }

      // Store user info in state
      setUser({ email, role: data.role });

      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      return true;
    } catch (err) {
      alert('Failed to fetch backend');
      return false;
    }
  };

  // Signup function
  const signUp = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', { // your backend register route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return false;
      }

      alert('Registration successful! Please login.');
      navigate('/login');
      return true;
    } catch (err) {
      alert('Failed to fetch backend');
      return false;
    }
  };

  // Logout function
  const signOut = () => {
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
