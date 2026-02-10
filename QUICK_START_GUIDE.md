# 🚀 Quick Start - Seller Dashboard Testing (5 Steps)

## Your Dashboard is Ready! 

All 4 seller dashboard pages are now connected to **real MongoDB data**. Here's how to test it.

---

## Step 1: Verify Backend is Running (2 minutes)

### Option A: Using Terminal
```bash
# Navigate to backend directory
cd backend

# Start the server (if not already running)
npm start
# OR
node server.js
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected: test
```

### Option B: Check in Browser
Go to: `http://localhost:5000/api/dashboard/stats`

**Expected:** JSON response (even if not logged in yet)

✅ **Backend is ready!** Continue to Step 2.

---

## Step 2: Get Authentication Token (2 minutes)

### Using Postman (Recommended)

1. **Open Postman** (download from https://www.postman.com/downloads/)
2. **New Request** → Method: **POST**
3. **URL:** `http://localhost:5000/api/auth/login`
4. **Headers:** Add `Content-Type: application/json`
5. **Body** → raw JSON:
```json
{
  "email": "seller@example.com",
  "password": "password123"
}
```
6. **Click Send**

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "seller@example.com",
    "name": "John Seller",
    "role": "seller"
  }
}
```

**✅ Copy the token!** You'll need it for the next step.

---

## Step 3: Test API Endpoints (5 minutes)

### Create a new Postman Request for each endpoint:

#### Endpoint 1: Withdrawals
```
Method: GET
URL: http://localhost:5000/api/dashboard/withdrawals
Header: Authorization: Bearer {YOUR_TOKEN_HERE}
```
**Expected:** Balance data, pending deliveries, withdrawal history

#### Endpoint 2: Messages
```
Method: GET
URL: http://localhost:5000/api/dashboard/messages
Header: Authorization: Bearer {YOUR_TOKEN_HERE}
```
**Expected:** Array of buyer messages

#### Endpoint 3: Analytics
```
Method: GET
URL: http://localhost:5000/api/dashboard/analytics?period=monthly
Header: Authorization: Bearer {YOUR_TOKEN_HERE}
```
**Expected:** Sales stats for the month (change to daily/weekly/yearly)

#### Endpoint 4: Refunds
```
Method: GET
URL: http://localhost:5000/api/dashboard/refunds
Header: Authorization: Bearer {YOUR_TOKEN_HERE}
```
**Expected:** Pending and approved refunds

✅ **All 4 endpoints work!** Continue to Step 4.

---

## Step 4: Test Dashboard UI (5 minutes)

### Open the Frontend
1. Go to: `http://localhost:3001`
2. **Login as seller** with your seller account
3. Navigate to **Seller Dashboard**

### Check Each Page:

#### Page 1: Withdrawals
```
✅ Should see:
- Available Balance (real number, not 1250.00)
- On Hold Balance
- Pending Deliveries (list with buyer names)
- Withdrawal History
```

#### Page 2: Buyer Messages
```
✅ Should see:
- Messages list from real buyers
- Unread count badge
- Click on message → see details
- Actual buyer email and product name
```

#### Page 3: Analytics
```
✅ Should see:
- Total Sales (real number)
- Total Orders (real count)
- Product Views (real count)
- Try: Change time period → data updates!
```

#### Page 4: Refunds
```
✅ Should see:
- Pending Refunds tab (if any)
- Approved Refunds tab (if any)
- Stat cards with real numbers
```

✅ **Dashboard loads with real data!** Continue to Step 5.

---

## Step 5: Verify Everything Works (3 minutes)

### Browser Console Check (F12)
1. Open browser DevTools: **F12** key
2. Click **Console** tab
3. Scroll through logs
4. **Should see:**
   - ✅ No red errors
   - ✅ API calls in Network tab
   - ✅ Real data in console logs

### Dashboard Responsiveness Check
1. Change analytics time period (Daily → Monthly)
2. **Data should update** immediately
3. Numbers should change based on time period

### Data Accuracy Check
1. Open Network tab (F12 → Network)
2. Refresh dashboard
3. Click on `/api/dashboard/analytics` request
4. **Response** tab shows real data
5. Compare with **UI** → numbers should match

✅ **Everything works!** 

---

## Summary: What You Should See

| Page | Expected |
|------|----------|
| **Withdrawals** | Real balance from orders, pending deliveries |
| **Messages** | Real buyer inquiries with unread count |
| **Analytics** | Real sales data that changes by time period |
| **Refunds** | Real pending/approved refunds with stats |

---

## What If Something Doesn't Work?

### Problem: Dashboard shows "No data"
**Solution:** You need test data in MongoDB
```bash
# Create test data
cd backend
node scripts/seed_dashboard_data.js
# Then refresh dashboard
```

### Problem: Postman returns "401 Unauthorized"
**Solution:** 
1. Copy token from login response
2. Paste in Authorization header
3. Make sure it starts with "Bearer "

### Problem: API returns "Cannot find module"
**Solution:** Backend not running
```bash
cd backend
npm install
npm start
```

### Problem: Dashboard won't load
**Solution:** Clear browser cache
- F12 → Application → Clear site data
- Close browser tab
- Reopen http://localhost:3001

### Problem: Numbers don't match
**Solution:** 
1. Check MongoDB is connected
2. Verify order data exists
3. Review backend query logic

---

## Quick Test Checklist

- [ ] Backend running on :5000
- [ ] Can login as seller
- [ ] Postman returns token
- [ ] GET /dashboard/withdrawals returns data
- [ ] GET /dashboard/messages returns data
- [ ] GET /dashboard/analytics returns data
- [ ] GET /dashboard/refunds returns data
- [ ] Dashboard loads without errors
- [ ] Withdrawals page shows real balance
- [ ] Messages page shows real messages
- [ ] Analytics page shows real sales
- [ ] Refunds page shows real refunds
- [ ] Time period filter works
- [ ] Console has no errors (F12)

**If all checked: ✅ System is working!**

---

## Next Steps

### Option 1: Run Full Test Suite
Read: `POSTMAN_TESTING_GUIDE.md` (30 min)
- Complete API testing
- All edge cases
- Error scenarios

### Option 2: Deploy to Production
Read: `TESTING_CHECKLIST.md` (90 min)
- Comprehensive validation
- All features verified
- Sign-off ready

### Option 3: Understand the Code
Read: `SELLER_DASHBOARD_INTEGRATION_SUMMARY.md` (20 min)
- Technical details
- Code explanations
- Architecture info

---

## Support

### Quick Questions?
**Read:** `DASHBOARD_QUICK_REFERENCE.md` (5 min)

### Need API Details?
**Read:** `POSTMAN_TESTING_GUIDE.md` (30 min)

### Want Architecture?
**Read:** `VISUAL_SUMMARY.md` (15 min)

### Need Everything?
**Read:** `INTEGRATION_COMPLETE.md` (10 min)

---

## Success Indicators

✅ **You're done when:**
- [ ] All 4 API endpoints respond with data
- [ ] Dashboard displays real data (not mock)
- [ ] Time period filtering works
- [ ] No errors in console
- [ ] Data matches expectations

---

**You're all set! Your seller dashboard is now connected to real MongoDB data!** 🎉

Next: Test using the steps above, then refer to detailed guides as needed.
