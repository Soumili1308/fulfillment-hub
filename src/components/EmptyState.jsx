import React from "react";
import { SearchX } from "lucide-react";

function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <SearchX size={24} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="empty-state-button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
