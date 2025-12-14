// src/pages/OrderTracking/OrderTracking.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order) return <p>Loading order...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order #{order._id.slice(-6)}</h1>
      <p>Customer: {order.customerName}</p>

      <p>
        Status:{" "}
        <span
          style={{
            color:
              order.status === "pending"
                ? "orange"
                : order.status === "completed"
                ? "green"
                : "blue",
            fontWeight: "bold",
          }}
        >
          {order.status.toUpperCase()}
        </span>
      </p>

      <h2>Items</h2>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.foodId.name} × {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderTracking;
