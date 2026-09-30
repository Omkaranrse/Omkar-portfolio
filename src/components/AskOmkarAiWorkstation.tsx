'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import sceneImg from '@/images/home.png';
import WorkstationAtmosphere from './WorkstationAtmosphere';
import type { DragonChatState } from './FlyingDragon';

const FlyingDragon = dynamic(() => import('./FlyingDragon'), { ssr: false });

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

const VerifiedIcon = ({ color = '#38bdf8', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

// ── 01. Placement Config (Retuned with >= 3% clearance above box bottom) ──
// Keyboard x is centered directly to the desktop screen (screen center = 28.9 + 42.8/2 = 50.3%, keyboard center = 29.05 + 42.5/2 = 50.3%)
const SCENE = {
  screen: { x: 28.9, y: 19.4, w: 42.8, h: 37.4 },
  keyboard: { x: 29.05, y: 72.0, w: 42.5, h: 16.5 },
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
  { label: 'Recruiter Quick Facts', prompt: 'What is your total years of experience, notice period, and preferred work mode?' },
  { label: 'Projects & AI Stack', prompt: 'Tell me about DataMind AI and your LangGraph multi-agent pipelines.' },
  { label: 'Flutter & Clean Arch', prompt: 'Tell me about your mobile engineering experience at Metaphi and Clean Architecture.' },
  { label: 'Why Hire Omkar', prompt: 'Why should we hire you and what makes you unique?' },
  { label: 'Download Resume', prompt: 'Can I download your official resume (PDF) and get your contact links?' },
];

const MOBILE_SUGGESTION_CHIPS = [
  { label: '⚡ Recruiter Quick Facts', prompt: 'What is your total years of experience, notice period, and preferred work mode?' },
  { label: '📄 Download Resume', prompt: 'Where can I download your official resume PDF and see your contact links?' },
  { label: '🤖 AI & LangGraph', prompt: 'Tell me about your AI experience with LangGraph, RAG, and multi-agent systems.' },
  { label: '📱 Flutter & Clean Arch', prompt: 'Tell me about your Flutter & mobile development experience and Clean Architecture.' },
  { label: '✉️ Schedule Interview', prompt: 'How can I get in touch with you or schedule an interview?' },
];

function renderInlineMarkdown(str: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = str.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="msg-strong">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="msg-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="msg-link"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

function FormattedMessageText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="msg-list">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    const bulletMatch = trimmed.match(/^([•\-\*]|\d+\.)\s+(.*)$/);
    if (bulletMatch) {
      const content = bulletMatch[2];
      currentList.push(
        <li key={`li-${idx}`} className="msg-list-item">
          <span className="msg-bullet" aria-hidden="true">•</span>
          <span className="msg-item-content">{renderInlineMarkdown(content)}</span>
        </li>
      );
    } else {
      flushList();
      elements.push(
        <p key={`p-${idx}`} className="msg-paragraph">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return <div className="formatted-msg-body">{elements}</div>;
}

function ChatMessageBubble({ msg }: { msg: ChatMessage }) {
  const isAi = msg.role === 'ai';

  return (
    <div
      data-msg-id={msg.id}
      className={`chat-bubble-row ${isAi ? 'is-ai' : 'is-user'}`}
    >
      <div className="chat-bubble">
        {isAi && (
          <div className="bubble-header-row">
            <div className="bubble-avatar" aria-hidden="true">OA</div>
            <div className="bubble-author-col">
              <span className="bubble-author">Omkar Anarse</span>
              <span className="bubble-role-tag">Engineer</span>
            </div>
            <span className="bubble-status-dot" title="Active on portfolio" />
          </div>
        )}
        <div className="bubble-text">
          <FormattedMessageText text={msg.text} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ChatPanel: Rendered EITHER inline in the monitor OR in
// the portal modal (never both simultaneously), guaranteeing
// exactly 1 <textarea> in the DOM.
// ─────────────────────────────────────────────────────────
interface ChatPanelProps {
  isModal: boolean;
  messages: ChatMessage[];
  isThinking: boolean;
  question: string;
  onQuestionChange: (val: string) => void;
  onSubmit: (q?: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  shouldPulseFullscreen: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  isFocused: boolean;
  onFocusChange: (f: boolean) => void;
  onTriggerPulse: () => void;
}

function ChatPanel({
  isModal,
  messages,
  isThinking,
  question,
  onQuestionChange,
  onSubmit,
  soundEnabled,
  onToggleSound,
  isExpanded,
  onToggleExpanded,
  shouldPulseFullscreen,
  textareaRef,
  isFocused,
  onFocusChange,
  onTriggerPulse,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const prevMessagesLength = useRef(messages.length);
  const prevLastAiMsgId = useRef<string | null>(null);

  // Scroll logic adhering to Section 3:
  // 1. On send: scroll to bottom so question + thinking pill are visible.
  // 2. When AI message appears: scroll so the TOP of that answer sits at top of viewport.
  // 3. Do NOT chase bottom while it streams.
  // 4. Show "Latest ↓" button when content extends below.
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const currentLen = messages.length;
    const lastMsg = currentLen > 0 ? messages[currentLen - 1] : null;

    if (currentLen > prevMessagesLength.current) {
      if (lastMsg && lastMsg.role === 'user') {
        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
      }
    }

    if (lastMsg && lastMsg.role === 'ai' && lastMsg.id !== prevLastAiMsgId.current) {
      prevLastAiMsgId.current = lastMsg.id;
      requestAnimationFrame(() => {
        const bubbleEl = scrollEl.querySelector(`[data-msg-id="${lastMsg.id}"]`) as HTMLElement;
        if (bubbleEl) {
          scrollEl.scrollTo({ top: bubbleEl.offsetTop - 8, behavior: 'smooth' });
          if (!isModal && bubbleEl.offsetHeight > scrollEl.clientHeight) {
            onTriggerPulse();
          }
        }
      });
    }

    prevMessagesLength.current = currentLen;
  }, [messages, isModal, onTriggerPulse]);

  useEffect(() => {
    if (isThinking && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [isThinking]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 30);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  const isIdle = messages.length === 0;

  return (
    <div className={`chat-panel-container ${isModal ? 'is-modal-panel' : 'is-inline-panel'}`}>
      {/* ── Title Bar (32px) ── */}
      <div className="mac-window-titlebar">
        {/* Decorative traffic lights */}
        <div className="traffic-lights" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          <span className="traffic-dot red" />
          <span className="traffic-dot yellow" />
          <span className="traffic-dot green" />
        </div>

        {/* Centered window title */}
        <div className="mac-window-title">Omkar AI</div>

        {/* Right Tools: Audio toggle & Exactly ONE Full Screen button */}
        <div className="mac-window-tools">
          <button
            type="button"
            className={`mac-tool-btn ${!soundEnabled ? 'is-muted' : ''}`}
            onClick={onToggleSound}
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
            className={`fullscreen-btn ${shouldPulseFullscreen ? 'should-pulse' : ''}`}
            onClick={onToggleExpanded}
            aria-label={isExpanded ? 'Exit full screen' : 'Open full screen conversation'}
            title={isExpanded ? 'Exit full screen' : 'Open full screen conversation'}
            aria-haspopup="dialog"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
                <span className="fullscreen-btn-label">Exit full screen</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                <span className="fullscreen-btn-label">Full screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Body: Idle Launcher OR Active Chat ── */}
      {isIdle ? (
        <div className="state-a-compact-body">
          <div className="launcher-headline-wrap">
            <div className="launcher-text-col">
              <h2 className="launcher-title">Ask anything about Omkar.</h2>
              <p className="launcher-subtitle">Projects, stack, experience, roles.</p>
            </div>
          </div>

          <div
            className={`compact-query-box ${isFocused ? 'is-focused' : ''}`}
            onClick={() => textareaRef.current?.focus()}
          >
            <div className="compact-textarea-wrap">
              <textarea
                ref={textareaRef}
                rows={1}
                className="compact-textarea"
                placeholder="Type via keyboard or click preset below"
                value={question}
                onChange={(e) => onQuestionChange(e.target.value)}
                onFocus={() => onFocusChange(true)}
                onBlur={() => onFocusChange(false)}
                aria-label="Ask Omkar AI a question"
              />
            </div>

            <button
              type="button"
              className="compact-send-btn"
              onClick={() => onSubmit()}
              disabled={!question.trim() || isThinking}
              aria-label="Send message"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          <div className="compact-chips-row">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={`preset-${idx}`}
                type="button"
                className="compact-chip-pill"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit(p.prompt);
                }}
                disabled={isThinking}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="active-chat-body">
          {/* Scrollable message thread (the ONLY scroll region) */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="chat-messages-viewport"
          >
            <div className="messages-thread">
              {messages.map((msg) => (
                <ChatMessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Thinking Pill */}
              {isThinking && (
                <div className="chat-bubble-row is-ai">
                  <div className="chat-bubble is-thinking-bubble">
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                    <span className="thinking-text">{isModal ? 'Retrieving knowledge base...' : 'Thinking…'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Latest Button */}
            {showScrollBottom && (
              <button
                type="button"
                className="scroll-latest-btn"
                onClick={() => scrollToBottom(true)}
                aria-label="Scroll to latest messages"
              >
                <span>Latest</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Pinned Query Input Row (min 44px) */}
          <div className="chat-input-pinned-row">
            <div
              className={`compact-query-box ${isFocused ? 'is-focused' : ''}`}
              onClick={() => textareaRef.current?.focus()}
            >
              <div className="compact-textarea-wrap">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  className="compact-textarea"
                  placeholder="Ask a follow-up or type..."
                  value={question}
                  onChange={(e) => onQuestionChange(e.target.value)}
                  onFocus={() => onFocusChange(true)}
                  onBlur={() => onFocusChange(false)}
                  aria-label="Ask Omkar AI a question"
                />
              </div>

              <button
                type="button"
                className="compact-send-btn"
                onClick={() => onSubmit()}
                disabled={!question.trim() || isThinking}
                aria-label="Send message"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chips Row (single line, horizontal scroll, hidden via @container (max-height: 240px)) */}
          <div className="compact-chips-row">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={`preset-${idx}`}
                type="button"
                className="compact-chip-pill"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit(p.prompt);
                }}
                disabled={isThinking}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Component: AskOmkarAiWorkstation
// ─────────────────────────────────────────────────────────
export default function AskOmkarAiWorkstation({
  messages,
  isThinking,
  onSendQuestion,
  onBack,
}: AskOmkarAiWorkstationProps) {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  const [isFocused, setIsFocused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [knobRotation, setKnobRotation] = useState(0);
  const [mounted, setMounted] = useState(false);
  const mobileChatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileChatScrollRef.current) {
      mobileChatScrollRef.current.scrollTop = mobileChatScrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // State B (Expanded Modal Window)
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldPulseFullscreen, setShouldPulseFullscreen] = useState(false);
  const [hasPulsed, setHasPulsed] = useState(false);

  // Debug mode (?debug=1, only when process.env.NODE_ENV !== 'production')
  const [isDebug, setIsDebug] = useState(false);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number }>({
    w: sceneImg.width || 1672,
    h: sceneImg.height || 941,
  });
  const [railIntersects, setRailIntersects] = useState(false);

  const screenRectRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const savedCaretPos = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  // 3D Flying Dragon Chat State
  const [isFinishedSwoop, setIsFinishedSwoop] = useState(false);
  const prevThinkingRef = useRef(isThinking);

  // Transition from streaming to finished victory swoop (1.5s)
  useEffect(() => {
    if (prevThinkingRef.current && !isThinking) {
      setIsFinishedSwoop(true);
      const timer = setTimeout(() => {
        setIsFinishedSwoop(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
    prevThinkingRef.current = isThinking;
  }, [isThinking]);

  // Unified dragon flight state
  const dragonChatState: DragonChatState = useMemo(() => {
    if (isThinking) return 'streaming';
    if (isFinishedSwoop) return 'finished';
    if (isFocused || question.length > 0 || Object.keys(pressedKeys).length > 0) return 'typing';
    return 'idle';
  }, [isThinking, isFinishedSwoop, isFocused, question.length, pressedKeys]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dev-only assertion: exactly 1 textarea in DOM at all times
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const textareas = document.querySelectorAll('textarea');
      if (textareas.length !== 1) {
        console.warn(`[Dev Assertion] Expected exactly 1 textarea in DOM, found ${textareas.length}`);
      }
    }
  });

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

  // Open & Close handlers for State B with focus & caret preservation
  const handleToggleExpanded = useCallback(() => {
    if (textareaRef.current) {
      savedCaretPos.current = {
        start: textareaRef.current.selectionStart || 0,
        end: textareaRef.current.selectionEnd || 0,
      };
    }
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    if (textareaRef.current) {
      savedCaretPos.current = {
        start: textareaRef.current.selectionStart || 0,
        end: textareaRef.current.selectionEnd || 0,
      };
    }
    setIsExpanded(false);
  }, []);

  const triggerPulse = useCallback(() => {
    if (!hasPulsed) {
      setShouldPulseFullscreen(true);
      setHasPulsed(true);
    }
  }, [hasPulsed]);

  // Caret, scroll lock, focus trap, and inert handling across toggle
  useEffect(() => {
    const t = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        try {
          textareaRef.current.setSelectionRange(
            savedCaretPos.current.start,
            savedCaretPos.current.end
          );
        } catch {
          // Ignore range errors
        }
      }
    }, 40);

    // Set inert on <main> and the social rail while modal is open
    const mainEl = document.querySelector('main');
    const rail = document.querySelector('.social-rail');
    if (mainEl) {
      if (isExpanded) mainEl.setAttribute('inert', '');
      else mainEl.removeAttribute('inert');
    }
    if (rail) {
      if (isExpanded) rail.setAttribute('inert', '');
      else rail.removeAttribute('inert');
    }

    if (isExpanded) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

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
        if (mainEl) mainEl.removeAttribute('inert');
        if (rail) rail.removeAttribute('inert');
        clearTimeout(t);
      };
    }

    return () => clearTimeout(t);
  }, [isExpanded]);

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

  // Submit Handler: Inline default (NO auto-open on first send)
  const handleSubmit = useCallback(
    (customQuery?: string) => {
      const q = (customQuery ?? question).trim();
      if (!q || isThinking) return;

      playSwitchAudio('press', 'enter');
      onSendQuestion(q);
      setQuestion('');

      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    },
    [question, isThinking, onSendQuestion, playSwitchAudio]
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
        // Physical Escape lights the Clear keycap; if in modal it closes modal, otherwise clears input
        if (isExpanded) {
          handleCloseExpanded();
        } else {
          setQuestion('');
          if (textareaRef.current) textareaRef.current.value = '';
        }
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        if (document.activeElement === textareaRef.current) {
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
  }, [playSwitchAudio, handleSubmit, isExpanded, handleCloseExpanded]);

  // Cursor-aware text insertion for virtual keyboard
  const insertTextAtCursor = useCallback(
    (textToInsert: string) => {
      const target = textareaRef.current;
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
    []
  );

  const backspaceAtCursor = useCallback(() => {
    const target = textareaRef.current;
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
  }, []);

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
      if (isExpanded) {
        handleCloseExpanded();
      } else {
        setQuestion('');
        if (textareaRef.current) textareaRef.current.value = '';
      }
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

  const imageRatio = imgNatural.w / imgNatural.h;
  const isRatioOff = Math.abs(imageRatio - 16 / 9) > 0.02;
  const bottomClearance = (100 - (SCENE.keyboard.y + SCENE.keyboard.h)).toFixed(1);

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
            <div>Keyboard bottom clearance: {bottomClearance}% (safe &gt;= 3%)</div>
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

        {/* 16:9 Cover Box (Desktop View >= 769px) */}
        <div className="workstation-desktop-view">
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

          {/* ── Lively Ambient Atmosphere (Sunbeams, Fairy Lights, Orb Lamp Glow, Dust Motes) ── */}
          <WorkstationAtmosphere />

          {/* ── 3D Flying Dragon Layer (Full-viewport fixed Canvas, above background, behind UI) ── */}
          {mounted && <FlyingDragon chatState={dragonChatState} />}

          {/* ── .mac-screen (Starts at top edge, 6px corners, NO onClick handler on container) ── */}
          <div
            ref={screenRectRef}
            className={`mac-screen ${isDebug ? 'debug-outline' : ''}`}
            style={{
              left: `${SCENE.screen.x}%`,
              top: `${SCENE.screen.y}%`,
              width: `${SCENE.screen.w}%`,
              height: `${SCENE.screen.h}%`,
            }}
          >
            {/* Subtle Glass Reflection */}
            <div className="mac-screen-glass-reflection" aria-hidden="true" />

            {/* Window Frame: Starts right at top edge with title bar */}
            <div className="mac-screen-window-frame">
              {/* Only render ChatPanel inline when NOT expanded */}
              {!isExpanded ? (
                <ChatPanel
                  isModal={false}
                  messages={messages}
                  isThinking={isThinking}
                  question={question}
                  onQuestionChange={setQuestion}
                  onSubmit={handleSubmit}
                  soundEnabled={soundEnabled}
                  onToggleSound={() => setSoundEnabled((p) => !p)}
                  isExpanded={false}
                  onToggleExpanded={handleToggleExpanded}
                  shouldPulseFullscreen={shouldPulseFullscreen}
                  textareaRef={textareaRef}
                  isFocused={isFocused}
                  onFocusChange={setIsFocused}
                  onTriggerPulse={triggerPulse}
                />
              ) : (
                <div className="monitor-expanded-placeholder" aria-hidden="true">
                  <div className="placeholder-content">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    <span>Viewing in full screen</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── .keyboard-wrap (Keyboard with >= 3% clearance above bottom) ── */}
          <div
            className={`keyboard-wrap ${isDebug ? 'debug-outline' : ''}`}
            style={{
              left: `${SCENE.keyboard.x}%`,
              top: `${SCENE.keyboard.y}%`,
              width: `${SCENE.keyboard.w}%`,
            }}
          >
            {/* Brushed aluminium case shell with extruded lower edge & contact shadow */}
            <div
              className="keyboard-case-shell"
              role="application"
              aria-label="Mechanical keyboard 75 percent layout"
            >
              {/* Integrated Top Strip */}
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
                          className={`cm-keycap ${isDown ? 'is-pressed' : ''} ${k.isAction ? 'is-modifier' : ''
                            } ${k.variant ? `variant-${k.variant}` : ''} ${isShiftLit ? 'is-shift-lit' : ''
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
      </div>

        {/* ── 02. DEDICATED MOBILE CHAT INTERFACE (<768px, Matching Reference Screenshot) ── */}
        <div className="workstation-mobile-view">
          <div className="mobile-messenger-screen">
            {/* Header (Matching Reference Screenshot) */}
            <header className="mobile-messenger-header">
              <div className="mobile-messenger-avatar-wrap">
                <div className="mobile-messenger-avatar-disc">
                  <Image
                    src="/images/avatar.png"
                    alt="Omkar Anarse"
                    width={46}
                    height={46}
                    unoptimized
                    priority
                    className="mobile-messenger-avatar-img"
                  />
                </div>
                <span className="mobile-messenger-online-badge" />
              </div>

              <div className="mobile-messenger-info">
                <div className="mobile-messenger-title-row">
                  <span className="mobile-messenger-name">Omkar Anarse</span>
                  <VerifiedIcon color="#38bdf8" size={15} />
                </div>
                <div className="mobile-messenger-subtitle">
                  @omkaranarse · online · AI &amp; Mobile
                </div>
              </div>

              <button
                type="button"
                className="mobile-messenger-close-btn"
                onClick={() => (onBack ? onBack() : router.push('/'))}
                aria-label="Exit Chat"
              >
                <CloseIcon color="#ffffff" size={16} />
              </button>
            </header>

            {/* Chat Thread Canvas with Dot-Matrix Pattern */}
            <div ref={mobileChatScrollRef} className="mobile-messenger-thread">
              {messages.map((m) => {
                const isAi = m.role === 'ai';
                return (
                  <div key={m.id} className={`mobile-msg-row ${isAi ? 'is-ai' : 'is-user'}`}>
                    {/* Message Bubble Card */}
                    <div className="mobile-msg-bubble">
                      <div className="mobile-msg-text">
                        <FormattedMessageText text={m.text} />
                      </div>
                    </div>

                    {/* Metadata: mini avatar (for AI), timestamp and checkmarks */}
                    <div className="mobile-msg-meta">
                      {isAi && (
                        <div className="mobile-msg-mini-avatar">
                          <Image
                            src="/images/avatar.png"
                            alt="Omkar"
                            width={22}
                            height={22}
                            unoptimized
                          />
                        </div>
                      )}
                      <span className="mobile-msg-time">{m.time || '00:08'}</span>
                      <SeenIcon color="#ea580c" />
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="mobile-msg-row is-ai">
                  <div className="mobile-msg-bubble is-thinking">
                    <div className="typing-dots">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                  <div className="mobile-msg-meta">
                    <div className="mobile-msg-mini-avatar">
                      <Image
                        src="/images/avatar.png"
                        alt="Omkar"
                        width={22}
                        height={22}
                        unoptimized
                      />
                    </div>
                    <span className="mobile-msg-time">typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Pills / Chips Shelf */}
            <div className="mobile-messenger-chips-shelf">
              {MOBILE_SUGGESTION_CHIPS.map((p, idx) => (
                <button
                  key={`m-chip-${idx}`}
                  type="button"
                  className="mobile-messenger-chip"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(p.prompt);
                  }}
                  disabled={isThinking}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Floating Input Bar */}
            <div className="mobile-messenger-input-bar">
              <span className="mobile-messenger-sparkle" aria-hidden="true">
                ✨
              </span>
              <div className="mobile-messenger-input-pill">
                <input
                  type="text"
                  className="mobile-messenger-input"
                  placeholder="Ask Omkar AI a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  disabled={isThinking}
                />
              </div>
              <button
                type="button"
                className="mobile-messenger-send-btn"
                onClick={() => handleSubmit()}
                disabled={!question.trim() || isThinking}
                aria-label="Send question"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Subtle Footer Link */}
            <div className="mobile-messenger-footer">
              <button
                type="button"
                className="mobile-messenger-footer-link"
                onClick={handleToggleExpanded}
              >
                Open in <span>Ask Omkar AI Workstation ↗</span>
              </button>
            </div>
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
          aria-label="Full screen AI conversation"
        >
          <div
            className="state-b-window"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Exactly ONE ChatPanel rendered in the portal when isExpanded is true */}
            <ChatPanel
              isModal={true}
              messages={messages}
              isThinking={isThinking}
              question={question}
              onQuestionChange={setQuestion}
              onSubmit={handleSubmit}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((p) => !p)}
              isExpanded={true}
              onToggleExpanded={handleCloseExpanded}
              shouldPulseFullscreen={false}
              textareaRef={textareaRef}
              isFocused={isFocused}
              onFocusChange={setIsFocused}
              onTriggerPulse={triggerPulse}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
