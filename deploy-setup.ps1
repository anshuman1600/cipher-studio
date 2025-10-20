# 🚀 Quick Deployment Script
# Run these commands step-by-step

Write-Host "🚀 CipherStudio Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if git is initialized
Write-Host "Step 1: Checking Git status..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
} else {
    Write-Host "❌ Git not initialized. Initializing..." -ForegroundColor Red
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}
Write-Host ""

# Step 2: Check .gitignore
Write-Host "Step 2: Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path .gitignore) {
    Write-Host "✅ .gitignore exists" -ForegroundColor Green
} else {
    Write-Host "❌ .gitignore missing!" -ForegroundColor Red
}
Write-Host ""

# Step 3: Check for .env files (should NOT be committed)
Write-Host "Step 3: Checking for .env files..." -ForegroundColor Yellow
if (Test-Path backend/.env) {
    Write-Host "⚠️  backend/.env found (will be ignored by git)" -ForegroundColor Yellow
} else {
    Write-Host "❌ backend/.env not found - you need to create it for local development" -ForegroundColor Red
}
Write-Host ""

# Step 4: Add all files
Write-Host "Step 4: Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added" -ForegroundColor Green
Write-Host ""

# Step 5: Show status
Write-Host "Step 5: Git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 6: Commit
Write-Host "Step 6: Creating commit..." -ForegroundColor Yellow
$commitMessage = "feat: Initial commit - CipherStudio Full-Stack IDE"
git commit -m $commitMessage
Write-Host "✅ Committed: $commitMessage" -ForegroundColor Green
Write-Host ""

# Step 7: Instructions for GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📋 NEXT STEPS - GitHub Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: cipher-studio" -ForegroundColor White
Write-Host "3. Make it Public" -ForegroundColor White
Write-Host "4. DON'T initialize with README" -ForegroundColor White
Write-Host "5. Click 'Create Repository'" -ForegroundColor White
Write-Host ""
Write-Host "Then run these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/cipher-studio.git" -ForegroundColor Green
Write-Host "git branch -M main" -ForegroundColor Green
Write-Host "git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "Replace YOUR_USERNAME with your actual GitHub username!" -ForegroundColor Red
Write-Host ""

# Step 8: Deployment services
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🌐 DEPLOYMENT SERVICES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend (Choose ONE):" -ForegroundColor Yellow
Write-Host "  • Render:  https://render.com  (Recommended)" -ForegroundColor White
Write-Host "  • Railway: https://railway.app" -ForegroundColor White
Write-Host "  • Heroku:  https://heroku.com" -ForegroundColor White
Write-Host ""
Write-Host "Frontend:" -ForegroundColor Yellow
Write-Host "  • Vercel:  https://vercel.com  (Recommended)" -ForegroundColor White
Write-Host "  • Netlify: https://netlify.com" -ForegroundColor White
Write-Host ""
Write-Host "Database:" -ForegroundColor Yellow
Write-Host "  • MongoDB Atlas: https://cloud.mongodb.com  (Already set up)" -ForegroundColor White
Write-Host ""

# Step 9: Environment variables reminder
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔐 ENVIRONMENT VARIABLES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend (Render):" -ForegroundColor Yellow
Write-Host "  MONGO_URI=your-mongodb-connection-string" -ForegroundColor White
Write-Host "  JWT_SECRET=your-super-secret-key" -ForegroundColor White
Write-Host "  NODE_ENV=production" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (Vercel):" -ForegroundColor Yellow
Write-Host "  VITE_API_URL=https://your-backend-url.onrender.com" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Git setup complete!" -ForegroundColor Green
Write-Host "📖 Full guide: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
