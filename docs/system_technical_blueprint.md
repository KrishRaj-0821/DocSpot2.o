# DocSpot Healthcare Ecosystem: Complete Technical Architecture & System Blueprint

## 1. Executive Summary & Ecosystem Vision

DocSpot is a unified, multi-application healthcare ecosystem designed to seamlessly connect **Patients (Public)** with **Healthcare Professionals (Doctors, Clinics, Hospitals, Laboratories, and Pharmacies)**.

Unlike isolated medical booking portals, DocSpot operates as an integrated **Data & Workflow Network** where medical records, prescription data, OPD queues, diagnostic referrals, and order fulfillments flow across user roles with minimal friction and strict security boundaries.

### Core Ecosystem Participants & Value Exchange

```
                       ┌───────────────────────────────────────────┐
                       │            DocSpot Core API               │
                       │        (Django REST + Supabase)           │
                       └─────────────────────┬─────────────────────┘
                                             │
      ┌───────────────────────┬──────────────┴──────────────┬───────────────────────┐
      ▼                       ▼                             ▼                       ▼
┌───────────┐          ┌─────────────┐               ┌─────────────┐         ┌─────────────┐
│  PATIENT  │          │   DOCTOR    │               │ DIAGNOSTICS │         │  PHARMACY   │
│ (Public)  │          │ (Pro App)   │               │  (Pro App)  │         │  (Pro App)  │
└─────┬─────┘          └──────┬──────┘               └──────┬──────┘         └──────┬──────┘
      │                       │                             │                       │
      │ 1. Search & Book Slot │                             │                       │
      ├──────────────────────►│                             │                       │
      │                       │ 2. Consult & Write EMR/Rx   │                       │
      │                       ├────────────────────────────►│ 3. Automated Lab Ref  │
      │                       │                             │                       │
      │                       │ 4. Automated Rx Transmission                        │
      │                       ├────────────────────────────────────────────────────►│
      │                       │                                                     │
      │ 5. Download Rx PDF    │ 6. Upload Test Results      │ 7. Dispense & Deliver │
      │◄──────────────────────┴─────────────────────────────┴───────────────────────┤
```

---

## 2. Technical Stack Architecture

| Layer | Technology Choice | Function / Purpose |
| :--- | :--- | :--- |
| **Public Frontend** | React 19 + Vite + Tailwind CSS | Patient discovery, appointment booking, pharmacy store, EMR viewer. |
| **Pro Frontend** | React 19 + Vite + Tailwind CSS | High-density dashboard for Doctors, OPD Queue, EMR writer, Labs, Beds. |
| **Backend API** | Python 3.12 + Django 5 + DRF | Business logic, RBAC, PDF engine (ReportLab), transactional APIs. |
| **Database** | Supabase (PostgreSQL 15) | Relational storage, Auth credentials, transaction pooling via PgBouncer. |
| **Storage** | Supabase Storage / S3 | Diagnostic PDF reports, doctor licenses, prescription scans. |
| **Public Hosting** | Vercel (`docspot.com`) | Static SPA build with client-side router rewrites. |
| **Pro Hosting** | Vercel (`pro.docspot.com`) | Protected SPA build with strict authentication checks. |
| **API Hosting** | Render Web Service | WSGI/ASGI Python web server linked to Supabase DB. |

---

## 3. Database Schema & Data Models

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 accounts_user                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK) | email | password | role (PATIENT/DOCTOR/CLINIC/LAB/PHARMACY) | phone  │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │ 1:1                            │ 1:1                            │ 1:1
        ▼                                ▼                                ▼
┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
│ patient_profiles │           │ doctor_profiles  │           │ clinic_profiles  │
├──────────────────┤           ├──────────────────┤           ├──────────────────┤
│ id (PK)          │           │ id (PK)          │           │ id (PK)          │
│ user_id (FK)     │           │ user_id (FK)     │           │ user_id (FK)     │
│ blood_group      │           │ license_number   │           │ clinic_name      │
│ emergency_contact│           │ specialty        │           │ address, city    │
└────────┬─────────┘           │ consultation_fee │           │ emergency_beds   │
         │                     └────────┬─────────┘           └────────┬─────────┘
         │                              │                              │
         │ 1:N                          │ 1:N                          │ 1:N
         ▼                              ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 appointments                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK) | patient_id (FK) | doctor_id (FK) | clinic_id (FK)                    │
│ booking_date | slot_time | status (PENDING/CONFIRMED/COMPLETED/CANCELLED)       │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         │ 1:1
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                medical_records                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK) | appointment_id (FK) | symptoms | diagnosis | clinical_notes           │
│ prescription_json | created_at                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Control Flow & Communication Scenarios

### Workflow 1: End-to-End OPD Booking & Prescription Dispatch
1. **Patient App (Public) -> API Gateway**: `POST /api/appointments/` (Selects Doctor, Clinic, Slot)
2. **API Gateway -> Supabase DB**: Validate Slot & Insert Appointment Record (Status: `PENDING`)
3. **Supabase DB --> Pro App (Doctor)**: Live OPD Queue Table Updated via WebSockets/Polling
4. **Pro App (Doctor) -> API Gateway**: `POST /api/medical-records/` (Diagnosis + Medications JSON)
5. **API Gateway -> PDF Engine**: Trigger ReportLab to compile Prescription PDF
6. **API Gateway -> Supabase Storage**: Store Prescription PDF
7. **API Gateway --> Patient App (Public)**: Return Signed Download URL + Update Status to `COMPLETED`

### Workflow 2: Automatic Diagnostic Referral Trigger
1. During consultation in `frontend-pro`, doctor adds a required test (e.g., *Full Body Lipid Profile*).
2. Django backend creates a linked record in `diagnostics_orders` with status `PENDING_SAMPLE`.
3. The order immediately populates in the Lab Dashboard inside `frontend-pro`.
4. Once the lab uploads the completed PDF report, Django sends a notification to the Patient, making the report available on `frontend-public`.

---

## 5. Security, RBAC & API Authorization Framework

### User Role Matrix

| User Role | Access Domain | Permitted Actions |
| :--- | :--- | :--- |
| **PATIENT** | `frontend-public` | Search providers, book/cancel slots, view personal prescriptions, order medicines. |
| **DOCTOR** | `frontend-pro` | Manage slot schedules, view assigned OPD queue, access patient history, write EMR. |
| **CLINIC_ADMIN** | `frontend-pro` | Manage clinic doctors, update emergency bed counts, view billing summaries. |
| **LAB_TECH** | `frontend-pro` | View pending diagnostic referrals, collect samples, upload test PDF results. |
| **PHARMACIST** | `frontend-pro` | Accept medicine orders, update SKU stock levels, mark orders for dispatch. |
