import express from "express";
const router = express.Router();   // initialize router
import Product from "../models/Product.js";
import Activity from "../models/Activity.js";
import authMiddleware from "../middleware/authMiddleware.js";

// ==============================
// @desc    Get all products
// @route   GET /api/products
// @access  Public
// ==============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // fetch all from MongoDB
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// ==============================
// @desc    Get products by seller ID
// @route   GET /api/products/seller
// @access  Private (seller only)
// ==============================
router.get("/seller", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching seller products", error: err.message });
  }
});

// ==============================
// @desc    Add a new product (seller)
// @route   POST /api/products
// @access  Private (seller only)
// ==============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, status, category, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newProduct = new Product({
      name,
      price,
      status: status || "Active",
      category: category || "Uncategorized",
      image: image || "https://via.placeholder.com/150",
      sellerId: req.user.id, // 👈 attach seller
    });

    const savedProduct = await newProduct.save();
    
    // Log activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'product_added',
      description: `Added new product: ${savedProduct.name}`,
      productId: savedProduct._id
    });
    await activity.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

// ==============================
// @desc    Delete a product by ID (seller)
// @route   DELETE /api/products/:id
// @access  Private (seller only)
// ==============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check if seller owns the product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();
    
    // Log activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'product_deleted',
      description: `Deleted product: ${product.name}`,
      productId: product._id
    });
    await activity.save();

    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

// ==============================
// @desc    Update a product by ID (seller)
// @route   PUT /api/products/:id
// @access  Private (seller only)
// ==============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, price, status, category, image } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check if seller owns the product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.status = status || product.status;
    product.category = category || product.category;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    
    // Log activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'product_updated',
      description: `Updated product: ${updatedProduct.name}`,
      productId: updatedProduct._id
    });
    await activity.save();

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});

export default router;