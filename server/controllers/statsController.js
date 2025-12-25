const User = require("../models/User");
const Crop = require("../models/Crop");
const Order = require("../models/Order");

exports.getPlatformStats = async (req, res) => {
  try {
    const farmersCount = await User.countDocuments({ role: "farmer" });
    const productsCount = await Crop.countDocuments({ isActive: true });
    const ordersCount = await Order.countDocuments();
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

    res.json({
      farmers: farmersCount,
      products: productsCount,
      orders: ordersCount,
      revenue: revenue

    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
