import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, FolderOpen } from 'lucide-react';

const DocumentUpload = ({ formData, updateFormData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(formData.uploadedFiles || []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files) => {
    const newFiles = [];
    
    for (const file of files) {
      try {
        // Convert file to base64
        const reader = new FileReader();
        const fileData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // Extract base64 data (remove data:application/pdf;base64, prefix)
        const base64Data = fileData.split(',')[1];
        
        // Save file to local storage
        if (window.electronAPI) {
          const result = await window.electronAPI.saveUploadedFile({
            name: file.name,
            data: base64Data,
            type: file.type,
            size: file.size
          });
          
          if (result.success) {
            newFiles.push({
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              savedPath: result.savedPath,
              fileName: result.fileName,
              status: 'saved'
            });
          } else {
            console.error('Failed to save file:', result.error);
            // Still add to list but mark as failed
            newFiles.push({
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              status: 'failed',
              error: result.error
            });
          }
        } else {
          // Fallback for web version
          newFiles.push({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            file: file,
            status: 'uploaded'
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        newFiles.push({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    updateFormData('uploadedFiles', updatedFiles);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    updateFormData('uploadedFiles', updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openUploadsDirectory = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.getUploadsDirectory();
        if (result.success) {
          // Open the directory in file explorer
          await window.electronAPI.openExternal(`file://${result.path}`);
        }
      }
    } catch (error) {
      console.error('Error opening uploads directory:', error);
    }
  };

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Documents & Files</h2>

      <div className="space-y-6">
        {/* Document Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Safety Documents</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.safetyDocuments}
              onChange={(e) => updateFormData('safetyDocuments', e.target.value)}
              placeholder="List any safety documents, permits, or certifications required..."
            />
          </div>
          
          <div>
            <label className="form-label">Technical Documents</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.technicalDocuments}
              onChange={(e) => updateFormData('technicalDocuments', e.target.value)}
              placeholder="List technical specifications, procedures, or manuals..."
            />
          </div>
          
          <div>
            <label className="form-label">Other Documents</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.otherDocuments}
              onChange={(e) => updateFormData('otherDocuments', e.target.value)}
              placeholder="List any other relevant documents..."
            />
                            </div>
                            
                                <div>
            <label className="form-label">HSE Support Required</label>
                                  <textarea
                                    className="form-textarea"
                                    rows={3}
              value={formData.hseSupport}
              onChange={(e) => updateFormData('hseSupport', e.target.value)}
              placeholder="Describe any HSE support or consultation needed..."
                                  />
                                </div>
                                
          <div className="md:col-span-2">
            <label className="form-label">Reference Documents</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.referenceDocuments}
              onChange={(e) => updateFormData('referenceDocuments', e.target.value)}
              placeholder="List any reference documents, standards, or guidelines..."
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Upload Supporting Files</h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-cern-blue bg-cern-blue/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop files here, or{' '}
              <label className="text-cern-blue hover:text-cern-blue-dark cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                />
                browse files
              </label>
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB per file)
            </p>
                                </div>
                              </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-800">Uploaded Files</h4>
              {window.electronAPI && (
                <button
                  onClick={openUploadsDirectory}
                  className="flex items-center px-3 py-1 text-sm text-cern-blue hover:text-cern-blue-dark"
                  title="Open uploads folder"
                >
                  <FolderOpen className="w-4 h-4 mr-1" />
                  Open Folder
                </button>
              )}
            </div>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      {file.savedPath && (
                        <p className="text-xs text-green-600">Saved to: {file.savedPath}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'saved' && (
                      <CheckCircle className="w-4 h-4 text-green-500" title="File saved successfully" />
                    )}
                    {file.status === 'uploaded' && (
                      <CheckCircle className="w-4 h-4 text-blue-500" title="File uploaded" />
                    )}
                    {file.status === 'failed' && (
                      <AlertCircle className="w-4 h-4 text-red-500" title={`Failed: ${file.error}`} />
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;