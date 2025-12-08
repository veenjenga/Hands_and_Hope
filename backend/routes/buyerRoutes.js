import express from "express";
import {
  registerBuyer,
  loginBuyer,
  getBuyerProfile,
  deactivateBuyer,
  deleteBuyer,
} from "../controllers/buyerController.js";

import authMiddleware from "../middleware/authMiddleware.js"; // same middleware used for sellers

const protect = authMiddleware;
const router = express.Router();

// Public
router.post("/register", registerBuyer);
router.post("/login", loginBuyer);

// Protected
router.get("/profile", protect, getBuyerProfile);
router.put("/deactivate", protect, deactivateBuyer);
router.delete("/delete", protect, deleteBuyer);

export default router;
