const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  readExcelFile: (filePath) => ipcRenderer.invoke('read-excel-file', filePath),
  saveDraft: (data) => ipcRenderer.invoke('save-draft', data),
  loadDraft: () => ipcRenderer.invoke('load-draft'),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  exportDocument: (data) => ipcRenderer.invoke('export-document', data),
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});

