// Utility to load hazard data from Excel file
export const loadHazardData = async () => {
  try {
    const fallbackData = [ /* fallback content omitted for brevity */ ];

    if (window.electronAPI) {
      console.log('Electron API is available');

      const possiblePaths = [
        './data/excel/CMS_Safety-List_Preventive_Protective_Measures.xlsx',
        './src/assets/CMS_Safety-List_Preventive_Protective_Measures.xlsx',
        './public/CMS_Safety-List_Preventive_Protective_Measures.xlsx'
      ];

      let result = null;
      let hseLinksResult = null;

      for (const excelPath of possiblePaths) {
        try {
          console.log(`Trying to load Excel file from: ${excelPath}`);
          const sheetName = 'ENG List of hazards';
          result = await window.electronAPI.readExcelFile(excelPath, sheetName, 1);

          const sheetsResult = await window.electronAPI.getExcelSheets(excelPath);
          if (sheetsResult.success) {
            console.log('Available sheets:', sheetsResult.sheets);
          }

          const hseSheetName = 'HSE Sheet';
          try {
            hseLinksResult = await window.electronAPI.readExcelFile(excelPath, hseSheetName, 0);
            if (hseLinksResult && hseLinksResult.success && Array.isArray(hseLinksResult.data)) {
              console.log(`Successfully loaded HSE links from sheet: ${hseSheetName}`);
            }
          } catch (error) {
            console.log(`Failed to load HSE links from sheet ${hseSheetName}:`, error.message);
          }

          if (result.success && Array.isArray(result.data)) {
            console.log(`Successfully loaded Excel file from: ${excelPath}`);
            break;
          }
        } catch (error) {
          console.log(`Failed to load from ${excelPath}:`, error.message);
          continue;
        }
      }

      if (result.success && Array.isArray(result.data)) {
        const hseLinksMap = {};
        if (hseLinksResult && hseLinksResult.success && Array.isArray(hseLinksResult.data)) {
          hseLinksResult.data.forEach(item => {
            const catKey = String(item['Hazard Category'] || '').trim().toLowerCase();
            const link = String(item['HSE Link(s)'] || '').trim();
            if (catKey && link) {
              hseLinksMap[catKey] = link;
            }
          });
        }

        const groupedData = {};
        result.data
          .filter(item => item && typeof item === 'object' && (item.Hazards || item['Specific Hazards']))
          .forEach(item => {
            const category = item.Hazards?.trim() || '';
            const specificHazard = item['Specific Hazards']?.trim() || '';
            const safetyMeasures = item['Safety Measures']?.trim() || '';

            if (category && category !== 'Hazards' && specificHazard) {
              const key = `${category}|${specificHazard}`;
              const lowerKey = category.toLowerCase();

              if (!groupedData[key]) {
                groupedData[key] = {
                  Category: category,
                  'Specific Hazard': specificHazard,
                  'Safety Measures': safetyMeasures,
                  'HSE Link': hseLinksMap[lowerKey] || '',
                  Icon: '❓'
                };
              } else {
                if (safetyMeasures && !groupedData[key]['Safety Measures'].includes(safetyMeasures)) {
                  groupedData[key]['Safety Measures'] += '\n\n' + safetyMeasures;
                }
              }
            }
          });

        const cleanedData = Object.values(groupedData);

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
      const possiblePaths = [
        './data/excel/TSO Recommendation Info.xlsx',
        './src/assets/TSO Recommendation Info.xlsx',
        './public/TSO Recommendation Info.xlsx'
      ];

      let result = null;
      for (const excelPath of possiblePaths) {
        try {
          console.log(`Trying to load building data from: ${excelPath}`);
          const sheetName = 'Building Room Info';
          result = await window.electronAPI.readExcelFile(excelPath, sheetName, 0);

          if (result.success && Array.isArray(result.data)) {
            console.log(`Successfully loaded building data from: ${excelPath}`);
            break;
          }
        } catch (error) {
          console.log(`Failed to load building data from ${excelPath}:`, error.message);
          continue;
        }
      }

      if (result && result.success && Array.isArray(result.data)) {
        const cleanedData = result.data.filter(item =>
          item && typeof item === 'object' &&
          (item.Building || item.Room || item.building || item.room)
        );
        return cleanedData;
      }
    }

    return [
      { Building: 'Building 32', Room: '32/4-B09' },
      { Building: 'Building 32', Room: '32/4-B10' },
      { Building: 'Building 40', Room: '40/4-A01' },
      { Building: 'Building 40', Room: '40/4-A02' },
      { Building: 'Building 42', Room: '42/3-C01' },
      { Building: 'Building 42', Room: '42/3-C02' },
      { Building: 'Building 44', Room: '44/2-D01' }
    ];
  } catch (error) {
    console.error('Error loading building/room data:', error);
    throw error;
  }
};

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