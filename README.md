# Z Shop — Next-Gen E-Commerce Platform & AI Shopping Assistant

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.21-4285F4?style=flat-square&logo=google-gemini)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Z Shop is a production-ready, full-stack Amazon-scale e-commerce platform built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Google Gemini AI. It combines real-time inventory management, multi-currency support, interactive live order tracking, seller admin analytics, and an integrated Gemini AI Shopping Advisor.

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

---

## 📂 Folder & File Structure

```text
z-shop/
├── app/                        # Next.js App Router root
│   ├── api/                    # Server-side API endpoints
│   │   └── gemini/
│   │       └── advisor/        # Gemini AI advisor route handler
│   ├── favicon.ico
│   ├── globals.css             # Tailwind v4 theme & global styles
│   ├── layout.tsx              # Root HTML & body wrapper
│   └── page.tsx                # Main entry application view
├── components/                 # Reusable UI React components
│   ├── AIAdvisorDrawer.tsx     # Gemini AI chat interface
│   ├── AdminDashboard.tsx      # Seller/Admin analytics & inventory
│   ├── AuthModal.tsx           # Login / Register / 2FA modal
│   ├── CartDrawer.tsx          # Cart management drawer
│   ├── CheckoutModal.tsx       # Multi-step checkout flow
│   ├── Footer.tsx              # Application footer
│   ├── HeroBanner.tsx          # Promotional carousel & hero
│   ├── LiveTrackingModal.tsx   # Live order tracking interface
│   ├── Navbar.tsx              # Header, search, currency, auth state
│   ├── NotificationCenter.tsx  # In-app notifications drawer
│   ├── OrderHistoryView.tsx    # Customer order history list
│   ├── PersonalizedAnalytics.tsx # Customer shopping insights
│   ├── ProductCard.tsx         # Individual product UI card
│   ├── ProductDetailModal.tsx  # Product details preview modal
│   └── ProductGrid.tsx         # Responsive product grid view
├── context/                    # React Context providers (State)
├── data/
│   └── mockData.ts             # Initial product, order, category dataset
├── hooks/                      # Custom React hooks
├── lib/
│   └── utils.ts                # Tailwind class merge helper (`cn`)
├── types/
│   └── ecommerce.ts            # Core TypeScript interfaces & types
├── .env.example                # Template for environment variables
├── .eslintrc.json              # ESLint configuration
├── eslint.config.mjs           # Next.js ESLint flat config
├── next.config.ts              # Next.js build & runtime configuration
├── package.json                # Project dependencies & scripts
├── pnpm-lock.yaml              # Package lockfile (pnpm)
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript compiler config
└── README.md                   # Project documentation
```

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

Open `.env.local` and add your Google Gemini API key:

```env
GEMINI_API_KEY="your_actual_gemini_api_key"
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> 💡 Get your free API key at [Google AI Studio](https://aistudio.google.com/).

### 4. Run Development Server

Using **pnpm**:
```bash
pnpm dev
```

Using **npm**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

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

## 🚀 Production Deployment

### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import your `z-shop` repository.
3. Configure Environment Variables in Vercel settings:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `APP_URL`: Production domain URL (e.g., `https://z-shop.vercel.app`)
4. Click **Deploy**. Vercel automatically detects Next.js 15 and executes `pnpm build`.

### Option B: Deploy via Docker

Create a `Dockerfile` in the root folder:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]
```

Build and run container:

```bash
docker build -t z-shop .
docker run -p 3000:3000 -e GEMINI_API_KEY="your_key" z-shop
```

---

## 📸 Screenshots & UI Preview

| View | Highlights |
|---|---|
| **Storefront & Catalog** | Hero promotional banner, category filters, responsive product grid, instant search |
| **Product Detail & Specs** | High-res imagery, stock tags, review ratings, specs list, instant cart addition |
| **AI Advisor Drawer** | Real-time chat powered by Gemini AI with custom product recommendations |
| **Checkout & Live Map** | Step-by-step payment flow, instant receipt, interactive live delivery route |
| **Admin Analytics** | Recharts revenue graphs, inventory alert dashboard, order status toggles |

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 👤 Author & Support

Developed with ❤️ by **MD Razikul Islam Joni**
- GitHub: [@razikuljoni](https://github.com/razikuljoni)
- Repository: [github.com/razikuljoni/z-shop](https://github.com/razikuljoni/z-shop)
