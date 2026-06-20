# SK Luxury – Luxury Boutique E-Commerce Platform

## _Luxury in Every Stitch_

---

## 🌿 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Redux Toolkit
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs
- **Payments:** Razorpay
- **Images:** Cloudinary
- **WhatsApp:** Native wa.me integration

---

## 📁 Project Structure

```
sk-luxury/
├── backend/
│   ├── config/          # Cloudinary config
│   ├── controllers/      # authController (+ forgot/reset password), productController,
│   │                      # orderController (+ cancel/track), paymentController,
│   │                      # uploadController, adminController, categoryController,
│   │                      # bannerController
│   ├── middleware/       # auth.js (JWT protect, admin, optionalAuth)
│   ├── models/           # User (+ reset token), Product, Order (+ delivery estimate,
│   │                      # cancellation fields), Category, Banner
│   ├── utils/             # email.js (Resend integration: order confirmation, status
│   │                      # update, cancellation, password reset, welcome emails)
│   ├── routes/            # authRoutes, productRoutes, orderRoutes, paymentRoutes,
│   │                      # uploadRoutes, adminRoutes, categoryRoutes, bannerRoutes
│   ├── .env               # Environment variables
│   ├── server.js          # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Preloader, WhatsAppButton, SearchModal, SectionHeader,
│   │   │   │                # ProtectedRoute, AdminRoute, ErrorBoundary,
│   │   │   │                # OrderStatusTracker (new)
│   │   │   ├── layout/      # Navbar, Footer, Layout, AdminLayout
│   │   │   ├── home/        # HeroSection, CollectionGrid, FeaturedProducts,
│   │   │   │                # NewArrivals, BestSellers, BrandStory, WhyChooseUs,
│   │   │   │                # Testimonials, InstagramGallery, BridalBanner,
│   │   │   │                # CollectionBanner
│   │   │   ├── product/     # ProductCard, ProductGrid, RecentlyViewed (new),
│   │   │   │                # RelatedProducts (new)
│   │   │   └── cart/        # CartSidebar
│   │   ├── pages/
│   │   │   ├── customer/    # HomePage, CollectionsPage, ClothingPage, JewelleryPage,
│   │   │   │                # BridalPage, ProductDetailPage, SearchResultsPage,
│   │   │   │                # CartPage, CheckoutPage, OrderConfirmationPage (new),
│   │   │   │                # OrderTrackingPage (new), AboutPage, ContactPage,
│   │   │   │                # LoginPage, RegisterPage, ForgotPasswordPage (new),
│   │   │   │                # ResetPasswordPage (new), ProfilePage (+ Security tab),
│   │   │   │                # WishlistPage, PrivacyPage, TermsPage, ShippingPage,
│   │   │   │                # NotFoundPage (new)
│   │   │   └── admin/       # AdminDashboard, AdminProducts, AdminAddProduct,
│   │   │                    # AdminOrders (+ delivery estimate editor), AdminCategories,
│   │   │                    # AdminBanners, AdminTransactions, AdminUsers
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/      # authSlice (+ forgot/reset password), cartSlice,
│   │   │                    # productSlice, orderSlice (+ cancel/track),
│   │   │                    # uiSlice, recentlyViewedSlice (new)
│   │   ├── utils/
│   │   │   ├── api.js        # Axios instance with interceptors
│   │   │   ├── helpers.js    # formatPrice, formatDate, statusColor, delivery estimate
│   │   │   │                 # helpers, order status step helpers
│   │   │   └── whatsapp.js   # WhatsApp message generators
│   │   ├── styles/
│   │   │   └── index.css     # Tailwind + custom luxury styles
│   │   ├── App.jsx           # Router with all routes
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (already configured)
- Cloudinary account (already configured)
- Razorpay account (test keys already configured)

### Step 1: Clone / Extract the project

```bash
cd sk-luxury
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🚀 Running the Project

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (.env) — already configured:

```
PORT=5000
MONGO_URI=mongodb+srv://srikalacouture_db_user:p******d@srikala.jxnatss.mongodb.net/sk_luxury
JWT_SECRET=SK_LUXURY_SUPER_SECRET_JWT_KEY_2024_BOUTIQUE
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=dsk
CLOUDINARY_API_KEY=54466
CLOUDINARY_API_SECRET=Vp2aWbpnSy-AWjh8
RAZORPAY_KEY_ID=rzp_test_
RAZORPAY_KEY_SECRET=roByIYhh6bCpf
WHATSAPP_NUMBER=918374797955
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env) — already configured:

```
VITE_API_URL=/api
VITE_WHATSAPP_NUMBER=9183747979
VITE_RAZORPAY_KEY=rzp_test_T0zxj
```

---

## 👤 Creating Admin Account

After starting the server, register a user then update their role in MongoDB:

**Option 1: MongoDB Atlas UI**

- Go to your Atlas cluster → Browse Collections → `users`
- Find your user → Edit → set `role: "admin"`

**Option 2: MongoDB Shell**

```js
db.users.updateOne({ email: "admin@skluxury.in" }, { $set: { role: "admin" } });
```

Then login → access `/admin` panel.

---

## 🛒 Features Implemented

### Customer Features

- ✅ Luxury animated Preloader
- ✅ Full-screen Hero Slider (3 slides, auto-play)
- ✅ Collection Grid (Clothing, Jewellery, Bridal, Custom)
- ✅ Featured / New Arrivals / Best Sellers sections
- ✅ Bridal Banner with consultation CTA
- ✅ Brand Story section
- ✅ Why Choose Us section
- ✅ Customer Testimonials slider
- ✅ Instagram Gallery section
- ✅ Newsletter signup
- ✅ Premium Footer with all links
- ✅ Sticky Navbar with mega menu
- ✅ Search Modal with instant results
- ✅ Cart Sidebar with animations
- ✅ Floating WhatsApp button (4 options)
- ✅ Product Detail Page with image zoom
- ✅ Size & Color selection
- ✅ Product enquiry via WhatsApp
- ✅ Custom order via WhatsApp
- ✅ Bridal consultation booking
- ✅ Filters: price, size, collection type, sort
- ✅ Pagination on collection pages
- ✅ Cart with quantity management
- ✅ Checkout with address form
- ✅ Razorpay payment (UPI, Cards, Net Banking)
- ✅ **Order Confirmation Page** — full order details, visual status tracker, print invoice, cancel order
- ✅ **Order Tracking Page** (`/track-order`) — guests can track by order number + email, no login required
- ✅ **My Orders tracker** — expandable status tracker inline in profile, with estimated delivery date shown per order
- ✅ **Order cancellation** — customers can cancel orders before they ship, with reason capture
- ✅ User registration & login
- ✅ **Forgot Password** — email-based reset flow with secure, expiring tokens
- ✅ **Reset Password** page with token verification before showing the form
- ✅ **Password update** in Profile → Security tab (current password required)
- ✅ **Profile editing** (name, phone) separate from security settings
- ✅ Wishlist functionality
- ✅ **Recently Viewed Products** — persisted across sessions, shown on product pages
- ✅ **"You May Also Like" recommendations** — same-category product suggestions on product pages
- ✅ **404 Not Found page** + global **Error Boundary** for graceful failure handling
- ✅ About, Contact, Privacy, Terms, Shipping pages

### Email Notifications (Resend)

- ✅ Order confirmation email — sent automatically after successful payment, includes items, pricing, estimated delivery, and a tracking link
- ✅ Order status update email — sent whenever admin updates order status (processing/shipped/delivered), includes tracking number & courier if provided
- ✅ Order cancellation email — sent when an order is cancelled by customer or admin, includes refund note if payment was captured
- ✅ Password reset email — secure reset link, expires in 30 minutes
- ✅ Welcome email — sent on registration
- ⚙️ All emails gracefully no-op if `RESEND_API_KEY` is not set (safe for local dev/testing — no crashes, just logs to console)

### Admin Features

- ✅ Dashboard with revenue, order, product stats
- ✅ Recent orders table
- ✅ Top products list
- ✅ Product CRUD (Create, Read, Update, Delete)
- ✅ Multi-image upload via Cloudinary
- ✅ Category management
- ✅ Order management with status updates
- ✅ **Estimated delivery date editor** + courier & tracking number fields
- ✅ **Visual status tracker preview** inside the order detail modal
- ✅ Automatic customer email notification on every status change
- ✅ Payment transactions view
- ✅ Customer management
- ✅ Banner/Slider management
- ✅ Admin sidebar navigation
- ✅ Mobile-responsive admin panel

---

## 📧 Setting Up Email Notifications (Resend)

Email is **optional** — the app runs perfectly fine without it (emails are skipped with a console log instead of crashing). To enable real emails:

1. Create a free account at [resend.com](https://resend.com)
2. Verify a sending domain (or use their test domain for development)
3. Generate an API key from the Resend dashboard
4. Add it to `backend/.env`:
   ```
   RESEND_API_KEY=re_your_actual_key_here
   RESEND_FROM_EMAIL=SK Luxury <orders@yourdomain.com>
   ```
5. Restart the backend server

Emails sent automatically: order confirmation (after payment), order status updates (admin-triggered), order cancellation, password reset, and welcome email on signup.

---

## 🔑 New Customer-Facing Routes

| Route                          | Purpose                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| `/order-confirmation/:orderId` | Full order details, live status tracker, print invoice, cancel order    |
| `/track-order`                 | Guest-friendly order tracking by order number + email (no login needed) |
| `/forgot-password`             | Request a password reset email                                          |
| `/reset-password/:token`       | Set a new password (token verified before form is shown)                |
| `/profile` → Security tab      | Change password while logged in                                         |

The old `/order-success/:orderId` link still works — it automatically redirects to `/order-confirmation/:orderId` for backward compatibility.

---

## 🚢 Backend API Additions

| Method | Endpoint                                 | Purpose                                         |
| ------ | ---------------------------------------- | ----------------------------------------------- |
| POST   | `/api/auth/forgot-password`              | Send password reset email                       |
| PUT    | `/api/auth/reset-password/:token`        | Reset password with valid token                 |
| GET    | `/api/auth/reset-password/:token/verify` | Check if a reset token is still valid           |
| DELETE | `/api/auth/address/:addressId`           | Remove a saved address                          |
| POST   | `/api/orders/track`                      | Track an order by order number + email (public) |
| PUT    | `/api/orders/:id/cancel`                 | Cancel an order (customer or admin)             |

---

Use Razorpay test credentials:

- **UPI:** success@razorpay
- **Card:** 4111 1111 1111 1111, Exp: any future, CVV: any 3 digits
- **Net Banking:** Any bank, use success credentials

---

## 🚢 Deployment

### Backend — Render / Railway / EC2:

1. Push backend folder to GitHub
2. Set environment variables in hosting dashboard
3. Start command: `node server.js`
4. Build command: `npm install`

### Frontend — Vercel / Netlify:

1. Push frontend folder to GitHub
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_URL=https://your-backend-url.com/api`

### Update CORS in backend/server.js:

```js
origin: ["https://your-frontend-domain.com"];
```

---

## 📱 WhatsApp Configuration

Update your WhatsApp number in:

- `backend/.env` → `WHATSAPP_NUMBER=91XXXXXXXXXX`
- `frontend/.env` → `VITE_WHATSAPP_NUMBER=91XXXXXXXXXX`

---

## 🎨 Brand Customization

**Colors** — `frontend/tailwind.config.js`:

- Primary: `emerald-900` (#0d3b2e)
- Accent: `gold` (#C9A84C)
- Background: `luxury-cream` (#faf8f5)

**Fonts** — `frontend/index.html`:

- Headings: Cormorant Garamond, Playfair Display
- Body: Montserrat, Lato

**Logo** — Replace in `public/sk-logo.png` and update `Navbar.jsx`

---

## 📞 Support

Built for SK Luxury Boutique, Hyderabad.  
For customizations: hello@skluxury.in
