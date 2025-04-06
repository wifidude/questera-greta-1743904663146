import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { DIMENSIONS, FONTS, COLORS } from '../../utils/constants';

const PDFBinLabel = ({ data, fields = {} }) => {
  const styles = StyleSheet.create({
    label: {
      width: Number(DIMENSIONS.PDF.LABEL.WIDTH),
      height: Number(DIMENSIONS.PDF.LABEL.HEIGHT),
      margin: '9', // 0.125 inch in points
      backgroundColor: COLORS.BACKGROUND.WHITE,
      borderLeftWidth: Number(DIMENSIONS.PDF.LABEL.BORDER_WIDTH),
      borderLeftColor: data.departmentColor || '#4F46E5',
      borderLeftStyle: 'solid',
      flexDirection: 'row',
      padding: Number(DIMENSIONS.PDF.LABEL.PADDING),
    },
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    row: {
      marginBottom: '4',
    },
    field: {
      fontSize: Number(FONTS.INFO_VALUE.PDF_SIZE),
      color: COLORS.PRIMARY,
    },
    boldText: {
      fontFamily: FONTS.INFO_LABEL.FAMILY,
      marginRight: '4',
    },
    image: {
      width: '64',
      height: '64',
      objectFit: 'contain',
      marginLeft: '8',
    }
  });

  // Rest of the component remains the same
};

export default PDFBinLabel;