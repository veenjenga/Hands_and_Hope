import express from "express";
import User from "../models/User.js";
import School from "../models/School.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Seller from "../models/Seller.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      businessName,
      phone,
      role = 'seller',
      // school-related
      schoolName,
      registrationNumber,
      schoolAddress,
      schoolContactEmail,
      schoolContactPhone,
      // teacher/student extras
      schoolId,
      schoolEmail,
      subject,
      staffId,
      studentId,
      disabilityId,
    documents = [],
    schoolDocuments = [],
  } = req.body;

    // prevent duplicate emails
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    // Create user record
    const user = new User({ name, email, password, businessName, phone, role, documents });
    await user.save();

    // If seller, create Seller doc to keep sellers in separate collection
    if (role === 'seller') {
      try {
        const seller = new Seller({ user: user._id, businessName, phone, documents });
        await seller.save();
        console.log(`Created Seller ${seller._id} for user ${user._id}`);
        extra.seller = seller;
      } catch (e) {
        console.error('Failed to create seller doc', e);
      }
    }

    let extra = {};

    // If registering a school account, create School doc and link
    if (role === 'school') {
      const school = new School({
        name: schoolName || businessName || `${name}'s School`,
        registrationNumber,
        address: schoolAddress,
        contactEmail: schoolContactEmail || email,
        contactPhone: schoolContactPhone || phone,
        approved: false,
        documents: schoolDocuments,
      });
      await school.save();
      console.log(`Created School ${school._id} for user ${user._id}`);
      // attach school reference to user (optional)
      user.school = school._id;
      await user.save();
      extra.school = school;
    }

    // If teacher, create Teacher record and try to attach to a school
    if (role === 'teacher') {
      let sId = schoolId;
      // If client sent a school name instead of an ObjectId, try to resolve by name
      if (sId && !mongoose.Types.ObjectId.isValid(sId)) {
        const sByName = await School.findOne({ name: sId });
        if (sByName) sId = sByName._id;
        else sId = undefined;
      }
      if (!sId && schoolEmail) {
        const s = await School.findOne({ contactEmail: schoolEmail });
        if (s) sId = s._id;
      }
      if (!sId && schoolName) {
        const s = await School.findOne({ name: schoolName });
        if (s) sId = s._id;
      }
      if (!sId) {
        const any = await School.findOne({});
        if (any) sId = any._id;
      }
      const teacher = new Teacher({ user: user._id, school: sId, subject, staffId, documents });
      await teacher.save();
      console.log(`Created Teacher ${teacher._id} for user ${user._id} attached to school ${sId}`);
      extra.teacher = teacher;
    }

    // If student, create Student record
    if (role === 'student') {
      let sId = schoolId;
      if (sId && !mongoose.Types.ObjectId.isValid(sId)) {
        const sByName = await School.findOne({ name: sId });
        if (sByName) sId = sByName._id;
        else sId = undefined;
      }
      if (!sId && schoolEmail) {
        const s = await School.findOne({ contactEmail: schoolEmail });
        if (s) sId = s._id;
      }
      if (!sId && schoolName) {
        const s = await School.findOne({ name: schoolName });
        if (s) sId = s._id;
      }
      if (!sId) {
        const any = await School.findOne({});
        if (any) sId = any._id;
      }
      const student = new Student({ user: user._id, school: sId, studentId, disabilityId, documents });
      await student.save();
      console.log(`Created Student ${student._id} for user ${user._id} attached to school ${sId}`);
      extra.student = student;
    }

    // create token on signup
    const secret = process.env.JWT_SECRET || "secretKey";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "1d" });

    res.status(201).json({ message: "User created successfully", token, user: { id: user._id, name: user.name, email: user.email, role: user.role }, extra });
  } catch (err) {
    console.error('Signup error', err);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found. Please register first or check your email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password. Please try again." });

    const secret = process.env.JWT_SECRET || "secretKey";
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        role: user.role,
        school: user.school,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
