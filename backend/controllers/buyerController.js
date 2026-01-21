import Buyer from "../models/Buyer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT token
const generateToken = (buyer) => {
  return jwt.sign(
    { id: buyer._id, role: "buyer" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// @desc Register buyer
const registerBuyer = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const existingBuyer = await Buyer.findOne({ email });
    if (existingBuyer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newBuyer = await Buyer.create({
      name,
      email,
      password,
      phoneNumber,
    });

    const token = generateToken(newBuyer);
    res.status(201).json({ token, buyer: newBuyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login buyer
const loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const buyer = await Buyer.findOne({ email });

    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(buyer);
    res.json({ token, buyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get buyer profile
const getBuyerProfile = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.user.id).select("-password");
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });
    res.json(buyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Deactivate buyer
const deactivateBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByIdAndUpdate(req.user.id, { isActive: false }, { new: true });
    res.json({ message: "Account deactivated", buyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete buyer account
const deleteBuyer = async (req, res) => {
  try {
    await Buyer.findByIdAndDelete(req.user.id);
    res.json({ message: "Buyer account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerBuyer, loginBuyer, getBuyerProfile, deactivateBuyer, deleteBuyer };
