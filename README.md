## Shri Mahaveer Surgical – Inventory & Sales Management PWA

This repository contains a **real-world digital transformation project** for *Shri Mahaveer Surgical*, an orthopedic equipment manufacturer.  
It replaces ad‑hoc WhatsApp messages, paper registers, and spreadsheet‑driven stock tracking with a **cloud‑synced Progressive Web App (PWA)** that runs on desktop and mobile, enabling factory staff and admins to manage **inventory, production orders, workers, and sales** in one place.  
The system is built as a modern **React + TypeScript + Firebase** application with real‑time Firestore listeners, role‑based access control, and an app‑shell service worker for offline‑first behaviour tailored to a manufacturing floor with intermittent connectivity.

---

## Tech Stack

**Core technologies used in this project:**

| Area            | Technology / Service                         | Notes                                                                 |
|-----------------|-----------------------------------------------|-----------------------------------------------------------------------|
| Frontend        | **React 19**, **TypeScript**                 | SPA with lazy‑loaded routes and Suspense‑based loading states         |
| Build Tooling   | **Vite 7**                                   | Fast dev server and production bundling                               |
| Routing         | **react-router-dom 7**                       | Nested routes, role‑based route guards (`AdminRoute`, `WorkerRoute`)  |
| Styling / UI    | **Tailwind CSS 4**, custom UI components     | Responsive layouts, cards, modals, dropdowns, buttons                 |
| Icons           | **@heroicons/react**                         | Consistent iconography for actions/status                             |
| Backend         | **Firebase** (Auth + Firestore)              | Managed authentication, real‑time data, and transactions              |
| Hosting         | **Firebase Hosting**                         | Configured via `firebase.json`, serves the built PWA from `dist`      |
| PWA Layer       | Custom **service worker** + web manifest     | App‑shell caching and installable experience on desktop/mobile        |

---

## Key Business Features

- **Real‑Time Inventory & Stock Levels**
  - Tracks **raw materials**, **ready belts/finished goods**, and **production orders** via collections such as `rawMaterials`, `readyBelts`, and `finishedGoods`.
  - Uses `useFirestoreCollection` to subscribe to live Firestore updates so admins see **current stock**, **reorder points**, and **low‑stock alerts** reflected immediately on screens like the `Dashboard`.

- **Sales Orders & Customer Management**
  - End‑to‑end flow for **sales orders**, with typed models in `useSalesOrders` for items, quantities, pricing, and payment breakdown (`totalAmount`, `paidAmount`, `dueAmount`).
  - Dedicated pages for **Customers**, **Customer Detail**, and **Sales Orders**, allowing the business to track who owes what (`pendingAmount` on customer documents) and maintain a clear receivables picture.

- **Production & Worker Operations**
  - Screens and forms to manage **Workers**, **Production Orders**, and **inventory of ready belts**, aligning production planning with current stock.
  - Separate **Admin** and **Contract Worker** dashboards ensure workers see only the flows they need, while admins retain full control.

- **Role‑Based Access & Approval Workflow**
  - Authentication is powered by Firebase Auth (`useAuth`, `AuthContext`), and worker profiles are stored in the `workers` collection with roles like `Admin`, `Contract`, and `Pending`.
  - `AdminRoute`, `WorkerRoute`, and `ProtectedRoute` components enforce **role‑aware routing**: pending or unclassified users are routed to diagnostic or approval flows, and only approved admins can access the full admin panel.

- **Operational Dashboard & Business Metrics**
  - The `Dashboard` aggregates **open sales orders**, **pending customer payments**, **low‑stock raw materials**, **payouts due to workers**, and **inventory of ready belts** into a single, at‑a‑glance view.
  - This gives the owner a **real‑time control panel** for production, cash‑flow, and stock health without opening spreadsheets.

---

## Technical Architecture

The project is a **client‑side React SPA** that talks directly to **Firebase Auth** and **Cloud Firestore**. The frontend is organized into clear domains to make the codebase approachable for collaborators and recruiters:

- **Entry & Composition**
  - `main.tsx` bootstraps React in `StrictMode`, wraps the application in `BrowserRouter`, and mounts `App`.
  - `App.tsx` defines the route tree using `react-router-dom`, lazy‑loading all top‑level pages (auth flows, admin dashboard, inventory and order screens, worker dashboard, and diagnostics) behind appropriate route guards.

- **Domain‑Driven Pages**
  - `src/pages/admin/**` contains admin views:
    - `Dashboard`, `Customers`, `CustomerDetail`, `Workers`
    - Inventory views under `inventory/RawMaterials` and `inventory/ReadyBelts`
    - Order views under `orders/ProductionOrders` and `orders/SalesOrders`
  - `src/pages/auth/**` implements `Login`, `Signup`, and `PendingApproval`.
  - `src/pages/worker/WorkerDashboard.tsx` provides a focused interface for contract workers.

- **Shared Layout & UI Components**
  - Layout wrappers such as `AdminLayout`, `WorkerLayout`, `Sidebar`, `Topbar`, and `FormLayout` coordinate navigation and responsive structure.
  - Reusable UI elements (`Card`, `Modal`, `FormModal`, `FloatingAddButton`, `PrimaryButton`, `CancelButton`, `SearchableDropdown`, `Loading`) encapsulate cross‑cutting presentation patterns, making the screens both **consistent** and **easy to extend**.

- **State & Data Access Layer**
  - `contexts/AuthContext.tsx` centralizes authentication and worker profile state, listening to both Auth and the `workers` collection via `onSnapshot`. All routes consume this context for access checks and personalization.
  - `hooks/firestore/useFirestoreCollection.ts` provides a **generic, real‑time collection hook** with optional ordering and query constraints, returning `{ data, loading, error }`.
  - `hooks/firestore/useFirestore.ts` abstracts single‑document operations (`add`, `update`, `remove`), automatically stamping `createdAt`/`updatedAt` via `serverTimestamp`.
  - `hooks/firestore/useFirestoreTransaction.ts` wraps Firestore’s transaction API into a simple `run` helper, used by domain hooks to safely coordinate multi‑document updates.
  - `hooks/domain/**` exposes **business‑level hooks** (`useRawMaterials`, `useSalesOrders`, `useCustomers`, `useWorkers`, `useProductionOrders`, `useReadyBelts`) that connect the UI directly to Firestore collections with strongly typed shapes.

- **Firebase Backend & Configuration**
  - `src/firebase/firebaseConfig.ts` initializes the Firebase app and re‑exports the pieces used across the app (`auth`, `db`, and key auth helpers).
  - `firebase.json` configures Firebase Hosting to serve the built app from `dist` and rewrites all routes to `index.html`, allowing deep‑linking for all app routes.

---

## Technical Challenges & Solutions

### PWA & Offline Capability

The target environment is a **factory floor and small office** where internet connectivity can be unreliable, so the app is designed to remain usable even when the network drops.  
A custom `service-worker.js` implements an **app‑shell caching strategy**: on `install`, it opens a versioned cache (`mahaveer-cache-v1`) and pre‑caches core assets like `/`, `/index.html`, and `/favicon.ico`. On every `fetch` event it first tries to serve a cached response (`caches.match(event.request)`) and only falls back to `fetch` if the resource is not in cache.  
This gives staff a **stable UI that still loads and navigates** even if Firestore calls are temporarily unavailable, which is critical in a medical manufacturing context where operators need to keep working and record data as soon as connectivity resumes.

Beyond the service worker, the routing and UI have been kept **resilient to slow or flaky networks**. Lazy‑loaded routes and `Suspense` boundaries show clear loading states (`Loading` component) and avoid blank screens while waiting for remote data. When combined with Firestore’s local caching, the user experience feels fluid even when latency spikes.

### Data Integrity in Inventory & Sales Flows

Maintaining **accurate inventory counts and financial balances** is central to this project. Firestore is used not just as a storage system but as a **transactional consistency layer**.  
The `useSalesOrders` hook wires in `useFirestoreTransaction` to implement `deliverSalesOrder`. This function wraps a multi‑step update in a single Firestore transaction: it reads the current sales order, all referenced `readyBelts` documents, and the relevant `customers` document, then atomically:

- Decrements `currentStock` for each finished good based on the quantities in the order.
- Increments the customer’s `pendingAmount` by the order’s `totalAmount`.
- Marks the sales order’s `status` as `'delivered'` and updates `updatedAt` with `serverTimestamp()`.

By performing all of this inside a Firestore transaction, the system guarantees that **no partial updates** occur: stock, customer balances, and order status always move together or not at all, even under concurrent access. For simple CRUD flows, the generic `useFirestore` hook still enforces consistent timestamping and error logging, while `useFirestoreCollection` provides **live, read‑optimized views** for dashboards and listing screens.

### PDF / Document Logic (Current State & Extension Strategy)

Sales orders and customer data are modelled in a way that makes them **directly consumable for price lists, invoices, or delivery challans**, even though this project currently stops short of generating binary PDF files in the frontend. The `SalesOrder` interface in `useSalesOrders` captures all key invoice fields—customer identity, line items (type, size, quantity, price), totals, and payment status—while customer and worker collections maintain contact details and pending amounts.  
In practice, this means the app already has a **clean, typed data layer** that can back PDFs or printed documents without reshaping data. A typical next step (left intentionally out of this repo to keep the footprint small) would be to feed this structured order data into a PDF library (e.g., in a separate microservice or a client‑side generator) to produce branded, professional documents for pricing and invoicing. The current design choices (normalized collections, explicit monetary fields, and transaction‑safe updates) were made with that extensibility in mind, so document generation can be added without refactoring the core flows.

---

## Local Development Setup (macOS / zsh)

Follow these steps to run the project locally on macOS using `zsh`:

1. **Clone the repository**

   ```bash
   cd ~/code
   git clone <your-github-fork-or-origin-url>.git apnastockdev
   cd apnastockdev/apnastore
   ```

2. **Install Node.js dependencies**

   Ensure you have a recent LTS version of Node.js installed (via `nvm` or `brew`), then run:

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `apnastore` folder (same level as `package.json`) and provide your Firebase project credentials:

   ```bash
   # .env
   VITE_API_KEY=your_firebase_api_key
   VITE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_project.appspot.com
   VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_APP_ID=your_app_id
   VITE_MEASUREMENT_ID=your_measurement_id
   ```

   These values are read in `src/firebase/firebaseConfig.ts` to initialize the Firebase app.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open the printed `http://localhost:5173` (or similar) URL in your browser. The app supports installation as a PWA; in Chrome you can use the **“Install app”** prompt once the service worker and manifest are detected.

5. **Build for production (optional)**

   ```bash
   npm run build
   npm run preview
   ```

   This compiles the app into the `dist` folder. The `firebase.json` file is already configured to host this directory on Firebase Hosting.

---

## What This Project Demonstrates (For Recruiters)

- **End‑to‑End Ownership**: From requirements of a real orthopedic equipment manufacturer to implementation of role‑based access, inventory flows, and a PWA deployment pipeline.
- **Pragmatic Architecture**: Clean separation between UI, domain hooks, and Firestore access helpers; heavy use of TypeScript for safety while staying ergonomic for small teams.
- **Production‑Ready Concerns**: Handling intermittent connectivity with a custom service worker, enforcing data integrity with Firestore transactions, and designing collections and types with future document/PDF generation in mind.

---

## License

Copyright © 2025 Akhilesh Singh. All rights reserved.  
This project is a proprietary business solution developed for Shri Mahaveer Surgical. Unauthorized copying, distribution, or commercial use of any part of this repository is strictly prohibited. Access is granted for portfolio review and recruitment evaluation purposes only.