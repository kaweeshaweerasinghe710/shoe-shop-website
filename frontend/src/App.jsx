// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Reviews from './pages/Reviews';
import About from './pages/About';
import Contact from './pages/Contact';
import Payment from './pages/Payment';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Layout that only shows Header/Footer when user is logged in
const AppLayout = ({ children }) => {
  const { user } = useAuth();

  // If user not logged in, render only the routed content (which will redirect to /login)
  if (!user) {
    return <>{children}</>;
  }

  // Logged in: show full layout
  return (
    <div className="app">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public route: only login is public */}
      <Route path="/login" element={<Login />} />

      {/* Protected application routes: user must be logged in */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/category/:slug"
        element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />

      {/* catch-all -> redirect to protected home (unauthenticated users will be redirected to /login) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            {/* AppLayout consumes useAuth to decide whether to show Header/Footer */}
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
