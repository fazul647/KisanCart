const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Crop",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        pricePerUnit: {          // ✅ FIXED
          type: Number,
          required: true,
        },
      },
    ],
    
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["placed", "accepted", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
