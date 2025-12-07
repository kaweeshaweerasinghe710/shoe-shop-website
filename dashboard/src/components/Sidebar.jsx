import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Folder, ShoppingCart, Star, Users, Tag, Settings, MessageSquare } from 'lucide-react';

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/categories', label: 'Categories', icon: Folder },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/reviews', label: 'Reviews', icon: Star },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/roles', label: 'Roles', icon: Users },
    { path: '/offers', label: 'Offers', icon: Tag },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;