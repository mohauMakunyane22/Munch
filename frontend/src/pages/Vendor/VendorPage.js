// src/pages/Vendor/VendorPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";

const VendorPage = () => {
  const { id } = useParams(); // vendor id from URL
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    API.get(`/vendors/${id}`)
      .then((res) => setVendor(res.data))
      .catch((err) => console.error("Error fetching vendor:", err));
  }, [id]);

  const addToCart = (food) => {
    setCart((prev) => {
      // Check if food is already in cart
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prev, { food, qty: 1 }];
      }
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const items = cart.map((c) => ({ foodId: c.food.id, qty: c.qty }));

    API.post("/orders", {
      vendorId: vendor.id,
      customerName: "Test Customer", // For MVP, can later add a form
      items,
    })
      .then((res) => {
        alert(`Order placed! Order ID: ${res.data.id}`);
        setCart([]);
        navigate(`/order/${res.data.id}`); // go to order tracking page
      })
      .catch((err) => console.error(err));
  };

  if (!vendor) return <p>Loading vendor...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{vendor.name}</h1>
      <p>{vendor.location}</p>
      <p>Tags: {vendor.tags && vendor.tags.join(", ")}</p>

      <h2>Menu</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
        }}
      >
        {vendor.foods.map((food) => (
          <div
            key={food.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{food.name}</h3>
            <p>${food.price.toFixed(2)}</p>
            <button onClick={() => addToCart(food)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Cart</h2>
          <ul>
            {cart.map((c) => (
              <li key={c.food.id}>
                {c.food.name} x {c.qty} - ${(c.food.price * c.qty).toFixed(2)}
              </li>
            ))}
          </ul>
          <button onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default VendorPage;
