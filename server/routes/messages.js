const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { sendMessage,getInbox ,replyMessage,getUnreadCount,markAsRead} = require("../controllers/messageController");

router.post("/send", authMiddleware, sendMessage);
router.get("/inbox", authMiddleware, getInbox);
router.post("/reply", authMiddleware, replyMessage);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.patch(
    "/mark-read",
    authMiddleware,
    markAsRead
  );


module.exports = router;
