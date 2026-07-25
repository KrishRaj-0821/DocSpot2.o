"""
Purnia Care — Prescription PDF Generator (Backend)
Uses ReportLab to produce professionally formatted prescription PDFs.

Usage:
    from appointments.pdf_utils import generate_prescription_pdf
    pdf_bytes = generate_prescription_pdf(prescription)
    # Return as FileResponse:
    return FileResponse(
        io.BytesIO(pdf_bytes),
        content_type='application/pdf',
        filename=f"PurniaCare_Rx_{prescription.id}.pdf"
    )
"""

import io
from datetime import date as date_type


def generate_prescription_pdf(prescription) -> bytes:
    """
    Generate a Purnia Care branded prescription PDF.

    Args:
        prescription: Prescription model instance with related appointment.

    Returns:
        bytes: Raw PDF bytes ready to be served or stored.

    Raises:
        ImportError: If reportlab is not installed. Run: pip install reportlab
    """
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
    except ImportError as exc:
        raise ImportError(
            "ReportLab is required for PDF generation. "
            "Install it with: pip install reportlab"
        ) from exc

    buffer = io.BytesIO()

    # ── Colour palette ────────────────────────────────────────
    TEAL = colors.HexColor('#009688')
    DARK_SLATE = colors.HexColor('#1e293b')
    MID_SLATE = colors.HexColor('#64748b')
    LIGHT_BG = colors.HexColor('#f1f5f9')
    ORANGE_TXT = colors.HexColor('#b45309')
    BLUE_TXT = colors.HexColor('#1e40af')
    AMBER_BG = colors.HexColor('#fef3c7')

    # ── Document setup ────────────────────────────────────────
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

    title_style = p_style('title', fontSize=15, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_LEFT)
    sub_title_style = p_style('subTitle', fontSize=7.5, textColor=colors.HexColor('#b2dfdb'), alignment=TA_LEFT)
    label_style = p_style('label', fontSize=7, textColor=MID_SLATE, fontName='Helvetica-Bold')
    value_style = p_style('value', fontSize=8.5, textColor=DARK_SLATE, fontName='Helvetica-Bold')
    normal_style = p_style('normal_sm', fontSize=8, textColor=DARK_SLATE)
    diagnosis_style = p_style('diag', fontSize=9, textColor=ORANGE_TXT, fontName='Helvetica-Bold')
    advice_style = p_style('advice', fontSize=8, textColor=BLUE_TXT, fontName='Helvetica')
    section_hdr_style = p_style('secHdr', fontSize=6.5, textColor=MID_SLATE, fontName='Helvetica-Bold')

    apt = prescription.appointment
    doctor = apt.doctor
    patient = apt.patient
    hospital = apt.hospital

    rx_id = f"PC-{str(prescription.id)[:8].upper()}"
    rx_date = prescription.created_at.strftime('%d %B %Y') if hasattr(prescription, 'created_at') else str(date_type.today().strftime('%d %B %Y'))
    doctor_name = f"Dr. {doctor.user.get_full_name() or doctor.user.username}"
    doctor_spec = str(doctor.specialization) if doctor.specialization else ''
    doctor_qual = doctor.qualification or ''
    hospital_name = hospital.name if hospital else 'Purnia Care'
    patient_name = patient.get_full_name() or patient.username
    patient_phone = getattr(patient, 'phone', '')

    # ── Header: teal background with hospital name ────────────
    header_data = [[
        Paragraph(f"<b>Purnia Care</b>", title_style),
        Paragraph("<b>Rₓ</b>", p_style('rx', fontSize=20, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_RIGHT))
    ]]
    header_table = Table(header_data, colWidths=['85%', '15%'])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), TEAL),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (0, -1), 6),
        ('RIGHTPADDING', (-1, 0), (-1, -1), 6),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4 * mm))

    # ── Doctor + Prescription ID row ──────────────────────────
    doc_info = Table([
        [
            Paragraph(f"<b>{doctor_name}</b>", p_style('dn', fontSize=11, textColor=DARK_SLATE, fontName='Helvetica-Bold')),
            Paragraph(f"Prescription ID: <b>{rx_id}</b>", p_style('pid', fontSize=9, textColor=TEAL, fontName='Helvetica-Bold', alignment=TA_RIGHT))
        ],
        [
            Paragraph(doctor_qual, label_style),
            Paragraph(f"Date: {rx_date}", p_style('dt', fontSize=8, textColor=MID_SLATE, alignment=TA_RIGHT))
        ],
        [
            Paragraph(doctor_spec, p_style('ds', fontSize=8, textColor=TEAL)),
            Paragraph(hospital_name, p_style('hn', fontSize=7.5, textColor=MID_SLATE, alignment=TA_RIGHT))
        ],
    ], colWidths=['60%', '40%'])
    doc_info.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (0, -1), 6),
        ('RIGHTPADDING', (-1, 0), (-1, -1), 6),
        ('ROUNDEDCORNERS', [3]),
    ]))
    story.append(doc_info)
    story.append(Spacer(1, 3 * mm))
    story.append(HRFlowable(width='100%', thickness=0.5, color=TEAL))
    story.append(Spacer(1, 3 * mm))

    # ── Patient Info ──────────────────────────────────────────
    story.append(Paragraph("PATIENT INFORMATION", section_hdr_style))
    story.append(Spacer(1, 2 * mm))
    patient_data = Table([[
        Paragraph(f"<b>{patient_name}</b>", value_style),
        Paragraph(patient_phone, normal_style),
        Paragraph(f"Hospital: {hospital_name}", normal_style),
    ]], colWidths=['40%', '30%', '30%'])
    patient_data.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (0, -1), 4),
    ]))
    story.append(patient_data)
    story.append(HRFlowable(width='100%', thickness=0.3, color=colors.HexColor('#e2e8f0')))
    story.append(Spacer(1, 3 * mm))

    # ── Diagnosis ─────────────────────────────────────────────
    if prescription.diagnosis:
        story.append(Paragraph("DIAGNOSIS", section_hdr_style))
        story.append(Spacer(1, 1.5 * mm))
        diag_table = Table([[Paragraph(prescription.diagnosis, diagnosis_style)]])
        diag_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fff7ed')),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('ROUNDEDCORNERS', [3]),
        ]))
        story.append(diag_table)
        story.append(Spacer(1, 4 * mm))

    # ── Medicines table ───────────────────────────────────────
    if prescription.medicines:
        story.append(Paragraph("MEDICINES", section_hdr_style))
        story.append(HRFlowable(width='100%', thickness=0.6, color=TEAL))
        story.append(Spacer(1, 1 * mm))

        med_header = [
            Paragraph('#', p_style('mh', fontSize=6.5, textColor=colors.white, fontName='Helvetica-Bold')),
            Paragraph('Medicine', p_style('mh', fontSize=6.5, textColor=colors.white, fontName='Helvetica-Bold')),
            Paragraph('Dosage', p_style('mh', fontSize=6.5, textColor=colors.white, fontName='Helvetica-Bold')),
            Paragraph('Frequency', p_style('mh', fontSize=6.5, textColor=colors.white, fontName='Helvetica-Bold')),
            Paragraph('Duration', p_style('mh', fontSize=6.5, textColor=colors.white, fontName='Helvetica-Bold')),
        ]
        med_rows = [med_header]
        for i, med in enumerate(prescription.medicines):
            row_bg = LIGHT_BG if i % 2 == 0 else colors.white
            med_rows.append([
                Paragraph(str(i + 1), normal_style),
                Paragraph(f"<b>{med.get('name', '')}</b>", p_style(f'm{i}n', fontSize=8, textColor=DARK_SLATE, fontName='Helvetica-Bold')),
                Paragraph(med.get('dosage', ''), normal_style),
                Paragraph(med.get('frequency', ''), normal_style),
                Paragraph(f"<b>{med.get('duration', '')}</b>", p_style(f'm{i}d', fontSize=8, textColor=TEAL, fontName='Helvetica-Bold')),
            ])

        med_table = Table(med_rows, colWidths=['5%', '30%', '25%', '25%', '15%'])
        med_table_style = [
            ('BACKGROUND', (0, 0), (-1, 0), TEAL),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 0.2, colors.HexColor('#e2e8f0')),
        ]
        for i in range(1, len(med_rows)):
            bg = LIGHT_BG if i % 2 == 1 else colors.white
            med_table_style.append(('BACKGROUND', (0, i), (-1, i), bg))

        med_table.setStyle(TableStyle(med_table_style))
        story.append(med_table)
        story.append(Spacer(1, 4 * mm))

    # ── Tests ─────────────────────────────────────────────────
    if prescription.tests:
        story.append(Paragraph("TESTS RECOMMENDED", section_hdr_style))
        story.append(HRFlowable(width='100%', thickness=0.6, color=TEAL))
        story.append(Spacer(1, 2 * mm))
        for test in prescription.tests:
            story.append(Paragraph(f"• {test}", normal_style))
            story.append(Spacer(1, 1 * mm))
        story.append(Spacer(1, 3 * mm))

    # ── Advice ────────────────────────────────────────────────
    if prescription.advice:
        story.append(Paragraph("ADVICE", section_hdr_style))
        story.append(HRFlowable(width='100%', thickness=0.6, color=TEAL))
        story.append(Spacer(1, 2 * mm))
        advice_table = Table([[Paragraph(prescription.advice, advice_style)]])
        advice_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#eff6ff')),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(advice_table)
        story.append(Spacer(1, 4 * mm))

    # ── Follow-up ─────────────────────────────────────────────
    if prescription.follow_up_date:
        story.append(Paragraph("FOLLOW-UP", section_hdr_style))
        story.append(HRFlowable(width='100%', thickness=0.6, color=TEAL))
        story.append(Spacer(1, 2 * mm))
        fu_str = prescription.follow_up_date.strftime('%d %B %Y') if hasattr(prescription.follow_up_date, 'strftime') else str(prescription.follow_up_date)
        fu_table = Table([[Paragraph(f"📅  Next Visit: <b>{fu_str}</b>", p_style('fu', fontSize=9, textColor=ORANGE_TXT, fontName='Helvetica-Bold'))]])
        fu_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), AMBER_BG),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(fu_table)
        story.append(Spacer(1, 5 * mm))

    # ── Signature ─────────────────────────────────────────────
    story.append(HRFlowable(width='100%', thickness=0.3, color=colors.HexColor('#e2e8f0')))
    story.append(Spacer(1, 4 * mm))
    sig_table = Table([
        [
            Paragraph("This is a digitally generated prescription.\nValid only when issued by a registered medical practitioner.", label_style),
            Paragraph(f"<b>{doctor_name}</b><br/>{doctor_qual}<br/><i>Authorized Signatory</i>",
                      p_style('sig', fontSize=8, textColor=DARK_SLATE, alignment=TA_CENTER)),
        ]
    ], colWidths=['55%', '45%'])
    sig_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LINEABOVE', (1, 0), (1, 0), 1, MID_SLATE),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
    ]))
    story.append(sig_table)

    # ── Footer ─────────────────────────────────────────────────
    story.append(Spacer(1, 4 * mm))
    story.append(HRFlowable(width='100%', thickness=0.4, color=TEAL))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "Purnia Care Healthcare Platform · www.purniacare.com · helpdesk@purniacare.com · Emergency: +91 6454 224488",
        p_style('footer', fontSize=6.5, textColor=MID_SLATE, alignment=TA_CENTER)
    ))

    doc.build(story)
    return buffer.getvalue()
