import React from 'react';
import { Check } from 'lucide-react';
import { groupHazardsByCategory } from '../utils/hazardLoader';

const HazardSelection = ({ hazardData, selectedHazards, onHazardSelection }) => {
  // Group hazards by category from the actual data
  const groupedHazards = groupHazardsByCategory(hazardData);
  
  // Create hazard categories from the actual data
  const hazardCategories = Object.keys(groupedHazards).map(category => {
    // Map category names to icons and colors
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
    
    
    const config = categoryConfig[category] || { 
      icon: '❓', 
      color: 'bg-slate-50 border-slate-200 hover:bg-slate-100' 
    };
    
    // Get HSE link from the first hazard in this category (assuming all hazards in a category have the same HSE link)
    const hseLink = groupedHazards[category][0]?.['HSE Link'] || '';
    
    return {
      name: category,
      icon: config.icon,
      description: `${groupedHazards[category].length} specific hazards`,
      color: config.color,
      hazards: groupedHazards[category],
      hseLink: hseLink
    };
  });

  const handleHazardToggle = (hazardName) => {
    const isSelected = selectedHazards.includes(hazardName);
    onHazardSelection(hazardName, !isSelected);
  };

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Hazard Identification</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Select all hazards that apply to your activity. According to <strong><a href="https://www.iso.org/obp/ui/fr/#iso:std:iso:45001:ed-1:v1:en"></a>ISO 45001</strong>, a hazard is defined as a source capable of causing injury and ill health. Hazards can include sources with the potential to cause harm or hazardous situations, or circumstances with the potential for exposure leading to injury and ill health.  
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
              
              {/* HSE Link */}
              <div className="mt-3 text-center">
                {hazard.hseLink ? (
                  <a
                    href={hazard.hseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white px-2 py-1 rounded text-xs text-cern-blue font-medium hover:bg-cern-blue hover:text-white transition-colors cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Link HSE
                  </a>
                ) : (
                  <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 font-medium">
                    No Link
                  </span>
                )}
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