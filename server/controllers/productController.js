const Crop = require("../models/Crop");
exports.getRecommendations = async (req, res) => {
  try {
    const { category, excludeId } = req.query;

    let products = await Product.find({
      category: { $regex: new RegExp(category, "i") },
      _id: { $ne: excludeId }
    }).limit(6);

    // fallback if empty
    if (products.length === 0) {
      products = await Product.find({
        _id: { $ne: excludeId }
      }).limit(6);
    }

    res.json({ products });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
};