# BankAuctions.ai 🏛️

**BankAuctions.ai** is an institutional-grade bank auction discovery, title verification, and auction intelligence portal under the SARFAESI Act, DRT, and IBC frameworks across India.

---

## 🌟 Key Features

* **Multi-Role Workspaces**:
  * **Buyer Portal**: Comprehensive auction discovery across Flats, Houses, Plots, Shops, Offices, Warehouses, and Plant/Machinery.
  * **Checker Portal**: Verification queue to review newspaper public notices against legal registry filings.
  * **Engineer Portal**: Field site inspection tools, GPS location tagging, road width audits, and structural photographs.
  * **Admin Panel**: Regulatory audit logs, user management, and platform analytics.
* **Smart Valuation & Ranking**:
  * **AI Rank**: Multivariable scoring combining reserve price vs. guideline value, physical possession order status, and litigation search.
  * **SARFAESI 10-Point Pre-Bid Audit**: Verification checkpoints for Section 13(2), 13(4), and Section 14 CMM/DM orders.
* **Tiered Intelligence Policies**:
  * Transparent public browsing for reserve prices, EMD deadlines, and asset types.
  * Gated dossier unlocks for lender officer contacts, original notice PDFs, civil engineer ground inspection reports, and 30-year Encumbrance Certificates.
* **Confidential Advocate Bridge**:
  * Direct encrypted telephone and chat bridge with State Bar Council empanelled DRT practitioners.
* **Interactive Tools**:
  * EMD & Cashflow Calculator (10% EMD, 15% day-of-sale deposit, 75% balance, stamp duty & registry charges).
  * WhatsApp Auction Alerts setup.
  * DRT Stay Order Radar.
  * Multi-property side-by-side comparison dock & CSV shortlist exporter.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM
* **Backend**: Node.js, Express.js REST API (`/api/v1`)
* **Database & ORM**: PostgreSQL, Prisma ORM with In-Memory fallback store
* **Design Aesthetic**: Institutional obsidian/midnight dark theme (`#070b16` / `#0b101e`)

---

## 🚀 Quick Start

### 1. Prerequisites
* Node.js v18+ 
* npm / pnpm

### 2. Backend Setup
```bash
cd bankauctions-rebuild/backend
npm install
node src/server.js
```
The backend API starts on `http://localhost:5000/api/v1`.

### 3. Frontend Setup
```bash
cd bankauctions-rebuild/frontend
npm install
npm run dev
```
The web application runs on `http://localhost:5173`.

---

## 📄 License
Proprietary & Confidential. All rights reserved.
