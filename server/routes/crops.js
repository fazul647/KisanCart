const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  deleteCrop,
  updateCrop,
  getRecommendations   // ✅ IMPORT THIS
} = require("../controllers/cropController");

const authMiddleware = require("../middlewares/authMiddleware");
const farmerOnly = require("../middlewares/farmerOnly");

// Only logged-in farmers can add product
router.post("/add", authMiddleware, addProduct);

// Public: get all products
router.get("/all", getAllProducts);

// ✅ RECOMMENDATIONS (MUST be ABOVE /:id)
router.get("/recommendations", getRecommendations);

// Logged-in farmer products
router.get("/mine", authMiddleware, getMyProducts);

// Single product
router.get("/:id", getProductById);

// Delete & update
router.delete("/:id", authMiddleware, farmerOnly, deleteCrop);
router.put("/:id", authMiddleware, farmerOnly, updateCrop);

module.exports = router;
