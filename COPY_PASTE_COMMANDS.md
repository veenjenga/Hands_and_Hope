# Script-Ready Commands - Copy & Paste Testing

## Part 1: Start Backend and Frontend

### PowerShell (Windows) - Copy Entire Block and Paste

**Terminal 1 - Start Backend:**
```powershell
cd "C:\Users\Hp\Hands_and_Hope\backend"
npm start
```

**Terminal 2 - Start Frontend:**
```powershell
cd "C:\Users\Hp\Hands_and_Hope\Sellers2"
npm run dev
```

**Terminal 3 - Testing (use this for curl commands below)**
```powershell
cd "C:\Users\Hp\Hands_and_Hope"
```

## Part 2: Get Your Seller ID and Login Token

### Step 1: Login and Extract Token

```powershell
# Set your seller credentials
$email = "seller@example.com"
$password = "password123"
$baseUrl = "http://localhost:5000"

# Login and get token
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body (@{
    email = $email
    password = $password
  } | ConvertTo-Json)

# Extract and display token and ID
$token = $loginResponse.token
$sellerId = $loginResponse.user.id

Write-Host "✓ Login successful!"
Write-Host "Token: $token"
Write-Host "Seller ID: $sellerId"
```

### Step 2: Save These for Use in Other Commands

```powershell
# Save to variables for later use
$token = "PASTE_YOUR_TOKEN_HERE"
$sellerId = "PASTE_YOUR_SELLER_ID_HERE"
$baseUrl = "http://localhost:5000"
```

## Part 3: Quick Test - Check if Endpoints Exist

```powershell
$token = "YOUR_TOKEN_HERE"
$baseUrl = "http://localhost:5000"

# Test Withdrawals endpoint
Invoke-RestMethod -Uri "$baseUrl/api/dashboard/withdrawals" `
  -Headers @{"Authorization"="Bearer $token"} | ConvertTo-Json

# Test Refunds endpoint
Invoke-RestMethod -Uri "$baseUrl/api/dashboard/refunds" `
  -Headers @{"Authorization"="Bearer $token"} | ConvertTo-Json

# Test Messages endpoint
Invoke-RestMethod -Uri "$baseUrl/api/dashboard/messages" `
  -Headers @{"Authorization"="Bearer $token"} | ConvertTo-Json

# Test Analytics endpoint
Invoke-RestMethod -Uri "$baseUrl/api/dashboard/analytics?period=monthly" `
  -Headers @{"Authorization"="Bearer $token"} | ConvertTo-Json
```

All should return empty arrays `[]` if working correctly.

## Part 4: MongoDB Commands (Using Mongo Shell)

### Open MongoDB Connection

```powershell
# In a new terminal, connect to MongoDB
mongosh
```

```javascript
// Then in the MongoDB shell, paste these commands:

// Switch to database
use hands_hope

// Get your seller ID (run this if you didn't save it)
db.users.find({email: "seller@example.com"}) // Copy the _id value

// Save seller ID as variable (replace with your actual ID)
let sellerId = ObjectId("PASTE_YOUR_SELLER_ID_HERE")
```

### Add Test Data - Copy Each Section and Paste

#### Add Withdrawal Records

```javascript
db.withdrawals.insertMany([
  {
    sellerId: sellerId,
    amount: 450.00,
    method: "mobile_money",
    provider: "Safaricom",
    phone: "0712345678",
    date: new Date("2026-01-10T09:00:00Z"),
    status: "completed"
  },
  {
    sellerId: sellerId,
    amount: 280.50,
    method: "bank_transfer",
    bank: "KCB Bank",
    account: "1234567890",
    date: new Date("2025-12-28T11:30:00Z"),
    status: "completed"
  },
  {
    sellerId: sellerId,
    amount: 150.00,
    method: "mobile_money",
    provider: "Airtel",
    phone: "0723456789",
    date: new Date("2025-12-15T14:20:00Z"),
    status: "completed"
  }
])

// Verify
db.withdrawals.find({sellerId: sellerId}).pretty()
```

#### Add Refund Records

```javascript
let buyerId = ObjectId("507f1f77bcf86cd799439012")  // Change to real buyer ID or create one

db.refunds.insertMany([
  {
    orderId: new ObjectId(),
    sellerId: sellerId,
    buyerId: buyerId,
    productName: "Ceramic Vase",
    amount: 60.00,
    reason: "Product arrived damaged",
    date: new Date("2026-01-30T10:00:00Z"),
    status: "pending"
  },
  {
    orderId: new ObjectId(),
    sellerId: sellerId,
    buyerId: buyerId,
    productName: "Painted Canvas",
    amount: 80.00,
    reason: "Not as described",
    date: new Date("2026-01-28T15:20:00Z"),
    status: "approved"
  },
  {
    orderId: new ObjectId(),
    sellerId: sellerId,
    buyerId: buyerId,
    productName: "Wooden Crafts",
    amount: 45.50,
    reason: "Color doesn't match photo",
    date: new Date("2026-01-25T12:30:00Z"),
    status: "approved"
  }
])

// Verify
db.refunds.find({sellerId: sellerId}).pretty()
```

#### Add Message Records

```javascript
db.messages.insertMany([
  {
    buyerId: buyerId,
    sellerId: sellerId,
    productId: new ObjectId(),
    productName: "Ceramic Bowl",
    buyerName: "Sarah Johnson",
    message: "When will my order ship?",
    timestamp: new Date("2026-02-01T14:30:00Z"),
    unread: true
  },
  {
    buyerId: buyerId,
    sellerId: sellerId,
    productId: new ObjectId(),
    productName: "Winter Scarf",
    buyerName: "Michael Chen",
    message: "Can you customize the color?",
    timestamp: new Date("2026-01-31T17:45:00Z"),
    unread: false
  },
  {
    buyerId: buyerId,
    sellerId: sellerId,
    productId: new ObjectId(),
    productName: "Handmade Jewelry",
    buyerName: "Emma Wilson",
    message: "Do you have this in another size?",
    timestamp: new Date("2026-01-29T09:15:00Z"),
    unread: true
  }
])

// Verify
db.messages.find({sellerId: sellerId}).pretty()
```

#### Add Order Records (for Analytics)

```javascript
db.orders.insertMany([
  // Daily orders (today and yesterday)
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Handmade Jewelry",
    amount: 125.50,
    status: "completed",
    createdAt: new Date("2026-02-01T10:00:00Z")
  },
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Ceramic Bowl",
    amount: 45.00,
    status: "completed",
    createdAt: new Date("2026-02-01T12:30:00Z")
  },
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Knitted Scarf",
    amount: 35.00,
    status: "completed",
    createdAt: new Date("2026-01-31T15:45:00Z")
  },
  // Weekly orders
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Painted Canvas",
    amount: 80.00,
    status: "completed",
    createdAt: new Date("2026-01-28T11:20:00Z")
  },
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Wooden Crafts",
    amount: 45.50,
    status: "completed",
    createdAt: new Date("2026-01-25T14:00:00Z")
  },
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Clay Sculpture",
    amount: 150.00,
    status: "completed",
    createdAt: new Date("2026-01-22T09:30:00Z")
  },
  // Monthly orders
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Pottery Set",
    amount: 200.00,
    status: "completed",
    createdAt: new Date("2026-01-10T13:15:00Z")
  },
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Decorative Plates",
    amount: 120.00,
    status: "completed",
    createdAt: new Date("2026-01-05T16:45:00Z")
  },
  // Yearly orders (from last year)
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Art Canvas",
    amount: 300.00,
    status: "completed",
    createdAt: new Date("2025-12-15T10:00:00Z")
  },
  {
    sellerId: sellerId,
    buyerId: buyerId,
    productId: new ObjectId(),
    productName: "Premium Crafts",
    amount: 500.00,
    status: "completed",
    createdAt: new Date("2025-06-20T14:30:00Z")
  }
])

// Verify
db.orders.find({sellerId: sellerId}).pretty()
```

## Part 5: Test Each Page

After adding test data, use these commands to verify:

### Check Withdrawals Data Exists

```powershell
$token = "YOUR_TOKEN_HERE"
$baseUrl = "http://localhost:5000"

$response = Invoke-RestMethod -Uri "$baseUrl/api/dashboard/withdrawals" `
  -Headers @{"Authorization"="Bearer $token"}

Write-Host "Withdrawals:"
$response | ConvertTo-Json
```

### Check Refunds Data Exists

```powershell
$response = Invoke-RestMethod -Uri "$baseUrl/api/dashboard/refunds" `
  -Headers @{"Authorization"="Bearer $token"}

Write-Host "Refunds:"
$response | ConvertTo-Json
```

### Check Messages Data Exists

```powershell
$response = Invoke-RestMethod -Uri "$baseUrl/api/dashboard/messages" `
  -Headers @{"Authorization"="Bearer $token"}

Write-Host "Messages:"
$response | ConvertTo-Json
```

### Check Analytics Data Exists

```powershell
# Daily
$response = Invoke-RestMethod -Uri "$baseUrl/api/dashboard/analytics?period=daily" `
  -Headers @{"Authorization"="Bearer $token"}
Write-Host "Daily Analytics:"
$response | ConvertTo-Json

# Monthly
$response = Invoke-RestMethod -Uri "$baseUrl/api/dashboard/analytics?period=monthly" `
  -Headers @{"Authorization"="Bearer $token"}
Write-Host "Monthly Analytics:"
$response | ConvertTo-Json
```

## Part 6: Complete Copy-Paste Workflow

### All-in-One: Get Token, Save it, Test Everything

```powershell
# ===== STEP 1: Login =====
$email = "seller@example.com"
$password = "password123"
$baseUrl = "http://localhost:5000"

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body (@{
    email = $email
    password = $password
  } | ConvertTo-Json)

$token = $loginResponse.token
$sellerId = $loginResponse.user.id

Write-Host "✓ Logged in as: $($loginResponse.user.email)"
Write-Host "✓ Seller ID: $sellerId"
Write-Host "✓ Token: $($token.Substring(0, 20))..."

# ===== STEP 2: Test All Endpoints =====
Write-Host "`n=== Testing Endpoints ==="

$endpoints = @(
  @{name="Withdrawals"; path="/api/dashboard/withdrawals"},
  @{name="Refunds"; path="/api/dashboard/refunds"},
  @{name="Messages"; path="/api/dashboard/messages"},
  @{name="Analytics"; path="/api/dashboard/analytics?period=monthly"}
)

foreach ($endpoint in $endpoints) {
  try {
    $response = Invoke-RestMethod -Uri "$baseUrl$($endpoint.path)" `
      -Headers @{"Authorization"="Bearer $token"}
    
    $count = if ($response -is [Array]) { $response.Count } else { 1 }
    Write-Host "✓ $($endpoint.name): $count records"
  } catch {
    Write-Host "✗ $($endpoint.name): Failed - $($_.Exception.Message)"
  }
}
```

## Part 7: MongoDB Quick Commands

### Find Your Seller ID

```javascript
// In MongoDB shell
use hands_hope
db.users.findOne({email: "seller@example.com"})

// Copy the _id field, it's your seller ID
```

### Count Records

```javascript
use hands_hope

// Check how many of each record type exists
db.withdrawals.countDocuments()
db.refunds.countDocuments()
db.messages.countDocuments()
db.orders.countDocuments()

// Check for specific seller
db.withdrawals.countDocuments({sellerId: ObjectId("YOUR_ID")})
db.refunds.countDocuments({sellerId: ObjectId("YOUR_ID")})
db.messages.countDocuments({sellerId: ObjectId("YOUR_ID")})
db.orders.countDocuments({sellerId: ObjectId("YOUR_ID")})
```

### Delete Test Data (Start Fresh)

```javascript
use hands_hope

// Delete all test records
db.withdrawals.deleteMany({})
db.refunds.deleteMany({})
db.messages.deleteMany({})
db.orders.deleteMany({})

// Or delete only for specific seller
let sellerId = ObjectId("YOUR_ID")
db.withdrawals.deleteMany({sellerId: sellerId})
db.refunds.deleteMany({sellerId: sellerId})
db.messages.deleteMany({sellerId: sellerId})
db.orders.deleteMany({sellerId: sellerId})
```

## Quick Reference

| Task | Command |
|------|---------|
| Start Backend | `cd C:\Users\Hp\Hands_and_Hope\backend && npm start` |
| Start Frontend | `cd C:\Users\Hp\Hands_and_Hope\Sellers2 && npm run dev` |
| Open Dashboard | http://localhost:5173 |
| Test Endpoint | `Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/withdrawals" -Headers @{"Authorization"="Bearer $token"}` |
| Connect MongoDB | `mongosh` |
| View Database | MongoDB Compass → `localhost:27017` → `hands_hope` |
| Clear Cache | `ctrl+shift+delete` in browser or DevTools → Application → Clear |

---

**Ready to test! Copy any section above and paste it into your terminal.** ✅
