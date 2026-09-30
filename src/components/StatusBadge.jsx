import React from "react";
function StatusBadge({ status }) {
  const normalized = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`status-badge ${normalized}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export default StatusBadge;
