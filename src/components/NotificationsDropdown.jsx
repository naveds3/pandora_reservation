import React from 'react';
import { Bell, CheckCircle, AlertTriangle, RefreshCw, X } from 'lucide-react';

export default function NotificationsDropdown({ isOpen, onClose, notifications, onClearAll }) {
  if (!isOpen) return null;

  return (
    <div className="notifications-backdrop" onClick={onClose}>
      <div className="notifications-flyout fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="notifications-header">
          <div className="flex-align">
            <Bell size={16} />
            <h4>System Notifications</h4>
          </div>
          <div className="flex-align gap-2">
            <button className="text-btn" onClick={onClearAll}>Clear All</button>
            <button className="close-btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <CheckCircle size={24} className="text-muted" />
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`notification-item ${n.type}`}>
                <div className="notification-icon">
                  {n.type === 'success' && <CheckCircle size={15} />}
                  {n.type === 'warning' && <AlertTriangle size={15} />}
                  {n.type === 'info' && <RefreshCw size={15} />}
                </div>
                <div className="notification-text">
                  <p className="notification-title">{n.title}</p>
                  <p className="notification-message">{n.message}</p>
                  <span className="notification-time">{n.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
