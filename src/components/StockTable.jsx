import React, { useState } from 'react';
import { Search, ChevronDown, Upload, Save, History, Check, ChevronLeft, ChevronRight, RotateCcw, ShieldAlert, ArrowUpRight } from 'lucide-react';
import ReservationHierarchyBar from './ReservationHierarchyBar';

// Dropdown options array: "NULL", 0, 1, 2, ..., 500
const RESERVATION_QTY_OPTIONS = ["NULL", ...Array.from({ length: 501 }, (_, i) => i)];

export default function StockTable({
  stockData,
  onSaveRow,
  onSaveAll,
  onOpenHistory,
  onOpenImportExport,
  selectedMarket,
  setSelectedMarket,
  selectedStore,
  setSelectedStore,
  marketsList,
  storesList,
  marketReservations,
  onUpdateMarketReservation,
  storeReservations,
  onUpdateStoreReservation,
  modifiedRows,
  onQtyChange,
  onResetSkuOverride
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('item-level');
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter items based on search term, market, store
  const filteredData = stockData.filter(item => {
    const matchesSearch = item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarket = selectedMarket ? item.market === selectedMarket : true;
    const matchesStore = selectedStore ? item.store === selectedStore : true;
    return matchesSearch && matchesMarket && matchesStore;
  });

  // Calculate count of explicit SKU overrides
  const skuOverridesCount = stockData.filter(item => item.skuReservationQty !== null && item.skuReservationQty !== undefined).length;

  const totalCount = 7505;
  const hasModifiedRows = Object.keys(modifiedRows).length > 0;

  // Helper to compute effective reservation quantity & source priority
  const getEffectiveReservation = (item) => {
    // Check pending modified edit first
    if (modifiedRows[item.id] !== undefined) {
      const pendingVal = modifiedRows[item.id];
      if (pendingVal === null || pendingVal === '') {
        // Clearing override -> fallback to store/market
        const storeKey = `${item.market}-${item.store}`;
        if (storeReservations[storeKey] !== undefined && storeReservations[storeKey] !== null) {
          return { qty: storeReservations[storeKey], source: `Inherited (Store Default: ${storeReservations[storeKey]})`, level: 'store', isPending: true };
        }
        const mktVal = marketReservations[item.market] ?? 0;
        return { qty: mktVal, source: `Inherited (Market Default: ${mktVal})`, level: 'market', isPending: true };
      }
      return { qty: Number(pendingVal), source: 'Pending SKU Override', level: 'sku', isPending: true };
    }

    // Check explicit SKU override in item data
    if (item.skuReservationQty !== null && item.skuReservationQty !== undefined) {
      return { qty: Number(item.skuReservationQty), source: 'SKU Level Override', level: 'sku', isPending: false };
    }

    // Check Store Level
    const storeKey = `${item.market}-${item.store}`;
    if (storeReservations[storeKey] !== undefined && storeReservations[storeKey] !== null) {
      return { qty: Number(storeReservations[storeKey]), source: `Inherited (Store Default: ${storeReservations[storeKey]})`, level: 'store', isPending: false };
    }

    // Check Market Level
    if (marketReservations[item.market] !== undefined && marketReservations[item.market] !== null) {
      return { qty: Number(marketReservations[item.market]), source: `Inherited (Market Default: ${marketReservations[item.market]})`, level: 'market', isPending: false };
    }

    return { qty: 0, source: 'System Default (0)', level: 'default', isPending: false };
  };

  return (
    <div className="stock-view-container">
      {/* Page Title & Subtitle */}
      <div className="page-header">
        <h1 className="page-title">Store Reservation</h1>
        <p className="page-subtitle">
          Manage inventory allocation between <strong>Store Walk-in Customers</strong> and <strong>E-Commerce Website (OMS)</strong>.
        </p>
      </div>

      {/* 3 Level Reservation Hierarchy Control Panel */}
      <ReservationHierarchyBar
        selectedMarket={selectedMarket}
        setSelectedMarket={setSelectedMarket}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        marketsList={marketsList}
        storesList={storesList}
        marketReservations={marketReservations}
        onUpdateMarketReservation={onUpdateMarketReservation}
        storeReservations={storeReservations}
        onUpdateStoreReservation={onUpdateStoreReservation}
        skuOverridesCount={skuOverridesCount}
      />

      {/* Tabs */}
      <div className="tab-container mt-4">
        <button 
          className={`tab-item ${activeTab === 'item-level' ? 'active' : ''}`}
          onClick={() => setActiveTab('item-level')}
        >
          Item Level ({totalCount})
        </button>
      </div>

      {/* Controls & Filter Toolbar */}
      <div className="toolbar-container">
        <div className="toolbar-left">
          {/* Search SKU */}
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Market Dropdown */}
          <div className="filter-group">
            <span className="filter-label">Market:</span>
            <div className="select-wrapper">
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="filter-select"
              >
                {marketsList.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name} {m.isLive ? '(Live)' : '(Upcoming)'}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>

          {/* Store Dropdown */}
          <div className="filter-group">
            <span className="filter-label">Store:</span>
            <div className="select-wrapper">
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="filter-select"
              >
                {storesList
                  .filter((s) => s.market === selectedMarket)
                  .map((s) => (
                    <option key={s.code} value={s.code}>{s.code}</option>
                  ))}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
        </div>

        <div className="toolbar-right">
          {/* Import / Export Button */}
          <button 
            className="btn btn-outline-gray"
            onClick={onOpenImportExport}
          >
            <Upload size={14} />
            <span>IMPORT / EXPORT</span>
          </button>

          {/* SAVE ALL Button */}
          <button 
            className={`btn btn-save-all ${hasModifiedRows ? 'has-unsaved' : ''}`}
            onClick={onSaveAll}
            disabled={!hasModifiedRows}
            title={hasModifiedRows ? `Save all (${Object.keys(modifiedRows).length}) pending changes` : "No pending changes to save"}
          >
            <span>SAVE ALL</span>
            {hasModifiedRows && <span className="unsaved-badge">{Object.keys(modifiedRows).length}</span>}
          </button>
        </div>
      </div>

      {/* Main Stock Data Table Card */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="pandora-table">
            <thead>
              <tr>
                <th className="col-sku">SKU</th>
                <th className="col-product">PRODUCT NAME</th>
                <th className="col-pos text-center">
                  ON HAND
                  <br />
                  <span className="th-subtext">(POS)</span>
                </th>
                <th className="col-reserved text-center">
                  OPEN DEMAND
                  <br />
                  <span className="th-subtext">(E-COM OPEN ORDER)</span>
                </th>
                <th className="col-avail text-center">STORE AVAILABLE</th>
                <th className="col-config text-center">
                  RESERVATION CONFIG
                  <br />
                  <span className="th-subtext">(QTY)</span>
                </th>
                <th className="col-net text-center">
                  NET ONLINE
                  <br />
                  <span className="th-subtext">(TO OMS)</span>
                </th>
                <th className="col-actions text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state-cell">
                    No matching inventory items found for "{searchTerm}" in {selectedMarket} / {selectedStore}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const effective = getEffectiveReservation(item);
                  const isModified = modifiedRows[item.id] !== undefined;

                  // Store Available = On Hand POS - Reserved E-Com Order
                  const storeAvailable = Math.max(0, item.onHandPos - item.reservedEcom);

                  // Net Online broadcasted to OMS:
                  // NET ONLINE = [ON HAND] - [RESERVATION CONFIG]
                  const netOnline = Math.max(0, item.onHandPos - effective.qty);

                  return (
                    <tr key={item.id} className={isModified ? 'row-modified' : ''}>
                      <td className="sku-cell">
                        <div className="sku-inner">
                          <span>{item.sku}</span>
                          {isModified && <span className="modified-dot" title="Unsaved modification"></span>}
                        </div>
                      </td>

                      <td className="product-name-cell">{item.productName}</td>
                      <td className="text-center pos-onhand-cell">{item.onHandPos}</td>
                      <td className="text-center reserved-cell">{item.reservedEcom}</td>
                      <td className="text-center store-avail-cell">{storeAvailable}</td>

                      {/* Reservation Config Input & Priority Source Badge */}
                      <td className="text-center config-qty-cell">
                        <div className="qty-with-source">
                          {(() => {
                            const dropdownValue = isModified
                              ? (modifiedRows[item.id] === null ? "NULL" : String(modifiedRows[item.id]))
                              : (item.skuReservationQty !== null && item.skuReservationQty !== undefined ? String(item.skuReservationQty) : "NULL");

                            return (
                              <select
                                value={dropdownValue}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "NULL") {
                                    onQtyChange(item.id, null);
                                  } else {
                                    onQtyChange(item.id, parseInt(val, 10));
                                  }
                                }}
                                className={`qty-select ${isModified ? 'qty-dirty' : ''}`}
                                title="Select reservation quantity or NULL to inherit default"
                              >
                                {RESERVATION_QTY_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            );
                          })()}
                          <div className={`source-badge badge-${effective.level}`}>
                            {effective.source}
                          </div>
                        </div>
                      </td>

                      {/* Net Online (To OMS) */}
                      <td className="text-center net-online-cell">
                        <div className="net-online-inner">
                          <span className="net-online-val">{netOnline}</span>
                          <span className="oms-label">Broadcast to Website</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="text-center actions-cell">
                        <div className="action-buttons-group">
                          <button
                            className={`btn btn-save ${isModified ? 'active-save' : ''}`}
                            onClick={() => onSaveRow(item.id)}
                            disabled={!isModified}
                            title={isModified ? "Save changes to SKU reservation" : "Change Reservation Config to enable Save"}
                          >
                            Save
                          </button>

                          <button
                            className="btn btn-history"
                            onClick={() => onOpenHistory(item)}
                            title="View audit history"
                          >
                            History
                          </button>

                          {item.skuReservationQty !== null && item.skuReservationQty !== undefined ? (
                            <button
                              className="btn btn-reset-override"
                              onClick={() => onResetSkuOverride(item.id)}
                              title="Clear SKU override to inherit Store/Market default"
                            >
                              <RotateCcw size={12} />
                            </button>
                          ) : (
                            <div className="btn-reset-placeholder"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="table-footer">
          <div className="pagination-rows-select">
            <span>Rows per page:</span>
            <div className="select-wrapper inline-select">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="footer-select"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>

          <div className="pagination-info">
            <span>1-20 of {totalCount}</span>
            <div className="pagination-arrows">
              <button 
                className="arrow-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="arrow-btn"
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
