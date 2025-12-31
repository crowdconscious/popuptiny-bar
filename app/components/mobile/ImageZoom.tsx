'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export default function ImageZoom({ src, alt, children }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div onClick={() => setIsZoomed(true)} className="cursor-zoom-in">
        {children}
      </div>
      
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-deep-black/95 flex items-center justify-center p-4"
          >
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-rich-gold text-deep-black rounded-full flex items-center justify-center font-bold text-xl"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

