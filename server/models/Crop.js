const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true, // Vegetables, Fruits, Grains
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true, // price per unit
    },

    unit: {
      type: String,
      required: true, // kg, litre, bunch, bag, etc.
    },

    quantityAvailable: {
      type: Number,
      required: true,
    },

    availableUntil: {
      type: Date,
      required: true,
    },

    // ✅ OPTION 3: soft delete / expiry
    isActive: {
      type: Boolean,
      default: true,
    },

    productImages: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);
