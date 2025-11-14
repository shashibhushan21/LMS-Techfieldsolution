# Quick Start Script for LMS Portal

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TechFieldSolution LMS - Quick Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js $nodeVersion installed" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js v18 or higher." -ForegroundColor Red
    exit 1
}

# Check npm installation
Write-Host "Checking npm installation..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ npm $npmVersion installed" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found." -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
$mongoCheck = mongosh --eval "db.version()" --quiet 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB not detected. Please ensure MongoDB is running on port 27017" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Install root dependencies
Write-Host "`nInstalling root dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Environment Files..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Copy backend .env.example if .env doesn't exist
if (!(Test-Path "backend/.env")) {
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "✓ Created backend/.env from .env.example" -ForegroundColor Green
    Write-Host "⚠ Please update backend/.env with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "✓ backend/.env already exists" -ForegroundColor Green
}

# Copy frontend .env.local.example if .env.local doesn't exist
if (!(Test-Path "frontend/.env.local")) {
    Copy-Item "frontend/.env.local.example" "frontend/.env.local"
    Write-Host "✓ Created frontend/.env.local from .env.local.example" -ForegroundColor Green
    Write-Host "⚠ Please update frontend/.env.local with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "✓ frontend/.env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update environment files with your configuration:" -ForegroundColor White
Write-Host "   - backend/.env" -ForegroundColor Gray
Write-Host "   - frontend/.env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the development servers:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Access the application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   Backend:  http://localhost:5000/api" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed setup instructions, see SETUP.md" -ForegroundColor Yellow
Write-Host ""
