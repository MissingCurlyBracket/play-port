import type { ReactNode } from 'react';
import BaseBox from '../atoms/BaseBox';

type GradientDirection = 'to-bottom' | 'to-left';

interface BackdropHeroProps {
  backdropUrl?: string;
  gradientDirection?: GradientDirection;
  blur?: number;
  height?: string | number;
  children?: ReactNode;
  sx?: object;
}

const GRADIENTS: Record<GradientDirection, string> = {
  'to-bottom':
    'linear-gradient(180deg, rgba(15,10,31,0.35) 0%, rgba(15,10,31,0.85) 70%, #0f0a1f 100%)',
  'to-left':
    'linear-gradient(270deg, rgba(15,10,31,0) 0%, rgba(15,10,31,0.75) 55%, #0f0a1f 100%)',
};

export default function BackdropHero({
  backdropUrl,
  gradientDirection = 'to-bottom',
  blur = 0,
  height = '60vh',
  children,
  sx,
}: Readonly<BackdropHeroProps>) {
  return (
    <BaseBox
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: height,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {backdropUrl && (
        <BaseBox
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `${blur > 0 ? `blur(${blur}px) ` : ''}brightness(0.65)`,
            transform: blur > 0 ? 'scale(1.08)' : 'scale(1.02)',
            transition: 'opacity 300ms ease',
          }}
        />
      )}
      <BaseBox
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: GRADIENTS[gradientDirection],
        }}
      />
      <BaseBox sx={{ position: 'relative', zIndex: 1, minHeight: height }}>
        {children}
      </BaseBox>
    </BaseBox>
  );
}
