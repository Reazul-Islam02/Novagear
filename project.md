# Software Requirements Specification (SRS)

## NovaGear — Premium Gadgets E-Commerce Platform

| Field            | Detail                                      |
| ---------------- | ------------------------------------------- |
| **Project Name** | NovaGear                                    |
| **Version**      | 0.1.0                                       |
| **Framework**    | Next.js 15 (App Router)                     |
| **Language**     | TypeScript                                  |
| **Database**     | MongoDB 7                                   |
| **Styling**      | Tailwind CSS 3 + Shadcn UI (New York style) |
| **Date**         | March 2026                                  |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Models](#6-data-models)
7. [API Specification](#7-api-specification)
8. [User Interface Specification](#8-user-interface-specification)
9. [State Management](#9-state-management)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Third-Party Dependencies](#11-third-party-dependencies)
12. [Configuration & Environment](#12-configuration--environment)
13. [Future Scope](#13-future-scope)

---

## 1. Introduction

### 1.1 Purpose

This document defines the complete software requirements for **NovaGear**, a full-stack e-commerce web application for browsing, managing, and purchasing premium tech gadgets. It serves as the single source of truth for developers, testers, and stakeholders.

### 1.2 Scope

NovaGear is a single-page-style web application built on Next.js 15 that provides:

- A public storefront for browsing and filtering products.
- User authentication (credentials and Google OAuth).
- Authenticated product management (create / delete).
- A client-side shopping cart with local persistence.
- A contact form for customer inquiries.
- Automatic database seeding of demo data.

### 1.3 Definitions & Acronyms

| Term       | Meaning                                          |
| ---------- | ------------------------------------------------ |
| SRS        | Software Requirements Specification              |
| JWT        | JSON Web Token                                   |
| OAuth      | Open Authorization protocol                      |
| CRUD       | Create, Read, Update, Delete                     |
| SSR        | Server-Side Rendering                            |
| CSR        | Client-Side Rendering                            |
| HMR        | Hot Module Replacement                           |
| API        | Application Programming Interface                |
| SPA        | Single Page Application                          |
| UUID/nanoid| Unique identifier generation                     |

### 1.4 Technology Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Runtime          | Node.js                                 |
| Framework        | Next.js 15.5.12 (App Router)            |
| UI Library       | React 19                                |
| Language         | TypeScript (ES2017 target)              |
| Database         | MongoDB 7 (via native driver)           |
| Authentication   | NextAuth v5 (beta 30) + MongoDB Adapter |
| State Management | Zustand 5 (with persist middleware)     |
| CSS              | Tailwind CSS 3 + tailwindcss-animate    |
| UI Components    | Radix UI primitives + Shadcn UI         |
| Icons            | Lucide React                            |
| Animations       | Framer Motion 12                        |
| Forms            | React Hook Form 7 + Zod 4              |
| Notifications    | Sonner 2                                |
| Password Hashing | bcryptjs 3                              |
| Theming          | next-themes (dark mode default)         |

---

## 2. Overall Description

### 2.1 Product Perspective

NovaGear is a standalone web application. It operates as a monolithic Next.js app that bundles both the frontend (React pages/components) and backend (API route handlers) in one deployable unit. The application connects to an external MongoDB instance for persistent storage.

### 2.2 User Classes

| User Class              | Description                                                    | Access Level                                       |
| ----------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| **Guest (Visitor)**     | Unauthenticated user browsing the store                        | View products, filter/search, add to cart, contact  |
| **Authenticated User**  | Registered or OAuth-authenticated user                         | All guest capabilities + create & delete products   |
| **Demo User**           | Pre-seeded account (`demo@novagear.com` / `demo123`)           | Same as authenticated user; auto-created on seed    |

### 2.3 Operating Environment

- **Client:** Any modern browser (Chrome, Firefox, Safari, Edge).
- **Server:** Node.js 18+ hosting environment (Vercel, self-hosted, Docker).
- **Database:** MongoDB Atlas or self-hosted MongoDB 7+.
- **Minimum viewport:** 320 px (responsive design scales from mobile to 4K).

### 2.4 Constraints

- NextAuth v5 is still in beta; API surface may change.
- ESLint and TypeScript build errors are currently ignored in production builds.
- No payment gateway is integrated — the cart does not include checkout/payment processing.
- No product update (edit) functionality — only create and delete are implemented.

### 2.5 Assumptions

- A MongoDB instance is available and the connection string is provided via `MONGODB_URI`.
- Google OAuth credentials are configured for the deployment domain.
- External image CDNs (Unsplash, Pravatar, Placeholder, GitHub) are accessible.

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       CLIENT (Browser)                         │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │  Pages   │  │Components│  │  Zustand   │  │ NextAuth     │  │
│  │ (App     │  │ (Navbar, │  │  Stores    │  │ Session      │  │
│  │  Router) │  │  Footer, │  │ (Cart,     │  │ Provider     │  │
│  │          │  │  Cards)  │  │  Products) │  │              │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────────┘  │
└──────────────────────────┬─────────────────────────────────────┘
                           │ HTTP (fetch / NextAuth)
┌──────────────────────────▼─────────────────────────────────────┐
│                   NEXT.JS SERVER (API Routes)                  │
│                                                                │
│  /api/products          GET (list), POST (create)              │
│  /api/products/[id]     GET (detail), DELETE (remove)          │
│  /api/auth/register     POST (create user)                     │
│  /api/auth/[...nextauth] NextAuth handlers                     │
│  /api/seed              GET (initialize demo data)             │
│                                                                │
│  Middleware → Protects /add-product, /manage-products           │
└──────────────────────────┬─────────────────────────────────────┘
                           │ MongoDB Driver
┌──────────────────────────▼─────────────────────────────────────┐
│                        MONGODB                                 │
│                                                                │
│  Collections: users, products, accounts, sessions              │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 Directory Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (providers, navbar, footer)
│   ├── page.tsx              # Landing / home page
│   ├── not-found.tsx         # Custom 404 page
│   ├── globals.css           # Global styles & CSS variables
│   ├── login/page.tsx        # Authentication (sign in / register)
│   ├── shop/page.tsx         # Product catalog with search & filters
│   ├── shop/[id]/page.tsx    # Product detail page
│   ├── add-product/page.tsx  # Create new product (protected)
│   ├── manage-products/page.tsx # Product management table (protected)
│   ├── contact/page.tsx      # Contact form
│   └── api/                  # Backend API routes
│       ├── products/route.ts
│       ├── products/[id]/route.ts
│       ├── auth/register/route.ts
│       ├── auth/[...nextauth]/route.ts
│       └── seed/route.ts
├── components/               # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── Providers.tsx
│   ├── SeedInitializer.tsx
│   └── ui/                   # Shadcn UI primitives (14 components)
├── lib/                      # Utilities & configuration
│   ├── mongodb.ts            # Database connection singleton
│   ├── constants.ts          # Seed product data
│   └── utils.ts              # cn() class merge helper
├── store/                    # Zustand state stores
│   ├── useCartStore.ts
│   └── useProductStore.ts
├── auth.ts                   # NextAuth configuration
├── middleware.ts             # Route protection middleware
└── types.ts                  # TypeScript type definitions
```

### 3.3 Data Flow Diagrams

#### Product Browsing Flow

```
User opens /shop
    → SeedInitializer (on mount) → GET /api/seed → seeds DB if empty
    → GET /api/products → products stored in useProductStore
    → Shop page reads from useProductStore
    → User applies filters/search → useMemo recomputes displayed products
    → User clicks product → navigates to /shop/[id]
```

#### Authentication Flow

```
User opens /login
    ├─ Credentials Path:
    │   → Fills email + password form
    │   → signIn("credentials") → NextAuth validates against MongoDB
    │   → bcrypt.compare(password, hash) → JWT issued → session created
    │
    └─ Google OAuth Path:
        → signIn("google") → Google consent screen
        → Callback → MongoDB adapter stores account → JWT issued
```

#### Product Management Flow

```
Authenticated user navigates to /add-product (middleware checks session)
    → Fills product form (validated by Zod schema)
    → POST /api/products (auth header from session)
    → MongoDB insert → response with new product
    → useProductStore.addProduct() → localStorage sync
    → redirect to /shop
```

#### Cart Flow

```
User clicks "Add to Cart" on ProductCard
    → useCartStore.addToCart(product)
    → If product exists in cart → increment quantity
    → If new product → add as new CartItem
    → Persist to localStorage (key: "novagear-cart")
    → Navbar cart badge updates (getTotalItems)
    → Cart dropdown shows items with quantities and total price
```

---

## 4. Functional Requirements

### 4.1 Landing Page (FR-HOME)

| ID        | Requirement                                                            | Priority |
| --------- | ---------------------------------------------------------------------- | -------- |
| FR-HOME-1 | Display a hero banner with CTA buttons linking to the shop             | High     |
| FR-HOME-2 | Show 5 category cards (Smartphones, Laptops, Audio, Wearables, Cameras)| High     |
| FR-HOME-3 | Display the first 4 products from the product store as featured items  | High     |
| FR-HOME-4 | Show a features section (Free Shipping, Warranty, Secure Checkout, Support) | Medium |
| FR-HOME-5 | Display 3 customer testimonials with avatars                           | Low      |
| FR-HOME-6 | Animate sections on scroll using Framer Motion                         | Low      |

### 4.2 Product Catalog — Shop Page (FR-SHOP)

| ID         | Requirement                                                          | Priority |
| ---------- | -------------------------------------------------------------------- | -------- |
| FR-SHOP-1  | List all products in a responsive grid (1/2/3/4 columns)            | High     |
| FR-SHOP-2  | Provide a real-time text search across product title and description | High     |
| FR-SHOP-3  | Provide category filter buttons (All, Smartphone, Laptop, Audio, Wearable, Camera, Accessory) | High |
| FR-SHOP-4  | Support URL query parameter `?cat=<category>` for deep-linking filters | Medium |
| FR-SHOP-5  | Show animated transitions when products enter/leave the grid         | Low      |
| FR-SHOP-6  | Display a "no results" state with a reset button when filters match nothing | Medium |
| FR-SHOP-7  | Show a loading skeleton during initial data fetch                    | Medium   |

### 4.3 Product Detail Page (FR-DETAIL)

| ID           | Requirement                                                         | Priority |
| ------------ | ------------------------------------------------------------------- | -------- |
| FR-DETAIL-1  | Display product image with hover zoom effect                        | Medium   |
| FR-DETAIL-2  | Show product title, category, brand, and star rating                | High     |
| FR-DETAIL-3  | Display current price and original price (15% markup) with discount badge | High |
| FR-DETAIL-4  | Provide a quantity selector (increment/decrement, min 1)            | High     |
| FR-DETAIL-5  | "Add to Cart" button adds selected quantity to cart store            | High     |
| FR-DETAIL-6  | "Buy Now" button adds to cart (equivalent to Add to Cart)           | High     |
| FR-DETAIL-7  | Show related products filtered by the same category                 | Medium   |
| FR-DETAIL-8  | Display breadcrumb navigation (Home → Shop → Product)               | Low      |
| FR-DETAIL-9  | Show toast notification on successful add to cart                   | Medium   |

### 4.4 Shopping Cart (FR-CART)

| ID         | Requirement                                                         | Priority |
| ---------- | ------------------------------------------------------------------- | -------- |
| FR-CART-1  | Navbar displays a cart icon with a badge showing total item count   | High     |
| FR-CART-2  | Cart dropdown displays all items with image, title, quantity, price | High     |
| FR-CART-3  | Allow quantity adjustment (±) per item from the cart dropdown       | High     |
| FR-CART-4  | Allow item removal from the cart dropdown                          | High     |
| FR-CART-5  | Display total price of all cart items                               | High     |
| FR-CART-6  | Persist cart state across page refreshes via localStorage           | High     |
| FR-CART-7  | Badge shows "9+" when item count exceeds 9                          | Low      |

### 4.5 Authentication (FR-AUTH)

| ID         | Requirement                                                         | Priority |
| ---------- | ------------------------------------------------------------------- | -------- |
| FR-AUTH-1  | Provide a login form with email and password fields                | High     |
| FR-AUTH-2  | Provide a registration form with name, email, and password         | High     |
| FR-AUTH-3  | Validate forms using Zod schemas (email format, required fields)   | High     |
| FR-AUTH-4  | Support Google OAuth sign-in                                       | High     |
| FR-AUTH-5  | Hash passwords with bcrypt (10 salt rounds) before storing         | High     |
| FR-AUTH-6  | Prevent duplicate email registration                               | High     |
| FR-AUTH-7  | Use JWT session strategy                                           | High     |
| FR-AUTH-8  | Display demo credentials on the login page                         | Low      |
| FR-AUTH-9  | Show toast notifications for auth errors                           | Medium   |
| FR-AUTH-10 | Provide sign-out functionality with confirmation                   | Medium   |

### 4.6 Product Management — Add Product (FR-ADD)

| ID        | Requirement                                                          | Priority |
| --------- | -------------------------------------------------------------------- | -------- |
| FR-ADD-1  | Only accessible to authenticated users (middleware redirect)         | High     |
| FR-ADD-2  | Provide form fields: Title, Price, Category, Short Desc, Full Desc, Image URL | High |
| FR-ADD-3  | Validate with Zod: title ≥ 2 chars, price > 0, short desc 10–120 chars, full desc ≥ 20 chars | High |
| FR-ADD-4  | Show real-time character counter for short description               | Medium   |
| FR-ADD-5  | Preview image from URL before submission                             | Medium   |
| FR-ADD-6  | Generate unique product ID using nanoid                              | High     |
| FR-ADD-7  | On success: update product store, navigate to shop, show toast       | High     |
| FR-ADD-8  | Category dropdown includes: Smartphone, Laptop, Audio, Wearable, Camera, Accessory | High |

### 4.7 Product Management — Manage Products (FR-MANAGE)

| ID           | Requirement                                                       | Priority |
| ------------ | ----------------------------------------------------------------- | -------- |
| FR-MANAGE-1  | Only accessible to authenticated users (middleware redirect)      | High     |
| FR-MANAGE-2  | Display all products in a table (desktop) or card list (mobile)   | High     |
| FR-MANAGE-3  | Table columns: Image, Title/Description, Category, Price, Actions | High     |
| FR-MANAGE-4  | Provide search/filter by product title or category                | Medium   |
| FR-MANAGE-5  | "View" action links to product detail page                        | Medium   |
| FR-MANAGE-6  | "Delete" action shows confirmation dialog before deleting         | High     |
| FR-MANAGE-7  | Delete calls DELETE /api/products/[id] and updates store          | High     |
| FR-MANAGE-8  | "New Record" button links to /add-product                         | Medium   |

### 4.8 Contact Page (FR-CONTACT)

| ID            | Requirement                                                      | Priority |
| ------------- | ---------------------------------------------------------------- | -------- |
| FR-CONTACT-1  | Display contact information (email, location)                    | Medium   |
| FR-CONTACT-2  | Provide a contact form with name, email, and message fields      | Medium   |
| FR-CONTACT-3  | Validate required fields before submission                       | Medium   |
| FR-CONTACT-4  | Display security/encryption notice (AES-256)                     | Low      |
| FR-CONTACT-5  | Show 24/7 support availability indicator                         | Low      |

### 4.9 Navigation & Layout (FR-NAV)

| ID        | Requirement                                                          | Priority |
| --------- | -------------------------------------------------------------------- | -------- |
| FR-NAV-1  | Sticky navbar at top of all pages                                    | High     |
| FR-NAV-2  | Navigation links: Home, Shop, Features, Contact                     | High     |
| FR-NAV-3  | Mobile hamburger menu with all navigation links                      | High     |
| FR-NAV-4  | Authenticated user avatar dropdown with profile info and logout      | High     |
| FR-NAV-5  | Footer with brand info, navigation links, resources, newsletter form | Medium   |
| FR-NAV-6  | Social media links in footer (Twitter, Instagram, Facebook, YouTube) | Low      |
| FR-NAV-7  | Custom 404 page with navigation back to home/shop                    | Medium   |

### 4.10 Database Seeding (FR-SEED)

| ID         | Requirement                                                         | Priority |
| ---------- | ------------------------------------------------------------------- | -------- |
| FR-SEED-1  | Automatically seed database on application mount                    | High     |
| FR-SEED-2  | Create demo user if not already present                             | High     |
| FR-SEED-3  | Insert 8 seed products if product collection is empty               | High     |
| FR-SEED-4  | Fetch and sync products into client-side store after seeding        | High     |
| FR-SEED-5  | Fail silently without blocking UI if seeding fails                  | Medium   |

---

## 5. Non-Functional Requirements

### 5.1 Performance (NFR-PERF)

| ID          | Requirement                                                        |
| ----------- | ------------------------------------------------------------------ |
| NFR-PERF-1  | Pages must render within 3 seconds on a standard broadband connection |
| NFR-PERF-2  | Client-side filtering and search must be instant (< 100 ms) via useMemo |
| NFR-PERF-3  | Images optimized via Next.js Image component with lazy loading     |
| NFR-PERF-4  | MongoDB connection pooled and reused (no reconnect per request)    |
| NFR-PERF-5  | Cart and product store persisted via localStorage to avoid redundant API calls |

### 5.2 Scalability (NFR-SCALE)

| ID           | Requirement                                                       |
| ------------ | ----------------------------------------------------------------- |
| NFR-SCALE-1  | Stateless API design allows horizontal scaling behind a load balancer |
| NFR-SCALE-2  | JWT sessions avoid server-side session storage                    |
| NFR-SCALE-3  | MongoDB supports sharding for future data growth                  |

### 5.3 Security (NFR-SEC)

| ID         | Requirement                                                         |
| ---------- | ------------------------------------------------------------------- |
| NFR-SEC-1  | Passwords hashed with bcrypt (10 salt rounds); never stored in plaintext |
| NFR-SEC-2  | JWT used for session management with secure cookie handling         |
| NFR-SEC-3  | Protected routes enforced at middleware level before page render    |
| NFR-SEC-4  | API endpoints verify session before write operations               |
| NFR-SEC-5  | Remote image sources whitelisted in next.config.ts                 |
| NFR-SEC-6  | CSRF protection provided by NextAuth                               |
| NFR-SEC-7  | Google OAuth uses industry-standard PKCE flow                      |

### 5.4 Usability (NFR-USE)

| ID         | Requirement                                                         |
| ---------- | ------------------------------------------------------------------- |
| NFR-USE-1  | Fully responsive design from 320 px mobile to 4K desktop           |
| NFR-USE-2  | Dark mode enabled by default with consistent color scheme           |
| NFR-USE-3  | Toast notifications provide immediate user feedback                |
| NFR-USE-4  | Form validation errors shown inline with clear messages            |
| NFR-USE-5  | Smooth animations and transitions for pleasant UX                  |
| NFR-USE-6  | Loading skeletons prevent layout shift during data fetching        |

### 5.5 Reliability (NFR-REL)

| ID         | Requirement                                                         |
| ---------- | ------------------------------------------------------------------- |
| NFR-REL-1  | SeedInitializer fails silently — app remains functional without seed data |
| NFR-REL-2  | Cart state survives page refreshes and browser restarts (localStorage) |
| NFR-REL-3  | MongoDB connection reused in development to prevent connection exhaustion |
| NFR-REL-4  | API endpoints return appropriate HTTP status codes and error messages |

### 5.6 Maintainability (NFR-MAINT)

| ID          | Requirement                                                        |
| ----------- | ------------------------------------------------------------------ |
| NFR-MAINT-1 | TypeScript used throughout for compile-time type safety            |
| NFR-MAINT-2 | Path alias (`@/`) standardizes imports                             |
| NFR-MAINT-3 | Component-based architecture with clear separation of concerns     |
| NFR-MAINT-4 | Shadcn UI components are local copies — fully customizable         |
| NFR-MAINT-5 | Zustand stores are modular and independently testable              |

---

## 6. Data Models

### 6.1 Product

```typescript
type Product = {
    id: string;        // nanoid-generated unique identifier
    title: string;     // Product name (min 2 characters)
    shortDesc: string; // Brief description (10–120 characters)
    fullDesc: string;  // Detailed description (min 20 characters)
    price: number;     // Price in USD (positive number)
    category: string;  // One of: Smartphone | Laptop | Audio | Wearable | Camera | Accessory
    image: string;     // URL to product image
    createdAt: Date;   // Timestamp of creation
};
```

### 6.2 Category (Union Type)

```typescript
type Category = "Smartphone" | "Laptop" | "Audio" | "Wearable" | "Camera" | "Accessory";
```

### 6.3 User (MongoDB — NextAuth Managed)

| Field      | Type   | Description                     |
| ---------- | ------ | ------------------------------- |
| _id        | ObjectId | MongoDB auto-generated ID     |
| name       | string | User display name               |
| email      | string | Unique email address            |
| password   | string | bcrypt-hashed password          |
| image      | string | Avatar URL (optional)           |
| createdAt  | Date   | Account creation timestamp      |

### 6.4 Cart Item (Client-Side Only)

```typescript
type CartItem = {
    id: string;       // Product ID
    title: string;    // Product title
    price: number;    // Unit price
    image: string;    // Product image URL
    quantity: number;  // Quantity in cart (≥ 1)
};
```

### 6.5 Seed Products

8 pre-defined products are seeded on first load:

| # | Product             | Category    | Price    |
|---|---------------------|-------------|----------|
| 1 | Nova Pro Max X      | Smartphone  | $1,299   |
| 2 | ZenBook Ultra 14    | Laptop      | $1,899   |
| 3 | SonicWave Buds      | Audio       | $199     |
| 4 | Nova Watch Series 5 | Wearable    | $349     |
| 5 | CinemaLens 4K       | Camera      | $2,499   |
| 6 | Aura Headphones     | Audio       | $449     |
| 7 | Nexus Tablet Pro    | Accessory   | $899     |
| 8 | SwiftCharge Dock    | Accessory   | $129     |

---

## 7. API Specification

### 7.1 Products API

#### GET `/api/products`

| Property    | Value                                       |
| ----------- | ------------------------------------------- |
| Auth        | None                                        |
| Description | Retrieve all products sorted by newest first|
| Response    | `200` — `Product[]`                         |
| Error       | `500` — `{ message: string }`              |

#### POST `/api/products`

| Property    | Value                                       |
| ----------- | ------------------------------------------- |
| Auth        | Required (session)                          |
| Body        | `Product` object (JSON)                     |
| Response    | `201` — `{ ...product, _id: string }`      |
| Errors      | `401` — Unauthorized · `500` — Server error|

#### GET `/api/products/[id]`

| Property    | Value                                       |
| ----------- | ------------------------------------------- |
| Auth        | None                                        |
| Params      | `id` — Product ID                           |
| Response    | `200` — `Product`                           |
| Errors      | `404` — Not found · `500` — Server error   |

#### DELETE `/api/products/[id]`

| Property    | Value                                       |
| ----------- | ------------------------------------------- |
| Auth        | Required (session)                          |
| Params      | `id` — Product ID                           |
| Response    | `200` — `{ message: string }`              |
| Errors      | `401` — Unauthorized · `404` — Not found · `500` — Server error |

### 7.2 Authentication API

#### POST `/api/auth/register`

| Property    | Value                                       |
| ----------- | ------------------------------------------- |
| Auth        | None                                        |
| Body        | `{ name: string, email: string, password: string }` |
| Response    | `201` — `{ userId: string, message: string }` |
| Errors      | `400` — Missing fields / duplicate email · `500` — Server error |

#### NextAuth Routes — `/api/auth/[...nextauth]`

Handled automatically by NextAuth. Supports:

- `GET /api/auth/signin` — Sign-in page
- `POST /api/auth/signin/credentials` — Credential login
- `POST /api/auth/signin/google` — Google OAuth
- `GET /api/auth/signout` — Sign-out
- `GET /api/auth/session` — Current session

### 7.3 Seed API

#### GET `/api/seed`

| Property    | Value                                       |
| ----------- | ------------------------------------------- |
| Auth        | None                                        |
| Description | Initialize demo user and seed products      |
| Response    | `200` — `{ message: string, userResult, productResult }` |
| Error       | `500` — `{ message: string }`              |

---

## 8. User Interface Specification

### 8.1 Pages Overview

| Route                | Page                | Auth Required | Description                       |
| -------------------- | ------------------- | ------------- | --------------------------------- |
| `/`                  | Home / Landing      | No            | Hero, categories, featured, testimonials |
| `/shop`              | Product Catalog     | No            | Full product grid with filters    |
| `/shop/[id]`         | Product Detail      | No            | Single product view with cart actions |
| `/login`             | Authentication      | No            | Sign in / register dual-tab form  |
| `/add-product`       | Create Product      | **Yes**       | Product creation form             |
| `/manage-products`   | Product Management  | **Yes**       | Product table with delete actions |
| `/contact`           | Contact             | No            | Contact info and form             |
| `/*` (unmatched)     | 404 Not Found       | No            | Custom error page                 |

### 8.2 Component Hierarchy

```
<RootLayout>
├── <Providers>
│   ├── <SessionProvider>       — NextAuth session context
│   ├── <ThemeProvider>         — Dark/light mode
│   ├── <SeedInitializer />     — Database sync on mount
│   └── <Toaster />             — Toast notification container
├── <Navbar>
│   ├── Logo (NovaGear + CPU icon)
│   ├── Navigation Links (Home, Shop, Features, Contact)
│   ├── Cart Dropdown
│   │   ├── Cart Items (image, title, quantity ±, remove)
│   │   └── Total Price + View Shop link
│   ├── User Avatar Dropdown (authenticated)
│   │   ├── User info
│   │   ├── New Production link
│   │   ├── System Settings link
│   │   └── Logout button
│   └── Mobile Menu (hamburger toggle)
├── <main>{page content}</main>
└── <Footer>
    ├── Brand column (logo, tagline, social links)
    ├── Navigation column (shop links)
    ├── Resources column (support, terms)
    ├── Communications column (newsletter form)
    └── Bottom bar (copyright, uptime, region)
```

### 8.3 Design System

| Property             | Value                                     |
| -------------------- | ----------------------------------------- |
| Theme                | Dark mode by default (class-based toggle) |
| Primary Color        | Emerald — `hsl(158, 64%, 52%)`            |
| Base Color           | Zinc                                      |
| Component Style      | Shadcn UI "New York" variant              |
| Typography           | System font stack (Geist Sans & Mono)     |
| Border Radius        | CSS variable `--radius` based             |
| Glass Effect         | `backdrop-blur + semi-transparent bg`     |
| Animations           | Framer Motion + tailwindcss-animate       |
| Icon Library         | Lucide React                              |

### 8.4 Custom CSS Utilities

| Class                  | Effect                                              |
| ---------------------- | --------------------------------------------------- |
| `.bg-mesh`             | Radial gradient background with primary accents     |
| `.glass`               | Glassmorphism (transparent + blur)                  |
| `.text-gradient`       | White gradient text                                 |
| `.text-gradient-primary` | Emerald gradient text                             |
| `.animate-float`       | 4-second vertical floating animation                |

### 8.5 Responsive Breakpoints

| Breakpoint | Width   | Products Grid | Layout Changes              |
| ---------- | ------- | ------------- | --------------------------- |
| Mobile     | < 640px | 1 column      | Hamburger menu, card views  |
| Tablet     | 640px   | 2 columns     | Side-by-side layouts        |
| Desktop    | 1024px  | 3 columns     | Full navigation, table view |
| Wide       | 1280px  | 4 columns     | Maximum grid density        |

---

## 9. State Management

### 9.1 Product Store (`useProductStore`)

**Storage Key:** `novagear-storage` (localStorage)

| Method                | Description                                  |
| --------------------- | -------------------------------------------- |
| `setProducts(list)`   | Bulk-replace all products (from API)         |
| `addProduct(product)` | Prepend a new product to the list            |
| `deleteProduct(id)`   | Remove product by ID                         |
| `getProductById(id)`  | Look up a single product                     |

**Lifecycle:**
1. `SeedInitializer` calls `setProducts()` on app mount with API data.
2. `addProduct()` called after successful product creation.
3. `deleteProduct()` called after successful API deletion.
4. All pages read from this store instead of making individual API calls.

### 9.2 Cart Store (`useCartStore`)

**Storage Key:** `novagear-cart` (localStorage)

| Method                         | Description                                |
| ------------------------------ | ------------------------------------------ |
| `addToCart(product)`           | Add item or increment quantity if exists   |
| `removeFromCart(productId)`    | Remove item entirely                       |
| `updateQuantity(id, quantity)` | Set new quantity; remove if ≤ 0            |
| `clearCart()`                  | Empty the entire cart                      |
| `getTotalItems()`             | Sum of all item quantities                 |
| `getTotalPrice()`             | Sum of (price × quantity) for all items    |

**Persistence:** Zustand `persist` middleware with `localStorage` as storage engine.

---

## 10. Authentication & Authorization

### 10.1 Authentication Providers

| Provider      | Type        | Configuration                            |
| ------------- | ----------- | ---------------------------------------- |
| Credentials   | Email/Pass  | Validates against MongoDB `users` collection with bcrypt |
| Google        | OAuth 2.0   | Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`  |

### 10.2 Session Strategy

- **Type:** JWT (JSON Web Token)
- **Reason:** Required when using the Credentials provider with NextAuth v5.
- **Storage:** HTTP-only secure cookie managed by NextAuth.

### 10.3 Protected Routes

| Route              | Protection Level                            |
| ------------------ | ------------------------------------------- |
| `/add-product`     | Middleware redirect to `/login` if unauthenticated |
| `/manage-products` | Middleware redirect to `/login` if unauthenticated |
| `POST /api/products` | Returns 401 if no valid session              |
| `DELETE /api/products/[id]` | Returns 401 if no valid session       |

### 10.4 Demo Account

| Field    | Value                |
| -------- | -------------------- |
| Email    | `demo@novagear.com`  |
| Password | `demo123`            |
| Auto-Created | Yes, via `/api/seed` on first app load |

---

## 11. Third-Party Dependencies

### 11.1 Production Dependencies

| Package                    | Version       | Purpose                          |
| -------------------------- | ------------- | -------------------------------- |
| next                       | ^15.5.12      | React framework (App Router)     |
| react / react-dom          | ^19.2.4       | UI rendering                     |
| next-auth                  | ^5.0.0-beta.30| Authentication                   |
| @auth/mongodb-adapter      | ^3.11.1       | NextAuth ↔ MongoDB bridge        |
| mongodb                    | ^7.1.0        | Database driver                  |
| bcryptjs                   | ^3.0.3        | Password hashing                 |
| zustand                    | ^5.0.11       | Client state management          |
| react-hook-form            | ^7.71.2       | Form state management            |
| @hookform/resolvers        | ^5.2.2        | Zod ↔ React Hook Form bridge     |
| zod                        | ^4.3.6        | Schema validation                |
| framer-motion              | ^12.34.5      | Animations                       |
| next-themes                | ^0.4.6        | Dark/light mode                  |
| sonner                     | ^2.0.7        | Toast notifications              |
| nanoid                     | ^5.1.6        | Unique ID generation             |
| lucide-react               | ^0.576.0      | Icons                            |
| @radix-ui/*                | Latest        | Headless UI primitives           |
| clsx                       | ^2.1.1        | Conditional classnames           |
| tailwind-merge             | ^3.5.0        | Tailwind class deduplication     |
| class-variance-authority   | ^0.7.1        | Component variant management     |

### 11.2 Dev Dependencies

| Package                    | Version       | Purpose                          |
| -------------------------- | ------------- | -------------------------------- |
| typescript                 | ^5            | Type checking                    |
| tailwindcss                | ^3.4.1        | CSS utility framework            |
| tailwindcss-animate        | ^1.0.7        | Animation utilities              |
| postcss                    | ^8            | CSS processing                   |
| eslint                     | ^9            | Code linting                     |
| @types/node                | ^20           | Node.js type definitions         |
| @types/react               | ^19           | React type definitions           |
| @types/bcryptjs            | ^2.4.6        | bcryptjs type definitions        |

---

## 12. Configuration & Environment

### 12.1 Environment Variables

| Variable              | Required | Description                           |
| --------------------- | -------- | ------------------------------------- |
| `MONGODB_URI`         | Yes      | MongoDB connection string             |
| `AUTH_SECRET`          | Yes      | NextAuth secret for JWT signing       |
| `GOOGLE_CLIENT_ID`    | Yes      | Google OAuth client ID                |
| `GOOGLE_CLIENT_SECRET`| Yes      | Google OAuth client secret            |
| `NEXTAUTH_URL`        | Yes*     | Base URL for NextAuth (* in production) |

### 12.2 Image Domains (Whitelisted)

| Domain                  | Purpose                     |
| ----------------------- | --------------------------- |
| `images.unsplash.com`   | Product images              |
| `i.pravatar.cc`         | User avatars / testimonials |
| `via.placeholder.com`   | Fallback placeholder images |
| `github.com`            | Demo user avatar            |

### 12.3 Build Configuration

| Setting                          | Value    | Notes                        |
| -------------------------------- | -------- | ---------------------------- |
| `eslint.ignoreDuringBuilds`      | `true`   | Skips ESLint errors on build |
| `typescript.ignoreBuildErrors`   | `true`   | Skips TS errors on build     |

### 12.4 Scripts

| Script          | Command              | Description                    |
| --------------- | -------------------- | ------------------------------ |
| `dev`           | `next dev`           | Start development server (HMR) |
| `build`         | `next build`         | Create production build         |
| `start`         | `next start`         | Start production server         |
| `lint`          | `eslint`             | Run ESLint checks               |

---

## 13. Future Scope

The following features are **not** currently implemented but are natural extensions of the platform:

| Feature                   | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| **Checkout & Payments**   | Integrate Stripe/PayPal for actual purchase processing   |
| **Product Edit (Update)** | Allow editing existing product details (PATCH endpoint)  |
| **Order Management**      | Order history, tracking, and status updates              |
| **User Roles**            | Admin vs. customer roles with granular permissions       |
| **Wishlist**              | Save products for later (UI buttons already present)     |
| **Reviews & Ratings**     | User-submitted product reviews with star ratings         |
| **Inventory Tracking**    | Stock quantity management with out-of-stock handling     |
| **Email Notifications**   | Order confirmations, shipping updates, contact form delivery |
| **Search Enhancement**    | Full-text search indexing on MongoDB                     |
| **Analytics Dashboard**   | Sales metrics, popular products, user activity tracking  |
| **Internationalization**  | Multi-language and multi-currency support                |
| **PWA Support**           | Offline capability, push notifications, app install      |

---

*End of Software Requirements Specification*
