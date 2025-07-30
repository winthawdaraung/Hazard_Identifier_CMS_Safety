import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

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

  // Mock hazard data structure based on your Excel file
  const hazardSubCategories = {
    'Chemical': [
      { 
        name: 'Explosive', 
        icon: '💥',
        recommendations: 'For each activity involving a hazardous chemical agent, carry out a risk assessment. Keep up-to-date inventory using CERES. Consult Safety Data Sheet (SDS).'
      },
      { 
        name: 'Flammable', 
        icon: '🔥',
        recommendations: 'Ensure proper ventilation. Store in designated cabinets with metallic retention trays. Use safety cans if needed.'
      },
      { 
        name: 'Oxidant', 
        icon: '🔄',
        recommendations: 'Ensure proper ventilation. Use Local Exhaust Ventilation (LEV) systems if needed.'
      },
      { 
        name: 'Corrosive', 
        icon: '🧪',
        recommendations: 'Follow chemical agent guidelines and protective measures.'
      },
      { 
        name: 'Irritant', 
        icon: '😷',
        recommendations: 'Ensure proper ventilation and use LEV systems if needed.'
      },
      { 
        name: 'Cancerogenic, mutagenic, toxic for reproduction', 
        icon: '☠️',
        recommendations: 'Strict hygiene measures. Clean floors, walls and surfaces regularly. High standard of personal hygiene.'
      },
      { 
        name: 'STOT (Specific Target Organ Toxicity)', 
        icon: '🫁',
        recommendations: 'Ensure proper ventilation and use LEV systems if needed.'
      },
      { 
        name: 'Respiratory sensitizing', 
        icon: '🫁',
        recommendations: 'Ensure proper ventilation and maintain high personal hygiene standards.'
      },
      { 
        name: 'Harmful if inhaled', 
        icon: '🌬️',
        recommendations: 'Ensure proper ventilation and use LEV systems if needed.'
      },
      { 
        name: 'Acute toxicity', 
        icon: '💀',
        recommendations: 'Ensure proper ventilation and use LEV systems if needed.'
      },
      { 
        name: 'Dangerous for aquatic environment', 
        icon: '🐟',
        recommendations: 'Safety inspection by HSE mandatory before commissioning new or modified installation.'
      },
      { 
        name: 'Lead (ex: bricks)', 
        icon: '🧱',
        recommendations: 'Use Local Exhaust Ventilation for lead dust/fumes. Respect occupational exposure limits. Use appropriate PPE.'
      },
      { 
        name: 'Asbestos', 
        icon: '🚫',
        recommendations: 'Notify HSE before asbestos removal work. Package waste to prevent dust dispersion. Label with appropriate pictogram.'
      },
      { 
        name: 'Risk of low oxygen concentration', 
        icon: '⚠️',
        recommendations: 'Risk assessment for fixed detection. Use portable ODH detectors with proper training.'
      },
      { 
        name: 'Risk of high CO₂ concentration', 
        icon: '💨',
        recommendations: 'Risk assessment for fixed detection. Use portable ODH detectors with proper training.'
      },
      { 
        name: 'ATEX risk (potentially explosive atmosphere)', 
        icon: '💥',
        recommendations: 'Work in ATEX zones 0 and 20 prohibited. Use ATEX certified equipment. Complete fire permit for hot work.'
      },
      { 
        name: 'Nanomaterials', 
        icon: '🔬',
        recommendations: 'Keep up-to-date inventory using CERES. Use nanomaterials warning signs. Respect exposure limits.'
      }
    ],
    'Mechanical': [
      { 
        name: 'Use of lifting devices and accessories', 
        icon: '🏗️',
        recommendations: 'Keep area below lifting operations clear. Equipment must be periodically inspected. Personnel must be properly trained and authorized.'
      },
      { 
        name: 'Using MEWP (Mobile Elevated Working Platforms)', 
        icon: '🚧',
        recommendations: 'Mandatory training for MEWP use. Fence off operation area. Use safety harness for category B MEWP.'
      },
      { 
        name: 'Scaffolding', 
        icon: '🔧',
        recommendations: 'Proper commissioning and daily inspection required. No mixing of mechanical components. Report damage immediately.'
      },
      { 
        name: 'Cryogenics', 
        icon: '🧊',
        recommendations: 'Equipment must be CE or π marked. Periodic inspection and requalification required. Proper identification and safety signs.'
      },
      { 
        name: 'Pressure equipment', 
        icon: '⚡',
        recommendations: 'Installation per CERN standards. Periodic inspection required. Register in EAM database. Pressure tests outside working hours.'
      },
      { 
        name: 'Machinery', 
        icon: '⚙️',
        recommendations: 'Must comply with CERN Safety Rules. HSE inspection for nonconformities. Proper training and authorization required.'
      }
    ],
    'Fire': [
      { 
        name: 'Fuel (combustible material)', 
        icon: '🔥',
        recommendations: 'Keep workplace tidy. Evacuate waste regularly. Organize storage away from ignition sources.'
      },
      { 
        name: 'Material', 
        icon: '🧱',
        recommendations: 'Materials must comply with CERN fire safety rules (IS41 for plastics, SSI-FS-2-1 for cables).'
      },
      { 
        name: 'Possible ignition source', 
        icon: '⚡',
        recommendations: 'Keep ignition sources away from combustible material. Install monitoring systems with safety interlocks.'
      },
      { 
        name: 'Hot work', 
        icon: '🔥',
        recommendations: 'Create CERN Fire Permit on IMPACT. Use IS37 to disable fire detection. Ensure proper grounding and fire protection.'
      }
    ],
    'Electrical': [
      { 
        name: 'Electrical activity in laboratories', 
        icon: '🔌',
        recommendations: 'Authorization required for experimental areas. Complete electrical safety training. Use lock-out procedures.'
      },
      { 
        name: 'Non-electrical activity in electrical environment', 
        icon: '⚠️',
        recommendations: 'Protect equipment against dust and damage. Personnel must be trained about electrical risks.'
      },
      { 
        name: 'Electrical equipment design', 
        icon: '⚙️',
        recommendations: 'No live components present. Equipment must be grounded and inspected before use.'
      }
    ]
  };

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