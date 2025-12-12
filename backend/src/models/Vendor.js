const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  vendorNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String },
  tags: [String],
});

module.exports = mongoose.model("Vendor", VendorSchema);
