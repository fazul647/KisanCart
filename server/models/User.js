const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  phone: { type: String, required: true },   

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["farmer", "buyer","admin"],
    default: "buyer"
  },

  address: {
    type: addressSchema,
    required: true
  },

  // ✅ ADD HERE (inside schema)
  profilePic: {
    type: String,
    default: ""
  }

}, { timestamps: true });

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);