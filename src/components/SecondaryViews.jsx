import React from 'react';
import { Layers, PackageCheck, Database, Sliders, ShieldCheck, Globe, RefreshCw } from 'lucide-react';

export function SupplyRulesView() {
  return (
    <div className="stock-view-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Supply Rules & Allocation Policies</h1>
      </div>

      <div className="rules-grid">
        <div className="rule-card">
          <div className="rule-card-header">
            <Sliders size={20} className="icon-accent" />
            <h3>Default Safety Reserve Rule</h3>
          </div>
          <p className="rule-desc">Automatically reserve a minimum buffer of stock for high-demand ring and charm categories prior to broadcasting OMS availability.</p>
          <div className="rule-inputs">
            <label>Minimum Store Safety Stock (%):</label>
            <input type="number" defaultValue={10} className="input-field" />
          </div>
          <button className="btn btn-save active-save mt-3">Update Supply Rule</button>
        </div>

        <div className="rule-card">
          <div className="rule-card-header">
            <ShieldCheck size={20} className="icon-accent" />
            <h3>Peak Season Reservation Guard</h3>
          </div>
          <p className="rule-desc">Enforce hard cap limits on online order fulfillment from boutique retail locations during holiday flash sales.</p>
          <div className="rule-inputs">
            <label>Max E-Com Allocation Cap (Units):</label>
            <input type="number" defaultValue={50} className="input-field" />
          </div>
          <button className="btn btn-save active-save mt-3">Enable Guard Policy</button>
        </div>
      </div>
    </div>
  );
}

export function OrderTrackingView() {
  return (
    <div className="stock-view-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Order Tracking & OMS Fulfillment</h1>
      </div>

      <div className="table-card">
        <table className="pandora-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>SKU</th>
              <th>RESERVED QTY</th>
              <th>STORE ID</th>
              <th>STATUS</th>
              <th>TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ORD-2026-9812</strong></td>
              <td>186251CZ-54</td>
              <td>2 units</td>
              <td>ST112001</td>
              <td><span className="badge badge-success">OMS Confirmed</span></td>
              <td>2026-10-06 13:10</td>
            </tr>
            <tr>
              <td><strong>ORD-2026-9813</strong></td>
              <td>167699-48</td>
              <td>1 unit</td>
              <td>ST112001</td>
              <td><span className="badge badge-pending">Pending Dispatch</span></td>
              <td>2026-10-06 12:45</td>
            </tr>
            <tr>
              <td><strong>ORD-2026-9814</strong></td>
              <td>150115D-50</td>
              <td>3 units</td>
              <td>ST112001</td>
              <td><span className="badge badge-success">OMS Confirmed</span></td>
              <td>2026-10-06 11:30</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function GlobalInventoryView() {
  return (
    <div className="stock-view-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Global Inventory Overview</h1>
      </div>

      <div className="global-stats-row">
        <div className="stat-box">
          <Globe size={24} className="stat-icon" />
          <div>
            <span className="stat-title">Active Global Markets</span>
            <h2 className="stat-value">6 Regions</h2>
          </div>
        </div>
        <div className="stat-box">
          <Database size={24} className="stat-icon" />
          <div>
            <span className="stat-title">Total Reserved Stock</span>
            <h2 className="stat-value">48,290 Units</h2>
          </div>
        </div>
        <div className="stat-box">
          <RefreshCw size={24} className="stat-icon" />
          <div>
            <span className="stat-title">OMS Sync Uptime</span>
            <h2 className="stat-value">99.98%</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
