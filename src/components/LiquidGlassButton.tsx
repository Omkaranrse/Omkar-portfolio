'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  motion,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';

export interface LiquidGlassButtonProps {
  label?: string;
  children?: React.ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  newTab?: boolean;
  material?: 'clear' | 'frosted' | 'tinted';
  surface?: 'light' | 'dark';
  tint?: string;
  textColor?: string;
  icon?: 'arrow' | 'diagonal' | 'chevron' | 'plus' | 'check' | 'copy' | 'none' | 'custom';
  iconCustom?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  radius?: string | number;
  padding?: string;
  gap?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  focusColor?: string;
}

export default function LiquidGlassButton({
  label,
  children,
  href,
  onClick,
  newTab = false,
  material = 'frosted',
  surface = 'dark',
  tint = 'rgba(255, 255, 255, 0.1)',
  textColor,
  icon = 'none',
  iconCustom,
  iconPosition = 'right',
  radius = '9999px',
  padding,
  gap = '8px',
  size = 'md',
  className = '',
  style,
  disabled = false,
  type = 'button',
  focusColor = 'var(--accent)',
}: LiquidGlassButtonProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 260, damping: 28, mass: 0.45 });
  const py = useSpring(rawY, { stiffness: 260, damping: 28, mass: 0.45 });
  const engagement = useMotionValue(0);
  const opticalEngagement = useTransform(engagement, (h) => Math.max(0, Math.min(1, h)));
  const pressure = useSpring(0, { stiffness: 400, damping: 30, mass: 0.5 });

  const activeHover = !disabled && !reduced && hovered;
  const activePress = !disabled && !reduced && pressed;

  React.useEffect(() => {
    if (disabled || reduced) {
      engagement.jump(0);
      return;
    }
    const playback = animate(engagement, activeHover ? 1 : 0, {
      type: 'spring',
      stiffness: 140,
      damping: 24,
      mass: 0.6,
    });
    return () => playback.stop();
  }, [activeHover, disabled, reduced, engagement]);

  React.useEffect(() => {
    if (!disabled && !reduced) {
      pressure.set(activePress ? 1 : 0);
    } else {
      pressure.jump(0);
    }
  }, [activePress, disabled, reduced, pressure]);

  // Optical tilt and movement responses
  const rx = useTransform([py, engagement, pressure], ([y, h, p]: number[]) =>
    -Number(y) * Number(h) * 0.45 + Number(p) * 2
  );
  const ry = useTransform([px, engagement], ([x, h]: number[]) =>
    Number(x) * Number(h) * 0.75
  );
  const faceY = useTransform([engagement, pressure], ([h, p]: number[]) =>
    -0.65 * Number(h) + 1.8 * Number(p)
  );
  const faceScaleX = useTransform(pressure, [0, 1], [1, 0.99]);
  const faceScaleY = useTransform(pressure, [0, 1], [1, 0.975]);

  const reflectionX = useTransform([px, engagement], ([x, h]: number[]) =>
    `${-30 + Number(h) * 36 + Number(x) * Number(h) * 9}%`
  );
  const reflectionY = useTransform([py, engagement], ([y, h]: number[]) =>
    Number(y) * Number(h) * 5
  );
  const reflectionOpacity = useTransform(opticalEngagement, (h) =>
    0.18 + 0.22 * h + 0.08 * Math.sin(Math.PI * h)
  );

  const lightX = useTransform(px, (x) => 50 + x * 44);
  const lightY = useTransform(py, (y) => 50 + y * 38);
  const oppositeX = useTransform(lightX, (x) => 100 - x);
  const oppositeY = useTransform(lightY, (y) => 100 - y);
  const localLightOpacity = useTransform([opticalEngagement, pressure], ([h, p]: number[]) =>
    Number(h) * 0.85 * (1 - Number(p) * 0.2)
  );

  const pointerLight = useMotionTemplate`radial-gradient(ellipse 80px 48px at ${lightX}% ${lightY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 36%, transparent 78%)`;
  const edgeLight = useMotionTemplate`radial-gradient(ellipse 90px 48px at ${lightX}% ${lightY}%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 32%, transparent 82%)`;
  const counterLight = useMotionTemplate`radial-gradient(ellipse 70px 36px at ${oppositeX}% ${oppositeY}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 35%, transparent 82%)`;

  const causticX = useTransform([px, engagement], ([x, h]: number[]) =>
    `${Number(h) * 75 + Number(x) * Number(h) * 55}%`
  );
  const causticOpacity = useTransform(engagement, [0, 1], [0.1, 0.7]);
  const lightAngle = useTransform([px, engagement], ([x, h]: number[]) =>
    180 + Number(x) * Number(h) * 12 - Number(h) * 24
  );

  const bodyShadow = useTransform([opticalEngagement, pressure], ([h, p]: number[]) => {
    const lift = Number(h) * (1 - Number(p));
    return `0 1px 2px rgba(0,0,0,0.3), 0 ${4 + lift * 2 - Number(p) * 2}px ${6 + lift * 2 - Number(p) * 2}px -2px rgba(0,0,0,0.35), 0 ${12 + lift * 4 - Number(p) * 6}px ${24 + lift * 6 - Number(p) * 8}px -8px rgba(0,0,0,0.45)`;
  });

  const rim = useMotionTemplate`conic-gradient(from ${lightAngle}deg at 50% 50%, rgba(255,255,255,0.7) 0deg, rgba(255,255,255,0.3) 36deg, rgba(255,255,255,0.05) 68deg, rgba(0,0,0,0.2) 112deg, rgba(255,255,255,0.15) 155deg, rgba(255,255,255,0.85) 190deg, rgba(255,255,255,0.5) 217deg, rgba(255,255,255,0.05) 256deg, rgba(0,0,0,0.1) 300deg, rgba(255,255,255,0.15) 335deg, rgba(255,255,255,0.7) 360deg)`;

  const move = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || reduced || event.pointerType !== 'mouse') return;
    setHovered(true);
    const r = event.currentTarget.getBoundingClientRect();
    rawX.set(Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1)));
    rawY.set(Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1)));
  };

  const leave = () => {
    setHovered(false);
    setPressed(false);
    rawX.set(0);
    rawY.set(0);
  };

  // Size preset styling
  const sizePaddings = {
    sm: '6px 14px',
    md: '10px 20px',
    lg: '14px 28px',
  };
  const sizeFontSizes = {
    sm: '0.75rem',
    md: '0.84375rem',
    lg: '0.9375rem',
  };

  const resolvedPadding = padding || sizePaddings[size];
  const resolvedFontSize = sizeFontSizes[size];

  const glyph = () => {
    if (icon === 'none') return null;
    if (icon === 'custom' && iconCustom) return <span className="ml-optical-icon">{iconCustom}</span>;

    const iconPaths: Record<string, React.ReactNode> = {
      arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
      diagonal: <path d="M6 18 18 6M6 6h12v12" />,
      chevron: <path d="m9.5 6.5 5.5 5.5-5.5 5.5" />,
      plus: <path d="M5 12h14M12 5v14" />,
      check: <path d="M20 6 9 17l-5-5" />,
      copy: <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2zM4 8v11a2 2 0 0 0 2 2h10" />,
    };

    return (
      <span className="ml-optical-icon" aria-hidden="true" style={{ display: 'inline-flex' }}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {iconPaths[icon] || iconPaths.chevron}
        </svg>
      </span>
    );
  };

  const content = (
    <motion.span
      className="ml-optical-face"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
        width: '100%',
        height: '100%',
        padding: resolvedPadding,
        borderRadius: radius,
        rotateX: !disabled && !reduced ? rx : 0,
        rotateY: !disabled && !reduced ? ry : 0,
        y: !disabled && !reduced ? faceY : 0,
        scaleX: !disabled && !reduced ? faceScaleX : 1,
        scaleY: !disabled && !reduced ? faceScaleY : 1,
        isolation: 'isolate',
      }}
    >
      {/* Background Body & Glass Layers */}
      <motion.span
        className="ml-optical-body"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          boxShadow: bodyShadow,
          pointerEvents: 'none',
        }}
      >
        {/* Glass Surface with Blur & Refraction Tone */}
        <span
          className="ml-optical-surface"
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            borderRadius: radius,
            background:
              surface === 'dark'
                ? 'linear-gradient(155deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 48%, rgba(255, 255, 255, 0.08) 100%)'
                : 'linear-gradient(150deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 42%, rgba(255, 255, 255, 0.3) 100%)',
            backdropFilter: 'blur(16px) saturate(1.15)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.15)',
            boxShadow:
              'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -1px 1px rgba(255, 255, 255, 0.3), inset 1px 0 0.5px rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Tint Layer */}
          <span
            className="ml-optical-tint"
            style={{
              position: 'absolute',
              inset: 0,
              background: tint,
              opacity: material === 'frosted' ? 0.35 : 0.15,
            }}
          />
          {/* Glass Shoulder Shadow */}
          <span
            className="ml-optical-shoulder"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius,
              boxShadow:
                'inset 0 6px 10px -5px rgba(0, 0, 0, 0.5), inset 0 -6px 8px -5px rgba(255, 255, 255, 0.4)',
            }}
          />
          {/* Reflection Wave */}
          <motion.span
            className="ml-optical-reflection"
            style={{
              position: 'absolute',
              inset: '-45% -50%',
              transformOrigin: '50% 50%',
              background:
                'linear-gradient(112deg, transparent 27%, rgba(255,255,255,0.03) 32%, rgba(255,255,255,0.3) 42%, rgba(255,255,255,0.5) 46%, rgba(255,255,255,0.12) 53%, transparent 61%)',
              x: reflectionX,
              y: reflectionY,
              opacity: reflectionOpacity,
            }}
          />
          {/* Caustic Bottom Light */}
          <motion.span
            className="ml-optical-caustic"
            style={{
              position: 'absolute',
              left: '10%',
              bottom: '1px',
              width: '44%',
              height: '2px',
              borderRadius: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8) 48%, transparent)',
              filter: 'blur(0.35px)',
              x: causticX,
              opacity: causticOpacity,
            }}
          />
          {/* Pointer Light Hotspot */}
          <motion.span
            className="ml-optical-pointer-light"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius,
              pointerEvents: 'none',
              background: pointerLight,
              opacity: localLightOpacity,
            }}
          />
        </span>

        {/* Dynamic Light Rims */}
        <motion.span
          className="ml-optical-rim"
          style={{
            position: 'absolute',
            inset: 0,
            padding: '1.25px',
            borderRadius: radius,
            background: rim,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        />
        <motion.span
          className="ml-optical-rim ml-optical-edge-light"
          style={{
            position: 'absolute',
            inset: 0,
            padding: '1.25px',
            borderRadius: radius,
            background: edgeLight,
            opacity: localLightOpacity,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        />
        <motion.span
          className="ml-optical-rim ml-optical-counter-light"
          style={{
            position: 'absolute',
            inset: 0,
            padding: '1.25px',
            borderRadius: radius,
            background: counterLight,
            opacity: localLightOpacity,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        />
      </motion.span>

      {/* Button Content */}
      {iconPosition === 'left' && glyph()}
      <span
        className="ml-optical-label"
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          fontSize: resolvedFontSize,
          color: textColor || (surface === 'dark' ? '#ffffff' : '#111827'),
          textShadow:
            surface === 'dark'
              ? '0 1px 3px rgba(0,0,0,0.6)'
              : '0 1px 2px rgba(255,255,255,0.6)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {children || label}
      </span>
      {iconPosition === 'right' && glyph()}
    </motion.span>
  );

  const baseStyle: React.CSSProperties = {
    appearance: 'none',
    WebkitAppearance: 'none',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 0,
    border: 0,
    background: 'none',
    borderRadius: radius,
    textDecoration: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    perspective: '900px',
    verticalAlign: 'middle',
    WebkitFontSmoothing: 'antialiased',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const commonEvents = {
    onPointerEnter: move,
    onPointerMove: move,
    onPointerLeave: leave,
    onPointerCancel: leave,
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (e.button === 0 && !disabled) {
        move(e);
        setPressed(true);
      }
    },
    onPointerUp: () => setPressed(false),
  };

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.endsWith('.pdf');
    if (isExternal || newTab) {
      return (
        <a
          ref={rootRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          target={newTab || isExternal ? '_blank' : undefined}
          rel={newTab || isExternal ? 'noopener noreferrer' : undefined}
          className={`ml-optical-button ${className}`}
          style={baseStyle}
          onClick={onClick}
          {...commonEvents}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        ref={rootRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={`ml-optical-button ${className}`}
        style={baseStyle}
        onClick={onClick}
        {...commonEvents}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={rootRef as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={`ml-optical-button ${className}`}
      style={baseStyle}
      onClick={onClick}
      {...commonEvents}
    >
      {content}
    </button>
  );
}
