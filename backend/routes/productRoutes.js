const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// @desc    Get all products (used by Buyers & Sellers)
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // fetch all from MongoDB
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// @desc    Add a new product (Sellers)
// @route   POST /api/products
// @access  Public (you can later secure this with auth)
router.post("/", async (req, res) => {
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
      image: image || "https://via.placeholder.com/150"
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

// @desc    Delete a product by ID (Sellers)
// @route   DELETE /api/products/:id
// @access  Public (later add auth)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

// @desc    Update a product by ID (optional, Sellers)
// @route   PUT /api/products/:id
// @access  Public (later add auth)
router.put("/:id", async (req, res) => {
  try {
    const { name, price, status, category, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, status, category, image },
      { new: true } // return updated doc
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});

module.exports = router;
