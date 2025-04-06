import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import PDFKanbanCard from './PDFKanbanCard';
import PDFBinLabel from './PDFBinLabel';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '0.5in',
    backgroundColor: 'white',
  }
});

// Calculate items per page based on page size and item dimensions
const calculateItemsPerPage = (pageSize, itemSize, padding) => {
  const usableWidth = pageSize.width - (2 * padding); // Account for page padding
  const usableHeight = pageSize.height - (2 * padding);
  
  const cols = Math.floor(usableWidth / itemSize.width);
  const rows = Math.floor(usableHeight / itemSize.height);
  
  return cols * rows;
};

export const KanbanCardDocument = ({ data, dimensions }) => {
  // US Letter size in points (72 points per inch)
  const pageSize = { width: 612, height: 792 }; // 8.5" x 11"
  const padding = 36; // 0.5" padding in points
  const itemSize = {
    width: parseFloat(dimensions.CARD.WIDTH),
    height: parseFloat(dimensions.CARD.HEIGHT)
  };
  
  const itemsPerPage = calculateItemsPerPage(pageSize, itemSize, padding);

  return (
    <Document>
      {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, pageIndex) => (
        <Page key={pageIndex} size="LETTER" style={styles.page}>
          {data
            .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
            .map((item, index) => (
              <PDFKanbanCard key={`${item.part_number}-${index}`} data={item} />
            ))}
        </Page>
      ))}
    </Document>
  );
};

export const BinLabelDocument = ({ data, dimensions }) => {
  const pageSize = { width: 612, height: 792 };
  const padding = 36;
  const itemSize = {
    width: parseFloat(dimensions.LABEL.WIDTH),
    height: parseFloat(dimensions.LABEL.HEIGHT)
  };
  
  const itemsPerPage = calculateItemsPerPage(pageSize, itemSize, padding);

  return (
    <Document>
      {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, pageIndex) => (
        <Page key={pageIndex} size="LETTER" style={styles.page}>
          {data
            .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
            .map((item, index) => (
              <PDFBinLabel key={`${item.part_number}-${index}`} data={item} />
            ))}
        </Page>
      ))}
    </Document>
  );
};