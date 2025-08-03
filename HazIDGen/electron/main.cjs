const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

let mainWindow;

function createApplicationMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Document',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // Reload the app to start fresh
            mainWindow.reload();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Save Draft',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            mainWindow.webContents.send('menu-save-draft');
          }
        },
        {
          label: 'Load Draft',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            mainWindow.webContents.send('menu-load-draft');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Export Document',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-export-document');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Open Uploads Folder',
          click: async () => {
            try {
              const result = await getUploadsDirectory();
              if (result.success) {
                shell.showItemInFolder(result.path);
              }
            } catch (error) {
              console.error('Error opening uploads folder:', error);
            }
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          type: 'separator'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            mainWindow.webContents.reloadIgnoringCache();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.setZoomLevel(0);
          }
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom + 1);
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom - 1);
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Toggle Fullscreen',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Check Excel Data',
          click: () => {
            mainWindow.webContents.send('menu-check-excel-data');
          }
        },
        {
          label: 'Validate Form',
          click: () => {
            mainWindow.webContents.send('menu-validate-form');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Open Data Folder',
          click: () => {
            let dataDir;
            if (app.isPackaged) {
              dataDir = path.join(process.resourcesPath, '..', 'data');
            } else {
              dataDir = path.join(process.cwd(), 'data');
            }
            shell.showItemInFolder(dataDir);
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About CERN CMS Safety',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About CERN CMS Safety',
              message: 'CERN CMS Safety - Hazard Identification Generator',
              detail: 'Version 1.0.0\n\nThis application helps generate hazard identification documents for CERN CMS Safety activities.\n\nDeveloped for CERN CMS Safety Team',
              buttons: ['OK']
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'CERN HSE Website',
          click: () => {
            shell.openExternal('https://hse.cern/');
          }
        },
        {
          label: 'CMS Safety Website',
          click: () => {
            shell.openExternal('https://cmssafety.web.cern.ch/');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Keyboard Shortcuts',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Keyboard Shortcuts',
              message: 'Keyboard Shortcuts',
              detail: 'File Operations:\n' +
                     'Ctrl+N - New Document\n' +
                     'Ctrl+S - Save Draft\n' +
                     'Ctrl+O - Load Draft\n' +
                     'Ctrl+E - Export Document\n\n' +
                     'Edit Operations:\n' +
                     'Ctrl+Z - Undo\n' +
                     'Ctrl+Y - Redo\n' +
                     'Ctrl+C - Copy\n' +
                     'Ctrl+V - Paste\n\n' +
                     'View Operations:\n' +
                     'Ctrl+R - Reload\n' +
                     'F11 - Toggle Fullscreen\n' +
                     'Ctrl+0 - Reset Zoom\n' +
                     'Ctrl++ - Zoom In\n' +
                     'Ctrl+- - Zoom Out',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: 'About ' + app.getName(),
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + app.getName(),
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Helper function for uploads directory
async function getUploadsDirectory() {
  try {
    let uploadsDir;
    if (app.isPackaged) {
      uploadsDir = path.join(process.resourcesPath, '..', 'uploads');
    } else {
      uploadsDir = path.join(process.cwd(), 'uploads');
    }
    return { success: true, path: uploadsDir };
  } catch (error) {
    console.error('Error getting uploads directory:', error);
    return { success: false, error: error.message };
  }
}

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
  createApplicationMenu();
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
    let fullPath = filePath;
    
    // Handle relative paths for packaged app
    if (!path.isAbsolute(filePath)) {
      // In packaged app, the files are in resources/app/
      const appPath = app.isPackaged ? path.join(process.resourcesPath, 'app') : process.cwd();
      fullPath = path.join(appPath, filePath);
    }
    
    console.log(`Attempting to read Excel file from: ${fullPath}`);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    
    const workbook = XLSX.readFile(fullPath);
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      throw new Error(`Sheet '${sheetName}' not found in workbook`);
    }
    
    const data = XLSX.utils.sheet_to_json(worksheet, {
      range: headerRow,
      defval: ''
    });
    
    console.log(`Successfully loaded ${data.length} rows from ${sheetName}`);
    return { success: true, data };
  } catch (error) {
    console.error('Error reading Excel:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-excel-sheets', async (event, filePath) => {
  try {
    let fullPath = filePath;
    
    // Handle relative paths for packaged app
    if (!path.isAbsolute(filePath)) {
      const appPath = app.isPackaged ? path.join(process.resourcesPath, 'app') : process.cwd();
      fullPath = path.join(appPath, filePath);
    }
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    
    const workbook = XLSX.readFile(fullPath);
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

ipcMain.handle('show-message-dialog', async (event, options) => {
  try {
    const result = await dialog.showMessageBox(mainWindow, {
      type: options.type || 'info',
      title: options.title || 'HazID Generator',
      message: options.message,
      detail: options.detail,
      buttons: options.buttons || ['OK']
    });
    return { success: true, response: result.response };
  } catch (error) {
    console.error('Error showing message dialog:', error);
    return { success: false, error: error.message };
  }
});

// Handle app ready
app.on('ready', () => {
  console.log('Electron app is ready');
});