# Hands & Hope — User Manual

This document is the user and installation manual for the Hands & Hope e‑commerce platform: an accessible marketplace where people with disabilities can sell their handmade products to generate income.

Notes and assumptions
- I adapted the requested structure (which referenced "tourist" and "booking") to match this project (products, sellers, buyers, orders). If you prefer the original tourist/booking wording, tell me and I will revert.
- Assumed technologies from the repository: Node.js + Express backend (in `backend/`) and Vite React frontend(s) (in `Buyers2/` and `Sellers2/`).
- Assumed database: MongoDB (common for Node/Express projects). If you use a different DB, update the Database section.
- Payment processing: the repo may include a placeholder integration or third‑party provider; this manual explains generic steps. If you have Stripe/PayPal keys or another provider, add those details in section 6.

---

1. Introduction ............................................................................................................................................................... 3

This manual explains how to install, run, administer, and use the Hands & Hope platform: an accessible ecommerce website that allows people with disabilities to sell handmade products. It contains system requirements, installation instructions for the backend and frontends, user interface guidance for buyers and sellers, product management, order/booking management, payment processing details, troubleshooting, FAQs, and support information.

2: Software and Hardware Requirements ..................................................................................................................... 3

2.1: Software and Hardware Requirements .............................................................................................................. 3

Software Requirements
- Operating System: Windows 10+ / macOS 10.14+ / Linux (any modern distro)
- Node.js: 16 LTS or newer (Node 18+ recommended)
- npm (comes with Node) or yarn
- Git (to clone/update the repo)
- MongoDB: Community server or Atlas cluster (if the project uses MongoDB)
- Modern browser for UI testing: Chrome, Edge, Firefox
- Recommended dev tools: VS Code

Hardware Recommendations
- CPU: 2+ cores
- RAM: 8GB+ (16GB recommended if running multiple services)
- Disk: 2GB free for code + dependencies, additional space for DB data

Additional Notes:
- For production, host backend on a server (Heroku, DigitalOcean, AWS) and use a managed DB (MongoDB Atlas). Serve frontends as static sites or via a CDN.

Troubleshooting the system
- If Node fails to start: check Node version with `node -v` and ensure dependencies are installed.
- If DB connection fails: ensure MongoDB is running and connection string in `backend/config/db.js` (or `.env`) is correct.

3. Installation Guide ....................................................................................................................................................... 4

This section covers installing and running the backend and both frontends (buyer and seller apps). Commands are written for PowerShell on Windows. Run them from your repository root `c:\Users\Hp\Hands_and_Hope`.

3.1 Backend (API)
- Requirements: Node.js, npm, MongoDB.
- Steps:
  1. Open PowerShell, then:

```powershell
cd c:\Users\Hp\Hands_and_Hope\backend
npm install
```

  2. Database: ensure MongoDB is running (local or Atlas). Edit `backend/config/db.js` or `.env` to set the connection URI. Typical environment variable is `MONGO_URI`.
  3. Start the server:

```powershell
# development
node server.js
# OR if using nodemon
npx nodemon server.js
```

  4. Confirm server is running by opening http://localhost:5000 (or port configured in `server.js`). The console should show the listening port.

3.2 Buyers frontend (Buyer app)
- Steps:

```powershell
cd c:\Users\Hp\Hands_and_Hope\Buyers2
npm install
npm run dev
```

- By default Vite serves on http://localhost:5173 (check console). Open the URL in a browser.

3.3 Sellers frontend (Seller app)
- Steps:

```powershell
cd c:\Users\Hp\Hands_and_Hope\Sellers2
npm install
npm run dev
```

- Open the Vite URL shown in console (usually http://localhost:5173 or a different port if the Buyers2 app is running simultaneously).

3.4 Common environment variables (recommended)
- Create a `.env` or `.env.local` file for local development. Typical variables:
  - `PORT` (backend port)
  - `MONGO_URI` (database connection string)
  - `JWT_SECRET` (secret for auth tokens)
  - `STRIPE_SECRET_KEY` (if using Stripe)
  - `CLIENT_URL` (frontend origin for CORS)

Getting Started .......................................................................................................................................................... 5

- Ensure backend is running and the database connection is healthy.
- Start the frontend(s) and open the URL(s) in your browser.
- If you are a new user, open the registration page (Buyer or Seller depending on your role) and create an account.

Logging In ............................................................................................................................................................... 5

- From the Buyer app: Click "Login" in the header and enter email/password.
- From the Seller app: Click "Login" or the seller admin login page to access seller dashboards.
- If the project uses role-based accounts, ensure your user account is created with the seller role (or ask an admin to promote the account).
- If your app uses email verification, check your inbox for confirmation emails.

User Interface Overview ............................................................................................................................................ 6

Buyer UI (typical pages and components)
- Home / Catalog: lists products with `ProductCard` components.
- Product detail page: full description, images, and "Add to cart" or "Buy now" button.
- Cart & Checkout: collect shipping and payment details.
- Profile: order history, account settings.

Seller UI (typical pages and components)
- Dashboard: overview of sales, recent orders, and metrics.
- Products / Add Product: form or modal to create new product listings.
- Product Grid: edit or delete existing listings.
- Orders page: view and update order status (processing, shipped, delivered).
- Admin pages: manage inquiries, notifications, accessibility settings.

Accessibility notes
- The project includes several accessibility-oriented components (voice navigation, high-contrast styles, accessibility toolbar). Use them to test keyboard navigation, screen reader compatibility, and color contrast.

4. Managing Products (adapted from "Managing Tourist Information") ................................................................................................................................... 7

4.1 : Adding a New Product .......................................................................................................................................... 7

Steps (Seller)
1. Login to the Seller app and go to the "Products" or "Add Product" area (look for `AddProductModal` or "Add product" button).
2. Click "Add product" to open the product form or modal.
3. Fill required fields: product name, category, price, stock/quantity, description, images. For accessibility, add alt text for every image.
4. Click "Save" or "Create". The backend API will receive the product data and persist it in the DB.

Suggested screenshots to add to manual:
- Seller dashboard showing "Add product" button
- Add product modal with sample data filled

4.2 : Editing Product Information ................................................................................................................................. 7

Steps (Seller)
1. On the product list, find the product and click "Edit" (pencil icon or similar).
2. Update fields as needed and save. Confirm the changes appear on the product detail page.

Edge cases
- Concurrent edits: if two users update a product at the same time, last save wins unless optimistic locking is implemented.
- Image upload failures: check file size/type limits and server response.

4.3 : Deleting Product Records ..................................................................................................................................... 7

Steps (Seller)
1. From the product grid, click "Delete" (trash icon).
2. Confirm deletion in the dialog. Deleted products are removed from the public catalog.

Notes
- Consider soft-delete for safety (set an `active` flag) instead of hard deleting from database.

5: Order (Booking) Management ......................................................................................................................................... 8

5.1 : Viewing Available Products / Packages ............................................................................................................. 8

Buyer flow
- Browse catalog or search by category/keyword.
- Use `ProductCard` to view price, short description, rating, and quick actions.
- Click a product to view details and add to cart.

5.2 : Making an Order (Booking) .................................................................................................................................... 8

Checkout flow
1. Add products to cart.
2. Open cart and click "Checkout".
3. Enter shipping details and choose a payment method.
4. Submit order. Backend creates an order record and returns confirmation.

Suggested screenshot: checkout page with order summary and payment options.

5.3 : Editing an Order ................................................................................................................................................ 9

- Buyers can sometimes cancel or edit orders within a time window (depends on implementation).
- Seller can update fulfillment status (processing, shipped, delivered). Update order record and notify the buyer via email/notifications.

6: Payment Processing ................................................................................................................................................. 9

6.1 : Payment Methods .............................................................................................................................................. 9

Common payment methods to support
- Card payments via Stripe
- PayPal
- Manual bank transfer
- Cash on delivery (if supported)

6.2 : Processing a Payment ......................................................................................................................................... 9

Typical flow (Stripe example)
1. Buyer submits card details on checkout; frontend securely sends token to backend (or uses Stripe Elements / Checkout).
2. Backend calls Stripe API to create a charge / payment intent with amount, currency, and metadata (order id).
3. On success, backend updates the order status to "paid" and returns confirmation.

Security notes
- Never store raw card numbers on your servers. Use a PCI-compliant provider (Stripe/PayPal) and follow their recommended integration.
- Ensure backend endpoints handling payments are served over HTTPS in production.

7. Troubleshooting ......................................................................................................................................................... 9

Common issues and fixes
- Backend will not start
  - Ensure Node.js is the correct version (run `node -v`).
  - Ensure dependencies installed: from `backend/` run `npm install`.
  - Check error lines in console—missing environment variables like `MONGO_URI` or `JWT_SECRET` are common.

- Frontend fails to start
  - From `Buyers2/` or `Sellers2/`: run `npm install` then `npm run dev`.
  - If port conflicts occur, stop the other Vite server or run on a different port: `npm run dev -- --port 5174`

- Database connection errors
  - Check `backend/config/db.js` or environment variables for `MONGO_URI`.
  - If using MongoDB Atlas, ensure your IP is whitelisted or set to 0.0.0.0/0 for testing.

- Images not uploading
  - Check backend upload handler; ensure file size limits and MIME types are accepted. Review server logs.

- Payment fails in production
  - Confirm live API keys are used. Check provider dashboard for declined cards or misconfiguration.

8. Frequently Asked Questions (FAQs) ........................................................................................................................ 10

Q: How do I become a seller?
A: Use the registration page, select "Seller" mode or sign up via the Seller app. If role assignment is restricted, contact an admin.

Q: How do I get paid for sales?
A: Payments from buyers will be processed per the configured provider. For marketplace payouts to sellers, the app must implement split payments or manual payout processes. If you need automatic payouts, integrate a provider that supports Connect accounts (e.g., Stripe Connect).

Q: How do I restore a deleted product?
A: If the system implements soft deletes, re-activate by toggling the `active` flag in the product editor. If hard-deleted, restore from DB backup.

Q: Where are order emails configured?
A: Check the backend's mailer setup (e.g., nodemailer config) or environment variables for SMTP credentials.

9. Support and Contact Information ............................................................................................................................ 11

For technical support and help with installation or production deployment, provide the following contact details (replace placeholders with actual info):

- Project maintainer / team email: support@handsandhope.example
- GitHub repo: https://github.com/veenjenga/Hands_and_Hope
- For urgent issues: +1 (555) 555-5555

If you want, I can automatically add screenshots from the `Buyers2` and `Sellers2` frontends to relevant sections. Recommended images to include:
- Seller dashboard (overview)
- Add Product modal (full form)
- Product detail page (buyer-facing)
- Checkout page (order summary and payment options)
- Login and registration pages

Where to store images
- Create `docs/images/` and put images named to match the section (e.g., `seller_add_product.png`, `buyer_checkout.png`). Then reference them in the Markdown:

```markdown
![Add Product](docs/images/seller_add_product.png)
```

Optional next steps I can take for you
- Generate the `docs/images/` folder and place placeholder image files (or request screenshots and embed them).
- Create a PDF from this Markdown.
- Tailor the payment section to your actual provider (Stripe/PayPal) if you give me the provider and integration details.
- Add a short step-by-step README per app (`backend/README.md`, `Buyers2/README.md`, `Sellers2/README.md`) with copy-paste commands.

Completion summary
- I created this manual with an installation and usage guide adapted to the Hands & Hope ecommerce project.
- I mapped the provided structure to a product/order oriented manual and included setup commands, troubleshooting, and suggested images to add.

Tell me if you'd like me to:
- Keep the current `USER_MANUAL.md` path or move to `docs/User_Manual.md`.
- Add screenshots now (I can create placeholders) and embed them.
- Create separate small READMEs for the backend and each frontend.

