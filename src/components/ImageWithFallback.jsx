import React, { useState, useEffect, useCallback } from 'react';
import { FaImage } from 'react-icons/fa';
import { getCachedImage, validateImage } from '../utils/imageUtils';

const ImageWithFallback = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  type = 'product',
  onLoad,
  onError,
  retryCount = 3,
  retryDelay = 1000
}) => {
  const [imgSrc, setImgSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retries, setRetries] = useState(0);

  const loadImage = useCallback(async () => {
    if (!src) {
      setImgSrc(getCachedImage('', type));
      setLoading(false);
      setError(true);
      return;
    }

    try {
      const processedUrl = getCachedImage(src, type);
      const isValid = await validateImage(processedUrl);

      if (isValid) {
        setImgSrc(processedUrl);
        setLoading(true);
        setError(false);
      } else {
        throw new Error('Invalid image');
      }
    } catch (err) {
      if (retries < retryCount) {
        setRetries(prev => prev + 1);
        setTimeout(loadImage, retryDelay);
      } else {
        setImgSrc(getCachedImage('', type));
        setLoading(false);
        setError(true);
        if (onError) onError(err);
      }
    }
  }, [src, retryCount, retries, retryDelay, type, onError]);

  useEffect(() => {
    let mounted = true;
    
    if (mounted) {
      setRetries(0);
      loadImage();
    }

    return () => {
      mounted = false;
    };
  }, [src, loadImage]);

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    if (retries < retryCount) {
      setRetries(prev => prev + 1);
      setTimeout(loadImage, retryDelay);
    } else {
      setError(true);
      setLoading(false);
      setImgSrc(getCachedImage('', type));
      if (onError) onError();
    }
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-[#EF8741]" />
    </div>
  );

  const FallbackImage = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <FaImage className="w-8 h-8 text-gray-400" />
    </div>
  );

  return (
    <div className={`relative ${containerClassName}`}>
      {loading && <LoadingSpinner />}
      {error ? (
        <FallbackImage />
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default ImageWithFallback;