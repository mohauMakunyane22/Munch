import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const VendorLogin = () => {
  const [vendorNumber, setVendorNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!vendorNumber.trim()) {
      setError("Vendor number is required");
      return;
    }

    try {
      const res = await API.post("/vendors/login", { vendorNumber });

      // Redirect to vendor dashboard
      navigate(`/vendor/dashboard/${res.data.vendorId}`);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Login failed");
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Vendor Login</h2>

      <input
        type="text"
        placeholder="Enter Vendor Number"
        value={vendorNumber}
        onChange={(e) => setVendorNumber(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VendorLogin;
