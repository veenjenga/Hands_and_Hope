# Seller Dashboard Real Data Integration

## Overview
The SellerDashboard component has been fully integrated with real backend data. Both **Seller** and **Student** roles share the same dashboard as they perform the same activities (selling products).

## Architecture

### Backend Models Created

#### 1. **Order.js** - Tracks all sales transactions
- `sellerId`: Reference to the seller
- `buyerId`: Reference to the buyer
- `productId`: Reference to the product
- `amount`: Sale amount
- `status`: pending, completed, cancelled, refunded
- `rating`: Customer rating (1-5)
- `feedback`: Customer feedback
- `refundStatus`: Refund tracking

#### 2. **Inquiry.js** - Tracks buyer inquiries/messages
- `sellerId`: Reference to the seller
- `buyerId`: Reference to the buyer
- `productId`: Reference to the product
- `message`: Inquiry message
- `status`: new, read, replied
- `replies`: Array of conversation replies

### Backend Routes Updated

**Location**: `/backend/routes/dashboardRoutes.js`

#### Endpoints:
- `GET /api/dashboard/stats` - Get overview stats (active listings, inquiries, sales, etc.)
- `GET /api/dashboard/analytics` - Get detailed sales analytics (daily, weekly, monthly, yearly)
- `GET /api/dashboard/orders` - Get seller's orders
- `GET /api/dashboard/inquiries` - Get seller's inquiries
- `GET /api/dashboard/engagement` - Get customer engagement metrics
- `GET /api/dashboard/products` - Get seller's products
- `GET /api/dashboard/profile` - Get user profile
- `POST /api/dashboard/track-view` - Track profile views

### Frontend Integration

**Location**: `/Sellers2/src/components/SellerDashboard.tsx`

#### Data Fetched:
```typescript
const [dashboardStats, setDashboardStats] = useState<any>(null);     // Stats overview
const [analytics, setAnalytics] = useState<any>(null);               // Analytics data
const [orders, setOrders] = useState<any[]>([]);                     // Orders list
const [inquiries, setInquiries] = useState<any[]>([]);               // Inquiries list
const [engagement, setEngagement] = useState<any>(null);             // Engagement metrics
const [products, setProducts] = useState<any[]>([]);                 // Products list
```

#### API Calls in useEffect:
```typescript
useEffect(() => {
  fetchDashboardData(); // Fetches all dashboard data on component mount
}, [user, API_URL]);
```

### Real Data Displayed

#### Dashboard Overview (Stats Cards):
- **Active Listings**: Number of active products
- **Inquiries**: Number of pending inquiries
- **Total Sales**: Revenue this month
- **Profile Views**: Number of times seller profile was viewed

#### Analytics Page:
- Daily, Weekly, Monthly, Yearly sales data
- Revenue tracking
- Product view counts
- Refund statistics

#### Orders Page:
- List of all orders with status
- Completed and pending orders
- Order amounts and dates

#### Inquiries Page:
- Buyer inquiries for products
- Read/unread status
- Reply tracking

#### Engagement Metrics:
- Total messages/inquiries
- Unread message count
- Average customer rating
- Total unique customers

## Setup Instructions

### 1. Backend Setup

#### Add Models to Server
The Order and Inquiry models are already created. Ensure they're imported in your server.js:

```javascript
import Order from './models/Order.js';
import Inquiry from './models/Inquiry.js';
```

#### Update Package.json
Ensure all dependencies are installed:
```bash
cd backend
npm install
```

### 2. Seed Test Data

Run the seeding script to populate test data:

```bash
node scripts/seed_dashboard_data.js
```

This creates:
- Test seller account (seller@test.com)
- Test buyer account (buyer@test.com)
- 3 test products
- 3 test orders (2 completed, 1 pending)
- 2 test inquiries
- Profile views and total sales metrics

### 3. Frontend Setup

The SellerDashboard component automatically:
1. Fetches data on mount using `useAuth()` context
2. Displays loading state while fetching
3. Updates all displayed metrics with real data
4. Passes stats to DashboardOverview component

#### Environment Variables
Ensure `VITE_API_URL` is set in your `.env` file:

```
VITE_API_URL=http://localhost:5000
```

## Data Flow

```
Login/Register
    ↓
User data stored in AuthContext + localStorage
    ↓
SellerDashboard mounted
    ↓
useEffect triggers data fetch
    ↓
API calls to backend endpoints
    ↓
Backend queries database
    ↓
Real data returned to frontend
    ↓
State updated
    ↓
Components re-render with real data
```

## Dashboard Pages with Real Data

### 1. Dashboard (Overview)
✅ Active listings count
✅ Total inquiries
✅ Monthly sales revenue
✅ Profile views

### 2. Analytics
✅ Daily/Weekly/Monthly/Yearly sales
✅ Revenue tracking
✅ Product views
✅ Refund statistics

### 3. Orders
✅ List of all orders
✅ Order status (pending/completed/refunded)
✅ Customer names and emails
✅ Order amounts and dates

### 4. Inquiries
✅ Buyer inquiries/messages
✅ Read/unread status
✅ Product-specific inquiries
✅ Conversation replies

### 5. Buyer Messages
✅ Direct messages from buyers
✅ Product-specific questions
✅ Message timestamps
✅ Response tracking

## Features Implemented

### For Sellers:
- ✅ View all active product listings
- ✅ Track inquiries from buyers
- ✅ Monitor sales performance (daily/weekly/monthly/yearly)
- ✅ View customer engagement metrics
- ✅ Track profile views
- ✅ Manage orders and their status
- ✅ Handle refunds and disputes
- ✅ Export analytics reports

### For Students:
- ✅ Same dashboard as sellers
- ✅ All selling features available
- ✅ Additional "Request Assistance" page (role-based)
- ✅ Contact teacher/school administration

## Database Schema

### User (updated)
```
- profileViews: Number (default 0)
- totalSales: Number (default 0)
```

### Product (updated)
```
- viewCount: Number (default 0)
- totalSold: Number (default 0)
- status: enum ['active', 'inactive', 'sold-out']
```

### Order (new)
```
- sellerId, buyerId, productId
- amount, quantity, status
- rating, feedback
- refundStatus, refundReason
- timestamps
```

### Inquiry (new)
```
- sellerId, buyerId, productId
- message, status
- replies array with conversation history
- timestamps
```

## Testing the Integration

1. **Login with test seller**:
   - Email: `seller@test.com`
   - Password: `Test@1234`

2. **Check Dashboard Overview**:
   - Should show 3 active listings
   - Should show 2 inquiries
   - Should show $80.00 in monthly sales
   - Should show profile views

3. **Check Analytics Page**:
   - Should show sales data for daily/weekly/monthly/yearly
   - Should show 2 completed orders
   - Should show 1 pending order

4. **Check Inquiries Page**:
   - Should show 2 buyer inquiries
   - Can mark as read/replied

5. **Check Orders Page**:
   - Should show 3 orders
   - 2 completed, 1 pending

## API Response Examples

### GET /api/dashboard/stats
```json
{
  "name": "Test Seller",
  "email": "seller@test.com",
  "role": "seller",
  "activeListings": 3,
  "totalProducts": 3,
  "totalEnquiries": 2,
  "totalSales": 2,
  "totalRevenue": 80.00,
  "profileViews": 42,
  "thisMonthSales": 2,
  "thisMonthRevenue": 80.00,
  "recentListings": [...]
}
```

### GET /api/dashboard/analytics
```json
{
  "daily": { "total": 0, "count": 0, "refunds": 0 },
  "weekly": { "total": 80.00, "count": 2, "refunds": 0 },
  "monthly": { "total": 80.00, "count": 2, "refunds": 0 },
  "yearly": { "total": 80.00, "count": 2, "refunds": 0 },
  "productViews": { ... }
}
```

## Future Enhancements

1. Add Order model to track sales in detail
2. Implement real payment processing
3. Add notification system for inquiries
4. Implement automatic sales calculations
5. Add performance metrics and analytics charts
6. Implement withdrawal requests (already on UI)
7. Add admin dashboard with platform-wide analytics

## Troubleshooting

### Data not showing on dashboard?
1. Check browser console for API errors
2. Verify backend server is running
3. Check VITE_API_URL environment variable
4. Ensure token is in localStorage
5. Run seed script to populate test data

### "Loading..." state persists?
1. Check network tab in browser DevTools
2. Verify API endpoints are responding
3. Check backend server logs
4. Verify database connection

### Orders/Inquiries are empty?
1. Run `node scripts/seed_dashboard_data.js`
2. Verify Order and Inquiry models are imported in server.js
3. Check if dashboard routes are registered in server.js

## Support

For issues or questions, check:
- Backend logs: `backend/server.js`
- Frontend console: Browser DevTools
- Database: MongoDB collections for User, Product, Order, Inquiry
