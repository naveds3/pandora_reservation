import React, { useState } from 'react';
import { Globe, Store, Package, Check, ArrowRight, ShieldCheck, CornerDownRight } from 'lucide-react';

const STORE_RESERVATION_OPTIONS = ["Null", ...Array.from({ length: 501 }, (_, i) => i)];

export default function ReservationHierarchyBar({
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
  skuOverridesCount
}) {
  const currentMarketReservation = marketReservations[selectedMarket] ?? 0;
  const currentStoreReservationKey = `${selectedMarket}-${selectedStore}`;
  const rawStoreReservation = storeReservations[currentStoreReservationKey];
  const currentStoreReservation = rawStoreReservation !== undefined && rawStoreReservation !== null ? `${rawStoreReservation} Qty` : "Null";

  const currentStoreNormalized =
    rawStoreReservation !== undefined && rawStoreReservation !== null
      ? String(rawStoreReservation)
      : "Null";

  const [marketInput, setMarketInput] = useState(currentMarketReservation);
  const [storeInput, setStoreInput] = useState(currentStoreNormalized);

  // Sync inputs when market or store changes
  React.useEffect(() => {
    setMarketInput(marketReservations[selectedMarket] ?? 0);
  }, [selectedMarket, marketReservations]);

  React.useEffect(() => {
    const val = storeReservations[`${selectedMarket}-${selectedStore}`];
    setStoreInput(val !== undefined && val !== null ? String(val) : "Null");
  }, [selectedMarket, selectedStore, storeReservations, marketReservations]);

  const isMarketChanged =
    marketInput !== "" &&
    !isNaN(Number(marketInput)) &&
    Number(marketInput) >= 0 &&
    Number(marketInput) !== currentMarketReservation;

  const isStoreChanged = String(storeInput) !== currentStoreNormalized;

  const handleApplyMarket = () => {
    if (!isMarketChanged) return;
    onUpdateMarketReservation(selectedMarket, Math.max(0, Number(marketInput)));
  };

  const handleApplyStore = () => {
    if (!isStoreChanged) return;
    if (storeInput === "Null" || storeInput === "NULL" || storeInput === null || storeInput === "") {
      onUpdateStoreReservation(selectedMarket, selectedStore, null);
    } else {
      onUpdateStoreReservation(selectedMarket, selectedStore, Number(storeInput));
    }
  };

  return (
    <div className="hierarchy-container fade-in">
      {/* Walk-in vs E-Com Business Logic Banner */}
      <div className="business-logic-banner">
        <div className="banner-left">
          <ShieldCheck size={20} className="banner-icon" />
          <div>
            <h4 className="banner-title">Store Walk-in Preference & Reservation Hierarchy</h4>
            <p className="banner-desc">
              Store walk-in customers are given <strong>1st priority</strong>. Stock up to the Reservation Quantity is protected for store sales. Inventory exceeding this amount is broadcast to the <strong>E-Commerce Website (OMS)</strong>.
            </p>
          </div>
        </div>
        <div className="priority-pills">
          <span className="priority-pill p1">P1: SKU Override</span>
          <ArrowRight size={12} />
          <span className="priority-pill p2">P2: Store Default</span>
          <ArrowRight size={12} />
          <span className="priority-pill p3">P3: Market Default</span>
        </div>
      </div>

      {/* 3 Level Reservation Cards */}
      <div className="hierarchy-cards-grid">
        {/* Level 1: Market Level */}
        <div className="hierarchy-card market-card">
          <div className="card-top">
            <div className="card-header-badge p3-badge">LEVEL 3 (BASE DEFAULT)</div>
            <div className="card-title-row">
              <Globe size={18} className="card-icon" />
              <h3>Market Level Reservation</h3>
            </div>
            <p className="card-subtext">Base reservation quantity applied across all stores & SKUs in the selected market.</p>
          </div>

          <div className="card-inputs-area">
            <div className="input-with-label">
              <label>Select Market:</label>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="select-field"
              >
                {marketsList.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name} ({m.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-with-label">
              <label>Market Reserve Qty:</label>
              <div className="qty-action-group">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={marketInput}
                  onChange={(e) => setMarketInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isMarketChanged) {
                      handleApplyMarket();
                    }
                  }}
                  className="qty-number-input"
                />
                <button
                  className={`btn-apply-level ${isMarketChanged ? 'is-active' : ''}`}
                  onClick={handleApplyMarket}
                  disabled={!isMarketChanged}
                  title={isMarketChanged ? `Apply Market reservation of ${marketInput} Qty` : "Change value to enable Apply"}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="card-footer-info">
            <CornerDownRight size={12} />
            <span>Active Default for <strong>{selectedMarket}</strong>: <strong>{currentMarketReservation} Qty</strong></span>
          </div>
        </div>

        {/* Level 2: Store Level */}
        <div className="hierarchy-card store-card">
          <div className="card-top">
            <div className="card-header-badge p2-badge">LEVEL 2 (STORE DEFAULT)</div>
            <div className="card-title-row">
              <Store size={18} className="card-icon" />
              <h3>Store Level Reservation</h3>
            </div>
            <p className="card-subtext">Overrides Market default for all SKUs within a specific store location.</p>
          </div>

          <div className="card-inputs-area">
            <div className="input-with-label">
              <label>Select Store:</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="select-field"
              >
                {storesList
                  .filter((s) => s.market === selectedMarket)
                  .map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="input-with-label">
              <label>Store Reserve Qty:</label>
              <div className="qty-action-group">
                <select
                  value={storeInput}
                  onChange={(e) => setStoreInput(e.target.value)}
                  className="select-field store-qty-select"
                >
                  {STORE_RESERVATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  className={`btn-apply-level ${isStoreChanged ? 'is-active' : ''}`}
                  onClick={handleApplyStore}
                  disabled={!isStoreChanged}
                  title={isStoreChanged ? `Apply Store reservation of ${storeInput}` : "Change value to enable Apply"}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="card-footer-info">
            <CornerDownRight size={12} />
            <span>
              Active Default for <strong>{selectedStore}</strong>:{' '}
              <strong>
                {rawStoreReservation !== undefined && rawStoreReservation !== null
                  ? `${rawStoreReservation} Qty`
                  : `Null (Inherits Market: ${currentMarketReservation} Qty)`}
              </strong>
            </span>
          </div>
        </div>

        {/* Level 3: SKU Level (Top Priority) */}
        <div className="hierarchy-card sku-card">
          <div className="card-top">
            <div className="card-header-badge p1-badge">LEVEL 1 (TOP PRIORITY)</div>
            <div className="card-title-row">
              <Package size={18} className="card-icon" />
              <h3>SKU Level Overrides</h3>
            </div>
            <p className="card-subtext">Highest priority. Explicit reservation overrides configured per product in table below.</p>
          </div>

          <div className="sku-summary-box">
            <div className="sku-count-circle">{skuOverridesCount}</div>
            <div className="sku-summary-text">
              <strong>Explicit SKU Overrides Active</strong>
              <span>Items without override inherit Store ({currentStoreReservation}) or Market ({currentMarketReservation}) default.</span>
            </div>
          </div>

          <div className="card-footer-info p1-footer">
            <Check size={12} />
            <span>Edit directly in the item table below</span>
          </div>
        </div>
      </div>
    </div>
  );
}
