const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const order = new Order({
      vendorId: req.body.vendorId,
      customerName: req.body.customerName,
      items: req.body.items.map((item) => ({
        foodId: item.foodId,
        quantity: item.quantity,
      })),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL ORDERS FOR A VENDOR (MUST COME FIRST)
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.params.vendorId })
      .populate("items.foodId", "name price")
      .populate("vendorId", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get vendor orders" });
  }
});

// ✅ GET SINGLE ORDER (TRACKING)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.foodId", "name price")
      .populate("vendorId", "name");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get order" });
  }
});

// Update order status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
