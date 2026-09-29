'use client';

import * as React from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';

export interface LanyardCardProps {
  companyName: string;
  role: string;
  period: string;
  type: string;
  description: string;
  techStack?: string[];
  backCardText: string;
  backCardColor?: string;
  profileImage: StaticImageData | string;
  tapeColor?: string;
  tapeRotation?: number;
}

export default function LanyardCard({
  companyName,
  role,
  period,
  type,
  description,
  techStack = ['Flutter', 'Dart', 'State Mgmt', 'REST APIs'],
  backCardText,
  backCardColor = 'var(--accent)',
  profileImage,
  tapeColor = '#E0E0E0',
  tapeRotation = -4,
}: LanyardCardProps) {
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isShaking, setIsShaking] = React.useState(false);

  const shakeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current !== null) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = () => {
    if (!isShaking) {
      setIsShaking(true);
      shakeTimeoutRef.current = setTimeout(() => {
        setIsShaking(false);
        shakeTimeoutRef.current = null;
      }, 1500);
    }
  };

  const tapeTextureStyle: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(45deg, rgba(255,255,255,0.4) 1px, transparent 1px),
      linear-gradient(-45deg, rgba(255,255,255,0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.06) 50%, transparent 50%)
    `,
    backgroundSize: '8px 8px, 8px 8px, 2px 2px',
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 'min(380px, 100%)',
        margin: '0 auto',
      }}
    >
      <motion.div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transformOrigin: 'top center',
          width: '100%',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        initial={{ y: -200, opacity: 0, rotateZ: -16 }}
        whileInView={{ y: 0, opacity: 1, rotateZ: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        animate={{
          y: 0,
          opacity: 1,
          rotateZ: hasAnimated
            ? isShaking
              ? [-5, 4, -3, 2, -1, 0]
              : isHovered
                ? [0, 1.5, -1, 0.5, 0]
                : 0
            : [-16, 12, -8, 6, -4, 2, -1, 0],
        }}
        transition={{
          y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.4 },
          rotateZ: isShaking
            ? { duration: 1.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeOut' }
            : { duration: 2.4, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1], ease: 'easeOut' },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* ── Top Textured Adhesive Tape ── */}
        <div
          style={{
            width: 72,
            height: 28,
            backgroundColor: tapeColor,
            opacity: 0.92,
            position: 'relative',
            zIndex: 20,
            marginBottom: -14,
            borderRadius: '2px',
            transform: `rotate(${tapeRotation}deg)`,
            boxShadow: `
              0 2px 6px rgba(0,0,0,0.25),
              inset 0 1px 0 rgba(255,255,255,0.6),
              inset 0 -1px 0 rgba(0,0,0,0.15)
            `,
            border: '1px solid rgba(0,0,0,0.12)',
            ...tapeTextureStyle,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -1,
              left: -1,
              right: -1,
              bottom: -1,
              borderRadius: '2px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
              zIndex: -1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              right: '10%',
              height: '30%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              borderRadius: '1px',
            }}
          />
        </div>

        {/* ── Lanyard Clip Hole ── */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#12141a',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
            position: 'relative',
            zIndex: 15,
            marginBottom: -8,
          }}
        />

        {/* ── Back Card (Peeks out dynamically on hover) ── */}
        {isHovered && (
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 20,
              background: backCardColor,
              boxShadow: '0px 16px 40px rgba(0, 0, 0, 0.5)',
              position: 'absolute',
              top: 30,
              left: 0,
              zIndex: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            initial={{ rotateZ: 0, opacity: 0, x: 0, y: 0 }}
            animate={{ rotateZ: 8, opacity: 1, x: -32, y: -20 }}
            exit={{ rotateZ: 0, opacity: 0, x: 0, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div
              style={{
                position: 'absolute',
                left: 24,
                top: '90%',
                transform: 'translateY(-50%) rotate(-90deg)',
                transformOrigin: 'left center',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '48px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                opacity: 0.95,
                textTransform: 'uppercase',
              }}
            >
              {backCardText}
            </div>
          </motion.div>
        )}

        {/* ── Main Lanyard Badge Card ── */}
        <motion.div
          style={{
            width: '100%',
            borderRadius: 20,
            background: 'linear-gradient(165deg, rgba(28, 32, 42, 0.95) 0%, rgba(14, 16, 22, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 20px 48px -8px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 22px 20px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 2,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Subtle Accent Glow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, var(--accent), #ff7a59)',
            }}
          />

          {/* Header Row: Company & Period */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 20,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                {companyName}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.6875rem',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {type}
              </span>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '4px 10px',
                borderRadius: 9999,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.6875rem',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 500,
              }}
            >
              {period}
            </div>
          </div>

          {/* Center Profile Avatar / Badge Photo */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '10px 0 20px',
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                position: 'relative',
              }}
            >
              {typeof profileImage === 'string' ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  sizes="96px"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
          </div>

          {/* Bottom Card Holder Details */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              borderRadius: 14,
              padding: '16px 18px',
              color: '#1a1a1a',
              marginTop: 'auto',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.01em',
                }}
              >
                Omkar Anarse
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono), monospace',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: '#f0f0f0',
                  color: '#4b5563',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                ID: ENG-{companyName.replace(/\s+/g, '').slice(0, 3).toUpperCase()}
              </span>
            </div>

            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--accent)',
                marginBottom: 8,
              }}
            >
              {role}
            </div>

            <p
              style={{
                fontFamily: 'inherit',
                fontSize: '0.75rem',
                lineHeight: 1.45,
                color: '#4b5563',
                margin: '0 0 10px 0',
              }}
            >
              {description}
            </p>

            {/* Tech chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {techStack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono), monospace',
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: '#e5e7eb',
                    color: '#1f2937',
                    fontWeight: 500,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
