'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ── Icons ────────────────────────────────────────────────────
const SendIcon = ({ color = '#ffffff' }: { color?: string }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = ({ color = '#ffffff', size = 18 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </svg>
);

const SeenIcon = ({ color = '#ea580c' }: { color?: string }) => (
  <svg width={16} height={11} viewBox="0 0 16 11" fill="none">
    <path d="M1 5.5L4.5 9L10 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 5.5L9.5 9L15 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VerifiedIcon = ({ color = '#ffffff', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Widget Configuration ─────────────────────────────────────
const WIDGET_BG = `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='28' height='28' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='14' cy='14' r='0.9' fill='%23d1d5db' opacity='0.55'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='%23f9fafb'/%3E%3Crect width='400' height='400' fill='url(%23p)'/%3E%3C/svg%3E")`;

const ACCENT_COLOR = '#ea580c';
const GRADIENT_END = '#c2410c';
const HEADER_GRADIENT = `linear-gradient(140deg, #18181b 0%, #27272a 100%)`;

const QUICK_REPLIES = [
  { emoji: '⚡', label: 'Recruiter Quick Facts', message: 'What is your total years of experience, notice period, and preferred work mode?' },
  { emoji: '📄', label: 'Download Resume', message: 'Can I download your official resume (PDF)?' },
  { emoji: '🤖', label: 'AI & LangGraph', message: 'How did you build DataMind AI and your autonomous LangGraph pipelines?' },
  { emoji: '📱', label: 'Flutter & Clean Arch', message: 'Tell me about your mobile development experience in Flutter, Riverpod, and Clean Architecture.' },
  { emoji: '✉️', label: 'Schedule Interview', message: 'How can we schedule a call or interview to discuss career opportunities?' },
  { emoji: '🚀', label: '3D Workstation', message: 'Take me to your interactive 3D AI workstation.' },
];

export default function FloatingAvatarChatWidget() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [msgTime, setMsgTime] = useState('00:00');
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [thoughtTagIndex, setThoughtTagIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(0);
  const uid = 'tg-widget';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle rotating thought tags in the popup
  const thoughtTags = ['Hey! 👋', 'Flutter 📱', 'Next.js ⚡', 'AI Engineer 🤖', 'Ask about me 💬'];

  useEffect(() => {
    const t = setInterval(() => {
      setThoughtTagIndex((prev) => (prev + 1) % thoughtTags.length);
    }, 2400);
    return () => clearInterval(t);
  }, [thoughtTags.length]);

  // Entrance delay
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Popup thought preview delay (pops up after 2.5s if not opened or dismissed)
  useEffect(() => {
    if (!popupDismissed && !isOpen) {
      const t = setTimeout(() => setShowPopup(true), 2500);
      return () => clearTimeout(t);
    }
  }, [popupDismissed, isOpen]);

  // Handle open / typing indicator simulation
  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
      setShowPopup(false);
      secondsRef.current = 0;

      const startTimer = () => {
        timerRef.current = setInterval(() => {
          secondsRef.current += 1;
          const m = Math.floor(secondsRef.current / 60)
            .toString()
            .padStart(2, '0');
          const s = (secondsRef.current % 60).toString().padStart(2, '0');
          setMsgTime(`${m}:${s}`);
        }, 1000);
      };

      setShowTyping(true);
      setGreetingVisible(false);
      startTimer();

      const t = setTimeout(() => {
        setShowTyping(false);
        setGreetingVisible(true);
      }, 1200);

      setTimeout(() => inputRef.current?.focus(), 400);

      return () => {
        clearTimeout(t);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setShowTyping(false);
      setGreetingVisible(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  // Do not render during SSR or on the /ask-ai page itself to prevent overlap/hydration errors
  if (!mounted || pathname === '/ask-ai') {
    return null;
  }

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleDismissPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
    setPopupDismissed(true);
  };

  const navigateToAskAi = () => {
    setIsOpen(false);
    router.push('/ask-ai');
  };

  const handleSend = () => {
    const q = inputValue.trim();
    setIsOpen(false);
    setInputValue('');
    if (q) {
      router.push(`/ask-ai?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/ask-ai');
    }
  };

  const handleQuickReply = (qr: (typeof QUICK_REPLIES)[0]) => {
    setIsOpen(false);
    router.push(`/ask-ai?q=${encodeURIComponent(qr.message)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div
      className="fixed-telegram-widget-root"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
      }}
    >
      {/* ── 01. Thought Popup Speech Card (Appears above the head) ── */}
      {showPopup && !isOpen && (
        <div
          onClick={handleOpen}
          className="widget-preview-popup"
          style={{
            position: 'absolute',
            bottom: 76,
            right: 0,
            width: 310,
            background: '#ffffff',
            borderRadius: 18,
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            overflow: 'hidden',
            animation: `${uid}-popup-in 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
            willChange: 'transform, opacity',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: HEADER_GRADIENT,
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  background: '#27272a',
                }}
              >
                <Image
                  src="/images/avatar.png"
                  alt="Omkar Anarse"
                  width={36}
                  height={36}
                  unoptimized
                  priority
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid white',
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>Omkar Anarse</span>
                <VerifiedIcon color="#38bdf8" size={13} />
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 11 }}>
                @omkaranarse · AI Assistant
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismissPopup}
              aria-label="Dismiss thought popup"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
            >
              <CloseIcon size={12} />
            </button>
          </div>

          {/* Thought Message Body */}
          <div style={{ padding: '13px 14px 14px', backgroundImage: WIDGET_BG, backgroundSize: 'cover' }}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: '4px 16px 16px 16px',
                padding: '10px 13px',
                fontSize: 13.5,
                lineHeight: 1.5,
                color: '#18181b',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.07)',
                display: 'inline-block',
                maxWidth: '100%',
              }}
            >
              <div style={{ fontWeight: 600, color: '#ea580c', marginBottom: 2 }}>
                {thoughtTags[thoughtTagIndex]}
              </div>
              Hey! Got questions about my projects or experience? Tap to chat with my AI assistant!
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 11.5,
                fontWeight: 600,
                color: '#ea580c',
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 4,
              }}
            >
              <span>Tap to open chat</span>
              <span>→</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 02. Expanded Interactive Chat Drawer ── */}
      <div
        className="widget-chat-drawer"
        style={{
          position: 'absolute',
          bottom: 76,
          right: 0,
          width: 360,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: isOpen
            ? '0 24px 72px rgba(0, 0, 0, 0.22), 0 8px 24px rgba(0, 0, 0, 0.1)'
            : 'none',
          background: '#ffffff',
          transformOrigin: 'bottom right',
          transform: isOpen ? 'scale(1) translateY(0px)' : 'scale(0.72) translateY(24px)',
          opacity: isOpen ? 1 : 0,
          filter: isOpen ? 'blur(0px)' : 'blur(6px)',
          pointerEvents: isOpen ? 'all' : 'none',
          transition: isOpen
            ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease, filter 0.28s ease, box-shadow 0.3s ease'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease, filter 0.22s ease',
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            background: HEADER_GRADIENT,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid rgba(255, 255, 255, 0.55)',
                background: '#27272a',
              }}
            >
              <Image
                src="/images/avatar.png"
                alt="Omkar Anarse"
                width={46}
                height={46}
                unoptimized
                priority
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 1,
                right: 1,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#10B981',
                border: '2.5px solid white',
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 15,
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>Omkar Anarse</span>
              <VerifiedIcon color="#38bdf8" size={14} />
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.82)',
                fontSize: 12,
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>@omkaranarse · online · AI &amp; Mobile</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close chat window"
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Message Thread Area */}
        <div
          style={{
            backgroundImage: WIDGET_BG,
            backgroundSize: 'cover',
            padding: '16px 14px',
            minHeight: 220,
            maxHeight: 320,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Simulated Typing Indicator */}
          {showTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#27272a',
                }}
              >
                <Image
                  src="/images/avatar.png"
                  alt="Omkar"
                  width={30}
                  height={30}
                  unoptimized
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '4px 18px 18px 18px',
                  padding: '11px 16px',
                  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  animation: `${uid}-msg-in 0.3s ease forwards`,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#9ca3af',
                    animation: `${uid}-dot 1.2s ease-in-out 0s infinite`,
                  }}
                />
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#9ca3af',
                    animation: `${uid}-dot 1.2s ease-in-out 0.2s infinite`,
                  }}
                />
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#9ca3af',
                    animation: `${uid}-dot 1.2s ease-in-out 0.4s infinite`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Assistant Greeting Message */}
          {greetingVisible && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                animation: `${uid}-msg-in 0.38s cubic-bezier(0.34, 1.2, 0.64, 1) forwards`,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#27272a',
                }}
              >
                <Image
                  src="/images/avatar.png"
                  alt="Omkar"
                  width={30}
                  height={30}
                  unoptimized
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ maxWidth: 265 }}>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '4px 18px 18px 18px',
                    padding: '11px 14px',
                    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.08)',
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: '#18181b',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {`Hey! 👋 Myself Omkar Anarse.

I build mobile systems (Flutter), modern web (Next.js 15), and autonomous AI pipelines with LangGraph.

Ask me anything or select a topic below!`}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 4,
                    paddingLeft: 4,
                  }}
                >
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{msgTime}</span>
                  <SeenIcon color={ACCENT_COLOR} />
                </div>
              </div>
            </div>
          )}

          {/* Quick Replies Options */}
          {greetingVisible && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
                marginTop: 4,
                animation: `${uid}-msg-in 0.42s cubic-bezier(0.34, 1.2, 0.64, 1) 0.1s both`,
              }}
            >
              {QUICK_REPLIES.map((qr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickReply(qr)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 22,
                    padding: '8px 15px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT_COLOR}, ${GRADIENT_END})`;
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(4px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 88, 12, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#1f2937';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateX(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{qr.emoji}</span>
                  <span>{qr.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div
          style={{
            background: '#ffffff',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              fontSize: 20,
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0,
              transition: 'transform 0.2s',
            }}
            onClick={() => setInputValue((prev) => prev + '✨ ')}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Add Sparkle"
          >
            ✨
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Omkar AI a question..."
            style={{
              flex: 1,
              border: '1.5px solid #e5e7eb',
              borderRadius: 22,
              padding: '8px 14px',
              fontSize: 13.5,
              background: '#f9fafb',
              outline: 'none',
              color: '#111827',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = ACCENT_COLOR;
              e.currentTarget.style.background = '#ffffff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.background = '#f9fafb';
            }}
          />

          <button
            type="button"
            onClick={handleSend}
            aria-label="Send message to Ask AI"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: inputValue.trim()
                ? `linear-gradient(135deg, ${ACCENT_COLOR}, ${GRADIENT_END})`
                : '#e5e7eb',
              border: 'none',
              cursor: inputValue.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition:
                'background 0.22s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
              boxShadow: inputValue.trim() ? `0 4px 14px rgba(234, 88, 12, 0.4)` : 'none',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim()) e.currentTarget.style.transform = 'scale(1.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <SendIcon color="#ffffff" />
          </button>
        </div>

        {/* Footer Link */}
        <div
          onClick={navigateToAskAi}
          style={{
            background: '#ffffff',
            textAlign: 'center',
            padding: '7px 0 9px',
            fontSize: 11.5,
            color: '#9ca3af',
            borderTop: '1px solid #f3f4f6',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
        >
          Open in{' '}
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT_COLOR}, ${GRADIENT_END})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Ask Omkar AI Workstation ↗
          </span>
        </div>
      </div>

      {/* ── 03. Main Floating Avatar Launcher Button ── */}
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Continuous Framer PulseButton Ripple Rings (when closed) */}
        {!isOpen && isVisible && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`framer-ripple-ring-${i}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(234, 88, 12, 0.22)',
                  border: '2px solid rgba(234, 88, 12, 0.75)',
                  boxShadow: '0 0 16px rgba(234, 88, 12, 0.45)',
                  zIndex: 0,
                  pointerEvents: 'none',
                  willChange: 'transform, opacity',
                  transformOrigin: 'center center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                transformTemplate={(_, generated) => `translateZ(0px) ${generated}`}
                initial={{ scale: 1, opacity: 0.75 }}
                animate={{ scale: 1.85, opacity: 0 }}
                transition={{
                  duration: 2.4,
                  ease: 'easeOut',
                  repeat: Infinity,
                  repeatDelay: 0,
                  delay: i * 0.8,
                }}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={isOpen ? handleClose : handleOpen}
          aria-label={isOpen ? 'Close chat' : 'Open Omkar AI Chat'}
          style={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            background: isOpen
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : `linear-gradient(135deg, #18181b, #27272a)`,
            border: '2.5px solid rgba(255, 255, 255, 0.95)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isOpen
              ? '0 8px 28px rgba(220, 38, 38, 0.45)'
              : '0 10px 30px rgba(0, 0, 0, 0.28), 0 0 0 2px #ea580c, 0 0 16px rgba(234, 88, 12, 0.35)',
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            opacity: isVisible ? 1 : 0,
            transition:
              'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, background 0.4s ease, box-shadow 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            willChange: 'transform',
            zIndex: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {/* Ripple on open */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              transform: 'scale(0)',
              animation: isOpen ? `${uid}-ripple 0.4s ease-out forwards` : 'none',
              pointerEvents: 'none',
            }}
          />

          {/* Avatar Icon (when closed) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
              transform: isOpen ? 'rotate(-90deg) scale(0.3)' : 'rotate(0deg) scale(1)',
              opacity: isOpen ? 0 : 1,
              pointerEvents: 'none',
            }}
          >
            <Image
              src="/images/avatar.png"
              alt="Omkar Anarse AI"
              width={54}
              height={54}
              unoptimized
              priority
              style={{
                width: 52,
                height: 52,
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
              }}
            />
          </div>

          {/* Close Icon (when open) */}
          <div
            style={{
              position: 'absolute',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
              transform: isOpen ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.3)',
              opacity: isOpen ? 1 : 0,
              pointerEvents: 'none',
            }}
          >
            <CloseIcon color="#ffffff" size={24} />
          </div>
        </button>

        {/* Notification Badge */}
        {!isOpen && showBadge && (
          <div
            style={{
              position: 'absolute',
              top: -3,
              right: -3,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              background: '#ef4444',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5px',
              border: '2.5px solid #ffffff',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.55)',
              pointerEvents: 'none',
              zIndex: 1,
              animation: `${uid}-badge-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s both`,
            }}
          >
            1
          </div>
        )}
      </div>

      {/* ── Keyframe Animations ── */}
      <style>{`
        @keyframes ${uid}-pulse {
          0%   { transform: scale(1); opacity: 0.6; }
          70%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes ${uid}-ripple {
          0%   { transform: scale(0); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes ${uid}-badge-pop {
          0%   { transform: scale(0) rotate(-20deg); }
          70%  { transform: scale(1.25) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes ${uid}-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%           { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes ${uid}-msg-in {
          from { transform: translateY(12px) scale(0.95); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes ${uid}-popup-in {
          from { transform: translateY(18px) scale(0.88); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }

        @media (max-width: 640px) {
          .fixed-telegram-widget-root {
            bottom: 16px !important;
            right: 16px !important;
          }
          .widget-chat-drawer {
            width: calc(100vw - 32px) !important;
            max-width: 360px !important;
          }
          .widget-preview-popup {
            width: calc(100vw - 32px) !important;
            max-width: 310px !important;
          }
        }
      `}</style>
    </div>
  );
}
