# BankAuctions.ai — Enterprise Commercial Platform Rebuild

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**BankAuctions.ai** is an enterprise-grade discovery, verification, on-site valuation, and management platform for commercial and residential bank foreclosures under India's **SARFAESI Act, 2002** and Debt Recovery Tribunal (**DRT**) jurisdictions.

Rebuilt from the ground up to replace the legacy Spring Boot architecture with a high-performance **Node.js/Express + PostgreSQL (Prisma)** backend and a **Vite + React.js + Tailwind CSS** frontend, the platform coordinates four distinct role-based operational surfaces over a unified database and API.

---

## 🏛️ Platform Architecture & 4-Panel Ecosystem

```
                                  ┌───────────────────────────────┐
                                  │      PostgreSQL Database      │
                                  │ (Prisma ORM + JSONB Schema)   │
                                  └──────────────┬────────────────┘
                                                 │
                                  ┌──────────────┴────────────────┐
                                  │       Express REST API        │
                                  │   (/api/v1 - JWT / RBAC /     │
                                  │    Audit / Rate Limiters)     │
                                  └──────────────┬────────────────┘
                                                 │
       ┌──────────────────────────┬──────────────┴───────────┬──────────────────────────┐
       │                          │                          │                          │
┌──────▼──────┐            ┌──────▼──────┐            ┌──────▼──────┐            ┌──────▼──────┐
│ Buyer Panel │            │Checker Panel│            │Engineer Pane│            │ Admin Panel │
│ (Discovery, │            │ (Exception  │            │  (On-Site   │            │(Governance, │
│  Watchlist, │            │  Audit Desk,│            │ Inspections,│            │ Dual-Appr,  │
│ AI Ranking) │            │ Side-by-Side│            │ Geotag/GPS) │            │ Analytics)  │
└─────────────┘            └─────────────┘            └─────────────┘            └─────────────┘
```

### 1. Buyer Panel (Public Discovery & Investor Portal)
- **Routes:** `/`, `/search`, `/category/:slug`, `/lot/:id`, `/pricing`, `/ai-rank`, `/guides`, `/buyer/dashboard`, `/buyer/saved`, `/buyer/preferences`
- **Capabilities:**
  - Advanced multi-filter search: State, City, Locality, Reserve Price slider, Bank, Asset Category, Possession Type (Physical vs. Symbolic).
  - Proprietary **AI Rank (1–100)** grading: Discount-to-market algorithms, legal encumbrance checks, road width, and proximity scores.
  - Interactive **Schematic Map View** with dynamic reserve price pins.
  - Credit-based property unlock system (Authorized Officer contact, Tender Document, CMM Warrant status).
  - Saved watchlist and customized search notifications.

### 2. Checker Panel (Data Quality & Exception Audit Desk)
- **Routes:** `/checker`, `/checker/queue`, `/checker/verify/:id`, `/checker/history`
- **Capabilities:**
  - Side-by-side reconciliation of OCR-ingested newspaper clippings vs. parsed database entities.
  - Highlights OCR anomalies (borrower name discrepancies, reserve price mismatches, missing survey numbers).
  - Inline field corrections, rejection desk with auditable remarks, and one-click quality certification.
  - Real-time SLA tracking enforcing zero-unverified publication policies.

### 3. Engineer Panel (Field Inspections & Valuation)
- **Routes:** `/engineer`, `/engineer/assignments`, `/engineer/inspect/:id`, `/engineer/history`
- **Capabilities:**
  - Mobile-first inspection form designed for field tablets and smartphones.
  - Browser Geolocation API capture enforcing **<50m coordinate verification** against asset registrar records.
  - Multi-photo capture with client-side image compression and photo type classification (Frontage, Approach Road, Interior, Structural Defect, Encroachment).
  - Structural condition assessment, current occupancy status (Vacant, Borrower Occupied, Illegal Tenant), and micro-market guideline rate estimation.

### 4. Admin Panel (Central Operations, Dual Approval & BI)
- **Routes:** `/admin`, `/admin/auctions`, `/admin/imports`, `/admin/inspections`, `/admin/buyers`, `/admin/staff`, `/admin/checkers`, `/admin/engineers`, `/admin/analytics`, `/admin/audit-logs`, `/admin/settings`
- **Capabilities:**
  - **Batch Ingestion Pipeline:** CSV/JSON import parser with preview, staging, and automatic exception routing.
  - **Dual Approval Desk:** Sign-off on checker-audited notices and field engineer valuation reports prior to public release.
  - **Buyer Directory & Entitlements:** Credit gifting, membership tier management (`FREE`, `PRO`, `ENTERPRISE`), and account suspension.
  - **Internal Staff Directory:** RBAC account provisioning (`CHECKER`, `ENGINEER`, `ADMIN`) and jurisdiction assignments.
  - **Market Intelligence & Telemetry:** Dynamic Recharts visualizations for monthly inventory velocity, asset class distribution, ticket size brackets, and top lending banks.
  - **Append-Only Audit Ledger:** Cryptographic trace of every login, edit, approval, and publication decision with actor identity and timestamp.

---

## 🔑 Demo Access Credentials

The database is seeded with authentic accounts across all four panels:

| Role | Email Address | Password | Permissions & Workspace |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@bankauctions.ai` | `Admin@123` | Executive access across all modules (`/admin`) |
| **Data Quality Checker** | `checker@bankauctions.ai` | `Checker@123` | Notice exception queue & corrections (`/checker`) |
| **Field Engineer** | `engineer@bankauctions.ai` | `Engineer@123` | Assigned site visits & mobile inspection (`/engineer`) |
| **Investor / Buyer** | `buyer@bankauctions.ai` | `Buyer@123` | Discovery, unlocked contacts, watchlist (`/buyer`) |

---

## 📁 Repository Structure

```text
bankauctions-rebuild/
├── frontend/                     # React.js 18 + Vite 5 SPA
│   ├── public/                   # Static assets & authentic auction images
│   ├── src/
│   │   ├── app/                  # App shell, router with role guards, providers
│   │   │   ├── App.jsx
│   │   │   ├── routes.jsx
│   │   │   └── providers.jsx
│   │   ├── layouts/              # 5 Role-based layouts
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── BuyerLayout.jsx
│   │   │   ├── CheckerLayout.jsx
│   │   │   ├── EngineerLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── panels/               # 4 Isolated Panels
│   │   │   ├── buyer/pages/      # 10 Discovery & Investor pages
│   │   │   ├── checker/pages/    # 4 Exception verification pages
│   │   │   ├── engineer/pages/   # 4 Field inspection pages
│   │   │   └── admin/pages/      # 11 Operational governance pages
│   │   ├── components/           # Shared accessible UI components
│   │   │   ├── common/           # GlassCard, Button, Modal, SpecularBadge, StatCard
│   │   │   ├── navigation/       # Navbar, Footer, CitySelector, StaffPortalModal
│   │   │   └── properties/       # PropertyCard, AiRankPill, CategoryBadge, SchematicMapView
│   │   ├── contexts/             # AuthContext, CityContext
│   │   ├── services/             # Axios API client (/api/v1)
│   │   └── styles/               # Bespoke glassmorphism CSS & Tailwind directives
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # Node.js + Express REST API (ES Modules)
│   ├── src/
│   │   ├── config/               # App configuration & logger
│   │   ├── middleware/           # JWT auth, RBAC guards, rate limiter, error handler
│   │   ├── modules/              # Modular controller & service domain layers
│   │   │   ├── auth/             # Login, register, session refresh, role claims
│   │   │   ├── auctions/         # Search, filters, lot details, unlock contacts
│   │   │   ├── categories/       # Category metadata & count aggregations
│   │   │   ├── verification/     # Checker queue, exception reviews, history
│   │   │   ├── inspections/      # Engineer site visits, GPS & photo submissions
│   │   │   ├── admin/            # Batch imports, publish, staff & buyer management
│   │   │   └── users/            # User profile & saved lots
│   │   ├── services/             # Resilient DB service (Prisma + In-Memory Fallback)
│   │   ├── app.js                # Express app setup & CORS
│   │   └── server.js             # HTTP server entrypoint
│   ├── prisma/
│   │   ├── schema.prisma         # Relational + JSONB PostgreSQL schema
│   │   └── seed.js               # Comprehensive authentic database seeder
│   ├── test/
│   │   └── api.test.js           # Automated test suite (12 subtests covering full lifecycle)
│   └── package.json
│
├── shared/                       # Cross-tier constants and Zod validation schemas
│   ├── constants/                # roles.js, auctionStatus.js, categories.js
│   └── schemas/                  # auctionSchemas.js
│
├── docs/                         # Specifications & migration guides
│   ├── architecture/             # Architecture blueprint & decisions
│   └── prototype-mapping/        # 32 prototype HTML to component matrix
│
├── docker-compose.yml            # Production PostgreSQL 16 container setup
├── .env.example
└── README.md
```

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Optional: **Docker** & **Docker Compose** (for running PostgreSQL container)

### Step 1: Install Dependencies

```bash
# Shared library
cd bankauctions-rebuild/shared
npm install

# Backend
cd ../backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Configure Environment

Both frontend and backend are pre-configured with default local environment variables.

To inspect or customize backend configuration, create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super-secure-jwt-secret-key-bankauctions-2026
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://bankauctions:bankauctions123@localhost:5432/bankauctions_db?schema=public
```

> **Enterprise Resilient Storage:** If PostgreSQL is running on port 5432, Prisma seamlessly connects to PostgreSQL. If PostgreSQL is offline, the backend's resilient database service (`backend/src/services/db.js`) automatically falls back to an in-memory, fully seeded Prisma-compatible adapter, allowing instant development and zero setup blockage!

### Step 3: Run Database Migrations & Seed (When PostgreSQL is running)

```bash
cd bankauctions-rebuild/backend
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### Step 4: Run Automated Tests

Execute the 12-subtest test suite verifying the end-to-end data lifecycle:

```bash
cd bankauctions-rebuild/backend
npm test
```

### Step 5: Start Development Servers

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd bankauctions-rebuild/backend
npm run dev
# Backend API boots on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd bankauctions-rebuild/frontend
npm run dev
# Frontend boots on http://localhost:5173
```

Visit **http://localhost:5173** in your web browser.

---

## 🧪 Verified Test Suite

The automated test suite (`backend/test/api.test.js`) validates 12 end-to-end scenarios:
1. `GET /api/v1/health` — API health check and server uptime.
2. `POST /api/v1/auth/login` (Admin) — Validates Admin credentials and JWT role token.
3. `POST /api/v1/auth/login` (Checker) — Validates Checker credentials.
4. `POST /api/v1/auth/login` (Engineer) — Validates Field Engineer credentials.
5. `POST /api/v1/auth/login` (Buyer) — Validates Investor Buyer credentials.
6. `GET /api/v1/auctions?city=chennai` — Public search filtering only published lots.
7. `GET /api/v1/auctions/:id` — Property details retrieval with JSONB attributes.
8. `GET /api/v1/checker/queue` — Checker verification queue retrieval.
9. Role Guard Enforcement — Confirms Buyers cannot access Checker/Admin endpoints (403 Forbidden).
10. `GET /api/v1/engineer/assignments` — Engineer assigned site inspections retrieval.
11. `GET /api/v1/admin/overview` — Real-time database KPI aggregation for executives.
12. **Complete Lifecycle Journey:** Batch Import -> Checker Exception Audit -> Admin Sign-off & Publish -> Public Buyer Discovery.

---

## 🎨 Design System & Palette

BankAuctions.ai features a bespoke dark glassmorphism visual identity designed specifically for high-ticket financial discovery:

- **Deep Astral Obsidian (`#070D1F`)**: Primary canvas backdrop.
- **Deep Navy (`#0F1A34`)**: Frosted glass panel backgrounds (`rgba(15, 26, 54, 0.65)`).
- **Radiant Cyan (`#00E5FF`)**: High-priority interactive actions, search signals, and AI metrics.
- **Emerald Green (`#10B981`)**: Verified badges, positive valuations, and on-time SLAs.
- **Amber Gold (`#F59E0B`)**: Auction deadlines, countdowns, and EMD dates.
- **Imperial Purple (`#A855F7`)**: Admin governance and security privileges.

---

## 📜 Compliance & Legal Notice

BankAuctions.ai is an independent aggregator and intelligence platform tracking public auction notices issued by secured lenders under India's **Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002 (SARFAESI Act)** and the **Recovery of Debts and Bankruptcy Act, 1993 (RDB Act)**. Prospective bidders are advised to conduct independent title searches, encumbrance verification, and physical inspections prior to submitting Earnest Money Deposits (EMD).
