// server/controllers/statsController.js

const User = require("../models/User");
const Crop = require("../models/Crop");
const Order = require("../models/Order");

exports.getPlatformStats = async (req, res) => {
  try {
    // 🔢 Basic counts
    const farmersCount = await User.countDocuments({ role: "farmer" });
    const productsCount = await Crop.countDocuments();
    const ordersCount = await Order.countDocuments();

    // 💰 Revenue
    const revenueAgg = await Order.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    // 🔥 CATEGORY COUNTS (NO FILTER)
    const categoryAgg = await Crop.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object
    const categories = {};
    categoryAgg.forEach(item => {
      if (item._id) {
        categories[item._id.toLowerCase()] = item.count;
      }
    });

    // ✅ FINAL RESPONSE
    res.json({
      farmers: farmersCount,
      products: productsCount,
      orders: ordersCount,
      revenue,
      categories
    });

  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};