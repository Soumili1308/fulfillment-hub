import { getStoredData, setStoredData } from "./storage";

import { orders as initialOrders } from "../data/orders";
import { inventory as initialInventory } from "../data/inventory";
import { shipments as initialShipments } from "../data/shipments";
import { issues as initialIssues } from "../data/issues";

export const getOrders = () => getStoredData("orders", initialOrders);
export const getInventory = () => getStoredData("inventory", initialInventory);
export const getShipments = () => getStoredData("shipments", initialShipments);
export const getIssues = () => getStoredData("issues", initialIssues);

export const saveOrders = (orders) => setStoredData("orders", orders);
export const saveInventory = (inventory) => setStoredData("inventory", inventory);
export const saveShipments = (shipments) => setStoredData("shipments", shipments);
export const saveIssues = (issues) => setStoredData("issues", issues);

export const ORDER_STATUSES = [
  "Processing",
  "Picking",
  "Packing",
  "Staging",
  "Shipped",
  "Delayed",
];

export const ISSUE_STATUSES = [
  "Open",
  "Investigating",
  "Resolved",
];

export const SHIPMENT_STATUSES = [
  "Ready for Pickup",
  "Picked Up",
  "Pickup Missed",
];

export const generateIssueId = (existingIssues) => {
  const numbers = existingIssues.map((issue) => {
    const match = issue.id.match(/ISS-(\d+)/);
    return match ? Number(match[1]) : 0;
  });

  const nextNumber = Math.max(0, ...numbers) + 1;
  return `ISS-${String(nextNumber).padStart(3, "0")}`;
};
