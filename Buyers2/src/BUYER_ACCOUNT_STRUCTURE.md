# Buyer Account Structure - Hands and Hope Platform

## Overview
This document outlines the complete structure of buyer accounts in the Hands and Hope e-commerce platform, including all attributes, features, and functionalities available to buyers.

---

## User Data Model

### Core Buyer Attributes

```typescript
interface BuyerUser {
  id: number;                    // Unique identifier (timestamp-based)
  name: string;                  // Full name of the buyer
  email: string;                 // Email address (used for login)
  phone: string;                 // Phone number (optional)
  address: string;               // Primary address (optional)
  locationEnabled: boolean;      // Location tracking consent for deliveries
  password: string;              // Hashed password (not stored in frontend state)
}
```

### Required Fields (Sign Up)
- **Name** (Full name)
- **Email** (Must be valid email format)
- **Password** (Minimum 6 characters)
- **Confirm Password** (Must match password)

### Optional Fields (Sign Up)
- **Phone** (Contact number)
- **Address** (Shipping/billing address)
- **Location Tracking Consent** (Checkbox for delivery tracking)

---

## Account Features

### 1. Authentication System

#### Sign Up
- **File**: `/components/SignUpPage.tsx`
- **Fields Collected**:
  - Full Name
  - Email
  - Phone (optional)
  - Address (optional)
  - Password
  - Confirm Password
  - Location tracking consent (checkbox)
- **Validation**:
  - All required fields must be filled
  - Passwords must match
  - Password minimum length: 6 characters
- **Process**: Creates new user object and redirects to homepage

#### Login
- **File**: `/components/LoginPage.tsx`
- **Credentials**:
  - Email
  - Password
- **Features**:
  - Remember me option
  - Forgot password link (placeholder)
  - Link to sign up page

#### Logout
- Accessible from Header component
- Clears current user session
- Redirects to homepage

---

### 2. Profile Management

**File**: `/components/ProfilePage.tsx`

#### Editable Information
- Full Name
- Email Address
- Phone Number
- Shipping Address

#### Profile Tabs

##### Overview Tab
Displays summary statistics:
- **Total Orders**: Count of all orders
- **Total Spent**: Sum of all purchases
- **Pending Orders**: Count of active orders
- **Saved Items**: Number of items in cart

##### Orders Tab
Purchase history with:
- Product name and image
- Purchase price
- Order date
- Delivery status (Delivered, In Transit, Processing)
- Review and rating system (1-5 stars)
- Option to leave text reviews

##### Pending Orders Tab
Active orders showing:
- Product details and image
- Order price
- Order date
- Estimated delivery date
- Current status (In Transit, Processing, etc.)
- Tracking number
- Track Order button (shows location updates)

##### Cart Tab
Shopping cart management:
- Product image and name
- Price per item
- Quantity selector
- Subtotal calculation
- Remove item option
- Proceed to Checkout button

##### Payment Methods Tab
Saved payment options:
- **Credit/Debit Cards**:
  - Card type (Visa, Mastercard, etc.)
  - Last 4 digits
  - Expiry date
  - Default card indicator
- **Mobile Money**:
  - Provider name (BuyGoods, etc.)
  - Phone number
  - Default method indicator
- Add New Payment Method button
- Remove payment method option

##### Settings Tab
Account preferences:
- Privacy settings
- Notification preferences
- Account deletion option

---

### 3. Shopping Features

#### Product Browsing
- **File**: `/components/HomePage.tsx`
- Search functionality
- Category filters (Textiles, Art, Food, Furniture, Jewelry, Accessories)
- Product grid with images, names, prices, ratings
- Quick view and Add to Cart buttons

#### Product Details
- **File**: `/components/ProductDetailPage.tsx`
- Full product information
- Image gallery
- Price and rating
- Quantity selector
- Add to Cart button
- Product description
- Seller information
- Customer reviews and ratings
- Related products

#### Shopping Cart
- Add/remove items
- Update quantities
- View subtotal
- Proceed to checkout

---

### 4. Checkout Process

**File**: `/components/CheckoutPage.tsx`

#### Shipping Information
- Full Name (pre-filled from profile)
- Delivery Address (pre-filled from profile)
- City
- ZIP/Postal Code
- Phone Number (pre-filled from profile)
- Location Tracking Option (checkbox for real-time delivery tracking)

#### Payment Methods
Two options available:
1. **Credit/Debit Card**
   - Card Number
   - Cardholder Name
   - Expiry Date
   - CVV
   
2. **Mobile Money**
   - Phone Number
   - Provider (BuyGoods, M-Pesa, etc.)

#### Order Summary
- Item details with quantities
- Subtotal
- Shipping cost
- Tax (8%)
- **Total Amount**

#### Order Confirmation
- Success message
- Order number
- Estimated delivery date
- Order tracking information

---

### 5. Order Tracking

#### Features
- Real-time location tracking (if location consent given)
- Order status updates:
  - Order Placed
  - Processing
  - Shipped/In Transit
  - Out for Delivery
  - Delivered
- Tracking number
- Estimated delivery date
- Delivery address confirmation

---

### 6. Review & Rating System

**File**: `/components/ProductDetailPage.tsx`

#### Review Features
- Star rating (1-5 stars)
- Written review text
- Reviewer name display
- Review date
- Helpful vote counter (future feature)

#### Rating Display
- Overall product rating
- Total number of reviews
- Individual review cards
- Filter by rating (future feature)

---

### 7. Accessibility Features

**File**: `/components/AccessibilityMenu.tsx`

All buyer accounts have access to comprehensive accessibility settings:

#### Available Options
1. **Text Size Control**: 75% - 150%
2. **High Contrast Mode**: Black background with white text
3. **Screen Reader Support**: Announces changes and updates
4. **Voice Navigation**: Reads page content aloud
5. **Underline Links**: Enhanced link visibility
6. **Keyboard Navigation**: Enhanced focus indicators
7. **Reduce Motion**: Minimizes animations

#### Settings Persistence
- All accessibility settings saved to `localStorage`
- Settings persist across sessions
- Applied globally across all pages

---

## Data Storage

### Current Implementation (Frontend Only)
- User session stored in React state
- No backend database integration
- Data cleared on page refresh (unless localStorage used)

### localStorage Usage
1. **Accessibility Settings**: 
   - Key: `handsAndHopeAccessibility`
   - Contains all accessibility preferences
   
2. **User Session** (potential):
   - Key: `handsAndHopeUser`
   - Could store user token/session

---

## Security Considerations

### Current State (Mock Implementation)
- **Password Storage**: Not actually hashed (frontend only)
- **Authentication**: Client-side only, no backend verification
- **Data Persistence**: Limited to session/localStorage

### Production Requirements
For a production system, the following should be implemented:
- Backend API with secure authentication (JWT tokens)
- Password hashing (bcrypt, Argon2)
- HTTPS encryption
- Database storage (MongoDB, PostgreSQL, etc.)
- Email verification
- Password reset functionality
- Session management
- CSRF protection
- Rate limiting

---

## User Flow Diagrams

### Registration Flow
```
1. User visits /signup
2. Fills in registration form
   - Name (required)
   - Email (required)
   - Password (required)
   - Confirm Password (required)
   - Phone (optional)
   - Address (optional)
   - Location consent (optional)
3. Form validation
4. User object created
5. Redirect to homepage (logged in)
```

### Login Flow
```
1. User visits /login
2. Enters email and password
3. Mock validation (any credentials accepted)
4. User object retrieved/created
5. Redirect to homepage (logged in)
```

### Shopping Flow
```
1. Browse products on homepage
2. Click product for details
3. Add to cart
4. Continue shopping or go to cart
5. Review cart items
6. Proceed to checkout
7. Fill shipping information
8. Select payment method
9. Review order summary
10. Place order
11. Receive confirmation
12. Track order from profile
```

---

## Related Pages & Components

### Main Pages
- **HomePage** (`/`): Product browsing and search
- **LoginPage** (`/login`): User authentication
- **SignUpPage** (`/signup`): User registration
- **ProfilePage** (`/profile`): Account management
- **ProductDetailPage** (`/product/:id`): Product information
- **CheckoutPage** (`/checkout`): Order placement
- **SchoolsPage** (`/schools`): Disability institutions showcase
- **AboutPage** (`/about`): Platform information
- **ServicesPage** (`/services`): Available services
- **TeamPage** (`/team`): Team members
- **TeamMemberDetailPage** (`/team/:id`): Individual team member info

### Reusable Components
- **Header**: Navigation, cart, profile access, accessibility button
- **Sidebar**: Category filters
- **ProductCard**: Individual product display
- **ReviewCard**: Customer review display
- **AccessibilityMenu**: Accessibility settings panel

---

## Future Enhancements

### Potential Features
1. **Wishlist**: Save favorite products
2. **Order History Export**: Download order receipts
3. **Address Book**: Multiple saved addresses
4. **Payment History**: Transaction records
5. **Loyalty Program**: Points and rewards
6. **Notifications**: Order updates, promotions
7. **Chat Support**: Customer service messaging
8. **Product Comparisons**: Compare multiple items
9. **Gift Options**: Gift wrapping, messages
10. **Subscription Orders**: Recurring purchases

### Technical Improvements
- Backend integration with database
- Real authentication system
- Email notifications
- SMS order updates
- Payment gateway integration (Stripe, PayPal)
- Real-time inventory management
- Advanced search with filters
- Product recommendations based on history
- Social login (Google, Facebook)

---

## Contact & Support

For questions about the buyer account system or to report issues:
- Email: support@handsandhope.com (placeholder)
- Phone: +1-234-567-8900 (placeholder)
- Live Chat: Available 9 AM - 5 PM (placeholder)

---

**Last Updated**: December 6, 2025  
**Version**: 1.0  
**Platform**: Hands and Hope E-commerce Platform
