'use client';

import * as React from 'react';

export interface BouncingBallProps {
  barColor?: string;
  ballColor?: string;
  ballEyeColor?: string;
  barWidth?: number;
  barHeight?: number;
  ballSize?: number;
  animationDuration?: number;
  animationPreset?: 'Classic' | 'Fast Bounce' | 'Slow Roll' | 'Energetic' | 'Smooth Glide';
  style?: React.CSSProperties;
  className?: string;
}

export default function BouncingBall({
  barColor = '#111827',
  ballColor = '#ea580c',
  ballEyeColor = '#ffffff',
  barWidth = 260,
  barHeight = 12,
  ballSize = 34,
  animationDuration = 2.4,
  animationPreset = 'Slow Roll',
  style,
  className = '',
}: BouncingBallProps) {
  const uid = React.useId().replace(/:/g, '');

  const presets = {
    Classic: {
      barRotateFrom: -14,
      barRotateTo: 14,
      ballRotateFrom: 360,
      ballRotateTo: 0,
      easing: 'ease-in-out',
      duration: animationDuration,
    },
    'Fast Bounce': {
      barRotateFrom: -22,
      barRotateTo: 22,
      ballRotateFrom: 720,
      ballRotateTo: 0,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      duration: animationDuration * 0.6,
    },
    'Slow Roll': {
      barRotateFrom: -10,
      barRotateTo: 10,
      ballRotateFrom: 180,
      ballRotateTo: 0,
      easing: 'ease',
      duration: animationDuration * 1.3,
    },
    Energetic: {
      barRotateFrom: -26,
      barRotateTo: 26,
      ballRotateFrom: 540,
      ballRotateTo: 0,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      duration: animationDuration * 0.8,
    },
    'Smooth Glide': {
      barRotateFrom: -8,
      barRotateTo: 8,
      ballRotateFrom: 360,
      ballRotateTo: 0,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      duration: animationDuration * 1.1,
    },
  };

  const currentPreset = presets[animationPreset] || presets['Slow Roll'];
  const calculatedHeight = ballSize * 2 + barHeight + 30;

  return (
    <div
      className={`bouncing-ball-root ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
        width: 'max-content',
        height: `${calculatedHeight}px`,
        ...style,
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes bb-bar-tilt-${uid} {
          from {
            transform: rotate(${currentPreset.barRotateFrom}deg);
          }
          to {
            transform: rotate(${currentPreset.barRotateTo}deg);
          }
        }

        @keyframes bb-ball-roll-${uid} {
          from {
            left: calc(100% - ${ballSize * 0.85}px);
            transform: rotate(${currentPreset.ballRotateFrom}deg);
          }
          to {
            left: calc(0% - ${ballSize * 0.15}px);
            transform: rotate(${currentPreset.ballRotateTo}deg);
          }
        }
      `}</style>

      <div
        className="bouncing-ball-bar"
        style={{
          width: `${barWidth}px`,
          height: `${barHeight}px`,
          background: barColor,
          borderRadius: '9999px',
          transform: `rotate(${currentPreset.barRotateFrom}deg)`,
          animation: `bb-bar-tilt-${uid} ${currentPreset.duration}s ${currentPreset.easing} 0.1s infinite alternate`,
          position: 'relative',
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        }}
      >
        <div
          className="bouncing-ball-orb"
          style={{
            position: 'relative',
            bottom: `${ballSize}px`,
            left: `calc(100% - ${ballSize * 0.85}px)`,
            width: `${ballSize}px`,
            height: `${ballSize}px`,
            background: ballColor,
            borderRadius: '50%',
            animation: `bb-ball-roll-${uid} ${currentPreset.duration}s ${currentPreset.easing} 0.1s infinite alternate`,
            boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Eye spot on the ball */}
          <div
            style={{
              position: 'absolute',
              top: `${ballSize * 0.45}px`,
              right: `${ballSize * 0.15}px`,
              width: `${ballSize * 0.14}px`,
              height: `${ballSize * 0.14}px`,
              background: ballEyeColor,
              borderRadius: '50%',
              boxShadow: '0 0 2px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
