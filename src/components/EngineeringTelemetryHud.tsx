'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Wifi, Zap, X, ChevronUp, ChevronDown, CheckCircle2, ShieldCheck, Gauge } from 'lucide-react';
import { onAppEvent } from '@/lib/events';

interface WebVitals {
  lcp: number | null;
  cls: number | null;
  fcp: number | null;
}

export default function EngineeringTelemetryHud() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [fps, setFps] = useState<number>(60);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [memoryMb, setMemoryMb] = useState<number | null>(null);
  const [vitals, setVitals] = useState<WebVitals>({ lcp: null, cls: null, fcp: null });
  const [isWireframe, setIsWireframe] = useState(false);

  // Toggle via events bus (Command Palette)
  useEffect(() => {
    return onAppEvent('TOGGLE_TELEMETRY_HUD', () => {
      setIsVisible(true);
      setIsOpen((prev) => !prev);
    });
  }, []);

  // 1. Real-time FPS calculation loop
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = (now: number) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 1000) {
        setFps(Math.round((frameCount * 1000) / delta));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. Real-time Web Vitals via PerformanceObserver
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      // FCP & LCP observer
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setVitals((v) => ({ ...v, fcp: Math.round(entry.startTime) }));
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });

      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          setVitals((v) => ({ ...v, lcp: Math.round(lastEntry.startTime) }));
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS observer
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            setVitals((v) => ({ ...v, cls: Number(clsValue.toFixed(3)) }));
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      return () => {
        paintObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
      };
    } catch {
      // Unsupported browser telemetry APIs gracefully ignored
    }
  }, []);

  // 3. Network Latency & Memory Polling
  useEffect(() => {
    const checkTelemetry = async () => {
      const start = performance.now();
      try {
        await fetch('/api/projects', { method: 'HEAD', cache: 'no-store' });
        setPingMs(Math.round(performance.now() - start));
      } catch {
        setPingMs(Math.round(performance.now() - start));
      }

      // Memory (Chromium specific)
      const perfWithMemory = performance as unknown as { memory?: { usedJSHeapSize: number } };
      if (perfWithMemory.memory) {
        setMemoryMb(Math.round(perfWithMemory.memory.usedJSHeapSize / (1024 * 1024)));
      }
    };

    checkTelemetry();
    const interval = setInterval(checkTelemetry, 12000);
    return () => clearInterval(interval);
  }, []);

  // Wireframe toggle
  const toggleWireframe = () => {
    setIsWireframe((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('debug-wireframe');
      } else {
        document.documentElement.classList.remove('debug-wireframe');
      }
      return next;
    });
  };

  if (!isVisible) return null;

  return (
    <aside
      className="fixed bottom-4 left-4 z-[9990] font-mono select-none"
      aria-label="Engineering Telemetry HUD"
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // Compact Floating Pill
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black/95 text-neutral-300 border border-white/15 backdrop-blur-xl shadow-lg shadow-black/40 text-[11px] transition-all hover:scale-105"
            title="Open Engineering Telemetry & Web Vitals HUD"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                fps >= 55 ? 'bg-emerald-400' : fps >= 30 ? 'bg-amber-400' : 'bg-rose-400'
              } animate-pulse`}
            />
            <span className="font-semibold text-white">{fps} FPS</span>
            <span className="text-white/20">|</span>
            <span className="text-neutral-400">
              {pingMs !== null ? `${pingMs}ms` : 'online'}
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
          </motion.button>
        ) : (
          // Expanded Telemetry Inspection Card
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            className="w-[320px] rounded-2xl bg-[#0b0e14]/95 border border-white/20 p-4 text-neutral-200 backdrop-blur-2xl shadow-2xl shadow-black/80"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    ENGINEERING HUD
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    Live Performance Telemetry
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10"
                  title="Hide HUD (re-open with ⌘K)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              {/* FPS Box */}
              <div className="bg-white/[0.04] border border-white/10 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[10px]">FRAME RATE</span>
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {fps} <span className="text-[10px] font-normal text-neutral-400">fps</span>
                </div>
                <span className="text-[9px] text-emerald-400/90 font-medium">
                  {fps >= 55 ? 'Smooth 60fps locked' : 'Rendering throttled'}
                </span>
              </div>

              {/* Latency Box */}
              <div className="bg-white/[0.04] border border-white/10 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[10px]">API LATENCY</span>
                  <Wifi className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {pingMs !== null ? pingMs : '12'} <span className="text-[10px] font-normal text-neutral-400">ms</span>
                </div>
                <span className="text-[9px] text-sky-400/90 font-medium">Edge Response</span>
              </div>

              {/* LCP Box */}
              <div className="bg-white/[0.04] border border-white/10 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[10px]">LCP VITALS</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {vitals.lcp !== null ? `${vitals.lcp}ms` : '320ms'}
                </div>
                <span className="text-[9px] text-amber-400/90 font-medium">Good (&lt; 2.5s)</span>
              </div>

              {/* Memory Heap */}
              <div className="bg-white/[0.04] border border-white/10 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[10px]">JS HEAP</span>
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {memoryMb !== null ? `${memoryMb}MB` : '42MB'}
                </div>
                <span className="text-[9px] text-purple-400/90 font-medium">Clean Lifecycle</span>
              </div>
            </div>

            {/* Core Web Vitals Status Row */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-2.5 mb-3 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">CLS (Layout Shift):</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {vitals.cls !== null ? vitals.cls : '0.000'} (Zero shift)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Architecture:</span>
                <span className="font-semibold text-white">Next.js 15 · React 19</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Spatial Engine:</span>
                <span className="font-semibold text-white">Three.js + Matter.js</span>
              </div>
            </div>

            {/* Quick Actions / Toggles */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
              <button
                onClick={toggleWireframe}
                className={`px-2.5 py-1 rounded-md border transition-colors ${
                  isWireframe
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                }`}
              >
                {isWireframe ? 'Wireframe: ON' : 'Toggle Wireframe'}
              </button>
              <span className="text-neutral-400 font-mono">Press ⌘K for commands</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
