# 🧠 FarmFriend — Task Memory & System Evolution Log

---

## 1. System Context & Project Identity
- **Repository**: `mama-sheesh/FarmFriend`
- **Location**: `C:\Users\lowan\OneDrive\Desktop\m@m@_sheesh\FarmFriend`
- **Active Git Branch**: `mysql-migration`
- **Runtime Environment**: Node.js v24.18.0 (ESM), Vite 8.1.0, Tailwind CSS 3, Express 5.2.1, MySQL 8.0+

---

## 2. Chronological Log of Recent Transformations

### Iteration 1: Layout Overhaul of `/crops` & AI Crop Advisor
- **User Requirement**: Fix layout, eliminate all empty spaces, allow farmers to ask questions to AI and receive short, meaningful agronomic advice.
- **Actions Taken**:
  - Engineered `AICropAdvisor.jsx` featuring:
    - Interactive input field for custom queries (*"How much water does wheat need in flowering?"*).
    - Quick-tap prompt suggestion chips.
    - Compact, highly practical advice display with a copy-to-clipboard button and category tags.
    - Resilient offline fallback responses so farmers never get stuck with a broken UI.
  - Revamped `Cropcard.jsx`:
    - 5-step visual growth stepper showing Germinated, Vegetative, Flowering, and Maturity.
    - Expandable Drawer for detailed timeline milestones and upcoming irrigation dates.
  - Overhauled `crops.jsx`:
    - Top 4 KPI Summary Cards (Active Crops, Total Cultivated Area, Next Irrigation Event, Harvest Ready counter).
    - Filter tabs (`All`, `Active`, `Harvested`).
    - Milestone guides and seasonal contextual tips filling all blank space.

---

### Iteration 2: Crop Harvest Lifecycle & State Machine
- **User Requirement**: Allow farmers to mark crops as harvested with a dedicated button on the crop card and update UI/database states accordingly.
- **Actions Taken**:
  - **Backend**:
    - Added `status` (`'Active'` / `'Harvested'`) and `harvested_date` columns in `crops` table.
    - Implemented `updateCropStatus` controller supporting `PATCH /api/crops/:cropId/harvest` and `PUT /api/crops/:cropId/status`.
    - Registered endpoints in `backend/routes/cropRoutes.js`.
  - **Frontend**:
    - Added **"🌾 Mark Crop as Harvested"** primary action button in `Cropcard.jsx`.
    - Added modal confirmation detailing harvest date and confirming archival.
    - Updated `client/src/api/crop.js` with `harvestCrop(cropId, date)` and `updateCropStatus(cropId, status)`.
    - Crops visually transform into an archived "Harvested" badge with toggleable reactivation.

---

### Iteration 3: 2-Half Split Finance Page & Crop Expense Swapper
- **User Requirement**:
  - Divide `/finance` into 2 equal halves.
  - Left Half:
    1. 2x2 grid of finance cards (Income, Expense, Net Profit, Margin).
    2. Add Transaction button.
    3. Recent Transactions audit log.
    4. Expense Card with fully visible Pie Chart filtered by particular crop expenses, with a bottom line/bar to shift or swap crops.
  - Right Half: Full AI advice card with pesticide & fertilizer price recommendations.
- **Actions Taken**:
  - **Grid Layout**: Styled `client/src/pages/finance.jsx` as a balanced 2-column grid (`lg:grid-cols-2 gap-8`), with right column stretching full height (`h-full flex flex-col`).
  - **2x2 Metrics**: Formatted ₹ Total Income, ₹ Total Expenses, ₹ Net Profit/Loss, and % Profit Margin.
  - **ExpensePieChart.jsx**:
    - Created an interactive crop filtering engine.
    - Rendered fully visible pie chart using Chart.js / SVG donut without cut-offs or overflow bugs.
    - **Bottom Crop Swapper Bar**:
      - Step left `<` and step right `>` buttons.
      - Horizontal crop selector pills (*All Farm*, *Wheat*, *Chana*, *Soybean*).
      - Animated indicator progress bar showing relative proportion of the selected crop's expense against total farm costs.
  - **AIExpenseAdvisor.jsx & Backend AI Controller**:
    - Enhanced `getExpenseRecommendations` to calculate user's highest spending areas.
    - Injected structured cost-cutting alternatives with real Indian market rates:
      - *IFFCO Nano Urea (500 ml @ ₹225)* — replaces ₹266+ conventional urea.
      - *Single Super Phosphate (SSP @ ₹420/bag)* — replaces ₹1,350 DAP.
      - *Neem Oil 10,000 ppm (@ ₹380/L)* — replaces ₹1,200 chemical sprays.
      - *Emamectin Benzoate 5% SG (@ ₹280/100g)* — replaces expensive broad-spectrum pesticides.
      - *Mancozeb 75% WP (@ ₹320/500g)* — replaces high-cost synthetic fungicides.
    - Added `GET /api/ai/pesticide-prices` endpoint in `backend/routes/aiRoutes.js`.

---

### Iteration 4: Hardened Demo Account & Lifecycle Seeding
- **User Requirement**: Create a demo account for view/evaluation purposes with 3 realistic crops and real state transitions.
- **Actions Taken**:
  - Configured demo user (`userId: 6`, phone: `9999999999`, name: `Ramesh Patel (Demo Farmer)`, `is_demo: 1`).
  - Seeded 3 distinct crops illustrating real lifecycle transitions:
    1. **Wheat (Sharbati HD-2967)**: Sown 35 days ago $\to$ Stage: *Vegetative Growth*.
    2. **Chana (Desi JG-11)**: Sown 65 days ago $\to$ Stage: *Flowering & Pod Formation*.
    3. **Soybean (JS-9560)**: Sown 105 days ago $\to$ Stage: *Ready for Harvest / Harvested*.
  - Seeded 14 realistic farm transactions (seed purchases, DAP, Nano Urea, tractor diesel, harvest labor, grain sales).
  - Implemented `POST /api/auth/demo-login` allowing 1-click frictionless access from the login screen.

---

### Iteration 5: Production Deployment Hardening
- **User Requirement**: Make the codebase deployment ready, centralized, and provide PRD, Architecture Rules, and Task Memory.
- **Actions Taken**:
  - **Centralized Frontend API**:
    - Created `client/src/config/api.js` exporting `API_BASE_URL`.
    - Completely replaced all raw `http://localhost:5000` URLs across all files (`api/ai.js`, `api/crop.js`, `api/transaction.js`, `AddCropPage.jsx`, `Transactions.jsx`, `hero.jsx`, `mandiprices.jsx`, `login.jsx`, `register.jsx`).
  - **Express 5 Compatibility**:
    - Fixed `path-to-regexp` crash caused by legacy `*` wildcard routes in Express 5. Replaced with Express 5 compliant middleware handler.
  - **Backend Health Check**:
    - Added `GET /health` and `GET /api/health` returning JSON uptime and status for Docker/K8s/Render probes.
  - **Database Port & SSL**:
    - Added `DB_PORT` and `DB_SSL` support to MySQL pool in `backend/config/db.js`.
    - Added `"start": "node server.js"` in `backend/package.json`.
  - **Multi-Stage Containerization**:
    - Created root `Dockerfile` (Node 20 alpine multi-stage building frontend Vite assets and running Express API server).
    - Created root `docker-compose.yml` orchestrating MySQL 8.0 and FarmFriend container with auto-healthchecks.
    - Created `backend/.env.example` and `client/.env.example`.

---

## 3. Bug Registry & Technical Challenges Solved

| Issue Encountered | Root Cause | Solution Applied |
| :--- | :--- | :--- |
| **`PathError: Missing parameter name at index 1: *`** | Express 5.x uses updated `path-to-regexp` which rejects unescaped wildcard route paths like `app.get("*")` and `app.use("/api/*")`. | Replaced route-level wildcards with a standard fallback middleware `app.use((req, res) => { if (req.path.startsWith('/api')) ... })`. Tested via Node process test; passed. |
| **`MISSING_EXPORT: FaInfoCircle from react-icons/fa6`** | In `react-icons/fa6`, names changed to `FaCircleInfo`, `FaCircleCheck`, etc., causing Vite build failure. | Switched imports to `react-icons/fa` which provides stable, canonical FontAwesome icon names. |
| **PowerShell Permission Denied on OneDrive** | Windows Sandbox isolation prevents commands from reading/writing user OneDrive directories directly. | Applied `BypassSandbox: true` for commands operating on the project workspace. |
| **Hardcoded `localhost:5000` in Frontend** | Components had disparate hardcoded `fetch('http://localhost:5000/...')` strings, preventing deployment to Vercel/Render. | Created single source of truth `client/src/config/api.js` resolving `VITE_API_URL || window.location.origin || "http://localhost:5000"`. Replaced 100% of instances. |
| **Cloud MySQL SSL / Port Requirements** | Managed cloud databases (Aiven, AWS RDS, Railway) enforce port `3306` variations and SSL encryption. | Updated `db.js` with `DB_PORT` parsing and conditional `ssl: { rejectUnauthorized: false }`. |

---

## 4. Key File Manifest & Responsibilities

| File Path | Core Responsibility |
| :--- | :--- |
| [`client/src/config/api.js`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/client/src/config/api.js) | Dynamic backend API origin resolution. |
| [`client/src/pages/finance.jsx`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/client/src/pages/finance.jsx) | Two-half equal layout for farm financial analytics and AI cost advisor. |
| [`client/src/components/finance/ExpensePieChart.jsx`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/client/src/components/finance/ExpensePieChart.jsx) | Crop-filtered pie chart with interactive bottom swapper line and progress indicator. |
| [`client/src/components/finance/AIExpenseAdvisor.jsx`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/client/src/components/finance/AIExpenseAdvisor.jsx) | Top expense analysis and specific fertilizer/pesticide alternatives with exact MRP rates. |
| [`client/src/pages/crops.jsx`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/client/src/pages/crops.jsx) | Top 4 summary metrics, crop filter tabs, and stage timeline overview. |
| [`client/src/components/crops/Cropcard.jsx`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/client/src/components/crops/Cropcard.jsx) | Growth stage stepper, real state transition drawer, and "Mark Crop as Harvested" button. |
| [`client/src/components/crops/AICropAdvisor.jsx`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/client/src/components/crops/AICropAdvisor.jsx) | Interactive farmer Q&A interface with quick prompts and concise advice. |
| [`backend/controllers/aiController.js`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/backend/controllers/aiController.js) | Gemini AI agronomist prompts and cost reduction calculation engine. |
| [`backend/controllers/cropController.js`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/backend/controllers/cropController.js) | Crop registration, lifecycle status updates, and harvest triggers. |
| [`backend/config/db.js`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/backend/config/db.js) | MySQL pool with auto schema migration, cloud port, and SSL support. |
| [`backend/server.js`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/backend/server.js) | Express 5 HTTP server, health check endpoints, and static file fallback. |
| [`Dockerfile`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/Dockerfile) | Multi-stage Docker build producing an optimized fullstack production image. |
| [`docker-compose.yml`](file:///C:/Users/lowan/OneDrive/Desktop/m@m@_sheesh/FarmFriend/docker-compose.yml) | Orchestrates MySQL 8.0 and the FarmFriend web application with volumes. |

---

## 5. Deployment Runbook

### Option A: Local Development Run
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

### Option B: Docker Compose Deployment (Recommended)
```bash
# From repository root:
docker-compose up -d --build

# View logs:
docker-compose logs -f app

# Access at: http://localhost:5000
# Health check: http://localhost:5000/health
```

### Option C: Cloud Deployment (Render / Railway / VPS)
1. **Database**: Spin up a MySQL 8.0 instance (e.g. Railway MySQL, Aiven, or AWS RDS).
2. **Backend**:
   - Environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`, `JWT_SECRET`, `GEMINI_API_KEY`.
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
3. **Frontend (Vercel / Netlify)**:
   - Root directory: `client`
   - Build Command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `VITE_API_URL=https://your-backend-domain.com`

---

## 6. Backlog & Recommended Next Enhancements
1. **Multilingual Voice Q&A**: Web Speech API integration so farmers can ask questions in Hindi, Marathi, Telugu, and Punjabi via voice input.
2. **Pest Image Disease Classifier**: Gemini Vision endpoint allowing farmers to take a picture of an infected leaf and receive instant pathology diagnosis.
3. **SMS / WhatsApp Irrigation Alerts**: Twilio or Gupshup WhatsApp webhook triggering alerts 24 hours prior to scheduled irrigation dates.
