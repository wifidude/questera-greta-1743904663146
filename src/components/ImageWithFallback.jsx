import React, { useState, useEffect, useRef } from 'react';
import { FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { processImageUrl, getDefaultImage } from '../utils/imageUtils';
import { imageLogger } from '../utils/debugLogger';

const ImageWithFallback = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  type = 'product',
  onLoad = () => {},
  componentName = 'unknown'
}) => {
  const [imgSrc, setImgSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const loadStartTime = useRef(0);
  const loadAttempts = useRef(0);

  useEffect(() => {
    let isMounted = true;
    loadStartTime.current = Date.now();
    loadAttempts.current++;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);

        // Start tracking image load
        const loadId = imageLogger.startLoad(src, {
          componentName,
          attempt: loadAttempts.current,
          type,
          timestamp: new Date().toISOString()
        });

        const processedSrc = await processImageUrl(src, type);
        if (!isMounted) return;

        // Test image loading
        const img = new Image();
        img.onload = () => {
          if (!isMounted) return;
          const loadTime = Date.now() - loadStartTime.current;
          
          imageLogger.success(processedSrc, {
            loadId,
            loadTime,
            dimensions: {
              width: img.width,
              height: img.height
            },
            attempt: loadAttempts.current,
            context: {
              componentName,
              type,
              alt
            }
          });

          setImgSrc(processedSrc);
          setLoading(false);
          onLoad(true);
        };

        img.onerror = (e) => {
          if (!isMounted) return;
          const loadTime = Date.now() - loadStartTime.current;

          imageLogger.error(processedSrc, {
            message: 'Image load failed',
            loadTime,
            attempt: loadAttempts.current,
            context: {
              componentName,
              type,
              alt,
              error: e
            }
          });

          setError(true);
          setLoading(false);
          setImgSrc(getDefaultImage(type));
          onLoad(false);
        };

        img.src = processedSrc;
      } catch (err) {
        if (!isMounted) return;
        
        imageLogger.error(src, err, {
          componentName,
          attempt: loadAttempts.current,
          type,
          context: {
            alt,
            className,
            containerClassName
          }
        });

        setImgSrc(getDefaultImage(type));
        setError(true);
        setLoading(false);
        onLoad(false);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src, type, onLoad, componentName, alt, className, containerClassName]);

  return (
    <div className={`relative ${containerClassName}`}>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-gray-50"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-[#EF8741]" />
        </motion.div>
      )}
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <FaImage className="w-8 h-8 text-gray-400" />
        </div>
      ) : (
        <motion.img
          src={imgSrc}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => {
            setLoading(false);
            imageLogger.debug('Image render complete', {
              src: imgSrc,
              componentName,
              loadTime: Date.now() - loadStartTime.current,
              timestamp: new Date().toISOString()
            });
          }}
          onError={() => {
            setError(true);
            setLoading(false);
            setImgSrc(getDefaultImage(type));
            imageLogger.error('Image render error', {
              src: imgSrc,
              type,
              componentName,
              loadTime: Date.now() - loadStartTime.current,
              timestamp: new Date().toISOString()
            });
          }}
        />
      )}
    </div>
  );
};

export default ImageWithFallback;