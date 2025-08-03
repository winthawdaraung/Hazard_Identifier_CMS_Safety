const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function formatDateToDDMMYYYY(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  } catch (error) {
    return dateString;
  }
}

function generateTextFallback(data) {
  let content = "HAZARD IDENTIFICATION REPORT\n\n";
  
  // Document Header
  if (data.reference || data.edms || data.validity) {
    content += "DOCUMENT HEADER\n";
    if (data.reference) content += `Reference: ${data.reference}\n`;
    if (data.edms) content += `EDMS: ${data.edms}\n`;
    if (data.validity) content += `Validity: ${data.validity}\n`;
    content += "\n";
  }
  
  // Activity Information
  content += "1. ACTIVITY INFORMATION\n";
  content += `Title: ${data.title || 'N/A'}\n`;
  content += `Responsible Person: ${data.responsiblePerson || 'N/A'}\n`;
  content += `Participant Count: ${data.participantCount || 'N/A'}\n`;
  content += `Start Date: ${formatDateToDDMMYYYY(data.startDate)}\n`;
  content += `End Date: ${formatDateToDDMMYYYY(data.endDate)}\n`;
  content += `Location: ${data.building || ''}/${data.location || ''}\n\n`;
  
  content += `Activity Description: ${data.activityDescription || 'No description provided'}\n\n`;
  
  // Hazard Details
  content += "2. HAZARD DETAILS BY CATEGORY\n";
  if (data.hazardDetails && typeof data.hazardDetails === 'object') {
    Object.keys(data.hazardDetails).forEach(category => {
      const categoryDetails = data.hazardDetails[category];
      if (categoryDetails && typeof categoryDetails === 'object') {
        const selectedHazards = Object.keys(categoryDetails).filter(
          hazard => categoryDetails[hazard] && categoryDetails[hazard].selected
        );
        if (selectedHazards.length > 0) {
          content += `\n${category}:\n`;
          selectedHazards.forEach(hazard => {
            const hazardData = categoryDetails[hazard];
            content += `  - ${hazard}: ${hazardData.details || 'N/A'} | Recommendations: ${hazardData.recommendations || 'N/A'}\n`;
          });
        }
      }
    });
  } else {
    content += "No hazard details provided.\n";
  }
  
  // Supporting Documents
  content += "\n3. SUPPORTING DOCUMENTS\n";
  content += `Safety Documents: ${data.safetyDocuments || 'N/A'}\n`;
  content += `Technical Documents: ${data.technicalDocuments || 'N/A'}\n`;
  content += `Other Documents: ${data.otherDocuments || 'N/A'}\n`;
  content += `Reference Documents: ${data.referenceDocuments || 'N/A'}\n`;
  
  // Contacts
  content += "\n4. CONTACTS AND USEFUL LINKS\n";
  content += "• CERN HSE: Website\n";
  content += "• Contacts CMS Safety: group of CMS Safety referents\n";
  content += "• CMS RP: CMS radiation protection information\n";
  content += "• CMS Safety Training and Access Requirements: all mandatory and recommended training\n";
  content += "• CERN Learning Hub: for the catalogue and registration to available training courses\n";
  content += "• ADaMS: for access requests\n";
  content += "• IMPACT: tool for the declaration of an activity\n";
  content += "• TREC: system for tracing potentially radioactive equipment\n";
  content += "• EDH SIT: for Storage and/or internal transport requests\n";
  content += "• Cms-safety@cern.ch: group of CMS Safety (TC, LEXGLIMOS, DLEXGLIMOS)\n";
  content += "• Cms-safety-team@cern.ch: group of CMS Safety Team (LEXGLIMOS Office)\n";
  content += "• Cms-rso@cern.ch: group of CMS Radiation Safety Officers (RSO, DRSO)\n";
  
  content += `\nGenerated on: ${formatDateToDDMMYYYY(new Date())} at ${new Date().toLocaleTimeString()}`;
  
  return content;
}

async function generateHazardDocument(data, outputPath) {
  try {
    console.log(' Using Python script for DOCX generation...');
    
    // Create temporary JSON file for Python script
    const tempJsonPath = path.join(path.dirname(outputPath), 'temp_data.json');
    fs.writeFileSync(tempJsonPath, JSON.stringify(data, null, 2));
    
    // Call Python script
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(__dirname, 'generate_docx.py');
      
      console.log('Calling Python script:', pythonScript);
      console.log('Input JSON:', tempJsonPath);
      console.log('Output DOCX:', outputPath);
      console.log('Python command: python', pythonScript, tempJsonPath, outputPath);
      
      // Check if Python script exists
      if (!fs.existsSync(pythonScript)) {
        console.error(' Python script not found:', pythonScript);
        reject(new Error(`Python script not found: ${pythonScript}`));
        return;
      }
      
      // Check if temp JSON was created
      if (!fs.existsSync(tempJsonPath)) {
        console.error(' Temp JSON file not created:', tempJsonPath);
        reject(new Error(`Temp JSON file not created: ${tempJsonPath}`));
        return;
      }
      
      const pythonProcess = spawn('python', [pythonScript, tempJsonPath, outputPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('Python stdout:', data.toString().trim());
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('Python stderr:', data.toString().trim());
      });
      
      pythonProcess.on('close', (code) => {
        // Clean up temporary JSON file
        try {
          fs.unlinkSync(tempJsonPath);
        } catch (error) {
          console.log('Could not delete temp JSON file:', error.message);
        }
        
        if (code === 0) {
          console.log('Python script completed successfully');
          resolve(true);
        } else {
          console.error(' Python script failed with code:', code);
          console.error(' Python stderr:', stderr);
          console.error(' Python stdout:', stdout);
          reject(new Error(`Python script failed with code ${code}: ${stderr}`));
        }
      });
      
      pythonProcess.on('error', (error) => {
        console.error(' Failed to start Python script:', error);
        reject(error);
      });
    });
    
  } catch (error) {
    console.error(' Error in Python-based generation:', error);
    
    // Fallback to text file
    try {
      console.log(' Falling back to text generation...');
      const textContent = generateTextFallback(data);
      const textPath = outputPath.replace('.docx', '.txt');
      fs.writeFileSync(textPath, textContent);
      console.log(' Text document generated as fallback:', textPath);
      return true;
    } catch (fallbackError) {
      console.error(' All document generation methods failed:', fallbackError);
      throw error;
    }
  }
}

module.exports = {
  generateHazardDocument
};
