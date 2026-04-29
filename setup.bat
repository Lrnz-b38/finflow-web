@echo off
REM Setup Script for EWallet Aggregator (Windows)

echo.
echo ========== EWallet Aggregator - Setup Script ==========
echo.

REM Check if Node.js is installed
for /f "tokens=*" %%i in ('node -v 2^>nul') do set NODE_VERSION=%%i
if "%NODE_VERSION%"=="" (
    echo ERROR: Node.js is not installed.
    echo Please install it from https://nodejs.org/
    pause
    exit /b 1
)

echo OK Node.js version: %NODE_VERSION%
for /f "tokens=*" %%i in ('npm -v') do echo OK npm version: %%i
echo.

REM Setup Backend
echo Setting up Backend...
cd backend
call npm install
copy .env.example .env

echo.
echo OK Backend setup complete!
echo.
echo WARNING: Please update backend\.env with:
echo    - MONGODB_URI (local or Atlas)
echo    - JWT_SECRET (your secret key)
echo.

REM Setup Frontend
echo Setting up Frontend...
cd ..
cd frontend
call npm install

echo.
echo OK Frontend setup complete!
echo.

REM Final instructions
echo ======================================================
echo OK Setup Complete!
echo.
echo To start the app:
echo.
echo 1. Start MongoDB (if using local)
echo    mongod
echo.
echo 2. Start Backend (Command Prompt 1)
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend (Command Prompt 2)
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo For detailed instructions, see QUICK_START.md
echo ======================================================
echo.
pause
