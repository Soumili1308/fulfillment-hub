import React from "react";
function StatCard({ title, value, icon: Icon, tone = "blue", subtitle }) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${tone}`}>
        {Icon && <Icon size={19} />}
      </div>
      <div className="stat-card-content">
        <span>{title}</span>
        <strong>{value}</strong>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
  );
}

export default StatCard;
