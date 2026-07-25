/**
 * generateInvoicePDF
 * Generates a professional pharmacy invoice PDF using jsPDF + autoTable.
 * Works purely client-side — no server needed.
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * @param {Object} order  - The order object from state
 * @param {Object} pharmacy - The pharmacy profile object from state
 */
export const generateInvoicePDF = (order, pharmacy) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // ─── Color palette ────────────────────────────────────────────────────────
  const emerald  = [16, 185, 129];   // #10b981
  const slate800 = [30, 41, 59];     // #1e293b
  const slate500 = [100, 116, 139];  // #64748b
  const slate200 = [226, 232, 240];  // #e2e8f0
  const white     = [255, 255, 255];

  let y = margin;

  // ─── Header band ──────────────────────────────────────────────────────────
  doc.setFillColor(...emerald);
  doc.roundedRect(margin, y, contentWidth, 70, 8, 8, 'F');

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...white);
  doc.text('PurniaCare', margin + 16, y + 28);

  // Tag line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(210, 245, 230);
  doc.text('Your Health. Our Priority.', margin + 16, y + 44);

  // Invoice label on the right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...white);
  doc.text('TAX INVOICE', pageWidth - margin - 16, y + 28, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`INV-PHM-${order.id}`, pageWidth - margin - 16, y + 44, { align: 'right' });

  y += 90;

  // ─── Pharmacy & Bill-To info ───────────────────────────────────────────────
  // Left: pharmacy info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...slate800);
  doc.text('From (Pharmacy)', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slate500);
  const pharmName = pharmacy?.name || 'Purnia Care Central Pharmacy';
  const pharmAddr = pharmacy?.address || 'Purnia, Bihar';
  const pharmPhone = pharmacy?.phone || '+91 99999 55555';
  const pharmGST = pharmacy?.gst_number || '20AAECP9876F1Z5';
  const pharmLicense = pharmacy?.drug_license_number || 'DL-98765-PUR';

  doc.text(pharmName, margin, y + 14);
  doc.text(pharmAddr, margin, y + 26, { maxWidth: 220 });
  doc.text(`Phone: ${pharmPhone}`, margin, y + 50);
  doc.text(`GST No: ${pharmGST}`, margin, y + 62);
  doc.text(`Drug License: ${pharmLicense}`, margin, y + 74);

  // Right: Bill-to & invoice meta
  const rCol = pageWidth / 2 + 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...slate800);
  doc.text('Bill To (Customer)', rCol, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slate500);
  doc.text(`@${order.user_name || 'customer'}`, rCol, y + 14);
  doc.text(order.address || 'Purnia, Bihar', rCol, y + 26, { maxWidth: 200 });

  // Invoice meta box
  const metaBoxX = rCol;
  const metaBoxY = y + 50;
  doc.setFillColor(241, 245, 249);  // slate-100
  doc.roundedRect(metaBoxX, metaBoxY, contentWidth / 2 - 20, 46, 5, 5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...slate500);
  doc.text('Invoice No:', metaBoxX + 10, metaBoxY + 14);
  doc.text('Date:', metaBoxX + 10, metaBoxY + 28);
  doc.text('Payment:', metaBoxX + 10, metaBoxY + 42);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slate800);
  doc.text(`INV-PHM-${order.id}`, metaBoxX + 80, metaBoxY + 14);
  doc.text(order.date || new Date().toLocaleDateString('en-IN'), metaBoxX + 80, metaBoxY + 28);
  doc.text(order.payment_method || 'Cash on Delivery', metaBoxX + 80, metaBoxY + 42);

  y += 110;

  // ─── Divider ──────────────────────────────────────────────────────────────
  doc.setDrawColor(...slate200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  // ─── Items table ──────────────────────────────────────────────────────────
  const rows = (order.items || []).map((item, idx) => {
    const name = item.medicine_details?.name || `Medicine ${idx + 1}`;
    const qty = item.quantity || 1;
    const unitPrice = parseFloat(item.price || 0).toFixed(2);
    const discount = parseFloat(item.discount || 0);
    const discountedUnit = (parseFloat(item.price || 0) * (1 - discount / 100)).toFixed(2);
    const total = (discountedUnit * qty).toFixed(2);
    return [idx + 1, name, qty, `₹${unitPrice}`, `${discount}%`, `₹${total}`];
  });

  if (rows.length === 0) {
    rows.push([1, 'General Medicines', 1, `₹${parseFloat(order.subtotal || 0).toFixed(2)}`, '0%', `₹${parseFloat(order.subtotal || 0).toFixed(2)}`]);
  }

  doc.autoTable({
    startY: y,
    head: [['#', 'Medicine / Item', 'Qty', 'Unit Price', 'Discount', 'Line Total']],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: emerald,
      textColor: white,
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: slate800,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 25 },
      2: { halign: 'center', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 70 },
      4: { halign: 'center', cellWidth: 55 },
      5: { halign: 'right', cellWidth: 75 },
    },
    margin: { left: margin, right: margin },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  y = doc.lastAutoTable.finalY + 20;

  // ─── Totals summary box ───────────────────────────────────────────────────
  const summaryX = pageWidth - margin - 200;
  const summaryW = 200;
  const lineH = 18;

  const subtotal = parseFloat(order.subtotal || 0);
  const tax = parseFloat(order.tax || 0);
  const delivery = parseFloat(order.delivery_charge || 0);
  const total = parseFloat(order.total || 0);

  const summaryRows = [
    ['Subtotal', `₹${subtotal.toFixed(2)}`],
    ['GST / Tax (5%)', `₹${tax.toFixed(2)}`],
    ['Delivery Charges', `₹${delivery.toFixed(2)}`],
  ];

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX, y, summaryW, summaryRows.length * lineH + lineH + 10, 5, 5, 'F');

  summaryRows.forEach(([label, value], i) => {
    const rowY = y + 14 + i * lineH;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...slate500);
    doc.text(label, summaryX + 10, rowY);
    doc.setTextColor(...slate800);
    doc.text(value, summaryX + summaryW - 10, rowY, { align: 'right' });
  });

  // Total row
  const totalRowY = y + 14 + summaryRows.length * lineH + 6;
  doc.setFillColor(...emerald);
  doc.roundedRect(summaryX, totalRowY - 12, summaryW, 22, 5, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...white);
  doc.text('GRAND TOTAL', summaryX + 10, totalRowY + 2);
  doc.text(`₹${total.toFixed(2)}`, summaryX + summaryW - 10, totalRowY + 2, { align: 'right' });

  y += summaryRows.length * lineH + lineH + 30;

  // ─── Status badge ─────────────────────────────────────────────────────────
  const statusColor = order.status === 'Delivered'
    ? [16, 185, 129]      // green
    : order.status === 'Pending'
    ? [245, 158, 11]      // amber
    : order.status === 'Cancelled'
    ? [239, 68, 68]       // red
    : [14, 165, 233];     // sky blue (In Transit)

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(...statusColor);
  doc.roundedRect(margin, y - 8, 80, 16, 4, 4, 'F');
  doc.setTextColor(...white);
  doc.text(`Status: ${order.status || 'N/A'}`, margin + 8, y + 3);

  // ─── Footer ───────────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 40;

  doc.setDrawColor(...slate200);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slate500);
  doc.text(
    'This is a computer-generated invoice. No signature required.',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  doc.text(
    `${pharmName}  •  ${pharmAddr}  •  ${pharmGST}`,
    pageWidth / 2,
    footerY + 12,
    { align: 'center' }
  );
  doc.text(
    'Thank you for choosing PurniaCare! For support: support@purniacare.com',
    pageWidth / 2,
    footerY + 24,
    { align: 'center' }
  );

  // ─── Save ─────────────────────────────────────────────────────────────────
  doc.save(`Invoice_PHM_${order.id}_${Date.now()}.pdf`);
};
