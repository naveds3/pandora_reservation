import React from 'react';
import { X, BookOpen, Calculator, Layers, AlertCircle, ArrowRight, ShieldCheck, Globe, Store, Package } from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-lg fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-align">
            <BookOpen size={20} className="icon-accent" />
            <h3 className="modal-title">Pandora IIS Portal - 3-Level Reservation User Guide</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body user-guide-body">
          <div className="guide-intro">
            <h4>Store Walk-in Preference & E-Commerce Reservation Concept</h4>
            <p>
              In the Pandora IIS Portal, <strong>Store Walk-in Customers are given top preference</strong>.
              The Reservation Quantity protects in-store stock from being sold online. Inventory exceeding the reservation amount is allocated to the <strong>E-Commerce Website (OMS)</strong>.
            </p>
          </div>

          <div className="guide-grid">
            <div className="guide-card">
              <div className="guide-card-header">
                <Layers size={16} />
                <h5>3-Level Priority Hierarchy</h5>
              </div>
              <ul className="hierarchy-explain-list">
                <li>
                  <div className="level-badge-inline p1">Level 1: SKU Level (Top Priority)</div>
                  <p>Explicit reservation configured for a specific product item in the table. Overrides Store & Market defaults.</p>
                </li>
                <li>
                  <div className="level-badge-inline p2">Level 2: Store Level (Medium Priority)</div>
                  <p>Default reservation for a specific store (e.g., ST112001). Applies to all SKUs without a Level 1 SKU override.</p>
                </li>
                <li>
                  <div className="level-badge-inline p3">Level 3: Market Level (Base Default)</div>
                  <p>Broad market-wide default (e.g., Australia = 5). Applies to SKUs that do not have Level 1 or Level 2 rules set.</p>
                </li>
              </ul>
            </div>

            <div className="guide-card">
              <div className="guide-card-header">
                <Calculator size={16} />
                <h5>Inheritance & Priority Logic</h5>
              </div>
              <div className="formula-box">
                Effective Reservation = SKU Level ?? Store Level ?? Market Level
              </div>
              <p className="formula-note mt-2">
                <strong>Market Level Update Rule:</strong> When updating a Market Level reservation (e.g. set to "5"), it applies only to SKUs that do not have explicit Store or SKU level overrides. Existing overrides are preserved.
              </p>
              <div className="formula-box mt-2">
                Net Online (To OMS) = On Hand POS - Effective Reservation
              </div>
            </div>
          </div>

          <div className="guide-actions-info">
            <div className="info-box">
              <ShieldCheck size={18} className="info-icon" />
              <div>
                <strong>Active Global Markets:</strong>
                <p>Currently live for <strong>Australia</strong> and <strong>New Zealand</strong>. Additional global markets will be enabled progressively.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
