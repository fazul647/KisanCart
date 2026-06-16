const Message = require("../models/Message");
const { emitMessage, emitUnreadChange, populateMessage } = require("../socket");

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
      status: "sent",   // ✅ add this
      read: false 
    });
    const populatedMsg = await populateMessage(msg);
    emitMessage(populatedMsg);

    res.status(201).json({
      message: "Message sent",
      data: populatedMsg,
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate("sender", "name email phone role")
      .populate("receiver", "name email phone role")
      .populate("product", "productName productImages price unit")
      .sort({ createdAt: 1 }); // oldest → newest (chat order)

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
        status: "sent",   // ✅ add this
        read: false 
      });
      const populatedMsg = await populateMessage(msg);
      emitMessage(populatedMsg);
  
      res.status(201).json({
        message: "Reply sent",
        data: populatedMsg,
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
  
      const result = await Message.updateMany(
        { receiver: userId, read: false },
        { $set: { read: true } }
      );
      if (result.modifiedCount > 0) {
        emitUnreadChange(userId, -result.modifiedCount);
      }
  
      res.json({ message: "Messages marked as read" });
    } catch (err) {
      console.error("Mark as read error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.markOneAsRead = async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await Message.updateOne(
        { _id: id, receiver: userId, read: false },
        { $set: { read: true } }
      );

      if (result.modifiedCount > 0) {
        emitUnreadChange(userId, -1);
      }

      res.json({ message: "Message marked as read" });
    } catch (err) {
      console.error("Mark one as read error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
   
