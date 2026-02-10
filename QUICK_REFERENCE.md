# Quick Reference Card - Testing Cheat Sheet

## 🎯 The Issue & The Fix

```
Profile Photo Upload
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM:  Photo wasn't saving to database
CAUSE:    Missing Authorization header in upload request
FIX:      Added Authorization: Bearer {{TOKEN}} header
STATUS:   ✅ FIXED & TESTED
```

---

## 🚀 30-Second Start

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd Sellers2 && npm run dev

# Terminal 3 - Run test commands from COPY_PASTE_COMMANDS.md
```

**URL:** http://localhost:5173

---

## 📋 What Each Page Needs

| Page | Requires | Status |
|------|----------|--------|
| Profile | Test photo upload | ✅ Ready |
| Withdrawals | Dummy withdrawal data | ⏳ Need data |
| Refunds | Dummy refund data | ⏳ Need data |
| Messages | Dummy message data | ⏳ Need data |
| Analytics | Dummy order data | ⏳ Need data |

---

## 📊 How to Add Test Data

### Quickest: MongoDB Compass
1. Open MongoDB Compass
2. Connect to `localhost:27017`
3. Database: `hands_hope`
4. Insert documents manually (see QUICK_TESTING_START.md)

### Easiest: Copy-Paste Commands
See **[COPY_PASTE_COMMANDS.md](COPY_PASTE_COMMANDS.md)**
- All MongoDB commands ready to paste
- All PowerShell commands ready to paste
- Copy → Paste → Done!

### Complete: Postman
See **[POSTMAN_TESTING_AND_DUMMY_DATA.md](POSTMAN_TESTING_AND_DUMMY_DATA.md)**
- Full setup guide
- All endpoints documented
- Pre-made collection

---

## ✅ What's Fixed & Working

```
✅ Profile Photo Upload
  - Authorization header added
  - Error handling added
  - Photos now persist

✅ Caregiver Management (Previous)
  - Add/edit/remove caregivers
  - Permission levels
  - Activity logging
  - Toast notifications

✅ Inquiries, Settings, Assistance (Previous)
  - All API endpoints working
  - All forms connected
  - All data flows working
```

---

## 📖 Documentation Map

```
START HERE → QUICK_TESTING_START.md
                    ↓
              (Choose your path)
                 ↙        ↘
        COPY_PASTE          POSTMAN
        COMMANDS.md         TESTING.md
                    ↓        ↓
                (Run tests & verify)
```

---

## 🧪 Test Each Page Flow

### Profile Photo
```
1. Navigate → Profile page
2. Click → Edit Profile button
3. Click → Camera icon
4. Select → Photo from computer
5. See → Preview appears
6. Click → Save Changes
7. Check → ✅ Success message
8. Refresh → ✅ Photo still there
```

### Withdrawals
```
1. Add data → db.withdrawals.insertMany([...])
2. Navigate → Withdrawals page  
3. Check → ✅ Balance displayed
4. Check → ✅ History shown
5. Try → Request new withdrawal
```

### Refunds
```
1. Add data → db.refunds.insertMany([...])
2. Navigate → Refunds page
3. Click → Pending tab
4. See → ✅ Pending refunds listed
5. Click → Approved tab
6. See → ✅ Approved refunds listed
```

### Messages
```
1. Add data → db.messages.insertMany([...])
2. Navigate → Buyer Messages page
3. See → ✅ Messages listed
4. Click → On a message
5. See → ✅ Full conversation
6. Try → Send a reply
```

### Analytics
```
1. Add data → db.orders.insertMany([...])
2. Navigate → Analytics page
3. Click → Daily button
4. See → ✅ Daily chart updates
5. Click → Monthly button
6. See → ✅ Monthly chart updates
7. Click → Export as CSV
8. Get → ✅ Downloaded CSV file
```

---

## 🔧 Backend API Endpoints

```
GET  /api/dashboard/withdrawals   ← Fetch withdrawal data
POST /api/dashboard/withdrawals   ← Create new withdrawal

GET  /api/dashboard/refunds       ← Fetch refund data
POST /api/dashboard/refunds       ← Create refund request

GET  /api/dashboard/messages      ← Fetch messages
POST /api/dashboard/messages      ← Send message

GET  /api/dashboard/analytics     ← Fetch analytics
     ?period=daily|weekly|monthly|yearly

GET  /api/dashboard/profile       ← Get profile
PUT  /api/dashboard/profile       ← Update profile

POST /api/uploads                 ← Upload files
```

---

## 💾 MongoDB Collections

```javascript
// Create test data in these collections:
db.withdrawals    // Withdrawal history
db.refunds        // Refund requests
db.messages       // Buyer messages
db.orders         // Orders (for analytics)

// Required fields per collection:

// withdrawals
{
  sellerId: ObjectId,
  amount: Number,
  method: String,     // "mobile_money" | "bank_transfer"
  status: String,     // "completed" | "pending"
  date: Date
}

// refunds
{
  orderId: ObjectId,
  sellerId: ObjectId,
  buyerId: ObjectId,
  productName: String,
  amount: Number,
  reason: String,
  status: String,     // "pending" | "approved" | "rejected"
  date: Date
}

// messages
{
  buyerId: ObjectId,
  sellerId: ObjectId,
  productId: ObjectId,
  productName: String,
  buyerName: String,
  message: String,
  timestamp: Date,
  unread: Boolean
}

// orders
{
  sellerId: ObjectId,
  buyerId: ObjectId,
  productId: ObjectId,
  productName: String,
  amount: Number,
  status: String,     // "completed" | "pending" | "cancelled"
  createdAt: Date
}
```

---

## 🚨 Common Errors & Quick Fixes

| Error | Fix |
|-------|-----|
| "Cannot POST /api/uploads" | Add auth header ✅ (Already fixed) |
| Photo not saving | Rebuild frontend: `npm run build` |
| Pages show "No data" | Add test data to MongoDB |
| "Not authorized" error | Token expired - login again |
| "Cannot connect to MongoDB" | Check MongoDB is running |
| Empty API response `[]` | Add data to that collection |

---

## 📞 Need Help?

**For Profile Photo:** QUICK_TESTING_START.md (Section 1)
**For Test Data:** COPY_PASTE_COMMANDS.md (Part 4-5)
**For Full Setup:** POSTMAN_TESTING_AND_DUMMY_DATA.md
**For Caregiver:** CAREGIVER_TESTING_GUIDE.md

---

## 🎯 Final Checklist

- [ ] Backend: `npm start` running
- [ ] Frontend: `npm run dev` running  
- [ ] Can login to dashboard
- [ ] Profile photo upload works
- [ ] Test data added to MongoDB
- [ ] Withdrawals page shows data
- [ ] Refunds page shows data
- [ ] Messages page shows data
- [ ] Analytics page shows data
- [ ] All filters work
- [ ] CSV export works

✅ **You're ready to test everything!**
