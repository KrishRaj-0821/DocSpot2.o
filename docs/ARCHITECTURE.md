# Technical Architecture & System Design Document

## Purnia Care Healthcare Platform

---

## 1. System Overview

**Purnia Care** is an enterprise-grade digital healthcare platform engineered as a decoupled full-stack architecture. The platform features a **Django 5 REST Framework** backend providing stateless API endpoints and a **React 19 SPA (Single Page Application)** frontend built with Vite and Tailwind CSS v4.

---

## 2. Architectural Blueprint

```mermaid
graph TB
    subgraph Client Layer
        SPA[React 19 SPA Frontend]
        AuthStore[AuthContext & JWT Tokens]
        CartStore[CartContext & LocalStorage]
    end

    subgraph Service Communication
        AxiosClient[apiService.js - Axios Client]
        MockFallback[mockData.js - Offline Fallback]
        SPA --> AxiosClient
        AxiosClient -. Network Offline .-> MockFallback
    end

    subgraph Django REST Backend
        Gateway[DRF Router & URLs]
        SimpleJWT[SimpleJWT Authentication Middleware]
        Renderer[PurniaJSONRenderer - Envelope Format]
        
        AxiosClient -- HTTPS / Bearer Token --> Gateway
        Gateway --> SimpleJWT
        SimpleJWT --> Renderer
    end

    subgraph Domain Modular Applications
        AccountsApp[accounts: User, Roles & OTP]
        HospitalsApp[hospitals: Profiles, Departments & Beds]
        DoctorsApp[doctors: Specializations, Schedules & Reviews]
        PatientsApp[patients: Medical Records & Profiles]
        AppointmentsApp[appointments: Bookings & Prescriptions]
        MedicinesApp[medicines: SKU Inventory & Categories]
        PharmacyApp[pharmacy: Orders & Fulfillment]
        DiagnosticsApp[diagnostics: Centers, Packages & Reports]
        AmbulanceApp[ambulance: Emergency Fleet Dispatch]
        PaymentsApp[payments: Transactions & Ledger]
        DashboardApp[dashboard: Aggregated Metrics API]
        
        Renderer --> AccountsApp
        Renderer --> HospitalsApp
        Renderer --> DoctorsApp
        Renderer --> PatientsApp
        Renderer --> AppointmentsApp
        Renderer --> MedicinesApp
        Renderer --> PharmacyApp
        Renderer --> DiagnosticsApp
        Renderer --> AmbulanceApp
        Renderer --> PaymentsApp
        Renderer --> DashboardApp
    end

    subgraph Database Layer
        ORM[Django ORM]
        DB[(SQLite / MySQL / PostgreSQL)]
        
        AccountsApp & HospitalsApp & DoctorsApp & AppointmentsApp & PharmacyApp & DiagnosticsApp & AmbulanceApp --> ORM
        ORM --> DB
    end
```

---

## 3. Core Technical Decisions

### 3.1 Role-Based Access Control (RBAC) & Custom User Model
The `accounts` app implements a customized `AbstractUser` model (`User`) that centralizes identity and access management across 6 distinct system roles:
- `PATIENT`: Access to personal medical history, appointment bookings, cart ordering, diagnostic package tests.
- `DOCTOR`: Access to consultation schedules, patient records, prescription issuance, rating reviews.
- `HOSPITAL_ADMIN`: Full administrative control over hospital bed allocations (General/ICU/Oxygen), department staffing, emergency admissions.
- `SUPER_ADMIN`: System-wide access to platform performance charts, user accounts, and financial transactions.
- `DIAGNOSTIC_ADMIN`: Control over test package pricing, appointment slots, and lab report uploads.
- `AMBULANCE_DRIVER`: Emergency dispatch acceptance, real-time status updates (`IDLE`, `DISPATCHED`, `COMPLETED`).

### 3.2 Global Custom Response Format (`PurniaJSONRenderer`)
To ensure frontend API consumption remains clean and predictable across all 13 Django domain apps, the backend enforces a standard JSON response wrapper located in `common/renderers.py`:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": 1,
    "user": "aman_verma",
    "role": "PATIENT"
  }
}
```

In the event of validation failures or server exceptions:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Invalid appointment date selected."
  ]
}
```

### 3.3 Soft Delete & Base Audit Model Pattern
All domain models subclass `common.models.BaseModel`, providing automatic auditability and non-destructive soft deletion:
- `created_at`: Datetime timestamp when record was created.
- `updated_at`: Datetime timestamp of last mutation.
- `is_deleted`: Boolean flag indicating if record is soft-deleted.
- `deleted_at`: Datetime timestamp when soft-deletion occurred.

---

## 4. Domain Data Model Relationships

```mermaid
erDiagram
    USER ||--o{ PATIENT_PROFILE : has
    USER ||--o{ DOCTOR_PROFILE : has
    USER ||--o{ HOSPITAL_ADMIN : manages
    
    HOSPITAL ||--o{ DEPARTMENT : contains
    HOSPITAL ||--o{ BED : owns
    HOSPITAL ||--o{ DOCTOR_PROFILE : employs
    
    DOCTOR_PROFILE ||--o{ APPOINTMENT : conducts
    PATIENT_PROFILE ||--o{ APPOINTMENT : books
    APPOINTMENT ||--o| PRESCRIPTION : generates
    
    PATIENT_PROFILE ||--o{ MEDICINE_ORDER : places
    MEDICINE_ORDER ||--o{ ORDER_ITEM : contains
    MEDICINE ||--o{ ORDER_ITEM : ordered_in
    
    PATIENT_PROFILE ||--o{ DIAGNOSTIC_BOOKING : requests
    DIAGNOSTIC_CENTER ||--o{ DIAGNOSTIC_TEST : offers
    DIAGNOSTIC_TEST ||--o{ DIAGNOSTIC_BOOKING : includes
    
    PATIENT_PROFILE ||--o{ AMBULANCE_BOOKING : requests
    AMBULANCE ||--o{ AMBULANCE_BOOKING : dispatched_for
```

---

## 5. Security & Authentication Architecture

1. **Stateless JWT Tokens**:
   - `POST /api/token/`: Returns `access` token (short-lived) and `refresh` token (long-lived).
   - `POST /api/token/refresh/`: Obtains new access token without re-entering credentials.
2. **CORS & Middleware Security**:
   - Configured via `django-cors-headers` to restrict unauthorized origin domains.
   - `RestrictedRolePermission` enforces strict endpoint authorization based on user role.

---

## 6. Frontend Architecture & Resilience

1. **Vite + React 19 Build**:
   - Zero-delay HMR during development.
   - Optimized tree-shaking and dynamic import splitting for production builds.
2. **Hybrid Network Resilience Layer**:
   - `apiService.js` attempts REST requests to `http://localhost:8000/api/` (or production API).
   - In case of offline operation or client demonstration without a running Django instance, API service seamlessly falls back to `mockData.js`, ensuring zero downtime during previews.

---

## 7. Production Deployment Pipeline

- **Backend**: Managed via `render.yaml` Blueprint targeting Python 3.10 runtime + Gunicorn + PostgreSQL database.
- **Frontend**: Single Command SPA deployment to Vercel or GitHub Pages (`npm run deploy`).
