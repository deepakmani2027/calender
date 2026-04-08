'use client';

import React, { ReactNode } from 'react';

interface WallSceneProps {
  children: ReactNode;
  isDark?: boolean;
}

const DesktopWallpaper = ({ isDark }: { isDark: boolean }) => (
  <div
    className="absolute inset-0 hidden md:block bg-center bg-cover bg-no-repeat"
    style={{
      backgroundImage: 'url(/laptop.png)',
      filter: isDark ? 'brightness(0.6) saturate(0.85)' : 'brightness(0.95)',
    }}
  />
);

const MobileWallpaper = ({ isDark }: { isDark: boolean }) => (
  <div
    className="absolute inset-0 block md:hidden bg-center bg-cover bg-no-repeat"
    style={{
      backgroundImage: 'url(/mobile.png)',
      filter: isDark ? 'brightness(0.7) saturate(0.9)' : 'brightness(0.98)',
    }}
  />
);

const WallScene: React.FC<WallSceneProps> = ({ children, isDark = false }) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden perspective">
      {/* Ambient light layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Wallpaper background */}
        <DesktopWallpaper isDark={isDark} />
        <MobileWallpaper isDark={isDark} />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.18) 100%)',
          }}
        />

        {/* Texture overlay - subtle wall texture */}
        <div
          className={`absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch' /%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23000' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Vignette effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, ${
              isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(148, 114, 89, 0.2)'
            } 100%)`,
          }}
        />

        {/* Top light glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none blur-3xl opacity-20 ${
            isDark ? 'bg-blue-900' : 'bg-yellow-200'
          }`}
        />

        {/* Subtle corner shadows */}
        <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none blur-3xl opacity-10 bg-black" />
        <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none blur-3xl opacity-10 bg-black" />
      </div>

      {/* Main content with shadow and floating effect */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 py-8">
        {/* Scene depth container */}
        <div
          className="relative"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Large shadow beneath calendar - depth illusion */}
          <div
            className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-[110%] h-32 pointer-events-none ${
              isDark ? 'bg-black' : 'bg-black'
            } blur-2xl opacity-30 rounded-full`}
            style={{
              transform: 'translateY(100%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Light reflection on wall */}
          <div
            className="absolute -inset-20 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 800px 600px at 50% 40%, ${
                isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'
              }, transparent 70%)`,
            }}
          />

          {/* Children content */}
          {children}
        </div>
      </div>

      {/* CSS for 3D perspective */}
      <style>{`
        .perspective {
          perspective: 1200px;
          perspective-origin: center;
        }

        @media (prefers-reduced-motion: no-preference) {
          .float-subtle {
            animation: floatSubtle 6s ease-in-out infinite;
          }

          @keyframes floatSubtle {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }
        }
      `}</style>
    </div>
  );
};

export default WallScene;
