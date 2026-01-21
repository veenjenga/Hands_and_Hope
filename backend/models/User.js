import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    businessName: String,
    phone: String,
    role: { type: String, enum: ["seller", "teacher", "student", "school", "buyer", "admin", "super-admin", "caregiver"], default: "seller" },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    documents: [
      {
        url: String,
        filename: String,
        mimeType: String,
        size: Number,
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    active: { type: Boolean, default: true }, // for deactivate
    profileViews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
