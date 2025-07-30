// Utility to load hazard data from Excel file
export const loadHazardData = async () => {
  try {
    const fallbackData = [
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

    if (window.electronAPI) {
      console.log('Electron API is available');
      const excelPath = './src/assets/CMS_Safety-List_Preventive_Protective_Measures.xlsx';
      const sheetName = 'ENG List of hazards';
      const result = await window.electronAPI.readExcelFile(excelPath, sheetName, 1); // Header at row index 1 (Excel row 2)

      if (result.success && Array.isArray(result.data)) {
        const cleanedData = result.data
          .filter(item =>
            item && typeof item === 'object' &&
            (item.Hazards || item['Specific Hazards'])
          )
          .map(item => ({
            Category: item.Hazards?.trim() || '',
            'Specific Hazard': item['Specific Hazards']?.trim() || '',
            'Safety Measures': item['Safety Measures']?.trim() || '',
            Icon: '❓'
          }))
          .filter(item => item.Category && item.Category !== 'Hazards');

        console.log('Cleaned hazard data:', cleanedData);
        return cleanedData;
      }
    }

    return fallbackData;
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

// Load building and room data from Excel file
export const loadBuildingRoomData = async () => {
  try {
    if (window.electronAPI) {
      const excelPath = './src/assets/TSO Recommendation Info.xlsx';
      const sheetName = 'Building Room Info';
      const result = await window.electronAPI.readExcelFile(excelPath, sheetName, 0); // Header at row index 0

      if (result.success && Array.isArray(result.data)) {
        const cleanedData = result.data.filter(item =>
          item && typeof item === 'object' &&
          (item.Building || item.Room || item.building || item.room)
        );
        return cleanedData;
      }
    }

    // Fallback data
    return [
      { Building: 'Building 32', Room: '32/4-B09' },
      { Building: 'Building 32', Room: '32/4-B10' },
      { Building: 'Building 40', Room: '40/4-A01' },
      { Building: 'Building 40', Room: '40/4-A02' },
      { Building: 'Building 42', Room: '42/3-C01' },
      { Building: 'Building 42', Room: '42/3-C02' },
      { Building: 'Building 44', Room: '44/2-D01' },
    ];
  } catch (error) {
    console.error('Error loading building/room data:', error);
    throw error;
  }
};

// Get unique buildings from the data
export const getUniqueBuildings = (buildingRoomData) => {
  if (!Array.isArray(buildingRoomData)) return [];
  const buildings = buildingRoomData
    .map(item => {
      const raw = item?.Building || item?.building;
      return raw ? String(raw).trim() : null;
    })
    .filter(Boolean);
  return [...new Set(buildings)].sort();
};

// Get rooms for a specific building
export const getRoomsForBuilding = (buildingRoomData, building) => {
  if (!Array.isArray(buildingRoomData) || !building) return [];
  const buildingStr = String(building).trim();
  return buildingRoomData
    .filter(item => {
      const itemBuilding = item?.Building || item?.building;
      return String(itemBuilding).trim() === buildingStr;
    })
    .map(item => item.Room || item.room)
    .filter(room => typeof room === 'string' && room.trim().length > 0)
    .sort();
};
