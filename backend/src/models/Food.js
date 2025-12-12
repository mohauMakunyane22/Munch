const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Food", FoodSchema);
