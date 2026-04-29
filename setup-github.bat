@echo off
REM GitHub Deployment Setup Script for EWallet Aggregator

echo.
echo ========== GitHub Deployment Setup ==========
echo.

REM Check if git is initialized
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git repository not found.
    echo Please initialize git first: git init
    pause
    exit /b 1
)

echo OK Git repository found
echo.

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: No remote origin found.
    echo Please add your GitHub repository:
    echo git remote add origin https://github.com/yourusername/yourrepo.git
    echo.
)

echo Current remotes:
git remote -v
echo.

echo ========== Setup Complete ==========
echo.
echo Next steps:
echo 1. Push your code to GitHub: git push -u origin main
echo 2. Set up GitHub Secrets (see DEPLOYMENT.md)
echo 3. Push changes to trigger automatic deployment
echo.
echo Your workflows are ready in .github/workflows/
echo - deploy.yml: Combined testing + deployment
echo - frontend-deploy.yml: Frontend only
echo - backend-deploy.yml: Backend only
echo.
pause