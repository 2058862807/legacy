from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from datetime import datetime
import os
import tempfile

class WillPDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        # Custom styles for will documents
        self.styles.add(ParagraphStyle(
            name='WillTitle',
            parent=self.styles['Title'],
            alignment=TA_CENTER,
            fontSize=18,
            fontName='Helvetica-Bold',
            spaceAfter=30
        ))
        
        self.styles.add(ParagraphStyle(
            name='WillHeader',
            parent=self.styles['Heading1'],
            fontSize=14,
            fontName='Helvetica-Bold',
            spaceAfter=12,
            spaceBefore=20
        ))
        
        self.styles.add(ParagraphStyle(
            name='WillBody',
            parent=self.styles['Normal'],
            fontSize=11,
            fontName='Helvetica',
            alignment=TA_JUSTIFY,
            spaceAfter=12
        ))
        
        self.styles.add(ParagraphStyle(
            name='WillSignature',
            parent=self.styles['Normal'],
            fontSize=11,
            fontName='Helvetica',
            spaceAfter=30,
            spaceBefore=20
        ))

    def generate_will_pdf(self, will_data, user_data, compliance_data=None):
        """Generate a PDF will document"""
        
        # Create temporary file
        temp_dir = "/app/uploads/temp"
        os.makedirs(temp_dir, exist_ok=True)
        temp_file = os.path.join(temp_dir, f"will_{will_data.get('id', 'temp')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf")
        
        # Create PDF document
        doc = SimpleDocTemplate(temp_file, pagesize=letter,
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=72)
        
        story = []
        
        # Title
        story.append(Paragraph("LAST WILL AND TESTAMENT", self.styles['WillTitle']))
        story.append(Spacer(1, 20))
        
        # Testator information
        story.append(Paragraph(f"OF {user_data.get('name', '').upper()}", self.styles['WillTitle']))
        story.append(Spacer(1, 30))
        
        # Introduction
        intro_text = f"""
        I, <b>{user_data.get('name', '')}</b>, of {user_data.get('state', '')}, being of sound mind and memory, 
        do hereby make, publish and declare this to be my Last Will and Testament, hereby revoking all 
        former wills and codicils made by me.
        """
        story.append(Paragraph(intro_text, self.styles['WillBody']))
        story.append(Spacer(1, 20))
        
        # Article I - Personal Information
        story.append(Paragraph("ARTICLE I - PERSONAL INFORMATION", self.styles['WillHeader']))
        personal_text = f"""
        My full name is {user_data.get('name', '')}. I am a resident of {user_data.get('state', '')}. 
        This will was created on {datetime.now().strftime('%B %d, %Y')}.
        """
        story.append(Paragraph(personal_text, self.styles['WillBody']))
        
        # Article II - Executors
        if will_data.get('executors'):
            story.append(Paragraph("ARTICLE II - APPOINTMENT OF EXECUTOR", self.styles['WillHeader']))
            executors = will_data.get('executors', [])
            if executors:
                executor_text = f"""
                I hereby nominate and appoint <b>{executors[0].get('name', '')}</b> as the Executor of this Will. 
                If {executors[0].get('name', '')} is unable or unwilling to serve, I nominate 
                {executors[1].get('name', '') if len(executors) > 1 else '[Alternate Executor]'} as alternate Executor.
                """
                story.append(Paragraph(executor_text, self.styles['WillBody']))
        
        # Article III - Assets and Bequests
        if will_data.get('assets') or will_data.get('bequests'):
            story.append(Paragraph("ARTICLE III - DISPOSITION OF PROPERTY", self.styles['WillHeader']))
            
            if will_data.get('bequests'):
                story.append(Paragraph("Specific Bequests:", self.styles['WillBody']))
                for bequest in will_data.get('bequests', []):
                    bequest_text = f"""
                    I give and bequeath {bequest.get('description', '')} to {bequest.get('beneficiary', '')}.
                    """
                    story.append(Paragraph(bequest_text, self.styles['WillBody']))
            
            # Residuary clause
            residuary_text = """
            I give, devise and bequeath all the rest, residue and remainder of my estate, both real and personal, 
            wherever situated, to my beneficiaries as designated in this will, to be divided equally among them.
            """
            story.append(Paragraph(residuary_text, self.styles['WillBody']))
        
        # Article IV - Guardians (if minors)
        if will_data.get('guardians'):
            story.append(Paragraph("ARTICLE IV - APPOINTMENT OF GUARDIAN", self.styles['WillHeader']))
            guardians = will_data.get('guardians', [])
            if guardians:
                guardian_text = f"""
                If at the time of my death any of my children are minors, I nominate and appoint 
                <b>{guardians[0].get('name', '')}</b> as guardian of the person and property of such minor children.
                """
                story.append(Paragraph(guardian_text, self.styles['WillBody']))
        
        # Pet Trust (if applicable)
        if will_data.get('pet_provisions'):
            story.append(Paragraph("ARTICLE V - PET CARE PROVISIONS", self.styles['WillHeader']))
            pet_text = f"""
            I direct that adequate provision be made for the care of my pets as described in the pet care 
            provisions attached to this will. I allocate funds for their care and designate a caretaker 
            as specified in my pet trust provisions.
            """
            story.append(Paragraph(pet_text, self.styles['WillBody']))
        
        # Special Instructions
        if will_data.get('special_instructions'):
            story.append(Paragraph("SPECIAL INSTRUCTIONS", self.styles['WillHeader']))
            story.append(Paragraph(will_data.get('special_instructions', ''), self.styles['WillBody']))
        
        # State Compliance Notice
        if compliance_data:
            story.append(Paragraph("STATE LAW COMPLIANCE", self.styles['WillHeader']))
            compliance_text = f"""
            This will has been prepared in accordance with the laws of {user_data.get('state', '')}. 
            Please ensure proper execution according to state requirements:
            """
            story.append(Paragraph(compliance_text, self.styles['WillBody']))
            
            if compliance_data.get('witnesses_required'):
                story.append(Paragraph(f"• {compliance_data.get('witnesses_required')} witnesses required", self.styles['WillBody']))
            if compliance_data.get('notarization_required'):
                story.append(Paragraph("• Notarization required", self.styles['WillBody']))
            if compliance_data.get('self_proving_allowed'):
                story.append(Paragraph("• Self-proving affidavit recommended", self.styles['WillBody']))
        
        # Signature Section
        story.append(Spacer(1, 40))
        story.append(Paragraph("IN WITNESS WHEREOF", self.styles['WillHeader']))
        signature_text = f"""
        I have hereunto set my hand this _____ day of _____________, 20___.
        <br/><br/>
        <br/>
        _________________________________<br/>
        {user_data.get('name', '')}, Testator
        """
        story.append(Paragraph(signature_text, self.styles['WillSignature']))
        
        # Witness Section
        story.append(Spacer(1, 30))
        witness_text = """
        ATTESTATION OF WITNESSES<br/><br/>
        We, the undersigned, certify that the testator signed this will in our presence, 
        and that we signed as witnesses in the presence of the testator and each other.
        <br/><br/>
        Witness 1: _________________________________  Date: ___________<br/>
        Print Name: _________________________________<br/>
        Address: ____________________________________________________<br/><br/>
        
        Witness 2: _________________________________  Date: ___________<br/>
        Print Name: _________________________________<br/>
        Address: ____________________________________________________<br/>
        """
        story.append(Paragraph(witness_text, self.styles['WillSignature']))
        
        # Notary Section (if required)
        if compliance_data and compliance_data.get('notarization_required'):
            story.append(PageBreak())
            story.append(Paragraph("NOTARY ACKNOWLEDGMENT", self.styles['WillHeader']))
            notary_text = """
            State of: _____________________<br/>
            County of: ____________________<br/><br/>
            
            On this _____ day of _____________, 20___, before me personally appeared 
            {testator_name}, who proved to me on the basis of satisfactory evidence to be the person 
            whose name is subscribed to the within instrument and acknowledged to me that he/she 
            executed the same in his/her authorized capacity, and that by his/her signature on the 
            instrument the person, or the entity upon behalf of which the person acted, executed the instrument.
            <br/><br/>
            I certify under PENALTY OF PERJURY under the laws of the State of {state} that the foregoing 
            paragraph is true and correct.
            <br/><br/>
            WITNESS my hand and official seal.<br/><br/>
            
            _________________________________<br/>
            Notary Public<br/>
            My commission expires: ___________
            """.format(testator_name=user_data.get('name', ''), state=user_data.get('state', ''))
            story.append(Paragraph(notary_text, self.styles['WillSignature']))
        
        # Legal Disclaimer
        story.append(PageBreak())
        story.append(Paragraph("LEGAL DISCLAIMER", self.styles['WillHeader']))
        disclaimer_text = """
        This document was generated by NexteraEstate™, a technology platform providing estate planning tools. 
        NexteraEstate™ is not a law firm and does not provide legal advice. This document should be reviewed 
        by a qualified attorney before execution to ensure compliance with local laws and suitability for 
        your specific circumstances.
        <br/><br/>
        Proper execution of this will requires compliance with your state's witnessing and notarization 
        requirements. Consult with an estate planning attorney for guidance on execution and to address 
        any complex estate planning needs.
        <br/><br/>
        Generated on: {generation_date}<br/>
        Platform: NexteraEstate™ Technology Services
        """.format(generation_date=datetime.now().strftime('%B %d, %Y at %I:%M %p'))
        story.append(Paragraph(disclaimer_text, self.styles['WillBody']))
        
        # Build PDF
        doc.build(story)
        
        return temp_file

    def generate_pet_trust_pdf(self, pet_data, user_data):
        """Generate a PDF for pet trust provisions"""
        
        temp_dir = "/app/uploads/temp"
        os.makedirs(temp_dir, exist_ok=True)
        temp_file = os.path.join(temp_dir, f"pet_trust_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf")
        
        doc = SimpleDocTemplate(temp_file, pagesize=letter,
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=72)
        
        story = []
        
        # Title
        story.append(Paragraph("PET TRUST PROVISIONS", self.styles['WillTitle']))
        story.append(Spacer(1, 30))
        
        # Introduction
        intro_text = f"""
        I, <b>{user_data.get('name', '')}</b>, hereby establish the following provisions for the care 
        of my beloved pets in the event of my death or incapacity.
        """
        story.append(Paragraph(intro_text, self.styles['WillBody']))
        
        # Pet Information
        story.append(Paragraph("PET INFORMATION", self.styles['WillHeader']))
        if pet_data.get('pets'):
            for i, pet in enumerate(pet_data.get('pets', []), 1):
                pet_info = f"""
                Pet {i}: {pet.get('name', '')} - {pet.get('species', '')} - {pet.get('breed', '')}<br/>
                Age: {pet.get('age', '')} - Special Needs: {pet.get('special_needs', 'None')}
                """
                story.append(Paragraph(pet_info, self.styles['WillBody']))
        
        # Caretaker Information
        story.append(Paragraph("CARETAKER DESIGNATION", self.styles['WillHeader']))
        caretaker_text = f"""
        I designate <b>{pet_data.get('primary_caretaker', '')}</b> as the primary caretaker for my pets.
        If the primary caretaker is unable to serve, I designate <b>{pet_data.get('backup_caretaker', '')}</b> 
        as the alternate caretaker.
        """
        story.append(Paragraph(caretaker_text, self.styles['WillBody']))
        
        # Trust Fund
        story.append(Paragraph("TRUST FUNDING", self.styles['WillHeader']))
        funding_text = f"""
        I allocate ${pet_data.get('trust_amount', '0')} from my estate to fund this pet trust. 
        These funds shall be used exclusively for the care, feeding, housing, and veterinary 
        treatment of my pets.
        """
        story.append(Paragraph(funding_text, self.styles['WillBody']))
        
        # Care Instructions
        if pet_data.get('care_instructions'):
            story.append(Paragraph("CARE INSTRUCTIONS", self.styles['WillHeader']))
            story.append(Paragraph(pet_data.get('care_instructions', ''), self.styles['WillBody']))
        
        # Build PDF
        doc.build(story)
        
        return temp_file