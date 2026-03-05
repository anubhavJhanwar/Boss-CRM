@echo off
echo ========================================
echo Firebase Migration - Installation Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing Mobile Dependencies...
cd ..\mobile
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Mobile installation failed!
    pause
    exit /b 1
)
echo Mobile dependencies installed successfully!
echo.

echo [3/4] Checking Configuration Files...
cd ..
if not exist "backend\firebase-service-account.json" (
    echo WARNING: firebase-service-account.json not found in backend folder!
    echo You need to download this from Firebase Console.
    echo.
)

if not exist "backend\.env" (
    echo WARNING: .env file not found in backend folder!
    echo.
)

echo [4/4] Installation Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Setup Firebase (follow FIREBASE_SETUP_GUIDE.md)
echo 2. Download firebase-service-account.json to backend folder
echo 3. Update backend/.env with Firebase configuration
echo 4. Update mobile/config/firebase.ts with Firebase configuration
echo 5. Run: cd backend ^&^& npm start
echo 6. Run: cd mobile ^&^& npm start
echo.
echo For detailed instructions, see:
echo - QUICK_START.md (15-minute guide)
echo - SETUP_CHECKLIST.md (step-by-step checklist)
echo - FIREBASE_SETUP_GUIDE.md (complete guide)
echo ========================================
echo.
pause
