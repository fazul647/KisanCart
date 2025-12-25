const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminOnly");
const Crop = require("../models/Crop");
const Order = require("../models/Order");

// 🔹 Get all products (ADMIN)
router.get("/products", auth, adminOnly, async (req, res) => {
  try {
    const products = await Crop.find().populate("farmer", "name email");
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Failed to load products" });
  }
});

// 🔹 Delete product (ADMIN)
router.delete("/products/:id", auth, adminOnly, async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});
router.get("/users", auth, adminOnly, async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json({ users });
    } catch (err) {
      res.status(500).json({ message: "Failed to load users" });
    }
  });
  router.get("/orders", auth, adminOnly, async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("buyer", "name email")
        .populate("farmer", "name email")
        .populate("items.product", "productName price");
  
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ message: "Failed to load orders" });
    }
  });
module.exports = router;
