import React from 'react';
import { Check } from 'lucide-react';

const HazardSelection = ({ hazardData, selectedHazards, onHazardSelection }) => {
  // Hazard categories with icons (using emoji as placeholders for now)
  const hazardCategories = [
    { 
      name: 'Chemical', 
      icon: '⚠️', 
      description: 'All hazardous situations involving chemicals',
      color: 'bg-red-50 border-red-200 hover:bg-red-100'
    },
    { 
      name: 'Mechanical', 
      icon: '⚙️', 
      description: 'Dangerous situations involving moving parts',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    { 
      name: 'Non-Ionising Radiation', 
      icon: '📡', 
      description: 'Low-energy radiation (visible, infrared, UV, microwave)',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    },
    { 
      name: 'Ionising Radiation', 
      icon: '☢️', 
      description: 'High-energy radiation capable of ionization',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    { 
      name: 'Fire', 
      icon: '🔥', 
      description: 'Elements that can trigger uncontrolled fire',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    },
    { 
      name: 'Electrical', 
      icon: '⚡', 
      description: 'Risk of contact with live parts, short circuits',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    },
    { 
      name: 'Biological', 
      icon: '🦠', 
      description: 'Organisms or substances that threaten health',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    { 
      name: 'Work Conditions', 
      icon: '🏗️', 
      description: 'Working environment and ergonomics concerns',
      color: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    },
    { 
      name: 'Emergency Preparedness', 
      icon: '🚨', 
      description: 'Elements affecting emergency response',
      color: 'bg-red-50 border-red-200 hover:bg-red-100'
    },
    { 
      name: 'Other Hazards', 
      icon: '❓', 
      description: 'Other hazards not listed above',
      color: 'bg-slate-50 border-slate-200 hover:bg-slate-100'
    },
    { 
      name: 'Environmental Protection', 
      icon: '🌍', 
      description: 'Activities interacting with the environment',
      color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
    }
  ];

  const handleHazardToggle = (hazardName) => {
    const isSelected = selectedHazards.includes(hazardName);
    onHazardSelection(hazardName, !isSelected);
  };

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Hazard Identification</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Select all hazards that apply to your activity. According to <strong>ISO 45001</strong>, 
          a hazard is defined as a source capable of causing injury and ill health.
        </p>
        <p className="text-sm text-gray-500">
          Click on each hazard category that is relevant to your activity. You'll provide detailed 
          information for each selected hazard in the next step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hazardCategories.map((hazard) => {
          const isSelected = selectedHazards.includes(hazard.name);
          
          return (
            <div
              key={hazard.name}
              className={`hazard-card relative ${hazard.color} ${isSelected ? 'ring-2 ring-cern-blue' : ''}`}
              onClick={() => handleHazardToggle(hazard.name)}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-cern-blue text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              {/* Hazard icon */}
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{hazard.icon}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{hazard.name}</h3>
              </div>
              
              {/* Description */}
              <p className="text-xs text-gray-600 text-center leading-tight">
                {hazard.description}
              </p>
              
              {/* Reference link placeholder */}
              <div className="mt-3 text-center">
                <span className="inline-block bg-white px-2 py-1 rounded text-xs text-cern-blue font-medium">
                  Link HSE
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected hazards summary */}
      {selectedHazards.length > 0 && (
        <div className="mt-8 p-4 bg-cern-blue/5 border border-cern-blue/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Selected Hazards ({selectedHazards.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedHazards.map((hazard) => (
              <span 
                key={hazard}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cern-blue text-white"
              >
                {hazard}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHazardToggle(hazard);
                  }}
                  className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HazardSelection;