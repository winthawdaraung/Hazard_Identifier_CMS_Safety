const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readExcelFile: (filePath, sheetName, headerRow) =>
    ipcRenderer.invoke('read-excel-file', filePath, sheetName, headerRow),

  saveDraft: (data) => ipcRenderer.invoke('save-draft', data),
  loadDraft: () => ipcRenderer.invoke('load-draft'),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  exportDocument: (data) => ipcRenderer.invoke('export-document', data),
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});
