import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  PackageX,
  Search,
  Truck,
  Box,
  X,
  ArrowRight,
} from "lucide-react";

import EmptyState from "../components/EmptyState";
import { issues as initialIssues } from "../data/issues";
import {
  getStoredData,
  setStoredData,
} from "../utils/storage";

function Issues() {
  const [issues, setIssues] = useState(() =>
    getStoredData("issues", initialIssues)
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    setStoredData("issues", issues);
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const term = search.toLowerCase();

      const searchMatch =
        issue.id.toLowerCase().includes(term) ||
        issue.orderId.toLowerCase().includes(term) ||
        issue.type.toLowerCase().includes(term) ||
        issue.description.toLowerCase().includes(term);

      return (
        searchMatch &&
        (statusFilter === "All" || issue.status === statusFilter) &&
        (priorityFilter === "All" || issue.priority === priorityFilter) &&
        (typeFilter === "All" || issue.type === typeFilter)
      );
    });
  }, [issues, search, statusFilter, priorityFilter, typeFilter]);

  const openCount = issues.filter((i) => i.status === "Open").length;
  const investigatingCount = issues.filter((i) => i.status === "Investigating").length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;
  const highPriorityCount = issues.filter(
    (i) => i.priority === "High" && i.status !== "Resolved"
  ).length;

  const getIssueIcon = (type) => {
    if (type === "Inventory Shortage") return PackageX;
    if (type === "Missed Pickup") return Truck;
    if (type === "Misplaced Package") return Box;
    if (type === "Delayed Order") return Clock;
    return AlertTriangle;
  };

  const getIssueIconClass = (type) => {
    if (type === "Inventory Shortage") return "inventory";
    if (type === "Missed Pickup") return "pickup";
    if (type === "Misplaced Package") return "package";
    if (type === "Delayed Order") return "delay";
    return "default";
  };

  const openIssue = (issue) => {
    setSelectedIssue(issue);
    setResolutionNote(issue.resolutionNote || "");
  };

  const closeIssue = () => {
    setSelectedIssue(null);
    setResolutionNote("");
  };

  const updateIssueStatus = (issueId, newStatus) => {
    const updated = issues.map((issue) =>
      issue.id === issueId
        ? {
            ...issue,
            status: newStatus,
            resolutionNote:
              newStatus === "Resolved"
                ? resolutionNote
                : issue.resolutionNote,
          }
        : issue
    );

    setIssues(updated);

    setSelectedIssue((current) =>
      current && current.id === issueId
        ? {
            ...current,
            status: newStatus,
            resolutionNote:
              newStatus === "Resolved"
                ? resolutionNote
                : current.resolutionNote,
          }
        : current
    );
  };

  return (
    <div className="issues-page">
      <div className="section-heading">
        <div>
          <h2>Issues</h2>
          <p>Track and resolve fulfillment problems.</p>
        </div>
      </div>

      <div className="issues-summary">
        <div className="issues-summary-card">
          <div className="issues-summary-icon red"><AlertTriangle size={20} /></div>
          <div><span>Open Issues</span><strong>{openCount}</strong></div>
        </div>
        <div className="issues-summary-card">
          <div className="issues-summary-icon orange"><Clock size={20} /></div>
          <div><span>Investigating</span><strong>{investigatingCount}</strong></div>
        </div>
        <div className="issues-summary-card">
          <div className="issues-summary-icon green"><CheckCircle2 size={20} /></div>
          <div><span>Resolved</span><strong>{resolvedCount}</strong></div>
        </div>
        <div className="issues-summary-card">
          <div className="issues-summary-icon purple"><AlertTriangle size={20} /></div>
          <div><span>High Priority</span><strong>{highPriorityCount}</strong></div>
        </div>
      </div>

      <div className="issues-toolbar">
        <div className="issues-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search issue, order or description..."
          />
        </div>

        <div className="issues-filters">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All issue types</option>
            <option value="Delayed Order">Delayed Order</option>
            <option value="Inventory Shortage">Inventory Shortage</option>
            <option value="Wrong Variant">Wrong Variant</option>
            <option value="Missed Pickup">Missed Pickup</option>
            <option value="Misplaced Package">Misplaced Package</option>
          </select>
        </div>
      </div>

      <div className="issues-table-card">
        <div className="table-header">
          <div>
            <h3>Issue Queue</h3>
            <span>Showing {filteredIssues.length} of {issues.length} issues</span>
          </div>
          <div className="table-header-info">
            <AlertTriangle size={15} /> Operational issues
          </div>
        </div>

        <div className="table-wrapper">
          <table className="issues-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Order</th>
                <th>Type</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => {
                const IssueIcon = getIssueIcon(issue.type);

                return (
                  <tr key={issue.id}>
                    <td>
                      <div className="issue-table-id">
                        <div className={`issue-table-icon ${getIssueIconClass(issue.type)}`}>
                          <IssueIcon size={15} />
                        </div>
                        <strong>{issue.id}</strong>
                      </div>
                    </td>
                    <td><span className="issue-order-id">{issue.orderId}</span></td>
                    <td><span className="issue-type">{issue.type}</span></td>
                    <td><span className="issue-description">{issue.description}</span></td>
                    <td>
                      <span className={`issue-priority ${issue.priority.toLowerCase()}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`issue-status-badge ${issue.status.toLowerCase()}`}>
                        {issue.status === "Open" && <AlertTriangle size={11} />}
                        {issue.status === "Investigating" && <Clock size={11} />}
                        {issue.status === "Resolved" && <CheckCircle2 size={11} />}
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      <button className="issue-view-button" onClick={() => openIssue(issue)}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <EmptyState
                      title="No matching issues"
                      description="Try another search or clear your filters."
                      actionLabel="Clear Filters"
                      onAction={() => {
                        setSearch("");
                        setStatusFilter("All");
                        setPriorityFilter("All");
                        setTypeFilter("All");
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIssue && (
        <div className="modal-overlay" onClick={closeIssue}>
          <div className="issue-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Issue Details</h3>
                <p>{selectedIssue.id}</p>
              </div>
              <button className="modal-close" onClick={closeIssue}>
                <X size={18} />
              </button>
            </div>

            <div className="issue-modal-heading">
              <div className={`issue-modal-icon ${getIssueIconClass(selectedIssue.type)}`}>
                {(() => {
                  const Icon = getIssueIcon(selectedIssue.type);
                  return <Icon size={22} />;
                })()}
              </div>
              <div>
                <strong>{selectedIssue.type}</strong>
                <span>{selectedIssue.orderId}</span>
              </div>
            </div>

            <div className="issue-detail-description">
              <span>Description</span>
              <p>{selectedIssue.description}</p>
            </div>

            <div className="issue-detail-meta">
              <div>
                <span>Priority</span>
                <strong className={`meta-priority ${selectedIssue.priority.toLowerCase()}`}>
                  {selectedIssue.priority}
                </strong>
              </div>
              <div>
                <span>Current Status</span>
                <strong>{selectedIssue.status}</strong>
              </div>
            </div>

            {selectedIssue.status !== "Resolved" && (
              <div className="issue-progress">
                <span>Update status</span>
                <div className="issue-status-actions">
                  {selectedIssue.status === "Open" && (
                    <button
                      className="investigate-button"
                      onClick={() => updateIssueStatus(selectedIssue.id, "Investigating")}
                    >
                      <Clock size={13} /> Start Investigating
                    </button>
                  )}

                  {selectedIssue.status === "Investigating" && (
                    <>
                      <button
                        className="open-again-button"
                        onClick={() => updateIssueStatus(selectedIssue.id, "Open")}
                      >
                        <ArrowRight size={13} /> Reopen
                      </button>
                      <button
                        className="resolve-button"
                        onClick={() => updateIssueStatus(selectedIssue.id, "Resolved")}
                      >
                        <CheckCircle2 size={13} /> Resolve Issue
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedIssue.status === "Investigating" && (
              <div className="resolution-note">
                <label>Resolution note</label>
                <textarea
                  value={resolutionNote}
                  onChange={(event) => setResolutionNote(event.target.value)}
                  placeholder="Add what was done to resolve this issue..."
                  rows="3"
                />
              </div>
            )}

            {selectedIssue.status === "Resolved" && (
              <div className="resolved-message">
                <CheckCircle2 size={17} />
                <div>
                  <strong>Issue resolved</strong>
                  <span>
                    This issue has been marked as resolved and is no longer in the active queue.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Issues;
