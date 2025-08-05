@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    HazIDGen Application Builder
echo    CERN CMS Safety - Version 1.0.0
echo ========================================
echo.
echo Build started at: %DATE% %TIME%
echo Current directory: %CD%
echo.

:: Check if we're in the correct directory
if not exist "package.json" (
    echo ERROR: package.json not found in current directory
    echo Please run this script from the HazIDGen project root directory
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking Node.js and npm availability...
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not found or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo Current PATH: %PATH%
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js found: !NODE_VERSION!
)

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: npm is not found or not in PATH
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm found: !NPM_VERSION!
)

echo.
echo [2/4] Installing dependencies...
echo ========================================
npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: npm install failed with exit code %errorlevel%
    echo Please check your internet connection and try again
    echo.
    pause
    exit /b %errorlevel%
) else (
    echo.
    echo ✅ Dependencies installed successfully!
)

echo.
echo [3/4] Building application...
echo ========================================
npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Build failed with exit code %errorlevel%
    echo Please check the build configuration and try again
    echo.
    pause
    exit /b %errorlevel%
) else (
    echo.
    echo ✅ Build completed successfully!
)

echo.
echo [4/4] Packaging for Windows...
echo ========================================
npm run package-win
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Packaging failed with exit code %errorlevel%
    echo Please check the packaging configuration and try again
    echo.
    pause
    exit /b %errorlevel%
) else (
    echo.
    echo ✅ Packaging completed successfully!
)

echo.
echo ========================================
echo    🎉 BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo 📁 The standalone executable is located at:
echo    %CD%\release-builds\HazID Generator-win32-x64\HazID Generator.exe
echo.
echo 🚀 You can now run the application by:
echo    1. Navigating to the release-builds folder
echo    2. Double-clicking "HazID Generator.exe"
echo.
echo 📋 Build completed at: %DATE% %TIME%
echo.
pause