// src/pages/OrderTracking/OrderTracking.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";

const OrderTracking = () => {
  const { id } = useParams(); // order ID
  const [order, setOrder] = useState(null);
  const [vendorFoods, setVendorFoods] = useState({}); // Map foodId -> food name

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        const orderData = res.data;
        setOrder(orderData);

        // Fetch vendor foods for name lookup
        const vendorRes = await API.get(`/vendors/${orderData.vendorId}`);
        const foodsMap = {};
        vendorRes.data.foods.forEach((food) => {
          foodsMap[food.id] = food.name;
        });
        setVendorFoods(foodsMap);
      } catch (err) {
        console.error("Error fetching order or vendor foods:", err);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [id]);

  if (!order) return <p>Loading order...</p>;

  // Calculate total
  const totalPrice = order.items.reduce((total, item) => {
    const price = vendorFoods[item.foodId] ? item.price || 0 : 0; // optional if price available
    return total + item.qty * (item.price || 0); // using dummy data price if available
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order #{order.id}</h1>
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
            {vendorFoods[item.foodId] || "Unknown food"} x {item.qty}
          </li>
        ))}
      </ul>

      {/* Optional: Show total if you have prices */}
      {/* <p>Total: ${totalPrice.toFixed(2)}</p> */}
    </div>
  );
};

export default OrderTracking;
