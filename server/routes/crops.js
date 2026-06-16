const express = require("express");
const router = express.Router();

const cropController = require("../controllers/cropController");

const authMiddleware = require("../middlewares/authMiddleware");
const farmerOnly = require("../middlewares/farmerOnly");

// Add product
router.post("/add", authMiddleware, cropController.addProduct);

// Get all
router.get("/all", cropController.getAllProducts);

// ✅ IMPORTANT: keep this above /:id
router.get("/recommendations", cropController.getRecommendations);

// Farmer products
router.get("/mine", authMiddleware, cropController.getMyProducts);

// Single product
router.get("/:id", cropController.getProductById);

// Delete & update
router.delete("/:id", authMiddleware, farmerOnly, cropController.deleteCrop);
router.put("/:id", authMiddleware, farmerOnly, cropController.updateCrop);

module.exports = router;