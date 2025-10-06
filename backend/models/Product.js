const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Active" },
  category: String,
  color: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
