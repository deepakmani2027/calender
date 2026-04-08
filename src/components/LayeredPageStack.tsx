'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayeredPageStackProps {
  currentPageContent: ReactNode;
  nextPageContent: ReactNode;
  isAnimating: boolean;
  flipDirection: 'forward' | 'backward' | null;
}

const LayeredPageStack: React.FC<LayeredPageStackProps> = ({
  currentPageContent,
  nextPageContent,
  isAnimating,
  flipDirection,
}) => {
  return (
    <div className="relative w-full overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Background Layer - Next Month (Blurred Initially) */}
      <motion.div
        initial={{
          filter: 'blur(8px)',
          opacity: 0.6,
          scale: 0.98,
        }}
        animate={{
          filter: isAnimating ? 'blur(8px)' : 'blur(0px)',
          opacity: isAnimating ? 0.6 : 1,
          scale: isAnimating ? 0.98 : 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.645, 0.045, 0.355, 1.0],
        }}
        style={{
          transformStyle: 'preserve-3d',
          zIndex: 1,
        }}
        className="w-full bg-transparent"
      >
        {nextPageContent}
      </motion.div>

      {/* Foreground Layer - Current Month (Flipping Out) */}
      <motion.div
        initial={{
          rotateX: 0,
          transformStyle: 'preserve-3d' as any,
        }}
        animate={{
          rotateX: isAnimating
            ? flipDirection === 'forward'
              ? -180
              : 180
            : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.645, 0.045, 0.355, 1.0],
        }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center top',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          willChange: 'transform',
        }}
        className="w-full bg-transparent"
      >
        {/* Shadow overlay for depth during flip */}
        {isAnimating && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                flipDirection === 'forward'
                  ? 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.25) 100%)'
                  : 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.25) 100%)',
            }}
          />
        )}
        {currentPageContent}
      </motion.div>
    </div>
  );
};

export default LayeredPageStack;
