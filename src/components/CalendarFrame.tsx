'use client';

import React, { ReactNode } from 'react';

interface CalendarFrameProps {
  children: ReactNode;
}

const CalendarFrame: React.FC<CalendarFrameProps> = ({ children }) => {
  return (
    <div
      className="relative w-full max-w-[700px] bg-transparent rounded-b-xl overflow-visible border border-gray-200"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        margin: 0,
        padding: 0,
        boxShadow: '0 15px 50px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }}
    >
      {children}
    </div>
  );
};

export default CalendarFrame;
