import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { groupHazardsByCategory, getSafetyMeasures } from '../utils/hazardLoader';

const HazardDetails = ({ formData, updateHazardDetails, hazardData, selectedHazards }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  // Auto-expand categories that are selected
  useEffect(() => {
    const expanded = {};
    selectedHazards.forEach(hazard => {
      expanded[hazard] = true;
    });
    setExpandedCategories(expanded);
  }, [selectedHazards]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSubHazardToggle = (hazardCategory, subHazard, checked) => {
    const currentDetails = formData.hazardDetails[hazardCategory]?.[subHazard] || {};
    updateHazardDetails(hazardCategory, subHazard, {
      ...currentDetails,
      selected: checked
    });
  };

  const handleDetailsChange = (hazardCategory, subHazard, field, value) => {
    const currentDetails = formData.hazardDetails[hazardCategory]?.[subHazard] || {};
    updateHazardDetails(hazardCategory, subHazard, {
      ...currentDetails,
      [field]: value
    });
  };

  // Get hazard sub-categories from actual Excel data
  const groupedHazards = groupHazardsByCategory(hazardData);
  
  // Map category names to icons
  const categoryIcons = {
    'Chemical': '⚠️',
    'Mechanical ': '⚙️',
    'Non ionizing radiation': '📡',
    'Ionizing radiation': '☢️',
    'Fire': '🔥',
    'General': '🏗️'
  };
  
  // Create hazard sub-categories from actual data
  const hazardSubCategories = {};
  Object.keys(groupedHazards).forEach(category => {
    hazardSubCategories[category] = groupedHazards[category].map(hazard => ({
      name: hazard['Specific Hazard'] || hazard.specificHazard || 'Unknown Hazard',
      icon: categoryIcons[category] || '❓',
      recommendations: hazard['Safety Measures'] || hazard.safetyMeasures || 'No specific safety measures available.'
    }));
  });

  if (selectedHazards.length === 0) {
    return (
      <div className="form-section">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Hazard Details</h2>
        <div className="text-center py-12">
          <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hazards selected. Please go back and select relevant hazards first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Hazard Details</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          For each selected hazard category, specify the relevant sub-hazards and provide details about your specific situation.
        </p>
      </div>

      <div className="space-y-6">
        {selectedHazards.map((hazardCategory) => {
          const subHazards = hazardSubCategories[hazardCategory] || [];
          const isExpanded = expandedCategories[hazardCategory];

          return (
            <div key={hazardCategory} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleCategory(hazardCategory)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
              >
                <h3 className="text-lg font-semibold text-gray-800">{hazardCategory}</h3>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {isExpanded && (
                <div className="p-6 space-y-6">
                  {subHazards.map((subHazard) => {
                    const isSelected = formData.hazardDetails[hazardCategory]?.[subHazard.name]?.selected || false;
                    const details = formData.hazardDetails[hazardCategory]?.[subHazard.name]?.details || '';
                    
                    return (
                      <div key={subHazard.name} className={`border rounded-lg p-4 ${isSelected ? 'border-cern-blue bg-cern-blue/5' : 'border-gray-200'}`}>
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={isSelected}
                            onChange={(e) => handleSubHazardToggle(hazardCategory, subHazard.name, e.target.checked)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{subHazard.icon}</span>
                              <h4 className="font-medium text-gray-800">{subHazard.name}</h4>
                            </div>
                            
                            {isSelected && (
                              <div className="space-y-4 mt-4">
                                <div>
                                  <label className="form-label">Details (Commercial name, quantity, type of use, etc.)</label>
                                  <textarea
                                    className="form-textarea"
                                    rows={3}
                                    value={details}
                                    onChange={(e) => handleDetailsChange(hazardCategory, subHazard.name, 'details', e.target.value)}
                                    placeholder="Provide specific details about this hazard in your activity..."
                                  />
                                </div>
                                
                                <div className="bg-blue-50 p-3 rounded">
                                  <h5 className="font-medium text-blue-800 mb-2">Recommendations</h5>
                                  <p className="text-sm text-blue-700">{subHazard.recommendations}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HazardDetails;