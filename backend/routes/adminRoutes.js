import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Inquiry from '../models/Inquiry.js';
import School from '../models/School.js';
import Seller from '../models/Seller.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Caregiver from '../models/Caregiver.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// Middleware to check if user is admin or super-admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Middleware to check if user is super-admin
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({ error: 'Access denied. Super admin privileges required.' });
  }
  next();
};

// Apply admin middleware
router.use(requireAdmin);

// GET /api/admin/stats - Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get counts for different user types
    const [
      totalUsers,
      pendingAccounts,
      activeUsers,
      bannedUsers,
      totalProducts,
      pendingProducts,
      totalOrders,
      totalSchools,
      totalTeachers,
      totalStudents
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ active: false }), // Assuming unapproved accounts are inactive
      User.countDocuments({ active: true }),
      User.countDocuments({ banned: true }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'pending' }),
      Order.countDocuments(),
      School.countDocuments(),
      Teacher.countDocuments(),
      Student.countDocuments()
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalUsers,
      pendingAccounts,
      activeUsers,
      bannedUsers,
      totalProducts,
      pendingProducts,
      totalOrders,
      totalSchools,
      totalTeachers,
      totalStudents,
      recentSignups,
      recentOrders
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users - Get all users with filtering and pagination
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      role = '', 
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status === 'active') {
      query.active = true;
      query.banned = { $ne: true };
    } else if (status === 'banned') {
      query.banned = true;
    } else if (status === 'inactive') {
      query.active = false;
    }

    // Exclude super-admins from regular admin view (unless super-admin)
    if (req.user.role !== 'super-admin') {
      query.role = { $ne: 'super-admin' };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Admin get users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/ban - Ban a user
router.put('/users/:id/ban', async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.params.id;

    if (!reason) {
      return res.status(400).json({ error: 'Ban reason is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        banned: true, 
        banReason: reason,
        bannedAt: new Date(),
        bannedBy: req.user.id
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User banned successfully', user });
  } catch (err) {
    console.error('Admin ban user error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/unban - Unban a user
router.put('/users/:id/unban', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        banned: false, 
        banReason: null,
        bannedAt: null,
        bannedBy: null
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User unbanned successfully', user });
  } catch (err) {
    console.error('Admin unban user error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/approve - Approve a pending account
router.put('/users/:id/approve', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { active: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User approved successfully', user });
  } catch (err) {
    console.error('Admin approve user error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id - Delete a user (soft delete)
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Don't allow deleting super-admins
    const user = await User.findById(userId);
    if (user.role === 'super-admin') {
      return res.status(403).json({ error: 'Cannot delete super admin accounts' });
    }

    // Soft delete - mark as inactive
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { active: false, deleted: true, deletedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: updatedUser });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/pending-accounts - Get accounts pending approval
router.get('/pending-accounts', async (req, res) => {
  try {
    const pendingUsers = await User.find({ active: false, banned: { $ne: true } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ pendingAccounts: pendingUsers });
  } catch (err) {
    console.error('Admin get pending accounts error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/pending-products - Get products pending approval
router.get('/pending-products', async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: 'pending' })
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ pendingProducts });
  } catch (err) {
    console.error('Admin get pending products error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/products/:id/approve - Approve a product
router.put('/products/:id/approve', async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(
      productId,
      { status: 'active' },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product approved successfully', product });
  } catch (err) {
    console.error('Admin approve product error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/products/:id/decline - Decline a product
router.put('/products/:id/decline', async (req, res) => {
  try {
    const { reason } = req.body;
    const productId = req.params.id;

    if (!reason) {
      return res.status(400).json({ error: 'Decline reason is required' });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { 
        status: 'declined',
        declineReason: reason,
        declinedAt: new Date(),
        declinedBy: req.user.id
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product declined successfully', product });
  } catch (err) {
    console.error('Admin decline product error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/reports - Get all reports
router.get('/reports', async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    
    let query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const reports = await Inquiry.find(query)
      .populate('reporterId', 'name email')
      .populate('reportedUserId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (err) {
    console.error('Admin get reports error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/reports/:id/status - Update report status
router.put('/reports/:id/status', async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const reportId = req.params.id;

    const validStatuses = ['pending', 'resolved', 'escalated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await Inquiry.findByIdAndUpdate(
      reportId,
      { 
        status,
        resolutionNotes,
        resolvedAt: status === 'resolved' ? new Date() : undefined,
        resolvedBy: status === 'resolved' ? req.user.id : undefined
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report status updated successfully', report });
  } catch (err) {
    console.error('Admin update report status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/transactions - Get transaction history
router.get('/transactions', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type = '', 
      startDate, 
      endDate 
    } = req.query;

    const skip = (page - 1) * limit;

    let query = {};

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      Order.find(query)
        .populate('sellerId', 'name email')
        .populate('buyerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTransactions: total
      }
    });
  } catch (err) {
    console.error('Admin get transactions error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/analytics - Get platform analytics
router.get('/analytics', async (req, res) => {
  try {
    const timeFrame = req.query.timeframe || 'monthly'; // daily, weekly, monthly, yearly
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeFrame) {
      case 'daily':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'yearly':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Get signup stats by role
    const signupStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get transaction volume
    const transactionStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    // Get product stats
    const productStats = await Product.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      signupStats,
      transactionStats: transactionStats[0] || { totalVolume: 0, transactionCount: 0 },
      productStats
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Super Admin only routes
router.use(requireSuperAdmin);

// POST /api/admin/create-admin - Create new admin account
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, role = 'admin' } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate random password
    const tempPassword = Math.random().toString(36).slice(-12);
    
    const newUser = new User({
      name,
      email,
      password: tempPassword,
      role,
      active: true
    });

    await newUser.save();

    // TODO: Send email with temporary password
    console.log(`New admin created: ${email}, temp password: ${tempPassword}`);

    res.status(201).json({
      message: 'Admin account created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/admins - Get all admin accounts
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'super-admin'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ admins });
  } catch (err) {
    console.error('Get admins error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;