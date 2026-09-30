import React from "react";
function TableSkeleton({ rows = 5 }) {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton-row" key={index}>
          <div className="skeleton-cell short" />
          <div className="skeleton-cell" />
          <div className="skeleton-cell medium" />
          <div className="skeleton-cell short" />
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
