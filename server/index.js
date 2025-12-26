require('dotenv').config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const messageRoutes = require("./routes/messages");
const farmerRoutes = require("./routes/farmers");

const app = express();
const port = 5000;

// connect to MongoDB
connectDB();

// CORS middleware (only once)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kisan-cart.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// body parser
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/crops", require("./routes/crops"));
app.use("/api/orders", require("./routes/orders"));


app.use("/api/messages", messageRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/stats", require("./routes/stats"));

app.use("/api/admin", require("./routes/admin"));


// start server
app.listen(port, () => {
  console.log("Server is listening on port 5000");
});
