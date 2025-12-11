# 👥 Account Structure & User Roles

## Overview

The Hands & Hope marketplace platform features a comprehensive multi-role account system designed specifically for people with disabilities. This document outlines all account types, registration flows, hierarchies, and relationships.

---

## 🎭 Account Types

### 1. 👤 **Individual Seller**
**Who:** Independent sellers with disabilities

**Account Attributes (Data Fields):**

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `userId` | String (UUID) | ✅ Yes | Unique account identifier | `"usr_abc123xyz"` |
| `accountType` | String (Enum) | ✅ Yes | Account type identifier | `"individual_seller"` |
| `fullName` | String | ✅ Yes | User's full legal name | `"John Smith"` |
| `email` | String (Email) | ✅ Yes | Primary email address | `"john.smith@email.com"` |
| `password` | String (Hashed) | ✅ Yes | Encrypted password | `"$2b$10$..."` |
| `phoneNumber` | String | ❌ Optional | Contact phone number | `"+1-555-0100"` |
| `profileImage` | String (URL) | ❌ Optional | Avatar/profile photo URL | `"https://..."` |
| `disabilityId` | Object | ✅ Yes | Disability ID document | See below |
| `disabilityIdStatus` | String (Enum) | ✅ Yes | Verification status | `"pending"`, `"approved"`, `"rejected"` |
| `emailVerified` | Boolean | ✅ Yes | Email verification status | `true` / `false` |
| `accountStatus` | String (Enum) | ✅ Yes | Account status | `"active"`, `"pending"`, `"banned"`, `"suspended"` |
| `createdAt` | Timestamp | ✅ Yes | Account creation date | `"2024-12-01T10:00:00Z"` |
| `lastLogin` | Timestamp | ❌ Optional | Last login date/time | `"2024-12-06T15:30:00Z"` |
| `bio` | String (Text) | ❌ Optional | Seller biography | `"Artist specializing in..."` |
| `storeName` | String | ❌ Optional | Store/shop name | `"John's Crafts"` |
| `location` | Object | ❌ Optional | Address/location info | `{city, state, country, zip}` |
| `bankAccount` | Object | ❌ Optional | Payment/withdrawal info | Encrypted, see below |
| `totalProducts` | Number | Auto | Number of products listed | `12` |
| `totalSales` | Number | Auto | Total sales made | `156` |
| `totalEarnings` | Number | Auto | Total revenue earned | `$2,450.00` |
| `rating` | Number | Auto | Average seller rating | `4.8` (0-5) |
| `totalReviews` | Number | Auto | Number of reviews | `89` |
| `verificationBadge` | Boolean | Auto | Verified seller badge | `true` / `false` |
| `preferences` | Object | ❌ Optional | User preferences | See below |
| `notificationSettings` | Object | ❌ Optional | Notification preferences | See below |
| `accessibilitySettings` | Object | ❌ Optional | Accessibility preferences | See below |

**Disability ID Object:**
```json
{
  "documentUrl": "https://secure-storage/doc_123.pdf",
  "documentType": "government_id",
  "uploadedAt": "2024-12-01T10:15:00Z",
  "verifiedBy": "admin_usr_456",
  "verifiedAt": "2024-12-02T14:00:00Z",
  "expiryDate": "2027-12-01"
}
```

**Bank Account Object (Encrypted):**
```json
{
  "accountHolderName": "John Smith",
  "bankName": "First National Bank",
  "accountNumber": "****5678",
  "routingNumber": "****1234",
  "accountType": "checking",
  "isVerified": true
}
```

**Preferences Object:**
```json
{
  "language": "en",
  "currency": "USD",
  "timezone": "America/New_York",
  "theme": "light"
}
```

**Notification Settings Object:**
```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true,
  "orderUpdates": true,
  "marketingEmails": false,
  "weeklyReports": true
}
```

**Accessibility Settings Object:**
```json
{
  "highContrastMode": false,
  "textSize": "medium",
  "screenReaderEnabled": false,
  "voiceNavigationEnabled": false,
  "reducedMotion": false,
  "keyboardNavigationOnly": false
}
```

**Access Requirements:**
- ✅ Disability ID verification required
- ✅ Email verification
- ✅ Personal information
- ❌ No school affiliation needed

**Registration Flow:**
1. Navigate to Registration → "Individual Account" tab
2. Choose "Seller" role
3. Enter personal details (name, email, password)
4. Upload Disability ID document
5. Verify email
6. Account activated after Disability ID approval

**Dashboard Access:** Seller Dashboard
- Manage products
- View sales/analytics
- Handle orders & shipments
- Process withdrawals
- Respond to buyer messages
- View notifications

**Capabilities:**
- ✅ Add/edit/delete own products
- ✅ Manage inventory
- ✅ View earnings & withdraw funds
- ✅ Communicate with buyers
- ✅ View analytics
- ❌ Cannot manage other users

---

### 2. 🎓 **Student Seller**
**Who:** Students with disabilities enrolled in participating schools

**Account Attributes (Data Fields):**

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `userId` | String (UUID) | ✅ Yes | Unique account identifier | `"usr_stu456xyz"` |
| `accountType` | String (Enum) | ✅ Yes | Account type identifier | `"student_seller"` |
| `fullName` | String | ✅ Yes | Student's full legal name | `"Sarah Johnson"` |
| `email` | String (Email) | ✅ Yes | Primary email address | `"sarah.j@school.edu"` |
| `password` | String (Hashed) | ✅ Yes | Encrypted password | `"$2b$10$..."` |
| `phoneNumber` | String | ❌ Optional | Contact phone number | `"+1-555-0200"` |
| `profileImage` | String (URL) | ❌ Optional | Avatar/profile photo URL | `"https://..."` |
| `disabilityId` | Object | ✅ Yes | Disability ID document | See Individual Seller |
| `disabilityIdStatus` | String (Enum) | ✅ Yes | Verification status | `"pending"`, `"approved"`, `"rejected"` |
| `emailVerified` | Boolean | ✅ Yes | Email verification status | `true` / `false` |
| `accountStatus` | String (Enum) | ✅ Yes | Account status | `"active"`, `"pending"`, `"banned"`, `"suspended"` |
| `schoolId` | String (UUID) | ✅ Yes | Associated school ID | `"sch_789abc"` |
| `schoolName` | String | ✅ Yes | Name of affiliated school | `"Lincoln High School"` |
| `assignedTeacherId` | String (UUID) | ✅ Yes | Assigned teacher's ID | `"tcr_123xyz"` |
| `assignedTeacherName` | String | ✅ Yes | Assigned teacher's name | `"Mr. Robert Brown"` |
| `studentId` | String | ❌ Optional | School student ID number | `"STU-2024-1234"` |
| `gradeLevel` | String | ❌ Optional | Current grade level | `"Grade 10"`, `"Sophomore"` |
| `enrollmentStatus` | String (Enum) | ✅ Yes | School enrollment status | `"enrolled"`, `"graduated"`, `"withdrawn"` |
| `approvalStatus` | Object | ✅ Yes | Multi-level approval status | See below |
| `supervisionLevel` | String (Enum) | ✅ Yes | Teacher oversight level | `"high"`, `"medium"`, `"low"` |
| `assistanceRequests` | Array | Auto | List of assistance requests | See below |
| `parentGuardianInfo` | Object | ❌ Optional | Parent/guardian contact | See below |
| `createdAt` | Timestamp | ✅ Yes | Account creation date | `"2024-11-15T09:00:00Z"` |
| `lastLogin` | Timestamp | ❌ Optional | Last login date/time | `"2024-12-06T14:20:00Z"` |
| `bio` | String (Text) | ❌ Optional | Student seller biography | `"High school artist..."` |
| `storeName` | String | ❌ Optional | Store/shop name | `"Sarah's Art Corner"` |
| `totalProducts` | Number | Auto | Number of products listed | `8` |
| `totalSales` | Number | Auto | Total sales made | `45` |
| `totalEarnings` | Number | Auto | Total revenue earned | `$680.00` |
| `rating` | Number | Auto | Average seller rating | `4.9` (0-5) |
| `totalReviews` | Number | Auto | Number of reviews | `32` |
| `verificationBadge` | Boolean | Auto | Verified seller badge | `true` / `false` |
| `preferences` | Object | ❌ Optional | User preferences | Same as Individual Seller |
| `notificationSettings` | Object | ❌ Optional | Notification preferences | Same as Individual Seller |
| `accessibilitySettings` | Object | ❌ Optional | Accessibility preferences | Same as Individual Seller |

**Approval Status Object:**
```json
{
  "emailVerified": true,
  "disabilityIdApproved": true,
  "disabilityIdApprovedBy": "admin_usr_456",
  "disabilityIdApprovedAt": "2024-11-16T10:00:00Z",
  "teacherApproved": true,
  "teacherApprovedBy": "tcr_123xyz",
  "teacherApprovedAt": "2024-11-15T15:30:00Z",
  "schoolAdminApproved": true,
  "schoolAdminApprovedBy": "adm_789def",
  "schoolAdminApprovedAt": "2024-11-15T16:00:00Z",
  "overallStatus": "approved"
}
```

**Assistance Requests Array:**
```json
[
  {
    "requestId": "req_001",
    "type": "product_listing",
    "description": "Need help uploading product photos",
    "status": "pending",
    "createdAt": "2024-12-05T10:00:00Z",
    "resolvedAt": null,
    "teacherResponse": null
  }
]
```

**Parent/Guardian Info Object:**
```json
{
  "name": "Mary Johnson",
  "relationship": "Mother",
  "email": "mary.johnson@email.com",
  "phone": "+1-555-0201",
  "notifyParent": true
}
```

**Access Requirements:**
- ✅ Disability ID verification required
- ✅ School affiliation required
- ✅ Email verification
- ✅ Teacher supervision

**Registration Flow:**
1. Navigate to Registration → "Individual Account" tab
2. Choose "Student" role
3. Enter personal details
4. Select school from dropdown (or request new school)
5. Upload Disability ID document
6. Verify email
7. Account activated after:
   - Disability ID approval
   - Teacher/School admin approval

**Dashboard Access:** Seller Dashboard (Student variant)
- Same as Individual Seller PLUS
- "Get Assistance" section
- Direct communication with teachers
- School admin oversight

**Capabilities:**
- ✅ Add/edit/delete own products (with teacher oversight)
- ✅ Manage inventory
- ✅ View earnings
- ✅ Request teacher assistance
- ✅ Communicate with buyers
- ⚠️ Products may require teacher approval
- ⚠️ Teacher can assist with listings

**Supervision:**
- Assigned teacher can view student's products
- Teacher can help create listings (with authorization)
- School admin oversees all student activity
- Teachers can approve/reject student products

---

### 3. 👨‍🏫 **Teacher**
**Who:** Teachers at participating schools who supervise student sellers

**Account Attributes (Data Fields):**

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `userId` | String (UUID) | ✅ Yes | Unique account identifier | `"tcr_123xyz"` |
| `accountType` | String (Enum) | ✅ Yes | Account type identifier | `"teacher"` |
| `fullName` | String | ✅ Yes | Teacher's full legal name | `"Robert Brown"` |
| `email` | String (Email) | ✅ Yes | Primary email address | `"robert.brown@school.edu"` |
| `password` | String (Hashed) | ✅ Yes | Encrypted password | `"$2b$10$..."` |
| `phoneNumber` | String | ❌ Optional | Contact phone number | `"+1-555-0300"` |
| `profileImage` | String (URL) | ❌ Optional | Avatar/profile photo URL | `"https://..."` |
| `emailVerified` | Boolean | ✅ Yes | Email verification status | `true` / `false` |
| `accountStatus` | String (Enum) | ✅ Yes | Account status | `"active"`, `"pending"`, `"banned"`, `"suspended"` |
| `schoolId` | String (UUID) | ✅ Yes | Associated school ID | `"sch_789abc"` |
| `schoolName` | String | ✅ Yes | Name of affiliated school | `"Lincoln High School"` |
| `teacherId` | String | ❌ Optional | School teacher ID/number | `"TCH-2024-567"` |
| `department` | String | ❌ Optional | Teaching department | `"Art Department"`, `"Special Education"` |
| `credentials` | Object | ✅ Yes | Teacher credentials/certifications | See below |
| `approvalStatus` | Object | ✅ Yes | Approval tracking | See below |
| `assignedStudents` | Array | Auto | List of assigned student IDs | `["usr_stu456xyz", "usr_stu789abc"]` |
| `totalStudents` | Number | Auto | Number of assigned students | `12` |
| `activeStudents` | Number | Auto | Number of active students | `10` |
| `pendingApprovals` | Number | Auto | Pending student approvals | `2` |
| `assistanceRequests` | Array | Auto | Pending assistance requests | See below |
| `productReviewQueue` | Array | Auto | Products awaiting review | See below |
| `activityLog` | Array | Auto | Teacher action history | See below |
| `permissions` | Object | ✅ Yes | Teacher-specific permissions | See below |
| `createdAt` | Timestamp | ✅ Yes | Account creation date | `"2024-10-01T08:00:00Z"` |
| `lastLogin` | Timestamp | ❌ Optional | Last login date/time | `"2024-12-06T09:15:00Z"` |
| `bio` | String (Text) | ❌ Optional | Teacher biography | `"Art teacher with 10 years..."` |
| `officeHours` | Object | ❌ Optional | Availability schedule | See below |
| `totalProductsReviewed` | Number | Auto | Products reviewed count | `87` |
| `totalStudentsApproved` | Number | Auto | Students approved count | `15` |
| `preferences` | Object | ❌ Optional | User preferences | Same as Individual Seller |
| `notificationSettings` | Object | ❌ Optional | Notification preferences | Same as Individual Seller |
| `accessibilitySettings` | Object | ❌ Optional | Accessibility preferences | Same as Individual Seller |

**Credentials Object:**
```json
{
  "teachingLicense": "LIC-12345-NY",
  "certifications": ["Special Education", "Art Education"],
  "yearsOfExperience": 10,
  "education": "Master of Education",
  "verificationDocuments": ["doc_url_1", "doc_url_2"],
  "backgroundCheckCompleted": true,
  "backgroundCheckDate": "2024-09-15T00:00:00Z"
}
```

**Approval Status Object:**
```json
{
  "emailVerified": true,
  "schoolAdminApproved": true,
  "schoolAdminApprovedBy": "adm_789def",
  "schoolAdminApprovedAt": "2024-10-01T14:00:00Z",
  "approvalNotes": "Verified credentials, approved for student supervision",
  "overallStatus": "approved"
}
```

**Assistance Requests Array:**
```json
[
  {
    "requestId": "req_002",
    "studentId": "usr_stu456xyz",
    "studentName": "Sarah Johnson",
    "type": "product_listing",
    "description": "Need help uploading product photos",
    "status": "pending",
    "priority": "medium",
    "createdAt": "2024-12-05T10:00:00Z"
  }
]
```

**Product Review Queue Array:**
```json
[
  {
    "productId": "prd_123",
    "studentId": "usr_stu456xyz",
    "studentName": "Sarah Johnson",
    "productTitle": "Handmade Ceramic Bowl",
    "submittedAt": "2024-12-06T08:30:00Z",
    "status": "pending_review",
    "requiresApproval": true
  }
]
```

**Activity Log Array:**
```json
[
  {
    "actionId": "act_001",
    "action": "approved_student",
    "targetUserId": "usr_stu456xyz",
    "timestamp": "2024-11-15T15:30:00Z",
    "details": "Approved student account after verification"
  },
  {
    "actionId": "act_002",
    "action": "approved_product",
    "productId": "prd_123",
    "timestamp": "2024-12-01T10:00:00Z",
    "details": "Approved product listing"
  }
]
```

**Permissions Object:**
```json
{
  "canApproveStudents": true,
  "canBanStudents": true,
  "canReviewProducts": true,
  "canAssistWithListings": true,
  "canViewStudentAnalytics": true,
  "canMessageStudents": true,
  "maxStudentsAllowed": 20
}
```

**Office Hours Object:**
```json
{
  "monday": {"start": "09:00", "end": "15:00", "available": true},
  "tuesday": {"start": "09:00", "end": "15:00", "available": true},
  "wednesday": {"start": "09:00", "end": "15:00", "available": true},
  "thursday": {"start": "09:00", "end": "15:00", "available": true},
  "friday": {"start": "09:00", "end": "12:00", "available": true},
  "preferredContact": "email"
}
```

**Access Requirements:**
- ✅ School affiliation required
- ✅ Email verification
- ✅ Teacher credentials
- ❌ No Disability ID required

**Registration Flow:**
1. Navigate to Registration → "School/Institution Account" tab
2. Choose "Teacher/Staff" role
3. Enter personal details
4. Select school from dropdown
5. Enter teacher credentials/ID
6. Verify email
7. Account activated after school admin approval

**Dashboard Access:** Teacher Dashboard
- Manage assigned students
- Approve/reject student accounts
- Review student products
- Assist with product listings
- Monitor student activity
- View school statistics

**Capabilities:**
- ✅ View list of students
- ✅ Approve new student registrations
- ✅ Ban/unban students (with reason)
- ✅ Review student products before going live
- ✅ Assist students with product listings (with authorization code)
- ✅ View student sales performance
- ✅ Message students
- ✅ View activity logs
- ❌ Cannot manage other teachers
- ❌ Cannot manage school settings

**Responsibilities:**
- Supervise assigned students
- Help students succeed
- Monitor for inappropriate content
- Approve product listings
- Provide guidance and support

---

### 4. 🏫 **School Administrator**
**Who:** School administrators managing teachers and students

**Account Attributes (Data Fields):**

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `userId` | String (UUID) | ✅ Yes | Unique account identifier | `"adm_789def"` |
| `accountType` | String (Enum) | ✅ Yes | Account type identifier | `"school_administrator"` |
| `fullName` | String | ✅ Yes | Administrator's full legal name | `"Dr. Patricia Williams"` |
| `email` | String (Email) | ✅ Yes | Primary email address | `"p.williams@lincolnhs.edu"` |
| `password` | String (Hashed) | ✅ Yes | Encrypted password | `"$2b$10$..."` |
| `phoneNumber` | String | ❌ Optional | Contact phone number | `"+1-555-0400"` |
| `profileImage` | String (URL) | ❌ Optional | Avatar/profile photo URL | `"https://..."` |
| `emailVerified` | Boolean | ✅ Yes | Email verification status | `true` / `false` |
| `accountStatus` | String (Enum) | ✅ Yes | Account status | `"active"`, `"pending"`, `"banned"`, `"suspended"` |
| `schoolId` | String (UUID) | ✅ Yes | Associated school ID | `"sch_789abc"` |
| `schoolName` | String | ✅ Yes | Name of affiliated school | `"Lincoln High School"` |
| `schoolInfo` | Object | ✅ Yes | Complete school information | See below |
| `administratorId` | String | ❌ Optional | School admin ID/number | `"ADM-2024-001"` |
| `position` | String | ❌ Optional | Administrative position | `"Principal"`, `"Vice Principal"`, `"Director"` |
| `credentials` | Object | ✅ Yes | Admin credentials/certifications | See below |
| `approvalStatus` | Object | ✅ Yes | Super admin approval tracking | See below |
| `teachers` | Array | Auto | List of teacher IDs in school | `["tcr_123xyz", "tcr_456abc"]` |
| `totalTeachers` | Number | Auto | Number of teachers | `8` |
| `activeTeachers` | Number | Auto | Number of active teachers | `7` |
| `pendingTeachers` | Number | Auto | Pending teacher approvals | `1` |
| `students` | Array | Auto | List of student IDs in school | `["usr_stu456xyz", ...]` |
| `totalStudents` | Number | Auto | Number of students | `45` |
| `activeStudents` | Number | Auto | Number of active students | `42` |
| `pendingStudents` | Number | Auto | Pending student approvals | `3` |
| `schoolSettings` | Object | ✅ Yes | School-specific settings | See below |
| `productApprovalPolicy` | Object | ✅ Yes | Product approval rules | See below |
| `analyticsAccess` | Object | ✅ Yes | School analytics data | See below |
| `activityLog` | Array | Auto | Admin action history | See below |
| `permissions` | Object | ✅ Yes | Admin-specific permissions | See below |
| `createdAt` | Timestamp | ✅ Yes | Account creation date | `"2024-09-01T08:00:00Z"` |
| `lastLogin` | Timestamp | ❌ Optional | Last login date/time | `"2024-12-06T08:00:00Z"` |
| `bio` | String (Text) | ❌ Optional | Administrator biography | `"Principal with 15 years..."` |
| `officeHours` | Object | ❌ Optional | Availability schedule | Same as Teacher |
| `totalActionsPerformed` | Number | Auto | Total administrative actions | `234` |
| `preferences` | Object | ❌ Optional | User preferences | Same as Individual Seller |
| `notificationSettings` | Object | ❌ Optional | Notification preferences | Same as Individual Seller |
| `accessibilitySettings` | Object | ❌ Optional | Accessibility preferences | Same as Individual Seller |

**School Info Object:**
```json
{
  "schoolId": "sch_789abc",
  "schoolName": "Lincoln High School",
  "schoolType": "High School",
  "address": {
    "street": "123 Education Ave",
    "city": "Springfield",
    "state": "NY",
    "zip": "12345",
    "country": "USA"
  },
  "contactEmail": "info@lincolnhs.edu",
  "contactPhone": "+1-555-1000",
  "website": "https://www.lincolnhs.edu",
  "establishedYear": 1985,
  "accreditation": "State Accredited",
  "studentCapacity": 500,
  "specialEducationProgram": true
}
```

**Credentials Object:**
```json
{
  "administrativeLicense": "ADM-LIC-67890-NY",
  "certifications": ["Educational Leadership", "Special Education Administration"],
  "yearsOfExperience": 15,
  "education": "Doctorate in Educational Leadership",
  "verificationDocuments": ["doc_url_1", "doc_url_2"],
  "backgroundCheckCompleted": true,
  "backgroundCheckDate": "2024-08-15T00:00:00Z",
  "references": [
    {"name": "Reference 1", "position": "Superintendent", "verified": true}
  ]
}
```

**Approval Status Object:**
```json
{
  "emailVerified": true,
  "superAdminApproved": true,
  "superAdminApprovedBy": "admin_usr_001",
  "superAdminApprovedAt": "2024-09-01T16:00:00Z",
  "approvalNotes": "Verified credentials and school information, approved for school management",
  "schoolVerified": true,
  "overallStatus": "approved"
}
```

**School Settings Object:**
```json
{
  "requireProductApproval": true,
  "autoAssignTeachers": true,
  "maxStudentsPerTeacher": 15,
  "allowStudentWithdrawals": true,
  "parentNotifications": true,
  "publicProfile": true,
  "acceptNewStudents": true,
  "acceptNewTeachers": true
}
```

**Product Approval Policy Object:**
```json
{
  "requireTeacherApproval": true,
  "requireAdminApproval": false,
  "autoApproveAfterDays": null,
  "categories": {
    "handmade": {"requireApproval": true},
    "digital": {"requireApproval": false},
    "services": {"requireApproval": true}
  }
}
```

**Analytics Access Object:**
```json
{
  "totalRevenue": 12450.00,
  "totalProducts": 156,
  "totalSales": 432,
  "topSellingStudent": "usr_stu456xyz",
  "averageProductPrice": 28.82,
  "monthlyGrowth": 15.3
}
```

**Activity Log Array:**
```json
[
  {
    "actionId": "act_admin_001",
    "action": "approved_teacher",
    "targetUserId": "tcr_123xyz",
    "timestamp": "2024-10-01T14:00:00Z",
    "details": "Approved new teacher: Robert Brown"
  },
  {
    "actionId": "act_admin_002",
    "action": "banned_student",
    "targetUserId": "usr_stu999zzz",
    "timestamp": "2024-11-10T09:00:00Z",
    "details": "Banned student for policy violation",
    "reason": "Inappropriate content in product listing"
  }
]
```

**Permissions Object:**
```json
{
  "canManageTeachers": true,
  "canManageStudents": true,
  "canApproveTeachers": true,
  "canApproveStudents": true,
  "canBanUsers": true,
  "canViewSchoolAnalytics": true,
  "canConfigureSettings": true,
  "canExportReports": true,
  "canOverrideTeacherDecisions": true,
  "maxTeachersAllowed": 50,
  "maxStudentsAllowed": 200
}
```

**Access Requirements:**
- ✅ School affiliation required
- ✅ Email verification
- ✅ Administrative credentials
- ❌ No Disability ID required

**Registration Flow:**
1. Navigate to Registration → "School/Institution Account" tab
2. Choose "School Administrator" role
3. Enter school details
4. Select school from dropdown (or request new school)
5. Enter administrator credentials
6. Verify email
7. Account activated after platform super-admin approval

**Dashboard Access:** School Dashboard
- Manage teachers
- Manage students (all in school)
- View school-wide statistics
- Access to all teacher capabilities
- School settings management

**Capabilities:**
- ✅ Add/remove/manage teachers
- ✅ View all students in school
- ✅ View all teacher activity
- ✅ Approve new teacher accounts
- ✅ Ban/unban teachers or students
- ✅ View school-wide analytics
- ✅ Export reports
- ✅ Configure school settings
- ✅ All teacher capabilities
- ❌ Cannot manage other schools
- ❌ Cannot manage platform settings

**Hierarchy:**
- Oversees all teachers in their school
- Monitors all students in their school
- Can override teacher decisions
- Reports to platform super-admin

---

### 5. 👑 **Super Administrator**
**Who:** Platform administrators managing the entire marketplace

**Account Attributes (Data Fields):**

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `userId` | String (UUID) | ✅ Yes | Unique account identifier | `"admin_usr_001"` |
| `accountType` | String (Enum) | ✅ Yes | Account type identifier | `"super_administrator"` |
| `fullName` | String | ✅ Yes | Admin's full legal name | `"Michael Anderson"` |
| `email` | String (Email) | ✅ Yes | Primary email address | `"m.anderson@handsandhope.com"` |
| `password` | String (Hashed) | ✅ Yes | Encrypted password | `"$2b$10$..."` |
| `phoneNumber` | String | ✅ Yes | Contact phone number | `"+1-555-0500"` |
| `profileImage` | String (URL) | ❌ Optional | Avatar/profile photo URL | `"https://..."` |
| `emailVerified` | Boolean | ✅ Yes | Email verification status | `true` |
| `accountStatus` | String (Enum) | ✅ Yes | Account status | `"active"`, `"suspended"` |
| `adminLevel` | String (Enum) | ✅ Yes | Administrative level | `"super_admin"`, `"senior_admin"`, `"admin"` |
| `adminId` | String | ✅ Yes | Platform admin ID | `"SADM-001"` |
| `position` | String | ❌ Optional | Administrative position | `"Platform Director"`, `"Chief Admin"` |
| `department` | String | ❌ Optional | Department | `"Platform Management"`, `"User Verification"` |
| `securityClearance` | Object | ✅ Yes | Security level & access | See below |
| `twoFactorEnabled` | Boolean | ✅ Yes | 2FA requirement | `true` |
| `twoFactorMethod` | String (Enum) | ✅ Yes | 2FA type | `"app"`, `"sms"`, `"email"` |
| `ipWhitelist` | Array | ❌ Optional | Allowed IP addresses | `["192.168.1.1", "10.0.0.1"]` |
| `lastSecurityAudit` | Timestamp | ✅ Yes | Last security review | `"2024-12-01T00:00:00Z"` |
| `managedSchools` | Array | Auto | All platform schools | `["sch_789abc", ...]` |
| `totalSchools` | Number | Auto | Number of schools | `15` |
| `totalUsers` | Number | Auto | Total platform users | `750` |
| `totalSellers` | Number | Auto | Individual sellers | `500` |
| `totalStudents` | Number | Auto | Student sellers | `200` |
| `totalTeachers` | Number | Auto | Teachers | `50` |
| `totalSchoolAdmins` | Number | Auto | School administrators | `15` |
| `pendingVerifications` | Object | Auto | Pending approvals | See below |
| `verificationQueue` | Array | Auto | Items awaiting review | See below |\n| `platformAnalytics` | Object | Auto | Platform-wide data | See below |
| `moderationQueue` | Array | Auto | Content to moderate | See below |
| `systemSettings` | Object | ✅ Yes | Platform configuration | See below |
| `auditLog` | Array | Auto | All admin actions | See below |
| `permissions` | Object | ✅ Yes | Full platform permissions | See below |
| `createdAt` | Timestamp | ✅ Yes | Account creation date | `"2024-01-01T00:00:00Z"` |
| `lastLogin` | Timestamp | ✅ Yes | Last login date/time | `"2024-12-06T07:00:00Z"` |
| `bio` | String (Text) | ❌ Optional | Administrator biography | `"Platform administrator since..."` |
| `emergencyContact` | Object | ✅ Yes | Emergency contact info | See below |
| `totalActionsPerformed` | Number | Auto | Total admin actions | `5,678` |
| `totalDisabilityIDsReviewed` | Number | Auto | IDs reviewed | `550` |
| `totalSchoolsApproved` | Number | Auto | Schools approved | `15` |
| `totalBansIssued` | Number | Auto | Users banned | `8` |
| `preferences` | Object | ❌ Optional | User preferences | Same as Individual Seller |
| `notificationSettings` | Object | ✅ Yes | Critical notifications | See below |
| `accessibilitySettings` | Object | ❌ Optional | Accessibility preferences | Same as Individual Seller |

**Security Clearance Object:**
```json
{
  "level": "maximum",
  "accessAllUsers": true,
  "accessAllSchools": true,
  "accessFinancialData": true,
  "accessAuditLogs": true,
  "canModifySystemSettings": true,
  "canDeleteAccounts": true,
  "canIssueRefunds": true,
  "emergencyOverride": true,
  "backgroundCheckDate": "2024-01-01T00:00:00Z",
  "securityTrainingCompleted": true,
  "securityTrainingDate": "2024-01-15T00:00:00Z"
}
```

**Pending Verifications Object:**
```json
{
  "disabilityIDs": 50,
  "schoolAdmins": 0,
  "newSchools": 2,
  "appeals": 3,
  "urgentReviews": 1
}
```

**Verification Queue Array:**
```json
[
  {
    "queueId": "vq_001",
    "type": "disability_id",
    "userId": "usr_abc123xyz",
    "userName": "John Smith",
    "submittedAt": "2024-12-05T10:00:00Z",
    "priority": "normal",
    "status": "pending"
  },
  {
    "queueId": "vq_002",
    "type": "school_admin",
    "userId": "adm_new123",
    "schoolName": "New Academy",
    "submittedAt": "2024-12-04T14:00:00Z",
    "priority": "high",
    "status": "in_review"
  }
]
```

**Platform Analytics Object:**
```json
{
  "totalRevenue": 125000.00,
  "totalProducts": 1567,
  "totalSales": 4523,
  "activeUsers": 680,
  "monthlyGrowth": 8.5,
  "averageOrderValue": 27.65,
  "topSellingCategory": "Handmade Crafts",
  "platformUptime": 99.8,
  "averageResponseTime": "1.2s",
  "customerSatisfaction": 4.7
}
```

**Moderation Queue Array:**
```json
[
  {
    "moderationId": "mod_001",
    "type": "product_review",
    "productId": "prd_flagged_123",
    "sellerId": "usr_abc123xyz",
    "reason": "Inappropriate content reported",
    "reportedBy": "usr_reporter_456",
    "reportedAt": "2024-12-06T09:00:00Z",
    "priority": "high",
    "status": "pending"
  }
]
```

**System Settings Object:**
```json
{
  "platformName": "Hands & Hope",
  "maintenanceMode": false,
  "allowNewRegistrations": true,
  "requireEmailVerification": true,
  "requireDisabilityIDForSellers": true,
  "autoApproveProducts": false,
  "platformFeePercentage": 5.0,
  "minimumWithdrawalAmount": 25.00,
  "maxProductImageSize": 5242880,
  "allowedFileTypes": ["jpg", "png", "pdf"],
  "sessionTimeout": 3600,
  "passwordPolicy": {
    "minLength": 8,
    "requireUppercase": true,
    "requireNumbers": true,
    "requireSpecialChars": true
  }
}
```

**Audit Log Array:**
```json
[
  {
    "auditId": "aud_12345",
    "adminId": "admin_usr_001",
    "adminName": "Michael Anderson",
    "action": "approved_disability_id",
    "targetUserId": "usr_abc123xyz",
    "targetUserName": "John Smith",
    "timestamp": "2024-12-02T14:00:00Z",
    "ipAddress": "192.168.1.100",
    "details": "Reviewed and approved disability ID document",
    "previousValue": "pending",
    "newValue": "approved"
  },
  {
    "auditId": "aud_12346",
    "adminId": "admin_usr_001",
    "action": "banned_user",
    "targetUserId": "usr_violation_999",
    "targetUserName": "Violator Name",
    "timestamp": "2024-11-20T10:30:00Z",
    "ipAddress": "192.168.1.100",
    "details": "Banned user for repeated policy violations",
    "reason": "Selling prohibited items",
    "duration": "permanent"
  }
]
```

**Emergency Contact Object:**
```json
{
  "name": "Jane Anderson",
  "relationship": "Emergency Contact",
  "email": "emergency@handsandhope.com",
  "phone": "+1-555-9999",
  "alternatePhone": "+1-555-8888"
}
```

**Notification Settings Object (Super Admin):**
```json
{
  "emailNotifications": true,
  "smsNotifications": true,
  "pushNotifications": true,
  "criticalAlerts": true,
  "systemDownAlerts": true,
  "securityAlerts": true,
  "newVerifications": true,
  "userReports": true,
  "financialAlerts": true,
  "dailyReports": true,
  "weeklyReports": true,
  "monthlyReports": true
}
```

**Permissions Object:**
```json
{
  "canManageAllUsers": true,
  "canManageAllSchools": true,
  "canVerifyDisabilityIDs": true,
  "canApproveSchoolAdmins": true,
  "canBanAnyUser": true,
  "canDeleteAccounts": true,
  "canViewAllFinancials": true,
  "canIssueRefunds": true,
  "canModerateContent": true,
  "canModifySystemSettings": true,
  "canAccessAuditLogs": true,
  "canCreateAdminAccounts": true,
  "canSendPlatformAnnouncements": true,
  "canExportAllData": true,
  "canManagePayments": true,
  "emergencyShutdown": true
}
```

**Access Requirements:**
- ✅ Platform administrative access
- ✅ Special admin credentials
- ✅ Separate admin login portal

**Access Method:**
1. Navigate to Login page
2. Click "Admin Access" link (bottom)
3. Enter admin credentials
4. Access Super Admin Dashboard

**Dashboard Access:** Super Admin Dashboard
- Manage all users (sellers, students, teachers, school admins)
- Manage all schools
- Platform-wide analytics
- Content moderation
- System settings
- User verification management

**Capabilities:**
- ✅ View/manage ALL users across platform
- ✅ Approve/reject Disability ID verifications
- ✅ Add/edit/remove schools
- ✅ Approve school administrator accounts
- ✅ Ban/unban any user
- ✅ View all products, sales, transactions
- ✅ Platform-wide analytics & reports
- ✅ Moderate content
- ✅ Manage platform settings
- ✅ Emergency interventions
- ✅ Full audit trail access

**Responsibilities:**
- Platform integrity & security
- User verification
- Disability ID approval process
- School management
- Dispute resolution
- Policy enforcement
- Platform monitoring

---

## 🏗️ Account Hierarchy

```
Platform Super Admin
    │
    ├─── Schools
    │    │
    │    ├─── School Admin 1
    │    │    │
    │    │    ├─── Teacher 1A
    │    │    │    ├─── Student 1A1
    │    │    │    ├─── Student 1A2
    │    │    │    └─── Student 1A3
    │    │    │
    │    │    └─── Teacher 1B
    │    │         ├─── Student 1B1
    │    │         └─── Student 1B2
    │    │
    │    └─── School Admin 2
    │         └─── ...
    │
    └─── Individual Sellers (No hierarchy)
         ├─── Seller 1
         ├─── Seller 2
         └─── Seller 3
```

### Hierarchy Relationships

**Super Admin → Schools**
- Creates and manages all schools
- Approves school administrators
- Can intervene in any school

**School Admin → Teachers**
- Approves teacher accounts
- Assigns teachers
- Monitors teacher activity
- Can ban/remove teachers

**Teachers → Students**
- Approves student accounts
- Supervises student selling activity
- Reviews student products
- Provides assistance
- Can ban students (with reason)

**Individual Sellers**
- Independent, no supervision
- Direct relationship with platform
- Managed only by Super Admin

---

## 📋 Registration Workflows

### Individual Seller Registration

```
User visits Registration Page
    ↓
Select "Individual Account" tab
    ↓
Choose "Seller" role
    ↓
Fill in:
    - Full Name
    - Email Address
    - Password
    - Confirm Password
    ↓
Upload Disability ID
    ↓
Submit Registration
    ↓
Email Verification Sent
    ↓
User clicks verification link
    ↓
Disability ID Review (by Super Admin)
    ↓
Account Activated
    ↓
Access Seller Dashboard
```

### Student Registration

```
User visits Registration Page
    ↓
Select "Individual Account" tab
    ↓
Choose "Student" role
    ↓
Fill in:
    - Full Name
    - Email Address
    - Password
    - Confirm Password
    ↓
Select School from dropdown
    (or click "Request New School")
    ↓
Upload Disability ID
    ↓
Submit Registration
    ↓
Email Verification Sent
    ↓
User clicks verification link
    ↓
Pending Approvals:
    1. Teacher/School Admin Approval
    2. Disability ID Review (Super Admin)
    ↓
Both Approved
    ↓
Account Activated
    ↓
Assigned to Teacher
    ↓
Access Student Dashboard
```

### Teacher Registration

```
User visits Registration Page
    ↓
Select "School/Institution Account" tab
    ↓
Choose "Teacher/Staff" role
    ↓
Fill in:
    - Full Name
    - Email Address
    - Password
    - Teacher ID/Credentials
    ↓
Select School from dropdown
    ↓
Submit Registration
    ↓
Email Verification Sent
    ↓
User clicks verification link
    ↓
Pending School Admin Approval
    ↓
School Admin Reviews Application
    ↓
Approved
    ↓
Account Activated
    ↓
Access Teacher Dashboard
```

### School Administrator Registration

```
User visits Registration Page
    ↓
Select "School/Institution Account" tab
    ↓
Choose "School Administrator" role
    ↓
Fill in:
    - Full Name
    - Email Address
    - Password
    - School Name
    - Administrator Credentials
    ↓
Select Existing School OR Request New School
    ↓
If New School:
    - School Name
    - School Type
    - Location
    - Contact Info
    ↓
Submit Registration
    ↓
Email Verification Sent
    ↓
User clicks verification link
    ↓
Pending Super Admin Approval
    ↓
Super Admin Reviews:
    - Administrator credentials
    - School information
    - Background verification
    ↓
Approved
    ↓
School Added to System (if new)
    ↓
Account Activated
    ↓
Access School Dashboard
```

---

## 🔐 Verification Requirements

### Disability ID Verification

**Required For:**
- ✅ Individual Sellers
- ✅ Students
- ❌ Teachers
- ❌ School Administrators
- ❌ Super Admins

**Process:**
1. User uploads Disability ID during registration
2. Document stored securely
3. Super Admin reviews in Admin Dashboard
4. Admin verifies authenticity
5. Admin approves or rejects
6. User notified of decision
7. If approved, account fully activated

**Acceptable Documents:**
- Government-issued disability ID
- Medical certification
- Official disability documentation
- School disability services letter

**Review Criteria:**
- Document authenticity
- Clear identification
- Valid disability status
- Not expired

---

### School Affiliation Verification

**Required For:**
- ❌ Individual Sellers
- ✅ Students
- ✅ Teachers
- ✅ School Administrators
- ❌ Super Admins

**Process:**
1. User selects school from dropdown
2. If school not listed, user requests new school
3. School Admin reviews request
4. Super Admin approves new schools
5. User affiliated with approved school
6. School-specific permissions applied

**School Dropdown:**
- Pre-populated list of verified schools
- Search functionality
- "Request New School" option
- School details displayed (name, location)

**New School Request:**
- School name
- School type (High School, College, etc.)
- Location (City, State)
- Contact information
- Reason for request
- Submitted to Super Admin for review

---

## 🎯 Permissions Matrix

| Permission | Individual Seller | Student | Teacher | School Admin | Super Admin |
|------------|------------------|---------|---------|--------------|-------------|
| **Product Management** |
| Add products | ✅ | ✅ | ⚠️ Assist only | ❌ | ✅ All |
| Edit own products | ✅ | ✅ | ⚠️ With auth | ❌ | ✅ All |
| Delete own products | ✅ | ✅ | ❌ | ❌ | ✅ All |
| Approve products | ❌ | ❌ | ✅ Students | ✅ All school | ✅ All |
| **User Management** |
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| View students | ❌ | ❌ | ✅ Assigned | ✅ All school | ✅ All |
| Approve students | ❌ | ❌ | ✅ | ✅ | ✅ |
| Ban students | ❌ | ❌ | ✅ | ✅ | ✅ |
| View teachers | ❌ | ❌ | ❌ | ✅ In school | ✅ All |
| Manage teachers | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Financial** |
| View own earnings | ✅ | ✅ | ❌ | ❌ | ✅ All |
| Withdraw funds | ✅ | ✅ | ❌ | ❌ | ✅ Control |
| View analytics | ✅ Own | ✅ Own | ✅ Students | ✅ School-wide | ✅ Platform-wide |
| **Communication** |
| Message buyers | ✅ | ✅ | ❌ | ❌ | ✅ |
| Message students | ❌ | ❌ | ✅ | ✅ | ✅ |
| Message teachers | ❌ | ✅ | ✅ | ✅ | ✅ |
| Platform announcements | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Administration** |
| Manage schools | ❌ | ❌ | ❌ | ⚠️ Own only | ✅ All |
| Verify Disability IDs | ❌ | ❌ | ❌ | ❌ | ✅ |
| Platform settings | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ⚠️ Own actions | ⚠️ School only | ✅ All |

**Legend:**
- ✅ = Full access
- ❌ = No access
- ⚠️ = Limited/conditional access

---

## 🔄 Account Lifecycle

### Individual Seller Account

```
Registration
    ↓
Email Verification
    ↓
Disability ID Upload
    ↓
Super Admin Review
    ↓
APPROVED → Active Account
    ↓
Can Add Products
    ↓
Make Sales
    ↓
Withdraw Earnings
    ↓
[Account remains active unless:]
    - User deletes account
    - Violates terms (banned by Super Admin)
```

### Student Account

```
Registration
    ↓
Email Verification
    ↓
School Selection
    ↓
Disability ID Upload
    ↓
Pending Approvals:
    - School Admin/Teacher
    - Super Admin (Disability ID)
    ↓
APPROVED → Active Account
    ↓
Assigned to Teacher
    ↓
Teacher Supervision Active
    ↓
Can Add Products (with oversight)
    ↓
Make Sales
    ↓
Request Teacher Assistance
    ↓
[Account active until:]
    - Graduation/leaves school
    - Teacher/Admin bans
    - Violates terms
```

### Teacher Account

```
Registration
    ↓
Email Verification
    ↓
School Selection
    ↓
Credentials Submission
    ↓
School Admin Review
    ↓
APPROVED → Active Account
    ↓
Students Assigned
    ↓
Supervise Students
    ↓
Approve Products
    ↓
Assist Students
    ↓
[Account active until:]
    - Leaves school
    - School Admin removes
    - Violates terms
```

### School Admin Account

```
Registration
    ↓
Email Verification
    ↓
School Selection/Creation
    ↓
Admin Credentials Submission
    ↓
Super Admin Review
    ↓
APPROVED → Active Account
    ↓
School Management Access
    ↓
Manage Teachers
    ↓
Oversee Students
    ↓
School-wide Administration
    ↓
[Account active until:]
    - Leaves position
    - Super Admin removes
    - School closes
```

---

## 📊 Account Statistics

### Current Platform (Mock Data)

**Individual Sellers:**
- Total: ~500 sellers
- Active: ~450 sellers
- Pending Verification: ~50

**Students:**
- Total: ~200 students
- Active: ~180 students
- Pending Approval: ~20

**Teachers:**
- Total: ~50 teachers
- Active: ~48 teachers
- Average students per teacher: 4

**Schools:**
- Total: ~15 schools
- Active: ~15 schools
- Average teachers per school: 3-4

**School Administrators:**
- Total: ~15 admins (one per school)
- Active: ~15 admins

**Super Admins:**
- Total: 1-3 platform admins

---

## 🏫 School System

### Participating Schools (Sample)

**High Schools:**
- Lincoln High School
- Roosevelt Academy
- Kennedy Preparatory
- Washington High School

**Colleges:**
- State University
- Community College
- Technical Institute

**Special Education Centers:**
- Adaptive Learning Center
- Disability Services Institute

### School Structure

Each School Has:
- **1 School Administrator** (primary)
- **Multiple Teachers** (3-10 typically)
- **Multiple Students** (varies, 10-50+)

### Adding New Schools

**Process:**
1. User selects "Request New School" during registration
2. Fills out school information form:
   - School name
   - School type
   - Location
   - Contact information
3. Super Admin receives request
4. Super Admin verifies school exists
5. Super Admin adds school to database
6. School becomes available in dropdown
7. User completes registration

---

## 🔔 Notification System by Role

### Individual Sellers Receive:
- New order notifications
- Payment received
- Product approved/rejected (if moderation enabled)
- Buyer messages
- Withdrawal status
- Platform announcements

### Students Receive:
- All seller notifications PLUS:
- Teacher approval required
- Teacher assistance available
- Product review feedback
- School announcements

### Teachers Receive:
- New student registration
- Student product submissions
- Student assistance requests
- Student sales updates
- School admin messages
- Platform announcements

### School Admins Receive:
- New teacher applications
- New student registrations
- School-wide statistics
- Teacher activity alerts
- Problem reports
- Platform announcements

### Super Admins Receive:
- New school requests
- Disability ID verifications pending
- School admin applications
- Platform-wide alerts
- System issues
- All critical notifications

---

## 🎨 Dashboard Customization by Role

### Seller Dashboard Features:
- Product management
- Sales analytics
- Order management
- Earnings & withdrawals
- Buyer messages
- Profile settings

### Student Dashboard (Extended):
- All seller features PLUS:
- "Get Assistance" section
- Teacher contact
- School resources
- Supervision indicators
- Authorization requests

### Teacher Dashboard Features:
- Student management
- Pending approvals
- Product reviews
- Assistance requests
- Student analytics
- Activity logs
- Messaging system

### School Dashboard Features:
- Teacher management
- Student overview
- School-wide analytics
- Settings & configuration
- Bulk operations
- Report generation

### Super Admin Dashboard Features:
- User management (all types)
- School management
- Verification queue
- Platform analytics
- Content moderation
- System settings
- Audit logs

---

## 🔐 Security & Privacy

### Data Protection by Role

**Individual Sellers:**
- Disability ID stored encrypted
- Personal info protected
- Sales data private
- Earnings confidential

**Students:**
- All seller protections PLUS:
- School affiliation visible to school staff only
- Teacher can view product details
- Admin oversight for safety

**Teachers:**
- School affiliation public to students
- Cannot access student financial data
- Can view student product performance
- Activity logged for accountability

**School Admins:**
- Full school data access
- Cannot access other schools
- Financial data aggregated only
- All actions logged

**Super Admins:**
- Full platform access
- All actions audited
- Highest security clearance
- Multi-factor authentication required

---

## 📱 Account Features Comparison

| Feature | Seller | Student | Teacher | School Admin | Super Admin |
|---------|--------|---------|---------|--------------|-------------|
| Dashboard | ✅ Seller | ✅ Seller+ | ✅ Teacher | ✅ School | ✅ Admin |
| Add Products | ✅ | ✅ | ⚠️ Assist | ❌ | ✅ |
| Analytics | ✅ Own | ✅ Own | ✅ Students | ✅ School | ✅ Platform |
| Withdrawals | ✅ | ✅ | ❌ | ❌ | ⚠️ Control |
| User Management | ❌ | ❌ | ✅ Students | ✅ School | ✅ All |
| Accessibility | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Voice Nav | ✅ | ✅ | ✅ | ✅ | ✅ |
| Screen Reader | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Getting Started by Role

### I'm an Individual Seller
1. Register with "Individual Account" → "Seller"
2. Upload Disability ID
3. Wait for verification (1-3 days)
4. Start adding products
5. Begin selling!

### I'm a Student
1. Register with "Individual Account" → "Student"
2. Select your school
3. Upload Disability ID
4. Wait for school & platform approval
5. Get assigned to a teacher
6. Start selling with teacher support!

### I'm a Teacher
1. Register with "School/Institution" → "Teacher"
2. Select your school
3. Submit credentials
4. Wait for school admin approval
5. Get students assigned
6. Begin supervising!

### I'm a School Administrator
1. Register with "School/Institution" → "Administrator"
2. Request your school (or select if listed)
3. Submit admin credentials
4. Wait for super admin approval
5. Invite teachers
6. Build your school marketplace!

---

*Building an inclusive marketplace with the right account structure for everyone*

**Last Updated:** December 6, 2025