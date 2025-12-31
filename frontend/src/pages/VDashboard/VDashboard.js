import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VendorDashboard = () => {
  const { vendorId } = useParams(); // Grab vendorId from the URL
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vendorId) return;

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);

    return () => clearInterval(interval);
  }, [vendorId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `http://localhost:5000/orders/vendor/${vendorId}`
      );

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update order");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Could not update order status");
    }
  };

  if (!vendorId) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Vendor Dashboard</h2>
        <p>You must be logged in as a vendor.</p>
      </div>
    );
  }

  //if (loading) return <p style={{ padding: "2rem" }}>Loading orders...</p>;

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={fetchOrders}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Vendor Dashboard (ID: {vendorId})</h2>
      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3>Order #{order._id.slice(-6)}</h3>
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ fontWeight: "bold" }}>
              {order.status.toUpperCase()}
            </span>
          </p>

          <p>
            <strong>Items:</strong>
          </p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.foodId?.name} × {item.quantity} — R{item.foodId?.price}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => updateStatus(order._id, "preparing")}>
              Preparing
            </button>
            <button onClick={() => updateStatus(order._id, "ready")}>
              Ready
            </button>
            <button onClick={() => updateStatus(order._id, "completed")}>
              Completed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorDashboard;
