'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import BouncingBall from './BouncingBall';

export interface PageLoadingScreenProps {
  isVisible?: boolean;
  message?: string;
  minDuration?: number; // minimum display duration in ms before disappearing
  onFinish?: () => void;
}

export default function PageLoadingScreen({
  isVisible = true,
  message = 'Loading experience...',
  minDuration = 400,
  onFinish,
}: PageLoadingScreenProps) {
  const [shouldRender, setShouldRender] = React.useState(isVisible);
  const mountTime = React.useRef(Date.now());

  React.useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      mountTime.current = Date.now();
    } else {
      const elapsed = Date.now() - mountTime.current;
      const remaining = Math.max(0, minDuration - elapsed);

      const timer = setTimeout(() => {
        setShouldRender(false);
        onFinish?.();
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [isVisible, minDuration, onFinish]);

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key="page-loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } }}
          className="page-loading-screen-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            userSelect: 'none',
          }}
          role="status"
          aria-live="polite"
          aria-label={message}
        >
          {/* Subtle Ambient Glow in background */}
          <div
            style={{
              position: 'absolute',
              width: 'min(500px, 80vw)',
              height: 'min(500px, 80vw)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, rgba(212, 175, 55, 0.04) 40%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          {/* Central Card with Image & Bouncing Ball */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              maxWidth: '100%',
            }}
          >
            {/* Omkar Anarse Emblem Logo */}
            <div
              style={{
                position: 'relative',
                width: 'min(440px, 85vw)',
                height: 'min(220px, 42vw)',
                marginBottom: '16px',
              }}
            >
              <Image
                src="/images/loading.png"
                alt="Omkar Anarse — Loading"
                fill
                priority
                unoptimized
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* BouncingBall Component below the image */}
            <div style={{ marginTop: '8px', marginBottom: '18px' }}>
              <BouncingBall
                barColor="#111827"
                ballColor="#ea580c"
                ballEyeColor="#ffffff"
                barWidth={240}
                barHeight={10}
                ballSize={28}
                animationDuration={2.2}
                animationPreset="Slow Roll"
              />
            </div>

            {/* Status Message */}
            {message && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.04em',
                  color: '#6b7280',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ea580c',
                    display: 'inline-block',
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
                {message}
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
