require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Crop = require("./models/Crop");

const MONGO_URI = process.env.MONGO_URI;

// ✅ 100% STABLE PIXABAY IMAGES
const cropsPool = [
  {
    productName: "Tomato",
    category: "Vegetables",
    price: 20,
    unit: "kg",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/tomatoes-1238252_1280.jpg"
  },
  {
    productName: "Onion",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    image: "https://cdn.pixabay.com/photo/2016/05/16/22/47/onions-1397037_1280.jpg"
  },
  {
    productName: "Potato",
    category: "Vegetables",
    price: 22,
    unit: "kg",
    image: "https://cdn.pixabay.com/photo/2016/05/06/21/48/potatoes-1376796_1280.jpg"
  },
  {
    productName: "Rice",
    category: "Grains",
    price: 45,
    unit: "kg",
    image: "https://cdn.pixabay.com/photo/2016/11/29/09/32/rice-1869514_1280.jpg"
  },
  {
    productName: "Maize",
    category: "Grains",
    price: 30,
    unit: "kg",
    image: "https://cdn.pixabay.com/photo/2016/10/22/17/46/corn-1761415_1280.jpg"
  },
  {
    productName: "Green Chilli",
    category: "Spices",
    price: 80,
    unit: "kg",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/chili-1238251_1280.jpg"
  },
  {
    productName: "Groundnut",
    category: "Grains",
    price: 60,
    unit: "kg",
    image: "https://cdn.pixabay.com/photo/2016/02/19/10/00/peanuts-1209004_1280.jpg"
  },
  {
    productName: "Cotton",
    category: "Fiber",
    price: 70,
    unit: "kg",
    image: "https://cdn.pixabay.com/photo/2018/01/20/08/33/cotton-3091797_1280.jpg"
  }
];

async function seedCrops() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Atlas connected");

    // 🔥 Clear old crops
    await Crop.deleteMany({});
    console.log("🧹 Old crops deleted");

    // Get farmers (farmer1@gmail.com → farmer8@gmail.com)
    const farmers = await User.find({
      role: "farmer",
      email: { $regex: /^farmer[1-8]@gmail\.com$/ }
    });

    if (farmers.length === 0) {
      console.log("❌ No farmers found");
      process.exit();
    }

    let cropIndex = 0;

    for (const farmer of farmers) {
      for (let i = 0; i < 3; i++) {
        const crop = cropsPool[cropIndex % cropsPool.length];

        await Crop.create({
          productName: crop.productName,
          category: crop.category,
          price: crop.price,
          unit: crop.unit,
          quantityAvailable: 100 + i * 20,
          description: `Fresh ${crop.productName} directly from farmer`,
          farmer: farmer._id,
          productImages: [crop.image],
          availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
        });

        cropIndex++;
      }
    }

    console.log("🎉 Crops seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedCrops();
