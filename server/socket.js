const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

let io;

const corsOrigins = [
  "http://localhost:5173",
  "https://kisan-cart.vercel.app",
];

function populateMessage(message) {
  return message.populate([
    { path: "sender", select: "name email phone role" },
    { path: "receiver", select: "name email phone role" },
    { path: "product", select: "productName productImages price unit" },
  ]);
}

function emitUnreadChange(userId, delta) {
  if (!io || !userId) return;
  io.to(`user:${userId}`).emit("messages:unread-change", { delta });
}

function emitMessage(message) {
  if (!io || !message) return;

  const payload =
    typeof message.toObject === "function"
      ? message.toObject()
      : message;

  const receiverId =
    payload.receiver?._id?.toString() ||
    payload.receiver?.toString();

  const senderId =
    payload.sender?._id?.toString() ||
    payload.sender?.toString();

  // 📩 Send to receiver
  if (receiverId) {
    io.to(`user:${receiverId}`).emit("message:received", payload);
    emitUnreadChange(receiverId, 1);
  }

  // 📤 Send to sender
  if (senderId) {
    io.to(`user:${senderId}`).emit("message:sent", payload);

    // ✅ NEW: Delivered event
    io.to(`user:${senderId}`).emit("message:delivered", {
      messageId: payload._id,
    });
  }
}

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: corsOrigins,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "dev_jwt_secret_here"
      );

      socket.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
  socket.join(`user:${socket.user.id}`);

  // 📤 SEND MESSAGE
  socket.on("message:send", async (payload, ack) => {
    try {
      const { receiverId, productId, text } = payload || {};

      if (!receiverId || !text?.trim()) {
        if (ack) ack({ ok: false, error: { message: "Invalid data" } });
        return;
      }

      const message = await Message.create({
        sender: socket.user.id,
        receiver: receiverId,
        product: productId || null,
        text: text.trim(),
        status: "sent",
        read: false,
      });

      const populated = await populateMessage(message);
      emitMessage(populated);

      if (ack) ack({ ok: true, message: populated });

    } catch (err) {
      console.error(err);
      if (ack) ack({ ok: false });
    }
  });

  // 👁 MARK READ
  socket.on("messages:mark-read", async (payload) => {
    const messageId = payload?.messageId;

    const messages = await Message.find({
      receiver: socket.user.id,
      read: false,
    });

    await Message.updateMany(
      { receiver: socket.user.id, read: false },
      { $set: { read: true, status: "read" } }
    );

    messages.forEach((msg) => {
      io.to(`user:${msg.sender}`).emit("message:read", {
        messageId: msg._id,
      });
    });
  });

  // 🔥 FIXED: typing event INSIDE connection
  socket.on("typing", ({ receiverId, isTyping }) => {
    if (!receiverId) return;

    io.to(`user:${receiverId}`).emit("typing", {
      userId: socket.user.id,
      isTyping,
    });
  });
});
 return io;}

function getIO() {
  return io;
}

module.exports = {
  initSocket,
  getIO,
  emitMessage,
  emitUnreadChange,
  populateMessage,
};