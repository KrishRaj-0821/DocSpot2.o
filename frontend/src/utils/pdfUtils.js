import { jsPDF } from 'jspdf';

/**
 * Generates a DocSpot branded prescription PDF and triggers download.
 * @param {Object} data - Prescription data object
 */
export const generatePrescriptionPDF = (data) => {
  const {
    prescriptionId,
    date,
    doctorName,
    specialization,
    qualification,
    hospitalName = 'DocSpot Central Hospital',
    patientName,
    patientAge,
    patientGender,
    diagnosis,
    medicines = [],
    tests = [],
    advice,
    followUpDate,
  } = data;

  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ── Helper utilities ──────────────────────────────────────────
  const teal = [0, 150, 136];
  const darkSlate = [30, 41, 59];
  const midSlate = [100, 116, 139];
  const lightSlate = [241, 245, 249];

  const line = (x1, y1, x2, y2, color = midSlate, width = 0.3) => {
    pdf.setDrawColor(...color);
    pdf.setLineWidth(width);
    pdf.line(x1, y1, x2, y2);
  };

  const text = (str, x, yPos, options = {}) => {
    const {
      size = 9, bold = false, color = darkSlate, align = 'left',
      maxWidth = null
    } = options;
    pdf.setFontSize(size);
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setTextColor(...color);
    if (maxWidth) {
      pdf.text(str, x, yPos, { align, maxWidth });
    } else {
      pdf.text(str, x, yPos, { align });
    }
  };

  const checkPage = (neededHeight) => {
    if (y + neededHeight > pageHeight - 25) {
      pdf.addPage();
      y = margin;
      drawPageBorder();
    }
  };

  const drawPageBorder = () => {
    pdf.setDrawColor(...teal);
    pdf.setLineWidth(0.5);
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);
  };

  // ── Page border ───────────────────────────────────────────────
  drawPageBorder();

  // ── Header background strip ───────────────────────────────────
  pdf.setFillColor(...teal);
  pdf.rect(margin, y, contentWidth, 22, 'F');

  // Hospital name
  text('DocSpot', margin + 5, y + 7, { size: 14, bold: true, color: [255, 255, 255] });
  text('Advanced Healthcare Platform · Purnia, Bihar', margin + 5, y + 13, { size: 7, color: [200, 240, 235] });
  text('NH-31, Line Bazar, Purnia — +91 6454 224488', margin + 5, y + 18, { size: 6.5, color: [200, 240, 235] });

  // Rx symbol (right side)
  text('Rₓ', pageWidth - margin - 4, y + 13, { size: 18, bold: true, color: [255, 255, 255], align: 'right' });

  y += 27;

  // ── Doctor info row ───────────────────────────────────────────
  pdf.setFillColor(...lightSlate);
  pdf.roundedRect(margin, y, contentWidth * 0.58, 18, 2, 2, 'F');
  text(doctorName || 'Doctor Name', margin + 4, y + 6, { size: 10, bold: true, color: [...darkSlate] });
  text(qualification || '', margin + 4, y + 11, { size: 7.5, color: [...midSlate] });
  text(specialization || '', margin + 4, y + 16, { size: 7, color: [...teal] });

  // Prescription ID + date (right box)
  pdf.setFillColor(230, 247, 245);
  pdf.roundedRect(margin + contentWidth * 0.62, y, contentWidth * 0.38, 18, 2, 2, 'F');
  text('Prescription ID', margin + contentWidth * 0.64, y + 6, { size: 6.5, bold: true, color: [...midSlate] });
  text(prescriptionId || `PC-${Date.now().toString().slice(-6)}`, margin + contentWidth * 0.64, y + 11, { size: 9, bold: true, color: [...teal] });
  text(`Date: ${date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin + contentWidth * 0.64, y + 16.5, { size: 7, color: [...darkSlate] });

  y += 23;

  // ── Patient info row ──────────────────────────────────────────
  line(margin, y, pageWidth - margin, y, teal, 0.4);
  y += 4;
  text('PATIENT INFORMATION', margin, y, { size: 6.5, bold: true, color: [...midSlate] });
  y += 4;

  const pInfoY = y;
  text(`Name: ${patientName || '—'}`, margin, pInfoY + 5, { size: 8.5, bold: true });
  text(`Age: ${patientAge || '—'} yrs  |  Gender: ${patientGender || '—'}`, margin, pInfoY + 11, { size: 8 });
  text(`Hospital: ${hospitalName}`, pageWidth - margin, pInfoY + 5, { size: 8, align: 'right' });
  y += 18;
  line(margin, y, pageWidth - margin, y, [226, 232, 240], 0.3);
  y += 5;

  // ── Diagnosis ─────────────────────────────────────────────────
  if (diagnosis) {
    checkPage(20);
    text('DIAGNOSIS', margin, y, { size: 6.5, bold: true, color: [...midSlate] });
    y += 5;
    pdf.setFillColor(255, 247, 237);
    const diagLines = pdf.splitTextToSize(diagnosis, contentWidth - 8);
    pdf.roundedRect(margin, y, contentWidth, diagLines.length * 5 + 6, 2, 2, 'F');
    text(diagnosis, margin + 4, y + 5.5, { size: 8.5, bold: true, color: [180, 83, 9], maxWidth: contentWidth - 8 });
    y += diagLines.length * 5 + 10;
  }

  // ── Medicines table ───────────────────────────────────────────
  checkPage(25);
  text('MEDICINES', margin, y, { size: 6.5, bold: true, color: [...midSlate] });
  y += 4;
  line(margin, y, pageWidth - margin, y, teal, 0.6);
  y += 1;

  // Table header
  pdf.setFillColor(...teal);
  pdf.rect(margin, y, contentWidth, 7, 'F');
  text('#', margin + 2, y + 5, { size: 6.5, bold: true, color: [255, 255, 255] });
  text('Medicine Name', margin + 8, y + 5, { size: 6.5, bold: true, color: [255, 255, 255] });
  text('Dosage', margin + contentWidth * 0.42, y + 5, { size: 6.5, bold: true, color: [255, 255, 255] });
  text('Frequency', margin + contentWidth * 0.62, y + 5, { size: 6.5, bold: true, color: [255, 255, 255] });
  text('Duration', margin + contentWidth * 0.82, y + 5, { size: 6.5, bold: true, color: [255, 255, 255] });
  y += 7;

  medicines.forEach((med, i) => {
    checkPage(10);
    if (i % 2 === 0) {
      pdf.setFillColor(...lightSlate);
      pdf.rect(margin, y, contentWidth, 8, 'F');
    }
    text(String(i + 1), margin + 2, y + 5.5, { size: 7.5, bold: true });
    const medNameLines = pdf.splitTextToSize(med.name || '', contentWidth * 0.35);
    text(medNameLines[0], margin + 8, y + 5.5, { size: 7.5, bold: true });
    text(med.dosage || '', margin + contentWidth * 0.42, y + 5.5, { size: 7, color: [...midSlate], maxWidth: contentWidth * 0.18 });
    text(med.frequency || '', margin + contentWidth * 0.62, y + 5.5, { size: 7 });
    text(med.duration || '', margin + contentWidth * 0.82, y + 5.5, { size: 7, color: [...teal] });
    y += 8;
  });

  y += 4;

  // ── Tests ─────────────────────────────────────────────────────
  if (tests && tests.length > 0) {
    checkPage(20);
    text('TESTS RECOMMENDED', margin, y, { size: 6.5, bold: true, color: [...midSlate] });
    y += 4;
    line(margin, y, pageWidth - margin, y, teal, 0.6);
    y += 5;

    tests.forEach((test, i) => {
      checkPage(8);
      pdf.setFillColor(240, 253, 250);
      pdf.roundedRect(margin, y, contentWidth * 0.9, 7, 1.5, 1.5, 'F');
      // Small circle bullet
      pdf.setFillColor(...teal);
      pdf.circle(margin + 4, y + 3.5, 1.2, 'F');
      text(test, margin + 9, y + 5, { size: 8 });
      y += 9;
    });
    y += 2;
  }

  // ── Advice ────────────────────────────────────────────────────
  if (advice) {
    checkPage(25);
    text('ADVICE', margin, y, { size: 6.5, bold: true, color: [...midSlate] });
    y += 4;
    line(margin, y, pageWidth - margin, y, teal, 0.6);
    y += 5;
    const adviceLines = pdf.splitTextToSize(advice, contentWidth - 8);
    pdf.setFillColor(240, 249, 255);
    pdf.roundedRect(margin, y, contentWidth, adviceLines.length * 5.5 + 6, 2, 2, 'F');
    text(advice, margin + 4, y + 5.5, { size: 8, color: [30, 64, 175], maxWidth: contentWidth - 8 });
    y += adviceLines.length * 5.5 + 10;
  }

  // ── Follow-up ─────────────────────────────────────────────────
  if (followUpDate) {
    checkPage(18);
    text('FOLLOW-UP', margin, y, { size: 6.5, bold: true, color: [...midSlate] });
    y += 4;
    line(margin, y, pageWidth - margin, y, teal, 0.6);
    y += 5;
    pdf.setFillColor(254, 243, 199);
    pdf.roundedRect(margin, y, contentWidth * 0.45, 10, 2, 2, 'F');
    text(`Next visit: ${new Date(followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin + 5, y + 7, { size: 8.5, bold: true, color: [146, 64, 14] });
    y += 15;
  }

  // ── Doctor Signature ──────────────────────────────────────────
  checkPage(30);
  y += 5;
  line(margin, y, pageWidth - margin, y, [226, 232, 240], 0.3);
  y += 6;

  // Signature box on right
  const sigX = pageWidth - margin - 55;
  pdf.setDrawColor(...midSlate);
  pdf.setLineWidth(0.3);
  pdf.rect(sigX, y, 55, 22);
  text('Doctor Signature', sigX + 27.5, y + 8, { size: 6.5, color: [...midSlate], align: 'center' });
  line(sigX + 4, y + 16, sigX + 51, y + 16, midSlate, 0.3);
  text(doctorName || '', sigX + 27.5, y + 20, { size: 8, bold: true, align: 'center' });

  // Left verification note
  text('This is a digitally generated prescription.', margin, y + 5, { size: 7, color: [...midSlate] });
  text('Valid only when issued by a registered doctor.', margin, y + 10, { size: 7, color: [...midSlate] });

  // QR code placeholder
  pdf.setFillColor(...lightSlate);
  pdf.setDrawColor(...midSlate);
  pdf.setLineWidth(0.3);
  pdf.rect(margin, y + 2, 18, 18);
  text('QR', margin + 9, y + 12, { size: 6.5, color: [...midSlate], align: 'center' });

  y += 30;

  // ── Footer ────────────────────────────────────────────────────
  line(margin, y, pageWidth - margin, y, teal, 0.4);
  y += 4;
  text('DocSpot Healthcare Platform · www.DocSpot.com · helpdesk@DocSpot.com', pageWidth / 2, y, {
    size: 6.5, color: [...midSlate], align: 'center'
  });
  text('In case of emergency: +91 6454 224488', pageWidth / 2, y + 4.5, {
    size: 6.5, color: [...teal], align: 'center'
  });

  // ── Save the PDF ──────────────────────────────────────────────
  const fileName = `DocSpot_Rx_${(prescriptionId || Date.now()).toString().replace(/\s/g, '_')}.pdf`;
  pdf.save(fileName);
};
