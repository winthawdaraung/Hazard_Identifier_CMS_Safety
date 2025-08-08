# HazID Generator

CERN CMS Safety Hazard Identification Generator - A comprehensive desktop application for creating standardized hazard identification documents with advanced features and seamless workflow integration.

## Overview

The HazID Generator is a specialized tool designed for CERN CMS Safety activities. It streamlines the process of creating comprehensive hazard identification documents by providing an intuitive interface for activity management, risk assessment, and automated documentation.

## ✨ Key Features

### 📋 **Document Generation & Export**
- **Dual Export System**: Generates both final DOCX documents and loadable JSON draft files
- **Professional Word Documents**: Creates properly formatted safety reports with CERN branding
- **Left-aligned Table Content**: Improved readability with properly aligned table data
- **Draft Management**: Save and reload work-in-progress documents
- **Automated File Naming**: Smart naming based on project title and date

### 🎯 **Hazard Management**
- **Excel Data Integration**: Loads hazard definitions and HSE links from external Excel files
- **Smart Mapping**: Handles spelling variations (e.g., "non-ionizing" vs "non ionizing")
- **Complete Hazard Definitions**: All hazard categories include definitions and HSE documentation links
- **Real-time Validation**: Instant feedback on hazard selection and form completion
- **Categorized Display**: Organized hazard types with clear descriptions

### 🛠️ **Application Features**
- **Modern Desktop Interface**: Built with Electron 25 and React 18
- **Cross-platform Compatibility**: Windows, macOS, and Linux support
- **Professional Menu System**: Full application menu with working Tools options
- **Excel Data Validation**: Built-in tools to check and validate Excel data files
- **External Data Support**: Users can modify Excel files for custom hazard definitions
- **Smart Form Validation**: Progress tracking and completion indicators

### 📁 **File & Data Management**
- **Uploads Folder**: Organized file storage with automatic folder creation
- **External Excel Support**: Modify hazard data without rebuilding the application
- **Data Folder Management**: Tools to create and manage external data directories
- **Backup System**: Original embedded files preserved as fallbacks
- **File System Integration**: Direct access to uploads and data folders from menu

### 🔧 **Developer & Power User Features**
- **Build System**: Automated Python executable generation
- **Portable Distribution**: Self-contained application requiring no installation
- **Debug Tools**: Excel data checker and form validation tools
- **Menu Integration**: Access to all features through professional application menus
- **Error Handling**: Comprehensive error messages and user guidance

## System Requirements

- **Windows**: Windows 10 or later (recommended)
- **macOS**: macOS 10.12 or later  
- **Linux**: Ubuntu 18.04 or later (or equivalent)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 500MB free space for application and data files
- **Python**: Not required - included as standalone executable

## Installation & Distribution

### ✅ **Option 1: Portable Application (Recommended)**

The HazID Generator is distributed as a **portable application** - no installation required!

**For Windows:**
1. Navigate to `app\HazID Generator-win32-x64\`
2. Double-click `HazID Generator.exe` to run
3. **No admin rights needed** - runs immediately

**For macOS:**
1. Navigate to `app/HazID Generator-darwin-x64/`
2. Double-click `HazID Generator.app` to run

**For Linux:**
1. Navigate to `app/HazID Generator-linux-x64/`
2. Run `./HazID Generator` from terminal or file manager

### 📦 **What's Included**

The portable application contains everything needed:
- ✅ **Main Application** - Electron desktop app
- ✅ **Python Runtime** - Document generation engine
- ✅ **Excel Data Files** - Hazard definitions and HSE links
- ✅ **Templates & Assets** - CERN logos, document templates
- ✅ **All Dependencies** - Node.js runtime, libraries

### 🌐 **Network Distribution**

**For Organizations:**
- Copy the entire application folder to network drives
- Users can run directly from shared locations
- No individual installations needed
- Centralized updates by replacing the folder

**For Individual Use:**
- Copy to USB drives for offline distribution
- Works on any compatible computer
- No internet connection required for operation

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

Built applications will be available in the `app` directory:

```
app/
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
└── app/                   # Built applications for distribution
```

## Technology Stack

- **Frontend**: React 18 with Vite
- **Desktop**: Electron 25
- **Styling**: Tailwind CSS
- **Document Generation**: docx library, python-docx
- **Data Processing**: xlsx library for Excel file handling
- **Icons**: Lucide React

## 📘 Usage Guide

### 🚀 **Getting Started**

1. **Launch the Application**
   - Double-click `HazID Generator.exe` (Windows) or equivalent
   - Application opens with the main form interface

2. **Application Interface Overview**
   - **Header**: CERN CMS Safety branding and application title
   - **Navigation Steps**: Progress indicator (Step 1 of 4)
   - **Form Sections**: Activity details, hazard selection, documents, contacts
   - **Action Buttons**: Previous, Next, Save Draft, Load Draft, Export

### 📝 **Step 1: Activity Information**

Fill in the project details:
- **Title** ⭐ (Required): Project or activity name
- **Creator Information** ⭐ (Required): Your name and department
- **Responsible Person** ⭐ (Required): Activity supervisor
- **Dates** ⭐ (Required): Start date (end date optional)
- **Location Details** ⭐ (Required): Building, room, specific location
- **Additional Info**: Participant count, CERN/CMS support contacts

**💡 Tip**: Required fields are marked with ⭐ and must be completed to proceed.

### ⚠️ **Step 2: Hazard Selection**

Choose applicable hazards from categorized lists:
- **Hazard Categories**: Biological, Chemical, Electrical, Fire, Mechanical, etc.
- **Specific Hazards**: Each category contains specific hazard types
- **Definitions Available**: Click on hazards to see definitions and HSE links
- **Multiple Selection**: Select all relevant hazards for your activity

**Available Hazard Categories:**
- 🧪 **Chemical**: Chemical substances, reactions, storage
- ⚡ **Electrical**: High/low voltage, electrical equipment
- 🔥 **Fire**: Flammable materials, ignition sources
- ⚙️ **Mechanical**: Moving parts, pressure systems, tools
- ☢️ **Ionizing Radiation**: Radioactive sources, classified areas
- 📡 **Non-Ionizing Radiation**: Lasers, magnetic fields, RF radiation
- 🦠 **Biological**: Organisms, biohazards, contamination
- 🏗️ **Work Conditions**: Confined spaces, heights, ergonomics
- 🌍 **Environmental Protection**: Waste, emissions, spills
- 🚨 **Emergency Preparedness**: Evacuation, response procedures
- 📋 **General**: Standard safety requirements
- ❓ **Other Hazards**: Additional unlisted hazards

### 📁 **Step 3: Document Upload** (Optional)

Upload supporting documentation:
- **Drag & Drop**: Drag files directly onto the upload area
- **File Browser**: Click to select files from your computer
- **Supported Types**: PDF, Word, Excel, images, text files
- **Organization**: Files are stored in the uploads folder
- **Management**: View, organize, and remove uploaded files

### 👥 **Step 4: Contact Information**

Add relevant safety personnel:
- **Safety Contacts**: TSO, HSE personnel, emergency contacts
- **Role Assignment**: Specify responsibilities for each contact
- **Contact Details**: Names, departments, phone numbers, emails
- **Auto-population**: Some contacts filled from Excel data based on location

### 💾 **Draft Management**

**Save Draft:**
- Click "Save Draft" button at any time
- Saves current progress to JSON file
- Allows resuming work later
- Files saved to system documents folder

**Load Draft:**
- Click "Load Draft" button
- Select previously saved JSON draft file
- All form data and selections restored
- Continue where you left off

### 📄 **Document Export**

**Export Process:**
1. Complete all required fields (⭐ marked)
2. Select relevant hazards
3. Click "Export Document" button
4. Choose save location and filename

**Generated Files:**
- **Final Document**: `ProjectName.docx` - Professional Word document
- **Draft File**: `ProjectName_DRAFT.json` - Loadable for future editing

**Document Contents:**
- 📋 **Cover Page**: Title, location, date, responsible persons
- 📝 **Activity Details**: Complete project information
- ⚠️ **Hazard Analysis**: Selected hazards with safety measures
- 📞 **Contact Information**: Relevant safety personnel
- 🏢 **CERN Branding**: Professional formatting with logos

### 🛠️ **Application Menu Features**

**File Menu:**
- **New Document** (Ctrl+N): Clear form and start fresh
- **Save Draft** (Ctrl+S): Save current progress
- **Load Draft** (Ctrl+O): Load saved draft
- **Export Document** (Ctrl+E): Generate final document
- **Open Uploads Folder**: Access uploaded files directory

**Tools Menu:**
- **Check Excel Data**: Validate hazard data files
- **Validate Form Data**: Check form completion status
- **Create/Open External Data Folder**: Manage custom Excel files

**View Menu:**
- **Zoom In/Out**: Adjust interface scaling
- **Toggle Fullscreen** (F11): Fullscreen mode
- **Reset Zoom**: Return to default size

### 🔧 **Advanced Features**

**Custom Hazard Data:**
1. Use "Tools → Create/Open External Data Folder"
2. Modify Excel files in the created `data/excel/` folder
3. Add custom hazards, update safety measures
4. Restart application to load changes

**Excel File Structure:**
- **HSE Sheet**: Hazard categories, definitions, HSE links
- **ENG List of hazards**: Detailed preventive measures
- **Hazards Reference**: Additional reference information

**Troubleshooting:**
- **Menu not working**: Check "Tools → Check Excel Data" for file issues
- **Missing definitions**: Verify Excel files in data folder
- **Export fails**: Ensure all required fields completed
- **Performance issues**: Close and restart application

### 💡 **Pro Tips**

1. **Save Frequently**: Use Ctrl+S to save drafts regularly
2. **Use Templates**: Export one document as template for similar projects
3. **Batch Processing**: Load drafts to quickly create multiple similar documents
4. **Data Validation**: Use Tools menu to verify Excel data integrity
5. **File Organization**: Use meaningful names for easy document management
6. **Backup Data**: Keep copies of custom Excel files and important drafts

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

## 📋 Version History & Features

### **v1.0.0** - Current Release
**🎉 Complete Feature Set with Advanced Capabilities**

#### **✨ New Features**
- **Dual Export System**: Generate both final DOCX and loadable JSON drafts
- **Smart Hazard Mapping**: Fixed "Non-Ionizing Radiation" and other hazard definition issues
- **Left-aligned Tables**: Improved document readability with proper table alignment
- **Working Menu System**: All application menu items now fully functional
- **Excel Data Validation**: Built-in tools to check and validate hazard data files
- **External Data Support**: Users can modify Excel files without rebuilding app
- **Automatic Folder Creation**: Smart folder management for uploads and data
- **Professional Error Handling**: Comprehensive error messages and user guidance

#### **🔧 Technical Improvements**
- **Python Executable Integration**: Standalone DOCX generation without Python installation
- **Portable Distribution**: Self-contained application requiring no installation
- **Enhanced Build System**: Automated compilation and packaging
- **Cross-platform Compatibility**: Windows, macOS, and Linux support
- **Modern Tech Stack**: Electron 25, React 18, Vite build system

#### **🛠️ Core Functionality**
- **Activity Form Management**: Complete project information handling
- **Advanced Hazard Selection**: Categorized hazards with definitions and HSE links
- **Document Upload System**: Drag-and-drop file management
- **Contact Management**: Safety personnel and contact information
- **Professional Document Generation**: CERN-branded Word documents
- **Draft Save/Load**: Persistent work sessions with JSON format

#### **📁 File & Data Management**
- **External Excel Files**: Modify hazard data in `data/excel/` folder
- **HSE Integration**: Direct links to CERN HSE documentation
- **Backup System**: Original embedded files preserved as fallbacks
- **Upload Organization**: Structured file storage with automatic categorization

#### **🎯 User Experience**
- **Step-by-step Workflow**: Guided 4-step process with progress tracking
- **Real-time Validation**: Instant feedback on form completion
- **Professional Interface**: CERN CMS Safety branding and styling
- **Keyboard Shortcuts**: Full menu system with accelerator keys
- **Accessibility**: Clear navigation and user-friendly error messages

#### **🔍 Quality Assurance**
- **Comprehensive Testing**: All features tested and validated
- **Error Recovery**: Robust handling of edge cases and user errors
- **Performance Optimization**: Fast startup and responsive interface
- **Data Integrity**: Validation and verification of all user inputs

## 🚀 Future Roadmap

**Planned Enhancements:**
- **Template Customization**: User-defined document templates
- **Advanced Export Options**: PDF generation, custom formats
- **Integration Features**: API connections to CERN systems
- **Multi-language Support**: French and German translations
- **Enhanced Reporting**: Analytics and usage statistics
- **Cloud Synchronization**: Optional cloud storage for drafts

## 📞 Support & Contact

**For Technical Support:**
- Check existing issues in the repository
- Create detailed bug reports with system information
- Include steps to reproduce any problems

**For Feature Requests:**
- Submit enhancement proposals through issue tracker
- Provide use cases and expected benefits
- Consider contributing to development

**CERN CMS Safety Team:**
- Internal CERN users: Contact through standard CERN channels
- External collaborators: Use repository issue system

---

## 🏆 Acknowledgments

**Development Team:**
- **Win Thawdar Aung** - Lead Developer, CMS Safety Team Summer Student 2025
- **CERN CMS Safety Team** - Requirements, testing, and validation
- **CERN HSE Department** - Safety standards and documentation integration

**Technology Partners:**
- **Electron Framework** - Cross-platform desktop application
- **React Ecosystem** - Modern user interface development
- **Python-docx** - Professional document generation
- **CERN IT Services** - Development infrastructure and support

**Special Thanks:**
- CERN Summer Student Programme 2025
- CMS Collaboration Safety Officers
- HSE Documentation and Standards Team
- Beta testers and early adopters

---

## 📄 License & Usage

This application is developed for **CERN CMS Safety activities**. 

**Usage Rights:**
- ✅ **CERN Personnel**: Full usage rights for safety activities
- ✅ **CMS Collaboration**: Usage for experiment-related safety work
- ✅ **Research Purposes**: Academic and research applications
- ❓ **Commercial Use**: Contact CERN for licensing information

**Distribution:**
- Internal CERN distribution: Unrestricted
- External distribution: Follow CERN intellectual property policies
- Modifications: Contributions welcome through standard channels

**Compliance:**
- Follows CERN safety standards and procedures
- Integrates with official HSE documentation
- Maintains data privacy and security requirements

---

**🌟 Developed with ❤️ for the CERN CMS Safety Team**  
*Enhancing safety through technology and innovation*