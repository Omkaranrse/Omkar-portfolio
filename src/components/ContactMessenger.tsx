'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────
// ContactMessenger — Interactive Digital Object & Keyboard Console
// Direct tactile input interface for "Ask Omkar AI"
// Synced with physical keyboard input, synthesized WebAudio thock,
// and real-time query dispatch to Ask Omkar AI.
// ─────────────────────────────────────────────────────────

interface ContactMessengerProps {
  onSendQuestion: (query: string) => void;
  isThinking?: boolean;
  onActivateAi?: () => void;
  isAiActive?: boolean;
}

// 4-row compact keyboard layout with relative width units
interface KeyDef {
  id: string;
  code: string;
  label: string;
  char?: string;
  width?: number; // relative width weight
  isAction?: boolean;
}

const KEYBOARD_LAYOUT: KeyDef[][] = [
  // Row 1: Numbers & top row
  [
    { id: 'k-q', code: 'KeyQ', label: 'Q', char: 'q', width: 1 },
    { id: 'k-w', code: 'KeyW', label: 'W', char: 'w', width: 1 },
    { id: 'k-e', code: 'KeyE', label: 'E', char: 'e', width: 1 },
    { id: 'k-r', code: 'KeyR', label: 'R', char: 'r', width: 1 },
    { id: 'k-t', code: 'KeyT', label: 'T', char: 't', width: 1 },
    { id: 'k-y', code: 'KeyY', label: 'Y', char: 'y', width: 1 },
    { id: 'k-u', code: 'KeyU', label: 'U', char: 'u', width: 1 },
    { id: 'k-i', code: 'KeyI', label: 'I', char: 'i', width: 1 },
    { id: 'k-o', code: 'KeyO', label: 'O', char: 'o', width: 1 },
    { id: 'k-p', code: 'KeyP', label: 'P', char: 'p', width: 1 },
    { id: 'k-bksp', code: 'Backspace', label: '⌫', width: 1.35, isAction: true },
  ],
  // Row 2: Home row
  [
    { id: 'k-a', code: 'KeyA', label: 'A', char: 'a', width: 1 },
    { id: 'k-s', code: 'KeyS', label: 'S', char: 's', width: 1 },
    { id: 'k-d', code: 'KeyD', label: 'D', char: 'd', width: 1 },
    { id: 'k-f', code: 'KeyF', label: 'F', char: 'f', width: 1 },
    { id: 'k-g', code: 'KeyG', label: 'G', char: 'g', width: 1 },
    { id: 'k-h', code: 'KeyH', label: 'H', char: 'h', width: 1 },
    { id: 'k-j', code: 'KeyJ', label: 'J', char: 'j', width: 1 },
    { id: 'k-k', code: 'KeyK', label: 'K', char: 'k', width: 1 },
    { id: 'k-l', code: 'KeyL', label: 'L', char: 'l', width: 1 },
    { id: 'k-enter', code: 'Enter', label: '↵', width: 1.45, isAction: true },
  ],
  // Row 3: Bottom letters
  [
    { id: 'k-shift', code: 'ShiftLeft', label: '⇧', width: 1.25, isAction: true },
    { id: 'k-z', code: 'KeyZ', label: 'Z', char: 'z', width: 1 },
    { id: 'k-x', code: 'KeyX', label: 'X', char: 'x', width: 1 },
    { id: 'k-c', code: 'KeyC', label: 'C', char: 'c', width: 1 },
    { id: 'k-v', code: 'KeyV', label: 'V', char: 'v', width: 1 },
    { id: 'k-b', code: 'KeyB', label: 'B', char: 'b', width: 1 },
    { id: 'k-n', code: 'KeyN', label: 'N', char: 'n', width: 1 },
    { id: 'k-m', code: 'KeyM', label: 'M', char: 'm', width: 1 },
    { id: 'k-dot', code: 'Period', label: '.', char: '.', width: 0.9 },
    { id: 'k-comma', code: 'Comma', label: ',', char: ',', width: 0.9 },
  ],
  // Row 4: Space bar & modifier row
  [
    { id: 'k-clear', code: 'Escape', label: 'Clear', width: 1.3, isAction: true },
    { id: 'k-space', code: 'Space', label: 'Space', char: ' ', width: 5.5, isAction: true },
    { id: 'k-excl', code: 'Digit1', label: '!', char: '!', width: 1 },
    { id: 'k-qmark', code: 'Slash', label: '?', char: '?', width: 1 },
  ],
];

const QUESTION_PRESETS = [
  { label: 'Attendephi', text: 'Tell me about Attendephi' },
  { label: 'AI Projects', text: 'What AI projects has Omkar built?' },
  { label: 'Tech Stack', text: 'What technologies does Omkar use?' },
  { label: 'Roles Wanted', text: 'What roles is Omkar looking for?' },
];

export default function ContactMessenger({
  onSendQuestion,
  isThinking = false,
  onActivateAi,
  isAiActive = false,
}: ContactMessengerProps) {
  const [question, setQuestion] = useState('');
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [isFocused, setIsFocused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ─────────────────────────────────────────────────────────
  // Synthesized Mechanical Switch Audio (Holy Panda / Inks thock profile)
  // ─────────────────────────────────────────────────────────
  const playSwitchAudio = useCallback(
    (type: 'down' | 'up' | 'space' | 'thock' = 'down') => {
      if (!soundEnabled) return;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;

        // Base click oscillator: tactile bottom-out
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Mechanical body noise: subtle housing reverberation
        const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.035, ctx.sampleRate);
        const data = noiseBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.007));
        }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuf;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';

        const noiseGain = ctx.createGain();

        if (type === 'space') {
          // Deeper spacebar resonance
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.038);

          oscGain.gain.setValueAtTime(0.24, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          noiseFilter.frequency.setValueAtTime(380, now);
          noiseFilter.Q.setValueAtTime(3.2, now);
          noiseGain.gain.setValueAtTime(0.18, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        } else if (type === 'thock') {
          // Heavy lubed switch sound
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.032);

          oscGain.gain.setValueAtTime(0.28, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.034);

          noiseFilter.frequency.setValueAtTime(750, now);
          noiseFilter.Q.setValueAtTime(2.5, now);
          noiseGain.gain.setValueAtTime(0.12, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
        } else {
          // Standard tactile switch down
          const jitter = (Math.random() - 0.5) * 40;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320 + jitter, now);
          osc.frequency.exponentialRampToValueAtTime(95, now + 0.024);

          oscGain.gain.setValueAtTime(0.22, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

          noiseFilter.frequency.setValueAtTime(900, now);
          noiseFilter.Q.setValueAtTime(2.8, now);
          noiseGain.gain.setValueAtTime(0.09, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
        }

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc.start(now);
        noiseSource.start(now);

        osc.stop(now + 0.045);
        noiseSource.stop(now + 0.045);
      } catch {
        // Fallback gracefully without throwing
      }
    },
    [soundEnabled]
  );

  // ─────────────────────────────────────────────────────────
  // Sync Real Keyboard Events with Virtual Keycap Lights
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing elsewhere on page
      if (document.activeElement && document.activeElement !== textareaRef.current) {
        return;
      }

      setPressedKeys((prev) => ({ ...prev, [e.code]: true }));

      if (e.code === 'Space') {
        playSwitchAudio('space');
      } else {
        playSwitchAudio('down');
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = { ...prev };
        delete next[e.code];
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playSwitchAudio, question, isThinking]);

  const handleSubmit = (forcedText?: string) => {
    const queryToSend = (forcedText !== undefined ? forcedText : question).trim();
    if (!queryToSend || isThinking) return;

    onActivateAi?.();
    onSendQuestion(queryToSend);
    setQuestion('');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('omkaranarse1906@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // ─────────────────────────────────────────────────────────
  // Virtual Click on Keyboard Keys
  // ─────────────────────────────────────────────────────────
  const handleVirtualKey = (key: KeyDef) => {
    onActivateAi?.();

    if (key.code === 'Space') {
      playSwitchAudio('space');
    } else {
      playSwitchAudio('down');
    }

    // Flash key state for 120ms
    setPressedKeys((prev) => ({ ...prev, [key.code]: true }));
    setTimeout(() => {
      setPressedKeys((prev) => {
        const next = { ...prev };
        delete next[key.code];
        return next;
      });
    }, 120);

    if (key.code === 'Backspace') {
      setQuestion((prev) => prev.slice(0, -1));
    } else if (key.code === 'Escape') {
      setQuestion('');
    } else if (key.code === 'ShiftLeft' || key.code === 'ShiftRight') {
      setIsShiftActive((prev) => !prev);
    } else if (key.code === 'Enter') {
      handleSubmit();
    } else if (key.char !== undefined) {
      const charToAdd = isShiftActive ? key.char.toUpperCase() : key.char;
      setQuestion((prev) => prev + charToAdd);
    }

    textareaRef.current?.focus();
  };

  const currentPlaceholder = isFocused
    ? 'Ask about projects, tech stack, experience...'
    : hoveredCard
    ? 'Type question or use keyboard...'
    : 'Ask me anything about my work...';

  return (
    <div
      className="contact-messenger-console"
      onPointerEnter={() => setHoveredCard(true)}
      onPointerLeave={() => setHoveredCard(false)}
      role="region"
      aria-label="Interactive AI keyboard console"
    >
      {/* ── Console Header ── */}
      <div className="cm-header">
        <div className="cm-status-pill">
          <span className="cm-status-dot" aria-hidden="true" />
          <span className="cm-status-text">ASK CONSOLE</span>
        </div>

        <div className="cm-header-actions">
          {/* Copy Email Action */}
          <button
            type="button"
            className={`cm-copy-btn ${copiedEmail ? 'is-copied' : ''}`}
            onClick={handleCopyEmail}
            aria-label="Copy email address"
            title="Copy omkaranarse1906@gmail.com"
          >
            {copiedEmail ? (
              <>
                <span>✓</span>
                <span>Copied</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy email</span>
              </>
            )}
          </button>

          {/* Sound switch toggle */}
          <button
            type="button"
            className={`cm-sound-toggle ${soundEnabled ? 'is-active' : ''}`}
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Mute keyboard sound' : 'Unmute keyboard sound'}
            title={soundEnabled ? 'Sound ON (Click to mute)' : 'Sound OFF (Click to unmute)'}
          >
            {soundEnabled ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
            <span className="cm-sound-label">{soundEnabled ? 'Sound' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* ── Quick Question Preset Chips ── */}
      <div className="cm-presets-row" aria-label="Quick questions">
        {QUESTION_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="cm-preset-chip"
            onClick={() => {
              playSwitchAudio('thock');
              handleSubmit(preset.text);
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* ── Question Textarea ── */}
      <div className={`cm-input-wrapper ${isFocused ? 'is-focused' : ''}`}>
        <textarea
          ref={textareaRef}
          className="cm-textarea"
          rows={2}
          value={question}
          maxLength={1000}
          onChange={(e) => {
            setQuestion(e.target.value);
            onActivateAi?.();
          }}
          onFocus={() => {
            setIsFocused(true);
            onActivateAi?.();
          }}
          onClick={() => onActivateAi?.()}
          onBlur={() => setIsFocused(false)}
          placeholder={currentPlaceholder}
          aria-label="Ask a question about Omkar"
        />
        {question.length > 0 && (
          <button
            type="button"
            className="cm-input-clear"
            onClick={() => {
              setQuestion('');
              textareaRef.current?.focus();
            }}
            aria-label="Clear question"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── 3D Tactile Mechanical Keyboard Showcase ── */}
      <div className="cm-keyboard-case" aria-label="Mechanical keyboard visualizer">
        <div className="cm-keyboard-deck">
          {KEYBOARD_LAYOUT.map((row, rIdx) => (
            <div key={`row-${rIdx}`} className="cm-keyboard-row">
              {row.map((k) => {
                const isDown = !!pressedKeys[k.code];
                return (
                  <button
                    key={k.id}
                    type="button"
                    className={`cm-keycap ${isDown ? 'is-pressed' : ''} ${k.isAction ? 'is-modifier' : ''}`}
                    style={{ flex: k.width ?? 1 }}
                    onClick={() => handleVirtualKey(k)}
                    onMouseDown={(e) => e.preventDefault()}
                    tabIndex={-1}
                    aria-label={`Key ${k.label}`}
                  >
                    <span className="cm-key-lip" aria-hidden="true" />
                    <span className="cm-key-face">{k.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Console Action Footer: Ask AI Action ── */}
      <div className="cm-footer">
        <div className="cm-footer-hint">
          <span className="cm-footer-icon">⚡</span>
          <span>Press Enter ↵ or click to ask AI</span>
        </div>

        <button
          type="button"
          className={`cm-send-btn ${question.trim() && !isThinking ? 'is-ready' : ''}`}
          onClick={() => handleSubmit()}
          disabled={!question.trim() || isThinking}
          aria-label="Submit question to Ask Omkar AI"
        >
          {isThinking ? (
            <span>Thinking...</span>
          ) : (
            <>
              <span>Ask AI</span>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 16L16 4M16 4H7M16 4V13" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
