# HazIDGen Rebuild Scripts

This document explains how to use the rebuild scripts for the HazIDGen application.

## Overview

The HazIDGen application includes two rebuild scripts that automate the process of building and packaging the application for distribution:

- `rebuild-app.bat` - Windows batch script
- `rebuild-app.sh` - Unix/Linux/macOS shell script

## Prerequisites

Before running the rebuild scripts, ensure you have:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

## Quick Start

### Windows Users

1. Open Command Prompt or PowerShell
2. Navigate to the HazIDGen project directory
3. Run the rebuild script:
   ```cmd
   rebuild-app.bat
   ```

### Unix/Linux/macOS Users

1. Open Terminal
2. Navigate to the HazIDGen project directory
3. Make the script executable (first time only):
   ```bash
   chmod +x rebuild-app.sh
   ```
4. Run the rebuild script:
   ```bash
   ./rebuild-app.sh
   ```

## What the Scripts Do

Both scripts perform the following steps in order:

1. **Check Prerequisites**
   - Verify Node.js and npm are installed
   - Check if running from the correct directory

2. **Install Dependencies**
   - Run `npm install` to install all required packages

3. **Build Application**
   - Run `npm run build` to create the production build

4. **Package Application**
   - Windows: Run `npm run package-win`
   - macOS: Run `npm run package-mac`
   - Linux: Run `npm run package-linux`

## Output

After successful completion, you'll find the packaged application in:

```
release-builds/
├── HazID Generator-win32-x64/     # Windows executable
├── HazID Generator-darwin-x64/    # macOS application
└── HazID Generator-linux-x64/     # Linux executable
```

## Troubleshooting

### Common Issues

1. **"Node.js is not found"**
   - Install Node.js from https://nodejs.org/
   - Ensure it's added to your system PATH

2. **"npm install failed"**
   - Check your internet connection
   - Try clearing npm cache: `npm cache clean --force`
   - Delete `node_modules` folder and run `npm install` again

3. **"Build failed"**
   - Check for syntax errors in your code
   - Ensure all dependencies are properly installed
   - Check the console output for specific error messages

4. **"Packaging failed"**
   - Ensure you have sufficient disk space
   - Check that all required assets exist
   - Verify icon files are in the correct location

### Manual Steps

If the automated scripts fail, you can run the steps manually:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Package for your platform
npm run package-win    # Windows
npm run package-mac    # macOS
npm run package-linux  # Linux
```

## Additional Scripts

The `package.json` includes several additional scripts:

- `npm run clean` - Remove build artifacts
- `npm run rebuild` - Clean and rebuild
- `npm run rebuild-win` - Clean and rebuild for Windows
- `npm run rebuild-mac` - Clean and rebuild for macOS
- `npm run rebuild-linux` - Clean and rebuild for Linux

## Development

For development, use these commands:

```bash
# Start development server
npm run dev

# Start Electron in development mode
npm run electron-dev

# Build and start Electron
npm run start
```

## Support

If you encounter issues with the rebuild scripts:

1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Ensure you're running from the correct directory
4. Try running the manual steps to isolate the issue

For additional support, contact the CERN CMS Safety team. 