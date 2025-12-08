// src/pages/Home/Homepage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; // Axios instance

const Homepage = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch vendors from backend
    API.get("/vendors")
      .then((res) => setVendors(res.data))
      .catch((err) => console.error("Error fetching vendors:", err));
  }, []);

  const goToVendor = (id) => {
    navigate(`/vendor/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>All Vendors</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            onClick={() => goToVendor(vendor.id)}
            style={{
              cursor: "pointer",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, {
                transform: "scale(1.03)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              })
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, {
                transform: "scale(1)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              })
            }
          >
            <h2>{vendor.name}</h2>
            <p>{vendor.location}</p>
            <p>
              Tags:{" "}
              {vendor.tags && vendor.tags.length > 0
                ? vendor.tags.join(", ")
                : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
