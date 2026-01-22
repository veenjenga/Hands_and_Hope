import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  updateProfile,
  getProfile,
  deactivateAccount,
  deleteAccount,
} from "../controllers/sellerController.js";

const router = express.Router();

// Get seller profile
router.get("/profile", authMiddleware, getProfile);

// Update seller profile
router.put("/profile", authMiddleware, updateProfile);

// Deactivate account
router.put("/deactivate", authMiddleware, deactivateAccount);

// Delete account
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
