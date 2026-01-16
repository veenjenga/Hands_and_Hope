# Navigation & Routing Guide

## Current Flow

### 1. **Login Page**
- **URL**: `http://localhost:3001/` (or default Vite port)
- **What you see**:
  - Left side (desktop only): Hands & Hope branding with people working illustration
  - Right side: Login form with Email + Password fields
  - Bottom: "Create an Account" button

- **Demo Credentials**:
  ```
  Admin: admin@handsandhope.com / Admin@2024
  Super Admin: superadmin@handsandhope.com / SuperAdmin@2024
  ```

- **After clicking "Sign In"**:
  1. Form submits email + password to `POST http://localhost:5000/api/auth/login`
  2. Backend validates and returns `{ token, user: {id, name, email, role, ...} }`
  3. Frontend calls `authLogin(user, token)` → stores in Auth Context + localStorage
  4. Frontend calls `onLogin(role)` → App.tsx sets `currentPage` based on role:
     - If role = 'admin' or 'super-admin' → go to AdminDashboard
     - Otherwise → go to SellerDashboard (or role-specific dashboard)
  5. You should see the appropriate dashboard

---

### 2. **Registration Page**
- **How to get there**:
  - Click "Create an Account" button on LoginPage
  - Should navigate to RegistrationPage

- **What you do**:
  1. Select account type:
     - Individual Seller
     - Student/Teacher (choose which one)
     - School Administrator
  2. Fill in form fields
  3. (Optional) Upload documents (disability cert, school cert, etc.)
  4. Click "Create Account"

- **After clicking "Create Account"**:
  1. Files upload to `POST http://localhost:5000/api/uploads` (if selected)
  2. User data + file metadata posts to `POST http://localhost:5000/api/auth/signup`
  3. Backend creates User + role-specific document (Seller/Teacher/Student/School)
  4. Backend returns `{ token, user }`
  5. Frontend calls `authLogin(user, token)` → stores in Auth Context + localStorage
  6. Frontend calls `onRegister(role)` → App.tsx sets `currentPage = 'dashboard'`
  7. You should see the SellerDashboard (or appropriate role dashboard)

---

### 3. **Dashboard Pages**
After login/registration, you'll see one of these based on your role:

- **AdminDashboard** (for admin / super-admin roles)
- **SellerDashboard** (for seller / student roles)
- **TeacherDashboard** (for teacher role)
- **SchoolDashboard** (for school role)

All dashboards should have:
- Logout button (click to return to login)
- User name/email/role displayed
- Dashboard metrics (once backend endpoints are wired)

---

### 4. **Key Routing Logic** (in App.tsx)

```typescript
// When you login with email/password
→ POST /api/auth/login
  ↓
← returns {token, user: {role: 'admin'}}
  ↓
authLogin(user, token)  // Store in Auth Context + localStorage
  ↓
onLogin('admin')  // App.tsx handleLogin callback
  ↓
if (role === 'admin' || role === 'super-admin')
  → setCurrentPage('admin-dashboard')  // Show AdminDashboard
else
  → setCurrentPage('dashboard')  // Show SellerDashboard or role-specific
```

---

## Testing Checklist

### ✅ Prerequisites
- [ ] Backend running on `http://localhost:5000`
- [ ] MongoDB connected
- [ ] Admin users seeded (run `node scripts/create_admins.js`)

### ✅ Frontend - Start Dev Server
```powershell
cd c:\Users\Hp\Hands_and_Hope\Sellers2
npm run dev
# or
node node_modules/vite/bin/vite.js
```

### ✅ Test 1: Login → Admin Dashboard
1. Open `http://localhost:3001` (or output port)
2. Enter email: `admin@handsandhope.com`
3. Enter password: `Admin@2024`
4. Click "Sign In"
5. **Expected**: 
   - ✅ Alert/success message
   - ✅ Redirects to AdminDashboard
   - ✅ See "Admin" in dashboard header (user role)
   - ✅ Logout button visible

### ✅ Test 2: Create Account (New User)
1. On LoginPage, click "Create an Account"
2. **Expected**: Navigates to RegistrationPage
3. Select "Individual Seller"
4. Fill form:
   - Name: `Test Seller`
   - Email: `test@example.com`
   - Phone: `555-1234`
   - Disability ID: `TEST123`
   - Password: `Test@1234`
   - Confirm: `Test@1234`
5. Click "Create Account"
6. **Expected**:
   - ✅ User created in database
   - ✅ Seller document created
   - ✅ Auto-login and redirect to SellerDashboard
   - ✅ See "Test Seller" in header

### ✅ Test 3: Page Refresh Persistence
1. Login with admin credentials
2. You're on AdminDashboard
3. Press F5 (refresh page)
4. **Expected**:
   - ✅ NOT redirected to login
   - ✅ Still on AdminDashboard
   - ✅ User info still there (from localStorage)

### ✅ Test 4: Logout
1. On any dashboard
2. Click "Logout" button
3. **Expected**:
   - ✅ Logged out
   - ✅ Redirects to LoginPage
   - ✅ localStorage cleared
   - ✅ Can't access dashboard without login

---

## Troubleshooting

### Problem: "Sign In" button doesn't work
**Solution**:
1. Open browser DevTools (F12)
2. Go to Console tab → look for errors
3. Go to Network tab → check if POST `/api/auth/login` is sent
4. Check if backend is running (`http://localhost:5000/api/auth/login` should respond)

### Problem: Stuck on LoginPage after login
**Solution**:
1. Check browser console for errors
2. Check if `authLogin()` is being called
3. Check localStorage - should have `token` and `user` keys
4. Verify `handleLogin(role)` is being called with correct role

### Problem: Image not showing on login page
**Solution**:
1. Check browser DevTools → Network tab
2. Look for failed image request
3. Try path: `/src/assets/people-working.svg`
4. Make sure SVG file exists: `c:\Users\Hp\Hands_and_Hope\Sellers2\src\assets\people-working.svg`

### Problem: Frontend dev server won't start
**Solution**:
1. Try: `node node_modules/vite/bin/vite.js`
2. Or change PowerShell execution policy:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Or use Command Prompt instead of PowerShell

---

## Current State Summary

| Component | Status | Notes |
|-----------|--------|-------|
| LoginPage | ✅ Renders | Forms submits to backend |
| RegistrationPage | ✅ Renders | File upload + signup |
| Auth Context | ✅ Created | Stores user + token |
| App.tsx Routing | ✅ Implemented | Routes based on role |
| Backend Auth | ✅ Working | Login/signup endpoints ready |
| AdminDashboard | ✅ Component exists | Needs user data wiring |
| SellerDashboard | ✅ Component exists | Needs API endpoint wiring |
| Image (people) | ✅ Created SVG | Should display on xl screens |
| Demo Credentials | ✅ Seeded | admin@handsandhope.com exists |

---

**Next Steps After Routing Works**:
1. Wire dashboard components to fetch real data from API
2. Display logged-in user info (name, email, role) in dashboard headers
3. Fetch and display dashboard metrics (active listings, sales, etc.)
4. Test role-based access (student can't login as teacher, etc.)

