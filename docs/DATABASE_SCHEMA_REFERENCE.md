# Database Schema Reference

## Collections Overview

### 1. User Collection (Updated)

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  businessName: String,
  phone: String,
  role: 'seller' | 'teacher' | 'student' | 'school' | 'buyer' | 'admin' | 'super-admin',
  school: ObjectId (ref: School),
  documents: [{
    url: String,
    filename: String,
    mimeType: String,
    size: Number,
    verified: Boolean,
    uploadedAt: Date
  }],
  active: Boolean,
  profileViews: Number (NEW),
  totalSales: Number (NEW),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Product Collection (Updated)

```javascript
{
  _id: ObjectId,
  sellerId: ObjectId (ref: User),
  name: String,
  price: Number,
  status: 'active' | 'inactive' | 'sold-out' (UPDATED),
  category: String,
  color: String,
  image: String,
  description: String (NEW),
  viewCount: Number (NEW - default: 0),
  totalSold: Number (NEW - default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Order Collection (NEW)

```javascript
{
  _id: ObjectId,
  sellerId: ObjectId (ref: User),
  buyerId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  productName: String,
  amount: Number,
  status: 'pending' | 'completed' | 'cancelled' | 'refunded',
  quantity: Number (default: 1),
  buyerEmail: String,
  buyerName: String,
  shippingMethod: 'self' | 'platform',
  trackingNumber: String,
  rating: Number (1-5),
  feedback: String,
  refundStatus: 'none' | 'requested' | 'approved' | 'rejected' (default: 'none'),
  refundReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Inquiry Collection (NEW)

```javascript
{
  _id: ObjectId,
  sellerId: ObjectId (ref: User),
  buyerId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  productName: String,
  buyerName: String,
  buyerEmail: String,
  message: String,
  status: 'new' | 'read' | 'replied',
  replies: [{
    message: String,
    timestamp: Date (default: Date.now),
    responder: 'seller' | 'buyer'
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Index Recommendations

### User Collection
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ createdAt: -1 })
```

### Product Collection
```javascript
db.products.createIndex({ sellerId: 1 })
db.products.createIndex({ status: 1 })
db.products.createIndex({ category: 1 })
db.products.createIndex({ sellerId: 1, status: 1 })
db.products.createIndex({ createdAt: -1 })
```

### Order Collection
```javascript
db.orders.createIndex({ sellerId: 1 })
db.orders.createIndex({ buyerId: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ sellerId: 1, status: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ productId: 1 })
```

### Inquiry Collection
```javascript
db.inquiries.createIndex({ sellerId: 1 })
db.inquiries.createIndex({ buyerId: 1 })
db.inquiries.createIndex({ status: 1 })
db.inquiries.createIndex({ sellerId: 1, status: 1 })
db.inquiries.createIndex({ createdAt: -1 })
```

## Dashboard Stats Calculation (Queries)

### Active Listings Count
```javascript
db.products.countDocuments({ 
  sellerId: userId, 
  status: 'active' 
})
```

### Total Inquiries Count
```javascript
db.inquiries.countDocuments({ 
  sellerId: userId 
})
```

### Total Sales (All Time)
```javascript
db.orders.countDocuments({ 
  sellerId: userId, 
  status: 'completed' 
})
```

### Total Revenue (All Time)
```javascript
db.orders.aggregate([
  { $match: { sellerId: userId, status: 'completed' } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
])
```

### This Month Sales
```javascript
const monthStart = new Date(year, month, 1);
db.orders.countDocuments({ 
  sellerId: userId,
  status: 'completed',
  createdAt: { $gte: monthStart }
})
```

### This Month Revenue
```javascript
const monthStart = new Date(year, month, 1);
db.orders.aggregate([
  { $match: { 
    sellerId: userId, 
    status: 'completed',
    createdAt: { $gte: monthStart }
  } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
])
```

### Profile Views
```javascript
db.users.findOne({ _id: userId }, { profileViews: 1 })
```

### Average Rating
```javascript
db.orders.aggregate([
  { $match: { sellerId: userId, rating: { $exists: true, $ne: null } } },
  { $group: { 
    _id: null, 
    avgRating: { $avg: '$rating' },
    count: { $sum: 1 }
  } }
])
```

### Unique Customers
```javascript
db.orders.aggregate([
  { $match: { sellerId: userId } },
  { $group: { _id: '$buyerId' } },
  { $count: 'uniqueCustomers' }
])
```

### Recent Listings (Last 7 Days)
```javascript
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
db.products.find({ 
  sellerId: userId,
  createdAt: { $gte: sevenDaysAgo }
}).sort({ createdAt: -1 }).limit(5)
```

## Sample Data Counts

### Test Database (After Seeding)
- Users: 2 (1 seller, 1 buyer)
- Products: 3 (all active)
- Orders: 3 (2 completed, 1 pending)
- Inquiries: 2 (1 new, 1 read)

### Expected Dashboard Stats for Test Seller
```json
{
  "activeListings": 3,
  "totalProducts": 3,
  "totalEnquiries": 2,
  "totalSales": 2,
  "totalRevenue": 80.00,
  "profileViews": 42,
  "thisMonthSales": 2,
  "thisMonthRevenue": 80.00,
  "dailySales": 0,
  "weeklySales": 2,
  "yearlySales": 2
}
```

## Migration Notes

If you have existing data:

### Add New Fields to Users
```javascript
db.users.updateMany({}, { 
  $set: { 
    profileViews: 0,
    totalSales: 0
  }
})
```

### Add New Fields to Products
```javascript
db.products.updateMany({}, {
  $set: {
    viewCount: 0,
    totalSold: 0
  }
})
```

### Update Product Status Values
```javascript
db.products.updateMany({ status: 'Active' }, { $set: { status: 'active' } })
db.products.updateMany({ status: 'Inactive' }, { $set: { status: 'inactive' } })
```

## Backup Commands

### Before Running Migrations
```bash
# Backup entire database
mongodump --db hands-and-hope --out ./backups/backup_$(date +%Y%m%d_%H%M%S)

# Backup specific collections
mongodump --db hands-and-hope --collection users
mongodump --db hands-and-hope --collection products
```

### Restore from Backup
```bash
mongorestore --db hands-and-hope ./backups/backup_20240115_123456/hands-and-hope/
```
