/**
 * generateReportPDF
 * Generates a monthly sales analytics report PDF for the pharmacy admin.
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * @param {Array}  orders   - All orders in state
 * @param {Array}  medicines - All medicines in state
 * @param {Object} pharmacy  - Pharmacy profile
 */
export const generateReportPDF = (orders, medicines, pharmacy) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const emerald  = [16, 185, 129];
  const slate800 = [30, 41, 59];
  const slate500 = [100, 116, 139];
  const slate200 = [226, 232, 240];
  const white     = [255, 255, 255];

  let y = margin;

  // ─── Header ──────────────────────────────────────────────────────────────
  doc.setFillColor(...emerald);
  doc.roundedRect(margin, y, contentWidth, 70, 8, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...white);
  doc.text('PurniaCare — Pharmacy Analytics Report', margin + 16, y + 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(210, 245, 230);
  const pharmName = pharmacy?.name || 'Purnia Care Central Pharmacy';
  doc.text(`${pharmName}  |  Generated: ${new Date().toLocaleString('en-IN')}`, margin + 16, y + 50);

  y += 90;

  // ─── KPI Summary Cards ────────────────────────────────────────────────────
  const delivered   = orders.filter(o => o.status === 'Delivered');
  const pending     = orders.filter(o => o.status === 'Pending');
  const cancelled   = orders.filter(o => o.status === 'Cancelled');
  const totalRev    = delivered.reduce((acc, o) => acc + parseFloat(o.total || 0), 0);
  const netProfit   = totalRev * 0.25;
  const taxCollected = totalRev * 0.05;
  const lowStock    = medicines.filter(m => m.stock < 20).length;

  const kpis = [
    { label: 'Total Revenue',    value: `₹${totalRev.toFixed(2)}`,      color: emerald },
    { label: 'Net Profit (25%)', value: `₹${netProfit.toFixed(2)}`,     color: [59, 130, 246] },
    { label: 'Tax Collected',    value: `₹${taxCollected.toFixed(2)}`,  color: [245, 158, 11] },
    { label: 'Low Stock Items',  value: `${lowStock} SKUs`,             color: [239, 68, 68] },
  ];

  const cardW = (contentWidth - 18) / 4;
  kpis.forEach((kpi, i) => {
    const cx = margin + i * (cardW + 6);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(cx, y, cardW, 52, 6, 6, 'F');
    doc.setFillColor(...kpi.color);
    doc.roundedRect(cx, y, 4, 52, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...slate800);
    doc.text(kpi.value, cx + 12, y + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slate500);
    doc.text(kpi.label.toUpperCase(), cx + 12, y + 38);
  });

  y += 70;

  // ─── Orders Summary table ─────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...slate800);
  doc.text('Order Summary', margin, y + 4);
  y += 18;

  const orderRows = [
    ['Total Orders',     orders.length],
    ['Delivered',        delivered.length],
    ['Pending',          pending.length],
    ['Cancelled',        cancelled.length],
    ['Total Revenue',    `₹${totalRev.toFixed(2)}`],
    ['Estimated Profit', `₹${netProfit.toFixed(2)}`],
    ['GST / Tax (5%)',   `₹${taxCollected.toFixed(2)}`],
  ];

  doc.autoTable({
    startY: y,
    head: [['Metric', 'Value']],
    body: orderRows,
    theme: 'grid',
    headStyles: {
      fillColor: emerald,
      textColor: white,
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8.5, textColor: slate800 },
    columnStyles: {
      0: { cellWidth: 200 },
      1: { cellWidth: 120, halign: 'right', fontStyle: 'bold' },
    },
    tableWidth: 340,
    margin: { left: margin },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // ─── Inventory Status table (right side) ──────────────────────────────────
  const invTableX = margin + 360;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...slate800);
  doc.text('Inventory Snapshot', invTableX, y + 4);

  const invRows = medicines.slice(0, 10).map(m => [
    m.name?.length > 28 ? m.name.slice(0, 28) + '…' : m.name,
    m.stock,
    m.stock < 20 ? '⚠ Low' : '✓ OK',
    m.expiry_date || 'N/A',
  ]);

  doc.autoTable({
    startY: y + 18,
    head: [['Medicine', 'Stock', 'Status', 'Expiry']],
    body: invRows.length ? invRows : [['No medicines found', '-', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: slate800,
      textColor: white,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5, textColor: slate800 },
    columnStyles: {
      1: { halign: 'center', cellWidth: 40 },
      2: { halign: 'center', cellWidth: 45 },
      3: { halign: 'center', cellWidth: 65 },
    },
    tableWidth: contentWidth - 360,
    margin: { left: invTableX },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const val = data.cell.raw;
        if (val && val.includes('⚠')) {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [16, 185, 129];
        }
      }
    },
  });

  y = Math.max(doc.lastAutoTable.finalY, doc.previousAutoTable?.finalY || 0) + 30;

  // ─── All Orders detail table ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...slate800);
  doc.text('Orders Detail', margin, y);
  y += 14;

  const allOrderRows = orders.map(o => [
    `#${o.id}`,
    o.date || 'N/A',
    `@${o.user_name || 'N/A'}`,
    o.status || 'N/A',
    o.payment_method || 'N/A',
    `₹${parseFloat(o.total || 0).toFixed(2)}`,
  ]);

  doc.autoTable({
    startY: y,
    head: [['Order ID', 'Date', 'Customer', 'Status', 'Payment', 'Total']],
    body: allOrderRows.length ? allOrderRows : [['No orders yet', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: emerald,
      textColor: white,
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8, textColor: slate800 },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 65 },
      5: { halign: 'right', cellWidth: 70, fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const status = data.cell.raw;
        if (status === 'Delivered') data.cell.styles.textColor = [16, 185, 129];
        else if (status === 'Pending') data.cell.styles.textColor = [245, 158, 11];
        else if (status === 'Cancelled') data.cell.styles.textColor = [239, 68, 68];
        else data.cell.styles.textColor = [14, 165, 233];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // ─── Footer ───────────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 35;
  doc.setDrawColor(...slate200);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slate500);
  doc.text(
    `PurniaCare — ${pharmName}  •  Confidential Report`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  doc.text(
    `Page 1 of 1  |  ${new Date().toLocaleString('en-IN')}`,
    pageWidth / 2,
    footerY + 12,
    { align: 'center' }
  );

  // ─── Save ─────────────────────────────────────────────────────────────────
  doc.save(`PurniaCare_Report_${Date.now()}.pdf`);
};
