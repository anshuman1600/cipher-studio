# 🚀 CipherStudio - Deployment Guide

Complete step-by-step guide to deploy CipherStudio on GitHub, Vercel (Frontend), and Render/Railway (Backend).

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [GitHub Repository Setup](#github-repository-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### **Before You Start:**
- [ ] Project is working locally (frontend + backend)
- [ ] MongoDB Atlas account created
- [ ] GitHub account ready
- [ ] Git installed on your computer

### **Required Files (Already Present):**
- [ ] `backend/.env` (with MongoDB URI, JWT secret)
- [ ] `frontend/.env` (optional for local)
- [ ] `.gitignore` (to exclude node_modules, .env)

---

## 🐙 GitHub Repository Setup

### **Step 1: Initialize Git (if not already done)**

```powershell
cd C:\Users\LOQ\OneDrive\Desktop\CipherStudio

# Initialize git repository
git init

# Check .gitignore exists
Get-Content .gitignore
```

### **Step 2: Create .gitignore (if missing)**

Create `.gitignore` in project root:

```gitignore
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.production
backend/.env
frontend/.env

# Build outputs
dist/
build/
*/dist/
*/build/

# Logs
*.log
npm-debug.log*
logs/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Misc
.cache/
.temp/
```

### **Step 3: Create GitHub Repository**

1. Go to **https://github.com**
2. Click **"New Repository"** (Green button)
3. **Repository name:** `cipher-studio` (or your choice)
4. **Description:** `Full-Stack Browser IDE with React, Monaco Editor, and Sandpack`
5. **Visibility:** Public (recommended) or Private
6. **DON'T** initialize with README (we already have one)
7. Click **"Create Repository"**

### **Step 4: Push Code to GitHub**

```powershell
# Add all files
git add .

# Commit
git commit -m "Initial commit: CipherStudio Full-Stack IDE"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cipher-studio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**🎉 Your code is now on GitHub!**

Visit: `https://github.com/YOUR_USERNAME/cipher-studio`

---

## 🖥️ Backend Deployment (Render)

### **Why Render?**
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variables
- ✅ HTTPS included

### **Step 1: Sign Up on Render**

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub account** (recommended)
4. Authorize Render to access your GitHub

### **Step 2: Create New Web Service**

1. Click **"New +"** → **"Web Service"**
2. **Connect Repository:**
   - Click **"Connect account"** if needed
   - Find your repository: `cipher-studio`
   - Click **"Connect"**

### **Step 3: Configure Service**

| Field | Value |
|-------|-------|
| **Name** | `cipherstudio-backend` |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Free** |

### **Step 4: Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"**

Add these:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/cipherstudio` |
| `JWT_SECRET` | `your-super-secret-jwt-key-here-make-it-long-and-random` |
| `PORT` | `5000` (optional, Render assigns port) |
| `NODE_ENV` | `production` |

**How to get MongoDB URI:**
1. Go to **MongoDB Atlas** (https://cloud.mongodb.com)
2. Click your cluster → **"Connect"**
3. Choose **"Connect your application"**
4. Copy connection string
5. Replace `<password>` with your database password

### **Step 5: Deploy Backend**

1. Click **"Create Web Service"**
2. Wait for build (2-3 minutes)
3. You'll see: **"Your service is live 🎉"**
4. Note your backend URL: `https://cipherstudio-backend.onrender.com`

**✅ Backend deployed!**

### **Step 6: Update Backend package.json (Important!)**

Make sure `backend/package.json` has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### **Step 7: Update CORS in Backend**

Update `backend/server.js`:

```javascript
// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app' // Add after frontend deploy
  ],
  credentials: true
}));
```

---

## 🌐 Frontend Deployment (Vercel)

### **Why Vercel?**
- ✅ Free tier (perfect for React)
- ✅ Auto-deploys from GitHub
- ✅ CDN + HTTPS included
- ✅ Made for React/Next.js

### **Step 1: Sign Up on Vercel**

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### **Step 2: Import Project**

1. Click **"Add New..."** → **"Project"**
2. **Import Git Repository:**
   - Find `cipher-studio`
   - Click **"Import"**

### **Step 3: Configure Project**

| Field | Value |
|-------|-------|
| **Project Name** | `cipherstudio` |
| **Framework Preset** | `Vite` (auto-detected) |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### **Step 4: Add Environment Variables**

Click **"Environment Variables"**

Add this:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://cipherstudio-backend.onrender.com` (your backend URL) |

### **Step 5: Deploy Frontend**

1. Click **"Deploy"**
2. Wait for build (1-2 minutes)
3. You'll see: **"Congratulations! 🎉"**
4. Note your frontend URL: `https://cipherstudio.vercel.app`

**✅ Frontend deployed!**

### **Step 6: Update Frontend API URL**

Update `frontend/src/services/api.js`:

```javascript
// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Use this for all API calls
axios.defaults.baseURL = `${API_URL}/api`;
```

### **Step 7: Update Backend CORS (IMPORTANT!)**

Go back to **Render** → Your backend service → **Environment**

Update CORS to allow your Vercel frontend:

Update `backend/server.js`:

```javascript
const cors = require('cors');

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://cipherstudio.vercel.app', // Your Vercel URL
  'https://cipherstudio-*.vercel.app' // Preview deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('*', '')))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**Redeploy backend** after this change:
- Render auto-deploys on GitHub push, OR
- Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔧 Environment Variables Reference

### **Backend (.env on Render):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio
JWT_SECRET=your-super-secret-key-min-32-chars-long
PORT=5000
NODE_ENV=production
```

### **Frontend (Vercel Environment Variables):**
```env
VITE_API_URL=https://cipherstudio-backend.onrender.com
```

---

## 🧪 Post-Deployment Testing

### **Step 1: Test Backend (API Endpoint)**

Open browser and visit:
```
https://cipherstudio-backend.onrender.com/api/auth/me
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Not authorized, no token"
}
```
✅ This means backend is working!

### **Step 2: Test Frontend**

Visit your Vercel URL:
```
https://cipherstudio.vercel.app
```

**Expected:**
- ✅ IDE loads
- ✅ Monaco Editor appears
- ✅ File explorer works
- ✅ Preview panel shows

### **Step 3: Test Registration/Login**

1. Click **"Login"** button
2. Switch to **"Register"** tab
3. Create test account:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test1234`
4. Click **"Register"**

**Expected:**
- ✅ Success message
- ✅ User logged in
- ✅ Username shows in toolbar

### **Step 4: Test Save to Cloud**

1. Create a simple file:
   - `App.js`: `export default function App() { return <h1>Hello World</h1> }`
2. Click **"Save Cloud"**

**Expected:**
- ✅ Success message: "Project saved to cloud!"
- ✅ No CORS errors (check browser console F12)

### **Step 5: Test Load from Cloud**

1. Click **"Load"** button
2. Select your project
3. Project should load with files

**Expected:**
- ✅ Files loaded correctly
- ✅ Code appears in editor

---

## 🐛 Troubleshooting

### **❌ CORS Error (Browser Console)**

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**
1. Update `backend/server.js` CORS config (see Step 7 above)
2. Add your Vercel URL to `allowedOrigins`
3. Redeploy backend on Render

### **❌ Backend "Application Error"**

**Possible Causes:**
1. Environment variables not set
2. MongoDB connection failed
3. Build command wrong

**Fix:**
1. Check Render **Logs** tab
2. Verify **Environment Variables** are set correctly
3. Check `MONGO_URI` is correct (test in MongoDB Compass)

### **❌ Frontend Build Failed (Vercel)**

**Error:**
```
Build failed with exit code 1
```

**Fix:**
1. Check Vercel **Deployment Logs**
2. Make sure `frontend/package.json` has:
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```
3. Ensure all dependencies in `package.json`

### **❌ API Calls to Localhost**

**Problem:** Frontend calling `http://localhost:5000` instead of production URL

**Fix:**
1. Set `VITE_API_URL` in Vercel Environment Variables
2. Update `frontend/src/services/api.js`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```
3. Redeploy frontend

### **❌ MongoDB Connection Failed**

**Error in Render logs:**
```
MongoServerError: bad auth
```

**Fix:**
1. Go to MongoDB Atlas → **Database Access**
2. Create/Update user with correct password
3. Update `MONGO_URI` in Render environment variables
4. **Network Access** → Add IP: `0.0.0.0/0` (allow from anywhere)

### **❌ JWT Secret Error**

**Error:**
```
Error: secretOrPrivateKey must have a value
```

**Fix:**
1. Add `JWT_SECRET` to Render Environment Variables
2. Make it long and random (32+ characters)
3. Example: `super-secret-jwt-key-for-production-only-2025`

---

## 📱 Custom Domain (Optional)

### **Add Custom Domain to Vercel:**

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Add your domain: `cipherstudio.com`
4. Follow DNS instructions
5. Vercel automatically provisions SSL certificate

### **Update Backend CORS:**

Add your custom domain to `allowedOrigins` in `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://cipherstudio.vercel.app',
  'https://cipherstudio.com', // Your custom domain
  'https://www.cipherstudio.com'
];
```

---

## 🔄 Continuous Deployment

### **Auto-Deploy on Git Push:**

Both Render and Vercel auto-deploy when you push to GitHub:

```powershell
# Make changes to your code
git add .
git commit -m "Added new feature"
git push origin main

# ✅ Render auto-deploys backend (2-3 min)
# ✅ Vercel auto-deploys frontend (1-2 min)
```

### **Preview Deployments (Vercel):**

Every GitHub branch gets a preview URL:

```
https://cipherstudio-git-feature-branch.vercel.app
```

---

## 📊 Deployment URLs Summary

| Service | Purpose | URL |
|---------|---------|-----|
| **GitHub** | Source Code | `https://github.com/YOUR_USERNAME/cipher-studio` |
| **Render** | Backend API | `https://cipherstudio-backend.onrender.com` |
| **Vercel** | Frontend App | `https://cipherstudio.vercel.app` |
| **MongoDB** | Database | `mongodb+srv://...mongodb.net/cipherstudio` |

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set (both services)
- [ ] CORS configured correctly
- [ ] MongoDB Network Access allows all IPs
- [ ] Registration/Login works
- [ ] Save to Cloud works
- [ ] Load from Cloud works
- [ ] No console errors

---

## 🎉 Congratulations!

**Your CipherStudio IDE is now LIVE! 🚀**

**Share your links:**
- **Live App:** `https://cipherstudio.vercel.app`
- **GitHub Repo:** `https://github.com/YOUR_USERNAME/cipher-studio`

**Add to README.md:**
```markdown
## 🌐 Live Demo

**Live Application:** https://cipherstudio.vercel.app

**Backend API:** https://cipherstudio-backend.onrender.com

**GitHub Repository:** https://github.com/YOUR_USERNAME/cipher-studio
```

---

## 🎬 Create Demo Video (Optional)

Record 2-3 minute demo showing:
1. **Landing page** (Monaco Editor + Sandpack preview)
2. **File operations** (create, rename, delete files/folders)
3. **Live coding** (write React code, see instant preview)
4. **Authentication** (register/login)
5. **Cloud save** (save project to cloud)
6. **Load project** (restore from cloud)
7. **Theme toggle** (dark/light mode)

**Tools:**
- OBS Studio (free screen recorder)
- Loom (browser-based recording)
- Windows Game Bar (Win + G)

---

**Last Updated:** October 20, 2025  
**Version:** 1.0.0  
**Deployment Status:** ✅ Production Ready
