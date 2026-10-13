import React, { useState } from 'react';
import { Bell, User, Sparkles } from 'lucide-react';
import pandoraLogo from '../assets/pandora-logo.png';

export default function Header({ onOpenNotifications, unreadCount }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="header-container">
      <div className="header-left">
        <div className="brand-logo">
          <img 
            src={pandoraLogo} 
            alt="PANDORA" 
            className="pandora-official-logo"
          />
        </div>
        <div className="header-divider"></div>
        <span className="portal-title">IIS Portal</span>
      </div>

      <div className="header-right">
        <button 
          className="header-icon-btn notification-btn"
          onClick={onOpenNotifications}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        <div className="profile-wrapper">
          <button 
            className="user-avatar-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="User Profile: Naved Siddiqui"
          >
            <span className="avatar-initials">NM</span>
          </button>

          {showProfileMenu && (
            <div className="profile-menu-dropdown fade-in">
              <div className="profile-menu-header">
                <p className="user-name">Naved Siddiqui</p>
                <p className="user-role">Inventory Operations Specialist</p>
              </div>
              <div className="menu-divider"></div>
              <div className="profile-menu-item">
                <User size={14} /> Profile Settings
              </div>
              <div className="profile-menu-item">
                <Sparkles size={14} /> Market Permissions (ANZ)
              </div>
              <div className="menu-divider"></div>
              <div className="profile-menu-item logout">
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
