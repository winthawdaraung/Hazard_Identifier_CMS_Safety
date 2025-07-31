import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ActivityForm from './components/ActivityForm';

import HazardSelection from './components/HazardSelection';
import HazardDetails from './components/HazardDetails';
import DocumentUpload from './components/DocumentUpload';
import ContactsInfo from './components/ContactsInfo';
import ActionButtons from './components/ActionButtons';
import { loadHazardData, loadBuildingRoomData } from './utils/hazardLoader';
import { getTodayForInput } from './utils/dateUtils';

function App() {
  const [formData, setFormData] = useState({
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
  const [buildingRoomData, setBuildingRoomData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHazards();
  }, []);



  const loadHazards = async () => {
    try {
      setLoading(true);
      const [hazardData, buildingRoomData] = await Promise.all([
        loadHazardData(),
        loadBuildingRoomData()
      ]);
      setHazardData(hazardData);
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

  const updateHazardDetails = (hazardCategory, subHazard, details) => {
    setFormData(prev => ({
      ...prev,
      hazardDetails: {
        ...prev.hazardDetails,
        [hazardCategory]: {
          ...prev.hazardDetails[hazardCategory],
          [subHazard]: details
        }
      }
    }));
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
          alert('Draft saved successfully!');
        } else {
          alert('Error saving draft: ' + (result.error || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft: ' + error.message);
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
          setFormData(loadedData);
          
          alert('Draft loaded successfully!');
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      alert('Error loading draft: ' + error.message);
    }
  };

  const handleExport = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.exportDocument(formData);
        if (result.success) {
          alert('Document exported successfully!');
        } else {
          alert('Error exporting document: ' + (result.error || 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      alert('Error exporting document: ' + error.message);
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
          formData={formData}
        />
      </div>
    </div>
  );
}

export default App;