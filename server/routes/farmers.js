const express = require("express");
const router = express.Router();

const { getAllFarmers } = require("../controllers/farmerController");

// PUBLIC ROUTE
router.get("/", getAllFarmers);

module.exports = router;
