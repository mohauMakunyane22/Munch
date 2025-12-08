import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Home/Homepage";
import VendorPage from "./pages/Vendor/VendorPage";
import OrderTracking from "./pages/OrderTracking/OrderTracking";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/vendor/:id" element={<VendorPage />} />
      <Route path="/order/:id" element={<OrderTracking />} />
    </Routes>
  );
}
