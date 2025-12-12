// src/pages/Home/Homepage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./Homepage.css";

const Homepage = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/vendors")
      .then((res) => setVendors(res.data))
      .catch((err) => console.error("Error fetching vendors:", err));
  }, []);

  const goToVendor = (id) => {
    navigate(`/vendor/${id}`);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Vendors</h1>

      <div className="vendor-grid">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="vendor-card"
            onClick={() => goToVendor(vendor.id)}
          >
            <h2 className="vendor-name">{vendor.name}</h2>
            <p className="vendor-location">{vendor.location}</p>
            <p className="vendor-tags">
              {vendor.tags?.length ? vendor.tags.join(", ") : "No tags"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
