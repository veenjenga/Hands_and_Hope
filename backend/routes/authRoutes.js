import express from "express";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, businessName, phone } = req.body;
    const user = new User({ name, email, password, businessName, phone, role: 'seller' });
    await user.save();
    
    // Generate token for auto-login
    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", { expiresIn: "1d" });
    
    res.status(201).json({ 
      message: "User created successfully",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        businessName: user.businessName,
        profilePicture: user.profilePicture // Include profile picture in response
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Log the incoming request for debugging
    console.log('Login attempt for email:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    console.log('User found:', user.email);
    console.log('Stored password hash:', user.password);
    console.log('Provided password:', password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", { expiresIn: "1d" });
    
    // Log activity
    const activity = new Activity({
      userId: user._id,
      type: 'user_login',
      description: `User ${user.name} logged in`
    });
    await activity.save();

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        businessName: user.businessName,
        profilePicture: user.profilePicture // Include profile picture in response
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;