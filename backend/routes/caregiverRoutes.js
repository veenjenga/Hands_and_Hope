import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Caregiver from '../models/Caregiver.js';
import mongoose from 'mongoose';

const router = express.Router();

// Apply auth middleware to all caregiver routes
router.use(authMiddleware);

// GET /api/caregiver/managed-accounts - Get accounts managed by the logged-in caregiver
router.get('/managed-accounts', async (req, res) => {
  try {
    // Find the caregiver document for the logged-in user
    const caregiverDoc = await Caregiver.findOne({ user: req.user.id }).populate('managedAccounts.accountId');
    
    if (!caregiverDoc) {
      return res.status(404).json({ error: 'Caregiver profile not found' });
    }

    // Format the managed accounts data
    const managedAccounts = caregiverDoc.managedAccounts.map(account => ({
      accountId: account.accountId._id,
      accountType: account.accountType,
      accountOwnerName: account.accountId.name,
      accountOwnerEmail: account.accountId.email,
      permissionLevel: account.permissionLevel,
      permissions: account.permissions,
      status: account.status,
      addedDate: account.addedAt
    }));

    res.json(managedAccounts);
  } catch (error) {
    console.error('Error fetching managed accounts:', error);
    res.status(500).json({ error: 'Failed to fetch managed accounts' });
  }
});

// GET /api/caregiver/:accountId/permissions - Get permissions for a specific account
router.get('/:accountId/permissions', async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    // Find the caregiver document for the logged-in user
    const caregiverDoc = await Caregiver.findOne({ user: req.user.id });
    
    if (!caregiverDoc) {
      return res.status(404).json({ error: 'Caregiver profile not found' });
    }

    // Find the specific managed account
    const managedAccount = caregiverDoc.managedAccounts.find(acc => 
      acc.accountId.toString() === accountId
    );

    if (!managedAccount) {
      return res.status(403).json({ error: 'Access denied. You do not manage this account.' });
    }

    // Map the permissions to the frontend format
    const frontendPermissions = {
      viewProfile: managedAccount.permissions.canViewProfile || managedAccount.permissions.canViewProducts,
      editProfile: managedAccount.permissions.canEditProducts,
      viewProducts: managedAccount.permissions.canViewProducts,
      manageProducts: managedAccount.permissions.canEditProducts,
      respondToInquiries: managedAccount.permissions.canReplyToInquiries,
      viewFinancials: managedAccount.permissions.canViewOrders,
      withdrawMoney: managedAccount.permissions.canWithdrawFunds,
      manageShipments: managedAccount.permissions.canManageOrders,
      viewAnalytics: managedAccount.permissions.canViewAnalytics,
      editBio: managedAccount.permissions.canEditProducts,
      editStoreName: managedAccount.permissions.canEditProducts
    };

    res.json(frontendPermissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

// POST /api/caregiver/activity - Log caregiver activity
router.post('/activity', async (req, res) => {
  try {
    const { action, accountId, details, resourceType, resourceName } = req.body;

    // Validate required fields
    if (!action || !accountId) {
      return res.status(400).json({ error: 'Action and accountId are required' });
    }

    // Find the caregiver document for the logged-in user
    const caregiverDoc = await Caregiver.findOne({ user: req.user.id });
    
    if (!caregiverDoc) {
      return res.status(404).json({ error: 'Caregiver profile not found' });
    }

    // Add activity to the caregiver's activity log
    const newActivity = {
      action,
      accountId,
      details,
      resourceType,
      resourceName,
      timestamp: new Date(),
      ip_address: req.ip
    };

    caregiverDoc.activityLog = caregiverDoc.activityLog || [];
    caregiverDoc.activityLog.push(newActivity);
    
    await caregiverDoc.save();

    res.json({ success: true, activityId: newActivity._id });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// GET /api/caregiver/profile - Get caregiver profile
router.get('/profile', async (req, res) => {
  try {
    const caregiverDoc = await Caregiver.findOne({ user: req.user.id }).populate('user');
    
    if (!caregiverDoc) {
      return res.status(404).json({ error: 'Caregiver profile not found' });
    }

    const profile = {
      caregiverId: caregiverDoc._id,
      fullName: caregiverDoc.user.name,
      email: caregiverDoc.user.email,
      phone: caregiverDoc.phone || '',
      relationshipType: caregiverDoc.relationshipType || 'caregiver',
      joinDate: caregiverDoc.createdAt || caregiverDoc.user.createdAt,
      profilePhoto: caregiverDoc.profilePhoto || '',
      managedAccounts: caregiverDoc.managedAccounts.length,
      notificationPreferences: caregiverDoc.notificationPreferences || {
        emailNotifications: true,
        smsNotifications: false,
        activityAlerts: true,
        weeklyReports: false
      }
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching caregiver profile:', error);
    res.status(500).json({ error: 'Failed to fetch caregiver profile' });
  }
});

// PUT /api/caregiver/profile - Update caregiver profile
router.put('/profile', async (req, res) => {
  try {
    const { phone, relationshipType, notificationPreferences, profilePhoto } = req.body;

    const caregiverDoc = await Caregiver.findOne({ user: req.user.id });
    
    if (!caregiverDoc) {
      return res.status(404).json({ error: 'Caregiver profile not found' });
    }

    // Update fields if provided
    if (phone !== undefined) caregiverDoc.phone = phone;
    if (relationshipType !== undefined) caregiverDoc.relationshipType = relationshipType;
    if (notificationPreferences !== undefined) caregiverDoc.notificationPreferences = notificationPreferences;
    if (profilePhoto !== undefined) caregiverDoc.profilePhoto = profilePhoto;

    await caregiverDoc.save();

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating caregiver profile:', error);
    res.status(500).json({ error: 'Failed to update caregiver profile' });
  }
});

export default router;