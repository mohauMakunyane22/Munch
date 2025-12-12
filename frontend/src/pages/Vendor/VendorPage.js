// src/pages/Vendor/VendorPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import "./VendorPage.css";

const VendorPage = () => {
  const { id } = useParams();
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
      customerName: "Test Customer",
      items,
    })
      .then((res) => {
        alert(`Order placed! Order ID: ${res.data.id}`);
        setCart([]);
        navigate(`/order/${res.data.id}`);
      })
      .catch((err) => console.error(err));
  };

  if (!vendor) return <p>Loading vendor...</p>;

  return (
    <div className="vendor-page">
      <h1 className="vendor-title">{vendor.name}</h1>
      <p className="vendor-location">{vendor.location}</p>
      <p className="vendor-tags">
        Tags: {vendor.tags && vendor.tags.join(", ")}
      </p>

      <h2 className="menu-title">Menu</h2>
      <div className="menu-grid">
        {vendor.foods.map((food) => (
          <div key={food.id} className="food-card">
            <h3>{food.name}</h3>
            <p className="food-price">R{food.price.toFixed(2)}</p>
            <button className="add-btn" onClick={() => addToCart(food)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-section">
          <h2>Cart</h2>
          <ul className="cart-list">
            {cart.map((c) => (
              <li key={c.food.id}>
                {c.food.name} x {c.qty} – R{(c.food.price * c.qty).toFixed(2)}
              </li>
            ))}
          </ul>
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorPage;
