import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DashboardData } from '../types';

/**
 * Export dashboard data to Excel
 */
export function exportToExcel(data: DashboardData, filename: string = 'metricas-ds.xlsx') {
  const workbook = XLSX.utils.book_new();

  // ROI Sheet
  if (data.roi) {
    const roiData = [
      ['Métrica', 'Valor'],
      ['ROI (%)', data.roi.roi.toFixed(2)],
      ['Valor Neto (€)', data.roi.netValue.toLocaleString('es-ES')],
      ['Nivel de Confianza', data.roi.confidenceLevel],
      ['Período', data.roi.period],
    ];
    const roiSheet = XLSX.utils.aoa_to_sheet(roiData);
    XLSX.utils.book_append_sheet(workbook, roiSheet, 'ROI');
  }

  // Design Metrics Sheet
  if (data.designMetrics.length > 0) {
    const designData = data.designMetrics.map(metric => ({
      'Fecha': new Date(metric.timestamp).toLocaleDateString('es-ES'),
      'Tasa de Adopción (%)': metric.adoptionPercentage.toFixed(2),
      'Componentes Totales': metric.totalComponents,
      'Componentes Usados': metric.usedComponents,
      'Componentes Desconectados': metric.detachedComponents,
      'Puntuación Accesibilidad': metric.accessibilityScore?.toFixed(2) || 'N/A',
      'Issues Accesibilidad': metric.accessibilityIssues || 0,
      'Fuente': metric.source,
    }));
    const designSheet = XLSX.utils.json_to_sheet(designData);
    XLSX.utils.book_append_sheet(workbook, designSheet, 'Métricas Diseño');
  }

  // Development Metrics Sheet
  if (data.developmentMetrics.length > 0) {
    const devData = data.developmentMetrics.map(metric => ({
      'Fecha': new Date(metric.timestamp).toLocaleDateString('es-ES'),
      'Instalaciones DS': metric.dsPackageInstalls,
      'Repos Usando DS': metric.reposUsingDS,
      'Componentes Personalizados': metric.customComponentsCount,
      'Componentes desde Cero': metric.componentsBuiltFromScratch,
      'Issues UI': metric.uiRelatedIssues,
      'Issues Resueltos': metric.resolvedIssues,
      'Organización': metric.organization || 'N/A',
      'Fuente': metric.source,
    }));
    const devSheet = XLSX.utils.json_to_sheet(devData);
    XLSX.utils.book_append_sheet(workbook, devSheet, 'Métricas Desarrollo');
  }

  // KPIs Sheet
  if (data.kpis.length > 0) {
    const kpiData = data.kpis.map(kpi => ({
      'Nombre': kpi.name,
      'Descripción': kpi.description,
      'Valor Actual': kpi.currentValue.toFixed(2),
      'Valor Anterior': kpi.previousValue?.toFixed(2) || 'N/A',
      'Tendencia': kpi.trend,
      'Estado': kpi.status,
      'Última Actualización': new Date(kpi.lastUpdated).toLocaleDateString('es-ES'),
    }));
    const kpiSheet = XLSX.utils.json_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');
  }

  // OKRs Sheet
  if (data.okrs.length > 0) {
    const okrRows: any[] = [];
    data.okrs.forEach(okr => {
      okrRows.push({
        'Objetivo': okr.title,
        'Descripción': okr.description,
        'Progreso (%)': okr.progress.toFixed(2),
        'Estado': okr.status,
        'Trimestre': okr.quarter,
        'Key Result': '',
        'KR Progreso': '',
      });
      okr.keyResults.forEach(kr => {
        okrRows.push({
          'Objetivo': '',
          'Descripción': '',
          'Progreso (%)': '',
          'Estado': '',
          'Trimestre': '',
          'Key Result': kr.title,
          'KR Progreso': `${kr.currentValue} / ${kr.targetValue} ${kr.unit} (${kr.progress.toFixed(2)}%)`,
        });
      });
    });
    const okrSheet = XLSX.utils.json_to_sheet(okrRows);
    XLSX.utils.book_append_sheet(workbook, okrSheet, 'OKRs');
  }

  XLSX.writeFile(workbook, filename);
}

/**
 * Export dashboard to PDF
 */
export async function exportToPDF(
  data: DashboardData,
  elementId: string = 'dashboard-content',
  filename: string = 'metricas-ds.pdf'
) {
  const element = document.getElementById(elementId);
  
  if (!element) {
    // Si no existe el elemento, creamos un PDF básico con datos
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Métricas del Design System', 20, 20);
    
    let y = 40;
    
    if (data.roi) {
      doc.setFontSize(14);
      doc.text('ROI', 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(`ROI: ${data.roi.roi.toFixed(2)}%`, 20, y);
      y += 7;
      doc.text(`Valor Neto: €${data.roi.netValue.toLocaleString('es-ES')}`, 20, y);
      y += 15;
    }
    
    if (data.designMetrics.length > 0) {
      const latest = data.designMetrics[data.designMetrics.length - 1];
      doc.setFontSize(14);
      doc.text('Métricas de Diseño', 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(`Adopción: ${latest.adoptionPercentage.toFixed(2)}%`, 20, y);
      y += 7;
      doc.text(`Componentes Usados: ${latest.usedComponents}`, 20, y);
      y += 7;
      if (latest.accessibilityScore) {
        doc.text(`Accesibilidad: ${latest.accessibilityScore.toFixed(2)}%`, 20, y);
        y += 7;
      }
      y += 10;
    }
    
    doc.save(filename);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generando PDF:', error);
    // Fallback a PDF básico
    exportToPDF(data, 'non-existent-id', filename);
  }
}
