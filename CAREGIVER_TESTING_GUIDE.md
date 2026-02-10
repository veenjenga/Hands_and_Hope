# Caregiver Management Testing Guide

## What Was Fixed

### Backend Issues Fixed:
1. **Permission Level Enum Mismatch**: Updated `Caregiver.js` model to accept the correct permission levels:
   - Changed from: `['view_only', 'edit', 'full_control']`
   - Changed to: `['full', 'financial_only', 'product_management', 'view_only', 'custom']`

2. **Activity Log Schema**: Added missing fields to activity log:
   - Added `resourceType` field
   - Added `resourceName` field

### Frontend Issues Fixed:
1. **Missing Toast Notifications**: Added `Toaster` component from `sonner` library to `App.tsx`
   - Toast notifications will now properly display success/error messages
   - Positioned at top-right with rich colors

## How to Test the Add Caregiver Feature

### Prerequisites:
1. Make sure your backend server is running on port 5000
2. Make sure MongoDB is connected
3. You should be logged in as a seller or student

### Step-by-Step Testing:

#### 1. Start the Backend Server
```bash
cd C:\Users\Hp\Hands_and_Hope\backend
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

#### 2. Start the Frontend (Development Mode)
```bash
cd C:\Users\Hp\Hands_and_Hope\Sellers2
npm run dev
```

Or use the built version:
```bash
npm run preview
```

#### 3. Test Adding a Caregiver

1. **Navigate to Caregiver Management**:
   - Click on "Caregivers" in the left sidebar
   - You should see the Caregiver Management page

2. **Click "Add Caregiver/Helper" Button**:
   - The dialog should open with a form

3. **Fill in the Required Fields**:
   - **Full Name**: Enter caregiver's name (e.g., "John Doe")
   - **Email**: Enter a valid email (e.g., "john.doe@example.com")
   - **Relationship**: Select from dropdown (Parent, Guardian, Caregiver, Helper, Other)
   - **Relationship Details** (Optional): Add details (e.g., "Mother")
   - **Permission Level**: Click on one of the cards:
     - **Full Access**: Complete access to all features
     - **Financial Management**: Only view and manage finances
     - **Product Management**: Manage products, inquiries, and shipments
     - **View Only**: Can only view, cannot make changes

4. **Submit the Form**:
   - Click the "Add Caregiver" button
   - You should see a **success toast notification** with:
     - Message: "Caregiver added successfully!"
     - If new user: Shows temporary password (IMPORTANT: Copy this!)
     - If existing user: Shows account linked message

5. **Verify the Caregiver Appears**:
   - The dialog should close
   - The new caregiver should appear in the list
   - Check that all details are correct:
     - Name, email, relationship
     - Permission level
     - Status: "pending"
     - Added date

### Expected Results:

#### Success Case:
- ✅ Toast notification appears: "Caregiver added successfully!"
- ✅ If new email: Shows temporary password in toast
- ✅ Dialog closes
- ✅ Caregiver appears in the list immediately
- ✅ All information displays correctly

#### Error Cases You Might See:

1. **Missing Required Fields**:
   - Error toast: "Please fill in all required fields"
   - Form stays open for correction

2. **Email Already Linked**:
   - Error toast: "Caregiver already linked to this account"
   - Cannot add the same person twice

3. **Backend Connection Error**:
   - Error toast: "Failed to add caregiver"
   - Check that backend is running

## Testing Other Caregiver Features

### Edit Permissions:
1. Click "Edit Permissions" on any caregiver
2. Toggle individual permissions using switches
3. Click "Save Permissions"
4. Success toast should appear
5. Changes should be reflected in the caregiver card

### View Activity:
1. Click "View Activity" on any caregiver
2. Dialog opens showing activity log
3. (Note: Will be empty until caregiver performs actions)

### Remove Caregiver:
1. Click "Remove" button (red)
2. Confirmation dialog appears
3. Click "Remove Caregiver"
4. Success toast: "{Name} has been removed"
5. Caregiver disappears from list

## Backend API Testing (Using Postman or Thunder Client)

### 1. Get Auth Token First
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "your-seller-email@example.com",
  "password": "your-password"
}
```

Copy the `token` from the response.

### 2. Add Caregiver
```
POST http://localhost:5000/api/dashboard/caregivers
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "relationshipType": "parent",
  "relationshipDetails": "Mother",
  "permissionLevel": "full"
}
```

**Expected Response:**
```json
{
  "message": "Caregiver added",
  "caregiver": {
    "id": "...",
    "userId": "...",
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com"
  },
  "tempPassword": "randomly-generated-password"
}
```

### 3. List Caregivers
```
GET http://localhost:5000/api/dashboard/caregivers
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
[
  {
    "id": "...",
    "userId": "...",
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "relationshipType": "parent",
    "relationshipDetails": "Mother",
    "addedDate": "2026-02-01T...",
    "lastLogin": null,
    "status": "pending",
    "permissionLevel": "full",
    "permissions": {
      "viewProfile": true,
      "editProfile": true,
      // ... all permissions
    },
    "totalActions": 0,
    "lastActionDate": null
  }
]
```

## Troubleshooting

### Issue: Toast Notifications Don't Appear
**Solution**: 
- Make sure you rebuilt the frontend after adding the Toaster component
- Check browser console for errors
- Verify `sonner` package is installed: `npm list sonner`

### Issue: "Permission Level" Error
**Solution**: 
- Backend model was updated to accept correct values
- Restart backend server after model changes
- Use one of: `'full'`, `'financial_only'`, `'product_management'`, `'view_only'`

### Issue: Backend Connection Failed
**Solution**:
- Check backend is running: Look for "Server running on port 5000"
- Check MongoDB is connected
- Check `.env` file has correct `MONGO_URI`
- Check firewall isn't blocking port 5000

### Issue: "Cannot read property of undefined" 
**Solution**:
- Make sure you're logged in (token in localStorage)
- Check Network tab in browser DevTools for API responses
- Verify user has correct role (seller or student)

## Database Verification

To check if caregivers are being saved in MongoDB:

1. Connect to your MongoDB database
2. Use MongoDB Compass or mongo shell
3. Check the `caregivers` collection:

```javascript
db.caregivers.find().pretty()
```

You should see documents with:
- `user` field (ObjectId reference)
- `managedAccounts` array with your seller's ID
- `permissionLevel` matching what you selected
- `status: 'pending'`

## Next Steps

Once a caregiver is added:
1. They receive login credentials via email (when email service is configured)
2. They can log in with their email and temporary password
3. System prompts them to change password on first login
4. They see only the accounts they manage
5. Their actions get logged in the activity log

## Summary of Changes Made

### Files Modified:
1. ✅ `backend/models/Caregiver.js`
   - Updated `permissionLevel` enum to match frontend
   - Added `resourceType` and `resourceName` to activityLog

2. ✅ `Sellers2/src/App.tsx`
   - Added `Toaster` component from sonner
   - Toast notifications now work globally

### Files Already Correct:
- ✅ `backend/routes/dashboardRoutes.js` - All endpoints working
- ✅ `Sellers2/src/components/CaregiverManagementPage.tsx` - Form and handlers correct
- ✅ All API integration code

## Test Checklist

- [ ] Backend server starts without errors
- [ ] Frontend builds successfully
- [ ] Can navigate to Caregiver Management page
- [ ] "Add Caregiver/Helper" button opens dialog
- [ ] All form fields are visible and editable
- [ ] Can select different permission levels
- [ ] Submitting form shows success toast
- [ ] New caregiver appears in list
- [ ] Can edit permissions of existing caregiver
- [ ] Can view activity (even if empty)
- [ ] Can remove caregiver with confirmation
- [ ] Error messages appear for validation failures

---

**All issues have been fixed! The Add Caregiver feature should now work completely.** 🎉
