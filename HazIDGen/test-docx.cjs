const { Document, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');

async function testDocxGeneration() {
  try {
    console.log('Testing DOCX generation...');
    
    // Create a simple document with minimal structure
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Test Document",
                bold: true,
                size: 32
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400
            }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "This is a test document to verify DOCX generation is working."
              })
            ],
            spacing: { after: 200 }
          })
        ]
      }]
    });

    // Save the document using the correct API
    const buffer = await doc.save();
    const outputPath = './test-output.docx';
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ DOCX generation successful!');
    console.log('✅ File saved to:', outputPath);
    console.log('✅ File size:', buffer.length, 'bytes');
    
    return true;
  } catch (error) {
    console.error('❌ DOCX generation failed:', error);
    console.error('Error details:', error.message);
    return false;
  }
}

testDocxGeneration(); 