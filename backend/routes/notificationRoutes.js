import express from "express";
const router = express.Router();
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Middleware to check if user is admin or super-admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

// ==============================
// @desc    Get notifications for a user
// @route   GET /api/notifications
// @access  Private
// ==============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20);
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
});

// ==============================
// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
// ==============================
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Error updating notification", error: err.message });
  }
});

// ==============================
// @desc    Create a notification (Admin only)
// @route   POST /api/notifications
// @access  Private/Admin
// ==============================
router.post("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { userId, title, message, type, metadata } = req.body;
    
    // Validate required fields
    if (!userId || !title || !message) {
      return res.status(400).json({ message: "User ID, title, and message are required" });
    }
    
    const newNotification = new Notification({
      userId,
      title,
      message,
      type: type || 'info',
      metadata
    });
    
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ message: "Error creating notification", error: err.message });
  }
});

// ==============================
// @desc    Get all notifications (Admin only)
// @route   GET /api/notifications/all
// @access  Private/Admin
// ==============================
router.get("/all", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
});

export default router;