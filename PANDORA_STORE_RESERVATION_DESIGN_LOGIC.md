# PANDORA IIS Portal - Store Reservation System
## System Architecture, Business Logic & Technical Design Document

---

## 1. Executive Summary & Business Objectives

The **PANDORA Inventory Integration System (IIS) Portal** is an enterprise inventory management and stock reservation platform designed for retail operations specialists, store managers, and e-commerce inventory planners.

### Core Business Rule: Store Walk-in Customer Preference
- **Store Walk-in Preference**: In-store retail shoppers are given **1st priority** for inventory access.
- **Reservation Function**: The **Reservation Quantity** acts as a safety buffer protecting physical store stock from being oversold online.
- **E-Commerce Broadcast (OMS)**: Only stock *exceeding* the active reservation quantity is broadcast to the order management system (OMS) for website e-commerce buyers.

---

## 2. The 3-Level Stock Reservation Hierarchy

Reservation configuration operates on a strict **3-Level Priority Inheritance Hierarchy**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │ Level 1: SKU Level Override (P1 - Highest Priority)          │
 └──────────────────────────────┬──────────────────────────────┘
                                │ (if NULL / Not set)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Level 2: Store Level Default (P2 - Medium Priority)         │
 └──────────────────────────────┬──────────────────────────────┘
                                │ (if Not set)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Level 3: Market Level Default (P3 - Base Default)           │
 └──────────────────────────────┬──────────────────────────────┘
```

### Hierarchy Breakdown

| Level | Scope | Priority | Description & Behaviour |
| :--- | :--- | :--- | :--- |
| **Level 1: SKU Level** | Individual Product SKU | **P1 (Highest)** | Explicit quantity configured for a specific SKU in the item table. Overrides both Store and Market defaults. |
| **Level 2: Store Level** | Specific Store Location | **P2 (Medium)** | Default reservation set per store (e.g. `ST112001 - Sydney Flagship`). Applies to all SKUs in that store that do not have a Level 1 SKU override. |
| **Level 3: Market Level** | Entire Market Region | **P3 (Base)** | Market-wide base default (e.g. `Australia = 5`). Applies to SKUs that do not have Level 1 or Level 2 rules configured. |

### Market-Level Update Logic
> **Rule**: When an administrator updates a Market-Level reservation (e.g. sets `Australia` market default to `5`), it applies **only** to SKUs that do not have an explicit Store or SKU level reservation set. Existing Store and SKU overrides are preserved automatically.

---

## 3. Mathematical Calculations & Formulas

```
                                  LIVE POS FEED
                                 [ ON HAND (POS) ]
                                         │
                                         ├─── OPEN DEMAND (E-COM OPEN ORDER)
                                         │
                                         ▼
                               [ STORE AVAILABLE ]
                                         │
                                         ├─── RESERVATION CONFIG (QTY)
                                         │    (SKU Override ?? Store Default ?? Market Default)
                                         │
                                         ▼
                             [ NET ONLINE (TO OMS) ]
```

### Formula Definitions

1. **Store Available Stock**:
   $$\text{Store Available} = \max(0, \text{On Hand (POS)} - \text{Open Demand (E-Com Open Order)})$$

2. **Effective Reservation Quantity**:
   $$\text{Effective Qty} = \begin{cases} 
   \text{SKU Override}, & \text{if SKU Override } \neq \text{NULL} \\
   \text{Store Default}, & \text{else if Store Default exists} \\
   \text{Market Default}, & \text{otherwise}
   \end{cases}$$

3. **Net Online Broadcast (To OMS)**:
   $$\text{Net Online} = \max(0, \text{On Hand (POS)} - \text{Reservation Config (Effective Qty)})$$
   
   - Dedicated broadcast quantity sent to OMS representing stock available for online e-commerce sales after protecting the store reservation buffer.

---

## 4. UI/UX Design Specifications

### Header Component
- **Official Brand Logo**: Official high-resolution Pandora logo asset (38px height).
- **Portal Title**: Bold `IIS Portal` title (16px, 700 weight).
- **User Utilities**: Notification bell with unread badge (`3`) and User profile avatar (`NM` - Naved Siddiqui).

### Sidebar Navigation
- **Active Module**: `Stock Reservation` (Active state with signature Pandora red left border accent `#c9192e`).
- **Disabled Modules**: `Supply Rules`, `Order Tracking`, `Global Inventory` (Non-clickable state for phase 1 rollout).
- **Footer**: `IIS App User Guide` opening interactive calculations modal.

### Reservation Hierarchy Control Bar
Top interactive card section allowing instant management of the 3 levels:
- **Level 3 Card (Market Level)**: Select Market (e.g., Australia [Live], New Zealand [Live]) -> Set Market Reserve Qty -> Apply button.
- **Level 2 Card (Store Level)**: Select Store (e.g., ST112001) -> Set Store Reserve Qty -> Apply button.
- **Level 1 Card (SKU Overrides Summary)**: Displays count of active SKU overrides and instructions for table inline editing.

### Stock Table Layout & Column Alignment

| Column | Alignment | Header Text & Subtext | Component & Controls |
| :--- | :--- | :--- | :--- |
| **1. SKU** | Left | `SKU` | Bold SKU identifier + unsaved modification dot indicator |
| **2. PRODUCT NAME** | Left | `PRODUCT NAME` | Pandora product title (e.g. *Sparkling Heart Ring*) |
| **3. ON HAND (POS)** | Center | `ON HAND`<br>`(POS)` | Live store physical inventory count |
| **4. OPEN DEMAND** | Center | `OPEN DEMAND`<br>`(E-COM OPEN ORDER)` | Locked click & collect e-com orders |
| **5. STORE AVAILABLE** | Center | `STORE AVAILABLE` | Net store available units |
| **6. RESERVATION CONFIG** | Center | `RESERVATION CONFIG`<br>`(QTY)` | Select Dropdown: **`"NULL"`**, `0`, `1`, `2`, ..., `500` + Source Badge (`SKU Override`, `Inherited (Store: 3)`, `Inherited (Market: 5)`) |
| **7. NET ONLINE** | Center | `NET ONLINE`<br>`(TO OMS)` | Broadcasted stock count to web storefront |
| **8. ACTIONS** | Center | `ACTIONS` | Sequence: **`Save`** -> **`History`** -> **`Clear SKU Override`** (Reset icon) |

---

## 5. Technical Stack & Component Architecture

### Technologies Used
- **Framework**: React 19 + Vite 8
- **Icons**: Lucide React
- **Styling**: Modern CSS3 (CSS Variables, Flexbox, Grid, custom scrollbars)
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`)

### Component Directory Tree
```
src/
├── assets/
│   └── pandora-logo.png          # Official Pandora logo asset
├── components/
│   ├── Header.jsx                 # Top bar with logo & user utilities
│   ├── Sidebar.jsx                # Module navigation & user guide trigger
│   ├── ReservationHierarchyBar.jsx# 3-level control panel (Market, Store, SKU)
│   ├── StockTable.jsx             # Main data grid with inline select dropdowns
│   ├── HistoryModal.jsx           # Audit trail slide-over drawer
│   ├── ImportExportModal.jsx      # CSV export and batch import modal
│   ├── UserGuideModal.jsx         # Interactive stock formula guide
│   ├── NotificationsDropdown.jsx  # Notification flyout menu
│   └── SecondaryViews.jsx         # Views for non-active modules
├── data/
│   └── mockData.js                # Stock items, markets, stores & default settings
├── App.jsx                        # Master application state & orchestration
├── App.css                        # Design system & responsive layout styles
├── index.css                      # Base reset & typography rules
└── main.jsx                       # Entry point
```

---

## 6. How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev -- --host
   ```
   Access in browser: `http://localhost:5173/` or network IP `http://192.168.1.54:5173/`

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```
