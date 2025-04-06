// Update PDF dimensions to use proper point values
export const DIMENSIONS = {
  CARD: {
    WIDTH: '288px', // 3 inches at 96 DPI
    HEIGHT: '312px', // 3.25 inches at 96 DPI
    BORDER_WIDTH: '16px',
    PADDING: '12px',
    HEADER_PADDING: '12px',
    QR_SIZE: '48px',
    IMAGE_HEIGHT: '96px',
    IMAGE_WIDTH: '256px',
  },
  PDF: {
    CARD: {
      WIDTH: '216', // 3 inches in points (72 DPI)
      HEIGHT: '234', // 3.25 inches in points
      BORDER_WIDTH: '4',
      PADDING: '12',
      HEADER_PADDING: '12',
      QR_SIZE: '48',
      IMAGE_HEIGHT: '96'
    },
    LABEL: {
      WIDTH: '216', // 3 inches in points
      HEIGHT: '72', // 1 inch in points
      BORDER_WIDTH: '4',
      PADDING: '12'
    }
  }
};

// Update font sizes to use proper point values
export const FONTS = {
  TITLE: {
    FAMILY: 'Helvetica-Bold',
    WEIGHT: 'bold',
    SIZE: '16px',
    PDF_SIZE: '12'
  },
  PART_NUMBER: {
    FAMILY: 'Helvetica',
    WEIGHT: 'normal',
    SIZE: '14px',
    PDF_SIZE: '10'
  },
  DESCRIPTION: {
    FAMILY: 'Helvetica',
    WEIGHT: 'normal',
    SIZE: '12px',
    PDF_SIZE: '9'
  },
  REORDER_LABEL: {
    FAMILY: 'Helvetica',
    WEIGHT: 'normal',
    SIZE: '10px',
    PDF_SIZE: '8'
  },
  REORDER_VALUE: {
    FAMILY: 'Helvetica-Bold',
    WEIGHT: 'bold',
    SIZE: '16px',
    PDF_SIZE: '12'
  },
  INFO_LABEL: {
    FAMILY: 'Helvetica-Bold',
    WEIGHT: 'bold',
    SIZE: '12px',
    PDF_SIZE: '9'
  },
  INFO_VALUE: {
    FAMILY: 'Helvetica',
    WEIGHT: 'normal',
    SIZE: '12px',
    PDF_SIZE: '9'
  },
  FOOTER: {
    FAMILY: 'Helvetica',
    WEIGHT: 'normal',
    SIZE: '10px',
    PDF_SIZE: '8'
  }
};

export const COLORS = {
  PRIMARY: '#1A191C',
  SECONDARY: '#4B5563',
  BACKGROUND: {
    WHITE: '#FFFFFF',
    LIGHT: '#F9FAFB'
  },
  BORDER: '#E5E7EB',
  REORDER: {
    POINT: {
      BG: '#FEE2E2',
      TEXT: '#DC2626'
    },
    QTY: {
      BG: '#DBEAFE',
      TEXT: '#2563EB'
    }
  }
};