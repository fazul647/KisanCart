const User = require("../models/User");
const Crop = require("../models/Crop");

exports.getAllFarmers = async (req, res) => {
  try {
    // 1️⃣ get all farmers (public fields only)
    const farmers = await User.find(
      { role: "farmer" },
      "name address"
    );

    // 2️⃣ count products for each farmer
    const farmerData = await Promise.all(
      farmers.map(async (f) => {
        const count = await Crop.countDocuments({ farmer: f._id });

        return {
          _id: f._id,
          name: f.name,
          address: {
            city: f.address?.city || "",
            state: f.address?.state || ""
          },
          productCount: count
        };
      })
    );

    res.json({ farmers: farmerData });
  } catch (err) {
    console.error("Get farmers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
