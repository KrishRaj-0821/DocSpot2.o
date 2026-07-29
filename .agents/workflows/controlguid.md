---
description: 
---

DocSpot Healthcare Ecosystem: Complete Technical Architecture & System Blueprint

1. Executive Summary & Ecosystem Vision

DocSpot is a unified, multi-application healthcare ecosystem designed to seamlessly connect Patients (Public) with Healthcare Professionals (Doctors, Clinics, Hospitals, Laboratories, and Pharmacies).

Unlike isolated medical booking portals, DocSpot operates as an integrated Data & Workflow Network where medical records, prescription data, OPD queues, diagnostic referrals, and order fulfillments flow across user roles with minimal friction and strict security boundaries.

Core Ecosystem Participants & Value Exchange

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


2. Technical Stack Architecture

The ecosystem relies on a modern, decoupled web architecture configured for high speed, zero-cost initial tier operation, and modular scaling.

Layer

Technology Choice

Function / Purpose

Public Frontend

React 19 + Vite + Tailwind CSS

Patient discovery, appointment booking, pharmacy store, EMR viewer.

Pro Frontend

React 19 + Vite + Tailwind CSS

High-density dashboard for Doctors, OPD Queue, EMR writer, Labs, Beds.

Backend API

Python 3.12 + Django 5 + DRF

Business logic, RBAC, PDF engine (ReportLab), transactional APIs.

Database

Supabase (PostgreSQL 15)

Relational storage, Auth credentials, transaction pooling via PgBouncer.

Storage

Supabase Storage / S3

Diagnostic PDF reports, doctor licenses, prescription scans.

Public Hosting

Vercel (docspot.com)

Static SPA build with client-side router rewrites.

Pro Hosting

Vercel (pro.docspot.com)

Protected SPA build with strict authentication checks.

API Hosting

Render Web Service

WSGI/ASGI Python web server linked to Supabase DB.

3. Monorepo Repository Structure

The entire platform lives in a single GitHub repository (docspot), facilitating unified commits across backend APIs and dual frontends.

docspot/
├── render.yaml                  # Infrastructure-as-code for Render deployment
├── README.md                    # Developer onboarding documentation
├── docs/
│   ├── ARCHITECTURE.md          # Domain & system overview
│   └── system_technical_blueprint.md  # This blueprint document
│
├── backend/                     # ── DJANGO REST FRAMEWORK SERVICE ──
│   ├── config/                  # Global settings, ASGI/WSGI, CORS, Root URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/                # Custom AbstractUser, Authentication, JWT, Roles
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── views.py
│   ├── common/                  # Base timestamp models, custom permissions, renderers
│   │   ├── models.py
│   │   ├── permissions.py       # IsPatient, IsHealthcareProfessional, IsClinicAdmin
│   │   └── renderers.py         # Standardized JSON envelopes
│   ├── doctors/                 # Doctor profiles, specialties, slot schedule manager
│   ├── hospitals/               # Clinic directory, bed management, OPD shifts
│   ├── appointments/            # Booking engine, status transitions, PDF generator
│   │   ├── views.py
│   │   └── pdf_utils.py         # ReportLab prescription generator
│   ├── patients/                # Medical history, records, allergy tracking
│   ├── pharmacy/                # SKU catalog, cart processing, delivery status
│   ├── diagnostics/             # Test package catalog, sample collection queue
│   ├── ambulance/               # Emergency request dispatch
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile               # Production container config
│
├── frontend-public/             # ── PATIENT REACT SPA ──
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json              # Vercel SPA route rewrite rules
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── context/             # AuthContext (Patient), CartContext
│       ├── layouts/             # PublicLayout (Nav, Footer)
│       ├── pages/               # Home, Doctors, Hospitals, BookSlot, Prescriptions
│       └── services/            # Axios API client configured for Public base URL
│
└── frontend-pro/                # ── HEALTHCARE PROFESSIONAL REACT SPA ──
    ├── index.html
    ├── vite.config.js
    ├── vercel.json              # Vercel SPA route rewrite rules
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── context/             # ProAuthContext (License verification, MFA)
        ├── layouts/             # ProDashboardLayout (Collapsible Sidebar, OPD Header)
        ├── pages/               # OPDQueue, ConsultationEMR, ScheduleManager, LabQueue
        └── services/            # Axios API client configured with Pro auth tokens


4. Database Schema & Data Models

The relational database schema stored in Supabase enforces data integrity across all ecosystem participants.

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


5. Control Flow & Communication Scenarios

Workflow 1: End-to-End OPD Booking & Prescription Dispatch

Patient App (Public) -> API Gateway: 1. POST /api/appointments/ (Selects Doctor, Clinic, Slot)
API Gateway -> Supabase DB: 2. Validate Slot & Insert Appointment Record (Status: PENDING)
Supabase DB --> Pro App (Doctor): 3. Live OPD Queue Table Updated via WebSockets/Polling
Pro App (Doctor) -> API Gateway: 4. POST /api/medical-records/ (Diagnosis + Medications JSON)
API Gateway -> PDF Engine: 5. Trigger ReportLab to compile Prescription PDF
API Gateway -> Supabase Storage: 6. Store Prescription PDF
API Gateway --> Patient App (Public): 7. Return Signed Download URL + Update Status to COMPLETED


Workflow 2: Automatic Diagnostic Referral Trigger

During consultation in frontend-pro, doctor adds a required test (e.g., Full Body Lipid Profile).

Django backend creates a linked record in diagnostics_orders with status PENDING_SAMPLE.

The order immediately populates in the Lab Dashboard inside frontend-pro.

Once the lab uploads the completed PDF report, Django sends a push/SMS notification to the Patient, making the report available on frontend-public.

6. Security, RBAC & API Authorization Framework

To safeguard patient medical data across both frontends, security is enforced strictly at the backend layer.

User Role Matrix

User Role

Access Domain

Permitted Actions

PATIENT

frontend-public

Search providers, book/cancel slots, view personal prescriptions, order medicines.

DOCTOR

frontend-pro

Manage slot schedules, view assigned OPD queue, access patient history, write EMR.

CLINIC_ADMIN

frontend-pro

Manage clinic doctors, update emergency bed counts, view billing summaries.

LAB_TECH

frontend-pro

View pending diagnostic referrals, collect samples, upload test PDF results.

PHARMACIST

frontend-pro

Accept medicine orders, update SKU stock levels, mark orders for dispatch.

Custom Django Permission Example

# backend/common/permissions.py
from rest_framework.permissions import BasePermission

class IsPatientOwnerOrDoctor(BasePermission):
    """
    Custom permission allowing patients to view their own records,
    and doctors to view records of patients assigned to their OPD queue.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user.is_authenticated:
            return False
            
        if user.role == 'PATIENT':
            return obj.patient.user == user
            
        if user.role in ['DOCTOR', 'CLINIC_ADMIN']:
            return True  # Verified healthcare provider