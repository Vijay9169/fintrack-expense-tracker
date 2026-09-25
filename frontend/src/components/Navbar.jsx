import React from 'react';

function Navbar({ user, onLogout, onOpenProfile, theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-icon">₹</div>
          <span>FinTrack</span>
        </div>

        <div className="user-nav">
          {/* Dark / Light Mode Button */}
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div
            className="user-profile"
            onClick={onOpenProfile}
            title="Click to view & edit profile"
          >
            <div className="avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <strong style={{ fontSize: '14px', display: 'block' }}>{user?.name}</strong>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{user?.email}</span>
            </div>
          </div>

          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;