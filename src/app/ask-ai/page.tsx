'use client';

import { useState, useCallback } from 'react';
import Nav from '@/components/Nav';
import AskOmkarAiWorkstation, { ChatMessage } from '@/components/AskOmkarAiWorkstation';
import { useSmartBack } from '@/components/BackButton';
import SocialRail from '@/components/SocialRail';

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
      <h1 className="sr-only">Ask anything about Omkar</h1>
      <AskOmkarAiWorkstation
        messages={messages}
        isThinking={isThinking}
        onSendQuestion={handleSendQuestion}
        onBack={handleSmartBack}
      />
      <SocialRail />
    </>
  );
}
