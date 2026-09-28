'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import sceneImg from '@/images/home.png';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  source?: string;
  time?: string;
}

interface AskOmkarAiWorkstationProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSendQuestion: (q: string) => void;
  onBack?: () => void;
}

export interface KeyDef {
  id: string;
  code: string;
  label: string;
  char?: string;
  shiftChar?: string;
  width?: number;
  isAction?: boolean;
  variant?: 'alpha' | 'modifier' | 'space' | 'enter' | 'arrow';
}

// ── 01. Placement Config (Percentages of .scene-box) ──
const SCENE = {
  screen:   { x: 28.9, y: 19.4, w: 42.8, h: 37.4 },
  keyboard: { x: 27.0, y: 75.5, w: 44.0, h: 17.5 },
};

// ── 02. 5-Row 75% Mechanical Keyboard Layout ──
const KEYBOARD_LAYOUT: KeyDef[][] = [
  // Row 1: Numbers + 2u Backspace
  [
    { id: 'k-1', code: 'Digit1', label: '1', char: '1', shiftChar: '!', width: 1, variant: 'alpha' },
    { id: 'k-2', code: 'Digit2', label: '2', char: '2', shiftChar: '@', width: 1, variant: 'alpha' },
    { id: 'k-3', code: 'Digit3', label: '3', char: '3', shiftChar: '#', width: 1, variant: 'alpha' },
    { id: 'k-4', code: 'Digit4', label: '4', char: '4', shiftChar: '$', width: 1, variant: 'alpha' },
    { id: 'k-5', code: 'Digit5', label: '5', char: '5', shiftChar: '%', width: 1, variant: 'alpha' },
    { id: 'k-6', code: 'Digit6', label: '6', char: '6', shiftChar: '^', width: 1, variant: 'alpha' },
    { id: 'k-7', code: 'Digit7', label: '7', char: '7', shiftChar: '&', width: 1, variant: 'alpha' },
    { id: 'k-8', code: 'Digit8', label: '8', char: '8', shiftChar: '*', width: 1, variant: 'alpha' },
    { id: 'k-9', code: 'Digit9', label: '9', char: '9', shiftChar: '(', width: 1, variant: 'alpha' },
    { id: 'k-0', code: 'Digit0', label: '0', char: '0', shiftChar: ')', width: 1, variant: 'alpha' },
    { id: 'k-bksp', code: 'Backspace', label: '⌫', width: 2, isAction: true, variant: 'modifier' },
  ],
  // Row 2: QWERTY Alpha row
  [
    { id: 'k-q', code: 'KeyQ', label: 'Q', char: 'q', shiftChar: 'Q', width: 1, variant: 'alpha' },
    { id: 'k-w', code: 'KeyW', label: 'W', char: 'w', shiftChar: 'W', width: 1, variant: 'alpha' },
    { id: 'k-e', code: 'KeyE', label: 'E', char: 'e', shiftChar: 'E', width: 1, variant: 'alpha' },
    { id: 'k-r', code: 'KeyR', label: 'R', char: 'r', shiftChar: 'R', width: 1, variant: 'alpha' },
    { id: 'k-t', code: 'KeyT', label: 'T', char: 't', shiftChar: 'T', width: 1, variant: 'alpha' },
    { id: 'k-y', code: 'KeyY', label: 'Y', char: 'y', shiftChar: 'Y', width: 1, variant: 'alpha' },
    { id: 'k-u', code: 'KeyU', label: 'U', char: 'u', shiftChar: 'U', width: 1, variant: 'alpha' },
    { id: 'k-i', code: 'KeyI', label: 'I', char: 'i', shiftChar: 'I', width: 1, variant: 'alpha' },
    { id: 'k-o', code: 'KeyO', label: 'O', char: 'o', shiftChar: 'O', width: 1, variant: 'alpha' },
    { id: 'k-p', code: 'KeyP', label: 'P', char: 'p', shiftChar: 'P', width: 1, variant: 'alpha' },
  ],
  // Row 3: Home row letters + 2u Enter
  [
    { id: 'k-a', code: 'KeyA', label: 'A', char: 'a', shiftChar: 'A', width: 1, variant: 'alpha' },
    { id: 'k-s', code: 'KeyS', label: 'S', char: 's', shiftChar: 'S', width: 1, variant: 'alpha' },
    { id: 'k-d', code: 'KeyD', label: 'D', char: 'd', shiftChar: 'D', width: 1, variant: 'alpha' },
    { id: 'k-f', code: 'KeyF', label: 'F', char: 'f', shiftChar: 'F', width: 1, variant: 'alpha' },
    { id: 'k-g', code: 'KeyG', label: 'G', char: 'g', shiftChar: 'G', width: 1, variant: 'alpha' },
    { id: 'k-h', code: 'KeyH', label: 'H', char: 'h', shiftChar: 'H', width: 1, variant: 'alpha' },
    { id: 'k-j', code: 'KeyJ', label: 'J', char: 'j', shiftChar: 'J', width: 1, variant: 'alpha' },
    { id: 'k-k', code: 'KeyK', label: 'K', char: 'k', shiftChar: 'K', width: 1, variant: 'alpha' },
    { id: 'k-l', code: 'KeyL', label: 'L', char: 'l', shiftChar: 'L', width: 1, variant: 'alpha' },
    { id: 'k-enter', code: 'Enter', label: '↵', width: 2, isAction: true, variant: 'enter' },
  ],
  // Row 4: 2u Shift + Bottom letters + Punctuation + Shift
  [
    { id: 'k-shift-l', code: 'ShiftLeft', label: '⇧', width: 2, isAction: true, variant: 'modifier' },
    { id: 'k-z', code: 'KeyZ', label: 'Z', char: 'z', shiftChar: 'Z', width: 1, variant: 'alpha' },
    { id: 'k-x', code: 'KeyX', label: 'X', char: 'x', shiftChar: 'X', width: 1, variant: 'alpha' },
    { id: 'k-c', code: 'KeyC', label: 'C', char: 'c', shiftChar: 'C', width: 1, variant: 'alpha' },
    { id: 'k-v', code: 'KeyV', label: 'V', char: 'v', shiftChar: 'V', width: 1, variant: 'alpha' },
    { id: 'k-b', code: 'KeyB', label: 'B', char: 'b', shiftChar: 'B', width: 1, variant: 'alpha' },
    { id: 'k-n', code: 'KeyN', label: 'N', char: 'n', shiftChar: 'N', width: 1, variant: 'alpha' },
    { id: 'k-m', code: 'KeyM', label: 'M', char: 'm', shiftChar: 'M', width: 1, variant: 'alpha' },
    { id: 'k-comma', code: 'Comma', label: ',', char: ',', shiftChar: '<', width: 0.95, variant: 'alpha' },
    { id: 'k-dot', code: 'Period', label: '.', char: '.', shiftChar: '>', width: 0.95, variant: 'alpha' },
    { id: 'k-qmark', code: 'Slash', label: '?', char: '?', shiftChar: '/', width: 0.95, variant: 'alpha' },
    { id: 'k-shift-r', code: 'ShiftRight', label: '⇧', width: 1.5, isAction: true, variant: 'modifier' },
  ],
  // Row 5: Clear, Ctrl, Alt, Space(6.25u), Alt, Ctrl, ←, ↓, →
  [
    { id: 'k-clear', code: 'Escape', label: 'Clear', width: 1.3, isAction: true, variant: 'modifier' },
    { id: 'k-ctrl-l', code: 'ControlLeft', label: 'Ctrl', width: 1.1, isAction: true, variant: 'modifier' },
    { id: 'k-alt-l', code: 'AltLeft', label: 'Alt', width: 1.1, isAction: true, variant: 'modifier' },
    { id: 'k-space', code: 'Space', label: 'Space', char: ' ', width: 6.25, isAction: true, variant: 'space' },
    { id: 'k-alt-r', code: 'AltRight', label: 'Alt', width: 1.1, isAction: true, variant: 'modifier' },
    { id: 'k-ctrl-r', code: 'ControlRight', label: 'Ctrl', width: 1.1, isAction: true, variant: 'modifier' },
    { id: 'k-arrow-l', code: 'ArrowLeft', label: '←', width: 1, isAction: true, variant: 'arrow' },
    { id: 'k-arrow-d', code: 'ArrowDown', label: '↓', width: 1, isAction: true, variant: 'arrow' },
    { id: 'k-arrow-r', code: 'ArrowRight', label: '→', width: 1, isAction: true, variant: 'arrow' },
  ],
];

const PRESET_PROMPTS = [
  { label: 'Projects & Stack', prompt: 'Tell me about your top technical projects and software stack.' },
  { label: 'Experience & Roles', prompt: 'What is your background and what engineering roles are you seeking?' },
  { label: 'Current Focus', prompt: 'What technologies or challenges are you currently focusing on?' },
  { label: 'Contact & Socials', prompt: 'How can I connect with you or collaborate?' },
];

export default function AskOmkarAiWorkstation({
  messages,
  isThinking,
  onSendQuestion,
  onBack,
}: AskOmkarAiWorkstationProps) {
  const [question, setQuestion] = useState('');
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [isFocused, setIsFocused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [knobRotation, setKnobRotation] = useState(0);
  const [clockTime, setClockTime] = useState('9:41 AM');
  const [mounted, setMounted] = useState(false);

  // State B (Expanded Modal Window)
  const [isExpanded, setIsExpanded] = useState(false);

  // Debug mode (?debug=1, only when process.env.NODE_ENV !== 'production')
  const [isDebug, setIsDebug] = useState(false);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number }>({
    w: sceneImg.width || 1672,
    h: sceneImg.height || 941,
  });
  const [railIntersects, setRailIntersects] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const expandedTextareaRef = useRef<HTMLTextAreaElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const screenRectRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const savedCaretPos = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check ?debug=1 from URL safely in non-production
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDebug(params.get('debug') === '1');
    }
  }, []);

  // Check if social rail intersects screen rect in debug mode
  useEffect(() => {
    if (!isDebug) return;
    const checkIntersection = () => {
      const railEl = document.querySelector('.social-rail');
      const screenEl = screenRectRef.current;
      if (railEl && screenEl) {
        const r = railEl.getBoundingClientRect();
        const s = screenEl.getBoundingClientRect();
        const intersects = !(
          r.right < s.left ||
          r.left > s.right ||
          r.bottom < s.top ||
          r.top > s.bottom
        );
        setRailIntersects(intersects);
        if (intersects) {
          console.warn('[Debug] Warning: Social rail intersects screen rect!', { rail: r, screen: s });
        }
      }
    };

    checkIntersection();
    window.addEventListener('resize', checkIntersection);
    return () => window.removeEventListener('resize', checkIntersection);
  }, [isDebug]);

  // Update live clock
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setClockTime(
        d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll message list to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isThinking, scrollToBottom]);

  // Open & Close handlers for State B with focus & caret preservation
  const handleOpenExpanded = useCallback(() => {
    if (textareaRef.current) {
      savedCaretPos.current = {
        start: textareaRef.current.selectionStart || 0,
        end: textareaRef.current.selectionEnd || 0,
      };
    }
    setIsExpanded(true);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    if (expandedTextareaRef.current) {
      savedCaretPos.current = {
        start: expandedTextareaRef.current.selectionStart || 0,
        end: expandedTextareaRef.current.selectionEnd || 0,
      };
    }
    setIsExpanded(false);
  }, []);

  // Body scroll lock, focus trap, and caret restoration for State B
  useEffect(() => {
    if (isExpanded) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const t = setTimeout(() => {
        if (expandedTextareaRef.current) {
          expandedTextareaRef.current.focus();
          try {
            expandedTextareaRef.current.setSelectionRange(
              savedCaretPos.current.start,
              savedCaretPos.current.end
            );
          } catch {
            // Ignore selection error on non-focused elements
          }
        }
      }, 50);

      // Focus trap handler
      const handleKeyDownTrap = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDownTrap);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDownTrap);
        clearTimeout(t);
      };
    } else {
      const t = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          try {
            textareaRef.current.setSelectionRange(
              savedCaretPos.current.start,
              savedCaretPos.current.end
            );
          } catch {
            // Ignore selection error
          }
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isExpanded]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 70;
    setShowScrollBottom(isUp);
  }, []);

  // Audio Switch Synthesis (Web Audio API)
  const playSwitchAudio = useCallback(
    (variant: 'press' | 'release' = 'press', keyVariant: string = 'alpha') => {
      if (!soundEnabled || typeof window === 'undefined') return;

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const baseFreq =
          keyVariant === 'space'
            ? 75
            : keyVariant === 'enter'
            ? 100
            : keyVariant === 'modifier'
            ? 115
            : 135;

        // Sub-bass thock pulse
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq * (variant === 'press' ? 1.0 : 1.15), now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.045);

        const peakVolume = variant === 'press' ? 0.28 : 0.16;
        oscGain.gain.setValueAtTime(peakVolume, now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);

        // Tactile switch click noise
        const bufferSize = ctx.sampleRate * 0.016;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';

        if (keyVariant === 'space') {
          noiseFilter.frequency.setValueAtTime(380, now);
          noiseFilter.Q.setValueAtTime(3.2, now);
        } else if (keyVariant === 'enter') {
          noiseFilter.frequency.setValueAtTime(750, now);
          noiseFilter.Q.setValueAtTime(2.5, now);
        } else {
          noiseFilter.frequency.setValueAtTime(900, now);
          noiseFilter.Q.setValueAtTime(2.8, now);
        }

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(variant === 'press' ? 0.09 : 0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseSource.start(now);
        noiseSource.stop(now + 0.02);
      } catch {
        // Audio playback error ignored
      }
    },
    [soundEnabled]
  );

  // Submit Handler: Opens State B automatically on first send
  const handleSubmit = useCallback(
    (customQuery?: string) => {
      const q = (customQuery ?? question).trim();
      if (!q || isThinking) return;

      setIsExpanded(true);
      onSendQuestion(q);
      setQuestion('');

      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
      if (expandedTextareaRef.current) {
        expandedTextareaRef.current.value = '';
      }
    },
    [question, isThinking, onSendQuestion]
  );

  // Physical keyboard synchronization
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
        setPressedKeys((prev) => ({ ...prev, [e.code]: true }));
        return;
      }

      setPressedKeys((prev) => ({ ...prev, [e.code]: true }));

      let variant = 'alpha';
      if (e.code === 'Space') variant = 'space';
      else if (e.code === 'Enter') variant = 'enter';
      else if (['Backspace', 'ShiftLeft', 'ShiftRight', 'Tab', 'Escape'].includes(e.code)) {
        variant = 'modifier';
      }

      playSwitchAudio('press', variant);

      if (e.code === 'Escape') {
        // Escape is the virtual keyboard's Clear key: Clear query input only, DO NOT close State B
        setQuestion('');
        if (textareaRef.current) textareaRef.current.value = '';
        if (expandedTextareaRef.current) expandedTextareaRef.current.value = '';
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        if (document.activeElement === textareaRef.current || document.activeElement === expandedTextareaRef.current) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = { ...prev };
        delete next[e.code];
        return next;
      });

      if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Meta') {
        let variant = 'alpha';
        if (e.code === 'Space') variant = 'space';
        else if (e.code === 'Enter') variant = 'enter';
        else if (['Backspace', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
          variant = 'modifier';
        }
        playSwitchAudio('release', variant);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playSwitchAudio, handleSubmit]);

  // Cursor-aware text insertion for virtual keyboard
  const insertTextAtCursor = useCallback(
    (textToInsert: string) => {
      const target = isExpanded ? expandedTextareaRef.current : textareaRef.current;
      if (!target) {
        setQuestion((prev) => prev + textToInsert);
        return;
      }

      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? target.value.length;
      const oldVal = target.value;
      const newVal = oldVal.substring(0, start) + textToInsert + oldVal.substring(end);

      target.value = newVal;
      setQuestion(newVal);

      const newCursorPos = start + textToInsert.length;
      target.selectionStart = newCursorPos;
      target.selectionEnd = newCursorPos;
      target.focus();
    },
    [isExpanded]
  );

  const backspaceAtCursor = useCallback(() => {
    const target = isExpanded ? expandedTextareaRef.current : textareaRef.current;
    if (!target) {
      setQuestion((prev) => prev.slice(0, -1));
      return;
    }

    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const oldVal = target.value;

    if (start !== end) {
      const newVal = oldVal.substring(0, start) + oldVal.substring(end);
      target.value = newVal;
      setQuestion(newVal);
      target.selectionStart = start;
      target.selectionEnd = start;
    } else if (start > 0) {
      const newVal = oldVal.substring(0, start - 1) + oldVal.substring(start);
      target.value = newVal;
      setQuestion(newVal);
      target.selectionStart = start - 1;
      target.selectionEnd = start - 1;
    }
    target.focus();
  }, [isExpanded]);

  // Virtual Key Press Handler
  const handleVirtualKey = (key: KeyDef) => {
    playSwitchAudio('press', key.variant || 'alpha');
    setTimeout(() => playSwitchAudio('release', key.variant || 'alpha'), 70);

    setPressedKeys((prev) => ({ ...prev, [key.code]: true }));
    setTimeout(() => {
      setPressedKeys((prev) => {
        const next = { ...prev };
        delete next[key.code];
        return next;
      });
    }, 110);

    if (key.code === 'ShiftLeft' || key.code === 'ShiftRight') {
      setIsShiftActive((prev) => !prev);
      return;
    }

    if (key.code === 'Backspace') {
      backspaceAtCursor();
      return;
    }

    if (key.code === 'Enter') {
      handleSubmit();
      return;
    }

    if (key.code === 'Escape') {
      setQuestion('');
      if (textareaRef.current) textareaRef.current.value = '';
      if (expandedTextareaRef.current) expandedTextareaRef.current.value = '';
      return;
    }

    if (key.code === 'Space') {
      insertTextAtCursor(' ');
      return;
    }

    if (key.isAction) {
      return;
    }

    const charToAdd = isShiftActive && key.shiftChar ? key.shiftChar : key.char || key.label;
    if (charToAdd) {
      insertTextAtCursor(charToAdd);
      if (isShiftActive) {
        setIsShiftActive(false);
      }
    }
  };

  const handleRotaryKnobClick = () => {
    setKnobRotation((prev) => (prev + 30) % 360);
    playSwitchAudio('press', 'enter');
  };

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('omkaranarse13@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const imageRatio = imgNatural.w / imgNatural.h;
  const isRatioOff = Math.abs(imageRatio - 16 / 9) > 0.02;

  return (
    <>
      {/* ── 01. Scene Root (Cover-Box Architecture) ── */}
      <main className="scene-root" inert={isExpanded}>
        {/* Debug Overlay (?debug=1, only in non-production) */}
        {isDebug && (
          <div className="scene-debug-overlay" aria-live="polite">
            <div className="debug-badge-title">🛠 SCENE DEBUG MODE (?debug=1)</div>
            <div>Screen: x={SCENE.screen.x}%, y={SCENE.screen.y}%, w={SCENE.screen.w}%, h={SCENE.screen.h}%</div>
            <div>Keyboard: x={SCENE.keyboard.x}%, y={SCENE.keyboard.y}%, w={SCENE.keyboard.w}%, h={SCENE.keyboard.h}%</div>
            <div>Image Natural: {imgNatural.w} × {imgNatural.h} (Ratio: {imageRatio.toFixed(4)})</div>
            {isRatioOff && (
              <div className="scene-debug-warn">
                ⚠️ scene image is not 16:9, SCENE values will be off
              </div>
            )}
            {railIntersects && (
              <div className="scene-debug-warn">
                ⚠️ Warning: Social rail bounding box intersects screen rect!
              </div>
            )}
          </div>
        )}

        {/* Blurred backdrop using static import blurDataURL */}
        <div
          className="scene-backdrop"
          aria-hidden="true"
          style={{ backgroundImage: `url(${sceneImg.blurDataURL})` }}
        />

        {/* 16:9 Cover Box */}
        <div className="scene-box">
          <Image
            src={sceneImg}
            alt=""
            aria-hidden="true"
            fill
            priority
            fetchPriority="high"
            quality={80}
            sizes="100vw"
            placeholder="blur"
            style={{ objectFit: 'cover' }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
              }
            }}
          />

          {/* ── .mac-screen (State A: Launcher) ── */}
          <div
            ref={screenRectRef}
            className={`mac-screen ${isDebug ? 'debug-outline' : ''}`}
            style={{
              left: `${SCENE.screen.x}%`,
              top: `${SCENE.screen.y}%`,
              width: `${SCENE.screen.w}%`,
              height: `${SCENE.screen.h}%`,
            }}
            onClick={handleOpenExpanded}
          >
            {/* Subtle Glass Reflection */}
            <div className="mac-screen-glass-reflection" aria-hidden="true" />

            {/* Slim macOS Menu Bar */}
            <div className="mac-screen-menubar" aria-hidden="true">
              <div className="mac-menubar-left">
                <span className="mac-menubar-brand">Omkar AI</span>
                <span className="mac-menubar-item">File</span>
                <span className="mac-menubar-item">Edit</span>
                <span className="mac-menubar-item">View</span>
              </div>
              <div className="mac-menubar-right">
                <span className="mac-menubar-clock">{clockTime}</span>
              </div>
            </div>

            {/* Maximized macOS Window */}
            <div className="mac-screen-window-frame">
              {/* Window Title Bar */}
              <div className="mac-window-titlebar">
                <div className="traffic-lights" aria-label="Window controls">
                  <button
                    type="button"
                    className="traffic-dot red"
                    aria-label="Clear query"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuestion('');
                    }}
                  />
                  <button
                    type="button"
                    className="traffic-dot yellow"
                    aria-label="Minimize"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <button
                    type="button"
                    className="traffic-dot green"
                    aria-label="Expand to full screen"
                    title="Expand to Full Screen"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenExpanded();
                    }}
                  />
                </div>

                {onBack && (
                  <button
                    type="button"
                    className="mac-nav-back-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBack();
                    }}
                    aria-label="Go Back"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                )}

                <div className="mac-window-title">Omkar AI</div>

                <div className="mac-window-tools">
                  <button
                    type="button"
                    className={`mac-tool-btn ${!soundEnabled ? 'is-muted' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSoundEnabled((prev) => !prev);
                    }}
                    title={soundEnabled ? 'Mute Mechanical Switch Audio' : 'Unmute Sound'}
                    aria-label="Toggle mechanical switch audio"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      {soundEnabled ? (
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                      ) : (
                        <line x1="23" y1="9" x2="17" y2="15" />
                      )}
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="mac-tool-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyEmail();
                    }}
                    title="Copy email: omkaranarse13@gmail.com"
                    aria-label="Copy email address"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span className="tool-btn-label">{copiedEmail ? 'Copied' : 'Email'}</span>
                  </button>
                </div>
              </div>

              {/* State A (launcher): Vertically centered group edge-to-edge */}
              <div className="state-a-compact-body">
                <div className="launcher-headline-wrap">
                  <div className="launcher-text-col">
                    <h2 className="launcher-title">Ask anything about Omkar.</h2>
                    <p className="launcher-subtitle">Projects, stack, experience, roles.</p>
                  </div>
                  <span className="compact-expand-hint" title="Click screen to expand">
                    Click screen to expand ↗
                  </span>
                </div>

                {/* Query Input Box with single placeholder fix */}
                <div
                  className={`compact-query-box ${isFocused ? 'is-focused' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    textareaRef.current?.focus();
                  }}
                >
                  <div className="compact-textarea-wrap">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      className="compact-textarea"
                      placeholder=""
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      aria-label="Ask Omkar AI a question"
                    />
                    {!question && (
                      <span className="compact-kinetic-placeholder" aria-hidden="true">
                        Type via keyboard or click preset below
                        <span className="compact-blinking-cursor" />
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="compact-send-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit();
                    }}
                    disabled={!question.trim() || isThinking}
                    aria-label="Send message"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>

                {/* 4 Shortcut Chips (wrap, never clip) */}
                <div className="compact-chips-row">
                  {PRESET_PROMPTS.map((p, idx) => (
                    <button
                      key={`preset-${idx}`}
                      type="button"
                      className="compact-chip-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmit(p.prompt);
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── .keyboard-wrap (Section 5) ── */}
          <div
            className={`keyboard-wrap ${isDebug ? 'debug-outline' : ''}`}
            style={{
              left: `${SCENE.keyboard.x}%`,
              top: `${SCENE.keyboard.y}%`,
              width: `${SCENE.keyboard.w}%`,
              height: `${SCENE.keyboard.h}%`,
            }}
          >
            {/* Brushed aluminium case shell with extruded lower edge & contact shadow */}
            <div
              className="keyboard-case-shell"
              role="application"
              aria-label="Mechanical keyboard 75 percent layout"
            >
              {/* Integrated Top Strip: LED + model label on left, OLED + knob on right */}
              <div className="keyboard-top-strip">
                <div className="keyboard-brand-group">
                  <span className="keyboard-led-dot" aria-hidden="true" />
                  <span className="keyboard-model-label">OMKAR // MECH-75</span>
                </div>

                <div className="keyboard-controls-group">
                  {/* OLED Query Character Counter */}
                  <div
                    className="cm-oled-screen"
                    title="Query Character Counter"
                    aria-label={`Character count: ${question.length}`}
                  >
                    <span className="oled-pulse-dot" />
                    <span className="oled-text">
                      Q · {question.length.toString().padStart(3, '0')}c
                    </span>
                  </div>

                  {/* Silver Rotary Knob */}
                  <button
                    type="button"
                    className="cm-rotary-knob"
                    onClick={handleRotaryKnobClick}
                    style={{ transform: `rotate(${knobRotation}deg)` }}
                    aria-label="Silver rotary knob controller"
                    title="Click rotary knob for audio thock"
                  >
                    <span className="knob-marker" />
                  </button>
                </div>
              </div>

              {/* 5 Rows of Keycaps */}
              <div className="cm-keyboard-deck">
                {KEYBOARD_LAYOUT.map((row, rIdx) => (
                  <div
                    key={`row-${rIdx}`}
                    className="cm-keyboard-row"
                    style={{ '--row-idx': rIdx } as React.CSSProperties}
                  >
                    {row.map((k) => {
                      const isDown = !!pressedKeys[k.code];
                      const isShiftKey = k.code === 'ShiftLeft' || k.code === 'ShiftRight';
                      const isShiftLit = isShiftKey && isShiftActive;

                      return (
                        <button
                          key={k.id}
                          type="button"
                          className={`cm-keycap ${isDown ? 'is-pressed' : ''} ${
                            k.isAction ? 'is-modifier' : ''
                          } ${k.variant ? `variant-${k.variant}` : ''} ${
                            isShiftLit ? 'is-shift-lit' : ''
                          }`}
                          style={{ flex: k.width ?? 1 }}
                          onClick={() => handleVirtualKey(k)}
                          onMouseDown={(e) => e.preventDefault()}
                          tabIndex={-1}
                          aria-label={`Key ${k.label}`}
                        >
                          <span className="cm-key-lip" aria-hidden="true" />
                          <span className="cm-key-face">
                            {isShiftActive && k.shiftChar && !k.isAction ? k.shiftChar : k.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE VIEW (<640px) ── */}
        <div className="workstation-mobile-view">
          {/* Full-width Chat Card (State B content inline, no modal) */}
          <div className="mobile-chat-card">
            <div className="mac-window-titlebar">
              <div className="traffic-lights">
                <span className="traffic-dot red" />
                <span className="traffic-dot yellow" />
                <span className="traffic-dot green" />
              </div>
              <div className="mac-window-title">Omkar AI</div>
              <button
                type="button"
                className="mac-tool-btn"
                onClick={handleCopyEmail}
                aria-label="Copy email"
              >
                <span className="tool-btn-label">{copiedEmail ? 'Copied' : 'Email'}</span>
              </button>
            </div>

            <div className="mobile-chat-body">
              {messages.length === 0 ? (
                <div className="mobile-empty-state">
                  <p>What would you like to know about Omkar?</p>
                </div>
              ) : (
                <div className="messages-thread">
                  {messages.map((m) => (
                    <div key={m.id} className={`chat-bubble-row ${m.role === 'user' ? 'is-user' : 'is-ai'}`}>
                      <div className="chat-bubble">
                        <div className="bubble-text">{m.text}</div>
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="chat-bubble-row is-ai">
                      <div className="chat-bubble is-thinking-bubble">Thinking...</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mobile-chips-shelf">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={`m-chip-${idx}`}
                  type="button"
                  className="compact-chip-pill"
                  onClick={() => handleSubmit(p.prompt)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mobile-input-bar">
              <input
                type="text"
                className="mobile-input"
                placeholder="Ask anything..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <button
                type="button"
                className="compact-send-btn"
                onClick={() => handleSubmit()}
                disabled={!question.trim() || isThinking}
              >
                Send
              </button>
            </div>
          </div>

          {/* Flat 2D Virtual Keyboard for Mobile (Keys >=30px) */}
          <div className="mobile-flat-keyboard" role="application" aria-label="Virtual keyboard">
            {KEYBOARD_LAYOUT.map((row, rIdx) => (
              <div key={`m-row-${rIdx}`} className="mobile-keyboard-row">
                {row.map((k) => (
                  <button
                    key={`m-${k.id}`}
                    type="button"
                    className={`mobile-keycap ${k.isAction ? 'is-action' : ''} ${
                      pressedKeys[k.code] ? 'is-pressed' : ''
                    }`}
                    style={{ flex: k.width ?? 1 }}
                    onClick={() => handleVirtualKey(k)}
                    tabIndex={-1}
                  >
                    {isShiftActive && k.shiftChar && !k.isAction ? k.shiftChar : k.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── State B: Expanded Modal Window (Rendered via createPortal to document.body) ── */}
      {mounted && isExpanded && createPortal(
        <div
          ref={modalRef}
          className="state-b-backdrop"
          onClick={handleCloseExpanded}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded AI Chat Console"
        >
          <div
            className="state-b-window"
            onClick={(e) => e.stopPropagation()}
          >
            {/* macOS Menu Bar at top */}
            <div className="mac-screen-menubar" aria-hidden="true">
              <div className="mac-menubar-left">
                <span className="mac-menubar-brand">Omkar AI</span>
                <span className="mac-menubar-item">Conversation</span>
                <span className="mac-menubar-item">History</span>
                <span className="mac-menubar-item">Tools</span>
              </div>
              <div className="mac-menubar-right">
                <span className="mac-menubar-clock">{clockTime}</span>
              </div>
            </div>

            {/* macOS Title Bar with Exit Fullscreen button */}
            <div className="mac-window-titlebar">
              <div className="traffic-lights" aria-label="Window controls">
                <button
                  type="button"
                  className="traffic-dot red"
                  aria-label="Close modal"
                  onClick={handleCloseExpanded}
                />
                <button
                  type="button"
                  className="traffic-dot yellow"
                  aria-label="Minimize modal"
                  onClick={handleCloseExpanded}
                />
                <button
                  type="button"
                  className="traffic-dot green"
                  aria-label="Toggle full screen"
                  onClick={handleCloseExpanded}
                />
              </div>

              {onBack && (
                <button
                  type="button"
                  className="mac-nav-back-btn"
                  onClick={onBack}
                  aria-label="Go Back"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
              )}

              <div className="mac-window-title">Omkar AI · Conversation Console</div>

              <div className="mac-window-tools">
                <button
                  type="button"
                  className="exit-fullscreen-btn"
                  onClick={handleCloseExpanded}
                  aria-label="Exit full screen"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                  <span>Exit full screen</span>
                </button>

                <button
                  type="button"
                  className={`mac-tool-btn ${!soundEnabled ? 'is-muted' : ''}`}
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  title={soundEnabled ? 'Mute Mechanical Switch Audio' : 'Unmute Sound'}
                  aria-label="Toggle mechanical switch audio"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    {soundEnabled ? (
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                    ) : (
                      <line x1="23" y1="9" x2="17" y2="15" />
                    )}
                  </svg>
                </button>

                <button
                  type="button"
                  className="mac-tool-btn"
                  onClick={handleCopyEmail}
                  title="Copy email: omkaranarse13@gmail.com"
                  aria-label="Copy email address"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span className="tool-btn-label">{copiedEmail ? 'Copied' : 'Email'}</span>
                </button>
              </div>
            </div>

            {/* Scrolling Chat Message List */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="state-b-messages-scroll"
            >
              {messages.length === 0 ? (
                <div className="state-b-empty-state">
                  <div className="empty-state-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <h3 className="empty-state-title">Welcome to Omkar AI</h3>
                  <p className="empty-state-desc">
                    Ask me about engineering capabilities, backend architecture,
                    distributed systems, UI design, or past project achievements.
                  </p>
                </div>
              ) : (
                <div className="messages-thread">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${msg.role === 'user' ? 'is-user' : 'is-ai'}`}
                    >
                      <div className="chat-bubble">
                        <div className="bubble-header">
                          <span className="bubble-sender">
                            {msg.role === 'user' ? 'You' : 'Omkar AI'}
                          </span>
                          {msg.time && <span className="bubble-time">{msg.time}</span>}
                        </div>
                        <div className="bubble-text">{msg.text}</div>
                        {msg.source && (
                          <div className="bubble-source-pill">
                            <span>Source: {msg.source}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Thinking Pill */}
                  {isThinking && (
                    <div className="chat-bubble-row is-ai">
                      <div className="chat-bubble is-thinking-bubble">
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                        <span className="thinking-text">Retrieving knowledge base...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Scroll-to-bottom Floating Button */}
            {showScrollBottom && (
              <button
                type="button"
                className="scroll-latest-btn"
                onClick={() => scrollToBottom(true)}
                aria-label="Scroll to latest messages"
              >
                <span>Latest</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </button>
            )}

            {/* Shortcut Chips Bar */}
            <div className="state-b-chips-shelf">
              <span className="shelf-label">SHORTCUTS:</span>
              <div className="shelf-chips-list">
                {PRESET_PROMPTS.map((p, idx) => (
                  <button
                    key={`shelf-${idx}`}
                    type="button"
                    className="shelf-chip-pill"
                    onClick={() => handleSubmit(p.prompt)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Follow-up Query Input Console */}
            <div className="state-b-input-dock">
              <div className="input-dock-inner">
                <textarea
                  ref={expandedTextareaRef}
                  rows={2}
                  className="state-b-textarea"
                  placeholder="Ask a follow-up question or continue typing..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  aria-label="Type your message"
                />

                <div className="input-dock-actions">
                  <span className="input-char-counter">
                    {question.length} chars
                  </span>
                  <button
                    type="button"
                    className="state-b-send-btn"
                    onClick={() => handleSubmit()}
                    disabled={!question.trim() || isThinking}
                    aria-label="Send message"
                  >
                    <span>Send</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
