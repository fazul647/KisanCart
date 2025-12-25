require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Crop = require("./models/Crop");
const Order = require("./models/Order");

const MONGO_URI = process.env.MONGO_URI;

// random helper
const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const categories = ["Fruits", "Vegetables", "Grains"];
const cropNames = ["Tomato", "Potato", "Onion", "Banana", "Apple", "Rice", "Wheat"];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ DB connected");

    // ⚠️ CLEAN OLD DATA
    await User.deleteMany({});
    await Crop.deleteMany({});
    await Order.deleteMany({});
    console.log("🧹 Old data cleared");

    const password = await bcrypt.hash("123456", 10);

    /* ---------------- CREATE FARMERS ---------------- */
    const farmers = [];
    for (let i = 1; i <= 100; i++) {
      farmers.push({
        name: `Farmer ${i}`,
        email: `farmer${i}@gmail.com`,
        phone: `9000000${i}`,
        password,
        role: "farmer"
      });
    }

    const farmerDocs = await User.insertMany(farmers);
    console.log("👨‍🌾 100 Farmers created");

    /* ---------------- CREATE CROPS ---------------- */
    const crops = [];

    farmerDocs.forEach(farmer => {
      const count = rand(2, 5);
      for (let i = 0; i < count; i++) {
        const crop = cropNames[rand(0, cropNames.length - 1)];
        crops.push({
          farmer: farmer._id,
          productName: crop,
          category: categories[rand(0, categories.length - 1)],
          description: `Fresh ${crop}`,
          price: rand(20, 80),
          unit: "kg",
          quantityAvailable: rand(20, 200),
          availableUntil: new Date(Date.now() + 10 * 86400000),
          productImages: [
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
          ],
          isActive: true
        });
      }
    });

    const cropDocs = await Crop.insertMany(crops);
    console.log("🌾 Crops created:", cropDocs.length);

    /* ---------------- CREATE BUYERS ---------------- */
    const buyers = [];
    for (let i = 1; i <= 50; i++) {
      buyers.push({
        name: `Buyer ${i}`,
        email: `buyer${i}@gmail.com`,
        phone: `8000000${i}`,
        password,
        role: "buyer"
      });
    }

    const buyerDocs = await User.insertMany(buyers);
    console.log("🛒 50 Buyers created");

    
    /* ---------------- CREATE ORDERS ---------------- */
const orders = [];

buyerDocs.forEach((buyer) => {
  const orderCount = rand(2, 5); // each buyer 2–5 orders

  for (let i = 0; i < orderCount; i++) {
    const product = cropDocs[rand(0, cropDocs.length - 1)];
    const qty = rand(1, 5);

    orders.push({
      buyer: buyer._id,              // ✅ required
      farmer: product.farmer,        // ✅ required
      items: [
        {
          product: product._id,      // ✅ required
          quantity: qty,              // ✅ required
          pricePerUnit: product.price // ✅ required
        }
      ],
      totalAmount: product.price * qty, // ✅ required
      status: "placed",
      createdAt: new Date()
    });
  }
});

await Order.insertMany(orders);
    console.log("📦 Orders created:", orders.length);

    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY");
    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
}


seed();
