const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

async function generateDocument(data, outputPath) {
  try {
    // Load the template from assets
    const templatePath = path.join(__dirname, '../src/assets/Template.docx');
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }
    
    // Read the template file
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    
    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });
    
    // Prepare the data for the template
    const templateData = {
      title: data.title || 'N/A',
      creatorName: data.creatorName || 'N/A',
      creatorDepartment: data.creatorDepartment || 'N/A',
      responsiblePerson: data.responsiblePerson || 'N/A',
      participantCount: data.participantCount || 'N/A',
      startDate: data.startDate || 'N/A',
      endDate: data.endDate || 'N/A',
      buildingLocation: data.buildingLocation || 'N/A',
      locationDetails: data.locationDetails || 'N/A',
      activityDescription: data.activityDescription || 'N/A',
      selectedHazards: data.selectedHazards ? data.selectedHazards.join(', ') : 'None selected',
      safetyDocuments: data.safetyDocuments || 'N/A',
      technicalDocuments: data.technicalDocuments || 'N/A',
      otherDocuments: data.otherDocuments || 'N/A',
      hseSupport: data.hseSupport || 'N/A',
      referenceDocuments: data.referenceDocuments || 'N/A',
      cernSupport: data.cernSupport || 'N/A',
      cmsSupport: data.cmsSupport || 'N/A',
      generationDate: new Date().toLocaleDateString(),
      generationTime: new Date().toLocaleTimeString()
    };
    
    // Render the document
    doc.render(templateData);
    
    // Generate the output
    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    });
    
    // Write the file
    fs.writeFileSync(outputPath, buffer);
    
    console.log('Word document generated successfully:', outputPath);
    return true;
  } catch (error) {
    console.error('Error generating Word document:', error);
    
    // Fallback: create a simple text file if Word generation fails
    try {
      const content = `
CERN CMS Safety Report - Hazard Identification

Activity Information:
Title: ${data.title || 'N/A'}
Creator: ${data.creatorName || 'N/A'}
Department: ${data.creatorDepartment || 'N/A'}
Responsible Person: ${data.responsiblePerson || 'N/A'}
Location: ${data.buildingLocation || 'N/A'}

Activity Description:
${data.activityDescription || 'N/A'}

Selected Hazards:
${data.selectedHazards ? data.selectedHazards.join(', ') : 'None selected'}

Hazard Details:
${JSON.stringify(data.hazardDetails, null, 2)}

Documents:
Safety Documents: ${data.safetyDocuments || 'N/A'}
Technical Documents: ${data.technicalDocuments || 'N/A'}
Other Documents: ${data.otherDocuments || 'N/A'}

Generated on: ${new Date().toLocaleDateString()}
      `;

      // Write the content to a text file
      fs.writeFileSync(outputPath.replace('.docx', '.txt'), content);
      console.log('Text document generated as fallback:', outputPath.replace('.docx', '.txt'));
      return true;
    } catch (fallbackError) {
      console.error('Fallback text generation also failed:', fallbackError);
      throw error;
    }
  }
}

module.exports = {
  generateDocument
}; 