import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., 'product_added', 'product_updated', 'order_received'
  description: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Activity", activitySchema);