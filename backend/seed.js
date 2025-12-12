require("dotenv").config();
const mongoose = require("mongoose");
const Vendor = require("./src/models/Vendor");
const Food = require("./src/models/Food");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/munchdb";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const seedVendors = [
  {
    vendorNumber: "V001",
    name: "Pizza Place",
    location: "Downtown",
    tags: ["Fast Food", "Italian"],
  },
  {
    vendorNumber: "V002",
    name: "Sushi Spot",
    location: "Uptown",
    tags: ["Japanese", "Seafood"],
  },
  {
    vendorNumber: "V003",
    name: "Vegan Delights",
    location: "Suburbs",
    tags: ["Vegan", "Healthy"],
  },
];

const seedFoods = [
  { vendorNumber: "V001", name: "Margherita", price: 8.99 },
  { vendorNumber: "V001", name: "Pepperoni", price: 9.99 },
  { vendorNumber: "V002", name: "Salmon Roll", price: 12.99 },
  { vendorNumber: "V002", name: "Tuna Nigiri", price: 14.99 },
  { vendorNumber: "V003", name: "Falafel Wrap", price: 7.5 },
  { vendorNumber: "V003", name: "Vegan Burger", price: 9.5 },
];

const seedDB = async () => {
  try {
    // Clear existing data
    await Vendor.deleteMany();
    await Food.deleteMany();

    // Insert vendors
    const insertedVendors = await Vendor.insertMany(seedVendors);

    // Map vendorNumber to _id for foods
    const foodsWithVendorId = seedFoods.map((food) => {
      const vendor = insertedVendors.find(
        (v) => v.vendorNumber === food.vendorNumber
      );
      return {
        vendorId: vendor._id,
        name: food.name,
        price: food.price,
      };
    });

    // Insert foods
    await Food.insertMany(foodsWithVendorId);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
