const { Document, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } = require('docx');
const fs = require('fs');
const path = require('path');

async function generateHazardDocument(data, outputPath) {
  try {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: {
              width: 12240,
              height: 15840
            },
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        }
      }]
    });

    // Title
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: "HAZARD IDENTIFICATION REPORT",
            bold: true,
            size: 32
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400
        }
      })
    );

    // Activity Information Section
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: "1. ACTIVITY INFORMATION",
            bold: true,
            size: 24
          })
        ],
        spacing: {
          before: 400,
          after: 200
        }
      })
    );

    // Activity details table
    const activityTable = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Activity Title", bold: true })] })],
              width: { size: 30, type: WidthType.PERCENTAGE }
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.title || 'N/A' })] })],
              width: { size: 70, type: WidthType.PERCENTAGE }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Creator", bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.creatorName || 'N/A' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Department", bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.creatorDepartment || 'N/A' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Responsible Person", bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.responsiblePerson || 'N/A' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Location", bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `${data.location || 'N/A'} - ${data.buildingLocation || 'N/A'} - ${data.locationDetails || 'N/A'}` })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Activity Period", bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `${data.startDate || 'N/A'} to ${data.endDate || 'N/A'}` })] })]
            })
          ]
        })
      ]
    });

    doc.addTable(activityTable);

    // Activity Description
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: "Activity Description:",
            bold: true
          })
        ],
        spacing: { before: 400 }
      })
    );
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: data.activityDescription || 'No description provided'
          })
        ],
        spacing: { after: 400 }
      })
    );

    // Selected Hazards Section
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: "2. SELECTED HAZARD CATEGORIES",
            bold: true,
            size: 24
          })
        ],
        spacing: {
          before: 400,
          after: 200
        }
      })
    );

    if (data.selectedHazards && data.selectedHazards.length > 0) {
      data.selectedHazards.forEach(hazard => {
        doc.addParagraph(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${hazard}`
              })
            ],
            spacing: { after: 100 }
          })
        );
      });
    } else {
      doc.addParagraph(
        new Paragraph({
          children: [
            new TextRun({
              text: "No hazards selected"
            })
          ],
          spacing: { after: 400 }
        })
      );
    }

    // Hazard Details Section
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: "3. HAZARD DETAILS",
            bold: true,
            size: 24
          })
        ],
        spacing: {
          before: 400,
          after: 200
        }
      })
    );

    // Add selected hazard details
    if (data.hazardDetails && Object.keys(data.hazardDetails).length > 0) {
      Object.keys(data.hazardDetails).forEach(category => {
        const categoryDetails = data.hazardDetails[category];
        const selectedHazards = Object.keys(categoryDetails).filter(hazard => 
          categoryDetails[hazard].selected
        );

        if (selectedHazards.length > 0) {
          // Category header
          doc.addParagraph(
            new Paragraph({
              children: [
                new TextRun({
                  text: category,
                  bold: true,
                  size: 20
                })
              ],
              spacing: { before: 300, after: 200 }
            })
          );

          // Add each selected hazard
          selectedHazards.forEach(hazard => {
            const hazardData = categoryDetails[hazard];
            
            doc.addParagraph(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${hazard}`,
                    bold: true
                  })
                ],
                spacing: { before: 200 }
              })
            );

            if (hazardData.details) {
              doc.addParagraph(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `  Details: ${hazardData.details}`
                    })
                  ],
                  spacing: { after: 200 }
                })
              );
            }
          });
        }
      });
    } else {
      doc.addParagraph(
        new Paragraph({
          children: [
            new TextRun({
              text: "No hazard details provided"
            })
          ],
          spacing: { after: 400 }
        })
      );
    }

    // Documents Section
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: "4. SUPPORTING DOCUMENTS",
            bold: true,
            size: 24
          })
        ],
        spacing: {
          before: 400,
          after: 200
        }
      })
    );

    const documentsTable = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Document Type", bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Details", bold: true })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Safety Documents" })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.safetyDocuments || 'N/A' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Technical Documents" })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.technicalDocuments || 'N/A' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Other Documents" })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.otherDocuments || 'N/A' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "HSE Support" })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.hseSupport || 'N/A' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Reference Documents" })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.referenceDocuments || 'N/A' })] })]
            })
          ]
        })
      ]
    });

    doc.addTable(documentsTable);

    // Contacts Section
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: "5. CONTACTS",
            bold: true,
            size: 24
          })
        ],
        spacing: {
          before: 400,
          after: 200
        }
      })
    );

    const contactsTable = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Contact Type", bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Details", bold: true })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "CERN Support" })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.cernSupport || 'N/A' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "CMS Support" })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: data.cmsSupport || 'N/A' })] })]
            })
          ]
        })
      ]
    });

    doc.addTable(contactsTable);

    // Footer with generation info
    doc.addParagraph(
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 }
      })
    );

    // Save the document
    const buffer = await doc.save();
    fs.writeFileSync(outputPath, buffer);
    
    console.log('Hazard identification document generated successfully:', outputPath);
    return true;
  } catch (error) {
    console.error('Error generating hazard document:', error);
    throw error;
  }
}

module.exports = {
  generateHazardDocument
}; 