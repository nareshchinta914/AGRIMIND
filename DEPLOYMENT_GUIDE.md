# 🌾 AGRIMIND – Easy Production Deployment Guide

This guide gives you the easiest methods to deploy your entire **AGRIMIND** application to the cloud **for free without disturbing any existing code**.

---

## 🏗️ Project Architecture Overview

AGRIMIND has 3 lightweight services:
1. **Frontend**: React + Vite Web Portal (`/frontend`)
2. **Backend**: Express + Prisma Node.js API (`/backend`)
3. **AI Service**: Python FastAPI + ML Crop Disease/Advisory Engine (`/ai-service`)

---

## 🌟 OPTION 1: 100% Free Cloud Deployment (Recommended)

This is the easiest and most popular deployment path using **Vercel** (for frontend) + **Render** (for backend & AI) + **Supabase** (for PostgreSQL database).

---

### Step 1: Push your project to GitHub
If you haven't already:
```bash
git init
git add .
git commit -m "AGRIMIND Production Ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/AGRIMIND.git
git push -u origin main
```

---

### Step 2: Deploy Frontend on Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New Project"** $\rightarrow$ Import your **`AGRIMIND`** repository.
3. In the project setup:
   - **Root Directory**: Select `frontend` (Click Edit $\rightarrow$ choose `frontend`).
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api` (You can update this after deploying backend)
5. Click **"Deploy"**.
   * 🎉 Your website will be live at `https://agrimind-xxx.vercel.app`!

---

### Step 3: Deploy Backend on Render (Free)
1. Go to [render.com](https://render.com) and log in with GitHub.
2. Click **"New +"** $\rightarrow$ **"Web Service"** $\rightarrow$ Select your **`AGRIMIND`** repository.
3. Configure:
   - **Name**: `agrimind-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node src/server.js`
   - **Plan**: `Free`
4. Add **Environment Variables**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_ACCESS_SECRET`: `agrimind_jwt_secret_key_2026`
   - `JWT_REFRESH_SECRET`: `agrimind_refresh_secret_key_2026`
   - `AI_SERVICE_URL`: `https://your-ai-service.onrender.com` (from Step 4)
5. Click **"Create Web Service"**.

---

### Step 4: Deploy AI Service on Render (Free)
1. In Render, click **"New +"** $\rightarrow$ **"Web Service"** $\rightarrow$ Select your **`AGRIMIND`** repo again.
2. Configure:
   - **Name**: `agrimind-ai-service`
   - **Root Directory**: `ai-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
3. Click **"Create Web Service"**.

---

## 🐳 OPTION 2: One-Command Docker Deployment (VPS / Self-Hosted)

If you have a Linux VPS (DigitalOcean, AWS EC2, Hostinger, Linode, Hetzner, etc.):

1. Clone your repository on your server:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AGRIMIND.git
   cd AGRIMIND
   ```
2. Run the single Docker Compose command:
   ```bash
   docker compose up --build -d
   ```
3. That's it!
   - Frontend is live at: `http://YOUR_SERVER_IP`
   - Backend API is live at: `http://YOUR_SERVER_IP:5000`
   - AI Engine is live at: `http://YOUR_SERVER_IP:8000`

---

## ⚡ OPTION 3: Railway.app (Single-Platform All-In-One)

1. Go to [railway.app](https://railway.app) $\rightarrow$ **New Project**.
2. Deploy from GitHub Repo.
3. Add a PostgreSQL database service with 1 click.
4. Add your 3 services (`frontend`, `backend`, `ai-service`) pointing to their subdirectories.

---

## 🔒 Security & Best Practices Checklist

- [x] CORS is configured for production domains in Express backend.
- [x] `vercel.json` rewrite rules are enabled for smooth React client-side routing.
- [x] Role authentication guards and bcrypt password hashing active.
- [x] Dockerfiles and container configurations are pre-packaged and ready.
