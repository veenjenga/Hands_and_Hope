import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'info', 'success', 'warning', 'error'
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object } // Additional data related to the notification
});

export default mongoose.model("Notification", notificationSchema);