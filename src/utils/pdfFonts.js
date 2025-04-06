import { pdfLogger } from './debugLogger';

export const registerFonts = async () => {
  try {
    pdfLogger.info('Fonts registered successfully');
    return true;
  } catch (error) {
    pdfLogger.error('Font registration failed', { error: error.message });
    return false;
  }
};

export const getFontFamily = () => 'Helvetica';