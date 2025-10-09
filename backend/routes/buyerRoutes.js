import express from "express";
import {
  registerBuyer,
  loginBuyer,
  getBuyerProfile,
  deactivateBuyer,
  deleteBuyer,
} from "../controllers/buyerController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerBuyer);
router.post("/login", loginBuyer);

// Protected routes
router.get("/profile", authMiddleware, getBuyerProfile);
router.put("/deactivate", authMiddleware, deactivateBuyer);
router.delete("/delete", authMiddleware, deleteBuyer);

export default router;
