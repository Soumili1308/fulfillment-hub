import React from "react";
import { Search, Bell, UserCircle } from "lucide-react";

function Navbar({ activePage }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <span>Operations</span>
        <h1>{activePage}</h1>
      </div>

      <div className="topbar-actions">
        <div className="system-status">
          <span className="system-status-dot" />
          System Operational
        </div>

        <div className="topbar-search">
          <Search size={16} />
          <input placeholder="Search..." />
        </div>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={17} />
        </button>

        <button className="profile-button" aria-label="Profile">
          <UserCircle size={21} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
