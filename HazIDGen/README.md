# HazID Generator

CERN CMS Safety Hazard Identification Generator - A desktop application for creating standardized hazard identification documents.

## Overview

The HazID Generator is a specialized tool designed for CERN CMS Safety activities. It streamlines the process of creating comprehensive hazard identification documents by providing an intuitive interface for:

- Activity form completion
- Hazard selection and risk assessment
- Document upload and management
- Contact information management
- Automated document generation

## Features

- **Modern Desktop Interface**: Built with Electron for cross-platform compatibility
- **Professional Dialog System**: Custom dialog boxes with proper titles and detailed messaging
- **Excel Data Integration**: Automated loading of hazard data from Excel files
- **Document Generation**: Creates formatted Word documents using templates
- **File Management**: Upload and organize supporting documents
- **Contact Management**: Maintain contact information for safety personnel

## System Requirements

- **Windows**: Windows 10 or later
- **macOS**: macOS 10.12 or later  
- **Linux**: Ubuntu 18.04 or later (or equivalent)

## Installation

### Pre-built Releases

Download the latest release for your operating system from the `release-builds` directory:

- **Windows**: `HazID Generator-win32-x64/HazID Generator.exe`
- **macOS**: `HazID Generator-darwin-x64/HazID Generator.app`
- **Linux**: `HazID Generator-linux-x64/HazID Generator`

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HazIDGen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm start
   ```

## Building from Source

### Prerequisites

Before building, ensure you have:
- **Node.js** (v16 or later) - Download from [nodejs.org](https://nodejs.org/)
- **npm** (included with Node.js)
- **Git** (for cloning the repository)

### Quick Build (Windows)

Use the provided batch script for automated building:

```batch
# Double-click rebuild-app.bat or run from command prompt:
rebuild-app.bat
```

The script will automatically:
1. Check Node.js and npm installation
2. Install dependencies (`npm install`)
3. Build the application (`npm run build`)
4. Package for Windows (`npm run package-win`)

### Manual Build Steps

If the batch script doesn't work, follow these manual steps:

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Build the Application
```bash
npm run build
```

#### Step 3: Package for Your Platform

**For Windows:**
```bash
npm run package-win
```

**For Linux:**
```bash
npm run package-linux
```

**For macOS:** (macOS only)
```bash
npm run package-mac
```

**For All Platforms:** (macOS only)
```bash
npm run package-all
```

### Alternative Build Commands

**Clean Build Commands:**
- `npm run clean` - Remove build artifacts
- `npm run rebuild` - Clean and rebuild web assets
- `npm run rebuild-win` - Clean and package for Windows
- `npm run rebuild-mac` - Clean and package for macOS
- `npm run rebuild-linux` - Clean and package for Linux

### Development Commands

- `npm start` - Start development server with hot reload
- `npm run dev` - Start Vite development server only
- `npm run build` - Build web assets for production
- `npm run preview` - Preview production build

### Build Output

Built applications will be available in the `release-builds` directory:

```
release-builds/
├── HazID Generator-win32-x64/
│   └── HazID Generator.exe      # Windows executable
├── HazID Generator-darwin-x64/
│   └── HazID Generator.app      # macOS application
└── HazID Generator-linux-x64/
    └── HazID Generator          # Linux executable
```

### Troubleshooting Build Issues

**Common Issues:**

1. **"Node.js not found"**
   - Install Node.js from [nodejs.org](https://nodejs.org/)
   - Restart your terminal/command prompt
   - Verify with: `node --version`

2. **"npm install fails"**
   - Check internet connection
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

3. **"Build fails"**
   - Ensure all dependencies are installed: `npm install`
   - Check for syntax errors in source files
   - Try clean build: `npm run clean && npm run build`

4. **"Packaging fails"**
   - Ensure build completed successfully first
   - Check disk space (packaging requires significant space)
   - Try: `npm run clean && npm run package-win`

**Platform-Specific Notes:**
- **Windows**: Use `npm run package-win` for best compatibility
- **macOS**: All commands work, can build for all platforms
- **Linux**: Use `npm run package-win` or `npm run package-linux`

## Project Structure

```
HazIDGen/
├── data/                    # Data files and Excel sheets
│   └── excel/              # Hazard data and recommendations
├── electron/               # Electron main process files
│   ├── main.cjs            # Main electron process
│   └── preload.js          # Preload script for renderer communication
├── public/                 # Static assets and backend scripts
│   ├── generate_docx.py    # Python document generation script
│   └── hazard-document-generator.cjs  # Node.js document generator
├── src/                    # React application source
│   ├── components/         # React components
│   ├── utils/             # Utility functions
│   ├── assets/            # Images and templates
│   └── App.jsx            # Main application component
├── uploads/               # User uploaded files storage
└── release-builds/        # Built applications for distribution
```

## Technology Stack

- **Frontend**: React 18 with Vite
- **Desktop**: Electron 25
- **Styling**: Tailwind CSS
- **Document Generation**: docx library, python-docx
- **Data Processing**: xlsx library for Excel file handling
- **Icons**: Lucide React

## Usage

1. **Launch the Application**
   - Run the executable or use `npm start` for development

2. **Complete Activity Form**
   - Fill in project details, dates, and personnel information
   - Select appropriate activity types and locations

3. **Select Hazards**
   - Choose relevant hazards from the categorized lists
   - Review and modify risk assessments as needed

4. **Upload Documents**
   - Add supporting documentation using drag-and-drop interface
   - Organize files by category

5. **Manage Contacts**
   - Add safety personnel and contact information
   - Assign roles and responsibilities

6. **Generate Document**
   - Click "Export Document" to create formatted Word document
   - Save to desired location

## Configuration

The application uses Excel files in the `data/excel/` directory for:

- **CMS_Safety-List_Preventive_Protective_Measures.xlsx**: Hazard definitions and safety measures
- **CMS_Safety-Location_TSO_Links_Reference.xlsx**: Technical safety recommendations

## Developer Guide

### Development Environment Setup

#### Prerequisites
- **Node.js** (v16 or later) - [Download](https://nodejs.org/)
- **Git** - Version control
- **Code Editor** - VS Code recommended with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

#### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd HazIDGen

# Install dependencies
npm install

# Start development server
npm start
```

### Architecture Overview

The HazID Generator follows a modern desktop application architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Electron       │    │   Backend       │
│   (React/Vite)  │◄──►│   Main Process   │◄──►│   File System   │
│                 │    │                  │    │   Document Gen  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### Core Components
- **React Frontend**: User interface built with React 18 and Tailwind CSS
- **Electron Main Process**: Desktop application wrapper and system integration
- **Document Generation**: Word document creation using docx library
- **Data Management**: Excel file processing with xlsx library
- **File Handling**: Upload/download functionality with file-saver

### Project Structure Deep Dive

```
HazIDGen/
├── electron/
│   ├── main.cjs              # Main Electron process
│   └── preload.js            # Renderer-main communication bridge
├── src/
│   ├── components/           # React components
│   │   ├── ActivityForm.jsx      # Project information form
│   │   ├── HazardSelection.jsx   # Hazard selection interface
│   │   ├── DocumentUpload.jsx    # File upload component
│   │   ├── ContactsInfo.jsx      # Contact management
│   │   ├── ActionButtons.jsx     # Export/save controls
│   │   └── Header.jsx            # Application header
│   ├── utils/
│   │   ├── hazardLoader.js       # Excel data processing
│   │   └── dateUtils.js          # Date formatting utilities
│   ├── assets/
│   │   ├── Template.docx         # Word document template
│   │   └── *.{ico,png,icns}      # Application icons
│   ├── App.jsx               # Main application component
│   └── main.jsx              # React application entry point
├── public/
│   ├── hazard-document-generator.cjs  # Document generation backend
│   └── generate_docx.py              # Python document generator
├── data/excel/               # Hazard data Excel files
└── uploads/                  # User uploaded files storage
```

### Development Workflow

#### Running in Development Mode
```bash
# Start development server with hot reload
npm start

# Alternative: Start Vite dev server only
npm run dev

# Alternative: Start Electron with Vite dev server
npm run electron-dev
```

#### Code Style and Standards
- **ESLint**: Configured for React and modern JavaScript
- **Prettier**: Code formatting (run `npm run format` if available)
- **File Naming**: PascalCase for components, camelCase for utilities
- **Import Order**: External libraries, internal components, utilities, assets

#### State Management
- **Local State**: React useState for component-level state
- **Props**: Data passing between parent/child components
- **Context**: Minimal usage, mainly for app-wide settings
- **File System**: Persistent data stored in uploads/ directory

### Key Development Areas

#### 1. Adding New Hazards
To add new hazards to the system:

1. **Update Excel Files**: Modify `data/excel/CMS_Safety-List_Preventive_Protective_Measures.xlsx`
2. **Data Structure**: Follow existing column format:
   - Hazard ID, Category, Description, Risk Level, Preventive Measures
3. **Restart Application**: Changes require application restart to reload data

#### 2. Customizing Document Templates
Document generation uses multiple approaches:

**Method 1: docx Library (Recommended)**
- Edit `public/hazard-document-generator.cjs`
- Use docx library for programmatic document creation
- Supports complex formatting and dynamic content

**Method 2: Template Replacement**
- Modify `src/assets/Template.docx`
- Use placeholder text for dynamic content replacement
- Limited formatting flexibility

#### 3. Adding New Components
```bash
# Create new component
touch src/components/NewComponent.jsx

# Basic component structure
import React from 'react';

const NewComponent = ({ props }) => {
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
};

export default NewComponent;
```

#### 4. Electron Integration
Key Electron concepts for this application:

**Main Process** (`electron/main.cjs`):
- Window management
- File system access
- Menu and dialog handling

**Preload Script** (`electron/preload.js`):
- Security bridge between main and renderer
- Exposed APIs for file operations

**Renderer Process** (React app):
- User interface
- Business logic
- Communication with main process via preload APIs

### Build and Packaging

#### Development Builds
```bash
# Build web assets only
npm run build

# Preview production build
npm run preview
```

#### Production Packaging
```bash
# Clean previous builds
npm run clean

# Package for specific platforms
npm run package-win      # Windows
npm run package-mac      # macOS (macOS only)
npm run package-linux    # Linux

# Clean build and package
npm run rebuild-win      # Clean + package Windows
npm run rebuild-mac      # Clean + package macOS
npm run rebuild-linux    # Clean + package Linux
```

### Testing and Quality Assurance

#### Manual Testing Checklist
- [ ] Application starts without errors
- [ ] All form fields accept input correctly
- [ ] Hazard selection loads from Excel files
- [ ] File upload works with various file types
- [ ] Document generation creates valid Word files
- [ ] Contact management functions properly
- [ ] Export functionality saves files correctly

#### Performance Considerations
- **Large Excel Files**: Optimize hazardLoader.js for large datasets
- **File Uploads**: Implement file size limits and compression
- **Memory Usage**: Monitor Electron memory consumption
- **Startup Time**: Minimize initial load time

### Debugging

#### Development Tools
```bash
# Enable Electron DevTools
export NODE_ENV=development
npm start
# Press F12 or Ctrl+Shift+I to open DevTools
```

#### Common Issues
1. **Excel Data Not Loading**: Check file paths and permissions
2. **Document Generation Fails**: Verify template file exists
3. **Electron Build Issues**: Clear node_modules and reinstall
4. **File Upload Problems**: Check uploads/ directory permissions

#### Logging
Add debug logging to components:
```javascript
console.log('Debug info:', data);
console.error('Error occurred:', error);
```

### Deployment and Distribution

#### Creating Releases
1. **Version Bump**: Update version in `package.json`
2. **Build All Platforms**: Run platform-specific build commands
3. **Test Builds**: Verify each platform build works correctly
4. **Package Distribution**: Create archives or installers
5. **Documentation**: Update changelog and user guides

#### Platform-Specific Notes
- **Windows**: Code signing recommended for production
- **macOS**: Notarization required for distribution outside App Store
- **Linux**: Consider creating AppImage or Snap packages

### API Documentation

#### Exposed Electron APIs (via preload.js)
```javascript
// File operations
window.electronAPI.selectFile()
window.electronAPI.saveFile(content)
window.electronAPI.readFile(path)

// System integration
window.electronAPI.showDialog(options)
window.electronAPI.openExternal(url)
```

### Contributing Guidelines

#### Code Contribution Process
1. **Fork Repository**: Create your own fork
2. **Feature Branch**: `git checkout -b feature/your-feature-name`
3. **Development**: Make changes following code standards
4. **Testing**: Ensure all functionality works correctly
5. **Documentation**: Update relevant documentation
6. **Pull Request**: Submit PR with detailed description

#### Commit Message Format
```
type(scope): brief description

Detailed explanation of changes made and why.

- Bullet points for multiple changes
- Reference issues: Fixes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

#### Code Review Checklist
- [ ] Code follows project style guidelines
- [ ] All new features have adequate testing
- [ ] Documentation updated where necessary
- [ ] No console errors or warnings
- [ ] Performance impact considered
- [ ] Security implications reviewed

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the Developer Guide above
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Support

For issues and support:

1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Include system information and steps to reproduce

## License

This project is developed for CERN CMS Safety activities. Please refer to CERN policies for usage and distribution guidelines.

## Version History

- **v1.0.0** - Initial release with core functionality
  - Activity form management
  - Hazard selection interface
  - Document generation capabilities
  - Cross-platform desktop application

---

**Developed for CERN CMS Safety Team**