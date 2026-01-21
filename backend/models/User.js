import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  businessName: String,
  phone: String,
  profilePicture: { type: String, default: "" }, // Add profile picture field
  role: { type: String, enum: ["seller", "admin"], default: "seller" },
  active: { type: Boolean, default: true }, // for deactivate
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);