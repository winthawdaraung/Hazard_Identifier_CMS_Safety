import json
import sys
import os
from datetime import datetime
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.shared import OxmlElement, qn
from docx.oxml.ns import nsdecls
from docx.oxml import parse_xml

def add_hyperlink(paragraph, url, text):
    """Add a hyperlink to a paragraph"""
    try:
        part = paragraph.part
        r_id = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
        
        hyperlink = OxmlElement('w:hyperlink')
        hyperlink.set(qn('r:id'), r_id)
        
        new_run = OxmlElement('w:r')
        rPr = OxmlElement('w:rPr')
        
        # Add hyperlink styling
        c = OxmlElement('w:color')
        c.set(qn('w:val'), "0563C1")
        rPr.append(c)
        
        u = OxmlElement('w:u')
        u.set(qn('w:val'), 'single')
        rPr.append(u)
        
        new_run.append(rPr)
        new_run.text = text
        hyperlink.append(new_run)
        paragraph._p.append(hyperlink)
        
        return hyperlink
    except Exception as e:
        print(f"Warning: Could not create hyperlink for {url}: {e}")
        # Fallback: just add text
        paragraph.add_run(text)
        return None

def format_date(date_string):
    """Format date string to DD/MM/YYYY"""
    if not date_string:
        return "N/A"
    try:
        date_obj = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        return date_obj.strftime("%d/%m/%Y")
    except:
        return date_string

def create_hazard_table(doc, category_name, hazards_data):
    """Create a table for hazard category with Subject, Details, Recommendations columns"""
    try:
        # Add category heading
        heading = doc.add_heading(category_name, level=2)
        
        # Create table with 3 columns: Subject, Details, Recommendations
        table = doc.add_table(rows=1, cols=3)
        table.style = 'Table Grid'
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        # Set column widths
        table.columns[0].width = Inches(2.5)   # Subject
        table.columns[1].width = Inches(3.0)   # Details
        table.columns[2].width = Inches(3.0)   # Recommendations
        
        # Header row
        hdr_cells = table.rows[0].cells
        hdr_cells[0].text = 'Subject'
        hdr_cells[1].text = 'Details'
        hdr_cells[2].text = 'Recommendations'
        
        # Make header bold and add background color
        for cell in hdr_cells:
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.bold = True
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            # Add background color (light blue)
            shading_elm = parse_xml(r'<w:shd {} w:fill="D9E2F3"/>'.format(nsdecls('w')))
            cell._tc.get_or_add_tcPr().append(shading_elm)
        
        # Add data rows for selected hazards only
        # Convert hazards_data to a list to preserve all entries with same name
        hazards_list = []
        
        for hazard_name, hazard_data in hazards_data.items():
            selected_status = hazard_data.get('selected', False)
            # Handle both boolean and string values for selected
            if selected_status == True or selected_status == 'true' or selected_status == 'True':
                hazards_list.append({
                    'name': hazard_name,
                    'data': hazard_data
                })
        
        # Sort by name to group similar hazards together
        hazards_list.sort(key=lambda x: x['name'])
        
        for hazard_entry in hazards_list:
            hazard_name = hazard_entry['name']
            hazard_data = hazard_entry['data']
            
            row_cells = table.add_row().cells
            
            # Subject (hazard name) - use the name from the data if available, otherwise use the key
            display_name = hazard_data.get('name', hazard_name)
            subject_para = row_cells[0].paragraphs[0]
            subject_run = subject_para.runs[0] if subject_para.runs else subject_para.add_run()
            subject_run.text = display_name
            subject_run.bold = True
            
            # Details
            details_text = hazard_data.get('details', 'N/A')
            row_cells[1].text = details_text
            
            # Recommendations - use user input or default from Excel data
            recommendations_text = hazard_data.get('recommendations', '')
            if not recommendations_text or recommendations_text.strip() == '':
                # If no user input, use the default from Excel data
                recommendations_text = hazard_data.get('defaultRecommendations', 'Standard safety measures apply')
            elif recommendations_text == 'No specific safety measures available.':
                # If it's the default placeholder, use a more appropriate text
                recommendations_text = 'Standard safety measures apply'
            
            row_cells[2].text = recommendations_text
        
        # Add spacing after table
        doc.add_paragraph()
    except Exception as e:
        print(f"Error creating hazard table for {category_name}: {e}")

def generate_hazard_document(data, output_path):
    """Generate the complete hazard identification document following CERN template"""
    try:
        print(f"Starting document generation...")
        print(f"Output path: {output_path}")
        print(f"Data keys: {list(data.keys())}")
        
        doc = Document()
        
        # Set document margins
        sections = doc.sections
        for section in sections:
            section.top_margin = Inches(0.5)
            section.bottom_margin = Inches(0.5)
            section.left_margin = Inches(0.5)
            section.right_margin = Inches(0.5)
        
        # Page 1: Title Page
        # Document title
        title = doc.add_heading('Safety Report', 0)
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        title_run = title.runs[0]
        title_run.font.size = Pt(16)
        title_run.font.bold = True
        
        # Subtitle
        subtitle = doc.add_heading('Hazard Identification Process in Areas', 1)
        subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
        subtitle_run = subtitle.runs[0]
        subtitle_run.font.size = Pt(14)
        subtitle_run.font.bold = True
        
        # Location info
        location_para = doc.add_paragraph(f"Building {data.get('building', 'XXXX')}/{data.get('room', 'XX-xxx')} {data.get('location', 'Meyrin/Prevessin/Point 5')}")
        location_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        # Signature table
        sig_table = doc.add_table(rows=2, cols=3)
        sig_table.style = 'Table Grid'
        sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        # Header row
        sig_hdr = sig_table.rows[0].cells
        sig_hdr[0].text = 'Prepared by:'
        sig_hdr[1].text = 'Checked by:'
        sig_hdr[2].text = 'Approved by:'
        
        # Content row
        sig_content = sig_table.rows[1].cells
        creator_formatted = f"{data.get('creatorName', '')} ({data.get('creatorDepartment', '')})"
        sig_content[0].text = creator_formatted
        sig_content[1].text = ''
        sig_content[2].text = ''
        
        doc.add_paragraph('Distribution to:')
        doc.add_paragraph('CMS Safety, Activity Responsible, TSO.')
        
        # Page 2: History of changes
        doc.add_page_break()
        doc.add_heading('History of changes', level=1)
        history_table = doc.add_table(rows=2, cols=3)
        history_table.style = 'Table Grid'
        
        history_hdr = history_table.rows[0].cells
        history_hdr[0].text = 'Rev.'
        history_hdr[1].text = 'Date'
        history_hdr[2].text = 'Description of changes'
        
        history_content = history_table.rows[1].cells
        history_content[0].text = '0.1'
        history_content[1].text = datetime.now().strftime("%d/%m/%Y")
        history_content[2].text = 'Creation of the document'
        
        # Page 3: Contacts and Useful Links
        doc.add_page_break()
        doc.add_heading('1 CONTACTS AND USEFUL LINKS', level=1)
        
        contacts = [
            ('CERN HSE', 'https://hse.cern/', 'Website'),
            ('Contacts CMS Safety', 'mailto:cms-safety@cern.ch', 'group of CMS Safety referents'),
            ('CMS RP', 'https://cms-rp.web.cern.ch/', 'CMS radiation protection information'),
            ('CMS Safety Training and Access Requirements', 'https://cms-safety.web.cern.ch/training-access', 'all mandatory and recommended training'),
            ('CERN Learning Hub', 'https://lms.cern.ch/', 'for the catalogue and registration to available training courses'),
            ('ADaMS', 'https://adams.cern.ch/', 'for access requests'),
            ('IMPACT', 'https://impact.cern.ch/', 'tool for the declaration of an activity'),
            ('TREC', 'https://trec.cern.ch/', 'system for tracing potentially radioactive equipment'),
            ('EDH SIT', 'https://edh.cern.ch/Document/SIT/', 'for Storage and/or internal transport requests')
        ]
        
        for name, url, description in contacts:
            para = doc.add_paragraph('• ')
            add_hyperlink(para, url, name)
            para.add_run(f': {description}')
        
        # Email contacts
        emails = [
            ('Cms-safety@cern.ch', 'group of CMS Safety (TC, LEXGLIMOS, DLEXGLIMOS)'),
            ('Cms-safety-team@cern.ch', 'group of CMS Safety Team (LEXGLIMOS Office)'),
            ('Cms-rso@cern.ch', 'group of CMS Radiation Safety Officers (RSO, DRSO)')
        ]
        
        for email, description in emails:
            para = doc.add_paragraph('• ')
            add_hyperlink(para, f'mailto:{email}', email)
            para.add_run(f': {description}')
        
        # Page 4: Hazards definitions
        doc.add_page_break()
        doc.add_heading('2 HAZARDS DEFINITIONS', level=1)
        
        definition_text = ("According to ISO 45001 a hazard is defined as a source capable of causing injury and ill health. "
                          "Hazards can include sources with the potential to cause harm or hazardous situations, "
                          "or circumstances with the potential for exposure leading to injury and ill health.")
        
        def_para = doc.add_paragraph()
        def_run = def_para.add_run(definition_text)
        def_run.italic = True
        
        # Add ISO link
        iso_para = doc.add_paragraph()
        add_hyperlink(iso_para, 'https://www.iso.org/obp/ui/fr/#iso:std:iso:45001:ed-1:v1:en', 'ISO 45001')
        
        doc.add_paragraph('1. In the CHECK column of the table below, please check the hazards identified for the activity.')
        doc.add_paragraph('2. For each identified hazard, please refer to the identification sheet by simply clicking on the corresponding paragraph (column §).')
        
        # Page 5: Your Area - Activity Summary Information
        doc.add_page_break()
        doc.add_heading('3 YOUR AREA', level=1)
        doc.add_heading('3.1 ACTIVITY SUMMARY INFORMATION', level=2)
        
        # Activity summary table
        summary_table = doc.add_table(rows=6, cols=4)
        summary_table.style = 'Table Grid'
        
        # Fill activity summary
        rows_data = [
            ['Title', data.get('title', 'Enter the name of the specific activity'), '', ''],
            ['Personnel', 'Name of the activity responsible:', data.get('responsiblePerson', 'Enter the name of the person leading activity'), ''],
            ['', 'Estimated number of participants:', data.get('participantCount', 'Enter the number of people performing the activity'), ''],
            ['Dates', 'Start date of the activity:', format_date(data.get('startDate')), f'Estimated end date: {format_date(data.get("endDate"))}'],
            ['Location', 'Building number and specific zone:', f"{data.get('building', '')}/{data.get('location', '')}", ''],
            ['', 'Location details:', f"{data.get('building', '')}/{data.get('room', '')}", '']
        ]
        
        for i, row_data in enumerate(rows_data):
            cells = summary_table.rows[i].cells
            for j, cell_data in enumerate(row_data):
                if j < len(cells):
                    cells[j].text = str(cell_data)
        
        # Support section
        doc.add_paragraph()
        support_table = doc.add_table(rows=1, cols=4)
        support_table.style = 'Table Grid'
        
        support_cells = support_table.rows[0].cells
        support_cells[0].text = 'Support'
        support_cells[1].text = 'CERN specific support (Group):'
        support_cells[2].text = data.get('cernSupport', 'Enter the name of the CERN group')
        support_cells[3].text = f"CMS specific support: {data.get('cmsSupport', 'Enter CMS team')}"
        
        # Documents section
        doc.add_heading('Existing documents', level=3)
        
        doc_table = doc.add_table(rows=4, cols=2)
        doc_table.style = 'Table Grid'
        
        doc_rows = [
            ['Safety file:', data.get('safetyDocuments', 'Risk assessments, certificates, training records, VICs, etc.')],
            ['Technical documents:', data.get('technicalDocuments', 'Technical documents for tooling/equipment used')],
            ['Other useful documents:', data.get('otherDocuments', 'Procedures, instructions, task sheets, etc.')],
            ['Reference documents:', data.get('referenceDocuments', 'Additional supporting documentation from HSE')]
        ]
        
        for i, (label, content) in enumerate(doc_rows):
            cells = doc_table.rows[i].cells
            cells[0].text = label
            cells[1].text = content
        
        # Page 6: Activity Description
        doc.add_page_break()
        doc.add_heading('3.2 DESCRIPTION OF THE ACTIVITY', level=2)
        
        description_text = data.get('activityDescription', 'Further details about the activity...')
        doc.add_paragraph(description_text)
        
        # HSE Guideline note
        guideline_para = doc.add_paragraph('For the Section below, please consider to have a look to this valuable HSE Guideline: ')
        add_hyperlink(guideline_para, 'https://edms.cern.ch/document/1114042', 'https://edms.cern.ch/document/1114042')
        
        # Page 7: Hazard identification section
        doc.add_page_break()
        doc.add_heading('IDENTIFICATION OF THE HAZARDS FOR YOUR ACTIVITY', level=1)
        
        # Process hazard details
        hazard_details = data.get('hazardDetails', {})
        
        if hazard_details:
            for category_name, category_data in hazard_details.items():
                if category_data and isinstance(category_data, dict):
                    # Check if any hazards are selected in this category
                    selected_hazards = {}
                    for k, v in category_data.items():
                        selected_status = v.get('selected', False)
                        if selected_status == True or selected_status == 'true' or selected_status == 'True':
                            selected_hazards[k] = v
                    
                    if selected_hazards:
                        create_hazard_table(doc, category_name, selected_hazards)
        else:
            doc.add_paragraph('No hazard details provided.')
        
        # Annex
        doc.add_heading('ANNEX: PICTURES', level=1)
        doc.add_paragraph('Attached to EDMS Reference.')
        
        # Save document
        print(f"Saving document to: {output_path}")
        doc.save(output_path)
        print(f"SUCCESS: Document generated successfully: {output_path}")
        return True
    except Exception as e:
        print(f"Error generating document: {e}")
        import traceback
        traceback.print_exc()
        raise e

def main():
    """Main function to handle command line arguments"""
    print(f"Python script started with args: {sys.argv}")
    print(f"Current working directory: {os.getcwd()}")
    
    if len(sys.argv) != 3:
        print("Usage: python generate_docx.py <input_json_file> <output_docx_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    print(f"Input file: {input_file}")
    print(f"Output file: {output_file}")
    
    try:
        # Check if input file exists
        if not os.path.exists(input_file):
            print(f"Error: Input file '{input_file}' not found.")
            sys.exit(1)
        
        # Check if we can write to output directory
        output_dir = os.path.dirname(output_file)
        if output_dir and not os.path.exists(output_dir):
            print(f"Error: Output directory '{output_dir}' does not exist.")
            sys.exit(1)
        
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"Successfully loaded JSON data with {len(data)} keys")
        generate_hazard_document(data, output_file)
        print("Document generation completed successfully!")
        
    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in file '{input_file}': {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error generating document: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main() 