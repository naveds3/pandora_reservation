import React from 'react';
import { X, Clock, User, CheckCircle2, RefreshCw } from 'lucide-react';

export default function HistoryModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-drawer slide-in-right" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="drawer-subtitle">AUDIT TRAIL</span>
            <h3 className="drawer-title">{item.productName}</h3>
            <span className="drawer-sku">SKU: {item.sku}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="current-stats-summary">
            <div className="stat-card">
              <span className="stat-label">On Hand (POS)</span>
              <span className="stat-val">{item.onHandPos}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Reserved E-Com</span>
              <span className="stat-val">{item.reservedEcom}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Config Qty</span>
              <span className="stat-val highlight">{item.reservationConfigQty}</span>
            </div>
          </div>

          <h4 className="timeline-title">Change History Log</h4>
          <div className="timeline-list">
            {item.history && item.history.map((log, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">
                  <Clock size={14} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-top">
                    <span className="timeline-action">{log.action}</span>
                    <span className="timeline-status-badge">{log.status}</span>
                  </div>
                  <div className="timeline-meta">
                    <span className="timeline-user">
                      <User size={12} /> {log.user}
                    </span>
                    <span className="timeline-time">{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close History
          </button>
        </div>
      </div>
    </div>
  );
}
