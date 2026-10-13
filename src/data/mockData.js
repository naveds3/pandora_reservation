export const marketsList = [
  { code: "Australia", name: "Australia", status: "Live", isLive: true },
  { code: "New Zealand", name: "New Zealand", status: "Live", isLive: true },
  { code: "United States", name: "United States", status: "Upcoming", isLive: false },
  { code: "United Kingdom", name: "United Kingdom", status: "Upcoming", isLive: false },
  { code: "Germany", name: "Germany", status: "Upcoming", isLive: false }
];

export const storesList = [
  { code: "ST112001", name: "Sydney Flagship (ST112001)", market: "Australia" },
  { code: "ST112002", name: "Melbourne Central (ST112002)", market: "Australia" },
  { code: "ST113001", name: "Auckland Queen St (ST113001)", market: "New Zealand" },
  { code: "ST113002", name: "Wellington CBD (ST113002)", market: "New Zealand" }
];

export const initialMarketReservations = {
  "Australia": 5,
  "New Zealand": 4
};

export const initialStoreReservations = {
  "Australia-ST112001": 3,
  "Australia-ST112002": 2,
  "New Zealand-ST113001": 4
};

// Initial stock data with some explicitly set SKU overrides, and some inheriting from Store/Market level!
export const initialStockData = [
  {
    id: 1,
    sku: "186251CZ-54",
    productName: "Sparkling Heart Ring",
    onHandPos: 30,
    reservedEcom: 5,
    skuReservationQty: 3, // Explicit SKU override
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-06 11:42",
    updatedBy: "Naved Siddiqui",
    history: [
      { timestamp: "2026-10-06 11:42", user: "Naved Siddiqui", action: "SKU Override set to 3", status: "OMS Synced" },
      { timestamp: "2026-10-05 16:15", user: "System Batch", action: "POS Sync On Hand: 30", status: "Completed" }
    ]
  },
  {
    id: 2,
    sku: "186251CZ-56",
    productName: "Classic Band Ring",
    onHandPos: 2,
    reservedEcom: 0,
    skuReservationQty: null, // Inherits from Store/Market level!
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-06 08:30",
    updatedBy: "System Sync",
    history: [
      { timestamp: "2026-10-06 08:30", user: "System Sync", action: "Inheriting Store Default (3)", status: "Active" }
    ]
  },
  {
    id: 3,
    sku: "167699-48",
    productName: "Silver Charm Bracelet",
    onHandPos: 5,
    reservedEcom: 5,
    skuReservationQty: 6, // Explicit SKU override
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-05 14:20",
    updatedBy: "Naved Siddiqui",
    history: [
      { timestamp: "2026-10-05 14:20", user: "Naved Siddiqui", action: "SKU Override set to 6", status: "OMS Synced" }
    ]
  },
  {
    id: 4,
    sku: "150115D-50",
    productName: "Gold Pendant Necklace",
    onHandPos: 15,
    reservedEcom: 2,
    skuReservationQty: null, // Inherits from Store/Market level
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-06 10:10",
    updatedBy: "System",
    history: [
      { timestamp: "2026-10-06 10:10", user: "System", action: "Inheriting Store Default (3)", status: "Active" }
    ]
  },
  {
    id: 5,
    sku: "150115D-50",
    productName: "Pearl Drop Earrings",
    onHandPos: 8,
    reservedEcom: 1,
    skuReservationQty: 1, // Explicit SKU override
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-05 17:45",
    updatedBy: "Naved Siddiqui",
    history: [
      { timestamp: "2026-10-05 17:45", user: "Naved Siddiqui", action: "SKU Override set to 1", status: "OMS Synced" }
    ]
  },
  {
    id: 6,
    sku: "180986CZ-48",
    productName: "Celestial Star Studs",
    onHandPos: 45,
    reservedEcom: 10,
    skuReservationQty: 2, // Explicit SKU override
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-06 09:00",
    updatedBy: "System Sync",
    history: [
      { timestamp: "2026-10-06 09:00", user: "System Sync", action: "SKU Override set to 2", status: "Completed" }
    ]
  },
  {
    id: 7,
    sku: "167158CZ-56",
    productName: "Infinity Knot Ring",
    onHandPos: 0,
    reservedEcom: 0,
    skuReservationQty: 10, // Explicit SKU override
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-04 11:20",
    updatedBy: "Mark Taylor",
    history: [
      { timestamp: "2026-10-04 11:20", user: "Mark Taylor", action: "SKU Override set to 10", status: "OMS Synced" }
    ]
  },
  {
    id: 8,
    sku: "167379-56",
    productName: "Woven Leather Wrap",
    onHandPos: 12,
    reservedEcom: 3,
    skuReservationQty: null, // Inheriting Store Default
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-06 07:15",
    updatedBy: "System",
    history: [
      { timestamp: "2026-10-06 07:15", user: "System", action: "Inheriting Store Default (3)", status: "Active" }
    ]
  },
  {
    id: 9,
    sku: "156238-48",
    productName: "Vintage Safety Chain",
    onHandPos: 20,
    reservedEcom: 4,
    skuReservationQty: 0, // Explicit SKU override to 0
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-03 15:50",
    updatedBy: "Naved Siddiqui",
    history: [
      { timestamp: "2026-10-03 15:50", user: "Naved Siddiqui", action: "Explicit 0 reservation override", status: "Completed" }
    ]
  },
  {
    id: 10,
    sku: "198421CZ-52",
    productName: "Herbarium Cluster Ring",
    onHandPos: 18,
    reservedEcom: 2,
    skuReservationQty: null, // Inherits Store Default
    market: "Australia",
    store: "ST112001",
    lastUpdated: "2026-10-06 12:00",
    updatedBy: "System",
    history: [
      { timestamp: "2026-10-06 12:00", user: "System", action: "Inheriting Store Default (3)", status: "Active" }
    ]
  },

  // New Zealand store items
  {
    id: 11,
    sku: "186251CZ-54",
    productName: "Sparkling Heart Ring",
    onHandPos: 22,
    reservedEcom: 3,
    skuReservationQty: null, // Inherits Store Default (4)
    market: "New Zealand",
    store: "ST113001",
    lastUpdated: "2026-10-06 09:30",
    updatedBy: "System",
    history: [
      { timestamp: "2026-10-06 09:30", user: "System", action: "Inheriting Store Default (4)", status: "Active" }
    ]
  },
  {
    id: 12,
    sku: "190986CZ-50",
    productName: "Sparkling Tennis Bracelet",
    onHandPos: 14,
    reservedEcom: 2,
    skuReservationQty: 8, // Explicit SKU override
    market: "New Zealand",
    store: "ST113001",
    lastUpdated: "2026-10-06 11:00",
    updatedBy: "Kiwi Operations",
    history: [
      { timestamp: "2026-10-06 11:00", user: "Kiwi Operations", action: "SKU Override set to 8", status: "OMS Synced" }
    ]
  }
];
