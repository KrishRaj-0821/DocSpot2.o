# Purnia Care Hospital Management System - Backend (Django)

This is the production-ready REST API backend for the **Purnia Care** healthcare platform, built using Django 5+ and Django REST Framework.

## Features

- **Role-Based Access Control (RBAC)**: Custom User models supporting Patient, Doctor, Hospital Admin, Super Admin, Diagnostic Admin, and Ambulance Driver roles.
- **Stateless JWT Auth**: Implemented using `djangorestframework-simplejwt`.
- **Comprehensive Scaffolding**: 13 custom applications separating concerns like clinical bookings, diagnostics tests, inventory pharmacy, ambulance, billing payments, and messaging notifications.
- **Audit logs & Soft Delete**: Shared abstract Base Model structures tracking `created_at`, `updated_at`, `is_deleted`, and `deleted_at`.
- **Global JSON Format**: A custom DRF renderer (`PurniaJSONRenderer`) that automatically formats all API responses:
  - Success: `{"success": true, "message": "Success", "data": {...}}`
  - Validation Errors: `{"success": false, "message": "Error message", "errors": [...]}`
- **Interactive Swagger Documentation**: Exposed automatically via `drf-spectacular` on http://localhost:8000/api/docs/.
- **Flexible Database Switcher**: Uses local SQLite by default for portability, but switches seamlessly to MySQL via `.env` configurations or Docker containers.

---

## Folder Structure

```text
backend/
├── accounts/          # User login, custom User/Role model, credentials updates, OTP
├── patients/          # Patient profile, clinical records, medical history uploads
├── doctors/           # Doctor profile, specialties, OPD timings, ratings reviews
├── hospitals/         # Hospital listings, beds status, facility department relations
├── appointments/      # Clinical appointments slot booking, prescription issuer
├── medicines/         # Drug SKU inventory, discount categories
├── pharmacy/          # Shopping cart orders, total calculations, shipping tracking
├── diagnostics/       # Diagnostic centers, tests packages booking, comparisons
├── ambulance/         # Emergency dispatch fleet, driver matching, status ETA
├── payments/          # Payment transaction registry, billing invoices
├── notifications/     # Alerts and reminder messaging
├── dashboard/         # Combined dashboards charts metrics API
├── common/            # Shared abstract models, custom management seed scripts
├── config/            # Main Django settings configuration (settings.py, urls.py)
├── manage.py          # CLI entry point
└── requirements.txt   # Python dependency packages
```

---

## Local Development Installation

### 1. Set Up Virtual Environment
Make sure you are in the `backend` directory:
```powershell
python -m venv venv
.\venv\Scripts\activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Database Scaffolding
Compile database tables and trigger migrations:
```powershell
python manage.py makemigrations
python manage.py migrate
```

### 4. Populate Demo Data
Run the custom seed command to populate doctors, hospitals, diagnostic test lists, medicines inventory, and default users:
```powershell
python manage.py seed_data
```

### 5. Run Server
```powershell
python manage.py runserver
```
The API and Swagger documentation will be live on:
- API Root: http://localhost:8000/api/
- Swagger Interactive Documentation: http://localhost:8000/api/docs/

---

## Demo Credentials (Pre-seeded)

Use these credentials to retrieve JWT access tokens from `/api/token/`:

| Role | Username / Email | Password |
|---|---|---|
| **Patient** | `aman_verma` / `patient@purniacare.com` | `password123` |
| **Doctor** | `dr_kumar` / `doctor@purniacare.com` | `password123` |
| **Hospital Admin** | `hosp_admin` / `hospital@purniacare.com` | `password123` |
| **Super Admin** | `pc_admin` / `admin@purniacare.com` | `password123` |

---

## Docker Execution

To orchestrate the Django API service alongside a MySQL 8 container in Docker, run:
```bash
docker-compose up --build
```
This automatically applies migrations, runs seed scripts, and exposes port `8000`.
