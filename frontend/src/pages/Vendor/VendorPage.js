// src/pages/Vendor/VendorPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import "./VendorPage.css";

const VendorPage = () => {
  const { id } = useParams(); // vendor _id
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
      const existing = prev.find((item) => item.food._id === food._id);

      if (existing) {
        return prev.map((item) =>
          item.food._id === food._id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { food, qty: 1 }];
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const items = cart.map((c) => ({
        foodId: c.food._id,
        quantity: c.qty,
      }));

      const res = await API.post("/orders", {
        vendorId: vendor._id,
        customerName: "Test Customer",
        items,
      });

      setCart([]);
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  if (!vendor) return <p>Loading vendor...</p>;

  return (
    <div className="vendor-page">
      <h1 className="vendor-title">{vendor.name}</h1>
      <p className="vendor-location">{vendor.location}</p>

      <h2 className="menu-title">Menu</h2>

      <div className="menu-grid">
        {vendor.foods.map((food) => (
          <div key={food._id} className="food-card">
            <h3>{food.name}</h3>
            <p className="food-price">R{food.price.toFixed(2)}</p>
            <button onClick={() => addToCart(food)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-section">
          <h2>Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.food._id}>
                {item.food.name} x {item.qty}
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
