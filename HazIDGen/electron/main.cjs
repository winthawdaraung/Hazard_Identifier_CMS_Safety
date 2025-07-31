const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, './src/assets/Logo CMS Safety.png')
  });

  const isDev = !app.isPackaged;
  
  if (isDev) {
    console.log('Running in development mode');
    // Try to load from dev server first, fall back to built files
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      console.log('Dev server not available, loading from built files');
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    });
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Running in production mode');
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
// ipcMain.handle('read-excel-file', async (event, filePath, sheetName, headerRow=0) => {
//   console.log('Reading Excel file from:', filePath);
//   try {
//     // Try to read from the provided path first
//     let fullPath = filePath;
    
//     // If it's a relative path, make it relative to the app directory
//     if (!path.isAbsolute(filePath)) {
//       const appPath = app.isPackaged ? process.resourcesPath : process.cwd();
//       fullPath = path.join(appPath, filePath);
//     }
    
//     console.log('Attempting to read Excel file from:', fullPath);
    
//     if (!fs.existsSync(fullPath)) {
//       throw new Error(`File not found: ${fullPath}`);
//     }
    
//     const workbook = XLSX.readFile(fullPath);
//     console.log('Available sheets:', workbook.SheetNames);
//     console.log('Requested sheet:', sheetName);
    
//     let worksheet;
//     if (!workbook.Sheets[sheetName]) {
//       console.log(`Sheet "${sheetName}" not found, trying first sheet: ${workbook.SheetNames[0]}`);
//       worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     } else {
//       worksheet = workbook.Sheets[sheetName];
//     }
//     // Use specified header row (default is 0 for first row)
//     const data = XLSX.utils.sheet_to_json(worksheet, {
//       header: headerRow, // Use specified header row
//       range: headerRow   // Start from header row
//     });
    
//     console.log('Excel file read successfully, rows:', data.length);
//     console.log("excel data", data);
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error reading Excel file:', error);
//     return { success: false, error: error.message };
//   }
// });


ipcMain.handle('read-excel-file', async (event, filePath, sheetName, headerRow = 0) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      range: headerRow,
      defval: ''
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error reading Excel:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-excel-sheets', async (event, filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    return { success: true, sheets: workbook.SheetNames };
  } catch (error) {
    console.error('Error getting Excel sheets:', error);
    return { success: false, error: error.message };
  }
});



ipcMain.handle('save-draft', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: 'hazid-draft.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });
    
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { success: true, path: filePath };
    }
    return { success: false };
  } catch (error) {
    console.error('Error saving draft:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-draft', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ],
      properties: ['openFile']
    });
    
    if (filePaths.length > 0) {
      const data = fs.readFileSync(filePaths[0], 'utf8');
      const parsedData = JSON.parse(data);
      console.log('Electron: Loaded draft data:', parsedData);
      return { success: true, data: parsedData };
    }
    return { success: false };
  } catch (error) {
    console.error('Error loading draft:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-file', async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  } catch (error) {
    console.error('Error selecting file:', error);
    throw error;
  }
});

// File storage handlers
ipcMain.handle('save-uploaded-file', async (event, fileData) => {
  try {
    // Create uploads directory next to the app
    let uploadsDir;
    if (app.isPackaged) {
      // If app is packaged (distributed), use the app directory
      uploadsDir = path.join(process.resourcesPath, '..', 'uploads');
    } else {
      // If app is in development, use the project root
      uploadsDir = path.join(process.cwd(), 'uploads');
    }
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${fileData.name}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Convert base64 to buffer and save file
    const buffer = Buffer.from(fileData.data, 'base64');
    fs.writeFileSync(filePath, buffer);
    
    return { 
      success: true, 
      savedPath: filePath,
      fileName: fileName
    };
  } catch (error) {
    console.error('Error saving uploaded file:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-uploads-directory', async () => {
  try {
    let uploadsDir;
    if (app.isPackaged) {
      // If app is packaged (distributed), use the app directory
      uploadsDir = path.join(process.resourcesPath, '..', 'uploads');
    } else {
      // If app is in development, use the project root
      uploadsDir = path.join(process.cwd(), 'uploads');
    }
    return { success: true, path: uploadsDir };
  } catch (error) {
    console.error('Error getting uploads directory:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-document', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `HazID_${data.title ? data.title.replace(/[^a-z0-9]/gi, '_') : 'Document'}.docx`,
      filters: [
        { name: 'Word Documents', extensions: ['docx'] }
      ]
    });
    
    if (filePath) {
      // Use the new hazard document generator
      const hazardDocGenerator = require('../public/hazard-document-generator.cjs');
      await hazardDocGenerator.generateHazardDocument(data, filePath);
      return { success: true, path: filePath };
    }
    return { success: false };
  } catch (error) {
    console.error('Error exporting document:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    console.error('Error opening external URL:', error);
    return { success: false, error: error.message };
  }
});

// Handle app ready
app.on('ready', () => {
  console.log('Electron app is ready');
});