import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, businessName, phone } = req.body;

    const user = new User({ name, email, password, businessName, phone });
    await user.save();

    // create token on signup
    const secret = process.env.JWT_SECRET || "secretKey";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "1d" });

    res.status(201).json({ message: "User created successfully", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const secret = process.env.JWT_SECRET || "secretKey";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
