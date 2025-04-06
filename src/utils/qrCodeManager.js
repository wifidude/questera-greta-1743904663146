import { imageLogger } from './debugLogger';

class QRCodeManager {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.defaultQR = '/qr-example.png';
  }

  async validateQRCode(url) {
    const startTime = performance.now();
    try {
      imageLogger.debug('Validating QR code URL', { url });
      
      // For local files, skip validation
      if (url.startsWith('/')) {
        imageLogger.info('Local QR code, skipping validation', { url });
        return true;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'Accept': 'image/*, application/json',
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`QR code validation failed: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || (!contentType.includes('image/') && !contentType.includes('application/json'))) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      const duration = performance.now() - startTime;
      imageLogger.info('QR code validated successfully', {
        url,
        contentType,
        status: response.status,
        headers: Object.fromEntries(response.headers)
      });

      return true;
    } catch (error) {
      const duration = performance.now() - startTime;
      imageLogger.error('QR code validation failed', {
        url,
        error: error.message,
        type: error.name,
        stack: error.stack
      });
      return false;
    }
  }

  async generateQRCode(data, size = 150) {
    if (!data) {
      imageLogger.warn('No data provided for QR code generation');
      return this.defaultQR;
    }

    const cacheKey = `${data}-${size}`;
    
    if (this.cache.has(cacheKey)) {
      imageLogger.debug('Returning cached QR code', { data, size });
      return this.cache.get(cacheKey);
    }

    try {
      // For development/testing, use local QR code
      if (process.env.NODE_ENV === 'development') {
        return this.defaultQR;
      }

      // Generate QR code URL
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
      
      const isValid = await this.validateQRCode(url);
      if (!isValid) {
        throw new Error('QR code validation failed');
      }

      this.cache.set(cacheKey, url);
      return url;
    } catch (error) {
      imageLogger.error('QR code generation failed', {
        data,
        size,
        error: error.message
      });
      return this.defaultQR;
    }
  }

  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
    this.retryAttempts.clear();
    imageLogger.debug('QR code cache cleared');
  }
}

export const qrCodeManager = new QRCodeManager();