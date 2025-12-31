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
      .populate("items.foodId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * POST a new order
 */
router.post("/", async (req, res) => {
  const { vendorId, items, customerName } = req.body;

  if (!vendorId || !items || !customerName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ error: "Invalid vendor ID" });
  }

  try {
    const newOrder = new Order({
      vendorId,
      items,
      customerName,
      status: "pending",
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

/**
 * GET a single order by ID (for order tracking)
 */
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const order = await Order.findById(orderId).populate("items.foodId");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
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
