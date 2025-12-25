const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, productId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver and message text required" });
    }

    const msg = await Message.create({
      sender: senderId,
      receiver: receiverId,
      product: productId || null,
      text,
    });

    res.status(201).json({
      message: "Message sent",
      data: msg,
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getInbox = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const messages = await Message.find({ receiver: userId })
        .populate("sender", "name email phone")
        .populate("product", "productName")
        .sort({ createdAt: -1 });
  
      res.json({ messages });
    } catch (err) {
      console.error("Get inbox error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.replyMessage = async (req, res) => {
    try {
      const senderId = req.user.id; // farmer
      const { receiverId, productId, text } = req.body;
  
      if (!receiverId || !text) {
        return res.status(400).json({ message: "Receiver and text required" });
      }
  
      const msg = await Message.create({
        sender: senderId,
        receiver: receiverId, // buyer
        product: productId || null,
        text,
      });
  
      res.status(201).json({
        message: "Reply sent",
        data: msg,
      });
    } catch (err) {
      console.error("Reply message error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.getUnreadCount = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const count = await Message.countDocuments({
        receiver: userId,
        read: false
      });
  
      res.json({ unread: count });
    } catch (err) {
      console.error("Unread count error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.markAsRead = async (req, res) => {
    try {
      const userId = req.user.id;
  
      await Message.updateMany(
        { receiver: userId, read: false },
        { $set: { read: true } }
      );
  
      res.json({ message: "Messages marked as read" });
    } catch (err) {
      console.error("Mark as read error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  