import React from 'react';
import { ChevronLeft, ChevronRight, Save, Upload, Download, RotateCcw } from 'lucide-react';

const ActionButtons = ({ 
  currentStep, 
  setCurrentStep, 
  totalSteps, 
  onSaveDraft, 
  onLoadDraft, 
  onExport, 
  onReset,
  formData 
}) => {
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.creatorName && formData.creatorDepartment && 
               formData.responsiblePerson && formData.startDate && formData.building && 
               formData.activityDescription;
      case 2:
        return formData.selectedHazards && formData.selectedHazards.length > 0;
      default:
        return true;
    }
  };

  const getRequiredFieldsCount = () => {
    const required = [
      formData.title,
      formData.creatorName,
      formData.creatorDepartment,
      formData.responsiblePerson,
      formData.startDate,
      formData.building,
      formData.activityDescription
    ];
    
    const completed = required.filter(field => field && field.trim()).length;
    return {
      completed,
      total: required.length,
      isComplete: completed === required.length
    };
  };

  const status = getRequiredFieldsCount();

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4 mt-8">
      <div className="flex items-center justify-between">
        {/* Left side - Previous button */}
        <div>
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
          )}
        </div>

        {/* Center - Draft actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSaveDraft}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            title="Save current progress as draft"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          
          <button
            onClick={onLoadDraft}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            title="Load previously saved draft"
          >
            <Upload className="w-4 h-4 mr-2" />
            Load Draft
          </button>

          <button
            onClick={onReset}
            className="flex items-center px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
            title="Reset all form data"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>

        {/* Right side - Next/Export button */}
        <div className="flex items-center space-x-3">
          {currentStep === totalSteps ? (
            <button
              onClick={onExport}
              disabled={!status.isComplete}
              className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                status.isComplete
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={status.isComplete ? 'Export Word document' : `Complete ${status.total - status.completed} more required fields`}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Document
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canGoNext()}
              className={`flex items-center px-6 py-2 rounded-md transition-colors ${
                canGoNext()
                  ? 'bg-cern-blue hover:bg-cern-blue/90 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
          {currentStep === totalSteps && (
            <span className="ml-2">
              • {status.isComplete ? (
                <span className="text-green-600 font-medium">Ready to export</span>
              ) : (
                <span className="text-amber-600">
                  {status.completed}/{status.total} required fields completed
                </span>
              )}
            </span>
          )}
        </p>
      </div>

      {/* Help text for current step */}
      <div className="mt-3 text-center">
        {currentStep === 1 && !canGoNext() && (
          <p className="text-sm text-amber-600">
            Please fill in all required fields (marked with *) to continue
          </p>
        )}
        {currentStep === 2 && !canGoNext() && (
          <p className="text-sm text-amber-600">
            Please select at least one hazard category to continue
          </p>
        )}
        {currentStep === totalSteps && !status.isComplete && (
          <p className="text-sm text-amber-600">
            Complete all required fields to enable document export
          </p>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;