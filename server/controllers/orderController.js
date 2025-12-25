const Order = require("../models/Order");
const Crop = require("../models/Crop");

exports.checkout = async (req, res) => {
  try {
    // buyer id from token
    const buyerId = req.user.id;

    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 1️⃣ fetch all products from DB
    const productIds = cart.map(i => i.productId);
    const products = await Crop.find({ _id: { $in: productIds } });

    // 2️⃣ group items by farmer
    const ordersByFarmer = {};

    cart.forEach(item => {
      const product = products.find(
        p => p._id.toString() === item.productId
      );

      if (!product) return;

      const farmerId = product.farmer.toString();

      if (!ordersByFarmer[farmerId]) {
        ordersByFarmer[farmerId] = {
          farmer: farmerId,
          items: [],
          totalAmount: 0,
        };
      }

      ordersByFarmer[farmerId].items.push({
        product: product._id,
        quantity: item.quantity,
        pricePerUnit: product.price,   // ✅ correct key
      });
      

      ordersByFarmer[farmerId].totalAmount +=
        product.price * item.quantity;
    });

    // 3️⃣ create orders
    const createdOrders = [];

    for (const farmerId in ordersByFarmer) {
      const o = ordersByFarmer[farmerId];

      const order = await Order.create({
        buyer: buyerId,
        farmer: farmerId,
        items: o.items,
        totalAmount: o.totalAmount,
        status: "placed",
      });

      createdOrders.push(order);
    }

    return res.status(201).json({
      message: "Order placed successfully",
      orders: createdOrders,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getFarmerOrders = async (req, res) => {
    try {
      const farmerId = req.user.id;
  
      const orders = await Order.find({ farmer: farmerId })
        .populate("buyer", "name phone email")
        .populate("items.product", "productName unit")

        .sort({ createdAt: -1 });
  
      return res.json({ orders });
    } catch (err) {
      console.error("Get farmer orders error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  exports.updateOrderStatus = async (req, res) => {
    try {
      const farmerId = req.user.id;
      const { id } = req.params;
      const { status } = req.body;
  
      const allowed = ["accepted", "shipped", "delivered", "cancelled"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      const order = await Order.findOne({ _id: id, farmer: farmerId });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      order.status = status;
      await order.save();
  
      res.json({ message: "Status updated", order });
    } catch (err) {
      console.error("Update order status error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.getFarmerDashboard = async (req, res) => {
    try {
      const farmerId = req.user.id;
  
      const orders = await Order.find({ farmer: farmerId }).populate("buyer", "name phone email");
  
      let totalRevenue = 0;
      let placedCount = 0;
  
      orders.forEach(o => {
        if (o.status === "delivered") {
          totalRevenue += o.totalAmount;
        }
        if (o.status === "placed") {
          placedCount++;
        }
      });
  
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
  
      return res.json({
        totalRevenue,
        placedOrders: placedCount,
        recentOrders
      });
    } catch (err) {
      console.error("Farmer dashboard error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.getBuyerOrders = async (req, res) => {
    try {
      const buyerId = req.user.id;
  
      const orders = await Order.find({ buyer: buyerId })
        .populate("farmer", "name")
        .populate("items.product", "productName unit")
        .sort({ createdAt: -1 });
  
      res.json({ orders });
    } catch (err) {
      console.error("Get buyer orders error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
  exports.getBuyerDashboard = async (req, res) => {
    try {
      const buyerId = req.user.id;
  
      // 1️⃣ ALL BUYER ORDERS
      const orders = await Order.find({ buyer: buyerId })
        .sort({ createdAt: -1 });
  
      // 2️⃣ TOTAL ORDERS COUNT
      const ordersCount = orders.length;
  
      // 3️⃣ TOTAL MONEY SPENT (ONLY DELIVERED)
      let totalSpent = 0;
      orders.forEach(o => {
        if (o.status === "delivered") {
          totalSpent += o.totalAmount;
        }
      });
  
      // 4️⃣ RECENT ORDERS (LAST 5)
      const recentOrders = orders.slice(0, 5);
  
      return res.json({
        ordersCount,
        totalSpent,
        recentOrders
      });
  
    } catch (err) {
      console.error("Buyer dashboard error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  