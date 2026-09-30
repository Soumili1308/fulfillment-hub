# Fulfillment Hub

Fulfillment Hub is a lightweight warehouse operations dashboard designed for XYZ's e-commerce fulfillment workflow.

The application addresses common fulfillment problems such as delayed orders, priority-order visibility, warehouse stock availability, missed courier pickups, and operational issues that can otherwise be handled informally and forgotten.

## Problem

XYZ currently manages fulfillment using spreadsheets and shared folders.

The workflow is:

Order Received → Processing → Picking → Packing → Staging → Shipping

The existing process makes it difficult to:

- See the current status of every order
- Identify delayed or high-priority orders quickly
- Know whether stock is available in the main warehouse
- Move stock from the secondary warehouse when required
- Track courier pickup status
- Record operational problems and follow them through resolution

## Solution

Fulfillment Hub provides a single operational dashboard where warehouse teams can monitor the fulfillment process and take action.

The prototype focuses on the most important operational problems rather than attempting to build a complete e-commerce platform.

## Main Features

### 1. Dashboard

Provides an operational overview including:

- Total orders
- Priority orders
- Delayed orders
- Open issues
- Warehouse stock alerts
- Current fulfillment workflow distribution

### 2. Order Management

Users can:

- Search orders
- Filter by priority and status
- View order details
- View customer, product and variant information
- Check fulfillment deadlines
- Track the fulfillment timeline
- Move an order through fulfillment stages

### 3. Inventory Management

The inventory module provides:

- Main warehouse stock
- Secondary warehouse stock
- Reorder levels
- Low-stock visibility
- Product and variant information
- Stock transfer from secondary warehouse to main warehouse

This is particularly important because orders can only ship from the main warehouse.

### 4. Shipment Management

The shipment module tracks:

- Courier
- Pickup time
- Shipment status
- Ready for pickup
- Picked up
- Missed pickup

A missed pickup can also generate an operational issue for follow-up.

### 5. Issue Management

The Issues module provides a structured place to record problems such as:

- Delayed orders
- Inventory shortages
- Wrong variants
- Missed pickups
- Misplaced packages

Issues can move through:

Open → Investigating → Resolved

Resolution notes can also be recorded.

### 6. Settings

The Settings page provides:

- Application information
- Demo-data information
- Local-storage information
- Reset Demo Data functionality

## Technology Stack

- React
- Vite
- JavaScript / JSX
- CSS
- Lucide React
- Browser localStorage

No real warehouse, store, payment or courier APIs are used.

The application uses dummy/sample data as required for the prototype.

## Data Persistence

Operational changes are stored in the browser using `localStorage`.

This allows changes made during a demonstration to remain after refreshing the page.

The Settings page contains a Reset Demo option to restore the original sample data.

## Project Structure

```text
fulfillment-hub/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── EmptyState.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   └── TableSkeleton.jsx
│   │
│   ├── data/
│   │   ├── inventory.js
│   │   ├── issues.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── shipments.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Inventory.jsx
│   │   ├── Issues.jsx
│   │   ├── OrderDetails.jsx
│   │   ├── Orders.jsx
│   │   ├── Settings.jsx
│   │   └── Shipments.jsx
│   │
│   ├── utils/
│   │   ├── fulfillment.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── README.md
└── AI_USAGE.md

## Installation

```bash
git clone https://github.com/Soumili1308/fulfillment-hub.git
cd fulfillment-hub
npm install

Start Development Server
npm run dev

Open the localhost URL displayed in the terminal.

Production Build
npm run build

Preview Production Build
npm run preview