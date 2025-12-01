import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Seller from '../models/Seller.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';

const router = express.Router();

// Protected middleware to check auth
router.use(authMiddleware);

// GET /api/dashboard/stats - Get dashboard overview stats for logged-in user
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
      profileViews: 0,
      recentListings: [],
      thisMonthSales: 0,
    };

    // If seller or student (both sell products)
    if (userRole === 'seller' || userRole === 'student') {
      const roleDoc = userRole === 'seller' 
        ? await Seller.findOne({ user: userId })
        : await Student.findOne({ user: userId });

      if (roleDoc) {
        // Count products
        const products = await Product.find({ seller: userId });
        stats.totalProducts = products.length;
        stats.activeListings = products.filter(p => p.status === 'active').length;
        
        // Store recent listings (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        stats.recentListings = products
          .filter(p => new Date(p.createdAt) > sevenDaysAgo)
          .map(p => ({ id: p._id, name: p.name, createdAt: p.createdAt }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Count enquiries (simplified - assuming Product has inquiries array or related model)
        stats.totalEnquiries = products.reduce((sum, p) => sum + (p.inquiries?.length || 0), 0);

        // Count sales (simplified - assuming orders or sales records exist)
        // For now, return 0 - you'll need to add Order model and connect it
        stats.totalSales = 0;

        // Profile views (optional tracking - default 0)
        stats.profileViews = 0;

        // This month sales
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        stats.thisMonthSales = 0; // Will need Order model to calculate
      }
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
    res.json(user);
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

// GET /api/dashboard/products - Get user's products/listings
router.get('/products', async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ seller: userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/recent-sales - Get recent orders/sales
router.get('/recent-sales', async (req, res) => {
  try {
    // Placeholder - implement when Order model exists
    res.json({ sales: [], totalThisMonth: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/engagement - Get customer engagement metrics
router.get('/engagement', async (req, res) => {
  try {
    const userId = req.user.id;
    // Placeholder metrics
    const engagement = {
      totalMessages: 0,
      unreadMessages: 0,
      avgResponseTime: 'N/A',
      customerSatisfaction: 0,
      totalCustomers: 0,
    };
    res.json(engagement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
