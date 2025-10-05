const express = require("express");
const {
  registerBuyer,
  loginBuyer,
  getBuyerProfile,
  deactivateBuyer,
  deleteBuyer,
} = require("../controllers/buyerController");

const { protect } = require("../middleware/authMiddleware"); // same middleware used for sellers

const router = express.Router();

// Public
router.post("/register", registerBuyer);
router.post("/login", loginBuyer);

// Protected
router.get("/profile", protect, getBuyerProfile);
router.put("/deactivate", protect, deactivateBuyer);
router.delete("/delete", protect, deleteBuyer);

module.exports = router;
