import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Extract vendorId from URL
  const params = new URLSearchParams(location.search);
  const vendorId = parseInt(params.get("vendorId"));

  useEffect(() => {
    if (vendorId) {
      fetchOrders();
    }
  }, [vendorId]); // Added vendorId dependency

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:5000/vendor/orders");

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      // Filter only orders for that vendor
      const vendorOrders = data.filter((o) => o.vendorId === vendorId);
      setOrders(vendorOrders);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      fetchOrders(); // Refresh after update
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order status");
    }
  };

  if (!vendorId) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Vendor Dashboard</h2>
        <p>Error: No vendor ID provided in URL</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Vendor Dashboard</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Vendor Dashboard</h2>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={fetchOrders}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Vendor Dashboard (ID: {vendorId})</h2>

      {orders.length === 0 && <p>No orders for this vendor yet.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "10px",
          }}
        >
          <h3>Order ID: {order.id}</h3>

          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>

          <p>
            <strong>Items:</strong>
          </p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} — x{item.quantity}
              </li>
            ))}
          </ul>

          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => updateStatus(order.id, "preparing")}>
              Preparing
            </button>

            <button onClick={() => updateStatus(order.id, "ready")}>
              Ready
            </button>

            <button onClick={() => updateStatus(order.id, "completed")}>
              Completed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorDashboard;
