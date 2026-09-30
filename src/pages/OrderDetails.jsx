import React from "react";
import { ArrowLeft, Package, MapPin, User, Truck } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

const stages = [
  "Processing",
  "Picking",
  "Packing",
  "Staging",
  "Shipped",
];

function OrderDetails({
  order,
  onBack,
  onStatusChange,
}) {
  const currentIndex = stages.indexOf(order.status);

  const getNextStage = () => {
    if (order.status === "Delayed") {
      return "Processing";
    }

    const index = stages.indexOf(order.status);

    if (index === -1 || index === stages.length - 1) {
      return null;
    }

    return stages[index + 1];
  };

  const nextStage = getNextStage();

  return (
    <div className="page-content">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to Orders
      </button>

      <div className="page-header">
        <div>
          <h1>{order.id}</h1>
          <p>Order fulfillment details and workflow.</p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-card-header">
            <User size={20} />
            <h3>Customer</h3>
          </div>

          <p className="detail-main">
            {order.customer}
          </p>

          <p>Payment: {order.payment}</p>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <Package size={20} />
            <h3>Product</h3>
          </div>

          <p className="detail-main">
            {order.product}
          </p>

          <p>Variant: {order.variant}</p>
          <p>Quantity: {order.quantity}</p>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <Truck size={20} />
            <h3>Shipping</h3>
          </div>

          <p className="detail-main">
            {order.courier}
          </p>

          <p>Warehouse: {order.warehouse}</p>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <MapPin size={20} />
            <h3>Deadline</h3>
          </div>

          <p className="detail-main">
            {order.deadline}
          </p>

          <p>
            Priority:{" "}
            <strong>{order.priority}</strong>
          </p>
        </div>
      </div>

      {order.status === "Delayed" && (
        <div className="alert-card">
          <strong>Order delayed</strong>
          <p>
            This order has passed its expected processing
            timeline and requires attention.
          </p>
        </div>
      )}

      <div className="detail-card workflow-card">
        <div className="detail-card-header">
          <Package size={20} />
          <h3>Fulfillment Timeline</h3>
        </div>

        <div className="workflow-timeline">
          {stages.map((stage, index) => {
            const completed =
              order.status !== "Delayed" &&
              currentIndex >= index;

            const active =
              order.status === stage;

            return (
              <div
                key={stage}
                className={`timeline-step ${
                  completed ? "completed" : ""
                } ${active ? "active" : ""}`}
              >
                <div className="timeline-dot">
                  {completed ? "✓" : index + 1}
                </div>

                <div>
                  <strong>{stage}</strong>

                  {active && (
                    <p>Current stage</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {nextStage && (
          <button
            className="primary-button"
            onClick={() =>
              onStatusChange(order.id, nextStage)
            }
          >
            Move to {nextStage}
          </button>
        )}

        {order.status === "Shipped" && (
          <div className="success-message">
            Order has completed the fulfillment workflow.
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;