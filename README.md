# UniTrade — Campus Marketplace

> A full-stack web platform for students to buy and sell items within their campus community. Built with React, Node.js, PostgreSQL, and Razorpay.

---

## Features

### Buyer
- Browse product listings with search and category filter pills
- Add products to cart with quantity controls
- Checkout with **Cash at Meetup** or **Online (Razorpay)** payment
- Campus meetup spot & time selection during checkout
- 6-digit OTP delivery verification (buyer reveals OTP only after receiving item)
- View order history with real-time status badges
- In-app per-order chat with seller
- Wishlist management

### Seller
- Seller onboarding with admin approval workflow
- Add, edit, and delete product listings with image upload
- View incoming orders and confirm delivery via OTP
- In-app per-order chat with buyer
- Seller dashboard with listing stats and quick actions

### Admin
- Manage and approve/reject seller applications
- User management panel

### General
- JWT-based authentication (stored as Bearer token)
- Protected routes per role (Buyer / Seller / Admin)
- Toast notifications for feedback
- Responsive layout with clean black-and-white design system

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Routing | React Router v6 |
| Styling | Vanilla CSS-in-JS (inline styles) |
| Auth | JWT (localStorage) |
| Payments | Razorpay Checkout SDK |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Image Storage | Cloud Storage (URL-based) |
| API | REST API |

---

## Project Structure

```
campus-buy-sell-web-/
├── public/
└── src/
    ├── components/
    │   ├── CartButton/          # Cart stepper component
    │   ├── Layout/              # AppLayout (navbar, page wrapper)
    │   └── PublicNavbar/        # Landing page navbar
    ├── context/
    │   ├── AuthContext.tsx      # Global auth state
    │   ├── CartContext.tsx      # Cart state
    │   └── ToastContext.tsx     # Toast notification system
    ├── pages/
    │   ├── auth/                # Login, Register
    │   ├── buyer/               # Home, Products, Cart, Orders, Chat, Wishlist, Profile, Settings
    │   ├── seller/              # Dashboard, Products, Orders, Onboarding, SignIn
    │   ├── admin/               # Admin Users panel
    │   └── public/              # Landing page
    ├── routes/
    │   └── AppRoutes.tsx        # All route definitions
    ├── services/
    │   └── api.ts               # Axios instance with auth headers
    └── config/
        └── appConfig.ts         # API base URL config
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd campus-buy-sell-web-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file (optional — defaults to `http://localhost:5000/api`):

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

> Do **not** commit `.env` files or API credentials.

### 4. Run the Dev Server

```bash
npm start
```

App runs at **http://localhost:3000**

---

## Backend

Communicates with the **Campus Marketplace Backend** over REST API. Ensure the backend server is running at `http://localhost:5000` (or update `REACT_APP_API_BASE_URL`).

The backend handles:
- Auth (register, login, JWT issue)
- Product CRUD
- Cart & Orders
- Razorpay payment init & verification
- OTP generation & verification
- In-app chat messages per order
- Seller application approval

---

## Key Flows

### Checkout Flow
1. Buyer adds items to cart
2. Selects payment method (Cash or Online) and campus meetup spot/time
3. Places order → backend creates order and generates 6-digit OTP
4. Modal shown with OTP and option to chat with seller

### OTP Delivery Verification
- Buyer reveals OTP on the Orders page (hidden by default)
- Buyer shares OTP with seller **only after receiving the item**
- Seller enters OTP on Seller Orders page to confirm delivery
- Order status updates to **Completed**

### Razorpay Online Payment
- Backend initialises a Razorpay order and returns `keyId` + `orderId`
- Frontend opens Razorpay Checkout SDK
- On success, frontend calls `/payments/verify` with signature
- Order status updates to **Paid · Awaiting Meetup**

---

## Project Status

**Status:** In Active Development

Developed as part of the **OJT Semester 3 — Product Development** project.

**Full project documentation:** [Google Drive Link](https://drive.google.com/file/d/1miNHk4CkprCCCL1-ocQIEOyejaK9Fbui/view?usp=sharing)
