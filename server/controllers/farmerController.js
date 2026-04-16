const User = require("../models/User");
const Crop = require("../models/Crop");

exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" })
      .select("name address profilePic");

    const farmersWithCount = await Promise.all(
      farmers.map(async (farmer) => {
        const productCount = await Crop.countDocuments({
          farmer: farmer._id,
        });

        return {
          ...farmer.toObject(),
          productCount,
        };
      })
    );

    res.json({ farmers: farmersWithCount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching farmers" });
  }
};