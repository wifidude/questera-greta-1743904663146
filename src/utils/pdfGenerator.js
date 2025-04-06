import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { KanbanCardDocument, BinLabelDocument } from '../components/pdf/Documents';
import { DIMENSIONS } from './constants';
import { getDefaultImage } from './imageUtils';

const processData = (data) => {
  // Ensure data is always an array
  const dataArray = Array.isArray(data) ? data : [data];
  
  return dataArray.map(item => {
    // Normalize and validate all required fields
    const processed = {
      product_name: item.product_name?.trim() || 'Untitled Product',
      part_number: (item.part_number || '').toUpperCase().trim(),
      description: item.description?.trim() || '',
      reorder_point: item.reorder_point?.toString() || '0',
      reorder_quantity: item.reorder_quantity?.toString() || '0',
      location: item.location?.trim() || '',
      department: item.department?.trim() || 'Default',
      departmentColor: item.departmentColor || '#4F46E5',
      revision_date: item.revision_date || new Date().toLocaleDateString(),
      revision_number: item.revision_number || '1'
    };

    // Process QR code URL
    processed.qr_code_url = processQRCodeUrl(item.qr_code_url, processed.part_number);
    
    // Process image URL
    processed.image_url = processImageUrl(item.image_url);

    return processed;
  });
};

const processQRCodeUrl = (url, partNumber) => {
  if (!url) {
    // Generate QR code URL using a reliable service
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
    // Handle absolute URLs
    if (url.match(/^https?:\/\//)) {
      new URL(url);
      return url;
    }

    // Handle relative URLs
    if (url.startsWith('/')) {
      // For development
      if (import.meta.env.DEV) {
        return url;
      }
      // For production with base URL
      return `.${url}`;
    }

    // Handle other relative paths
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

    if (type === 'both') {
      const cardDoc = <KanbanCardDocument data={processedData} dimensions={DIMENSIONS.PDF} />;
      const labelDoc = <BinLabelDocument data={processedData} dimensions={DIMENSIONS.PDF} />;

      const [cardBlob, labelBlob] = await Promise.all([
        pdf(cardDoc).toBlob(),
        pdf(labelDoc).toBlob()
      ]);

      return { cardBlob, labelBlob };
    } else {
      const DocumentComponent = type === 'cards' ? KanbanCardDocument : BinLabelDocument;
      const doc = <DocumentComponent data={processedData} dimensions={DIMENSIONS.PDF} />;
      const blob = await pdf(doc).toBlob();
      
      return { [`${type}Blob`]: blob };
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const generateAndDownloadPDF = async (data, type = 'both') => {
  try {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error('No data provided for PDF generation');
    }

    const result = await generatePDF(data, type);

    if (type === 'both') {
      await downloadBoth(result.cardBlob, result.labelBlob);
    } else {
      await downloadSingle(result[`${type}Blob`], type);
    }
  } catch (error) {
    console.error('PDF generation/download error:', error);
    throw error;
  }
};

const downloadBoth = async (cardBlob, labelBlob) => {
  const timestamp = new Date().getTime();
  
  try {
    // Download cards
    const cardUrl = URL.createObjectURL(cardBlob);
    const cardLink = document.createElement('a');
    cardLink.href = cardUrl;
    cardLink.download = `kanban-cards-${timestamp}.pdf`;
    document.body.appendChild(cardLink);
    cardLink.click();
    document.body.removeChild(cardLink);
    URL.revokeObjectURL(cardUrl);

    // Small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 500));

    // Download labels
    const labelUrl = URL.createObjectURL(labelBlob);
    const labelLink = document.createElement('a');
    labelLink.href = labelUrl;
    labelLink.download = `kanban-labels-${timestamp}.pdf`;
    document.body.appendChild(labelLink);
    labelLink.click();
    document.body.removeChild(labelLink);
    URL.revokeObjectURL(labelUrl);
  } catch (error) {
    console.error('Error downloading PDFs:', error);
    throw new Error('Failed to download PDFs');
  }
};

const downloadSingle = async (blob, type) => {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-${type}-${new Date().getTime()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error(`Failed to download ${type} PDF`);
  }
};