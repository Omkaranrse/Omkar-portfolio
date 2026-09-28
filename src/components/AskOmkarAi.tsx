'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  source?: string;
  time?: string;
}

interface AskOmkarAiProps {
  isActive: boolean;
  messages: ChatMessage[];
  isThinking: boolean;
  onReset: () => void;
  onSendQuestion: (q: string) => void;
}

const SUGGESTED_QUESTIONS = [
  'Tell me about Attendephi',
  'What technologies does Omkar use?',
  'What AI projects has Omkar built?',
  'What roles is Omkar looking for?',
];

export default function AskOmkarAi({
  isActive,
  messages,
  isThinking,
  onReset,
  onSendQuestion,
}: AskOmkarAiProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Check scroll position to show/hide "Scroll to bottom" button
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 50;
    setShowScrollBottom(isScrolledUp);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Smooth scroll to bottom whenever messages or thinking state updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isThinking]);

  return (
    <div
      className={`ai-chat-console ${isActive ? 'is-active' : ''}`}
      aria-live="polite"
      aria-label="Ask Omkar AI Conversation Console"
    >
      {/* ── Top Bar: Status Beacon, Title, Subtitle & Reset / Back Control ── */}
      <div className="ai-chat-header">
        <div className="ai-chat-header-main">
          <div className="ai-chat-badge">
            <span className="ai-chat-beacon" aria-hidden="true" />
            <span className="ai-chat-eyebrow">ASK OMKAR AI</span>
          </div>
          <p className="ai-chat-subtitle">Ask me anything about my work, stack, or experience.</p>
        </div>

        <button
          type="button"
          className="ai-chat-back-btn"
          onClick={onReset}
          aria-label="Reset conversation"
          title="Reset conversation"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* ── Middle: Fixed-Height Scrollable Conversation Area ── */}
      <div
        className="ai-chat-stream"
        ref={scrollRef}
        onScroll={handleScroll}
        tabIndex={0}
        aria-label="Conversation message list"
      >
        {messages.length === 0 ? (
          /* Welcome state before first question */
          <div className="ai-chat-welcome-state">
            <div className="ai-welcome-badge">
              <span className="ai-welcome-spark">✦</span>
            </div>
            <p className="ai-welcome-title">Ask me anything about Omkar</p>
            <p className="ai-welcome-sub">
              Click a suggested question below or type using the console on the right.
            </p>
          </div>
        ) : (
          /* Conversation Loop: Stacked Q&A */
          <div className="ai-messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-message-row is-${msg.role}`}
              >
                <div className="ai-message-meta">
                  <div className="ai-message-sender">
                    <span className="ai-message-avatar" aria-hidden="true">
                      {msg.role === 'user' ? '👤' : '✦'}
                    </span>
                    <span className="ai-message-role-tag">
                      {msg.role === 'user' ? 'YOU' : 'OMKAR AI'}
                    </span>
                  </div>
                  {msg.time && <span className="ai-message-time">{msg.time}</span>}
                </div>

                <div className="ai-message-body">
                  <p className="ai-message-text">{msg.text}</p>

                  {/* Source Attribution Pill */}
                  {msg.role === 'ai' && msg.source && msg.text.length > 0 && (
                    <div className="ai-source-attribution">
                      <span className="ai-source-prefix">Based on:</span>
                      <span className="ai-source-tag">{msg.source}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking / Streaming Indicator */}
            {isThinking && messages[messages.length - 1]?.role !== 'ai' && (
              <div className="ai-message-row is-ai is-thinking">
                <div className="ai-message-meta">
                  <div className="ai-message-sender">
                    <span className="ai-message-avatar">✦</span>
                    <span className="ai-message-role-tag">OMKAR AI</span>
                  </div>
                </div>
                <div className="ai-message-body">
                  <div className="ai-thinking-pill">
                    <span className="ai-dot-pulse" />
                    <span className="ai-dot-pulse" />
                    <span className="ai-dot-pulse" />
                    <span className="ai-thinking-label">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating jump to latest button */}
        {showScrollBottom && (
          <button
            type="button"
            className="ai-scroll-bottom-btn"
            onClick={scrollToBottom}
            aria-label="Scroll to latest messages"
          >
            <span>↓ Latest</span>
          </button>
        )}
      </div>

      {/* ── Bottom: 2x2 Suggested Questions Grid (Matching Reference Image 2) ── */}
      <div className="ai-suggested-bottom-dock">
        <span className="ai-suggested-eyebrow">SUGGESTED QUESTIONS</span>
        <div className="ai-suggested-2x2-grid">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              className="ai-suggested-item"
              onClick={() => onSendQuestion(question)}
            >
              <span className="ai-suggested-text">{question}</span>
              <span className="ai-suggested-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
