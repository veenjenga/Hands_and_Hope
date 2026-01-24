# Admin Login Setup - Quick Reference Card

## Demo Credentials Ready to Use

```
┌─────────────────────────────────────────────────────┐
│              ADMIN ACCOUNT                          │
├─────────────────────────────────────────────────────┤
│ Email:    admin@handsandhope.com                    │
│ Password: Admin@2024                                │
│ Role:     Admin                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              SUPER ADMIN ACCOUNT                    │
├─────────────────────────────────────────────────────┤
│ Email:    superadmin@handsandhope.com               │
│ Password: SuperAdmin@2024                           │
│ Role:     Super Admin                               │
└─────────────────────────────────────────────────────┘
```

## Setup Steps

### 1️⃣ Start Backend
```powershell
cd backend
npm start
```

### 2️⃣ Create Admin Accounts (One-time)
```powershell
npm run create-admin-accounts
```

You should see:
```
✅ Connected to MongoDB
✅ Admin account created: admin@handsandhope.com
✅ Super Admin account created: superadmin@handsandhope.com
```

### 3️⃣ Start Frontend
```powershell
cd Sellers2
npm run dev
```

### 4️⃣ Login
1. Go to http://localhost:3001
2. Click **Login**
3. Enter admin email and password from above
4. Click **Login**
5. ✨ You're in the Admin Dashboard!

## Architecture Overview

```
┌─────────────┐
│   Frontend  │ (http://localhost:3001)
│  LoginPage  │
└──────┬──────┘
       │ POST /auth/login
       ↓
┌─────────────────────────────────────┐
│         Backend Server              │ (http://localhost:5000)
│  authRoutes.js                      │
│  ├─ Validates email/password        │
│  ├─ Checks admin/super-admin role   │
│  └─ Returns JWT token + user data   │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│      MongoDB Database               │
│  ├─ User collection                 │
│  │  └─ admin account                │
│  │  └─ super-admin account          │
│  └─ Other collections               │
└─────────────────────────────────────┘

Frontend receives JWT token and user data (role: admin/super-admin)
       │
       ↓
┌──────────────────────────────────────┐
│   App.tsx Route Handler              │
│   Checks: role === 'admin' ?         │
│                                      │
│   YES → AdminDashboard              │
│   NO  → Other dashboards            │
└──────────────────────────────────────┘
```

## What Each Component Does

| Component | Purpose | Status |
|-----------|---------|--------|
| User.js | Database model with admin roles | ✅ Ready |
| authRoutes.js | Login endpoint | ✅ Ready |
| LoginPage.tsx | Frontend login form | ✅ Ready |
| App.tsx | Route to AdminDashboard | ✅ Ready |
| AdminDashboard.tsx | Admin interface | ✅ Ready |
| create_admin_accounts.js | Seed script | ✅ NEW |

## File Changes Made

**Created:**
```
backend/scripts/create_admin_accounts.js
backend/scripts/README_ADMIN_SETUP.txt
ADMIN_LOGIN_SETUP.md
ADMIN_SETUP_COMPLETE.md
ADMIN_QUICK_REFERENCE.md (this file)
```

**Modified:**
```
backend/package.json (added npm script)
```

**No Changes Needed (Already Configured):**
```
backend/models/User.js ✅
backend/routes/authRoutes.js ✅
Sellers2/src/App.tsx ✅
Sellers2/src/components/LoginPage.tsx ✅
Sellers2/src/components/AdminDashboard.tsx ✅
```

## Verification Command

To verify admin accounts were created, run in MongoDB:

```javascript
// In MongoDB shell
use hands-and-hope
db.users.find({ role: { $in: ["admin", "super-admin"] } })
```

Should show 2 documents with admin accounts.

## Important Notes

⚠️ **Remember:**
- Keep `JWT_SECRET` in `.env` safe
- Change demo passwords before production
- Admin accounts only created via this script
- Regular users can self-register

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "User not found" | Run npm run create-admin-accounts |
| "Invalid password" | Check password is exactly Admin@2024 |
| Cannot connect to MongoDB | Ensure mongod is running |
| Admin dashboard blank | Check browser console for errors |

## Key Files Location

```
project-root/
├── backend/
│   ├── scripts/
│   │   ├── create_admin_accounts.js ← NEW
│   │   └── README_ADMIN_SETUP.txt ← NEW
│   ├── models/
│   │   └── User.js (has admin roles)
│   ├── routes/
│   │   └── authRoutes.js (handles login)
│   └── package.json (npm script added)
├── Sellers2/
│   └── src/
│       ├── App.tsx (admin routing)
│       └── components/
│           ├── LoginPage.tsx
│           └── AdminDashboard.tsx
└── Documentation/
    ├── ADMIN_LOGIN_SETUP.md ← NEW
    ├── ADMIN_SETUP_COMPLETE.md ← NEW
    └── ADMIN_QUICK_REFERENCE.md ← NEW (this file)
```

---

**Status: ✅ READY FOR USE**

All systems configured and ready. Run the setup script and start logging in as admin!
