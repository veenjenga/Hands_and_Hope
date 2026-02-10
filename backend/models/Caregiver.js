import mongoose from 'mongoose';

const CaregiverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  managedAccounts: [
    {
      accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      accountType: { type: String, enum: ['individual_seller', 'student_seller', 'teacher'], default: 'individual_seller' },
      permissionLevel: { type: String, enum: ['full', 'financial_only', 'product_management', 'view_only', 'custom'], default: 'view_only' },
      relationshipType: { type: String },
      relationshipDetails: { type: String },
      status: { type: String, enum: ['active', 'pending', 'revoked'], default: 'pending' },
      lastLogin: { type: Date },
      permissions: {
        viewProfile: { type: Boolean, default: true },
        editProfile: { type: Boolean, default: false },
        viewProducts: { type: Boolean, default: true },
        manageProducts: { type: Boolean, default: false },
        respondToInquiries: { type: Boolean, default: false },
        viewFinancials: { type: Boolean, default: true },
        withdrawMoney: { type: Boolean, default: false },
        manageShipments: { type: Boolean, default: false },
        viewAnalytics: { type: Boolean, default: true },
        editBio: { type: Boolean, default: false },
        editStoreName: { type: Boolean, default: false },
        canViewProducts: { type: Boolean, default: true },
        canEditProducts: { type: Boolean, default: false },
        canDeleteProducts: { type: Boolean, default: false },
        canViewOrders: { type: Boolean, default: true },
        canManageOrders: { type: Boolean, default: false },
        canViewInquiries: { type: Boolean, default: true },
        canReplyToInquiries: { type: Boolean, default: false },
        canWithdrawFunds: { type: Boolean, default: false },
        canViewAnalytics: { type: Boolean, default: false },
        canManagePermissions: { type: Boolean, default: false },
        canRemoveAccount: { type: Boolean, default: false },
      },
      addedAt: { type: Date, default: Date.now },
    }
  ],
  phone: String,
  documents: [
    {
      url: String,
      filename: String,
      mimeType: String,
      size: Number,
      verified: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  activityLog: [
    {
      action: String,
      accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      details: String,
      resourceType: String,
      resourceName: String,
      timestamp: { type: Date, default: Date.now },
    }
  ],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Caregiver = mongoose.model('Caregiver', CaregiverSchema);
export default Caregiver;
