import { api } from '@/services/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { logger } from '../logger';

interface ReportOptions {
  startDate: Date;
  endDate: Date;
  type: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'excel' | 'csv';
  filters?: Record<string, any>;
}

export class ReportGenerator {
  private static instance: ReportGenerator;

  private constructor() {}

  public static getInstance(): ReportGenerator {
    if (!ReportGenerator.instance) {
      ReportGenerator.instance = new ReportGenerator();
    }
    return ReportGenerator.instance;
  }

  public async generateReport(options: ReportOptions): Promise<Blob> {
    try {
      const data = await this.fetchReportData(options);
      
      switch (options.format) {
        case 'pdf':
          return this.generatePDFReport(data, options);
        case 'excel':
          return this.generateExcelReport(data, options);
        case 'csv':
          return this.generateCSVReport(data, options);
        default:
          throw new Error('Noto\'g\'ri format');
      }
    } catch (error) {
      logger.error('Report generation failed', error);
      throw error;
    }
  }

  private async fetchReportData(options: ReportOptions): Promise<any[]> {
    const { data } = await api.post('/reports/generate', options);
    return data;
  }

  private async generatePDFReport(data: any[], options: ReportOptions): Promise<Blob> {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text('Hisobot', 14, 15);
    doc.setFontSize(12);
    doc.text(`Davr: ${options.startDate.toLocaleDateString()} - ${options.endDate.toLocaleDateString()}`, 14, 25);

    // Table
    (doc as any).autoTable({
      head: [Object.keys(data[0])],
      body: data.map(item => Object.values(item)),
      startY: 35,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Sahifa ${i} / ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }

    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }

  private generateExcelReport(data: any[], options: ReportOptions): Blob {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    // Styling
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        fill: { fgColor: { rgb: "4169E1" } },
        font: { color: { rgb: "FFFFFF" }, bold: true }
      };
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private generateCSVReport(data: any[], options: ReportOptions): Blob {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ];
    const csvContent = csvRows.join('\n');
    
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }
} 