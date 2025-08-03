@echo off
echo ===============================================
echo  CMS Safety - HazID Generator Builder
echo ===============================================
echo.
echo This will build the HazID Generator for everyone
echo (your team and other teams).
echo.
pause

echo.
echo [1/3] Checking for Node.js...
where npm
if %errorlevel% neq 0 (
    echo ERROR: Node.js/npm not found!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo [2/3] Building application...
echo This may take a few minutes...
echo.
npm install
call npm run package-win
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    echo.
    echo Common solutions:
    echo - Close any running HazID Generator apps
    echo - Run 'npm install' if dependencies are missing
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] ✅ SUCCESS! Application built
echo.
echo 📁 Location: release-builds\HazID Generator-win32-x64\
echo.
echo 📋 Ready to share:
echo 1. Zip the entire "HazID Generator-win32-x64" folder
echo 2. Share with any team (your team or other teams)
echo 3. Recipients extract and run "HazID Generator.exe"
echo.
echo 💡 Your team can edit Excel files in data\excel\
echo    Other teams just use the app as-is.
echo.
pause

echo.
echo 🚀 Opening release folder...
start "" "release-builds"
echo.
echo Done! Ready to distribute.
pause