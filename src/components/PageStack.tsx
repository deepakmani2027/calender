'use client';

import React, { ReactNode } from 'react';

interface PageStackProps {
  children: ReactNode;
  className?: string;
}

const PageStack: React.FC<PageStackProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{
        // Pages should stack on top of binding
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};

export default PageStack;
