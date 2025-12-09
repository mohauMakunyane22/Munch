const express = require("express");
const app = express();
const cors = require("cors");
//const mongoose = require("mongoose");

const PORT = 5000;
//dummy data
// Vendors
let vendors = [
  {
    id: 1,
    vendorNumber: "V001",
    name: "Pizza Place",
    location: "Downtown",
    tags: ["Fast Food", "Italian"],
  },
  {
    id: 2,
    vendorNumber: "V002",
    name: "Sushi Spot",
    location: "Uptown",
    tags: ["Japanese", "Seafood"],
  },
];

// Foods
let foods = [
  { id: 1, vendorId: 1, name: "Margherita", price: 8.99 },
  { id: 2, vendorId: 1, name: "Pepperoni", price: 9.99 },
  { id: 3, vendorId: 2, name: "Salmon Roll", price: 12.99 },
];

// Orders
let orders = [];

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the backend server!");
});

//get the vendors
app.get("/vendors", (req, res) => {
  res.json(vendors);
});
//get foods by vendor id
app.get("/vendors/:id", (req, res) => {
  const vendorId = parseInt(req.params.id);
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });

  const vendorFoods = foods.filter((f) => f.vendorId === vendorId);
  res.json({ ...vendor, foods: vendorFoods });
});
//create a new order
app.post("/orders", (req, res) => {
  const { vendorId, items, customerName } = req.body;
  const newOrder = {
    id: orders.length + 1,
    vendorId,
    items,
    customerName,
    status: "pending",
    createdAt: new Date(),
  };
  orders.push(newOrder);
  res.json(newOrder);
});
//get order status
app.get("/orders/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

//update order status
app.put("/orders/:id/status", (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;
  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });

  order.status = status;
  res.json(order);
});
//vendor login (dummy)
app.post("/vendor/login", (req, res) => {
  const { vendorNumber } = req.body;
  const vendor = vendors.find((v) => v.vendorNumber === vendorNumber);
  if (!vendor)
    return res.status(404).json({ error: "Vendor number not recognized" });
  res.json({ message: "Login successful", vendorId: vendor.id });
});

app.get("/vendor/orders", (req, res) => {
  res.json(orders); // using your dummy order data
});

//listening to the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
