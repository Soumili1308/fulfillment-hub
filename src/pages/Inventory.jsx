import React from "react";
import { useMemo, useState } from "react";
import { Search, ArrowRightLeft, Package } from "lucide-react";
import {
  getInventory,
  saveInventory,
} from "../utils/fulfillment";

function Inventory() {
  const [inventory, setInventory] = useState(
    getInventory()
  );

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [selectedItem, setSelectedItem] =
    useState(null);
  const [transferQty, setTransferQty] = useState(1);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.product.toLowerCase().includes(searchText) ||
        item.variant.toLowerCase().includes(searchText);

      let matchesStock = true;

      if (stockFilter === "Low") {
        matchesStock =
          item.mainWarehouse <= item.reorderLevel;
      }

      if (stockFilter === "Out") {
        matchesStock =
          item.mainWarehouse === 0;
      }

      if (stockFilter === "Available") {
        matchesStock =
          item.mainWarehouse > item.reorderLevel;
      }

      return matchesSearch && matchesStock;
    });
  }, [inventory, search, stockFilter]);

  const totalMainStock = inventory.reduce(
    (sum, item) => sum + item.mainWarehouse,
    0
  );

  const totalSecondaryStock = inventory.reduce(
    (sum, item) => sum + item.secondaryWarehouse,
    0
  );

  const lowStockCount = inventory.filter(
    (item) =>
      item.mainWarehouse <= item.reorderLevel
  ).length;

  const transferStock = () => {
    if (!selectedItem) return;

    const quantity = Number(transferQty);

    if (
      quantity <= 0 ||
      quantity > selectedItem.secondaryWarehouse
    ) {
      return;
    }

    const updatedInventory = inventory.map((item) =>
      item.id === selectedItem.id
        ? {
            ...item,
            mainWarehouse:
              item.mainWarehouse + quantity,
            secondaryWarehouse:
              item.secondaryWarehouse - quantity,
          }
        : item
    );

    setInventory(updatedInventory);
    saveInventory(updatedInventory);

    setSelectedItem(null);
    setTransferQty(1);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>
            Monitor stock across the main and secondary
            warehouses.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={20} />
          </div>
          <div>
            <span>Main Warehouse</span>
            <strong>{totalMainStock}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={20} />
          </div>
          <div>
            <span>Secondary Warehouse</span>
            <strong>{totalSecondaryStock}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={20} />
          </div>
          <div>
            <span>Stock Alerts</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search product or variant..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={stockFilter}
          onChange={(e) =>
            setStockFilter(e.target.value)
          }
        >
          <option value="All">All Stock</option>
          <option value="Low">Low Stock</option>
          <option value="Out">Out of Stock</option>
          <option value="Available">
            Healthy Stock
          </option>
        </select>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Main Warehouse</th>
                <th>Secondary Warehouse</th>
                <th>Reorder Level</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map((item) => {
                const low =
                  item.mainWarehouse <=
                  item.reorderLevel;

                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.product}</strong>
                    </td>

                    <td>{item.variant}</td>

                    <td>
                      <span
                        className={
                          item.mainWarehouse === 0
                            ? "stock-danger"
                            : low
                            ? "stock-warning"
                            : "stock-good"
                        }
                      >
                        {item.mainWarehouse}
                      </span>
                    </td>

                    <td>{item.secondaryWarehouse}</td>

                    <td>{item.reorderLevel}</td>

                    <td>
                      <button
                        className="secondary-button"
                        disabled={
                          item.secondaryWarehouse === 0
                        }
                        onClick={() => {
                          setSelectedItem(item);
                          setTransferQty(1);
                        }}
                      >
                        <ArrowRightLeft size={16} />
                        Transfer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Transfer Stock</h2>
                <p>{selectedItem.product}</p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedItem(null)
                }
              >
                ×
              </button>
            </div>

            <div className="transfer-info">
              <p>
                <strong>Variant:</strong>{" "}
                {selectedItem.variant}
              </p>

              <p>
                <strong>Available in secondary:</strong>{" "}
                {selectedItem.secondaryWarehouse}
              </p>

              <p>
                <strong>Main warehouse:</strong>{" "}
                {selectedItem.mainWarehouse}
              </p>
            </div>

            <label className="form-label">
              Quantity to transfer
            </label>

            <input
              className="number-input"
              type="number"
              min="1"
              max={selectedItem.secondaryWarehouse}
              value={transferQty}
              onChange={(e) =>
                setTransferQty(e.target.value)
              }
            />

            <button
              className="primary-button full-width"
              onClick={transferStock}
            >
              Transfer Stock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;