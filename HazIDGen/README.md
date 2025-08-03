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

### Development Commands

- `npm start` - Start development server with hot reload
- `npm run dev` - Start Vite development server only
- `npm run build` - Build web assets for production

### Packaging Commands

- `npm run package-win` - Build Windows executable
- `npm run package-mac` - Build macOS application
- `npm run package-linux` - Build Linux AppImage
- `npm run package-all` - Build for all platforms

Built applications will be available in the `release-builds` directory.

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
- **TSO Recommendation Info.xlsx**: Technical safety recommendations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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