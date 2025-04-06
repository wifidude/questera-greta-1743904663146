import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { KanbanCardDocument, BinLabelDocument } from '../components/pdf/Documents';
import { DIMENSIONS } from './constants';
import { getDefaultImage } from './imageUtils';

const processData = (data) => {
  const dataArray = Array.isArray(data) ? data : [data];
  
  return dataArray.map(item => ({
    product_name: item.product_name?.trim() || 'Untitled Product',
    part_number: (item.part_number || '').toUpperCase().trim(),
    description: item.description?.trim() || '',
    reorder_point: item.reorder_point?.toString() || '0',
    reorder_quantity: item.reorder_quantity?.toString() || '0',
    location: item.location?.trim() || '',
    department: item.department?.trim() || 'Default',
    departmentColor: item.departmentColor || '#4F46E5',
    revision_date: item.revision_date || new Date().toLocaleDateString(),
    revision_number: item.revision_number || '1',
    qr_code_url: processQRCodeUrl(item.qr_code_url, item.part_number),
    image_url: processImageUrl(item.image_url)
  }));
};

const processQRCodeUrl = (url, partNumber) => {
  if (!url) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(partNumber)}&format=png`;
  }
  try {
    new URL(url);
    return url;
  } catch {
    return getDefaultImage('qr');
  }
};

const processImageUrl = (url) => {
  if (!url) return getDefaultImage('product');
  
  try {
    if (url.match(/^https?:\/\//)) {
      new URL(url);
      return url;
    }
    
    if (url.startsWith('/')) {
      return import.meta.env.DEV ? url : `.${url}`;
    }
    
    return `./${url.replace(/^\.?\/?/, '')}`;
  } catch {
    console.warn('Invalid image URL, using default');
    return getDefaultImage('product');
  }
};

export const generatePDF = async (data, type = 'both') => {
  try {
    const processedData = processData(data);
    
    if (!processedData.length) {
      throw new Error('No valid data to generate PDF');
    }

    const dimensions = DIMENSIONS.PDF;

    if (type === 'both') {
      const cardDoc = <KanbanCardDocument data={processedData} dimensions={dimensions} />;
      const labelDoc = <BinLabelDocument data={processedData} dimensions={dimensions} />;

      const [cardBlob, labelBlob] = await Promise.all([
        pdf(cardDoc).toBlob(),
        pdf(labelDoc).toBlob()
      ]);

      return { cardBlob, labelBlob };
    } else {
      const DocumentComponent = type === 'cards' ? KanbanCardDocument : BinLabelDocument;
      const doc = <DocumentComponent data={processedData} dimensions={dimensions} />;
      const blob = await pdf(doc).toBlob();
      
      return { [`${type}Blob`]: blob };
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
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
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
};

export const generateAndDownloadPDF = async (data, type = 'both') => {
  try {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error('No data provided for PDF generation');
    }

    const result = await generatePDF(data, type);
    const timestamp = new Date().getTime();

    if (type === 'both') {
      await downloadPDF(result.cardBlob, `kanban-cards-${timestamp}.pdf`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await downloadPDF(result.labelBlob, `kanban-labels-${timestamp}.pdf`);
    } else {
      await downloadPDF(result[`${type}Blob`], `kanban-${type}-${timestamp}.pdf`);
    }
  } catch (error) {
    console.error('PDF generation/download error:', error);
    throw error;
  }
};