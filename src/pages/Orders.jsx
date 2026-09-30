import React from "react";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import OrderDetails from "./OrderDetails";
import { getOrders, saveOrders } from "../utils/fulfillment";

function Orders() {
  const [orders, setOrders] = useState(getOrders());
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(searchText) ||
        order.customer.toLowerCase().includes(searchText) ||
        order.product.toLowerCase().includes(searchText);

      const matchesPriority =
        priorityFilter === "All" ||
        order.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [orders, search, priorityFilter, statusFilter]);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    );

    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    const updatedOrder = updatedOrders.find(
      (order) => order.id === orderId
    );

    setSelectedOrder(updatedOrder);
  };

  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onStatusChange={updateOrderStatus}
      />
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Monitor and manage fulfillment orders.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search order, customer or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Normal">Normal</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Picking">Picking</option>
          <option value="Packing">Packing</option>
          <option value="Staging">Staging</option>
          <option value="Shipped">Shipped</option>
          <option value="Delayed">Delayed</option>
        </select>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Courier</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="clickable-row"
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                  >
                    <td>
                      <strong>{order.id}</strong>
                    </td>

                    <td>{order.customer}</td>

                    <td>
                      <div>{order.product}</div>
                      <small>{order.variant}</small>
                    </td>

                    <td>
                      <span
                        className={
                          order.priority === "High"
                            ? "priority-high"
                            : "priority-normal"
                        }
                      >
                        {order.priority}
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={order.status} />
                    </td>

                    <td>{order.deadline}</td>

                    <td>{order.courier}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;