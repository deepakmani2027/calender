'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BindingBar: React.FC = () => {
  const holes = Array.from({ length: 15 });

  return (
    <div
      className="relative w-full h-14 flex items-center justify-center z-50 bg-gradient-to-b from-muted/60 via-muted/40 to-muted/20 flex-shrink-0 shadow-lg rounded-t-xl"
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      }}
    >
      {/* Top metallic edge highlight - enhanced */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-b from-white/40 via-white/20 to-transparent rounded-b-sm" />

      {/* Top shelf shadow for depth */}
      <div className="absolute inset-x-0 top-3 h-3 bg-gradient-to-b from-black/8 to-transparent blur-md" />

      {/* Decorative tape mark - left */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-white/10 rounded-sm shadow-inner border border-white/20" />
      {/* Decorative tape mark - right */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-white/10 rounded-sm shadow-inner border border-white/20" />

      {/* Main binding wire - enhanced */}
      <div className="absolute inset-x-4 top-1/3 h-1 bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/50 to-muted-foreground/30 rounded-full shadow-md blur-sm" />

      {/* Holes with enhanced 3D effect */}
      <div className="flex justify-between w-full px-6 py-3 gap-2">
        {holes.map((_, i) => (
          <motion.div
            key={i}
            className="relative group"
            initial={{ opacity: 0, scale: 0.6, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.03, ease: 'easeOut' }}
          >
            {/* Spiral wire loop - enhanced 3D */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 border-2 rounded-full transition-all group-hover:scale-110"
              style={{
                borderColor: 'rgba(107, 114, 128, 0.5)',
                boxShadow:
                  'inset -2px -2px 4px rgba(0,0,0,0.15), inset 1px 1px 2px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.2)',
              }}
            />

            {/* Hole punch - deep 3D shadow */}
            <div
              className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-br from-muted-foreground/70 to-muted-foreground/90 shadow-lg transition-shadow group-hover:shadow-xl"
              style={{
                boxShadow:
                  'inset -2px -2px 4px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.2), 0 3px 8px rgba(0,0,0,0.25)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom edge shadow - enhanced */}
      <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-b from-transparent via-black/8 to-black/12 blur-sm" />

      {/* Bottom subtle highlight */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
};

export default BindingBar;
