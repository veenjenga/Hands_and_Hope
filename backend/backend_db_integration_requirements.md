# Backend Database & API Integration Requirements

Purpose: provide a concise, actionable checklist and specification for backend updates required to fully support the Sellers2 and Buyers2 frontends. Use this document to guide model changes, new endpoints, migrations, and owner/priority for each item.

Overview
- Frontends: `Sellers2` (primary admin/seller/teacher/student flows) and `Buyers2` (buyer-facing pages).
- Current backend: models for `User`, `Seller`, `Student`, `Teacher`, `School`, `Product` exist. There are auth, upload, dashboard routes with placeholders.
- Missing/partial areas: Orders/Transactions, Inquiries/Messages, Approvals workflows, Activity/Analytics, Notifications, consistent product-seller relationship, profile views, metrics endpoints fully implemented.

How to use this document
- Each section lists: the problem/need, recommended DB change(s), API endpoints to add/update, sample payloads and responses, migrations (if needed), and priority.

----

1) Models to add or extend

A. Order (Transactions)
- Purpose: track purchases, sales, fees, payout status, timestamps per product and user. Required for "Total Sales", monthly/yearly sales, recent-sales endpoints, and seller payouts.
- Fields (suggested):
  - _id, buyer: ObjectId(User), seller: ObjectId(User), products: [{ productId, qty, unitPrice, subtotal }], totalAmount, status (pending/paid/completed/refunded), paymentMethod, transactionDate, payoutStatus (pending/paid), fee, shipping (optional), metadata
- Indexes: buyer, seller, transactionDate
- API endpoints:
  - POST `/api/orders` (create order)
  - GET `/api/orders/:id` (order detail)
  - GET `/api/orders?sellerId=...` (seller order list)
  - GET `/api/orders?buyerId=...` (buyer order history)
- Priority: High (required to show sales, totals, recent-sales)

B. Inquiry (Messages / Product enquiries)
- Purpose: capture messages/questions from buyers to sellers about a product, link to product and optionally order.
- Fields: _id, productId, fromUser, toUser (seller), message, attachments[], status (open/responded/closed), createdAt, respondedAt, responseCount
- API endpoints:
  - POST `/api/inquiries` (create)
  - GET `/api/inquiries?productId=...` or `?userId=...`
  - PUT `/api/inquiries/:id/respond` (mark responded)
- Priority: High (dashboard shows inquiries count)

C. Notification
- Purpose: internal notifications for approvals, messages, order updates.
- Fields: user, type, payload (freeform), read: boolean, createdAt
- API endpoints: GET `/api/notifications`, PUT `/api/notifications/:id/read`, DELETE `/api/notifications/:id`
- Priority: Medium

D. ActivityLog / Audit
- Purpose: log admin actions (approve/reject accounts/products), user bans, impersonation, approvals for compliance.
- Fields: actorUserId, action, targetType, targetId, details, createdAt
- Priority: Medium

E. Approval / Request records (optional)
- Purpose: store approval flows separately (e.g., school requests, product approvals, account approvals).
- Fields: type (school, teacher, student, product), requesterId, approverId, status, notes, documents[], createdAt, resolvedAt
- Priority: Medium

F. Extend Product model
- Current issues:
  - `Product` uses `sellerId` referencing `User` while `Seller` has `products` referencing Product. Normalize to a single source of truth.
- Recommended changes:
  - rename `sellerId` -> `seller` referencing `Seller` (or keep `sellerUser` referencing `User` but be consistent)
  - add fields: status (active|pending|archived|rejected), views (number), inquiriesCount (number), totalSales (number), images: [{url, alt, order}], categories, inventory/quantity if needed
- Add pre-save hooks or transaction updates when an Order is created to increment `totalSales` and decrement inventory
- Priority: High (to power dashboard stats)

G. Extend User, Seller, Student, Teacher, School
- User: add `profileViews: Number`, `approved: Boolean` (or rely on role-specific `approved` flag), `lastLoginAt`, `metadata`.
- Seller: maintain `products` array OR compute via Product queries; add fields `totalSales`, `totalListings`, `pendingApprovals`.
- Student / Teacher: track `approved` status, `school` reference (already present), `managedByTeacher` relationship (for teachers supervising students) — teacher may have `students: [ObjectId(Student)]` or query Student by teacher field.
- School: add aggregated counters (cached): `teacherCount`, `studentCount`, `pendingApprovals`.
- Priority: High

----

2) Endpoints / Controller features to implement or finish

A. Dashboard endpoints (complete placeholders)
- Existing: `/api/dashboard/stats`, `/api/dashboard/products`, `/api/dashboard/recent-sales`, `/api/dashboard/engagement`
- Work needed:
  - Implement sales calculations using `Order` model
  - Implement profileViews read/update using `profileViews` on `User`
  - Implement enquiries count via `Inquiry` model
  - Implement recentListings properly with Product query and map to DTO expected by frontend
- Samples:
  - GET `/api/dashboard/stats` -> returns { name, email, role, activeListings, totalProducts, totalEnquiries, totalSales, profileViews, recentListings[], thisMonthSales }
- Priority: High

B. Approvals workflow endpoints
- Account approvals (for students, teachers, school admins)
  - GET `/api/approvals/accounts?status=pending&type=student|teacher|school` – list pending approvals
  - POST `/api/approvals/accounts/:id/approve` – approve account -> set `approved=true` on Student/Teacher/School and notify requester
  - POST `/api/approvals/accounts/:id/reject` – reject with reason
- Product approvals
  - GET `/api/approvals/products?status=pending`
  - POST `/api/approvals/products/:id/approve` – set product status 'active'
  - POST `/api/approvals/products/:id/reject` with reason
- School admin & teacher approvals by institution: allow school admins to approve teacher/student accounts linked to their school.
- Priority: High

C. Teacher-specific endpoints
- GET `/api/teachers/:id/students` – list students managed by teacher
- POST `/api/teachers/:id/add-student` – add student under teacher (if business logic allows)
- GET `/api/schools/:id/roster` – return teachers and students for a school
- Priority: High

D. Product & Listing endpoints
- Ensure product list and product detail endpoints exist and include inquiry counts, sales, and status
- POST `/api/products/:id/view` or increment view via middleware
- GET `/api/products?sellerId=...&status=...` for dashboard products
- Priority: High

E. Orders & Payments
- Expose endpoints to fetch orders by seller and buyer, and to create/capture orders if payment integration is present.
- GET `/api/orders/seller/:sellerId`
- GET `/api/orders/buyer/:buyerId`
- POST `/api/orders/:id/mark-paid` etc.
- Priority: High

F. Inquiries & Messages
- GET/POST endpoints as mentioned in models section; add notification creation on new inquiry.
- Priority: High

G. Admin endpoints
- Admin actions: impersonation, manage admins, generate reports
- Endpoints to fetch site-wide metrics for AdminDashboard: `/api/admin/metrics`, `/api/admin/users`, `/api/admin/reports`
- Priority: Medium

H. Miscellaneous
- File upload endpoint exists; ensure user-uploaded documents are linked to corresponding Approval or User records
- Endpoint to fetch schools list and search schools (used at registration select)
  - GET `/api/schools` -> list with pagination and query param ?q= to search
- Priority: High

----

3) Data consistency & normalization tasks

- Normalize Product -> Seller relationship: choose either Product.seller = Seller._id OR Product.sellerUser = User._id; update code and migration script to populate the other side (Seller.products array or compute on demand)
- Add populated references (virtuals) for fast queries. Example: Seller schema add virtual `products` using `ref: 'Product'` with `localField: 'user'` -> `foreignField: 'sellerId'`.
- Ensure `role` values and enumerations in `User` model match frontend role checks ('seller', 'student', 'teacher', 'school', 'admin', 'super-admin', 'buyer')

Migration tasks (examples)
- Create `Order` and `Inquiry` collections and migrate any existing sales data if present (likely none) — seed with zeros where relevant
- For existing Product documents with `sellerId` referencing a `User`, populate Seller.products OR create Seller documents for users missing Seller doc

----

4) Frontend-specific gaps I found (what to connect)

These frontend components rely on backend data but backend currently returns placeholders or lacks endpoints:

- DashboardOverview / DashboardOverview.tsx (Sellers2)
  - Needs: `activeListings`, `totalProducts`, `totalEnquiries`, `totalSales`, `profileViews`, `recentListings` from `/api/dashboard/stats` (implement fully)

- Dashboard product lists (SellerDashboard/Product pages)
  - Needs: `/api/dashboard/products` to return product DTO with inquiry counts, status, images

- Approvals pages (Admin, School admin, Teacher views)
  - Needs: endpoints to list pending account approvals (students/teachers/schools) and to approve/reject (with reason); link approval to `School.approved`, `Student.approved`, or a separate approvals collection

- Teacher dashboard (TeacherDashboard.tsx)
  - Needs: total students, students managed by teacher, attached school name — endpoints: `/api/teachers/:id/students`, `/api/schools/:id`

- School dashboard (SchoolDashboard.tsx)
  - Needs: counts for total students, total teachers, pending approvals, list of teachers/students — endpoint: `/api/schools/:id/roster` and `/api/schools/:id/metrics`

- Admin dashboard (AdminDashboard.tsx)
  - Currently uses mocked stats (`MOCK_SIGNUP_STATS`) — implement `/api/admin/metrics` returning signups counts, region data, pending approvals, transactions summary

- Inquiries page
  - Needs: `/api/inquiries?userId=...` and endpoints to reply/close inquiries

- Profile pages (Seller/ProfilePage.tsx)
  - Needs: `/api/dashboard/profile` and `/api/dashboard/track-view` — backend has `profile` and `track-view` routes; ensure profile view increments work and are called by frontend

- Registration flow (RegistrationPage.tsx)
  - School selection currently uses mocked `EXISTING_SCHOOLS` — implement `/api/schools` search and `/api/schools/request` to request new school creation

- Buyers2 (Buyer-facing) features
  - Buyer order history, purchase flow, and messages are not yet hooked to backend (Buyers2 has no API calls to backend in repo). If Buyer actions should be functional, add endpoints:
    - GET `/api/orders/buyer/:buyerId`
    - POST `/api/wishlist` or similar
    - POST `/api/inquiries`

----

5) Authorization / Roles

- Ensure `authMiddleware` attaches `req.user` with `id` and `role` (already used in dashboardRoutes). Expand middleware to assert role-based access for admin-only routes and school-admin-only endpoints.
- Implement middleware helpers: `requireRole('admin')`, `requireRole('school')`, or `requireAnyRole(['admin','super-admin'])` for endpoints like approvals and admin metrics

----

6) Sample API contracts

A. GET `/api/dashboard/stats` (protected)
Response:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "seller",
  "phone": "...",
  "activeListings": 12,
  "totalProducts": 15,
  "totalEnquiries": 8,
  "totalSales": 425.50,
  "profileViews": 120,
  "recentListings": [{"id":"...","name":"...","createdAt":"..."}],
  "thisMonthSales": 120.00
}
```

B. POST `/api/approvals/accounts/:id/approve` (protected, admin or school-admin)
Request body (optional): { "notes": "Verified docs" }
Response: 200 OK { "message": "Account approved" }

C. GET `/api/teachers/:id/students` (protected, teacher or admin)
Response: [{ "id": "...", "name": "...", "studentId":"...","totalSales":123.45 }]

----

7) Prioritized roadmap (recommended order)
1. Add `Order` and `Inquiry` models + controllers + routes (High)
2. Finish `/api/dashboard/stats` and `/api/dashboard/products` to return real values (High)
3. Implement approvals endpoints and link to `Student`, `Teacher`, `School` approvals (High)
4. Normalize Product-Seller relationship and migrate data (High)
5. Implement teacher-school roster endpoints and school metrics (High)
6. Add admin metrics endpoints and ActivityLog (Medium)
7. Notifications, exports, reports, and optimizations (Medium)

----

8) Testing & migration guidance
- Write integration tests for the new endpoints (auth-protected). Start with `Order` creation and retrieving seller's totalSales.
- For migrations (Product->Seller normalization): create a migration script in `backend/scripts/` that:
  - For each Product with `sellerId` (User), find Seller doc referencing that user, if missing create Seller doc and push product id to Seller.products array (or vice versa depending on chosen canonical model)
  - Back-fill `Student.school` values if school names exist in user metadata

----

9) Quick wins to unblock frontend now
- Implement the `Order` model with minimal fields and implement `/api/dashboard/stats` to compute `totalSales` by summing order totals for seller.
- Implement `Inquiry` model and compute `totalEnquiries` from it.
- Implement `/api/schools` endpoint to serve real school list in registration page.
- Implement approvals endpoints (simple approve/reject that toggles `approved` flag).

----

10) Deliverables & follow-up
- I can prepare a prioritized PR that:
  - Adds `Order` and `Inquiry` models
  - Implements controller functions for `/api/orders` and `/api/inquiries`
  - Implements full `/api/dashboard/stats` using Orders and Inquiries
  - Adds approvals endpoints
  - Adds migration script to normalize Product <-> Seller

If you want, I will implement the top-priority items (Order + Inquiry + dashboard stats) as a first PR. Say "Implement top priority" and I'll start with model + routes + tests.

---

Appendix: Files I inspected
- `backend/models/*` (User, Product, Seller, Student, Teacher, School)
- `backend/routes/dashboardRoutes.js` (placeholders)
- `backend/routes/authRoutes.js` (signup/login)
- `backend/scripts/create_admins.js` (seeding)
- `Sellers2/src/components/*` (RegistrationPage, LoginPage, AdminDashboard, DashboardOverview, DashboardSidebar, TeacherDashboard, SchoolDashboard) — frontend expects many metrics from backend.


