'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const y = useMotionValue(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const opacity = useTransform(y, [0, 100], [0, 1]);
  const scale = useTransform(y, [0, 100], [0.8, 1]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY > 0) {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        if (deltaY > 0) {
          y.set(Math.min(deltaY, 150));
        }
      }
    };

    const handleTouchEnd = async () => {
      if (y.get() > 80 && !isRefreshing) {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
      }
      y.set(0);
      setStartY(0);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [y, startY, isRefreshing, onRefresh]);

  return (
    <div className="relative">
      <motion.div
        style={{ opacity, scale }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-20 pointer-events-none"
      >
        <div className="bg-rich-gold rounded-full p-4">
          {isRefreshing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-deep-black border-t-transparent rounded-full"
            />
          ) : (
            <span className="text-2xl">↓</span>
          )}
        </div>
      </motion.div>
      {children}
    </div>
  );
}

