const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { checkout, getFarmerOrders, updateOrderStatus,getFarmerDashboard,getBuyerOrders,getBuyerDashboard} = require("../controllers/orderController");

router.get("/farmer", authMiddleware, getFarmerOrders);



router.get("/farmer/dashboard", authMiddleware, getFarmerDashboard);
router.get(
    "/buyer/dashboard",
    authMiddleware,
    getBuyerDashboard
  );

router.post("/checkout", authMiddleware, checkout);
router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.get("/buyer", authMiddleware, getBuyerOrders);


module.exports = router;
