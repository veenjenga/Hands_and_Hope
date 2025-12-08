import express from "express";
const router = express.Router();
import Activity from "../models/Activity.js";
import authMiddleware from "../middleware/authMiddleware.js";

// ==============================
// @desc    Get recent activity for a user
// @route   GET /api/activity/recent
// @access  Private
// ==============================
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10);
    
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent activity", error: err.message });
  }
});

// ==============================
// @desc    Log a new activity
// @route   POST /api/activity
// @access  Private
// ==============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, description, productId } = req.body;
    
    const newActivity = new Activity({
      userId: req.user.id,
      type,
      description,
      productId
    });
    
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (err) {
    res.status(500).json({ message: "Error logging activity", error: err.message });
  }
});

export default router;