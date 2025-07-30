const { Document } = require('docx');

const doc = new Document();

const addTitle = (doc, title) => {
    doc.addSection({
        properties: {
            page: {
                size: {
                    width: 1224,
                    height: 768
                }
            }
        }
    });
    doc.addHeader('header1', 'This is a test header');
    doc.addParagraph(title);
    doc.addParagraph('This is a test document');
    doc.addParagraph('This is a test document');    
    doc.save('test.docx');  
}

addTitle(doc, 'Test Title');

module.exports = {
    addTitle
}