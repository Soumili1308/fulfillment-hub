import React from "react";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Clock3,
  Package,
  Truck,
} from "lucide-react";

import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  getOrders,
  getInventory,
  getIssues,
} from "../utils/fulfillment";

function Dashboard() {
  const [dashboardOrders, setDashboardOrders] = useState(() => getOrders());
  const [dashboardInventory, setDashboardInventory] = useState(() => getInventory());
  const [dashboardIssues, setDashboardIssues] = useState(() => getIssues());

  const refreshDashboard = () => {
    setDashboardOrders(getOrders());
    setDashboardInventory(getInventory());
    setDashboardIssues(getIssues());
  };

  useEffect(() => {
    refreshDashboard();

    const handleUpdate = () => refreshDashboard();

    window.addEventListener("fulfillment-data-updated", handleUpdate);
    return () => {
      window.removeEventListener("fulfillment-data-updated", handleUpdate);
    };
  }, []);

  const priorityOrders = dashboardOrders.filter(
    (order) => order.priority === "High" && order.status !== "Shipped"
  );

  const delayedOrders = dashboardOrders.filter(
    (order) => order.status === "Delayed"
  );

  const lowStockItems = dashboardInventory.filter(
    (item) => item.mainWarehouse <= item.reorderLevel
  );

  const openIssues = dashboardIssues.filter(
    (issue) => issue.status !== "Resolved"
  );

  const workflowCounts = [
    ["Processing", dashboardOrders.filter((o) => o.status === "Processing").length],
    ["Picking", dashboardOrders.filter((o) => o.status === "Picking").length],
    ["Packing", dashboardOrders.filter((o) => o.status === "Packing").length],
    ["Staging", dashboardOrders.filter((o) => o.status === "Staging").length],
    ["Shipped", dashboardOrders.filter((o) => o.status === "Shipped").length],
  ];

  return (
    <div className="dashboard-page">
      <div className="section-heading">
        <div>
          <h2>Fulfillment Overview</h2>
          <p>Monitor orders, warehouse stock, shipments and operational issues.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Orders" value={dashboardOrders.length} icon={Package} tone="blue" />
        <StatCard title="Priority Orders" value={priorityOrders.length} icon={AlertTriangle} tone="purple" />
        <StatCard title="Delayed Orders" value={delayedOrders.length} icon={Clock3} tone="red" />
        <StatCard title="Open Issues" value={openIssues.length} icon={CheckCircle2} tone="orange" />
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Priority Orders</h3>
              <span>Orders requiring attention</span>
            </div>
          </div>

          <div className="mini-list">
            {priorityOrders.slice(0, 5).map((order) => (
              <div className="mini-list-row" key={order.id}>
                <div>
                  <strong>{order.id}</strong>
                  <span>{order.customer} · {order.product}</span>
                </div>
                <div>
                  <StatusBadge status={order.status} />
                  <small>{order.deadline}</small>
                </div>
              </div>
            ))}

            {priorityOrders.length === 0 && (
              <div className="dashboard-empty">No priority orders require attention.</div>
            )}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Open Issues</h3>
              <span>Problems requiring follow-up</span>
            </div>
          </div>

          <div className="mini-list">
            {openIssues.slice(0, 5).map((issue) => (
              <div className="mini-list-row" key={issue.id}>
                <div>
                  <strong>{issue.id}</strong>
                  <span>{issue.type} · {issue.orderId}</span>
                </div>
                <span className={`issue-priority ${issue.priority.toLowerCase()}`}>
                  {issue.priority}
                </span>
              </div>
            ))}

            {openIssues.length === 0 && (
              <div className="dashboard-empty">No open issues.</div>
            )}
          </div>
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Warehouse Stock Alerts</h3>
              <span>Main warehouse levels</span>
            </div>
          </div>

          <div className="mini-list">
            {lowStockItems.map((item) => (
              <div className="mini-list-row" key={item.id}>
                <div>
                  <strong>{item.product}</strong>
                  <span>{item.variant}</span>
                </div>
                <div className="stock-alert">
                  <strong>{item.mainWarehouse}</strong>
                  <span>main / {item.secondaryWarehouse} secondary</span>
                </div>
              </div>
            ))}

            {lowStockItems.length === 0 && (
              <div className="dashboard-empty">No low-stock alerts.</div>
            )}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Fulfillment Workflow</h3>
              <span>Current order distribution</span>
            </div>
          </div>

          <div className="workflow-grid">
            {workflowCounts.map(([stage, count]) => (
              <div className="workflow-item" key={stage}>
                <div className="workflow-icon">
                  {stage === "Shipped" ? <Truck size={15} /> : <Boxes size={15} />}
                </div>
                <strong>{count}</strong>
                <span>{stage}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
