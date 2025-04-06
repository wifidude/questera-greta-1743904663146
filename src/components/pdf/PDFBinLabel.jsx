import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { COLORS, DIMENSIONS } from '../../utils/constants';
import { getFontFamily } from '../../utils/pdfFonts';

const PDFBinLabel = ({ data }) => {
  const fontFamily = getFontFamily();

  const styles = StyleSheet.create({
    label: {
      width: DIMENSIONS.LABEL.WIDTH,
      height: DIMENSIONS.LABEL.HEIGHT,
      margin: '9',
      backgroundColor: COLORS.BACKGROUND.WHITE,
      borderLeftWidth: 4,
      borderLeftColor: data.departmentColor || '#4F46E5',
      borderLeftStyle: 'solid',
      padding: DIMENSIONS.LABEL.PADDING,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      marginRight: '12',
    },
    title: {
      fontSize: 14,
      fontFamily,
      color: COLORS.PRIMARY,
      marginBottom: 4,
    },
    partNumber: {
      fontSize: 12,
      fontFamily,
      color: COLORS.SECONDARY,
    },
    image: {
      width: '48',
      height: '48',
      objectFit: 'contain',
      backgroundColor: COLORS.BACKGROUND.LIGHT,
      borderRadius: 4,
      padding: 2,
    }
  });

  return (
    <View style={styles.label} wrap={false}>
      <View style={styles.content}>
        <Text style={styles.title}>{data.product_name || 'Product Name'}</Text>
        <Text style={styles.partNumber}>{data.part_number || 'PART-123'}</Text>
      </View>
      <Image
        src={data.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
        style={styles.image}
      />
    </View>
  );
};

export default PDFBinLabel;