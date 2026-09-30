import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Truck,
  AlertTriangle,
  Settings,
  Warehouse,
} from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Inventory", icon: Boxes },
  { label: "Shipments", icon: Truck },
  { label: "Issues", icon: AlertTriangle },
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Warehouse size={18} /></div>
        <div>
          <strong>FULFILLHUB</strong>
          <span>XYZ Operations</span>
        </div>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {items.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`sidebar-item ${activePage === label ? "active" : ""}`}
            onClick={() => setActivePage(label)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          className={`sidebar-item ${activePage === "Settings" ? "active" : ""}`}
          onClick={() => setActivePage("Settings")}
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>

        <div className="sidebar-user">
          <div className="avatar">XO</div>
          <div>
            <strong>XYZ Operations</strong>
            <span>Warehouse Team</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
