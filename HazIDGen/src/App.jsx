import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ActivityForm from './components/ActivityForm';

import HazardSelection from './components/HazardSelection';
import HazardDetails from './components/HazardDetails';
import DocumentUpload from './components/DocumentUpload';
import ContactsInfo from './components/ContactsInfo';
import ActionButtons from './components/ActionButtons';
import { loadHazardData, loadBuildingRoomData, loadContactData } from './utils/hazardLoader';
import { getTodayForInput } from './utils/dateUtils';

function App() {
  const [formData, setFormData] = useState({
    // Document Header Information
    reference: '',
    edms: '',
    validity: '',
    
    // Activity Information
    title: '',
    creatorName: '',
    creatorDepartment: '',
    responsiblePerson: '',
    participantCount: '',
    startDate: getTodayForInput(),
    endDate: '',
    location: '',
    building: '',
    room: '',
    cernSupport: '',
    cmsSupport: '',
    
    // Documents
    safetyDocuments: '',
    technicalDocuments: '',
    otherDocuments: '',
    hseSupport: '',
    referenceDocuments: '',
    
    // Activity Description
    activityDescription: '',
    
    // Hazards
    selectedHazards: [],
    hazardDetails: {},
    
    // Uploaded files
    uploadedFiles: []
  });

  const [hazardData, setHazardData] = useState([]);
  const [hazardDefinitions, setHazardDefinitions] = useState([]);
  const [buildingRoomData, setBuildingRoomData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    loadHazards();
  }, []);



  const loadHazards = async () => {
    try {
      setLoading(true);
      const [hazardDataResult, buildingRoomData] = await Promise.all([
        loadHazardData(),
        loadBuildingRoomData()
      ]);
      setHazardData(hazardDataResult.hazardData || hazardDataResult);
      setHazardDefinitions(hazardDataResult.hazardDefinitions || []);
      setBuildingRoomData(buildingRoomData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = async () => {
    const confirmed = await window.electronAPI.showMessageDialog({
      type: 'warning',
      title: 'Reset Form',
      message: 'Are you sure you want to reset all form data?',
      detail: 'This will clear all entered information and cannot be undone.',
      buttons: ['Cancel', 'Reset']
    });
    
    if (confirmed.response === 1) { // User clicked "Reset"
      setFormData({
        // Document Header Information
        reference: '',
        edms: '',
        validity: '',
        
        // Activity Information
        title: '',
        creatorName: '',
        creatorDepartment: '',
        responsiblePerson: '',
        participantCount: '',
        startDate: getTodayForInput(),
        endDate: '',
        location: '',
        building: '',
        room: '',
        cernSupport: '',
        cmsSupport: '',
        
        // Documents
        safetyDocuments: '',
        technicalDocuments: '',
        otherDocuments: '',
        hseSupport: '',
        referenceDocuments: '',
        
        // Activity Description
        activityDescription: '',
        
        // Hazards
        selectedHazards: [],
        hazardDetails: {},
        
        // Uploaded files
        uploadedFiles: []
      });
      setContactData([]);
      setCurrentStep(1);
      
      await window.electronAPI.showMessageDialog({
        type: 'info',
        title: 'Reset Complete',
        message: 'Form has been reset successfully',
        detail: 'All data has been cleared and you can start fresh.'
      });
    }
  };

  const updateHazardDetails = (hazardCategory, subHazard, details) => {
    setFormData(prev => {
      const newHazardDetails = { ...prev.hazardDetails };
      
      if (!newHazardDetails[hazardCategory]) {
        newHazardDetails[hazardCategory] = {};
      }
      
      if (details === undefined) {
        // Remove the hazard
        const { [subHazard]: removed, ...rest } = newHazardDetails[hazardCategory];
        newHazardDetails[hazardCategory] = rest;
      } else {
        // Add or update the hazard
        newHazardDetails[hazardCategory] = {
          ...newHazardDetails[hazardCategory],
          [subHazard]: details
        };
      }
      
      return {
        ...prev,
        hazardDetails: newHazardDetails
      };
    });
  };

  const handleHazardSelection = (hazardName, selected) => {
    setFormData(prev => ({
      ...prev,
      selectedHazards: selected 
        ? [...prev.selectedHazards, hazardName]
        : prev.selectedHazards.filter(h => h !== hazardName)
    }));
  };

  const handleSaveDraft = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.saveDraft(formData);
        if (result.success) {
          // Draft saved successfully to file system
        } else {
          console.error('Error saving draft:', result.error || 'Unknown error');
        }
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      console.error('Error saving draft:', error.message);
    }
  };

  const handleLoadDraft = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.loadDraft();
        if (result.success) {
          // Ensure all required fields are present with default values
          const loadedData = {
            // Activity Information
            title: result.data.title || '',
            creatorName: result.data.creatorName || '',
            creatorDepartment: result.data.creatorDepartment || '',
            responsiblePerson: result.data.responsiblePerson || '',
            participantCount: result.data.participantCount || '',
            startDate: result.data.startDate || getTodayForInput(),
            endDate: result.data.endDate || '',
            location: result.data.location || '',
            building: result.data.building || '',
            room: result.data.room || '',
            cernSupport: result.data.cernSupport || '',
            cmsSupport: result.data.cmsSupport || '',
            
            // Documents
            safetyDocuments: result.data.safetyDocuments || '',
            technicalDocuments: result.data.technicalDocuments || '',
            otherDocuments: result.data.otherDocuments || '',
            hseSupport: result.data.hseSupport || '',
            referenceDocuments: result.data.referenceDocuments || '',
            
            // Activity Description
            activityDescription: result.data.activityDescription || '',
            
            // Hazards
            selectedHazards: result.data.selectedHazards || [],
            hazardDetails: result.data.hazardDetails || {},
            
            // Uploaded files
            uploadedFiles: result.data.uploadedFiles || []
          };
          setFormData(prev => {
            return { ...loadedData };
          });
          
          // Force remount of form components by changing key
          setFormKey(prev => prev + 1);
          
          // Additional DOM reset after remount
          setTimeout(() => {
            // Force all form elements to reset their internal state
            const allInputs = document.querySelectorAll('input, textarea, select');
            allInputs.forEach(input => {
              // Force re-creation of input state
              const value = input.value;
              input.value = '';
              input.value = value;
              // Clear any internal focus state
              input.blur();
              // Trigger a synthetic change event to ensure React state sync
              const event = new Event('input', { bubbles: true });
              input.dispatchEvent(event);
            });
          }, 200);
          
          // Draft loaded successfully from file system
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const handleExport = async () => {
    try {
      if (window.electronAPI) {
        // Load contact data and include it in the export data
        const contactData = await loadContactData();
        
        // Include hazard definitions and contact data in the export data
        const exportData = {
          ...formData,
          hazardDefinitions: hazardDefinitions,
          contactData: contactData
        };
        const result = await window.electronAPI.exportDocument(exportData);
        if (result.success) {
          await window.electronAPI.showMessageDialog({
            type: 'info',
            title: 'Export Successful',
            message: result.message || 'Documents exported successfully!',
            detail: result.draftPath ? 
              `Final document: ${result.path}\nLoadable draft: ${result.draftPath}` :
              'Your hazard identification document has been saved.'
          });
        } else {
          await window.electronAPI.showMessageDialog({
            type: 'error',
            title: 'Export Failed',
            message: 'Error exporting document',
            detail: result.error || 'Unknown error occurred during export.'
          });
        }
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      await window.electronAPI.showMessageDialog({
        type: 'error',
        title: 'Export Error',
        message: 'Unexpected error during export',
        detail: error.message
      });
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cern-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hazard data...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Activity Information', component: ActivityForm },
    { id: 2, name: 'Hazard Selection', component: HazardSelection },
    { id: 3, name: 'Hazard Details', component: HazardDetails },
    { id: 4, name: 'Documents & Files', component: DocumentUpload },
    { id: 5, name: 'Contacts & Export', component: ContactsInfo }
  ];

  const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step.id 
                      ? 'bg-cern-blue text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.id}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.id ? 'text-cern-blue font-medium' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-16 h-0.5 ${
                    currentStep > step.id ? 'bg-cern-blue' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        {CurrentStepComponent && (
          <CurrentStepComponent 
            key={formKey}
            formData={formData}
            updateFormData={updateFormData}
            updateHazardDetails={updateHazardDetails}
            hazardData={hazardData}
            buildingRoomData={buildingRoomData}
            selectedHazards={formData.selectedHazards}
            onHazardSelection={handleHazardSelection}
          />
        )}

        {/* Navigation & Action Buttons */}
        <ActionButtons 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalSteps={steps.length}
          onSaveDraft={handleSaveDraft}
          onLoadDraft={handleLoadDraft}
          onExport={handleExport}
          onReset={resetForm}
          formData={formData}
        />
      </div>
    </div>
  );
}

export default App;