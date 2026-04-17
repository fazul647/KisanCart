const { sendEmail } = require("../utils/sendEmail");
const emailTemplate = require("../utils/emailTemplate");
const Order = require("../models/Order");
const Crop = require("../models/Crop");

// ==========================
// 🛒 CHECKOUT
// ==========================
exports.checkout = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const productIds = cart.map(i => i.productId);
    const products = await Crop.find({ _id: { $in: productIds } });

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
        pricePerUnit: product.price,
      });

      ordersByFarmer[farmerId].totalAmount +=
        product.price * item.quantity;
    });

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

    res.status(201).json({
      message: "Order placed successfully",
      orders: createdOrders,
    });

  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// 👨‍🌾 FARMER ORDERS
// ==========================
exports.getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const orders = await Order.find({ farmer: farmerId })
      .populate("buyer", "name phone email")
      .populate("items.product", "productName unit")
      .sort({ createdAt: -1 });

    res.json({ orders });

  } catch (err) {
    console.error("Get farmer orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// 👤 BUYER ORDERS
// ==========================
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

// ==========================
// 🔄 UPDATE STATUS + EMAIL
// ==========================
exports.updateOrderStatus = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["accepted", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({ _id: id, farmer: farmerId })
      .populate("buyer", "name email")
      .populate("items.product", "productName");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const buyer = order.buyer;

    const productNames = order.items
      .map(i => i.product?.productName)
      .join(", ");

    let subject = "";
    let message = "";

    if (status === "accepted") {
      subject = "Order Accepted 🌾";
      message = `
        <h2>✅ Order Accepted</h2>
        <p>Hello ${buyer.name},</p>
        <p>Your order for <b>${productNames}</b> has been accepted.</p>
      `;
    }

    if (status === "shipped") {
      subject = "Order Shipped 🚚";
      message = `
        <h2>🚚 Order Shipped</h2>
        <p>Hello ${buyer.name},</p>
        <p>Your order for <b>${productNames}</b> is on the way.</p>
      `;
    }

    if (status === "delivered") {
      subject = "Order Delivered 📦";
      message = `
        <h2>📦 Delivered</h2>
        <p>Hello ${buyer.name},</p>
        <p>Your order for <b>${productNames}</b> delivered successfully.</p>
      `;
    }

    if (status === "cancelled") {
      subject = "Order Cancelled ❌";
      message = `
        <h2>❌ Cancelled</h2>
        <p>Hello ${buyer.name},</p>
        <p>Your order for <b>${productNames}</b> has been cancelled.</p>
      `;
    }

    console.log("BUYER:", buyer);
    console.log("EMAIL:", buyer?.email);
    
    if (subject && message && buyer?.email) {
      try {
        await sendEmail(buyer.email, subject, emailTemplate(message));
      } catch (err) {
        console.error("Email error:", err.message);
      }
    }

    res.json({ message: "Status updated", order });

  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// 📊 FARMER DASHBOARD
// ==========================
exports.getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const orders = await Order.find({ farmer: farmerId });

    let totalRevenue = 0;
    let placedCount = 0;

    orders.forEach(o => {
      if (o.status === "delivered") totalRevenue += o.totalAmount;
      if (o.status === "placed") placedCount++;
    });

    res.json({
      totalRevenue,
      placedOrders: placedCount,
      recentOrders: orders.slice(0, 5),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// 📊 BUYER DASHBOARD
// ==========================
exports.getBuyerDashboard = async (req, res) => {
  try {
    const buyerId = req.user.id;

    const orders = await Order.find({ buyer: buyerId })
      .sort({ createdAt: -1 });

    let totalSpent = 0;

    orders.forEach(o => {
      if (o.status === "delivered") {
        totalSpent += o.totalAmount;
      }
    });

    res.json({
      ordersCount: orders.length,
      totalSpent,
      recentOrders: orders.slice(0, 5),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

