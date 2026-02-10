# Quick Test Checklist - Seller Dashboard

## Prerequisites
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3001`
- [ ] MongoDB Atlas connected
- [ ] Postman installed
- [ ] Valid seller account credentials ready

---

## Part 1: Test API Endpoints (Postman)

### Setup
1. [ ] Open Postman
2. [ ] Create new Environment `Hands_Hope_Dashboard`
3. [ ] Add variables: `base_url=http://localhost:5000`
4. [ ] Import collection from `POSTMAN_TESTING_GUIDE.md` OR create manually

### Test Sequence

#### 1. Authentication
```
Request: POST {{base_url}}/api/auth/login
Body: {"email":"seller@example.com","password":"password123"}
Expected: 200 OK with token
☐ Token received
☐ Save token to environment variable
```

#### 2. Withdrawals Endpoint
```
Request: GET {{base_url}}/api/dashboard/withdrawals
Header: Authorization: Bearer {{seller_token}}
Expected: 200 OK with balance data
☐ availableBalance present
☐ onHoldBalance present
☐ pendingDeliveries array
☐ completedWithdrawals array
☐ Numbers are correct
```

#### 3. Messages Endpoint
```
Request: GET {{base_url}}/api/dashboard/messages
Header: Authorization: Bearer {{seller_token}}
Expected: 200 OK with messages array
☐ Array of messages received
☐ Each message has: id, from, message, productName
☐ unread boolean field present
☐ Timestamps are ISO format
```

#### 4. Analytics Endpoint - Monthly
```
Request: GET {{base_url}}/api/dashboard/analytics?period=monthly
Header: Authorization: Bearer {{seller_token}}
Expected: 200 OK with analytics data
☐ sales.total present
☐ orders.total present
☐ productViews present
☐ refunds.count present
☐ soldOutProducts array
```

#### 5. Analytics Endpoint - Other Periods
```
Test with: ?period=daily, ?period=weekly, ?period=yearly
Expected: 200 OK for each
☐ Daily data loads
☐ Weekly data loads
☐ Yearly data loads
☐ Numbers change based on period
```

#### 6. Refunds Endpoint
```
Request: GET {{base_url}}/api/dashboard/refunds
Header: Authorization: Bearer {{seller_token}}
Expected: 200 OK with refund data
☐ pending array present
☐ approved array present
☐ stats object with counts
☐ stats.refundRate percentage
```

### Error Testing

#### Test Missing Authorization
```
Request: GET {{base_url}}/api/dashboard/withdrawals (without header)
Expected: 401 Unauthorized
☐ Error returned correctly
```

#### Test Invalid Token
```
Request: GET {{base_url}}/api/dashboard/withdrawals
Header: Authorization: Bearer invalid_token_123
Expected: 401 Unauthorized
☐ Error returned correctly
```

---

## Part 2: Test Frontend Dashboard

### Dashboard Load
- [ ] Navigate to seller dashboard
- [ ] Page loads without errors (check console: F12)
- [ ] No "MOCK" data visible in UI
- [ ] Real data from API displays

### Test Withdrawals Page
- [ ] Click "Withdrawals" in sidebar
- [ ] Page shows balance cards with real numbers
- [ ] Pending deliveries list shows actual data (or "No pending" if empty)
- [ ] Withdrawal history shows completed withdrawals
- [ ] Numbers match Postman API response

### Test Buyer Messages Page
- [ ] Click "Buyer Messages" in sidebar
- [ ] Messages list shows real buyer names
- [ ] Unread count displays correctly
- [ ] Click on a message → detail view shows
- [ ] Message content, product name visible
- [ ] Buyer email displayed
- [ ] "No messages yet" if list is empty

### Test Analytics Page
- [ ] Click "Analytics" in sidebar
- [ ] Sales stats card shows real total
- [ ] Orders count shows real number
- [ ] Product views shows real count
- [ ] Refunds count shows real number
- [ ] Sold-out products section displays products

#### Test Time Period Filter
- [ ] Click time period selector
- [ ] Change from "Monthly" to "Daily"
- [ ] Data updates after selection
- [ ] Numbers change appropriately
- [ ] Try "Weekly" and "Yearly"
- [ ] All periods load successfully

### Test Refunds Page
- [ ] Click "Refunds" in sidebar
- [ ] Pending Refunds tab shows count
- [ ] Click on pending refund → shows details
- [ ] Approved Refunds tab shows count
- [ ] Stat cards show:
  - [ ] Total Refunds count
  - [ ] Refund Rate percentage
  - [ ] Refunded Amount total
- [ ] Empty message if no data

---

## Part 3: Data Validation

### Check Data Accuracy
For each section, verify API data matches UI display:

#### Withdrawals
```
API availableBalance          → UI "Available Balance" card
API onHoldBalance             → UI "On Hold Balance" card
API totalEarnings             → UI "Total Earnings" card
API pendingDeliveries[]       → UI pending list
API completedWithdrawals[]    → UI withdrawal history
```

#### Messages
```
API from                      → UI buyer name
API fromEmail                 → UI email in detail
API message                   → UI message content
API productName               → UI "Re: ProductName"
API unread                    → UI "New" badge
API timestamp                 → UI formatted date
```

#### Analytics
```
API sales.total               → UI "Total Sales" card
API orders.total              → UI "Total Orders" card
API productViews              → UI "Product Views" card
API refunds.count             → UI "Total Refunds" card
API soldOutProducts[]         → UI sold products list
```

#### Refunds
```
API pending[]                 → UI Pending tab
API approved[]                → UI Approved tab
API stats.pendingCount        → UI tab badge
API stats.approvedCount       → UI tab badge
API stats.refundRate          → UI "Refund Rate" card
API stats.totalPending + API stats.totalApproved → UI "Refunded Amount" card
```

---

## Part 4: Error Scenarios

### Empty Data
- [ ] Create new seller with no orders
- [ ] Withdrawals page shows "0.00" balances
- [ ] Messages shows "No messages yet"
- [ ] Analytics shows "0" values
- [ ] Refunds shows "No Pending Refunds"

### Network Errors
- [ ] Stop backend server
- [ ] Try to load dashboard
- [ ] Check console for error message
- [ ] Verify graceful error handling

### Missing Fields
- [ ] Check backend returns all required fields
- [ ] UI doesn't crash with missing data
- [ ] Default values/empty states show

---

## Part 5: Performance

- [ ] Dashboard loads in under 3 seconds
- [ ] No console errors (F12 → Console)
- [ ] API calls show in Network tab
- [ ] All 4 endpoints called on mount
- [ ] Analytics re-fetches when period changes
- [ ] No infinite loops or repeated calls

---

## Part 6: Browser Testing

### Chrome
- [ ] Dashboard loads
- [ ] All data displays
- [ ] No console errors
- [ ] DevTools Network shows all 4 API calls

### Firefox
- [ ] Dashboard loads
- [ ] All data displays
- [ ] No console errors
- [ ] Inspector Network shows all 4 API calls

### Edge
- [ ] Dashboard loads
- [ ] All data displays
- [ ] No console errors

---

## Part 7: Authentication

- [ ] Can login as seller
- [ ] Token stored in localStorage
- [ ] Token included in all API requests
- [ ] Token expires properly
- [ ] Cannot access endpoints without token
- [ ] Logout clears token

---

## Final Checklist

### All Pages Working
- [ ] Withdrawals page shows real data
- [ ] Messages page shows real inquiries
- [ ] Analytics page shows real sales with time filtering
- [ ] Refunds page shows pending and approved refunds

### All Features Working
- [ ] No MOCK data visible
- [ ] All API endpoints return data
- [ ] Frontend properly maps API data to UI
- [ ] Empty states work correctly
- [ ] Error handling works
- [ ] Time period filtering works

### Code Quality
- [ ] No console errors
- [ ] No warnings in browser
- [ ] Response times acceptable
- [ ] No broken images or styling

### Documentation
- [ ] POSTMAN_TESTING_GUIDE.md reviewed
- [ ] SELLER_DASHBOARD_INTEGRATION_SUMMARY.md reviewed
- [ ] DASHBOARD_QUICK_REFERENCE.md reviewed

---

## Sign Off

**Date Tested:** _____________  
**Tested By:** _____________  
**Status:** ☐ All Tests Pass ☐ Some Issues ☐ Failed

**Notes:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Re-run login, copy token to environment |
| Empty dashboard | Create test data in MongoDB |
| No messages | Create inquiries via API |
| Wrong numbers | Check time period and date ranges |
| Slow loading | Verify MongoDB connection, check network tab |
| CORS errors | Verify backend running on :5000 |

---

## Next Steps After Testing

1. ✅ All tests pass → Deploy to production
2. ✅ Create real test accounts → Full UAT testing
3. ✅ Document any issues → Fix before release
4. ✅ Get stakeholder approval → Go live

---

**Document Version:** 1.0  
**Last Updated:** January 20, 2024  
**Status:** Ready for Testing
