# Data Directory

This directory contains Excel files and other data used by the HazID Generator application.

## Excel Files Location

### **Recommended Location: `data/excel/`**

Place your Excel files in the `data/excel/` directory. This is the primary location where the application will look for Excel files.

### **Required Excel Files:**

1. **`CMS_Safety-List_Preventive_Protective_Measures.xlsx`**
   - Contains hazard data
   - Sheet name: "ENG List of hazards"
   - Used for hazard selection and details

2. **`CMS_Safety-Location_TSO_Links_Reference.xlsx`**
   - Contains building and room information
   - Sheet name: "Building Room Info"
   - Used for location selection

### **Alternative Locations:**

The application will also check these locations in order:
1. `./data/excel/` (recommended)
2. `./src/assets/`
3. `./public/`

## File Structure

```
data/
├── excel/
│   ├── CMS_Safety-List_Preventive_Protective_Measures.xlsx
│   └── CMS_Safety-Location_TSO_Links_Reference.xlsx
└── README.md
```

## How to Add Excel Files

1. **Copy your Excel files** to the `data/excel/` directory
2. **Ensure correct sheet names**:
   - Hazard data: "ENG List of hazards"
   - Building data: "Building Room Info"
3. **Restart the application** to load the new files

## Excel File Format

### Hazard Data (`CMS_Safety-List_Preventive_Protective_Measures.xlsx`)
- **Sheet**: "ENG List of hazards"
- **Headers**: Row 2 (index 1)
- **Required columns**:
  - `Hazards` - Hazard category
  - `Specific Hazards` - Specific hazard name
  - `Safety Measures` - Safety recommendations

### Building Data (`CMS_Safety-Location_TSO_Links_Reference.xlsx`)
- **Sheet**: "Building Room Info"
- **Headers**: Row 1 (index 0)
- **Required columns**:
  - `Building` - Building name/number
  - `Room` - Room identifier

## Troubleshooting

If Excel files are not loading:

1. **Check file location**: Ensure files are in `data/excel/`
2. **Check file names**: Use exact names listed above
3. **Check sheet names**: Verify sheet names match exactly
4. **Check file format**: Use `.xlsx` or `.xls` format
5. **Check console logs**: Look for error messages in the application console

## Development vs Production

- **Development**: Files are loaded from `./data/excel/`
- **Production**: Files are loaded from the app's user data directory
- **Fallback**: If files are not found, the app uses built-in sample data 