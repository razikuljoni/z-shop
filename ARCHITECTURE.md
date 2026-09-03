# Z Shop — System Architecture & Production Documentation

This document outlines the architecture, data models, state flows, API specifications, and production readiness guidelines for the **Z Shop** e-commerce platform.

---

## 🌐 Live Production Links
- **Production Site**: [https://z-shop-online.vercel.app](https://z-shop-online.vercel.app)
- **Vercel Dashboard**: [https://vercel.com/razikuljoni/z-shop](https://vercel.com/razikuljoni/z-shop)
- **GitHub Repository**: [https://github.com/razikuljoni/z-shop](https://github.com/razikuljoni/z-shop)

---

## 🏗️ Architecture Overview

Z Shop follows modern Next.js 15 App Router paradigms, utilizing client-side React 19 state management for seamless real-time UI updates alongside serverless API handlers.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                               Client UI                                │
│  (React 19 / Tailwind v4 / Framer Motion / Lucide Icons / Recharts)   │
└──────────────┬───────────────────┬──────────────────────┬──────────────┘
               │                   │                      │
    State & Actions     Cart & Checkout Context      AI Chat UI
               │                   │                      │
               ▼                   ▼                      ▼
┌─────────────────────────┐  ┌───────────┐      ┌─────────────────────────┐
│ Local State / Storage   │  │ Mock Data │      │ Next.js Serverless API  │
│ Currency, Auth, Roles   │  │ Data Store│      │ /api/gemini/advisor     │
└─────────────────────────┘  └───────────┘      └──────────┬──────────────┘
                                                           │
                                                @google/genai SDK
                                                           │
                                                           ▼
                                                ┌─────────────────────┐
                                                │ Google Gemini API   │
                                                └─────────────────────┘
```

---

## 🧩 Core Data Models

Defined in `types/ecommerce.ts`:

- **Product**: `id`, `name`, `description`, `price`, `originalPrice`, `category`, `image`, `rating`, `reviewCount`, `stock`, `isFeatured`, `isBestSeller`, `tags`, `specs`.
- **CartItem**: Extends `Product` with `quantity` and selected variations.
- **Order**: `id`, `date`, `items`, `totalAmount`, `status` (`pending` | `processing` | `shipped` | `delivered`), `shippingAddress`, `trackingNumber`, `estimatedDelivery`, `currentLocation`.
- **User**: `id`, `name`, `email`, `role` (`customer` | `seller` | `admin`), `avatar`, `twoFactorEnabled`, `currencyPreference`.
- **Currency**: Supported symbols and conversion rates (`USD`, `EUR`, `GBP`, `BDT`, `JPY`).

---

## 📡 API Endpoints

### `POST /api/gemini/advisor`

Communicates with Google Gemini API to generate personalized product recommendations and answer customer queries.

- **Request Body**:
  ```json
  {
    "prompt": "Recommend a laptop under $1000 for coding and light gaming.",
    "context": { "category": "Electronics", "currency": "USD" }
  }
  ```
- **Response**:
  ```json
  {
    "reply": "Based on your criteria, here are top picks...",
    "recommendedProductIds": ["prod_001", "prod_004"]
  }
  ```

---

## 🛡️ Production Readiness Checklist

Before pushing to production or initiating deployment pipelines:

- [x] **TypeScript Validation**: `pnpm build` checks type validity across all components and API routes.
- [x] **Linting**: ESLint flat config passing cleanly with zero errors.
- [x] **React Doctor Score**: 100/100 (0 errors, 0 warnings).
- [x] **Vercel Engine Config**: `vercel.json` and `next.config.ts` optimized for serverless edge execution (no standalone collision).
- [x] **Environment Variables**: `.env.example` provided with instructions for `GEMINI_API_KEY`, `APP_URL`, and `NEXT_PUBLIC_APP_URL`.
- [x] **Asset Bundling**: Next.js automatic image and static page optimization enabled.
- [x] **Repository Governance**: Clean `.gitignore` masking `.env*`, build caches, and developer tooling logs.
- [x] **Licensing**: Standard open-source MIT License attached.

---

## 🚀 Deployment Instructions (Vercel)

### Environment Setup Checklist
1. Select Node.js 18+ / 20+ in Vercel project settings.
2. Add environment variables in Vercel host settings:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
   - `APP_URL`: `https://z-shop-online.vercel.app`
   - `NEXT_PUBLIC_APP_URL`: `https://z-shop-online.vercel.app`
3. Set build command: `pnpm build`.
4. Set output directory: `.next`.
