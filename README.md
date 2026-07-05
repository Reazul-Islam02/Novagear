# ⚡ NovaGear - Premium Electronics & Gadgets Marketplace

NovaGear is a world-class, production-ready e-commerce platform built with **Next.js 15 (App Router)**. It features a stunning, pixel-perfect design with emerald accents, powered by Tailwind CSS, shadcn/ui, and Framer Motion for premium micro-animations.

## 🚀 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescript.org/) (Strict Mode)
- **Styling:** [Tailwind CSS v3.4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Authentication:** [Auth.js v5](https://authjs.dev/) (@auth/nextjs)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) + Persist middleware
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Toasts:** [Sonner](https://sonner.stevenly.me/)
- **Icons:** [Lucide React](https://lucide.dev/)

## ✨ Key Features

- **Immersive Landing Page:** 7 polished sections including Hero (with tech gradients), Featured Products, Why Choose Us, Testimonials, Categories, and Newsletter.
- **Dynamic Shop Gallery:** Real-time search and category filtering with smooth transitions.
- **Premium Product Details:** High-resolution presentation with detailed specs, pricing, and stock status.
- **Secure Authentication:** Robust login/register system with Credentials and Google OAuth providers.
- **Inventory Management:** Full CRUD operations for authorized users to add, view, and delete products.
- **Persistent Global State:** Cart items and inventory are persisted to local storage using Zustand.
- **Responsive & Accessible:** Fully optimized for mobile, tablet, and desktop with a focus on UX.

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and set your secrets.
```bash
cp .env.local.example .env.local
```
Minimum required for authentication to work:
- `AUTH_SECRET`: Generate one using `npx auth secret`

### 3. Run Development Server
```bash
npm run dev
```

## 🔑 Demo & Access

- **Live Demo:** [NovaGear on Vercel](https://novagear-demo.vercel.app/)
- **Test Credentials:**
  - **Email:** `demo@novagear.com`
  - **Password:** `demo123`

## 📂 Route Architecture

| Route | View | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/login` | Auth Portal | Public |
| `/shop` | Product Listing | Public |
| `/shop/[id]` | Item Details | Public |
| `/add-product` | Inventory Form | Protected |
| `/manage-products` | Inventory Table | Protected |

---
Designed and engineered for the future of digital commerce. 🚀
