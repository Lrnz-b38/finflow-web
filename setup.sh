#!/bin/bash

# Setup Script for EWallet Aggregator

echo "🚀 EWallet Aggregator - Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend
npm install
cp .env.example .env

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "⚠️  Please update backend/.env with:"
echo "   - MONGODB_URI (local or Atlas)"
echo "   - JWT_SECRET (your secret key)"
echo ""

# Setup Frontend
echo "🔧 Setting up Frontend..."
cd ../frontend
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""

# Final instructions
echo "======================================"
echo "✅ Setup Complete!"
echo ""
echo "To start the app:"
echo ""
echo "1. Start MongoDB (if using local)"
echo "   $ mongod"
echo ""
echo "2. Start Backend (Terminal 1)"
echo "   $ cd backend && npm run dev"
echo ""
echo "3. Start Frontend (Terminal 2)"
echo "   $ cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see QUICK_START.md"
echo "======================================"
