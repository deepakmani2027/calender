'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type FlipState = 'enter' | 'visible' | 'exit';
type FlipDirection = 'forward' | 'backward' | null;

interface CalendarPageProps {
  children: ReactNode;
  flipState: FlipState;
  flipDirection: FlipDirection;
  isCurrentPage: boolean;
  zIndex?: number;
}

const CalendarPage: React.FC<CalendarPageProps> = ({
  children,
  flipState,
  flipDirection,
  isCurrentPage,
  zIndex = 10,
}) => {
  // Forward flip (Next Month): current page rotateX 0deg → -180deg (bottom edge up)
  // Backward flip (Previous Month): new page rotateX 180deg → 0deg (top edge down)

  const getInitialRotation = () => {
    // Incoming page for backward flip starts rotated 180
    if (!isCurrentPage && flipDirection === 'backward') {
      return 180;
    }
    // Current outgoing page starts at 0
    return 0;
  };

  const getAnimateRotation = () => {
    if (flipState === 'visible') {
      return 0; // Final visible state is always 0
    }
    
    // During exit animation
    if (flipState === 'exit' && isCurrentPage) {
      // Current page flips out
      if (flipDirection === 'forward') {
        return -180; // Flip up (bottom edge up) for next month
      } else if (flipDirection === 'backward') {
        return 180; // Flip down (top edge down) for previous month
      }
    }
    return 0;
  };

  const getBlurAmount = () => {
    if (flipState === 'visible') {
      return 0; // No blur when visible
    }
    
    if (isCurrentPage && flipState === 'exit') {
      return 3; // Blur exiting page slightly
    }
    
    if (!isCurrentPage && flipState === 'enter') {
      return 6; // More blur for incoming page
    }
    
    return 0;
  };

  const shadowDirection = () => {
    if (flipDirection === 'forward') {
      return 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.25) 100%)';
    } else {
      return 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.25) 100%)';
    }
  };

  return (
    <motion.div
      initial={{ rotateX: getInitialRotation() }}
      animate={{ rotateX: getAnimateRotation() }}
      transition={{
        duration: flipState === 'visible' ? 0.0 : 0.8,
        ease: [0.645, 0.045, 0.355, 1.0],
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        zIndex: flipState === 'exit' && !isCurrentPage ? zIndex + 1 : zIndex,
        originX: 0.5,
        originY: flipDirection === 'backward' ? 1 : 0, // Bottom for backward flip, top for forward flip
        transformOrigin: flipDirection === 'backward' ? 'center bottom' : 'center top',
        filter: flipState === 'visible' ? 'blur(0px)' : `blur(${getBlurAmount()}px)`,
      }}
      className="w-full bg-white"
    >
      {/* Shadow overlay during flip for depth */}
      {flipState !== 'visible' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: shadowDirection(),
            opacity: flipState === 'exit' ? 1 : 0,
          }}
        />
      )}

      {children}
    </motion.div>
  );
};

export default CalendarPage;
