'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Smartphone,
  Terminal,
  FileText,
  Mail,
  Activity,
  Check,
  Layers,
  ArrowRight,
  CornerDownLeft,
  Briefcase,
  Bot,
  Home,
  X,
} from 'lucide-react';
import { emitAppEvent, onAppEvent } from '@/lib/events';
import { projects } from '@/data/projects';
import { triggerRouteLoading } from '@/lib/routeLoading';

interface CommandItem {
  id: string;
  category: 'Actions' | 'Navigation' | 'Flutter Engineering' | 'AI & Full Stack';
  title: string;
  subtitle?: string;
  badge?: string;
  icon: React.ReactNode;
  keywords?: string[];
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for global shortcut (Cmd+K / Ctrl+K) and custom events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const unbind = onAppEvent('TOGGLE_COMMAND_PALETTE', () => {
      setOpen((prev) => !prev);
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unbind();
    };
  }, [open]);

  // Focus input on open and reset state
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
      setOpen(false);
    }, 900);
  };

  const navigateTo = (url: string) => {
    setOpen(false);
    triggerRouteLoading(url);
    router.push(url);
  };

  // Build searchable items catalogue
  const allItems: CommandItem[] = useMemo(() => {
    const actionItems: CommandItem[] = [
      {
        id: 'action-resume',
        category: 'Actions',
        title: 'Download Resume (PDF)',
        subtitle: 'Official engineering CV — Omkar Anarse',
        badge: 'PDF',
        icon: <FileText className="w-4 h-4 text-emerald-400" />,
        keywords: ['cv', 'resume', 'hire', 'job', 'experience'],
        action: () => {
          setOpen(false);
          window.open('/Omkar.pdf', '_blank');
        },
      },
      {
        id: 'action-emulator',
        category: 'Actions',
        title: 'Launch Interactive Flutter Emulator',
        subtitle: 'Test live mobile apps right inside the browser',
        badge: 'INTERACTIVE',
        icon: <Smartphone className="w-4 h-4 text-sky-400" />,
        keywords: ['flutter', 'mobile', 'iphone', 'test', 'demo', 'app'],
        action: () => {
          setOpen(false);
          emitAppEvent('OPEN_MOBILE_EMULATOR');
        },
      },
      {
        id: 'action-telemetry',
        category: 'Actions',
        title: 'Toggle Engineering Telemetry HUD',
        subtitle: 'Inspect real-time FPS, Web Vitals (LCP/CLS), and memory',
        badge: 'DEV TOOLS',
        icon: <Activity className="w-4 h-4 text-amber-400" />,
        keywords: ['fps', 'performance', 'vitals', 'hud', 'memory', 'metrics'],
        action: () => {
          setOpen(false);
          emitAppEvent('TOGGLE_TELEMETRY_HUD');
        },
      },
      {
        id: 'action-email',
        category: 'Actions',
        title: 'Copy Email to Clipboard',
        subtitle: 'omkaranarse1906@gmail.com',
        badge: 'COPY',
        icon: <Mail className="w-4 h-4 text-rose-400" />,
        keywords: ['email', 'contact', 'reach', 'message'],
        action: () => copyToClipboard('omkaranarse1906@gmail.com', 'Email Copied!'),
      },
      {
        id: 'action-github',
        category: 'Actions',
        title: 'Open GitHub Profile',
        subtitle: 'github.com/Omkaranrse · 30+ repositories',
        badge: 'GITHUB',
        icon: (
          <svg className="w-4 h-4 text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        ),
        keywords: ['code', 'repo', 'git', 'source'],
        action: () => {
          setOpen(false);
          window.open('https://github.com/Omkaranrse', '_blank');
        },
      },
    ];

    const navItems: CommandItem[] = [
      {
        id: 'nav-home',
        category: 'Navigation',
        title: 'Home',
        subtitle: 'Hero, featured systems & skills overview',
        icon: <Home className="w-4 h-4 text-blue-400" />,
        action: () => navigateTo('/'),
      },
      {
        id: 'nav-projects',
        category: 'Navigation',
        title: 'All Projects Directory',
        subtitle: 'Browse all mobile, AI, and full-stack software',
        badge: 'DIRECTORY',
        icon: <Layers className="w-4 h-4 text-purple-400" />,
        keywords: ['projects', 'apps', 'code', 'software'],
        action: () => navigateTo('/projects'),
      },
      {
        id: 'nav-ask-ai',
        category: 'Navigation',
        title: 'Ask Omkar AI Workstation',
        subtitle: '3D Spatial workstation with interactive AI persona',
        badge: '3D AI',
        icon: <Bot className="w-4 h-4 text-orange-400" />,
        keywords: ['ai', 'chat', 'ask', 'agent', 'rag', '3d'],
        action: () => navigateTo('/ask-ai'),
      },
      {
        id: 'nav-experience',
        category: 'Navigation',
        title: 'Professional Experience',
        subtitle: 'Metaphi, My Job Park roles & lanyard cards',
        icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
        keywords: ['experience', 'work', 'history', 'metaphi', 'jobs'],
        action: () => navigateTo('/experience'),
      },
    ];

    const projectItems: CommandItem[] = projects.map((p) => {
      const isFlutter = p.category.includes('FLUTTER') || p.stack.includes('Flutter');
      return {
        id: `project-${p.id}`,
        category: isFlutter ? 'Flutter Engineering' : 'AI & Full Stack',
        title: p.title,
        subtitle: p.shortDesc,
        badge: isFlutter ? 'FLUTTER' : 'AI SYSTEM',
        icon: isFlutter ? (
          <Smartphone className="w-4 h-4 text-cyan-400" />
        ) : (
          <Sparkles className="w-4 h-4 text-amber-400" />
        ),
        keywords: [p.title, p.category, ...p.stack, p.role],
        action: () => navigateTo(`/projects/${p.id}`),
      };
    });

    return [...actionItems, ...navItems, ...projectItems];
  }, []);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  }, [query, allItems]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[12vh] px-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Command Dialog Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#0e1117]/95 border border-white/15 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-neutral-100 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
          >
            {/* Header / Input Field */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command or search Flutter apps, AI systems, and actions..."
                className="w-full bg-transparent text-[15px] text-white placeholder-neutral-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-neutral-400 hover:text-white rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-white/10 px-2 py-0.5 rounded border border-white/10 shrink-0">
                <span>ESC</span>
              </div>
            </div>

            {/* Notification Toast if copied */}
            {copiedText && (
              <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {copiedText}
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono">Ready to paste</span>
              </div>
            )}

            {/* Results List */}
            <div
              className="max-h-[52vh] overflow-y-auto overflow-x-hidden p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10"
              role="listbox"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 text-sm">
                  <Terminal className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                  <p>No commands or projects found matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-neutral-400 mt-1">Try searching &ldquo;Flutter&rdquo;, &ldquo;Resume&rdquo;, or &ldquo;AI&rdquo;</p>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white/10 text-white shadow-sm border border-white/10'
                          : 'text-neutral-300 hover:bg-white/[0.05] border border-transparent'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`p-2 rounded-lg shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-white/15 text-white'
                              : 'bg-white/5 text-neutral-400 group-hover:text-neutral-200'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium tracking-tight text-white truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-xs text-neutral-400 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
                          {item.category}
                        </span>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-[11px] text-neutral-300 bg-white/15 px-1.5 py-0.5 rounded font-mono">
                            <span>↵</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-black/40 text-[11px] text-neutral-400 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-neutral-300">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-neutral-300">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-neutral-300">ESC</kbd>
                  Close
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Omkar OS v2.4</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
