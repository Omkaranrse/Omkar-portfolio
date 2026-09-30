'use client';

import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// ── Countdown Engine (from Framer Countdown250 specification) ──
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1e3 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1e3 * 60)) % 60);
  const seconds = Math.floor((diff / 1e3) % 60);
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export interface NixieDeskClockProps {
  targetDate?: string;
  targetTime?: string;
  timeZoneMode?: 'local' | 'utc';
  initialMode?: 'countdown' | 'realtime';
  className?: string;
}

// Capsule slot positions calculated from watch.png geometry
const CAPSULE_SLOTS = [
  { id: 'days', label: 'DAYS', left: '14.0%', top: '25.6%', width: '14.6%', height: '44.5%' },
  { id: 'hours', label: 'HOURS', left: '33.6%', top: '25.6%', width: '14.6%', height: '44.5%' },
  { id: 'minutes', label: 'MINUTES', left: '53.7%', top: '25.6%', width: '14.6%', height: '44.5%' },
  { id: 'seconds', label: 'SECONDS', left: '73.3%', top: '25.6%', width: '14.6%', height: '44.5%' },
];

export default function NixieDeskClock({
  targetDate = '2026-12-31',
  targetTime = '00:00',
  timeZoneMode = 'local',
  initialMode = 'countdown',
  className = '',
}: NixieDeskClockProps) {
  const [mode, setMode] = useState<'countdown' | 'realtime'>(initialMode);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play mechanical flip / toggle sound
  const playClickAudio = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  // Compute countdown target
  const target = useMemo(() => {
    const dateStr = targetDate || '2026-12-31';
    const timeStr = targetTime || '00:00';
    const iso =
      timeZoneMode === 'utc'
        ? `${dateStr}T${timeStr}:00Z`
        : `${dateStr}T${timeStr}:00`;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? new Date('2026-12-31T00:00:00') : d;
  }, [targetDate, targetTime, timeZoneMode]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));
  const [nowDate, setNowDate] = useState(() => new Date());

  // Real-time ticking every second
  useEffect(() => {
    const tick = () => {
      setTimeLeft(getTimeLeft(target));
      setNowDate(new Date());
      setPulseKey((p) => (p + 1) % 100);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);

  // Framer Motion 3D Tilt Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 22 });

  // Natural desk perspective tilt
  const deskRotateX = useTransform(springY, [-100, 100], [16, 4]);
  const deskRotateY = useTransform(springX, [-100, 100], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleToggleMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickAudio();
    setMode((m) => (m === 'countdown' ? 'realtime' : 'countdown'));
  };

  // Determine what numbers to render in each of the 4 capsules
  const slotValues = useMemo(() => {
    if (mode === 'countdown') {
      return [
        pad(timeLeft.days),
        pad(timeLeft.hours),
        pad(timeLeft.minutes),
        pad(timeLeft.seconds),
      ];
    } else {
      // Real-time mode: [Day of Month / Date, Hours, Minutes, Seconds]
      return [
        pad(nowDate.getDate()),
        pad(nowDate.getHours()),
        pad(nowDate.getMinutes()),
        pad(nowDate.getSeconds()),
      ];
    }
  }, [mode, timeLeft, nowDate]);

  return (
    <div
      className={`nixie-clock-desk-anchor ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleToggleMode}
      role="region"
      aria-label="3D Nixie Model Desk Clock & Countdown Timer. Click to toggle real-time clock."
      title="Nixie Desk Clock · Click to switch between Countdown & Real-Time Clock"
    >
      {/* Floating Info Tag above the clock */}
      <div className="nixie-clock-tag">
        <span className="nixie-tag-bulb" />
        <span className="nixie-tag-text">
          {mode === 'countdown' ? 'NIXIE COUNTDOWN // 2026' : 'LIVE REAL-TIME CLOCK'}
        </span>
        <span className="nixie-tag-switch">CLICK TO SWITCH</span>
      </div>

      {/* 3D Motion Stage */}
      <motion.div
        className="nixie-clock-stage"
        style={{
          rotateX: deskRotateX,
          rotateY: deskRotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* ── Base 3D Model Clock Hardware (watch.png) ── */}
        <div className="nixie-hardware-chassis">
          <Image
            src="/images/watch.png"
            alt="3D Nixie Model Desk Clock"
            width={1881}
            height={836}
            priority
            quality={90}
            className="nixie-chassis-image"
          />

          {/* ── Dynamic Glowing Digits in the 4 Glass Tube Capsules ── */}
          {CAPSULE_SLOTS.map((slot, index) => {
            const digitValue = slotValues[index];

            return (
              <div
                key={slot.id}
                className="nixie-capsule-display-slot"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  height: slot.height,
                }}
              >
                {/* Dark Interior Flip Plate that masks the static image digits */}
                <div className="nixie-flip-plate">
                  {/* Subtle Flip Card Split Line */}
                  <div className="nixie-split-line" />

                  {/* Top Half Shade */}
                  <div className="nixie-card-half-shade" />

                  {/* Active Glowing Digit Display */}
                  <div className="nixie-digit-content">
                    <span className="nixie-filament-digit">
                      {digitValue}
                    </span>
                  </div>

                  {/* Dynamic Tube Filament Ambient Glow */}
                  <div className="nixie-ambient-filament-glow" />

                  {/* Curved Glass Reflection / Specular Highlight */}
                  <div className="nixie-glass-refraction-sheen" />
                </div>
              </div>
            );
          })}

          {/* Golden Ambient Glow Underneath Chassis */}
          <div className="nixie-base-underglow" />
        </div>

        {/* Soft Desk Cast Contact Shadow */}
        <motion.div
          className="nixie-desk-shadow"
          animate={{
            opacity: isHovered ? 0.45 : 0.7,
            scale: isHovered ? 1.08 : 1,
            filter: isHovered ? 'blur(18px)' : 'blur(12px)',
          }}
          transition={{ duration: 0.35 }}
        />
      </motion.div>
    </div>
  );
}
