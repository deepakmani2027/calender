'use client';

import React, { ReactNode, useState, useCallback } from 'react';

export type FlipDirection = 'forward' | 'backward' | null;

interface FlipControllerContextType {
  isAnimating: boolean;
  flipDirection: FlipDirection;
  triggerFlip: (direction: 'forward' | 'backward') => void;
}

export const FlipControllerContext = React.createContext<FlipControllerContextType | undefined>(
  undefined
);

export const useFlipController = () => {
  const context = React.useContext(FlipControllerContext);
  if (!context) {
    throw new Error('useFlipController must be used within FlipControllerProvider');
  }
  return context;
};

interface FlipControllerProviderProps {
  children: ReactNode;
  onFlip?: (direction: 'forward' | 'backward') => void;
  animationDuration?: number;
}

export const FlipControllerProvider: React.FC<FlipControllerProviderProps> = ({
  children,
  onFlip,
  animationDuration = 800,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>(null);

  const triggerFlip = useCallback(
    (direction: 'forward' | 'backward') => {
      if (isAnimating) return; // Prevent rapid consecutive flips

      setIsAnimating(true);
      setFlipDirection(direction);

      // Trigger callback immediately
      onFlip?.(direction);

      // Reset animation state after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setFlipDirection(null);
      }, animationDuration);

      return () => clearTimeout(timer);
    },
    [isAnimating, onFlip, animationDuration]
  );

  return (
    <FlipControllerContext.Provider
      value={{
        isAnimating,
        flipDirection,
        triggerFlip,
      }}
    >
      {children}
    </FlipControllerContext.Provider>
  );
};
