import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./Homepage.css";

const Homepage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await API.get("/vendors");
        setVendors(res.data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const goToVendor = (vendorId) => {
    navigate(`/vendor/${vendorId}`);
  };

  if (loading) {
    return (
      <div className="home-container">
        <h2>Loading vendors...</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Available Vendors</h1>

      <div className="vendor-grid">
        {vendors.map((vendor) => (
          <div
            key={vendor._id}
            className="vendor-card"
            onClick={() => goToVendor(vendor._id)}
          >
            <h2 className="vendor-name">{vendor.name}</h2>

            {vendor.location && (
              <p className="vendor-location">{vendor.location}</p>
            )}

            <p className="vendor-tags">
              {vendor.tags && vendor.tags.length > 0
                ? vendor.tags.join(", ")
                : "No tags"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
