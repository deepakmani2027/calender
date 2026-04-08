'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageFlipProps {
  children: React.ReactNode;
  direction?: 'forward' | 'backward';
  flipKey: number;
}

const PageFlip: React.FC<PageFlipProps> = ({ children, direction = 'forward', flipKey }) => {
  return (
    <motion.div
      key={flipKey}
      initial={{
        rotateX: direction === 'forward' ? 0 : 0,
        opacity: 1,
      }}
      animate={{
        rotateX: 0,
        opacity: 1,
      }}
      exit={{
        rotateX: direction === 'forward' ? 90 : -90,
        opacity: 0,
      }}
      transition={{
        duration: 0.6,
        ease: [0.645, 0.045, 0.355, 1.0], // cubic-bezier for smooth flip
      }}
      style={{
        transformPerspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.15,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default PageFlip;
