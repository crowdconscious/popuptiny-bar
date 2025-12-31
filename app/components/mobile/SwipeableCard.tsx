'use client';

import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export default function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  threshold = 100 
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
      x.set(0);
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
      x.set(0);
    } else {
      x.set(0);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x, opacity, rotate }}
      className="touch-pan-y"
    >
      {children}
    </motion.div>
  );
}

