import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

// Extend jsPDF type to include autoTable only
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: UserOptions) => jsPDF;
    }
}
interface AnalysisResult {
  content: string;
  truthValue: number;
  claims: Array<{
    text: string;
    isTrue: boolean;
    explanation: string;
    primarySource: string;
  }>;
  stats: {
    total: number;
    true: number;
    false: number;
  };
}

export const generatePDF = (result: AnalysisResult) => {
  const doc = new jsPDF();
  let yPos = 20;
  
  // Add logo and title
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);
  doc.text('TruthLens Analysis Report', 20, yPos);
  yPos += 20;
  
  // Add date
  doc.setFontSize(12);
  doc.setTextColor(127, 140, 141);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 20;
  
  // Add truth value
  doc.setFontSize(16);
  doc.setTextColor(52, 73, 94);
  doc.text('Truth Value', 20, yPos);
  yPos += 10;
  
  // Add truth value percentage with color based on value
  doc.setFontSize(24);
  const truthColor: [number, number, number] = result.truthValue >= 70 
    ? [39, 174, 96]  // green
    : result.truthValue >= 40 
      ? [243, 156, 18]  // orange
      : [192, 57, 43];  // red
  doc.setTextColor(...truthColor);
  
  doc.text(`${result.truthValue}%`, 20, yPos);
  yPos += 20;
  
  // Add statistics
  doc.setFontSize(14);
  doc.setTextColor(52, 73, 94);
  doc.text('Analysis Summary:', 20, yPos);
  yPos += 5;
  
  // First table for statistics
  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Count']],
    body: [
      ['Total Claims:', result.stats.total.toString()],
      ['True Claims:', result.stats.true.toString()],
      ['False Claims:', result.stats.false.toString()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 12 }
  });
  
  // Get the Y position after the first table
  const firstTableEndY = (doc as any).lastAutoTable.finalY;
  yPos = firstTableEndY + 20;
  
  // Add claims sections
  doc.setFontSize(14);
  doc.text('Verified Claims:', 20, yPos);
  
  doc.autoTable({
    startY: yPos + 5,
    head: [['Status', 'Claim', 'Explanation', 'Primary Source']],
    body: result.claims.map(claim => [
      claim.isTrue ? "TRUE" : "FALSE",  
      claim.text,
      claim.explanation,
      claim.primarySource
    ]),
    theme: 'striped',
    headStyles: { 
      fillColor: [41, 128, 185],
      fontSize: 11,
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 20 },         // Status - minimal width
      1: { cellWidth: 50 },         // Claim - moderate width
      2: { cellWidth: 85 },        // Explanation - larger width
      3: { cellWidth: 40 }          // Primary Source - compact width
    },
    styles: { 
      fontSize: 9,
      cellPadding: 4,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
      minCellHeight: 30
    },
    alternateRowStyles: { 
      fillColor: [245, 245, 245] 
    },
    margin: { left: 10, right: 10 },
    tableWidth: 'auto',
    showHead: 'everyPage',
    didDrawCell: (data) => {
      if (data.column.index === 0) {
        data.cell.styles.halign = 'center';
      }
    }
  });
  // Add footer with page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(127, 140, 141);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      (doc.internal.pageSize.width / 2),
      (doc.internal.pageSize.height - 10),
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save('truthlens-analysis-report.pdf');
};