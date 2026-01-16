import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Inquiry from '../models/Inquiry.js';
import Seller from '../models/Seller.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';

const router = express.Router();

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
      // Count products
      const products = await Product.find({ sellerId: userId });
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
      const inquiries = await Inquiry.find({ sellerId: userId });
      stats.totalEnquiries = inquiries.length;

      // Count completed orders and calculate revenue
      const orders = await Order.find({ sellerId: userId, status: 'completed' });
      stats.totalSales = orders.length;
      stats.totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

      // This month sales and revenue
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthOrders = await Order.find({
        sellerId: userId,
        status: 'completed',
        createdAt: { $gte: monthStart }
      });
      stats.thisMonthSales = monthOrders.length;
      stats.thisMonthRevenue = monthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

      // Daily sales (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const dailyOrders = await Order.find({
        sellerId: userId,
        status: 'completed',
        createdAt: { $gte: oneDayAgo }
      });
      stats.dailySales = dailyOrders.length;

      // Weekly sales (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const weeklyOrders = await Order.find({
        sellerId: userId,
        status: 'completed',
        createdAt: { $gte: weekAgo }
      });
      stats.weeklySales = weeklyOrders.length;

      // Yearly sales
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearlyOrders = await Order.find({
        sellerId: userId,
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
    const products = await Product.find({ sellerId: userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/analytics - Get sales analytics
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Daily stats
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyOrders = await Order.find({
      sellerId: userId,
      status: 'completed',
      createdAt: { $gte: oneDayAgo }
    });
    const dailyStats = {
      total: dailyOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
      count: dailyOrders.length,
      refunds: await Order.countDocuments({ sellerId: userId, refundStatus: 'approved', createdAt: { $gte: oneDayAgo } })
    };

    // Weekly stats
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyOrders = await Order.find({
      sellerId: userId,
      status: 'completed',
      createdAt: { $gte: weekAgo }
    });
    const weeklyStats = {
      total: weeklyOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
      count: weeklyOrders.length,
      refunds: await Order.countDocuments({ sellerId: userId, refundStatus: 'approved', createdAt: { $gte: weekAgo } })
    };

    // Monthly stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = await Order.find({
      sellerId: userId,
      status: 'completed',
      createdAt: { $gte: monthStart }
    });
    const monthlyStats = {
      total: monthlyOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
      count: monthlyOrders.length,
      refunds: await Order.countDocuments({ sellerId: userId, refundStatus: 'approved', createdAt: { $gte: monthStart } })
    };

    // Yearly stats
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearlyOrders = await Order.find({
      sellerId: userId,
      status: 'completed',
      createdAt: { $gte: yearStart }
    });
    const yearlyStats = {
      total: yearlyOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
      count: yearlyOrders.length,
      refunds: await Order.countDocuments({ sellerId: userId, refundStatus: 'approved', createdAt: { $gte: yearStart } })
    };

    // Product views
    const products = await Product.find({ sellerId: userId });
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
    const orders = await Order.find({ sellerId: userId }).sort({ createdAt: -1 }).limit(20);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/inquiries - Get seller's inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await Inquiry.find({ sellerId: userId }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/engagement - Get customer engagement metrics
router.get('/engagement', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Total messages (inquiries)
    const inquiries = await Inquiry.find({ sellerId: userId });
    const unreadInquiries = inquiries.filter(i => i.status === 'new').length;
    
    // Unique customers
    const uniqueCustomers = new Set(
      (await Order.find({ sellerId: userId })).map(o => o.buyerId.toString())
    ).size;

    // Average rating
    const orders = await Order.find({ sellerId: userId, rating: { $exists: true, $ne: null } });
    const avgRating = orders.length > 0
      ? (orders.reduce((sum, o) => sum + o.rating, 0) / orders.length).toFixed(1)
      : 0;

    const engagement = {
      totalMessages: inquiries.length,
      unreadMessages: unreadInquiries,
      avgResponseTime: 'N/A',
      customerSatisfaction: avgRating,
      totalCustomers: uniqueCustomers,
    };
    res.json(engagement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
