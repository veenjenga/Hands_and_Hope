# Login & Authentication Testing Guide

## Quick Start

### 1. Start Backend Server
```powershell
cd c:\Users\Hp\Hands_and_Hope\backend
node server.js
```
✅ Should show: `✅ Server running on port 5000`

### 2. Seed Admin Credentials (One-Time)
```powershell
cd c:\Users\Hp\Hands_and_Hope\backend
node scripts/create_admins.js
```
✅ Should show: 
```
Created admin user: admin@handsandhope.com
Created super-admin user: superadmin@handsandhope.com
```

### 3. Start Frontend Server
```powershell
cd c:\Users\Hp\Hands_and_Hope\Sellers2
npm run dev
```
⚠️ If npm command fails due to PowerShell execution policy, you can:
- Run directly: `node node_modules/vite/bin/vite.js`
- Or change execution policy: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

✅ Should show: Frontend running on http://localhost:3001 (or configured port)

---

## Testing Scenarios

### Scenario 1: Admin Login
**Goal**: Test login with pre-created admin credentials

1. Open http://localhost:3001
2. You should see the LoginPage
3. Enter credentials:
   - Email: `admin@handsandhope.com`
   - Password: `Admin@2024`
4. Click "Sign In"

**Expected Results**:
- ✅ Successful login
- ✅ Token stored in localStorage (`token` key)
- ✅ User info stored in localStorage (`user` key)
- ✅ Redirected to admin dashboard
- ✅ User name/email/role displayed in dashboard header (once components are updated)

**Console Checks**:
- Check browser console for auth logs
- Check network tab to verify POST to `/api/auth/login` returns `{ token, user }`

---

### Scenario 2: Invalid Login
**Goal**: Test error handling for incorrect credentials

1. Open http://localhost:3001
2. Enter credentials:
   - Email: `nonexistent@example.com`
   - Password: `wrong`
3. Click "Sign In"

**Expected Results**:
- ✅ Error alert: "User not found. Please register first..."
- ✅ NOT logged in
- ✅ Remains on login page

---

### Scenario 3: New User Registration
**Goal**: Test signup flow with Auth context integration

1. Click "Create an Account"
2. Select "Individual Seller" tab
3. Fill form:
   - Full Name: Test Seller
   - Email: testseller@example.com
   - Phone: 555-1234
   - Disability ID: TEST123
   - Password: Test@1234
   - Confirm Password: Test@1234
4. (Optional) Upload disability certificate
5. Click "Create Account"

**Expected Results**:
- ✅ Files uploaded to `/api/uploads` (if selected)
- ✅ User created in `users` collection with role: 'seller'
- ✅ Seller document created in `sellers` collection
- ✅ Token stored in localStorage
- ✅ User redirected to seller dashboard
- ✅ User info available in useAuth() context

---

### Scenario 4: Page Refresh Persistence
**Goal**: Test that logged-in state survives page refresh

1. Login with admin credentials (admin@handsandhope.com / Admin@2024)
2. Press F5 to refresh the page
3. Wait for page to load

**Expected Results**:
- ✅ NOT redirected to login page
- ✅ Still on dashboard
- ✅ User info still visible
- ✅ Token and user loaded from localStorage by AuthContext

**Why**: AuthContext checks localStorage on mount and rehydrates the auth state

---

### Scenario 5: Logout
**Goal**: Test logout and session termination

1. Login with any credentials
2. Click logout button (once dashboard UI is complete)
3. Try to access dashboard directly

**Expected Results**:
- ✅ Logged out
- ✅ Token and user removed from localStorage
- ✅ useAuth().isAuthenticated returns false
- ✅ Redirected to login page
- ✅ Can no longer access protected routes

---

### Scenario 6: Protected Route Access
**Goal**: Test that unauthenticated users cannot access dashboard

1. Open browser developer tools (F12)
2. Go to http://localhost:3001 (ensure logged out)
3. Clear localStorage: `localStorage.clear()`
4. Try to access http://localhost:3001 (same page or dashboard route)

**Expected Results**:
- ✅ App detects no token in localStorage
- ✅ Redirected to login page
- ✅ Cannot access dashboard without login

---

## API Endpoint Testing (via Postman/curl)

### Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@handsandhope.com","password":"Admin@2024"}'
```

**Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@handsandhope.com",
    "role": "admin",
    "phone": null,
    "businessName": null,
    "school": null
  }
}
```

### Test Protected Dashboard Endpoint
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Expected Response**:
```json
{
  "name": "Admin User",
  "email": "admin@handsandhope.com",
  "role": "admin",
  "phone": null,
  "activeListings": 0,
  "totalProducts": 0,
  "totalEnquiries": 0,
  "totalSales": 0,
  "profileViews": 0,
  "recentListings": [],
  "thisMonthSales": 0
}
```

---

## Troubleshooting

### Issue: Login button doesn't respond
**Solution**:
1. Check backend server is running on port 5000
2. Check browser console for errors
3. Check network tab to see if POST request is being sent
4. Verify API_URL in LoginPage.tsx points to correct backend

### Issue: Token not stored in localStorage
**Solution**:
1. Verify login was successful (check response in network tab)
2. Check that authLogin() is being called in handleSubmit()
3. Verify AuthContext implementation saves to localStorage

### Issue: Page refresh logs me out
**Solution**:
1. Check localStorage persistence in AuthContext
2. Verify AuthProvider useEffect runs on mount
3. Check that localStorage keys are correct ('token' and 'user')

### Issue: Signup fails with "Cannot POST /api/uploads"
**Solution**:
1. Verify Vite proxy is configured in vite.config.ts
2. Check that `/api` requests are routed to http://localhost:5000
3. Verify uploadRoutes.js is imported in backend/server.js

### Issue: Can't run npm commands in PowerShell
**Solution 1**: Change execution policy
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Solution 2**: Use node directly
```powershell
node node_modules/vite/bin/vite.js
```

**Solution 3**: Use Command Prompt instead of PowerShell

---

## Key Files to Monitor

### Frontend
- `Sellers2/src/contexts/AuthContext.tsx` - Auth state and localStorage
- `Sellers2/src/components/LoginPage.tsx` - Login form and API call
- `Sellers2/src/components/RegistrationPage.tsx` - Registration and file upload
- `Sellers2/src/App.tsx` - Route guards and AuthProvider

### Backend
- `backend/routes/authRoutes.js` - Signup and login endpoints
- `backend/routes/dashboardRoutes.js` - Protected dashboard endpoints
- `backend/middleware/authMiddleware.js` - JWT validation
- `backend/server.js` - Route mounting and server config

### Database
- `users` collection - Login credentials
- `sellers`, `teachers`, `students`, `schools` collections - Role-specific data

---

## Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "User not found. Please register first..." | Email not in database | Register via signup form |
| "Invalid password. Please try again..." | Wrong password | Check credentials (case-sensitive) |
| "Cannot POST /api/uploads" | Vite proxy not working | Restart frontend server |
| "JWT malformed" | Invalid or expired token | Clear localStorage and login again |
| "Unauthorized" | No Authorization header | Ensure token is in request header |

---

## Database Inspection

To inspect the database and verify logins are being created:

```bash
# Connect to MongoDB
mongo  # or mongosh depending on version

# Use the database
use hands_and_hope

# Check users
db.users.find({ email: "admin@handsandhope.com" })

# Check sellers
db.sellers.find({ _id: ObjectId("...") })

# Check documents array
db.users.findOne({ email: "admin@handsandhope.com" }).documents
```

---

## Performance Tips

- Check browser DevTools Network tab to verify response times
- Monitor backend console for any errors or slow queries
- Use `time` command to measure endpoint response:
  ```powershell
  Measure-Command { curl -X GET http://localhost:5000/api/dashboard/stats }
  ```

---

**Last Updated**: [Current Date]  
**Status**: Ready for testing login flow and Auth context integration
