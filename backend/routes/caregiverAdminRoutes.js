import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Caregiver from '../models/Caregiver.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

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

// Apply admin middleware
router.use(requireAdmin);

// GET /api/admin/caregivers - Get all caregivers with their managed accounts
router.get('/caregivers', async (req, res) => {
  try {
    const caregivers = await Caregiver.find({})
      .populate({
        path: 'user',
        select: 'name email phone createdAt'
      })
      .populate({
        path: 'managedAccounts.accountId',
        select: 'name email role'
      });

    const formattedCaregivers = caregivers.map(caregiver => ({
      caregiverId: caregiver._id,
      caregiverName: caregiver.user.name,
      caregiverEmail: caregiver.user.email,
      phone: caregiver.phone,
      relationshipType: caregiver.relationshipType || 'caregiver',
      joinDate: caregiver.user.createdAt,
      managedAccounts: caregiver.managedAccounts.map(account => ({
        accountId: account.accountId._id,
        accountOwnerName: account.accountId.name,
        accountOwnerEmail: account.accountId.email,
        accountType: account.accountType,
        permissionLevel: account.permissionLevel,
        permissions: account.permissions,
        status: account.status || 'active',
        addedDate: account.addedAt
      })),
      totalManagedAccounts: caregiver.managedAccounts.length,
      status: 'active' // Could be determined by account status
    }));

    res.json(formattedCaregivers);
  } catch (error) {
    console.error('Error fetching caregivers:', error);
    res.status(500).json({ error: 'Failed to fetch caregivers' });
  }
});

// GET /api/admin/caregivers/:caregiverId - Get specific caregiver details
router.get('/caregivers/:caregiverId', async (req, res) => {
  try {
    const { caregiverId } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caregiverId)) {
      return res.status(400).json({ error: 'Invalid caregiver ID' });
    }

    const caregiver = await Caregiver.findById(caregiverId)
      .populate({
        path: 'user',
        select: 'name email phone createdAt'
      })
      .populate({
        path: 'managedAccounts.accountId',
        select: 'name email role'
      });

    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    const formattedCaregiver = {
      caregiverId: caregiver._id,
      caregiverName: caregiver.user.name,
      caregiverEmail: caregiver.user.email,
      phone: caregiver.phone,
      relationshipType: caregiver.relationshipType || 'caregiver',
      joinDate: caregiver.user.createdAt,
      managedAccounts: caregiver.managedAccounts.map(account => ({
        accountId: account.accountId._id,
        accountOwnerName: account.accountId.name,
        accountOwnerEmail: account.accountId.email,
        accountType: account.accountType,
        permissionLevel: account.permissionLevel,
        permissions: account.permissions,
        status: account.status || 'active',
        addedDate: account.addedAt
      })),
      totalManagedAccounts: caregiver.managedAccounts.length,
      activityLog: caregiver.activityLog || [],
      status: 'active'
    };

    res.json(formattedCaregiver);
  } catch (error) {
    console.error('Error fetching caregiver:', error);
    res.status(500).json({ error: 'Failed to fetch caregiver' });
  }
});

// GET /api/admin/caregivers/:caregiverId/activity - Get caregiver activity log
router.get('/caregivers/:caregiverId/activity', async (req, res) => {
  try {
    const { caregiverId } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caregiverId)) {
      return res.status(400).json({ error: 'Invalid caregiver ID' });
    }

    const caregiver = await Caregiver.findById(caregiverId);
    
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    // Format activity log
    const formattedActivities = (caregiver.activityLog || []).map(activity => ({
      activityId: activity._id || `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      caregiverName: caregiver.user.name,
      action: activity.action,
      actionDetails: activity.details,
      timestamp: activity.timestamp,
      resourceType: activity.resourceType,
      resourceName: activity.resourceName,
      accountId: activity.accountId,
      flagged: activity.flagged || false
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching caregiver activity:', error);
    res.status(500).json({ error: 'Failed to fetch caregiver activity' });
  }
});

// POST /api/admin/caregivers - Create a new caregiver account
router.post('/caregivers', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      relationshipType,
      password = 'Caregiver123!', // Default password for caregivers
      managedAccounts = [] // Array of account IDs to manage
    } = req.body;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user account
    const user = new User({
      name: fullName,
      email,
      password: hashedPassword,
      phone,
      role: 'caregiver'
    });

    await user.save();

    // Create caregiver document
    const caregiver = new Caregiver({
      user: user._id,
      phone,
      relationshipType: relationshipType || 'caregiver',
      managedAccounts: managedAccounts.map(account => ({
        accountId: account.accountId,
        accountType: account.accountType || 'individual_seller',
        permissionLevel: account.permissionLevel || 'view_only',
        permissions: account.permissions || {
          canViewProducts: true,
          canEditProducts: false,
          canDeleteProducts: false,
          canViewOrders: true,
          canManageOrders: false,
          canViewInquiries: true,
          canReplyToInquiries: false,
          canWithdrawFunds: false,
          canViewAnalytics: false,
          canManagePermissions: false,
          canRemoveAccount: false
        },
        status: account.status || 'active',
        addedAt: new Date()
      }))
    });

    await caregiver.save();

    res.json({
      success: true,
      message: 'Caregiver account created successfully',
      caregiverId: caregiver._id,
      userId: user._id
    });
  } catch (error) {
    console.error('Error creating caregiver:', error);
    res.status(500).json({ error: 'Failed to create caregiver account' });
  }
});

// PUT /api/admin/caregivers/:caregiverId - Update caregiver details
router.put('/caregivers/:caregiverId', async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const { phone, relationshipType, managedAccounts } = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caregiverId)) {
      return res.status(400).json({ error: 'Invalid caregiver ID' });
    }

    const caregiver = await Caregiver.findById(caregiverId);
    
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    // Update fields if provided
    if (phone !== undefined) caregiver.phone = phone;
    if (relationshipType !== undefined) caregiver.relationshipType = relationshipType;
    if (managedAccounts !== undefined) {
      caregiver.managedAccounts = managedAccounts.map(account => ({
        accountId: account.accountId,
        accountType: account.accountType || 'individual_seller',
        permissionLevel: account.permissionLevel || 'view_only',
        permissions: account.permissions || {
          canViewProducts: true,
          canEditProducts: false,
          canDeleteProducts: false,
          canViewOrders: true,
          canManageOrders: false,
          canViewInquiries: true,
          canReplyToInquiries: false,
          canWithdrawFunds: false,
          canViewAnalytics: false,
          canManagePermissions: false,
          canRemoveAccount: false
        },
        status: account.status || 'active',
        addedAt: account.addedAt || new Date()
      }));
    }

    await caregiver.save();

    // Also update the user record if needed
    if (phone !== undefined) {
      await User.findByIdAndUpdate(caregiver.user, { phone });
    }

    res.json({
      success: true,
      message: 'Caregiver updated successfully'
    });
  } catch (error) {
    console.error('Error updating caregiver:', error);
    res.status(500).json({ error: 'Failed to update caregiver' });
  }
});

// DELETE /api/admin/caregivers/:caregiverId - Remove caregiver account
router.delete('/caregivers/:caregiverId', async (req, res) => {
  try {
    const { caregiverId } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caregiverId)) {
      return res.status(400).json({ error: 'Invalid caregiver ID' });
    }

    const caregiver = await Caregiver.findById(caregiverId);
    
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    // Remove the caregiver document
    await Caregiver.findByIdAndDelete(caregiverId);

    // Optionally, also remove the user account (uncomment if desired)
    // await User.findByIdAndDelete(caregiver.user);

    res.json({
      success: true,
      message: 'Caregiver removed successfully'
    });
  } catch (error) {
    console.error('Error removing caregiver:', error);
    res.status(500).json({ error: 'Failed to remove caregiver' });
  }
});

// POST /api/admin/caregivers/:caregiverId/assign-account - Assign an account to a caregiver
router.post('/caregivers/:caregiverId/assign-account', async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const { accountId, accountType, permissionLevel, permissions } = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caregiverId) || !mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Invalid caregiver ID or account ID' });
    }

    const caregiver = await Caregiver.findById(caregiverId);
    
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    // Check if the account is already assigned
    const existingAssignment = caregiver.managedAccounts.find(acc => 
      acc.accountId.toString() === accountId
    );

    if (existingAssignment) {
      return res.status(400).json({ error: 'Account is already assigned to this caregiver' });
    }

    // Add the new account assignment
    const newAssignment = {
      accountId,
      accountType: accountType || 'individual_seller',
      permissionLevel: permissionLevel || 'view_only',
      permissions: permissions || {
        canViewProducts: true,
        canEditProducts: false,
        canDeleteProducts: false,
        canViewOrders: true,
        canManageOrders: false,
        canViewInquiries: true,
        canReplyToInquiries: false,
        canWithdrawFunds: false,
        canViewAnalytics: false,
        canManagePermissions: false,
        canRemoveAccount: false
      },
      status: 'active',
      addedAt: new Date()
    };

    caregiver.managedAccounts.push(newAssignment);
    await caregiver.save();

    res.json({
      success: true,
      message: 'Account assigned to caregiver successfully',
      assignment: newAssignment
    });
  } catch (error) {
    console.error('Error assigning account to caregiver:', error);
    res.status(500).json({ error: 'Failed to assign account to caregiver' });
  }
});

// DELETE /api/admin/caregivers/:caregiverId/remove-account/:accountId - Remove an account from a caregiver
router.delete('/caregivers/:caregiverId/remove-account/:accountId', async (req, res) => {
  try {
    const { caregiverId, accountId } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(caregiverId) || !mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Invalid caregiver ID or account ID' });
    }

    const caregiver = await Caregiver.findById(caregiverId);
    
    if (!caregiver) {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    // Filter out the account to remove
    const initialLength = caregiver.managedAccounts.length;
    caregiver.managedAccounts = caregiver.managedAccounts.filter(acc => 
      acc.accountId.toString() !== accountId
    );

    if (caregiver.managedAccounts.length === initialLength) {
      return res.status(404).json({ error: 'Account not found in caregiver\'s managed accounts' });
    }

    await caregiver.save();

    res.json({
      success: true,
      message: 'Account removed from caregiver successfully'
    });
  } catch (error) {
    console.error('Error removing account from caregiver:', error);
    res.status(500).json({ error: 'Failed to remove account from caregiver' });
  }
});

export default router;