import { generateColorPalette } from './colorUtils';

export const CARD_DIMENSIONS = {
  width: 288, // 3 inches * 96 DPI
  height: 312, // 3.25 inches * 96 DPI
  padding: 16,
  borderWidth: 4
};

export const LABEL_DIMENSIONS = {
  width: 288, // 3 inches * 96 DPI
  height: 96, // 1 inch * 96 DPI
  padding: 12,
  borderWidth: 2
};

export const generateCardStyle = (departmentColor) => {
  const palette = generateColorPalette(departmentColor);
  
  return {
    card: {
      width: `${CARD_DIMENSIONS.width}px`,
      height: `${CARD_DIMENSIONS.height}px`,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      borderLeft: `${CARD_DIMENSIONS.borderWidth}px solid ${palette.base}`,
      padding: `${CARD_DIMENSIONS.padding}px`,
    },
    header: {
      backgroundColor: palette.light,
      margin: `-${CARD_DIMENSIONS.padding}px`,
      marginBottom: '12px',
      padding: '12px',
      borderBottom: `1px solid ${palette.border}`,
    },
    qrCode: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      width: '96px',
      height: '96px',
      backgroundColor: 'white',
      padding: '4px',
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      border: `1px solid ${palette.border}`,
    }
  };
};

export const generateLabelStyle = (departmentColor) => {
  const palette = generateColorPalette(departmentColor);
  
  return {
    label: {
      width: `${LABEL_DIMENSIONS.width}px`,
      height: `${LABEL_DIMENSIONS.height}px`,
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      borderLeft: `${LABEL_DIMENSIONS.borderWidth}px solid ${palette.base}`,
      padding: `${LABEL_DIMENSIONS.padding}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }
  };
};