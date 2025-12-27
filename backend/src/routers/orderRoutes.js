const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

/**
 * GET orders for a vendor
 */
router.get("/vendor/:vendorId", async (req, res) => {
  const { vendorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ error: "Invalid vendor ID" });
  }

  try {
    const orders = await Order.find({ vendorId })
      .populate("items.foodId") // 🔥 THIS FIXES THE ERROR
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * UPDATE order status
 */
router.put("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

module.exports = router;
