// Core image handling utilities
import { DIMENSIONS } from './constants';

// Default image as base64 SVG - optimized and clean
const DEFAULT_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#f3f4f6"/>
    <path d="M35 40h30v20H35z" fill="#d1d5db"/>
    <path d="M30 30h40v40H30zm2 2h36v36H32z" fill="#9ca3af"/>
    <circle cx="45" cy="45" r="5" fill="#9ca3af"/>
    <path d="M60 55L45 45l-10 15h35z" fill="#9ca3af"/>
  </svg>
`)}`;

// Default QR code as base64 SVG
const DEFAULT_QR = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#f3f4f6"/>
    <rect x="25" y="25" width="50" height="50" fill="#d1d5db"/>
  </svg>
`)}`;

export const getDefaultImage = (type = 'product') => {
  return type === 'qr' ? DEFAULT_QR : DEFAULT_IMAGE;
};

export const processImageUrl = (url, type = 'product') => {
  if (!url) return getDefaultImage(type);

  try {
    // Handle absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url); // Validate URL format
      return url;
    }

    // Handle data URLs
    if (url.startsWith('data:')) {
      return url;
    }

    // Handle relative URLs
    // Remove leading './' or '/' if present
    const cleanUrl = url.replace(/^\.?\/?/, '');
    
    // For development environment
    if (import.meta.env.DEV) {
      return `/${cleanUrl}`;
    }
    
    // For production environment with base URL
    return `./${cleanUrl}`;
  } catch (error) {
    console.warn(`Invalid image URL: ${url}`);
    return getDefaultImage(type);
  }
};

export const validateImage = async (url) => {
  if (!url || url.startsWith('data:')) return true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('Image not found');
    
    const contentType = response.headers.get('content-type');
    return contentType && contentType.startsWith('image/');
  } catch (error) {
    console.warn('Image validation failed:', error);
    return false;
  }
};

// Image dimensions validator
export const validateImageDimensions = (imageUrl, maxWidth = DIMENSIONS.CARD.IMAGE_WIDTH, maxHeight = DIMENSIONS.CARD.IMAGE_HEIGHT) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        valid: img.width <= maxWidth && img.height <= maxHeight,
        width: img.width,
        height: img.height
      });
    };
    
    img.onerror = () => {
      resolve({ valid: false, width: 0, height: 0 });
    };
    
    img.src = imageUrl;
  });
};

// Cache for validated images
const imageCache = new Map();

export const getCachedImage = (url, type = 'product') => {
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }
  
  const processedUrl = processImageUrl(url, type);
  imageCache.set(url, processedUrl);
  return processedUrl;
};

export const clearImageCache = () => {
  imageCache.clear();
};