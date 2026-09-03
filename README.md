# Z Shop — Next-Gen E-Commerce Platform & AI Shopping Assistant

[![Live Production](https://img.shields.io/badge/Live_Demo-z--shop--online.vercel.app-000000?style=flat-square&logo=vercel)](https://z-shop-online.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.21-4285F4?style=flat-square&logo=google-gemini)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Z Shop is a production-ready, full-stack Amazon-scale e-commerce platform built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Google Gemini AI. It combines real-time inventory management, multi-currency support, interactive live order tracking, seller admin analytics, and an integrated Gemini AI Shopping Advisor.

🌐 **Live Production URL**: [https://z-shop-online.vercel.app](https://z-shop-online.vercel.app)  
⚡ **Vercel Project Dashboard**: [https://vercel.com/razikuljoni/z-shop](https://vercel.com/razikuljoni/z-shop)

---

## 🌟 Key Features

### 🛒 Customer Experience
- **Interactive Product Catalog**: Grid view with category filtering, search, sorting, and tag-based discovery.
- **Detailed Product Modals**: Rich product previews with image galleries, customer reviews, stock availability, and specs.
- **Smart Shopping Cart**: Slide-out cart drawer with quantity adjustments, promo codes, fee calculation, and multi-item checkout.
- **Multi-Step Checkout**: Shipping address, payment method selection (Credit Card, PayPal, Crypto, COD), order summary, and instant receipt generation.
- **Live Order Tracking**: Interactive order timeline with map visualization, driver status, and live step updates.
- **Multi-Currency Localization**: Instant price conversion between USD ($), EUR (€), GBP (£), BDT (৳), and JPY (¥).
- **Personalized Customer Analytics**: Visual insights on user spending, saved categories, order trends, and rewards.

### 🤖 AI Shopping Advisor (Google Gemini)
- **Real-Time Product Recommendations**: Context-aware AI recommendations based on user preferences and search query.
- **Interactive AI Drawer**: Chat interface for instant shopping advice, gift selection, and technical product comparisons.
- **Serverless API Integration**: Secure Next.js API route communicating directly with `@google/genai` SDK.

### 🛡️ Security & Authentication
- **Simulated 2FA & Auth**: Login/Signup flow with Two-Factor Authentication (OTP verification modal).
- **Role-Based Access**: Seamless toggling between Customer view, Seller view, and Admin management dashboard.

### 📊 Admin & Seller Management Dashboard
- **Store Performance Metrics**: Gross sales, order volume, visitor conversion rate, and average order value (AOV).
- **Interactive Charts**: Powered by Recharts for monthly revenue and category sales breakdown.
- **Inventory Control**: Real-time stock status monitoring, out-of-stock alerts, and restocking actions.
- **Order Pipeline Management**: Admin capability to update order status (Pending → Processing → Shipped → Delivered).

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **AI / LLM**: [Google Gemini API (`@google/genai`)](https://aistudio.google.com/)
- **Icons & Motion**: [Lucide React](https://lucide.dev/), [Framer Motion](https://motion.dev/)
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **Forms & Validation**: React Hook Form with Zod (`@hookform/resolvers`)
- **Effects**: `canvas-confetti` for purchase celebratory animations
- **Deployment**: [Vercel](https://vercel.com/) (Serverless Next.js engine)

---

## 🚀 Production Deployment (Vercel)

### Live Application Links
- **Production Site**: [https://z-shop-online.vercel.app](https://z-shop-online.vercel.app)
- **Vercel Console**: [https://vercel.com/razikuljoni/z-shop](https://vercel.com/razikuljoni/z-shop)

### Vercel Configuration & Fixes
To prevent Vercel connection timeouts (`ERR_CONNECTION_TIMED_OUT`) and blank page issues:
1. **Next.js Output**: Do NOT set `output: 'standalone'` in `next.config.ts`. Vercel automatically manages Next.js serverless functions natively.
2. **Environment Variables**: In Vercel Project Settings > Environment Variables, add:
   - `GEMINI_API_KEY`: Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).
   - `APP_URL`: `https://z-shop-online.vercel.app`
   - `NEXT_PUBLIC_APP_URL`: `https://z-shop-online.vercel.app`
3. **Build Settings**: Framework: `Next.js`, Build Command: `pnpm build`, Output Directory: `.next`.

---

## ⚡ Quick Start & Local Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `pnpm` (recommended) or `npm` / `yarn` / `bun`

### 1. Clone Repository

```bash
git clone https://github.com/razikuljoni/z-shop.git
cd z-shop
```

### 2. Install Dependencies

Using **pnpm** (preferred):
```bash
pnpm install
```

Or using **npm**:
```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to create `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and configure your API key and APP URL:

```env
GEMINI_API_KEY="your_actual_gemini_api_key"
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Available Scripts

| Command (pnpm) | Command (npm) | Description |
|---|---|---|
| `pnpm dev` | `npm run dev` | Starts Next.js development server at `localhost:3000` |
| `pnpm build` | `npm run build` | Builds optimized production distribution |
| `pnpm start` | `npm run start` | Runs production server after build |
| `pnpm lint` | `npm run lint` | Runs ESLint type checks and code quality rules |
| `pnpm clean` | `npm run clean` | Cleans `.next` build cache |

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 👤 Author & Support

Developed with ❤️ by **MD Razikul Islam Joni**
- GitHub: [@razikuljoni](https://github.com/razikuljoni)
- Repository: [github.com/razikuljoni/z-shop](https://github.com/razikuljoni/z-shop)
- Live Production: [https://z-shop-online.vercel.app](https://z-shop-online.vercel.app)
