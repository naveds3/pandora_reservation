import React from 'react';
import { SlidersHorizontal, PackageCheck, Database, HelpCircle, Layers } from 'lucide-react';

export default function Sidebar({ activeNav, setActiveNav, onOpenUserGuide }) {
  const navItems = [
    { id: 'stock-reservation', label: 'Stock Reservation', icon: SlidersHorizontal, disabled: false },
    { id: 'supply-rules', label: 'Supply Rules', icon: Layers, disabled: true },
    { id: 'order-tracking', label: 'Order Tracking', icon: PackageCheck, disabled: true },
    { id: 'global-inventory', label: 'Global Inventory', icon: Database, disabled: true },
  ];

  return (
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''} ${item.disabled ? 'disabled-item' : ''}`}
              onClick={() => !item.disabled && setActiveNav(item.id)}
              disabled={item.disabled}
              title={item.disabled ? "Feature coming soon" : item.label}
            >
              {isActive && <div className="active-indicator"></div>}
              <Icon size={18} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="user-guide-link" onClick={onOpenUserGuide}>
          <HelpCircle size={16} />
          <span>IIS App User Guide</span>
        </button>
      </div>
    </aside>
  );
}
