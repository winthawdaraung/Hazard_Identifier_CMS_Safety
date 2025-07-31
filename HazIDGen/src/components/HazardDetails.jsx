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

  const handleSubHazardToggle = (hazardCategory, subHazardId, checked) => {
    const currentDetails = formData.hazardDetails[hazardCategory]?.[subHazardId] || {};
    const subHazard = hazardSubCategories[hazardCategory]?.find(h => h.id === subHazardId);
    
    const newDetails = {
      ...currentDetails,
      selected: checked,
      name: subHazard?.name || 'Unknown Hazard',
      // Store default recommendations when first selected
      defaultRecommendations: currentDetails.defaultRecommendations || 
        (subHazard?.defaultRecommendations || 'Standard safety measures apply')
    };
    
    updateHazardDetails(hazardCategory, subHazardId, newDetails);
  };

  const handleDetailsChange = (hazardCategory, subHazardId, field, value) => {
    const currentDetails = formData.hazardDetails[hazardCategory]?.[subHazardId] || {};
    updateHazardDetails(hazardCategory, subHazardId, {
      ...currentDetails,
      [field]: value
    });
  };

  // Get hazard sub-categories from actual Excel data
  const groupedHazards = groupHazardsByCategory(hazardData);
  
  // Category configuration with icons and colors
  const categoryConfig = {
    'General': {
      icon: '📋',
      color: 'bg-gray-100 border-gray-300 hover:bg-gray-200'
    },
    'Chemical': {
      icon: '🧪',
      color: 'bg-red-100 border-red-300 hover:bg-red-200'
    },
    'Mechanical': {
      icon: '🛠️',
      color: 'bg-blue-100 border-blue-300 hover:bg-blue-200'
    },
    'Non ionizing radiation': {
      icon: '📡',
      color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
    },
    'Ionizing radiation': {
      icon: '☢️',
      color: 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200'
    },
    'Fire': {
      icon: '🔥',
      color: 'bg-orange-100 border-orange-300 hover:bg-orange-200'
    },
    'Electrical': {
      icon: '🔌',
      color: 'bg-purple-100 border-purple-300 hover:bg-purple-200'
    },
    'Biological': {
      icon: '🦠',
      color: 'bg-green-100 border-green-300 hover:bg-green-200'
    },
    'Work conditions': {
      icon: '🏗️',
      color: 'bg-teal-100 border-teal-300 hover:bg-teal-200'
    },
    'Emergency Preparedness': {
      icon: '🚨',
      color: 'bg-pink-100 border-pink-300 hover:bg-pink-200'
    },
    'Environmental Protection': {
      icon: '🌿',
      color: 'bg-lime-100 border-lime-300 hover:bg-lime-200'
    }
  };
  
  
  
  // Create hazard sub-categories from actual data
  const hazardSubCategories = {};
  Object.keys(groupedHazards).forEach(category => {
    hazardSubCategories[category] = groupedHazards[category].map((hazard, index) => ({
      id: `${category}_${index}`, // Create unique ID for each hazard
      name: hazard['Specific Hazard'] || hazard.specificHazard || 'Unknown Hazard',
      icon: categoryConfig[category]?.icon || '❓',
      recommendations: hazard['Safety Measures'] || hazard.safetyMeasures || 'No specific safety measures available.',
      defaultRecommendations: hazard['Safety Measures'] || hazard.safetyMeasures || 'Standard safety measures apply'
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
                className={`w-full px-6 py-4 flex items-center justify-between rounded-t-lg transition-colors ${categoryConfig[hazardCategory]?.color || 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{categoryConfig[hazardCategory]?.icon || '❓'}</span>
                  <h3 className="text-lg font-semibold text-gray-800">{hazardCategory}</h3>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {isExpanded && (
                <div className="p-6 space-y-6">
                  {subHazards.map((subHazard) => {
                    const isSelected = formData.hazardDetails[hazardCategory]?.[subHazard.id]?.selected || false;
                    const details = formData.hazardDetails[hazardCategory]?.[subHazard.id]?.details || '';
                    
                    return (
                      <div key={subHazard.id} className={`border rounded-lg p-4 ${isSelected ? 'border-cern-blue bg-cern-blue/5' : 'border-gray-200'}`}>
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={isSelected}
                            onChange={(e) => handleSubHazardToggle(hazardCategory, subHazard.id, e.target.checked)}
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
                                     value={formData.hazardDetails[hazardCategory]?.[subHazard.id]?.details || ''}
                                     onChange={(e) => handleDetailsChange(hazardCategory, subHazard.id, 'details', e.target.value)}
                                     placeholder="Provide specific details about this hazard in your activity..."
                                   />
                                 </div>
                                 
                                 <div>
                                   <label className="form-label">Recommendations</label>
                                   <textarea
                                     className="form-textarea"
                                     rows={3}
                                     value={formData.hazardDetails[hazardCategory]?.[subHazard.id]?.recommendations ?? subHazard.recommendations}
                                     onChange={(e) => handleDetailsChange(hazardCategory, subHazard.id, 'recommendations', e.target.value)}
                                     placeholder="Add specific recommendations for your situation..."
                                   />
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