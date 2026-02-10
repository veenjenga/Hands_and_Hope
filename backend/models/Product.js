import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive', 'sold', 'draft'], default: "active" },
    category: { type: String, default: "Uncategorized" },
    description: { type: String },
    stock: { type: Number, default: 1 },
    images: [{ type: String }], // Array of image URLs
    warranty: { type: String },
    refundDeadline: { type: String },
    viewCount: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
    deletedAt: { type: Date }, // When it was deleted
    // Legacy field for backward compatibility
    image: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
