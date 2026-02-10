import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Inquiry from '../models/Inquiry.js';
import Seller from '../models/Seller.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import School from '../models/School.js';
import Caregiver from '../models/Caregiver.js';
import AssistanceRequest from '../models/AssistanceRequest.js';
import Withdrawal from '../models/Withdrawal.js';
import Refund from '../models/Refund.js';

const router = express.Router();

const buildPermissionsForLevel = (level) => {
  const presets = {
    full: {
      viewProfile: true,
      editProfile: true,
      viewProducts: true,
      manageProducts: true,
      respondToInquiries: true,
      viewFinancials: true,
      withdrawMoney: true,
      manageShipments: true,
      viewAnalytics: true,
      editBio: true,
      editStoreName: true,
    },
    financial_only: {
      viewProfile: true,
      editProfile: false,
      viewProducts: false,
      manageProducts: false,
      respondToInquiries: false,
      viewFinancials: true,
      withdrawMoney: true,
      manageShipments: false,
      viewAnalytics: true,
      editBio: false,
      editStoreName: false,
    },
    product_management: {
      viewProfile: true,
      editProfile: false,
      viewProducts: true,
      manageProducts: true,
      respondToInquiries: true,
      viewFinancials: false,
      withdrawMoney: false,
      manageShipments: true,
      viewAnalytics: true,
      editBio: false,
      editStoreName: false,
    },
    view_only: {
      viewProfile: true,
      editProfile: false,
      viewProducts: true,
      manageProducts: false,
      respondToInquiries: false,
      viewFinancials: true,
      withdrawMoney: false,
      manageShipments: false,
      viewAnalytics: true,
      editBio: false,
      editStoreName: false,
    },
  };

  return presets[level] || presets.full;
};

const resolveSellerIds = async (userId) => {
  const ids = [];
  if (userId) ids.push(String(userId));

  try {
    ids.push(new mongoose.Types.ObjectId(userId));
  } catch (err) {
    // ignore invalid ObjectId
  }

  const seller = await Seller.findOne({ user: userId });
  if (seller?._id) {
    ids.push(seller._id);
    ids.push(String(seller._id));
  }

  return ids;
};

// Protected middleware to check auth
router.use(authMiddleware);

// GET /api/dashboard/stats - Get comprehensive dashboard overview stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get user details
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let stats = {
      name: user.name,
      email: user.email,
      role: userRole,
      phone: user.phone,
      activeListings: 0,
      totalProducts: 0,
      totalEnquiries: 0,
      totalSales: 0,
      totalRevenue: 0,
      profileViews: user.profileViews || 0,
      recentListings: [],
      thisMonthSales: 0,
      thisMonthRevenue: 0,
      dailySales: 0,
      weeklySales: 0,
      yearlySales: 0,
    };

    // If seller or student (both sell products)
    if (userRole === 'seller' || userRole === 'student') {
      const sellerIds = await resolveSellerIds(userId);
      // Count products
      const products = await Product.find({ sellerId: { $in: sellerIds } });
      stats.totalProducts = products.length;
      stats.activeListings = products.filter(p => p.status === 'active').length;
      
      // Store recent listings (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      stats.recentListings = products
        .filter(p => new Date(p.createdAt) > sevenDaysAgo)
        .map(p => ({ id: p._id, name: p.name, price: p.price, createdAt: p.createdAt }))
        .slice(0, 5)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Count enquiries
      const inquiries = await Inquiry.find({ sellerId: { $in: sellerIds } });
      stats.totalEnquiries = inquiries.length;

      // Count completed orders and calculate revenue
      const orders = await Order.find({ sellerId: { $in: sellerIds }, status: 'completed' });
      stats.totalSales = orders.length;
      stats.totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

      // This month sales and revenue
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthOrders = await Order.find({
        sellerId: { $in: sellerIds },
        status: 'completed',
        createdAt: { $gte: monthStart }
      });
      stats.thisMonthSales = monthOrders.length;
      stats.thisMonthRevenue = monthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

      // Daily sales (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const dailyOrders = await Order.find({
        sellerId: { $in: sellerIds },
        status: 'completed',
        createdAt: { $gte: oneDayAgo }
      });
      stats.dailySales = dailyOrders.length;

      // Weekly sales (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const weeklyOrders = await Order.find({
        sellerId: { $in: sellerIds },
        status: 'completed',
        createdAt: { $gte: weekAgo }
      });
      stats.weeklySales = weeklyOrders.length;

      // Yearly sales
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearlyOrders = await Order.find({
        sellerId: { $in: sellerIds },
        status: 'completed',
        createdAt: { $gte: yearStart }
      });
      stats.yearlySales = yearlyOrders.length;
    }

    res.json(stats);
  } catch (err) {
    console.error('Dashboard stats error', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/profile - Get user profile info
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    let schoolName;
    let teacherName;
    let disabilityId;
    let subject;
    let staffId;
    let schoolContactEmail;
    let schoolContactPhone;

    if (user.role === 'student') {
      const student = await Student.findOne({ user: userId }).populate('school');
      disabilityId = student?.disabilityId;
      schoolName = student?.school?.name;

      if (student?.school?._id) {
        const teacher = await Teacher.findOne({ school: student.school._id }).populate('user');
        teacherName = teacher?.user?.name;
      }
    }

    if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: userId }).populate('school');
      schoolName = teacher?.school?.name;
      subject = teacher?.subject;
      staffId = teacher?.staffId;
    }

    if (user.role === 'school') {
      const school = user.school ? await School.findById(user.school) : null;
      schoolName = school?.name;
      schoolContactEmail = school?.contactEmail;
      schoolContactPhone = school?.contactPhone;
    }

    res.json({
      profile: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        joinDate: user.createdAt,
        disabilityId,
        bio: user.bio,
        skills: user.skills || [],
        profilePhoto: user.profilePhoto,
        school: schoolName,
        teacher: teacherName,
        subject,
        staffId,
        schoolContactEmail,
        schoolContactPhone,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/dashboard/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const {
      name,
      email,
      phone,
      address,
      bio,
      skills,
      profilePhoto,
      disabilityId,
    } = req.body || {};

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (bio !== undefined) user.bio = bio;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : String(skills).split(',').map(s => s.trim()).filter(Boolean);
    }

    await user.save();

    if (user.role === 'student' && disabilityId !== undefined) {
      const student = await Student.findOne({ user: userId });
      if (student) {
        student.disabilityId = disabilityId;
        await student.save();
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dashboard/track-view - Increment profile view count
router.post('/track-view', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(userId, { $inc: { profileViews: 1 } }, { new: true });
    res.json({ profileViews: user.profileViews || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/settings - Get account settings
router.get('/settings', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let schoolName;
    if (user.role === 'school' && user.school) {
      const school = await School.findById(user.school);
      schoolName = school?.name;
    }
    if (user.role === 'student') {
      const student = await Student.findOne({ user: userId }).populate('school');
      schoolName = student?.school?.name;
    }
    if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: userId }).populate('school');
      schoolName = teacher?.school?.name;
    }

    res.json({
      account: {
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        schoolName,
      },
      notifications: user.notificationPreferences || { email: true, push: true, inquiryAlerts: true, productApprovals: true },
      regional: user.regionalSettings || { language: 'en', timezone: 'UTC' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/dashboard/settings - Update account settings
router.put('/settings', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { account = {}, notifications, regional } = req.body || {};

    if (account.fullName !== undefined) user.name = account.fullName;
    if (account.email !== undefined) user.email = account.email;
    if (account.phone !== undefined) user.phone = account.phone;

    if (notifications) {
      user.notificationPreferences = {
        email: notifications.email ?? user.notificationPreferences?.email ?? true,
        push: notifications.push ?? user.notificationPreferences?.push ?? true,
        inquiryAlerts: notifications.inquiryAlerts ?? user.notificationPreferences?.inquiryAlerts ?? true,
        productApprovals: notifications.productApprovals ?? user.notificationPreferences?.productApprovals ?? true,
      };
    }

    if (regional) {
      user.regionalSettings = {
        language: regional.language ?? user.regionalSettings?.language ?? 'en',
        timezone: regional.timezone ?? user.regionalSettings?.timezone ?? 'UTC',
      };
    }

    await user.save();

    if (user.role === 'school' && account.schoolName && user.school) {
      await School.findByIdAndUpdate(user.school, { name: account.schoolName });
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/dashboard/settings/password - Update password
router.put('/settings/password', async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/products - Get user's products/listings
router.get('/products', async (req, res) => {
  try {
    const userId = req.user.id;
    const sellerIds = await resolveSellerIds(userId);
    const products = await Product.find({ sellerId: { $in: sellerIds } }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/analytics-summary - Get sales analytics summary
router.get('/analytics-summary', async (req, res) => {
  try {
    const userId = req.user.id;
    const sellerIds = await resolveSellerIds(userId);
    const now = new Date();

    // Daily stats
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyOrders = await Order.find({
      sellerId: { $in: sellerIds },
      status: 'completed',
      createdAt: { $gte: oneDayAgo }
    });
    const dailyStats = {
      total: dailyOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
      count: dailyOrders.length,
      refunds: await Order.countDocuments({ sellerId: { $in: sellerIds }, refundStatus: 'approved', createdAt: { $gte: oneDayAgo } })
    };

    // Weekly stats
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyOrders = await Order.find({
      sellerId: { $in: sellerIds },
      status: 'completed',
      createdAt: { $gte: weekAgo }
    });
    const weeklyStats = {
      total: weeklyOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
      count: weeklyOrders.length,
      refunds: await Order.countDocuments({ sellerId: { $in: sellerIds }, refundStatus: 'approved', createdAt: { $gte: weekAgo } })
    };

    // Monthly stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = await Order.find({
      sellerId: { $in: sellerIds },
      status: 'completed',
      createdAt: { $gte: monthStart }
    });
    const monthlyStats = {
      total: monthlyOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
      count: monthlyOrders.length,
      refunds: await Order.countDocuments({ sellerId: { $in: sellerIds }, refundStatus: 'approved', createdAt: { $gte: monthStart } })
    };

    // Yearly stats
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearlyOrders = await Order.find({
      sellerId: { $in: sellerIds },
      status: 'completed',
      createdAt: { $gte: yearStart }
    });
    const yearlyStats = {
      total: yearlyOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
      count: yearlyOrders.length,
      refunds: await Order.countDocuments({ sellerId: { $in: sellerIds }, refundStatus: 'approved', createdAt: { $gte: yearStart } })
    };

    // Product views
    const products = await Product.find({ sellerId: { $in: sellerIds } });
    const productViews = {
      daily: products.reduce((sum, p) => sum + (p.viewCount || 0), 0),
      weekly: products.reduce((sum, p) => sum + (p.viewCount || 0), 0),
      monthly: products.reduce((sum, p) => sum + (p.viewCount || 0), 0),
      yearly: products.reduce((sum, p) => sum + (p.viewCount || 0), 0)
    };

    res.json({
      daily: dailyStats,
      weekly: weeklyStats,
      monthly: monthlyStats,
      yearly: yearlyStats,
      productViews
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/orders - Get seller's orders
router.get('/orders', async (req, res) => {
  try {
    const userId = req.user.id;
    const sellerIds = await resolveSellerIds(userId);
    const orders = await Order.find({ sellerId: { $in: sellerIds } }).sort({ createdAt: -1 }).limit(20);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/inquiries - Get seller's inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const userId = req.user.id;
    const sellerIds = await resolveSellerIds(userId);

    const sellerMatch = [
      { sellerId: { $in: sellerIds } },
      { seller: { $in: sellerIds } },
      { seller_id: { $in: sellerIds } },
    ];

    const inquiries = await Inquiry.find({ $or: sellerMatch })
      .populate('buyerId', 'name email')
      .populate('productId', 'name images image')
      .sort({ createdAt: -1 });

    const mapped = inquiries.map(inquiry => ({
      id: inquiry._id,
      customerName: inquiry.buyerId?.name || inquiry.buyerName || 'Unknown Buyer',
      customerEmail: inquiry.buyerId?.email || inquiry.buyerEmail || 'unknown@example.com',
      customerAvatar: undefined,
      productName: inquiry.productId?.name || inquiry.productName || 'Unknown Product',
      productImage: inquiry.productId?.images?.[0] || inquiry.productId?.image || '',
      message: inquiry.message || 'Product inquiry',
      timestamp: inquiry.timestamp || inquiry.createdAt,
      status: inquiry.status === 'archived' ? 'archived' : inquiry.status === 'replied' ? 'replied' : 'pending',
      priority: 'medium',
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/dashboard/inquiries/:id/reply - Reply to inquiry
router.put('/inquiries/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body || {};

    if (!message) return res.status(400).json({ error: 'Reply message is required' });

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    inquiry.replies = inquiry.replies || [];
    inquiry.replies.push({ message, responder: 'seller' });
    inquiry.status = 'replied';
    await inquiry.save();

    res.json({ message: 'Reply saved', inquiryId: inquiry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/dashboard/inquiries/:id/archive - Archive inquiry
router.put('/inquiries/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    inquiry.status = 'archived';
    await inquiry.save();

    res.json({ message: 'Inquiry archived', inquiryId: inquiry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/dashboard/inquiries/:id - Delete inquiry
router.delete('/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Inquiry.findByIdAndDelete(id);
    res.json({ message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// GET /api/dashboard/caregivers - List caregivers for current account
router.get('/caregivers', async (req, res) => {
  try {
    const userId = req.user.id;
    const caregivers = await Caregiver.find({ 'managedAccounts.accountId': userId })
      .populate('user', 'name email');

    const list = caregivers.map(cg => {
      const managed = cg.managedAccounts.find(m => String(m.accountId) === String(userId));
      const relevantLogs = (cg.activityLog || []).filter(a => String(a.accountId) === String(userId));
      const lastAction = relevantLogs[0]?.timestamp;

      return {
        id: cg._id,
        userId: cg.user?._id,
        fullName: cg.user?.name,
        email: cg.user?.email,
        relationshipType: managed?.relationshipType,
        relationshipDetails: managed?.relationshipDetails,
        addedDate: managed?.addedAt,
        lastLogin: managed?.lastLogin,
        status: managed?.status || 'pending',
        permissionLevel: managed?.permissionLevel || 'view_only',
        permissions: managed?.permissions || buildPermissionsForLevel('view_only'),
        totalActions: relevantLogs.length,
        lastActionDate: lastAction,
      };
    });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/caregivers/activity - Activity log for current account
router.get('/caregivers/activity', async (req, res) => {
  try {
    const userId = req.user.id;
    const caregivers = await Caregiver.find({ 'managedAccounts.accountId': userId })
      .populate('user', 'name');

    const logs = caregivers.flatMap(cg => (cg.activityLog || [])
      .filter(a => String(a.accountId) === String(userId))
      .map(a => ({
        activityId: a._id,
        caregiverName: cg.user?.name,
        action: a.action,
        actionDetails: a.details,
        timestamp: a.timestamp,
        resourceType: a.resourceType || 'activity',
        resourceName: a.resourceName,
      }))
    );

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dashboard/caregivers - Add caregiver
router.post('/caregivers', async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email, relationshipType, relationshipDetails, permissionLevel, permissions } = req.body || {};

    if (!fullName || !email) return res.status(400).json({ error: 'Full name and email are required' });

    let caregiverUser = await User.findOne({ email });
    let tempPassword;

    if (!caregiverUser) {
      tempPassword = generateTempPassword();
      caregiverUser = await User.create({
        name: fullName,
        email,
        password: tempPassword,
        role: 'caregiver'
      });
    }

    let caregiver = await Caregiver.findOne({ user: caregiverUser._id });
    if (!caregiver) caregiver = await Caregiver.create({ user: caregiverUser._id, phone: caregiverUser.phone });

    const existing = caregiver.managedAccounts.find(m => String(m.accountId) === String(userId));
    if (existing) return res.status(400).json({ error: 'Caregiver already linked to this account' });

    caregiver.managedAccounts.push({
      accountId: userId,
      accountType: req.user.role === 'student' ? 'student_seller' : 'individual_seller',
      permissionLevel: permissionLevel || 'view_only',
      relationshipType,
      relationshipDetails,
      status: 'pending',
      permissions: permissions || buildPermissionsForLevel(permissionLevel || 'view_only')
    });

    await caregiver.save();

    res.json({
      message: 'Caregiver added',
      caregiver: {
        id: caregiver._id,
        userId: caregiverUser._id,
        fullName: caregiverUser.name,
        email: caregiverUser.email,
      },
      tempPassword,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/dashboard/caregivers/:caregiverId/permissions - Update permissions
router.put('/caregivers/:caregiverId/permissions', async (req, res) => {
  try {
    const userId = req.user.id;
    const { caregiverId } = req.params;
    const { permissionLevel, permissions } = req.body || {};

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) return res.status(404).json({ error: 'Caregiver not found' });

    const managed = caregiver.managedAccounts.find(m => String(m.accountId) === String(userId));
    if (!managed) return res.status(404).json({ error: 'Caregiver not linked to this account' });

    managed.permissionLevel = permissionLevel || managed.permissionLevel;
    managed.permissions = permissions || buildPermissionsForLevel(permissionLevel || managed.permissionLevel);
    managed.status = 'active';

    await caregiver.save();
    res.json({ message: 'Permissions updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/dashboard/caregivers/:caregiverId - Remove caregiver from this account
router.delete('/caregivers/:caregiverId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { caregiverId } = req.params;

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) return res.status(404).json({ error: 'Caregiver not found' });

    caregiver.managedAccounts = caregiver.managedAccounts.filter(m => String(m.accountId) !== String(userId));
    if (caregiver.managedAccounts.length === 0) caregiver.isActive = false;
    await caregiver.save();

    res.json({ message: 'Caregiver removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/withdrawals - Get withdrawal data
router.get('/withdrawals', async (req, res) => {
  try {
    const userId = req.user.id;
    const sellerIds = await resolveSellerIds(userId);

    // Get all orders for this seller
    const orders = await Order.find({ sellerId: { $in: sellerIds } }).populate('buyerId', 'name email');

    // Calculate balances
    const completedStatuses = new Set(['completed', 'delivered']);
    const pendingStatuses = new Set(['pending', 'processing', 'in_transit', 'awaiting_delivery']);

    const completedOrders = orders.filter(o => completedStatuses.has(o.status));
    const pendingOrders = orders.filter(o => pendingStatuses.has(o.status) || !o.status);

    const availableBalance = completedOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
    const onHoldBalance = pendingOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

    // Get pending deliveries (pending orders with details)
    const pendingDeliveries = pendingOrders.map(order => ({
      id: order._id,
      orderId: order._id,
      productName: order.productName || 'Unknown Product',
      buyerName: order.buyerName || order.buyerId?.name || 'Unknown Buyer',
      buyerEmail: order.buyerEmail || order.buyerId?.email || 'unknown@example.com',
      amount: Number(order.amount || 0),
      quantity: order.quantity || 1,
      status: order.status || 'pending',
      orderDate: order.createdAt,
      shippingMethod: order.shippingMethod,
      trackingNumber: order.trackingNumber,
    }));

    // Try to fetch withdrawal requests from DB; fallback to mock data if unavailable
    let withdrawalRequests = [];
    let completedWithdrawals = [];
    try {
      const withdrawalMatch = {
        $or: [
          { sellerId: { $in: sellerIds } },
          { userId: { $in: sellerIds } },
          { seller: { $in: sellerIds } },
        ]
      };

      withdrawalRequests = await Withdrawal.find({
        ...withdrawalMatch,
        status: { $ne: 'completed' }
      }).sort({ requestDate: -1 });

      completedWithdrawals = await Withdrawal.find({
        ...withdrawalMatch,
        status: 'completed'
      }).sort({ completedDate: -1 });

      const normalizeMethod = (method) => {
        const value = String(method || '').toLowerCase();
        if (value.includes('bank')) return 'bank';
        if (value.includes('mobile')) return 'mobile';
        return value || 'bank';
      };

      // Map to expected frontend shape
      withdrawalRequests = withdrawalRequests.map(w => ({
        id: w._id,
        amount: w.amount,
        method: normalizeMethod(w.method),
        bankName: w.bankName || w.bank,
        accountNumber: w.accountNumber || w.account,
        accountHolder: w.accountHolder,
        provider: w.provider,
        phoneNumber: w.phoneNumber || w.phone,
        status: w.status,
        requestDate: w.requestDate,
        approvalDate: w.approvalDate,
      }));

      completedWithdrawals = completedWithdrawals.map(w => ({
        id: w._id,
        amount: w.amount,
        method: normalizeMethod(w.method),
        bankName: w.bankName || w.bank,
        accountNumber: w.accountNumber || w.account,
        provider: w.provider,
        phoneNumber: w.phoneNumber || w.phone,
        status: w.status,
        date: w.completedDate || w.requestDate || w.date,
      }));
    } catch (err) {
      // Fallback mocks when DB read fails or no model exists
      withdrawalRequests = [
        {
          id: 'wr1',
          amount: 150.0,
          method: 'bank',
          bankName: 'KCB Bank',
          accountNumber: '1234567890',
          accountHolder: 'John Doe',
          status: 'pending',
          requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'wr2',
          amount: 250.0,
          method: 'mobile',
          provider: 'Safaricom',
          phoneNumber: '0712345678',
          status: 'approved',
          requestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          approvalDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ];

      completedWithdrawals = [
        {
          id: 'w1',
          amount: 450.0,
          method: 'mobile',
          provider: 'Safaricom',
          phoneNumber: '0712345678',
          status: 'completed',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'w2',
          amount: 280.5,
          method: 'bank',
          bankName: 'KCB Bank',
          accountNumber: '1234567890',
          status: 'completed',
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
      ];
    }

    res.json({
      availableBalance,
      onHoldBalance,
      totalEarnings: availableBalance + onHoldBalance,
      pendingDeliveries,
      withdrawalRequests,
      completedWithdrawals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/messages - Get buyer messages
router.get('/messages', async (req, res) => {
  try {
    const userId = req.user.id;
    const sellerIds = await resolveSellerIds(userId);

    // Get inquiries from buyers
    const inquiries = await Inquiry.find({ 
      $or: [
        { sellerId: { $in: sellerIds } },
        { seller: { $in: sellerIds } },
        { seller_id: { $in: sellerIds } },
        { buyerId: { $in: sellerIds } },
        { buyer: { $in: sellerIds } },
        { buyer_id: { $in: sellerIds } },
      ]
    })
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('productId', 'name')
      .sort({ createdAt: -1 });

    const messages = inquiries.map(inquiry => {
      const fromName = inquiry.buyerId?.name || inquiry.buyerName || inquiry.sellerId?.name || inquiry.sellerName || 'Unknown Buyer';
      const fromEmail = inquiry.buyerId?.email || inquiry.buyerEmail || inquiry.sellerId?.email || inquiry.sellerEmail || 'unknown@example.com';
      const unread = typeof inquiry.unread === 'boolean' ? inquiry.unread : inquiry.status === 'new';
      return {
        id: inquiry._id,
        from: fromName,
        fromEmail,
        fromAvatar: fromName?.charAt(0)?.toUpperCase() || 'U',
        message: inquiry.message || 'Product inquiry',
        productName: inquiry.productId?.name || inquiry.productName || 'Unknown Product',
        timestamp: inquiry.timestamp || inquiry.createdAt,
        unread,
        status: inquiry.status || (unread ? 'new' : 'read'),
      };
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dashboard/assistance/teacher - Student sends message to teacher
router.post('/assistance/teacher', async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, message } = req.body || {};

    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });

    const student = await Student.findOne({ user: userId }).populate('school');
    if (!student) return res.status(404).json({ error: 'Student record not found' });

    const teacher = student.school?._id
      ? await Teacher.findOne({ school: student.school._id }).populate('user')
      : null;

    if (!teacher?.user?._id) {
      return res.status(404).json({ error: 'No teacher found for this school' });
    }

    await AssistanceRequest.create({
      studentId: userId,
      teacherId: teacher.user._id,
      schoolId: student.school?._id,
      subject,
      message,
      status: 'pending'
    });

    res.json({ message: 'Message sent to teacher' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dashboard/assistance/school - Student sends message to school administration
router.post('/assistance/school', async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, message } = req.body || {};

    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });

    const student = await Student.findOne({ user: userId });
    if (!student?.school) return res.status(404).json({ error: 'School not found for this student' });

    await AssistanceRequest.create({
      studentId: userId,
      schoolId: student.school,
      subject,
      message,
      status: 'pending'
    });

    res.json({ message: 'Message sent to school administration' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/analytics - Get detailed analytics
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user.id;
    const sellerIds = await resolveSellerIds(userId);
    const timePeriod = req.query.period || 'monthly'; // daily, weekly, monthly, yearly

    // Determine date range
    let dateFrom = new Date();
    switch (timePeriod) {
      case 'daily':
        dateFrom.setDate(dateFrom.getDate() - 1);
        break;
      case 'weekly':
        dateFrom.setDate(dateFrom.getDate() - 7);
        break;
      case 'monthly':
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        break;
      case 'yearly':
        dateFrom.setFullYear(dateFrom.getFullYear() - 1);
        break;
    }

    // Get orders in period
    const orders = await Order.find({
      sellerId: { $in: sellerIds },
      createdAt: { $gte: dateFrom },
    });

    // Get all products for this seller
    const products = await Product.find({ sellerId: { $in: sellerIds }, isDeleted: { $ne: true } });

    // Calculate analytics
    const totalSales = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const orderCount = orders.length;
    const refundCount = orders.filter(o => o.refundStatus === 'approved').length;
    const totalProductViews = products.reduce((sum, p) => sum + (p.viewCount || 0), 0);

    // Sold out products (status = 'sold')
    const soldOutProducts = products
      .filter(p => p.status === 'sold')
      .map(p => ({
        id: p._id,
        productName: p.name,
        lastSoldDate: p.updatedAt,
        totalSold: orders.filter(o => o.productId === p._id).length,
        avgTimeToSellOut: 'N/A',
      }));

    const analytics = {
      timePeriod,
      dateRange: {
        from: dateFrom,
        to: new Date(),
      },
      sales: {
        total: totalSales.toFixed(2),
        count: orderCount,
        average: (orderCount > 0 ? (totalSales / orderCount).toFixed(2) : 0),
      },
      orders: {
        total: orderCount,
        completed: orders.filter(o => o.status === 'completed').length,
        pending: orders.filter(o => o.status === 'pending').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      },
      productViews: totalProductViews,
      refunds: {
        count: refundCount,
        totalAmount: orders
          .filter(o => o.refundStatus === 'approved')
          .reduce((sum, o) => sum + (o.amount || 0), 0)
          .toFixed(2),
      },
      soldOutProducts,
      conversionRate: products.length > 0 ? ((orderCount / products.length) * 100).toFixed(2) : 0,
    };

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/refunds - Get refund data
router.get('/refunds', async (req, res) => {
  try {
    const userId = req.user.id;
    const sellerIds = await resolveSellerIds(userId);

    const refundStatuses = ['requested', 'approved', 'rejected', 'pending'];
    const orders = await Order.find({ 
      sellerId: { $in: sellerIds },
      $or: [
        { refundStatus: { $in: refundStatuses } },
        { status: 'refunded' },
        { refundReason: { $exists: true, $ne: '' } }
      ]
    })
      .populate('buyerId', 'name email')
      .populate('productId', 'name')
      .sort({ createdAt: -1 });

    const refunds = await Refund.find({
      $or: [
        { sellerId: { $in: sellerIds } },
        { userId: { $in: sellerIds } },
        { seller: { $in: sellerIds } },
      ]
    })
      .populate('buyerId', 'name email')
      .populate('productId', 'name')
      .sort({ createdAt: -1 });

    const normalizeStatus = (order) => {
      const raw = String(order.refundStatus || '').toLowerCase();
      if (raw === 'pending') return 'requested';
      if (raw) return raw;
      if (order.status === 'refunded') return 'approved';
      if (order.status === 'cancelled') return 'rejected';
      if (order.refundReason) return 'requested';
      return 'requested';
    };

    const orderPendingRefunds = orders
      .filter(o => normalizeStatus(o) === 'requested')
      .map(o => ({
        id: o._id,
        productName: o.productName || o.productId?.name || 'Unknown Product',
        buyerName: o.buyerName || o.buyerId?.name || 'Unknown Buyer',
        buyerEmail: o.buyerEmail || o.buyerId?.email || 'unknown@example.com',
        amount: Number(o.amount || 0),
        reason: o.refundReason || 'Not specified',
        requestDate: o.createdAt,
        status: 'pending',
      }));

    const orderApprovedRefunds = orders
      .filter(o => normalizeStatus(o) === 'approved')
      .map(o => ({
        id: o._id,
        productName: o.productName || o.productId?.name || 'Unknown Product',
        buyerName: o.buyerName || o.buyerId?.name || 'Unknown Buyer',
        buyerEmail: o.buyerEmail || o.buyerId?.email || 'unknown@example.com',
        amount: Number(o.amount || 0),
        reason: o.refundReason || 'Not specified',
        requestDate: o.createdAt,
        approvalDate: o.updatedAt,
        status: 'approved',
      }));

    const refundRecords = refunds.map(r => {
      const status = String(r.status || 'pending').toLowerCase();
      return {
        id: r._id,
        productName: r.productName || r.productId?.name || 'Unknown Product',
        buyerName: r.buyerName || r.buyerId?.name || 'Unknown Buyer',
        buyerEmail: r.buyerEmail || r.buyerId?.email || 'unknown@example.com',
        amount: Number(r.amount || 0),
        reason: r.reason || 'Not specified',
        requestDate: r.date || r.createdAt,
        approvalDate: r.updatedAt,
        status: status === 'approved' ? 'approved' : 'pending',
      };
    });

    const pendingRefunds = [
      ...orderPendingRefunds,
      ...refundRecords.filter(r => r.status === 'pending')
    ];

    const approvedRefunds = [
      ...orderApprovedRefunds,
      ...refundRecords.filter(r => r.status === 'approved')
    ];

    const totalRefundsPending = pendingRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalRefundsApproved = approvedRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);
    const allRefunds = pendingRefunds.length + approvedRefunds.length;

    const refundStats = {
      pendingCount: pendingRefunds.length,
      approvedCount: approvedRefunds.length,
      totalPending: totalRefundsPending.toFixed(2),
      totalApproved: totalRefundsApproved.toFixed(2),
      refundRate: orders.length > 0 ? ((allRefunds / orders.length) * 100).toFixed(2) : '0.00',
      allRefunds,
    };

    res.json({
      pending: pendingRefunds,
      approved: approvedRefunds,
      stats: refundStats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
