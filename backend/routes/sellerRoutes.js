import express from "express";
import { updateProfile, getProfile, deactivateAccount, deleteAccount } from "../controllers/sellerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const protect = authMiddleware; 

const router = express.Router();

// Get seller profile
router.get("/profile", protect, getProfile);

// Update seller profile
router.put("/profile", protect, updateProfile);

// Deactivate account
router.put("/deactivate", protect, deactivateAccount);

// Delete account
router.delete("/delete", protect, deleteAccount);

export default router;
