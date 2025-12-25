const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipcode: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  phone: { type: String, required: true },   

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["farmer", "buyer","admin"],   // consumer = buyer
    default: "buyer"
  },

  address: addressSchema
}, { timestamps: true });

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
