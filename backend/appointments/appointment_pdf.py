"""
DocSpot — Appointment Confirmation PDF Generator
Uses ReportLab to produce professionally formatted appointment confirmation PDFs with a QR code.
"""

import io
from datetime import date as date_type

def generate_appointment_pdf(appointment) -> bytes:
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.lib.units import mm
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
            HRFlowable
        )
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
        from reportlab.graphics.barcode import qr
        from reportlab.graphics.shapes import Drawing
    except ImportError as exc:
        raise ImportError("ReportLab is required for PDF generation.") from exc

    buffer = io.BytesIO()

    TEAL = colors.HexColor('#009688')
    DARK_SLATE = colors.HexColor('#1e293b')
    MID_SLATE = colors.HexColor('#64748b')
    LIGHT_BG = colors.HexColor('#f1f5f9')
    BLUE_TXT = colors.HexColor('#1e40af')

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )

    styles = getSampleStyleSheet()
    story = []

    def p_style(name, parent='Normal', **kwargs):
        return ParagraphStyle(name=name, parent=styles[parent], **kwargs)

    title_style = p_style('title', fontSize=18, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_CENTER)
    label_style = p_style('label', fontSize=9, textColor=MID_SLATE, fontName='Helvetica-Bold')
    value_style = p_style('value', fontSize=10, textColor=DARK_SLATE, fontName='Helvetica')
    section_hdr_style = p_style('secHdr', fontSize=12, textColor=TEAL, fontName='Helvetica-Bold')

    doctor = appointment.doctor
    patient = appointment.patient
    hospital = appointment.hospital

    # Header
    header_data = [[
        Paragraph("<b>HOSPITAL MANAGEMENT SYSTEM</b>", title_style),
    ]]
    header_table = Table(header_data, colWidths=['100%'])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), TEAL),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10 * mm))

    # Details Table
    details = [
        [Paragraph("Hospital Name", label_style), Paragraph(f"<b>{hospital.name if hospital else 'ABC Multispeciality Hospital'}</b>", value_style)],
        [Paragraph("Appointment ID", label_style), Paragraph(f"<b>{appointment.appointment_id}</b>", value_style)],
        [Paragraph("Patient", label_style), Paragraph(f"{patient.get_full_name() or patient.username}", value_style)],
        [Paragraph("Age", label_style), Paragraph(f"{getattr(patient, 'age', '—')}", value_style)],
        [Paragraph("Gender", label_style), Paragraph(f"{getattr(patient, 'gender', '—')}", value_style)],
        [Paragraph("Doctor", label_style), Paragraph(f"Dr. {doctor.user.get_full_name() or doctor.user.username}", value_style)],
        [Paragraph("Department", label_style), Paragraph(f"{appointment.department.name if appointment.department else doctor.specialization}", value_style)],
        [Paragraph("Appointment Date", label_style), Paragraph(f"{appointment.date}", value_style)],
        [Paragraph("Appointment Time", label_style), Paragraph(f"{appointment.time}", value_style)],
        [Paragraph("Token Number", label_style), Paragraph(f"{appointment.token_number or '—'}", value_style)],
        [Paragraph("Booking Time", label_style), Paragraph(f"{appointment.created_at.strftime('%d %B %Y %I:%M %p')}", value_style)],
        [Paragraph("Status", label_style), Paragraph(f"{appointment.status}", value_style)],
        [Paragraph("Payment Status", label_style), Paragraph(f"{appointment.payment_status}", value_style)],
    ]
    
    details_table = Table(details, colWidths=['35%', '65%'])
    details_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.white),
    ]))
    story.append(details_table)
    story.append(Spacer(1, 10 * mm))

    # QR Code
    story.append(HRFlowable(width='100%', thickness=1, color=MID_SLATE))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("<b>QR CODE</b>", p_style('sub', fontSize=12, textColor=DARK_SLATE, alignment=TA_CENTER)))
    story.append(Spacer(1, 3 * mm))
    
    verify_url = f"https://yourhospital.com/appointments/{appointment.appointment_id}"
    qr_code = qr.QrCodeWidget(verify_url)
    bounds = qr_code.getBounds()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    
    # Scale to ~30mm (approx 85 points)
    scale = 85.0 / width
    d = Drawing(85, 85, transform=[scale, 0, 0, scale, 0, 0])
    d.add(qr_code)
    
    qr_table = Table([[d], [Paragraph("Scan to verify appointment", p_style('scan', fontSize=9, textColor=MID_SLATE, alignment=TA_CENTER))]], colWidths=['100%'])
    qr_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(qr_table)
    story.append(Spacer(1, 5 * mm))
    story.append(HRFlowable(width='100%', thickness=1, color=MID_SLATE))
    
    # Footer
    story.append(Spacer(1, 10 * mm))
    hospital_address = hospital.address if hospital else "123 Health Street, City"
    hospital_phone = hospital.phone if hospital else "+1 234 567 8900"
    hospital_website = "www.yourhospital.com"
    
    story.append(Paragraph(f"{hospital_address}", p_style('footer1', fontSize=10, textColor=DARK_SLATE, alignment=TA_CENTER)))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(f"Phone: {hospital_phone}", p_style('footer2', fontSize=10, textColor=DARK_SLATE, alignment=TA_CENTER)))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(f"Website: {hospital_website}", p_style('footer3', fontSize=10, textColor=DARK_SLATE, alignment=TA_CENTER)))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("<b>Thank you for choosing our hospital.</b>", p_style('footer4', fontSize=11, textColor=TEAL, alignment=TA_CENTER)))

    doc.build(story)
    return buffer.getvalue()
