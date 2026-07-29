# DocSpot 2.0 - Live Deployment Guide (Vercel + Render + Supabase)

This guide walks through configuring and deploying **DocSpot 2.0** live to production using:
- **Supabase**: Managed PostgreSQL 15 Database (PgBouncer connection pooling)
- **Render**: Django 5 REST Framework WSGI/Gunicorn Web Service
- **Vercel**: React 19 + Vite Single Page Application (SPA)

---

## 1. 🗄️ Database Setup (Supabase PostgreSQL)

1. **Create Supabase Project**:
   - Log into [Supabase Dashboard](https://supabase.com) and click **New Project**.
   - Set project name: `docspot-db` and set a strong database password.
   - Choose region (e.g., `Singapore` or `US East`).

2. **Retrieve Connection String**:
   - Go to **Project Settings -> Database -> Connection string**.
   - Copy the **PgBouncer (Transaction Pooler)** URI on port `6543`:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```

---

## 2. 🐍 Backend API Service Deployment (Render)

1. **Create Web Service on Render**:
   - Log into [Render Dashboard](https://dashboard.render.com).
   - Click **New + -> Blueprint** and connect your GitHub repository:
     `https://github.com/KrishRaj-0821/DocSpot2.o.git`.
   - Render will auto-detect `render.yaml`.

2. **Configure Environment Variables in Render**:
   In your Render Web Service settings, set:
   | Key | Value |
   | :--- | :--- |
   | `PYTHON_VERSION` | `3.12.0` |
   | `DEBUG` | `False` |
   | `SECRET_KEY` | *(Auto-generated)* |
   | `ALLOWED_HOSTS` | `.onrender.com,.vercel.app` |
   | `CORS_ALLOWED_ORIGINS` | `https://docspot.vercel.app` |
   | `DATABASE_URL` | *(Paste your Supabase connection string)* |

3. **Deploy & Migration Execution**:
   - Render executes:
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - Copy your Render backend URL (e.g., `https://docspot-backend.onrender.com`).

---

## 3. ⚡ Frontend SPA Deployment (Vercel)

1. **Import Repository to Vercel**:
   - Log into [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New -> Project**.
   - Import `https://github.com/KrishRaj-0821/DocSpot2.o.git`.

2. **Configure Build Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` *(Vercel automatically detects `vercel.json`)*
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`

3. **Environment Variables in Vercel**:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://docspot-backend.onrender.com/api` |
   | `VITE_APP_ENV` | `production` |

4. **Deploy**:
   - Click **Deploy**. Vercel will build and assign your live URL (e.g., `https://docspot.vercel.app`).

---

## 4. ✅ Live Verification Checklist

1. **Public Site**: Open `https://docspot.vercel.app` — verify doctor search, OPD slot picker, and 24/7 teleconsult call widget.
2. **Dynamic Sitemap**: Visit `https://docspot-backend.onrender.com/sitemap.xml` — verify XML output for search engines.
3. **OpenAPI Swagger**: Visit `https://docspot-backend.onrender.com/api/docs/` — verify live interactive API spec.
