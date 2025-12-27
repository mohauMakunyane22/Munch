const express = require("express");
const app = express();
const cors = require("cors");
//const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
connectDB();
//connect to mongodb

//middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://munch-food.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the backend server!");
});

app.use("/vendors", require("./routers/vendorRoutes"));

app.use("/orders", require("./routers/orderRoutes"));

//listening to the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
