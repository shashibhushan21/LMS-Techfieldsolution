#!/bin/bash

# Quick Start Script for LMS Portal (Linux/Mac)

echo "========================================"
echo "TechFieldSolution LMS - Quick Setup"
echo "========================================"
echo ""

# Check Node.js installation
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js $NODE_VERSION installed"
else
    echo "✗ Node.js not found. Please install Node.js v18 or higher."
    exit 1
fi

# Check npm installation
echo "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm $NPM_VERSION installed"
else
    echo "✗ npm not found."
    exit 1
fi

# Check MongoDB
echo "Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.version()" --quiet &> /dev/null; then
        echo "✓ MongoDB is running"
    else
        echo "⚠ MongoDB not running. Please start MongoDB on port 27017"
    fi
else
    echo "⚠ MongoDB not detected. Please ensure MongoDB is installed and running"
fi

echo ""
echo "========================================"
echo "Installing Dependencies..."
echo "========================================"

# Install root dependencies
echo ""
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "========================================"
echo "Setting up Environment Files..."
echo "========================================"

# Copy backend .env.example if .env doesn't exist
if [ ! -f "backend/.env" ]; then
    cp "backend/.env.example" "backend/.env"
    echo "✓ Created backend/.env from .env.example"
    echo "⚠ Please update backend/.env with your configuration"
else
    echo "✓ backend/.env already exists"
fi

# Copy frontend .env.local.example if .env.local doesn't exist
if [ ! -f "frontend/.env.local" ]; then
    cp "frontend/.env.local.example" "frontend/.env.local"
    echo "✓ Created frontend/.env.local from .env.local.example"
    echo "⚠ Please update frontend/.env.local with your configuration"
else
    echo "✓ frontend/.env.local already exists"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Update environment files with your configuration:"
echo "   - backend/.env"
echo "   - frontend/.env.local"
echo ""
echo "2. Start the development servers:"
echo "   npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000/api"
echo ""
echo "For detailed setup instructions, see SETUP.md"
echo ""
