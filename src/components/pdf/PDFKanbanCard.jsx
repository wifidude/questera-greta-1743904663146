import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { generateColorPalette } from '../../utils/colorUtils';
import { COLORS, DIMENSIONS } from '../../utils/constants';
import { getFontFamily } from '../../utils/pdfFonts';
import { preloadImage } from '../../utils/imageUtils';
import { pdfLogger } from '../../utils/debugLogger';

const PDFKanbanCard = ({ data }) => {
  const [imageData, setImageData] = useState(null);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        if (data.image_url) {
          const base64Image = await preloadImage(data.image_url, 'product', true);
          pdfLogger.debug('Image loaded for PDF', { url: data.image_url });
          setImageData(base64Image);
        }
        if (data.qr_code_url) {
          const base64QR = await preloadImage(data.qr_code_url, 'qr', true);
          pdfLogger.debug('QR code loaded for PDF', { url: data.qr_code_url });
          setQrData(base64QR);
        }
      } catch (error) {
        pdfLogger.error('Failed to load images for PDF', { error: error.message });
      }
    };

    loadImages();
  }, [data.image_url, data.qr_code_url]);

  const palette = generateColorPalette(data.departmentColor || '#4F46E5');
  const fontFamily = getFontFamily();

  const styles = StyleSheet.create({
    card: {
      width: DIMENSIONS.CARD.WIDTH,
      minHeight: DIMENSIONS.CARD.HEIGHT,
      margin: '9',
      backgroundColor: COLORS.BACKGROUND.WHITE,
      borderLeftWidth: 4,
      borderLeftColor: data.departmentColor || '#4F46E5',
      borderLeftStyle: 'solid',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      height: '72',
      backgroundColor: COLORS.BACKGROUND.LIGHT,
      padding: '16',
      borderBottomWidth: 1,
      borderBottomColor: COLORS.BORDER,
      borderBottomStyle: 'solid',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleSection: {
      flex: 1,
      marginRight: '16',
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
    content: {
      flex: 1,
      padding: '16',
      display: 'flex',
      flexDirection: 'column',
      gap: '8',
    },
    imageContainer: {
      height: 120,
      backgroundColor: COLORS.BACKGROUND.LIGHT,
      borderRadius: 4,
      overflow: 'hidden',
      padding: 4,
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    productImage: {
      objectFit: 'contain',
      maxWidth: '90%',
      maxHeight: '90%'
    }
  });

  return (
    <View style={styles.card} wrap={false}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{data.product_name || 'Product Name'}</Text>
          <Text style={styles.partNumber}>{data.part_number || 'PART-123'}</Text>
        </View>
        {qrData && (
          <Image src={qrData} style={styles.qrCode} />
        )}
      </View>
      
      <View style={styles.content}>
        {/* ... other content ... */}
        
        {imageData && (
          <View style={styles.imageContainer}>
            <Image src={imageData} style={styles.productImage} />
          </View>
        )}
      </View>
    </View>
  );
};

export default PDFKanbanCard;