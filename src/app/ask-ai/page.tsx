'use client';

import { useState, useCallback } from 'react';
import Nav from '@/components/Nav';
import AskOmkarAiWorkstation, { ChatMessage } from '@/components/AskOmkarAiWorkstation';
import BackButton, { useSmartBack } from '@/components/BackButton';
import SocialDock from '@/components/SocialDock';

export default function AskAiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const handleSmartBack = useSmartBack('/#contact');

  const handleSendQuestion = useCallback(
    async (queryText: string) => {
      const q = queryText.trim();
      if (!q || isThinking) return;

      const timeString = new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });

      const userMsgId = `user-${Date.now()}`;
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: 'user',
        text: q,
        time: timeString,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      try {
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q,
            history: messages.map((m) => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
          }),
        });

        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              role: 'ai',
              text: 'Rate limit reached. Please wait a moment before sending another question.',
              time: timeString,
            },
          ]);
          setIsThinking(false);
          return;
        }

        const data = await res.json();
        const aiAnswer = data.answer || "I don't have that information in my portfolio knowledge base.";
        const aiSource = data.source;

        const aiMsgId = `ai-${Date.now()}`;
        const newAiMsg: ChatMessage = {
          id: aiMsgId,
          role: 'ai',
          text: '',
          source: aiSource,
          time: timeString,
        };

        setMessages((prev) => [...prev, newAiMsg]);

        let currentLen = 0;
        const totalLen = aiAnswer.length;
        const chunkSize = Math.max(3, Math.floor(totalLen / 25));

        const interval = setInterval(() => {
          currentLen += chunkSize;
          if (currentLen >= totalLen) {
            clearInterval(interval);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMsgId ? { ...msg, text: aiAnswer } : msg
              )
            );
            setIsThinking(false);
          } else {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMsgId
                  ? { ...msg, text: aiAnswer.slice(0, currentLen) }
                  : msg
              )
            );
          }
        }, 16);
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'ai',
            text: "I don't have that information in my portfolio knowledge base.",
            time: timeString,
          },
        ]);
        setIsThinking(false);
      }
    },
    [isThinking, messages]
  );

  return (
    <>
      <Nav />

      <main id="main" className="ai-standalone-page">
        {/* Normal-flow Header: Back pill at top-left, centered headline */}
        <div className="ai-page-header-wrap">
          <div className="ask-ai-top-nav">
            <BackButton fallbackHref="/#contact" label="Back" />
          </div>

          <div className="ai-headline-block">
            <span className="ai-eyebrow">ASK OMKAR AI</span>
            <h1 className="ai-title">Ask anything about Omkar.</h1>
            <p className="ai-sub">
              Ask about projects, engineering stack, work experience, or roles wanted.
              <br />
              Powered by portfolio vector retrieval and interactive mechanical input.
            </p>
          </div>
        </div>

        {/* ── Full-Bleed 16:9 Stage (max 2200px, centered, edge fade above 2200px) ── */}
        <div className="ai-stage-container">
          <AskOmkarAiWorkstation
            messages={messages}
            isThinking={isThinking}
            onSendQuestion={handleSendQuestion}
            onBack={handleSmartBack}
          />
        </div>

        {/* ── CONNECT Section ── */}
        <div className="ai-page-footer-wrap">
          <div className="contact-connect-stage">
            <div className="contact-connect-header">
              <span className="contact-connect-eyebrow">CONNECT</span>
              <p className="contact-connect-sub">
                Continue the conversation on your preferred platform.
              </p>
            </div>
            <div className="contact-dock-area">
              <SocialDock />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
