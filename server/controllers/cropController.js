// server/controllers/cropController.js
const Crop = require("../models/Crop");

// Add product (protected route — farmer id comes from auth middleware)
exports.addProduct = async (req, res) => {
  try {
    const farmerId = req.user?.id;
    if (!farmerId) return res.status(401).json({ message: "Unauthorized" });

    const {
      productName,
      category,
      description,
      price,
      unit,
      quantityAvailable,
      availableUntil,
      productImages,
    } = req.body;

    // server-side validation (you made images & availableUntil required in frontend)
    if (
      !productName ||
      !category ||
      price === undefined ||
      !unit ||
      quantityAvailable === undefined ||
      !availableUntil ||
      !productImages ||
      !Array.isArray(productImages) ||
      productImages.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = await Crop.create({
      farmer: farmerId,
      productName,
      category,
      description: description || "",
      price: Number(price),
      unit,
      quantityAvailable: Number(quantityAvailable),
      availableUntil: new Date(availableUntil),
      productImages,
    });

    return res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Public: get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Crop.find({})
      .populate("farmer", "name email") // optional
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ products });
  } catch (err) {
    console.error("Get All Products Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Protected: get products for the logged-in farmer
exports.getMyProducts = async (req, res) => {
  try {
    // 🚨 HARD ROLE CHECK
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can access this" });
    }

    const farmerId = req.user.id;

    // ✅ STRICT FILTER: only THIS farmer's products
    const products = await Crop.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ products });
  } catch (err) {
    console.error("Get My Products Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Crop.findById(id)
      .populate("farmer", "name phone email") // include phone
      .lean();

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ product });
  } catch (err) {
    console.error("Get Product By Id Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check ownership
    if (crop.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await crop.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
exports.getSingleCrop = async (req, res) => {
  try {
    const product = await Crop.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCrop = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { id } = req.params;

    const product = await Crop.findOne({ _id: id, farmer: farmerId });
    if (!product) {
      return res.status(404).json({ message: "Product not found or not authorized" });
    }

    const allowedFields = [
      "productName",
      "price",
      "quantityAvailable",
      "description",
      "availableUntil",
      "category",
      "unit"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("Update crop error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getRecommendations = async (req, res) => {
  try {
    const { category, excludeId } = req.query;

    if (!category) {
      return res.json({ products: [] });
    }

    const products = await Crop.find({
      category: category,
      _id: { $ne: excludeId },
      isActive: true
    })
      .limit(6)
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load recommendations" });
  }
};

