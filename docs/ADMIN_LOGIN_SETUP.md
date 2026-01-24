# Admin & Super Admin Login Setup

This guide explains how to create and login with admin and super-admin accounts.

## Demo Credentials

After running the setup script, use these credentials:

### Admin Account
- **Email**: `admin@handsandhope.com`
- **Password**: `Admin@2024`
- **Role**: Admin

### Super Admin Account
- **Email**: `superadmin@handsandhope.com`
- **Password**: `SuperAdmin@2024`
- **Role**: Super Admin

## Setup Instructions

### Step 1: Ensure Backend is Running

Make sure your backend server is running on port 5000:

```powershell
cd backend
npm start
```

### Step 2: Ensure MongoDB is Running

MongoDB must be running and accessible at `mongodb://localhost:27017`

### Step 3: Create Admin Accounts

Run one of the following commands from the backend directory:

**Option A: Using npm script**
```powershell
npm run create-admin-accounts
```

**Option B: Direct Node command**
```powershell
node scripts/create_admin_accounts.js
```

### Expected Output

```
✅ Connected to MongoDB
✅ Admin account created: admin@handsandhope.com
✅ Super Admin account created: superadmin@handsandhope.com

📋 Demo Credentials:
Admin:
  Email: admin@handsandhope.com
  Password: Admin@2024

Super Admin:
  Email: superadmin@handsandhope.com
  Password: SuperAdmin@2024

✅ Script completed successfully
```

## How to Login

1. Open the application frontend (http://localhost:3001)
2. Click on the **Login** button
3. Enter the email and password from above
4. Click **Login**
5. You will be redirected to the **Admin Dashboard**

## What Admin Accounts Can Do

### Admin Account
- Access the Admin Dashboard
- Manage users and permissions
- View system analytics
- Moderate content
- Handle support requests

### Super Admin Account
- All Admin privileges PLUS:
- Manage other admin accounts
- Access system configuration
- View audit logs
- Full system control

## Important Notes

⚠️ **Important:**
- Never share admin credentials publicly
- Change the demo passwords in production
- Keep the JWT_SECRET in `.env` secure
- Always use HTTPS in production

## Updating Admin Passwords

If you need to update passwords, run the script again and it will update the passwords to the defaults.

To set custom passwords, edit `backend/scripts/create_admin_accounts.js` and modify these lines:

```javascript
const adminPassword = 'Admin@2024';        // Change this
const superAdminPassword = 'SuperAdmin@2024'; // Change this
```

Then run the script again.

## Troubleshooting

### "User not found" error
- Make sure the script ran successfully and showed "✅ Admin account created"
- Check MongoDB is running: `mongosh` in a new terminal
- Check the database: `use hands-and-hope` then `db.users.find()`

### "Invalid password" error
- Double-check the password matches exactly (case-sensitive)
- Make sure you didn't modify the password between script runs

### Script fails to connect
- Make sure MongoDB is running
- Check `MONGO_URI` in `.env` is correct
- Verify MongoDB is accessible: `mongosh mongodb://localhost:27017`

## Additional User Registration

Users can also self-register through the Registration page by clicking "Don't have an account?"

Available roles for registration:
- Seller
- Teacher
- Student
- School
- Caregiver
- Buyer

Admin accounts can only be created through this script.
