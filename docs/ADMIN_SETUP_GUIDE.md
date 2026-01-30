# Admin System Setup Guide

## Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account with cluster created
- Git repository cloned

## Step 1: MongoDB Atlas Configuration

### 1.1 IP Whitelist Setup
1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access" 
3. Click "Add IP Address"
4. Add your current IP address (or "Allow Access from Anywhere" for development)
5. Save changes

### 1.2 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

## Step 2: Backend Setup

### 2.1 Environment Configuration
Update your `.env` file in the backend directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your_super_secret_jwt_key_here_change_this
PORT=5000
CLIENT_URL=http://localhost:3001
```

### 2.2 Install Dependencies
```bash
cd backend
npm install
```

### 2.3 Test Connection
```bash
node scripts/check-env.js
```

### 2.4 Create Admin Accounts
```bash
node scripts/setup-admin-accounts.js
```

This creates:
- Super Admin: superadmin@handsandhope.com / SuperAdmin123!
- Admin: admin@handsandhope.com / Admin123!

⚠️ **Important**: Change these passwords after first login!

## Step 3: Frontend Setup

### 3.1 Environment Configuration
Create `.env` file in Sellers2 directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.2 Install Dependencies
```bash
cd ../Sellers2
npm install
```

## Step 4: Start Development Servers

### 4.1 Start Backend
```bash
cd ../backend
npm run dev
# or
nodemon server.js
```

Should show: "✅ Server running on port 5000" and "✅ MongoDB connected successfully"

### 4.2 Start Frontend
```bash
cd ../Sellers2
npm run dev
# or
vite
```

Should show: "Local: http://localhost:3001/"

## Step 5: Admin Login

1. Open browser to http://localhost:3001/
2. Navigate to Admin Login
3. Use credentials:
   - **Super Admin**: superadmin@handsandhope.com / SuperAdmin123!
   - **Admin**: admin@handsandhope.com / Admin123!

## Admin Roles & Permissions

### Super Admin Capabilities:
- ✅ All Admin functions
- ✅ Create/Delete other admins
- ✅ System-wide configuration
- ✅ View all admin accounts
- ✅ Full platform access

### Admin Capabilities:
- ✅ User management (approve/ban)
- ✅ Product approval
- ✅ Report handling
- ✅ Transaction viewing
- ✅ Analytics dashboard
- ❌ Cannot manage other admins

## Troubleshooting

### MongoDB Connection Issues:
1. Check IP whitelist in MongoDB Atlas
2. Verify connection string format
3. Ensure cluster is running
4. Check firewall settings

### Authentication Issues:
1. Verify JWT_SECRET is set
2. Check token expiration settings
3. Ensure correct role assignments

### CORS Issues:
1. Check CLIENT_URL in backend .env
2. Verify frontend URL is in CORS origins
3. Restart backend server after config changes

## Production Deployment

### Backend Environment (.env):
```env
MONGO_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/prod-db
JWT_SECRET=very_long_random_secret_key_for_production
PORT=5000
CLIENT_URL=https://your-production-frontend.com
NODE_ENV=production
```

### Frontend Environment:
```env
REACT_APP_API_URL=https://your-production-api.com/api
```

### Security Checklist:
- [ ] Change default admin passwords
- [ ] Use strong JWT secret
- [ ] Restrict MongoDB IP whitelist
- [ ] Enable HTTPS
- [ ] Set proper CORS restrictions
- [ ] Regular security audits