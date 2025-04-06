import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import PDFKanbanCard from './PDFKanbanCard';
import PDFBinLabel from './PDFBinLabel';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '36',
    backgroundColor: 'white',
  }
});

const calculateItemsPerPage = (pageSize, itemSize, padding) => {
  const usableWidth = pageSize.width - (2 * padding);
  const usableHeight = pageSize.height - (2 * padding);
  const cols = Math.floor(usableWidth / itemSize.width);
  const rows = Math.floor(usableHeight / itemSize.height);
  return cols * rows;
};

export const KanbanCardDocument = ({ data, dimensions }) => {
  const pageSize = { width: 612, height: 792 }; // US Letter size in points
  const padding = 36; // 0.5" padding in points
  const itemSize = {
    width: dimensions.WIDTH,
    height: dimensions.HEIGHT
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
    width: dimensions.WIDTH,
    height: dimensions.HEIGHT
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