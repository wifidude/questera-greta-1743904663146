import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { generateColorPalette } from '../../utils/colorUtils';
import { DIMENSIONS, FONTS, COLORS } from '../../utils/constants';

const PDFKanbanCard = ({ data }) => {
  const palette = generateColorPalette(data.departmentColor || '#4F46E5');
  
  const styles = StyleSheet.create({
    card: {
      width: Number(DIMENSIONS.PDF.CARD.WIDTH),
      height: Number(DIMENSIONS.PDF.CARD.HEIGHT),
      margin: '9', // 0.125 inch in points
      backgroundColor: COLORS.BACKGROUND.WHITE,
      borderLeftWidth: Number(DIMENSIONS.PDF.CARD.BORDER_WIDTH),
      borderLeftColor: data.departmentColor || '#4F46E5',
      borderLeftStyle: 'solid',
      position: 'relative',
    },
    header: {
      backgroundColor: COLORS.BACKGROUND.LIGHT,
      padding: Number(DIMENSIONS.PDF.CARD.HEADER_PADDING),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.BORDER,
      borderBottomStyle: 'solid',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    titleSection: {
      flex: 1,
      marginRight: '8',
    },
    title: {
      fontSize: Number(FONTS.TITLE.PDF_SIZE),
      fontFamily: FONTS.TITLE.FAMILY,
      color: COLORS.PRIMARY,
    },
    partNumber: {
      fontSize: Number(FONTS.PART_NUMBER.PDF_SIZE),
      fontFamily: FONTS.PART_NUMBER.FAMILY,
      color: COLORS.SECONDARY,
      marginTop: '4',
      textTransform: 'uppercase',
    },
    // ... rest of the styles with Number() for numeric values
  });

  // Rest of the component remains the same
};

export default PDFKanbanCard;