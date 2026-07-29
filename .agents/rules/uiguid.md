---
trigger: always_on
---

DocSpot UI/UX Design System & Layout Guidelines

This document outlines the visual identity, design tokens, layout structures, accessibility guidelines (WCAG 2.1 AA), error prevention patterns, and user experience standards for both DocSpot Public (Patient App) and DocSpot Pro (Healthcare Workspace).

1. Core Healthcare UI/UX Principles

Derived from industry standards for digital health applications:

Accessibility First (WCAG 2.1 AA): High contrast text ratios (minimum 4.5:1 for normal text, 3:1 for large text), screen-reader friendly DOM structure, and prominent focus indicators.

Cognitive Load Reduction: Minimizing click fatigue in clinical workflows and presenting medical data (prescriptions, diagnostic values, vitals) in structured, easily skimmable containers.

Clinical Safety & Error Prevention: Explicit confirmation patterns for critical actions (e.g., dosage changes, emergency bed toggles, appointment cancellations) to eliminate accidental clicks during high-stress workflows.

Role-Tailored Contexts: Distinct design visual languages for consumer health discovery versus high-density provider operations.

2. Visual Identity & Theme Differentiation

To maintain clear context between consumer browsing and professional clinical environments, the two platforms utilize tailored design languages built on Tailwind CSS v4.

A. Public App Identity (DocSpot Patient)

Design Philosophy: Welcoming, clean, trustworthy, and empathetic.

Base Theme: Bright light mode with subtle mint accents, soft rounded cards (rounded-2xl), high-contrast typography, and spacious padding.

Color Palette & Contrast Tokens:

Primary Teal: #0D9488 (Tailwind teal-600) — Main CTAs, active tab headers.

Hover Teal: #0F766E (Tailwind teal-700) — Hover states for primary buttons.

Secondary Mint: #CCFBF1 (Tailwind teal-100) — Pill badges, active selection backgrounds.

Background Surface: #F8FAFC (Tailwind slate-50) — Page backdrop.

Card Surface: #FFFFFF — Elevated card containers with soft shadows (shadow-sm / shadow-md).

Text Primary: #0F172A (Tailwind slate-900) — High contrast body and heading text (15.2:1 contrast ratio against white).

B. Pro App Identity (DocSpot Pro)

Design Philosophy: High-density, data-efficient, low eye-strain, functional dashboard workspace.

Base Theme: Deep dark/slate sidebar navigation with structured, sharp functional containers (rounded-lg).

Color Palette & Status Tokens:

Sidebar Header: #0F172A (Tailwind slate-900) — Navigation sidebar background.

Action Blue: #2563EB (Tailwind blue-600) — Primary submission buttons, active OPD callouts.

Hover Blue: #1D4ED8 (Tailwind blue-700) — Primary button hover state.

Clinical Status Identifiers:

OPD Waiting: #F59E0B (Amber-500)

In-Consultation: #2563EB (Blue-600)

Completed / Active: #10B981 (Emerald-500)

Emergency Alert: #EF4444 (Red-500)

3. Component Interactive States & Focus Tokens

To comply with accessibility standards across both applications, every interactive control (buttons, text inputs, dropdowns) must implement standardized interactive states:

/* Focus Ring Token (Tailwind Class String) */
.focus-ring {
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2;
}

/* Button Interactive States Matrix */
/* Default: bg-brand-600 text-white */
/* Hover:   hover:bg-brand-700 */
/* Active:  active:bg-brand-800 */
/* Focus:   focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 */
/* Disabled: disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed */


4. Public App UI Layouts (DocSpot Patient)

Layout 1: Home Page & Search Hero Section

┌────────────────────────────────────────────────────────────────────────┐
│ [Logo DocSpot]   Search Doctors   Hospitals   Pharmacy   [ Login ]     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Find & Book the Best Healthcare Near You                             │
│   [ 🔍 Search Doctor, Specialty, Clinic... ] [ City ▾ ] [ Search ]    │
│                                                                        │
│   Quick Services:                                                      │
│   [ 🩺 Book OPD ]  [ 🏥 Bed Status ]  [ 🧪 Lab Tests ]  [ 💊 Pharmacy ]│
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  Top Rated Doctors                     Available ICU & Oxygen Beds     │
│  ┌──────────────┐ ┌──────────────┐     ┌──────────────┐ ┌─────────────┐ │
│  │ Dr. Sharma   │ │ Dr. Patel    │     │ City Hosp    │ │ Apex Clinic │ │
│  │ Cardiologist │ │ Neurologist  │     │ 12 Beds Avail│ │ 4 Beds Avail│ │
│  │ [Book Slot]  │ │ [Book Slot]  │     │ [View]       │ │ [View]      │ │
│  └──────────────┘ └──────────────┘     └──────────────┘ └─────────────┘ │
└────────────────────────────────────────────────────────────────────────┘


Responsive Adaptation (Breakpoints):

Desktop (lg - 1024px+): Multi-column grid showcasing doctor cards and hospital bed widgets side-by-side.

Mobile (sm - < 640px): Single-column layout. Search bars stack vertically, and service shortcuts render as a 2x2 grid matrix.

Layout 2: Slot Selection & Appointment Booking

Time Slot Matrix UI:

Segmented controls grouped by Morning, Afternoon, and Evening grids.

Available: White card with teal border (border-brand-600 hover:bg-brand-50).

Booked: Dimmed grey text with strike-through (bg-slate-100 text-slate-400 cursor-not-allowed).

Selected: Dark filled teal button (bg-brand-600 text-white shadow-sm).

Price Breakdown Card:

Displays Consultation Fee, Platform/Service Fee, Discount, and Total Amount with clear visual separation.

Layout 3: Patient EMR & Digital Prescription Viewer

┌────────────────────────────────────────────────────────────────────────┐
│  ← Back to Appointments                   [ 📥 Download PDF ]           │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  DocSpot Verified Digital Prescription           QR Code Verification│  │
│  │  Doctor: Dr. Ananya Roy (MBBS, MD)              [ QR Placeholder ] │  │
│  │  Clinic: Care Plus Heart Institute, Patna                            │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  Patient: Rahul Verma (Age: 32)                 Date: 29 Jul 2026   │  │
│  │  Diagnosis: Mild Hypertension & Vitamin D Deficiency             │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  MEDICATIONS:                                                    │  │
│  │  1. Amlodipine 5mg    - 1 tablet daily (Morning) - 30 Days       │  │
│  │  2. Vitamin D3 60k    - 1 capsule weekly      - 4 Weeks          │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  RECOMMENDED LAB TESTS:                                          │  │
│  │  • Lipid Profile Test  [ Order from DocSpot Lab → ]              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘


5. Professional App UI Layouts (DocSpot Pro)

Layout 1: OPD Live Queue Dashboard

┌──────────────┬─────────────────────────────────────────────────────────┐
│ DocSpot PRO  │ Today's OPD Queue — Dr. Ananya Roy    [ 🟢 Online/Active ]│
├──────────────┼─────────────────────────────────────────────────────────┤
│ 📊 Dashboard │  Queue Statistics:                                      │
│ 🩺 OPD Queue │  [ Total: 24 ]  [ Waiting: 8 ]  [ In-Room: 1 ]  [ Done: 15 ]│
│ 📝 EMR Writer├─────────────────────────────────────────────────────────┤
│ 🏥 Bed Status│  Live Queue:                                            │
│ 🧪 Lab Req   │  Token │ Patient Name │ Age │ Status      │ Actions     │
│ 💊 Orders    │  ──────┼──────────────┼─────┼─────────────┼─────────────│
│ ⚙️ Settings  │  #012  │ Amit Kumar   │ 45  │ 🔵 In-Room  │ [ View EMR ]│
│              │  #013  │ Priya Singh  │ 29  │ 🟠 Waiting  │ [ Call In ] │
│              │  #014  │ Rajesh Gupta │ 52  │ 🟠 Waiting  │ [ Call In ] │
└──────────────┴──────────────┴──────────────┴─────────────┴─────────────┘


Responsive & Mobile Adaptation:

Tablet/Desktop (md - 768px+): Full data table with immediate inline actions ([ Call In ], [ View EMR ]).

Mobile Viewport (< md): Data table transforms into stacked card items displaying Token #, Patient Name, and a large full-width action button to prevent mis-clicks.

Layout 2: Digital Prescription & EMR Writer (Clinical Safety Focused)

┌────────────────────────────────────────────────────────────────────────┐
│ Consultation: Token #012 — Amit Kumar (Male, 45 yrs)                   │
├────────────────────────────────────────┬───────────────────────────────┤
│ SYMPTOMS & DIAGNOSIS                   │ PRESCRIPTION & MEDICATIONS    │
│ Symptoms / Chief Complaints:           │ [ + Add Medicine ]            │
│ [ Shortness of breath, chest pain ]    │                               │
│                                        │ Med Name | Dosage | Duration  │
│ Diagnosis:                             │ ─────────┼────────┼────────── │
│ [ Hypertension - Grade 1        ]      │ Atorvas  │ 10mg   │ 30 Days   │
│                                        │ [ Delete ]                    │
│ Clinical Notes (Internal):             │                               │
│ [ Patient advised low sodium diet ]    │ Lab Referral Test:            │
│                                        │ [ 🔍 Select Test...         ] │
├────────────────────────────────────────┴───────────────────────────────┤
│ [ Save & Generate Prescription PDF ]           [ Send to Pharmacy → ] │
└────────────────────────────────────────────────────────────────────────┘


Clinical Safety Safeguard Rules:

Dosage Field Validation: Inline warnings if numeric dosage values fall outside expected ranges.

Double-Confirmation Modal: Before finalizing a prescription or forwarding an order to pharmacy, a quick modal prompts the doctor: "Confirm prescribing 2 items to Amit Kumar?"

Layout 3: Hospital Emergency Bed & Inventory Manager

Visual Grid Cards: Real-time occupancy cards for ICU Beds, Oxygen Beds, Ventilators, and General Wards.

Safety Toggle Pattern:

ICU Bed #04:  [ OCCUPIED (Patient #402) ]  [ Toggle Status ]
--> Triggers confirmation dialog: "Change ICU Bed #04 status to AVAILABLE?"


6. Tailwind CSS Design Token Configuration

Update your tailwind.config.js or index.css (Tailwind v4) with these tokens:

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488', // Primary Public Teal (WCAG compliant on white)
          700: '#0f766e', // Hover Teal
          800: '#115e59',
        },
        pro: {
          bg: '#f8fafc',
          sidebar: '#0f172a', // Slate 900 for Pro Navigation
          accent: '#2563eb',  // Action Blue
          accentHover: '#1d4ed8',
        },
        status: {
          waiting: '#f59e0b',
          consultation: '#2563eb',
          completed: '#10b981',
          emergency: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
