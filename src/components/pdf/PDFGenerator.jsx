import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { KanbanCardDocument, BinLabelDocument } from './Documents';
import { pdfLogger } from '../../utils/debugLogger';
import { registerFonts } from '../../utils/pdfFonts';

// PDF dimensions in points (72 points = 1 inch)
const PDF_DIMENSIONS = {
  CARD: {
    WIDTH: 216, // 3 inches
    HEIGHT: 360, // 5 inches
  },
  LABEL: {
    WIDTH: 216, // 3 inches
    HEIGHT: 72, // 1 inch
  }
};

export const generatePDF = async (data, type = 'both') => {
  try {
    await registerFonts();
    const processedData = Array.isArray(data) ? data : [data];

    if (type === 'both' || type === 'all') {
      const cardDoc = <KanbanCardDocument data={processedData} dimensions={PDF_DIMENSIONS.CARD} />;
      const labelDoc = <BinLabelDocument data={processedData} dimensions={PDF_DIMENSIONS.LABEL} />;
      
      const [cardBlob, labelBlob] = await Promise.all([
        pdf(cardDoc).toBlob(),
        pdf(labelDoc).toBlob()
      ]);
      
      return { cardBlob, labelBlob };
    } else {
      const DocumentComponent = type === 'cards' ? KanbanCardDocument : BinLabelDocument;
      const dimensions = type === 'cards' ? PDF_DIMENSIONS.CARD : PDF_DIMENSIONS.LABEL;
      
      const doc = <DocumentComponent data={processedData} dimensions={dimensions} />;
      const blob = await pdf(doc).toBlob();
      
      return { [`${type}Blob`]: blob };
    }
  } catch (error) {
    pdfLogger.error('PDF generation failed', { error: error.message });
    throw error;
  }
};

export const generateAndDownloadPDF = async (data, type = 'both') => {
  try {
    const result = await generatePDF(data, type);
    const timestamp = new Date().getTime();

    if (type === 'both' || type === 'all') {
      await downloadPDF(result.cardBlob, `kanban-cards-${timestamp}.pdf`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await downloadPDF(result.labelBlob, `kanban-labels-${timestamp}.pdf`);
    } else {
      await downloadPDF(result[`${type}Blob`], `kanban-${type}-${timestamp}.pdf`);
    }
  } catch (error) {
    pdfLogger.error('PDF generation/download error', { error: error.message });
    throw error;
  }
};

const downloadPDF = async (blob, filename) => {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    pdfLogger.error('Error downloading PDF', { error: error.message });
    throw new Error('Failed to download PDF');
  }
};