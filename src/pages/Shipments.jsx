import React from "react";
import { useMemo, useState } from "react";
import {
  Search,
  Truck,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";

import {
  getShipments,
  saveShipments,
  getIssues,
  saveIssues,
  generateIssueId,
  getOrders,
  saveOrders,
} from "../utils/fulfillment";

function Shipments() {
  const [shipments, setShipments] = useState(
    getShipments()
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedShipment, setSelectedShipment] =
    useState(null);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        shipment.id
          .toLowerCase()
          .includes(searchText) ||
        shipment.orderId
          .toLowerCase()
          .includes(searchText) ||
        shipment.courier
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, search, statusFilter]);

  const readyCount = shipments.filter(
    (shipment) =>
      shipment.status === "Ready for Pickup"
  ).length;

  const pickedUpCount = shipments.filter(
    (shipment) =>
      shipment.status === "Picked Up"
  ).length;

  const missedCount = shipments.filter(
    (shipment) =>
      shipment.status === "Pickup Missed"
  ).length;

  const updateShipment = (
    shipmentId,
    newStatus
  ) => {
    const updatedShipments = shipments.map(
      (shipment) =>
        shipment.id === shipmentId
          ? {
              ...shipment,
              status: newStatus,
            }
          : shipment
    );

    setShipments(updatedShipments);
    saveShipments(updatedShipments);

    const shipment = updatedShipments.find(
      (item) => item.id === shipmentId
    );

    if (shipment?.orderId) {
      const orders = getOrders();

      let updatedOrders = orders;

      if (newStatus === "Picked Up") {
        updatedOrders = orders.map((order) =>
          order.id === shipment.orderId
            ? {
                ...order,
                status: "Shipped",
              }
            : order
        );

        saveOrders(updatedOrders);
      }

      if (newStatus === "Pickup Missed") {
        const existingIssues = getIssues();

        const alreadyExists =
          existingIssues.some(
            (issue) =>
              issue.orderId === shipment.orderId &&
              issue.type === "Missed Pickup" &&
              issue.status !== "Resolved"
          );

        if (!alreadyExists) {
          const newIssue = {
            id: generateIssueId(
              existingIssues
            ),
            orderId: shipment.orderId,
            type: "Missed Pickup",
            description:
              "Courier did not collect the staged package.",
            status: "Open",
            priority: "High",
          };

          saveIssues([
            ...existingIssues,
            newIssue,
          ]);
        }
      }
    }

    setSelectedShipment(null);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Shipments</h1>
          <p>
            Track courier pickups and staged packages.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Truck size={20} />
          </div>

          <div>
            <span>Ready for Pickup</span>
            <strong>{readyCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Picked Up</span>
            <strong>{pickedUpCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Missed Pickups</span>
            <strong>{missedCount}</strong>
          </div>
        </div>
      </div>

      {missedCount > 0 && (
        <div className="alert-card">
          <strong>
            {missedCount} missed pickup
            {missedCount > 1 ? "s" : ""} require
            attention.
          </strong>

          <p>
            Review the shipment and create a follow-up
            issue where necessary.
          </p>
        </div>
      )}

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search shipment, order or courier..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Statuses</option>
          <option value="Ready for Pickup">
            Ready for Pickup
          </option>
          <option value="Picked Up">
            Picked Up
          </option>
          <option value="Pickup Missed">
            Pickup Missed
          </option>
        </select>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Order</th>
                <th>Courier</th>
                <th>Pickup Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredShipments.map(
                (shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <strong>{shipment.id}</strong>
                    </td>

                    <td>{shipment.orderId}</td>

                    <td>{shipment.courier}</td>

                    <td>
                      {shipment.pickupTime}
                    </td>

                    <td>
                      <StatusBadge
                        status={shipment.status}
                      />
                    </td>

                    <td>
                      <button
                        className="secondary-button"
                        onClick={() =>
                          setSelectedShipment(
                            shipment
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedShipment && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>
                  {selectedShipment.id}
                </h2>

                <p>
                  Order{" "}
                  {selectedShipment.orderId}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedShipment(null)
                }
              >
                ×
              </button>
            </div>

            <div className="shipment-detail">
              <p>
                <strong>Courier:</strong>{" "}
                {selectedShipment.courier}
              </p>

              <p>
                <strong>Pickup:</strong>{" "}
                {selectedShipment.pickupTime}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedShipment.status}
              </p>
            </div>

            <div className="modal-actions">
              {selectedShipment.status !==
                "Picked Up" && (
                <button
                  className="primary-button"
                  onClick={() =>
                    updateShipment(
                      selectedShipment.id,
                      "Picked Up"
                    )
                  }
                >
                  Mark Picked Up
                </button>
              )}

              {selectedShipment.status !==
                "Pickup Missed" && (
                <button
                  className="danger-button"
                  onClick={() =>
                    updateShipment(
                      selectedShipment.id,
                      "Pickup Missed"
                    )
                  }
                >
                  Mark Pickup Missed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shipments;