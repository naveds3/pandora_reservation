import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

export default function ImportExportModal({ isOpen, onClose, stockData, onImportData, showToast }) {
  const [activeTab, setActiveTab] = useState('export');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const headers = ["SKU", "Product Name", "On Hand (POS)", "Reserved Against E-Com Order", "Store Available", "Reservation Config (Qty)", "Market", "Store"];
    const rows = stockData.map(item => [
      item.sku,
      `"${item.productName}"`,
      item.onHandPos,
      item.reservedEcom,
      Math.max(0, item.onHandPos - item.reservedEcom),
      item.reservationConfigQty,
      item.market,
      item.store
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Pandora_Stock_Reservation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Export completed successfully! CSV downloaded.", "success");
    onClose();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSimulatedImport = () => {
    if (!uploadedFile) return;
    showToast(`Successfully imported ${uploadedFile.name}! 15 items updated.`, "success");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Batch Import / Export Stock Rules</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <Download size={15} /> Export Inventory CSV
          </button>
          <button 
            className={`modal-tab ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <Upload size={15} /> Batch Import Configs
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'export' ? (
            <div className="export-section">
              <div className="export-preview">
                <FileSpreadsheet size={40} className="icon-accent" />
                <h4>Export Active Reservation Data</h4>
                <p>Download a structured CSV spreadsheet containing all current item stock metrics, POS allocations, and reservation configs for <strong>Australia - Store ST112001</strong>.</p>
                <div className="export-stats">
                  <span>Total Items: <strong>{stockData.length} SKUs</strong></span>
                  <span>Format: <strong>CSV / Excel Compatible</strong></span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleExportCSV}>
                  <Download size={15} /> Download CSV File
                </button>
              </div>
            </div>
          ) : (
            <div className="import-section">
              <div 
                className={`drag-drop-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload size={32} className="drag-icon" />
                <p className="drag-primary-text">
                  {uploadedFile ? uploadedFile.name : "Drag & drop CSV file here, or click to browse"}
                </p>
                <p className="drag-sub-text">Supports .CSV, .XLSX files up to 10MB</p>
                <input 
                  type="file" 
                  accept=".csv,.xlsx" 
                  className="hidden-file-input"
                  onChange={(e) => e.target.files[0] && setUploadedFile(e.target.files[0])}
                />
              </div>

              {uploadedFile && (
                <div className="file-info-bar">
                  <FileSpreadsheet size={16} />
                  <span className="file-name">{uploadedFile.name}</span>
                  <span className="file-size">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button 
                  className="btn btn-primary" 
                  disabled={!uploadedFile}
                  onClick={handleSimulatedImport}
                >
                  <Upload size={15} /> Process Import
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
