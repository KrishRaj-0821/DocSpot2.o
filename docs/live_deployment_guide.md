# DocSpot 2.0 - All-in-One Vercel & Supabase Live Deployment Guide

This guide details hosting **DocSpot 2.0** on **Vercel** for BOTH:
1. **Frontend SPA** (React 19 + Vite)
2. **Backend REST API** (Django 5 WSGI Serverless Functions via `@vercel/python`)
3. **Database** (Supabase PostgreSQL 15)

---

## 1. 🗄️ Database Setup (Supabase PostgreSQL)

- **Project Reference**: `mdwqohgyqizxequsdovz`
- **Database URL**:
  ```text
  postgresql://postgres:[YOUR_DB_PASSWORD]@db.mdwqohgyqizxequsdovz.supabase.co:5432/postgres
  ```

---

## 2. ⚡ All-in-One Deployment on Vercel (Frontend SPA + Django Backend API)

1. **Import Repository on Vercel**:
   - Log into [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Add New -> Project** and import `https://github.com/KrishRaj-0821/DocSpot2.o.git`.

2. **Vercel Build Configuration**:
   - Vercel automatically detects `vercel.json` and builds:
     - `@vercel/static-build` for `frontend/`
     - `@vercel/python` Serverless Function for `api/index.py` (Django WSGI)

3. **Configure Environment Variables in Vercel**:
   Go to **Project Settings -> Environment Variables** on Vercel and set:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `SECRET_KEY` | `YJiLT7oK3ddwHfmvudBUEMMR3gnRamZiGqzGMb-mHSqxxxB9Cidy97-hozS4gwF9_Ws` | Django Production Key |
   | `DEBUG` | `False` | Production Mode |
   | `SUPABASE_URL` | `https://mdwqohgyqizxequsdovz.supabase.co` | Supabase API Host |
   | `SUPABASE_KEY` | `sb_publishable_UkQftb3vYy5Qa8N2_VCb4g_EF_CnREy` | Supabase Anon Key |
   | `SUPABASE_SECRET_KEY` | `YOUR_SUPABASE_SECRET_KEY_HERE` | Supabase Service Role Key |
   | `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.mdwqohgyqizxequsdovz.supabase.co:5432/postgres` | Database URL |
   | `ALLOWED_HOSTS` | `.vercel.app,localhost` | Allowed HTTP Host Headers |
   | `VITE_API_BASE_URL` | `/api` | Relative API Route |

4. **Deploy**:
   - Click **Deploy**. Vercel will build both the frontend assets and serverless Python API endpoint under a unified domain (e.g., `https://docspot.vercel.app`).

---

## 3. 🔍 Live Endpoints & Routes

- **Frontend App**: `https://docspot.vercel.app/`
- **Backend REST API**: `https://docspot.vercel.app/api/`
- **Dynamic Sitemap.xml**: `https://docspot.vercel.app/sitemap.xml`
- **Robots.txt**: `https://docspot.vercel.app/robots.txt`
