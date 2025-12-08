import express from "express";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, email, businessName, phone, profilePicture } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, businessName, phone, profilePicture },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Log activity
    const activity = new Activity({
      userId: req.user.id,
      type: 'profile_updated',
      description: `User ${updatedUser.name} updated their profile`
    });
    await activity.save();
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;