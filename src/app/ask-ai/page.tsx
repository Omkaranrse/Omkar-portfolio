'use client';

import { useState, useCallback, useEffect } from 'react';
import Nav from '@/components/Nav';
import AskOmkarAiWorkstation, { ChatMessage } from '@/components/AskOmkarAiWorkstation';
import SocialRail from '@/components/SocialRail';
import { triggerRouteReady, updateRouteLoadingMessage } from '@/lib/routeLoading';

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitialOmkarMessage(): ChatMessage {
  const greeting = getTimeBasedGreeting();
  return {
    id: 'omkar-welcome-intro',
    role: 'ai',
    text: `${greeting}! 👋 Myself Omkar Anarse.

I completed my Bachelor's in B.Sc. CS and MCA from Mumbai University (MU). Over the years, I've worked across:
• **Mobile Development**: Flutter & Dart (Clean Architecture, State Management, Firebase)
• **Modern Web & Backend**: Next.js 15, Node.js, TypeScript, React 19 & Tailwind CSS
• **AI Projects**: Autonomous multi-agent pipelines with LangGraph, RAG with ChromaDB, and FastAPI
• **Work Experience**: Production Flutter engineering at **Metaphi** + 3 years of part-time experience building cross-platform apps at **My Job Park**.

Feel free to ask me anything about my projects, architecture decisions, tech stack, or career opportunities!`,
  };
}

export default function AskAiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [getInitialOmkarMessage()]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Stage 1 (600ms): Inform user of spatial models loading
    const t1 = setTimeout(() => {
      updateRouteLoadingMessage('Loading Spatial 3D GLB Models...');
    }, 600);

    // Stage 2 (1200ms): Inform user of workstation atmosphere warming up
    const t2 = setTimeout(() => {
      updateRouteLoadingMessage('Warming Up Workstation Atmosphere...');
    }, 1200);

    // Stage 3 (1700ms): Fully ready in background, dismiss the single loading screen smoothly
    const t3 = setTimeout(() => {
      triggerRouteReady();
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

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
    <div className="ask-ai-page-root">
      <Nav />
      <h1 className="sr-only">Ask anything about Omkar</h1>
      <AskOmkarAiWorkstation
        messages={messages}
        isThinking={isThinking}
        onSendQuestion={handleSendQuestion}
      />
      <SocialRail />
    </div>
  );
}
