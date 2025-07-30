// Utility to load hazard data from Excel file
export const loadHazardData = async () => {
  try {
    // For now, we'll use hardcoded data that matches your Excel structure
    // In a real implementation, this would read from the Excel file via Electron API
    
    const hazardData = [
      {
        Category: 'Chemical',
        'Specific Hazard': 'Explosive',
        'Safety Measures': 'For each activity involving a hazardous chemical agent and for each hazardous chemical agent involved, the organic unit concerned shall carry out a risk assessment. The sections below report general measures applicable to all chemicals.',
        Icon: '💥'
      },
      {
        Category: 'Chemical',
        'Specific Hazard': 'Flammable',
        'Safety Measures': 'Ensure proper ventilation of the workplace. If ventilation is poor or not sufficient, Local Exhaust Ventilation (LEV) systems can be used. Flammable products must be stored in designated cabinets.',
        Icon: '🔥'
      },
      {
        Category: 'Chemical',
        'Specific Hazard': 'Oxidant',
        'Safety Measures': 'Ensure proper ventilation of the workplace. If ventilation is poor or not sufficient, Local Exhaust Ventilation (LEV) systems can be used.',
        Icon: '🔄'
      },
      {
        Category: 'Chemical',
        'Specific Hazard': 'Corrosive',
        'Safety Measures': 'More information about chemical agents and prevention and protective measures available in EDMS documentation.',
        Icon: '🧪'
      },
      {
        Category: 'Mechanical',
        'Specific Hazard': 'Use of lifting devices and accessories',
        'Safety Measures': 'The area below lifting operations shall be free from personnel presence. No work underneath loads is allowed. Lifting equipment and accessories shall be periodically inspected.',
        Icon: '🏗️'
      },
      {
        Category: 'Mechanical',
        'Specific Hazard': 'Using MEWP (Mobile Elevated Working Platforms)',
        'Safety Measures': 'Personnel must have the mandatory trainings for the use of MEWP. The area below the MEWP operation perimeter shall be fenced off.',
        Icon: '🚧'
      },
      {
        Category: 'Fire',
        'Specific Hazard': 'Fuel (combustible material)',
        'Safety Measures': 'The workplace shall be kept tidy. Waste shall be evacuated at the end of every activity. Dedicated storage areas shall be identified.',
        Icon: '🔥'
      },
      {
        Category: 'Fire',
        'Specific Hazard': 'Hot work',
        'Safety Measures': 'CERN Fire Permit shall be created on IMPACT for any hot work. It shall be approved before the start of the operations.',
        Icon: '🔥'
      },
      {
        Category: 'Electrical',
        'Specific Hazard': 'Electrical activity in laboratories',
        'Safety Measures': 'An "Authorisation to carry out specific electrical activities in CERN experimental areas" is required when working in experimental areas.',
        Icon: '🔌'
      },
      {
        Category: 'Electrical',
        'Specific Hazard': 'Non-electrical activity in electrical environment',
        'Safety Measures': 'Electrical equipment must be protected with solid protection against dust and mechanical damage. Personnel working in the vicinity of electrical equipment shall be trained.',
        Icon: '⚠️'
      }
    ];

    // If we're in Electron, try to read from actual Excel file
    if (window.electronAPI) {
      try {
        // This would be the path to your Excel file
        const excelPath = './CMS_SafetyList_Preventive_Protective_Measures.xlsx';
        const excelData = await window.electronAPI.readExcelFile(excelPath);
        
        if (excelData && excelData.length > 0) {
          return excelData;
        }
      } catch (error) {
        console.warn('Could not read Excel file, using fallback data:', error);
      }
    }

    return hazardData;
  } catch (error) {
    console.error('Error loading hazard data:', error);
    throw error;
  }
};

// Group hazards by category
export const groupHazardsByCategory = (hazardData) => {
  const grouped = {};
  
  hazardData.forEach(hazard => {
    const category = hazard.Category || hazard.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(hazard);
  });
  
  return grouped;
};

// Get safety measures for a specific hazard
export const getSafetyMeasures = (hazardData, category, specificHazard) => {
  const hazard = hazardData.find(h => 
    (h.Category || h.category) === category && 
    (h['Specific Hazard'] || h.specificHazard) === specificHazard
  );
  
  return hazard ? (hazard['Safety Measures'] || hazard.safetyMeasures) : '';
};

// Get icon for a specific hazard
export const getHazardIcon = (hazardData, category, specificHazard) => {
  const hazard = hazardData.find(h => 
    (h.Category || h.category) === category && 
    (h['Specific Hazard'] || h.specificHazard) === specificHazard
  );
  
  return hazard ? (hazard.Icon || hazard.icon) : '❓';
};