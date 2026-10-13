import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StockTable from './components/StockTable';
import HistoryModal from './components/HistoryModal';
import ImportExportModal from './components/ImportExportModal';
import UserGuideModal from './components/UserGuideModal';
import NotificationsDropdown from './components/NotificationsDropdown';
import { SupplyRulesView, OrderTrackingView, GlobalInventoryView } from './components/SecondaryViews';
import { initialStockData, marketsList, storesList, initialMarketReservations, initialStoreReservations } from './data/mockData';
import { CheckCircle2, Info } from 'lucide-react';
import './App.css';

export default function App() {
  const [stockData, setStockData] = useState(initialStockData);
  const [marketReservations, setMarketReservations] = useState(initialMarketReservations);
  const [storeReservations, setStoreReservations] = useState(initialStoreReservations);
  const [modifiedRows, setModifiedRows] = useState({});
  const [activeNav, setActiveNav] = useState('stock-reservation');
  const [selectedMarket, setSelectedMarket] = useState('Australia');
  const [selectedStore, setSelectedStore] = useState('ST112001');

  // Automatically update selectedStore when selectedMarket changes
  const handleMarketChange = (newMarket) => {
    setSelectedMarket(newMarket);
    const matchingStores = storesList.filter((s) => s.market === newMarket);
    if (matchingStores.length > 0) {
      setSelectedStore(matchingStores[0].code);
    }
  };

  // Guard useEffect to ensure selected store always matches selected market
  React.useEffect(() => {
    const storeBelongsToMarket = storesList.some(
      (s) => s.code === selectedStore && s.market === selectedMarket
    );
    if (!storeBelongsToMarket) {
      const firstStore = storesList.find((s) => s.market === selectedMarket);
      if (firstStore) {
        setSelectedStore(firstStore.code);
      }
    }
  }, [selectedMarket, selectedStore]);

  // Modals & Drawers
  const [historyModalItem, setHistoryModalItem] = useState(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Market Reservation Set',
      message: 'Australia market-level default set to 5 Qty.',
      time: '15 mins ago'
    },
    {
      id: 2,
      type: 'success',
      title: 'POS Stock Sync',
      message: 'Store ST112001 inventory synchronized.',
      time: '30 mins ago'
    }
  ]);

  // Toast System state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Update Market Level Reservation (Level 3 - Base Default)
  const handleUpdateMarketReservation = (marketCode, newQty) => {
    setMarketReservations((prev) => ({
      ...prev,
      [marketCode]: Math.max(0, newQty)
    }));
    showToast(`Market Level Reservation for ${marketCode} updated to ${newQty}. (Applies to SKUs without store/SKU overrides)`, 'info');

    setNotifications((prev) => [
      {
        id: Date.now(),
        type: 'info',
        title: 'Market Level Updated',
        message: `${marketCode} market default set to ${newQty} Qty. Preserved explicit SKU/Store overrides.`,
        time: 'Just now'
      },
      ...prev
    ]);
  };

  // Update Store Level Reservation (Level 2 - Store Default)
  const handleUpdateStoreReservation = (marketCode, storeCode, newQty) => {
    const storeKey = `${marketCode}-${storeCode}`;
    const parsedQty = (newQty === null || newQty === "Null" || newQty === "NULL" || newQty === undefined)
      ? null
      : Math.max(0, Number(newQty));

    setStoreReservations((prev) => ({
      ...prev,
      [storeKey]: parsedQty
    }));

    const displayVal = parsedQty === null ? 'Null (Inherits Market Default)' : `${parsedQty} Qty`;
    showToast(`Store Level Reservation for ${storeCode} updated to ${displayVal}.`, 'info');

    setNotifications((prev) => [
      {
        id: Date.now(),
        type: 'info',
        title: 'Store Level Updated',
        message: `${storeCode} store default set to ${displayVal}.`,
        time: 'Just now'
      },
      ...prev
    ]);
  };

  // Handle Qty edit in table
  const handleQtyChange = (id, newQty) => {
    const targetItem = stockData.find((item) => item.id === id);
    const parsedQty = newQty === null ? null : Math.max(0, newQty);
    const originalQty = targetItem ? (targetItem.skuReservationQty ?? null) : null;

    setModifiedRows((prev) => {
      if (parsedQty === originalQty) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: parsedQty
      };
    });
  };

  // Save single row (creates Level 1 SKU Override)
  const handleSaveRow = (id) => {
    if (modifiedRows[id] === undefined) return;
    const targetItem = stockData.find((item) => item.id === id);
    if (!targetItem) return;

    const newQty = modifiedRows[id];
    const oldQty = targetItem.skuReservationQty ?? 'Inherited';

    const updatedData = stockData.map((item) => {
      if (item.id === id) {
        const newHistory = [
          {
            timestamp: new Date().toLocaleString(),
            user: "Naved Siddiqui",
            action: `SKU Level Override updated from ${oldQty} to ${newQty}`,
            status: "OMS Synced"
          },
          ...(item.history || [])
        ];
        return {
          ...item,
          skuReservationQty: newQty,
          lastUpdated: new Date().toLocaleString(),
          updatedBy: "Naved Siddiqui",
          history: newHistory
        };
      }
      return item;
    });

    setStockData(updatedData);

    setModifiedRows((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    showToast(`Saved SKU ${targetItem.sku}: Explicit SKU Override set to ${newQty}`, 'success');
  };

  // Reset explicit SKU override so item inherits Store/Market level default!
  const handleResetSkuOverride = (id) => {
    const targetItem = stockData.find((item) => item.id === id);
    if (!targetItem) return;

    const updatedData = stockData.map((item) => {
      if (item.id === id) {
        const newHistory = [
          {
            timestamp: new Date().toLocaleString(),
            user: "Naved Siddiqui",
            action: `SKU Override cleared. Reverted to Store/Market default.`,
            status: "Inherited"
          },
          ...(item.history || [])
        ];
        return {
          ...item,
          skuReservationQty: null, // Clear override
          lastUpdated: new Date().toLocaleString(),
          updatedBy: "Naved Siddiqui",
          history: newHistory
        };
      }
      return item;
    });

    setStockData(updatedData);
    setModifiedRows((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    showToast(`Cleared SKU Override for ${targetItem.sku}. Reverted to Store/Market default.`, 'info');
  };

  // Save All
  const handleSaveAll = () => {
    const modifiedIds = Object.keys(modifiedRows);
    if (modifiedIds.length === 0) {
      showToast('No unsaved SKU changes to commit.', 'info');
      return;
    }

    const updatedData = stockData.map((item) => {
      if (modifiedRows[item.id] !== undefined) {
        const newQty = modifiedRows[item.id];
        const newHistory = [
          {
            timestamp: new Date().toLocaleString(),
            user: "Naved Siddiqui",
            action: `Batch Save: SKU Override set to ${newQty}`,
            status: "OMS Synced"
          },
          ...(item.history || [])
        ];
        return {
          ...item,
          skuReservationQty: newQty,
          lastUpdated: new Date().toLocaleString(),
          updatedBy: "Naved Siddiqui",
          history: newHistory
        };
      }
      return item;
    });

    setStockData(updatedData);
    setModifiedRows({});

    showToast(`Committed ${modifiedIds.length} SKU level reservation overrides to OMS.`, 'success');
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header 
        onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        unreadCount={notifications.length}
      />

      <div className="app-body">
        {/* Left Sidebar */}
        <Sidebar 
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
        />

        {/* Main Viewport Content */}
        <main className="main-viewport">
          {activeNav === 'stock-reservation' && (
            <StockTable
              stockData={stockData}
              onSaveRow={handleSaveRow}
              onSaveAll={handleSaveAll}
              onOpenHistory={(item) => setHistoryModalItem(item)}
              onOpenImportExport={() => setIsImportExportOpen(true)}
              selectedMarket={selectedMarket}
              setSelectedMarket={handleMarketChange}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              marketsList={marketsList}
              storesList={storesList}
              marketReservations={marketReservations}
              onUpdateMarketReservation={handleUpdateMarketReservation}
              storeReservations={storeReservations}
              onUpdateStoreReservation={handleUpdateStoreReservation}
              modifiedRows={modifiedRows}
              onQtyChange={handleQtyChange}
              onResetSkuOverride={handleResetSkuOverride}
            />
          )}

          {activeNav === 'supply-rules' && <SupplyRulesView />}
          {activeNav === 'order-tracking' && <OrderTrackingView />}
          {activeNav === 'global-inventory' && <GlobalInventoryView />}
        </main>
      </div>

      {/* Modals & Slide-out Drawers */}
      {historyModalItem && (
        <HistoryModal 
          item={historyModalItem} 
          onClose={() => setHistoryModalItem(null)} 
        />
      )}

      <ImportExportModal 
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        stockData={stockData}
        showToast={showToast}
      />

      <UserGuideModal 
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />

      <NotificationsDropdown 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearAll={() => setNotifications([])}
      />

      {/* Floating Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type} fade-in`}>
            <CheckCircle2 size={16} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
