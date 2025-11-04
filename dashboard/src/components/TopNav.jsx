import { Menu, User } from 'lucide-react';

function TopNav({ toggleSidebar }) {
  return (
    <header className="topnav">
      <button className="menu-btn" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <h1 className="topnav-title">E-Commerce Dashboard</h1>
      <div className="topnav-profile">
        <div className="profile-info">
          <span className="profile-name">Admin User</span>
          <span className="profile-role">Administrator</span>
        </div>
        <div className="profile-avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}

export default TopNav;
