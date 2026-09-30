import React from "react";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Shipments from "./pages/Shipments";
import Issues from "./pages/Issues";
import Settings from "./pages/Settings";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Orders":
        return <Orders />;
      case "Inventory":
        return <Inventory />;
      case "Shipments":
        return <Shipments />;
      case "Issues":
        return <Issues />;
      case "Settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <Navbar activePage={activePage} />
        <div className="page-content">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;
