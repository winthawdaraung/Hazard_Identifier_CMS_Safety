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
        const hazardDefinitionsMap = {};
        if (hseLinksResult && hseLinksResult.success && Array.isArray(hseLinksResult.data)) {
          console.log('HSE Sheet data:', hseLinksResult.data);
          hseLinksResult.data.forEach(item => {
            console.log('Processing HSE item:', item);
            const catKey = String(item['Hazard Category'] || item['Category'] || '').trim().toLowerCase();
            const definition = String(item['Definition'] || '').trim();
            const link = String(item['HSE Link(s)'] || item['HSE Link'] || '').trim();
            if (catKey) {
              if (link) {
                hseLinksMap[catKey] = link;
              }
              if (definition) {
                hazardDefinitionsMap[catKey] = definition;
              }
            }
          });
          console.log('HSE Links Map:', hseLinksMap);
          console.log('Hazard Definitions Map:', hazardDefinitionsMap);
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
                  'Definition': hazardDefinitionsMap[lowerKey] || '',
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

        // Add fallback definitions if none were loaded from Excel
        if (Object.keys(hazardDefinitionsMap).length === 0) {
          console.log('No definitions found in Excel, using fallback definitions');
          const fallbackDefinitions = {
            'chemical': 'All hazardous situations involving chemicals (product whether marketed or not, of natural origin or manufactured, used or emitted in different forms (solid, powder, liquid, gas, dust, smoke, fog, particles, fibers, etc.)), in the conditions of use and/or exposure.',
            'mechanical': 'All dangerous situations involving moving parts that can come into contact with a part of the human body and cause injury. These elements are often related to equipment or machines but can also relate to tools, parts, loads, projections of materials or fluids.',
            'non ionizing radiation': 'A type of low-energy radiation that does not have enough energy to remove an electron (negative particle) from an atom or molecule. Non-ionizing radiation includes visible, infrared and ultraviolet light; microwave; radio waves; and radio frequency energy from cell phones.',
            'ionizing radiation': 'Ionizing radiation consists of charged particles (e.g. positive or negative electrons, protons or other heavy ions and/or uncharged particles (e.g. photons or neutrons) capable of causing process ionization primary or secondary Ionizing radiation can be direct and indirect.',
            'fire': 'Set of dangerous situations involving elements that can trigger an uncontrolled fire, the main characteristic of which is to spread.',
            'electrical': 'All dangerous situations involving the risk of contact, direct or otherwise, with a bare live part, the risk of short circuits, and the risk of electric arcing. Its consequences are electrification, electrocution, fire, explosion ...',
            'biological': 'All dangerous situations involving organisms or substances derived from an organism which represent a threat to health. This includes wastes, microorganisms, viruses or toxins.',
            'work conditions': 'All dangerous situations concerning the entire working environment as well as ergonomics.',
            'emergency preparedness': 'Set of dangerous situations involving all elements that may have an impact on the response to emergency situations',
            'environmental protection': 'Activity interacting or likely to interact with the environment (environment in which an organism operates, including air, water, soil, natural resources, flora, fauna, humans and their interrelationships)'
          };
          
          // Add fallback definitions to the map
          Object.keys(fallbackDefinitions).forEach(key => {
            hazardDefinitionsMap[key] = fallbackDefinitions[key];
          });
        }

        console.log('Cleaned hazard data:', cleanedData);
        
        // Create hazard definitions for DOCX generation
        const hazardDefinitions = [];
        const sectionMap = {
          'chemical': '§ 4.1',
          'mechanical': '§ 4.2', 
          'non ionizing radiation': '§ 4.3',
          'ionizing radiation': '§ 4.4',
          'fire': '§ 4.5',
          'electrical': '§ 4.6',
          'biological': '§ 4.7',
          'work conditions': '§ 4.8',
          'emergency preparedness': '§ 4.9',
          'environmental protection': '§ 5'
        };
        
        // Create definitions from the loaded data
        Object.keys(hazardDefinitionsMap).forEach(category => {
          const section = sectionMap[category.toLowerCase()] || '§ 4.10';
          const definition = hazardDefinitionsMap[category];
          const link = hseLinksMap[category] || 'Link HSE';
          
          // Normalize "Other hazards" to match frontend expectation
          let hazardName = category.charAt(0).toUpperCase() + category.slice(1);
          if (category.toLowerCase() === 'other hazards') {
            hazardName = 'Other Hazards';  // Match frontend naming
          }
          
          hazardDefinitions.push({
            section: section,
            hazard: hazardName,
            definition: definition,
            ref: link
          });
        });
        
        // Add the definitions to the return data
        return {
          hazardData: cleanedData,
          hazardDefinitions: hazardDefinitions
        };
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

// Load contact data from Excel file
export const loadContactData = async () => {
  try {
    if (window.electronAPI) {
      const possiblePaths = [
        './data/excel/TSO Recommendation Info.xlsx',
        './src/assets/TSO Recommendation Info.xlsx',
        './public/TSO Recommendation Info.xlsx'
      ];

      let webContactsResult = null;
      let emailContactsResult = null;
      
      for (const excelPath of possiblePaths) {
        try {
          console.log(`Trying to load contact data from: ${excelPath}`);
          
          // Load Web Contacts sheet
          try {
            webContactsResult = await window.electronAPI.readExcelFile(excelPath, 'Web Contacts', 0);
            if (webContactsResult && webContactsResult.success && Array.isArray(webContactsResult.data)) {
              console.log(`Successfully loaded Web Contacts from: ${excelPath}`);
            }
          } catch (error) {
            console.log(`Failed to load Web Contacts from ${excelPath}:`, error.message);
          }

          // Load Email Contacts sheet
          try {
            emailContactsResult = await window.electronAPI.readExcelFile(excelPath, 'Email Contacts', 0);
            if (emailContactsResult && emailContactsResult.success && Array.isArray(emailContactsResult.data)) {
              console.log(`Successfully loaded Email Contacts from: ${excelPath}`);
            }
          } catch (error) {
            console.log(`Failed to load Email Contacts from ${excelPath}:`, error.message);
          }

          // If both sheets loaded successfully from this path, break
          if (webContactsResult?.success && emailContactsResult?.success) {
            break;
          }
        } catch (error) {
          console.log(`Failed to access file ${excelPath}:`, error.message);
          continue;
        }
      }

      // Process and return the data
      const contactData = {
        webContacts: [],
        emailContacts: []
      };

      // Process Web Contacts
      if (webContactsResult && webContactsResult.success && Array.isArray(webContactsResult.data)) {
        contactData.webContacts = webContactsResult.data
          .filter(item => item && typeof item === 'object' && item.Title && item.URL)
          .map(item => ({
            title: String(item.Title || '').trim(),
            url: String(item.URL || '').trim(),
            description: String(item.Description || '').trim()
          }));
        console.log(`Processed ${contactData.webContacts.length} web contacts`);
      }

      // Process Email Contacts
      if (emailContactsResult && emailContactsResult.success && Array.isArray(emailContactsResult.data)) {
        contactData.emailContacts = emailContactsResult.data
          .filter(item => item && typeof item === 'object' && item.Email)
          .map(item => ({
            email: String(item.Email || '').trim(),
            description: String(item.Description || '').trim()
          }));
        console.log(`Processed ${contactData.emailContacts.length} email contacts`);
      }

      return contactData;
    }

    // Fallback data if Excel cannot be loaded - show error indicator
    console.error('Could not load contact data from Excel file. Using fallback contacts.');
    return {
      webContacts: [
        {
          title: "⚠️ CERN HSE (Fallback)",
          url: "https://hse.cern/",
          description: "Website - Using fallback data (Excel not loaded)"
        },
        {
          title: "⚠️ Contacts CMS Safety (Fallback)",
          url: "https://cmssafety.web.cern.ch/who-are-we",
          description: "group of CMS Safety referents - Using fallback data"
        }
      ],
      emailContacts: [
        {
          email: "Cms-safety@cern.ch",
          description: "⚠️ Fallback: group of CMS Safety (TC, LEXGLIMOS, DLEXGLIMOS)"
        }
      ],
      isUsingFallback: true
    };
  } catch (error) {
    console.error('Error loading contact data:', error);
    throw error;
  }
};