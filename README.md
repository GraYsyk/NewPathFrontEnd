# NewPath — Frontend

Storefront for NewPath streetwear e-commerce platform, built with React + Vite.

## Tech Stack

- **React 18** + **Vite**
- **TypeScript** — key components typed
- **React Router** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Recharts** — admin dashboard charts
- **Swiper** — product image gallery
- **Stripe.js** — checkout redirect

## Features

- Product catalog with search, sort and filters
- Product page with color/size/quantity selection
- Cart (guest + authenticated) with promocode support
- Stripe Checkout integration
- Google OAuth2 + JWT authentication
- Account page with order history
- Responsive design (mobile-first)
- Admin panel:
  - Dashboard with income, growth and order stats
  - Order management with status updates
  - Collection CRUD with image upload (Cloudinary)
  - Scheduled collection drops
  - Promocode management

## Getting Started

```bash
npm install
npm run dev
```

## Environment

Requires backend running on `http://localhost:8080`.

Vite proxies `/api` requests automatically via `vite.config.ts`.

## Project Structure

```
src/
├── components/
│   ├── Admin/        # Admin panel components
│   ├── Cart/         # Cart context and modal
│   ├── ItemPage/     # Product image gallery
│   ├── Layout/       # Header, Footer, Admin layout
│   └── Util/         # Page animations, protected routes
├── pages/
│   ├── Admin/        # Dashboard, Orders, Collection, Special
│   └── ...           # Catalog, ItemPage, Account, etc.
├── types/
│   └── index.ts      # Shared TypeScript interfaces
└── styles/           # CSS modules
```
