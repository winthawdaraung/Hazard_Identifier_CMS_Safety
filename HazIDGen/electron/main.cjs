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
    icon: path.join(__dirname, '../public/Logo CMS Safety.png')
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
ipcMain.handle('read-excel-file', async (event, filePath) => {
  try {
    // Try to read from the provided path first
    let fullPath = filePath;
    
    // If it's a relative path, make it relative to the app directory
    if (!path.isAbsolute(filePath)) {
      const appPath = app.isPackaged ? process.resourcesPath : process.cwd();
      fullPath = path.join(appPath, filePath);
    }
    
    console.log('Attempting to read Excel file from:', fullPath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    
    const workbook = XLSX.readFile(fullPath);
    // const sheetName = workbook.SheetNames[0];
    const sheetName = "ENG List of hazards";
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('Excel file read successfully, rows:', data.length);
    console.log(data);
    return { success: true, data };
  } catch (error) {
    console.error('Error reading Excel file:', error);
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
      return { success: true, data: JSON.parse(data) };
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

ipcMain.handle('export-document', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `HazID_${data.title ? data.title.replace(/[^a-z0-9]/gi, '_') : 'Document'}.docx`,
      filters: [
        { name: 'Word Documents', extensions: ['docx'] }
      ]
    });
    
    if (filePath) {
      // Load the document generator
      const docxGenerator = require('../public/docx-generator.cjs');
      await docxGenerator.generateDocument(data, filePath);
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