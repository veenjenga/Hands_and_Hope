# Postman Testing Guide - Seller Dashboard Integration

## Overview
This guide provides complete instructions for testing all the new seller dashboard API endpoints using Postman. These endpoints provide real data for withdrawals, messages, analytics, and refunds.

## Prerequisites
1. **Postman** installed (download from https://www.postman.com/downloads/)
2. Backend server running on `http://localhost:5000`
3. Valid seller account credentials for authentication

## Environment Setup in Postman

### Step 1: Create a new Environment
1. Click **Environments** (left sidebar)
2. Click **Create New Environment**
3. Name it: `Hands_Hope_Dashboard`
4. Add these variables:

```
Variable Name       | Initial Value          | Current Value
base_url            | http://localhost:5000  | http://localhost:5000
seller_token        | (leave empty)          | (will populate after login)
seller_id           | (leave empty)          | (will populate after login)
```

5. Click **Save**

### Step 2: Get Authentication Token

**Request Type:** POST

**URL:** 
```
{{base_url}}/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "seller@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "seller@example.com",
    "name": "John Seller",
    "role": "seller"
  }
}
```

**Post-Request Script:**
After getting the response, add this script to automatically save the token:
```javascript
var jsonData = pm.response.json();
pm.environment.set("seller_token", jsonData.token);
pm.environment.set("seller_id", jsonData.user._id);
pm.variables.set("seller_id", jsonData.user._id);
```

---

## API Endpoints

### 1. GET /api/dashboard/withdrawals
**Purpose:** Fetch withdrawal balance, pending deliveries, withdrawal requests, and history

**Request Type:** GET

**URL:**
```
{{base_url}}/api/dashboard/withdrawals
```

**Headers:**
```
Authorization: Bearer {{seller_token}}
Content-Type: application/json
```

**Body:** None (GET request)

**Expected Response (200 OK):**
```json
{
  "availableBalance": 1250.50,
  "onHoldBalance": 450.00,
  "totalEarnings": 1700.50,
  "pendingDeliveries": [
    {
      "id": "507f1f77bcf86cd799439011",
      "orderId": "507f1f77bcf86cd799439012",
      "productName": "Mathematics Textbook",
      "buyerName": "Jane Buyer",
      "buyerEmail": "jane@example.com",
      "amount": 150.00,
      "quantity": 2,
      "status": "pending",
      "orderDate": "2024-01-15T10:30:00Z",
      "shippingMethod": "courier",
      "trackingNumber": "TRACK123456"
    }
  ],
  "withdrawalRequests": [
    {
      "id": "wr1",
      "amount": 150.00,
      "method": "bank",
      "bankName": "KCB Bank",
      "accountNumber": "1234567890",
      "accountHolder": "John Doe",
      "status": "pending",
      "requestDate": "2024-01-10T08:00:00Z"
    },
    {
      "id": "wr2",
      "amount": 250.00,
      "method": "mobile",
      "provider": "Safaricom",
      "phoneNumber": "0712345678",
      "status": "approved",
      "requestDate": "2024-01-05T10:00:00Z",
      "approvalDate": "2024-01-07T14:30:00Z"
    }
  ],
  "completedWithdrawals": [
    {
      "id": "w1",
      "amount": 450.00,
      "method": "mobile",
      "provider": "Safaricom",
      "phoneNumber": "0712345678",
      "status": "completed",
      "date": "2023-12-20T09:00:00Z"
    },
    {
      "id": "w2",
      "amount": 280.50,
      "method": "bank",
      "bankName": "KCB Bank",
      "accountNumber": "1234567890",
      "status": "completed",
      "date": "2023-12-15T11:00:00Z"
    }
  ]
}
```

**Frontend Mapping:**
- `availableBalance` → Displays in "Available Balance" card
- `onHoldBalance` → Displays in "On Hold Balance" card
- `totalEarnings` → Displays in "Total Earnings" card
- `pendingDeliveries[]` → Maps to pending deliveries list showing buyer, product, amount
- `withdrawalRequests[]` → Shows pending and approved withdrawal requests with payment method details
- `completedWithdrawals[]` → Maps to withdrawal history section with dates and amounts

---

### 2. GET /api/dashboard/messages
**Purpose:** Fetch buyer inquiries and messages

**Request Type:** GET

**URL:**
```
{{base_url}}/api/dashboard/messages
```

**Headers:**
```
Authorization: Bearer {{seller_token}}
Content-Type: application/json
```

**Body:** None (GET request)

**Expected Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "from": "Jane Buyer",
    "fromEmail": "jane@example.com",
    "fromAvatar": "J",
    "message": "Is this product still available? Can you negotiate on price?",
    "productName": "Mathematics Textbook",
    "timestamp": "2024-01-20T15:30:00Z",
    "unread": true,
    "status": "new"
  },
  {
    "id": "507f1f77bcf86cd799439014",
    "from": "Mike Buyer",
    "fromEmail": "mike@example.com",
    "fromAvatar": "M",
    "message": "Do you ship outside Nairobi?",
    "productName": "Physics Reference Book",
    "timestamp": "2024-01-19T10:15:00Z",
    "unread": false,
    "status": "responded"
  }
]
```

**Frontend Mapping:**
- `from` → Buyer name in message list
- `fromAvatar` → Avatar fallback (first letter of name)
- `message` → Preview text in message list and full message in detail view
- `productName` → Shows "Re: [ProductName]" in message detail
- `timestamp` → Formatted as date using `toLocaleDateString()`
- `unread` → Determines "New" badge display and background color
- `id` → Used as key for message selection (`setSelectedBuyerMessage`)

---

### 3. GET /api/dashboard/analytics
**Purpose:** Fetch sales analytics with time period filtering

**Request Type:** GET

**URL:**
```
{{base_url}}/api/dashboard/analytics?period=monthly
```

**Query Parameters:**
```
period = daily | weekly | monthly | yearly
```

**Headers:**
```
Authorization: Bearer {{seller_token}}
Content-Type: application/json
```

**Body:** None (GET request)

**Example URLs:**
```
{{base_url}}/api/dashboard/analytics?period=daily
{{base_url}}/api/dashboard/analytics?period=weekly
{{base_url}}/api/dashboard/analytics?period=monthly
{{base_url}}/api/dashboard/analytics?period=yearly
```

**Expected Response (200 OK):**
```json
{
  "timePeriod": "monthly",
  "dateRange": {
    "from": "2023-12-20T00:00:00Z",
    "to": "2024-01-20T15:45:00Z"
  },
  "sales": {
    "total": "2850.50",
    "count": 12,
    "average": "237.54"
  },
  "orders": {
    "total": 12,
    "completed": 10,
    "pending": 2,
    "cancelled": 0
  },
  "productViews": 340,
  "refunds": {
    "count": 1,
    "totalAmount": "150.00"
  },
  "soldOutProducts": [
    {
      "id": "507f1f77bcf86cd799439015",
      "productName": "Biology Notes",
      "lastSoldDate": "2024-01-18T14:30:00Z",
      "totalSold": 5,
      "avgTimeToSellOut": "N/A"
    },
    {
      "id": "507f1f77bcf86cd799439016",
      "productName": "Chemistry Guide",
      "lastSoldDate": "2024-01-15T09:00:00Z",
      "totalSold": 3,
      "avgTimeToSellOut": "N/A"
    }
  ],
  "conversionRate": "15.67"
}
```

**Frontend Mapping:**
- `sales.total` → "Total Sales" stat card
- `orders.total` → "Total Orders" stat card
- `productViews` → "Product Views" stat card
- `refunds.count` → "Total Refunds" stat card
- `soldOutProducts[]` → Maps to sold-out products section with product name and total sold
- `conversionRate` → Can be displayed in analytics summary
- Time period filter triggers re-fetch with `analyticsFilter` state dependency

**Testing Tips:**
1. Change the `period` query parameter and observe different data ranges
2. Verify that `sales.total` and `orders.total` change based on time period
3. Check that `productViews` may be the same across periods (aggregated field)

---

### 4. GET /api/dashboard/refunds
**Purpose:** Fetch pending and approved refund requests with statistics

**Request Type:** GET

**URL:**
```
{{base_url}}/api/dashboard/refunds
```

**Headers:**
```
Authorization: Bearer {{seller_token}}
Content-Type: application/json
```

**Body:** None (GET request)

**Expected Response (200 OK):**
```json
{
  "pending": [
    {
      "id": "507f1f77bcf86cd799439017",
      "productName": "History Textbook",
      "buyerName": "Alice Johnson",
      "buyerEmail": "alice@example.com",
      "amount": 125.00,
      "reason": "Product arrived damaged",
      "requestDate": "2024-01-19T12:00:00Z",
      "status": "pending"
    },
    {
      "id": "507f1f77bcf86cd799439018",
      "productName": "Geography Map Set",
      "buyerName": "Bob Smith",
      "buyerEmail": "bob@example.com",
      "amount": 89.99,
      "reason": "Does not match description",
      "requestDate": "2024-01-18T10:30:00Z",
      "status": "pending"
    }
  ],
  "approved": [
    {
      "id": "507f1f77bcf86cd799439019",
      "productName": "English Novel",
      "buyerName": "Carol White",
      "buyerEmail": "carol@example.com",
      "amount": 75.00,
      "reason": "Changed mind about purchase",
      "requestDate": "2024-01-15T08:00:00Z",
      "approvalDate": "2024-01-16T14:30:00Z",
      "status": "approved"
    }
  ],
  "stats": {
    "pendingCount": 2,
    "approvedCount": 1,
    "totalPending": "214.99",
    "totalApproved": "75.00",
    "refundRate": "8.33",
    "allRefunds": 3
  }
}
```

**Frontend Mapping:**
- `pending[]` → Maps to "Pending Refunds" tab showing cards with product, buyer, amount, reason
- `approved[]` → Maps to "Approved Refunds" tab with green background
- `stats.pendingCount` → Displays count badge in "Pending Refunds" tab
- `stats.approvedCount` → Displays count badge in "Approved Refunds" tab
- `stats.totalPending` + `stats.totalApproved` → "Refunded Amount" stat card
- `stats.refundRate` → "Refund Rate" stat card showing percentage
- `stats.pendingCount + stats.approvedCount` → "Total Refunds (Monthly)" stat card

---

## Complete Postman Collection

### Import this JSON into Postman:

1. Click **Collections** (left sidebar)
2. Click **Import**
3. Select **Raw text**
4. Paste the JSON below:

```json
{
  "info": {
    "name": "Hands & Hope Dashboard APIs",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Seller Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"seller@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "var jsonData = pm.response.json();",
                  "pm.environment.set(\"seller_token\", jsonData.token);",
                  "pm.environment.set(\"seller_id\", jsonData.user._id);"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Dashboard - Withdrawals",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/dashboard/withdrawals",
          "host": ["{{base_url}}"],
          "path": ["api", "dashboard", "withdrawals"]
        }
      }
    },
    {
      "name": "Dashboard - Messages",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/dashboard/messages",
          "host": ["{{base_url}}"],
          "path": ["api", "dashboard", "messages"]
        }
      }
    },
    {
      "name": "Dashboard - Analytics (Monthly)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/dashboard/analytics?period=monthly",
          "host": ["{{base_url}}"],
          "path": ["api", "dashboard", "analytics"],
          "query": [
            {
              "key": "period",
              "value": "monthly"
            }
          ]
        }
      }
    },
    {
      "name": "Dashboard - Analytics (Daily)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/dashboard/analytics?period=daily",
          "host": ["{{base_url}}"],
          "path": ["api", "dashboard", "analytics"],
          "query": [
            {
              "key": "period",
              "value": "daily"
            }
          ]
        }
      }
    },
    {
      "name": "Dashboard - Analytics (Weekly)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/dashboard/analytics?period=weekly",
          "host": ["{{base_url}}"],
          "path": ["api", "dashboard", "analytics"],
          "query": [
            {
              "key": "period",
              "value": "weekly"
            }
          ]
        }
      }
    },
    {
      "name": "Dashboard - Analytics (Yearly)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/dashboard/analytics?period=yearly",
          "host": ["{{base_url}}"],
          "path": ["api", "dashboard", "analytics"],
          "query": [
            {
              "key": "period",
              "value": "yearly"
            }
          ]
        }
      }
    },
    {
      "name": "Dashboard - Refunds",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{seller_token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/dashboard/refunds",
          "host": ["{{base_url}}"],
          "path": ["api", "dashboard", "refunds"]
        }
      }
    }
  ]
}
```

---

## Testing Workflow

### Test Case 1: Full Dashboard Load Sequence
1. **Run:** Seller Login → Get token
2. **Run:** Dashboard - Withdrawals → Verify balance and pending deliveries
3. **Run:** Dashboard - Messages → Verify unread message count
4. **Run:** Dashboard - Analytics (Monthly) → Verify sales data
5. **Run:** Dashboard - Refunds → Verify pending/approved refund counts

### Test Case 2: Time Period Analytics
1. Run Analytics with `period=daily`
2. Compare `sales.total` with `period=weekly`
3. Compare with `period=monthly`
4. Compare with `period=yearly`
5. **Expected:** Values should increase as time period increases

### Test Case 3: Error Handling
1. **Without Token:** Remove Authorization header from any request
2. **Expected:** 401 Unauthorized response
3. **Invalid Token:** Use a random token string
4. **Expected:** 401 Unauthorized response

### Test Case 4: Empty Data States
1. Test each endpoint with a new seller account (no orders/messages)
2. **Expected:**
   - Withdrawals: Empty arrays for `pendingDeliveries`, `completedWithdrawals`
   - Messages: Empty array
   - Analytics: Zero values for sales/orders
   - Refunds: Empty `pending` and `approved` arrays

---

## cURL Commands (Alternative Testing)

If you prefer command line testing, use these cURL commands:

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@example.com","password":"password123"}'
```

### Get Withdrawals
```bash
curl -X GET http://localhost:5000/api/dashboard/withdrawals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Get Messages
```bash
curl -X GET http://localhost:5000/api/dashboard/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Get Analytics (Monthly)
```bash
curl -X GET "http://localhost:5000/api/dashboard/analytics?period=monthly" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Get Refunds
```bash
curl -X GET http://localhost:5000/api/dashboard/refunds \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

## Troubleshooting

### Issue: 401 Unauthorized
**Solution:** 
- Verify token is valid and not expired
- Re-run the login request
- Check token is in Authorization header with "Bearer" prefix

### Issue: Empty responses
**Solution:**
- Verify seller has orders, messages, or refunds in database
- Check seller ID matches authenticated user
- For analytics, verify time period matches data in database

### Issue: CORS errors
**Solution:**
- Verify backend is running on port 5000
- Check vite config has correct proxy settings
- Clear browser cache

### Issue: MongoDB connection failed
**Solution:**
- Verify MongoDB Atlas credentials in .env
- Check internet connection
- Verify IP is whitelisted in MongoDB Atlas

---

## Frontend Integration Summary

### Data Flow:
```
Database (MongoDB)
    ↓
Backend Routes (/api/dashboard/*)
    ↓
SellerDashboard.tsx (fetches in useEffect)
    ↓
State (withdrawalData, buyerMessages, analyticsData, refundData)
    ↓
UI Components (render real data instead of MOCK_DATA)
```

### Key Components Updated:
- **Withdrawals Page:** Uses `availableBalance`, `onHoldBalance`, `pendingDeliveries[]`, `completedWithdrawals[]`
- **Buyer Messages Page:** Uses `buyerMessages[]` array with unread status
- **Analytics Page:** Uses `analyticsData` with time period filter
- **Refunds Page:** Uses `pendingRefunds[]` and `approvedRefunds[]` arrays with stats

---

## Sample Test Data

To create test data in your database, you can use the backend scripts:

```bash
# From backend directory
node scripts/create_accounts.js
node scripts/seed_dashboard_data.js
```

These will populate your MongoDB with sample sellers, products, orders, and inquiries for testing.

---

## API Response Headers

All successful responses include:
```
Content-Type: application/json
HTTP Status: 200 OK
```

Error responses include:
```
Content-Type: application/json
HTTP Status: 400/401/404/500
```

---

## Next Steps

Once you've tested all endpoints:
1. ✅ Verify all 4 dashboard pages load with real data
2. ✅ Test analytics with all 4 time periods
3. ✅ Create test orders to see pending/completed deliveries
4. ✅ Create test inquiries to see messages
5. ✅ Test refund workflow (request → approve/reject)
6. ✅ Verify withdrawal balance calculations

All functionality is now connected to real MongoDB data!
