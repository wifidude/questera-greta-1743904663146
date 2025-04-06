import { EXAMPLE_IMAGES } from './constants';
import { imageLogger } from './debugLogger';

const DEFAULT_IMAGES = {
  product: EXAMPLE_IMAGES.DEFAULT_PRODUCT,
  qr: EXAMPLE_IMAGES.DEFAULT_QR
};

const imageCache = new Map();

export const getDefaultImage = (type = 'product') => {
  imageLogger.debug('Getting default image', { type });
  return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.product;
};

const getBaseUrl = () => {
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/+$/, '');
  imageLogger.debug('Base URL resolved', { baseUrl });
  return baseUrl;
};

export const processImageUrl = async (url, type = 'product', forPrint = false) => {
  imageLogger.debug('Processing image URL', {
    originalUrl: url,
    type,
    forPrint,
    timestamp: new Date().toISOString()
  });

  if (!url || url.trim() === '') {
    imageLogger.warn('Empty URL provided, using default', { type });
    return getDefaultImage(type);
  }

  try {
    let processedUrl = url;
    
    // If it's already an absolute URL, use it directly
    if (url.startsWith('http://') || url.startsWith('https://')) {
      imageLogger.debug('Using absolute URL directly', { url });
      processedUrl = url;
    } else {
      const baseUrl = getBaseUrl();
      // Handle local example images and other local images
      if (url.startsWith('/')) {
        processedUrl = `${baseUrl}${url}`;
        imageLogger.debug('Local image path resolved', {
          original: url,
          resolved: processedUrl
        });
      }
    }

    // Validate image exists
    imageLogger.debug('Validating image URL', { url: processedUrl });
    
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => {
        imageLogger.debug('Image loaded successfully', {
          url: processedUrl,
          width: img.width,
          height: img.height,
          timestamp: new Date().toISOString()
        });
        resolve();
      };
      img.onerror = () => {
        imageLogger.error('Image failed to load', {
          url: processedUrl,
          type,
          timestamp: new Date().toISOString()
        });
        reject(new Error('Image load failed'));
      };
      img.crossOrigin = "anonymous";
      img.src = processedUrl;
    });

    return processedUrl;
  } catch (error) {
    imageLogger.error('Image processing failed', {
      url,
      error: error.message,
      stack: error.stack,
      type,
      timestamp: new Date().toISOString()
    });
    return getDefaultImage(type);
  }
};

export const preloadImage = async (url, type = 'product', forPrint = false) => {
  imageLogger.debug('Preloading image', {
    url,
    type,
    forPrint,
    timestamp: new Date().toISOString()
  });

  if (!url) {
    imageLogger.warn('No URL provided for preload, using default');
    return getDefaultImage(type);
  }

  const cacheKey = `${url}-${forPrint}`;
  if (imageCache.has(cacheKey)) {
    imageLogger.debug('Returning cached image', { url });
    return imageCache.get(cacheKey);
  }

  try {
    const processedUrl = await processImageUrl(url, type, forPrint);
    imageCache.set(cacheKey, processedUrl);
    return processedUrl;
  } catch (error) {
    imageLogger.error('Image preload failed', {
      url,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return getDefaultImage(type);
  }
};

export const clearImageCache = () => {
  imageLogger.debug('Clearing image cache', {
    cacheSize: imageCache.size
  });
  imageCache.clear();
};