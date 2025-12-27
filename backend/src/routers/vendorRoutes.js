const express = require("express");
const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");
const Food = require("../models/Food");

const router = express.Router();

// GET all vendors
router.get("/", async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
});

// Vendor login (⚠️ MUST come BEFORE :id)
router.post("/login", async (req, res) => {
  const { vendorNumber } = req.body;

  const vendor = await Vendor.findOne({ vendorNumber });
  if (!vendor) {
    return res.status(404).json({ error: "Vendor number not recognized" });
  }

  res.json({ message: "Login successful", vendorId: vendor._id });
});

// GET vendor + foods
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid vendor ID" });
  }

  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return res.status(404).json({ error: "Vendor not found" });
  }

  const foods = await Food.find({ vendorId: vendor._id });
  res.json({ ...vendor._doc, foods });
});

module.exports = router;
