import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { groupHazardsByCategory, getSafetyMeasures } from '../utils/hazardLoader';

const HazardDetails = ({ formData, updateHazardDetails, hazardData, selectedHazards }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [newCustomHazard, setNewCustomHazard] = useState({
    name: '',
    details: '',
    recommendations: ''
  });

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

  const handleAddCustomHazard = () => {
    if (newCustomHazard.name.trim()) {
      const hazardId = `custom_${Date.now()}`;
      updateHazardDetails('Other Hazards', hazardId, {
        selected: true,
        name: newCustomHazard.name.trim(),
        details: newCustomHazard.details.trim(),
        recommendations: newCustomHazard.recommendations.trim() || 'Please specify safety measures for this hazard.'
      });
      setNewCustomHazard({ name: '', details: '', recommendations: '' });
    }
  };

  const handleRemoveCustomHazard = (hazardId) => {
    updateHazardDetails('Other Hazards', hazardId, undefined);
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
    },
    'Other Hazards': {
      icon: '📝',
      color: 'bg-purple-100 border-purple-300 hover:bg-purple-200'
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

  // Handle "Other Hazards" category with custom hazards
  if (selectedHazards.includes('Other Hazards')) {
    // Get existing custom hazards from formData
    const existingCustomHazards = formData.hazardDetails['Other Hazards'] || {};
    hazardSubCategories['Other Hazards'] = Object.keys(existingCustomHazards).map(hazardId => ({
      id: hazardId,
      name: existingCustomHazards[hazardId]?.name || 'Custom Hazard',
      icon: '📝',
      recommendations: existingCustomHazards[hazardId]?.recommendations || 'Please specify safety measures for this hazard.',
      defaultRecommendations: 'Please specify safety measures for this hazard.'
    }));
  }



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
                  {hazardCategory === 'Other Hazards' && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-4">Add Custom Hazard</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="form-label">Hazard Name *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={newCustomHazard.name}
                            onChange={(e) => setNewCustomHazard(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter hazard name..."
                          />
                        </div>
                        <div>
                          <label className="form-label">Details</label>
                          <textarea
                            className="form-textarea"
                            rows={2}
                            value={newCustomHazard.details}
                            onChange={(e) => setNewCustomHazard(prev => ({ ...prev, details: e.target.value }))}
                            placeholder="Describe the hazard details..."
                          />
                        </div>
                        <div>
                          <label className="form-label">Recommendations</label>
                          <textarea
                            className="form-textarea"
                            rows={2}
                            value={newCustomHazard.recommendations}
                            onChange={(e) => setNewCustomHazard(prev => ({ ...prev, recommendations: e.target.value }))}
                            placeholder="Enter safety recommendations..."
                          />
                        </div>
                        <button
                          onClick={handleAddCustomHazard}
                          disabled={!newCustomHazard.name.trim()}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Hazard
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {subHazards.map((subHazard) => {
                    const hazardDetails = formData.hazardDetails[hazardCategory]?.[subHazard.id] || {};
                    const isSelected = hazardDetails.selected || false;
                    const details = hazardDetails.details || '';
                    const recommendations = hazardDetails.recommendations || subHazard.recommendations;
                    
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
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{subHazard.icon}</span>
                                <h4 className="font-medium text-gray-800">{subHazard.name}</h4>
                              </div>
                              {hazardCategory === 'Other Hazards' && (
                                <button
                                  onClick={() => handleRemoveCustomHazard(subHazard.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  title="Remove this hazard"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            
                            {isSelected && (
                               <div className="space-y-4 mt-4">
                                 <div>
                                   <label className="form-label">Details</label>
                                   <textarea
                                     className="form-textarea"
                                     rows={3}
                                     value={details}
                                     onChange={(e) => handleDetailsChange(hazardCategory, subHazard.id, 'details', e.target.value)}
                                     placeholder="Provide specific details about this hazard in your activity...
For Chemical hazards, include commercial name, quantity, if liquid solid or gas, type of use.
For Mechanical hazards, include the notes, drawings, quantity, etc."
                                   />
                                 </div>
                                 
                                 <div>
                                   <label className="form-label">Recommendations</label>
                                   <textarea
                                     className="form-textarea"
                                     rows={3}
                                     value={recommendations}
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