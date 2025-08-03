const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readExcelFile: (filePath, sheetName, headerRow) =>
    ipcRenderer.invoke('read-excel-file', filePath, sheetName, headerRow),
  getExcelSheets: (filePath) => ipcRenderer.invoke('get-excel-sheets', filePath),

  saveDraft: (data) => ipcRenderer.invoke('save-draft', data),
  loadDraft: () => ipcRenderer.invoke('load-draft'),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  exportDocument: (data) => ipcRenderer.invoke('export-document', data),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  showMessageDialog: (options) => ipcRenderer.invoke('show-message-dialog', options),
  
  // File storage APIs
  saveUploadedFile: (fileData) => ipcRenderer.invoke('save-uploaded-file', fileData),
  getUploadsDirectory: () => ipcRenderer.invoke('get-uploads-directory')
});
