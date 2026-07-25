# DocSpot - Frontend Application (React 19 + Vite + Tailwind v4)

This directory contains the user interface and SPA frontend for the **DocSpot** Healthcare Platform, built using React 19, Vite, Tailwind CSS v4, Framer Motion, and Chart.js.

---

## Architecture & Design System

- **Component Layer**: Modular atomic UI elements (`Navbar`, `Footer`, `Sidebar`, `BedStatusCard`, `DoctorCard`, `MedicineCard`).
- **Context API**: Global state providers handling session & data persistence:
  - `AuthContext`: User identity, JWT storage (`access_token`, `refresh_token`), login/logout, and role management.
  - `ThemeContext`: Dark / light mode toggle & color palette switching.
  - `CartContext`: Shopping cart items state, quantity adjustments, price calculation, and local storage sync.
- **Service Layer (`src/services/`)**:
  - `apiService.js`: Axios HTTP client configured with JWT authorization headers (`Bearer <token>`).
  - `mockData.js`: Comprehensive offline fallback dataset enabling instant client demo mode without backend dependencies.

---

## Directory Structure

```text
src/
├── assets/             # Brand logos, icons, and hero illustrations
├── components/         # Reusable widgets (Navbar, Footer, Sidebar, Cards, Modals)
├── context/            # Global React Contexts (AuthContext, ThemeContext, CartContext)
├── layouts/            # Page layouts (MainLayout, DashboardLayout)
├── pages/
│   ├── public/         # Home, Doctors, Hospitals, Diagnostics, Medicines, Ambulance, Contact, About, Login, Register
│   ├── dashboard/      # Role-specific dashboards (patient, doctor, hospital, admin, diagnostics, pharmacy)
│   └── errors/         # 404 & Unauthorized access fallback pages
├── routes/             # AppRoutes setup & ProtectedRoute guards
├── services/           # apiService.js (Axios) & mockData.js (Offline fallback)
├── App.jsx             # Root App component with context providers & Toast notifications
├── main.jsx            # React entry point
└── index.css           # Global Tailwind CSS v4 imports & custom styles
```

---

## Available Scripts

In the `frontend` directory, you can run:

### `npm run dev`
Runs the application in development mode with Hot Module Replacement (HMR).
Open [http://localhost:5173](http://localhost:5173) in your browser.

### `npm run build`
Bundles the application for production to the `dist` folder using Vite. It optimizes assets, minifies JS/CSS, and prepares code for deployment.

### `npm run lint`
Runs `oxlint` static code analysis to catch syntax issues, unused imports, and React anti-patterns.

### `npm run preview`
Locally previews the production build stored in `dist`.

### `npm run deploy`
Builds and deploys the `dist` directory to GitHub Pages (`gh-pages`).

---

## Role-Based Dashboard Routing

Protected routes redirect users to their designated role dashboard upon login:

| Role | Dashboard Route | Key Features |
|---|---|---|
| **Patient** | `/dashboard/patient` | Overview of medical history, booked appointments, prescription downloads, and active orders. |
| **Doctor** | `/dashboard/doctor` | Consultation calendar, appointment approvals, digital prescription writer, OPD schedule. |
| **Hospital Admin** | `/dashboard/hospital` | Real-time bed availability manager (ICU/General/Oxygen), department staff, emergency admissions. |
| **Super Admin** | `/dashboard/admin` | Platform aggregate analytics, system user management, master category settings. |
| **Diagnostic Admin**| `/dashboard/diagnostics` | Test package list, sample collection schedule, patient lab report upload. |
| **Pharmacy** | `/dashboard/pharmacy` | Drug inventory SKU stock manager, order dispatch tracking, customer cart orders. |

---

## Styling & Theme

Tailwind CSS v4 is integrated directly via Vite (`@tailwindcss/vite`). All colors and theme variables support responsive layouts across Mobile, Tablet, and Desktop displays.
