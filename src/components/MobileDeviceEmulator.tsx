'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  QrCode,
  MapPin,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Users,
  FileText,
  RotateCcw,
  Sparkles,
  X,
  Volume2,
  Wifi,
  BatteryMedium,
  Check,
  ChevronRight,
} from 'lucide-react';
import { onAppEvent } from '@/lib/events';

type AppId = 'attendance' | 'healthcare' | 'hrms';

interface MobileDeviceEmulatorProps {
  isModal?: boolean;
  onClose?: () => void;
  defaultApp?: AppId;
}

export default function MobileDeviceEmulator({
  isModal = false,
  onClose,
  defaultApp = 'attendance',
}: MobileDeviceEmulatorProps) {
  const [activeApp, setActiveApp] = useState<AppId>(defaultApp);
  const [currentTime, setCurrentTime] = useState('9:41');
  const [isOpenModal, setIsOpenModal] = useState(false);

  // App 1: Attendance state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // App 2: Clinical state
  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);

  // App 3: HRMS state
  const [leaveDays, setLeaveDays] = useState(3);
  const [leaveApplied, setLeaveApplied] = useState(false);

  // Listen for global trigger via Command Palette or events
  useEffect(() => {
    return onAppEvent('OPEN_MOBILE_EMULATOR', () => {
      setIsOpenModal(true);
    });
  }, []);

  // Live status bar time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hrs % 12 || 12}:${mins}`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePunchIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(currentTime);
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  const content = (
    <div className="flex flex-col items-center select-none font-sans">
      {/* Top App Switcher Pill Dock */}
      <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/15 rounded-full backdrop-blur-xl mb-4 text-xs font-mono shadow-lg">
        <button
          onClick={() => setActiveApp('attendance')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
            activeApp === 'attendance'
              ? 'bg-sky-500 text-white shadow-md font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Smart Presence</span>
        </button>

        <button
          onClick={() => setActiveApp('healthcare')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
            activeApp === 'healthcare'
              ? 'bg-emerald-500 text-white shadow-md font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Clinical 3-Way</span>
        </button>

        <button
          onClick={() => setActiveApp('hrms')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
            activeApp === 'hrms'
              ? 'bg-purple-500 text-white shadow-md font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>HRMS Portal</span>
        </button>
      </div>

      {/* Photorealistic iPhone Titanium Chassis Frame */}
      <div className="relative w-[340px] h-[680px] bg-[#0c0f17] rounded-[52px] border-[10px] border-[#222634] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_2px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col justify-between">
        {/* Dynamic Island / Hardware Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
          <motion.div
            layout
            className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 text-[9px] text-white border border-white/10 shadow-md"
          >
            <div className="w-2 h-2 rounded-full bg-camera-lens bg-neutral-900 border border-white/10 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-600/60" />
            </div>
            <span className="font-mono text-emerald-400 tracking-wider">
              {isCheckedIn ? '● PUNCHED IN' : 'FLUTTER'}
            </span>
          </motion.div>
        </div>

        {/* Live iOS Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-white/90 z-20 font-mono tracking-tight">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5 text-white/80">
            <span className="text-[9px] font-bold tracking-tighter">5G</span>
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* App Screen Viewport */}
        <div className="flex-1 overflow-y-auto px-4 py-3 text-neutral-100 flex flex-col justify-between scrollbar-none">
          {/* ================= APP 1: Smart Presence ================= */}
          {activeApp === 'attendance' && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">Smart Presence</h4>
                  <p className="text-[10px] text-neutral-400">
                    Riverpod · Geofence · Face &amp; QR
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">
                  Clean Arch
                </span>
              </div>

              {/* Geofencing Status Card */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-white">
                      HQ Office Radius
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      In-Range (24m from beacon)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">GPS OK</span>
              </div>

              {/* Interactive QR / Face Radar Scanner */}
              <div className="relative h-44 rounded-2xl bg-gradient-to-b from-sky-950/30 to-black/60 border border-sky-500/20 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0,transparent_70%)]" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-sky-400/60 flex items-center justify-center p-2 mb-2 bg-black/40">
                    <QrCode className="w-16 h-16 text-sky-400 opacity-90" />
                    <motion.div
                      animate={{ y: [-38, 38, -38] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#38bdf8]"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-sky-300 tracking-wide">
                    {isCheckedIn ? 'AUTHENTICATED' : 'SCAN QR OR FACE'}
                  </span>
                </div>
              </div>

              {/* Interactive Punch In Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handlePunchIn}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isCheckedIn
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/30'
                }`}
              >
                {isCheckedIn ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Punch Out (Checked In {checkInTime})</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Simulate Verified Check-In</span>
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* ================= APP 2: Clinical Suite ================= */}
          {activeApp === 'healthcare' && (
            <div className="space-y-3.5 pt-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">Clinical Loop</h4>
                  <p className="text-[10px] text-neutral-400">
                    Patient · Doctor · Admin Shared Domain
                  </p>
                </div>
                {/* Role Switcher */}
                <div className="flex p-0.5 bg-white/10 rounded-lg text-[10px] font-mono">
                  <button
                    onClick={() => setUserRole('patient')}
                    className={`px-2 py-0.5 rounded ${
                      userRole === 'patient'
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'text-neutral-400'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    onClick={() => setUserRole('doctor')}
                    className={`px-2 py-0.5 rounded ${
                      userRole === 'doctor'
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'text-neutral-400'
                    }`}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              {userRole === 'patient' ? (
                <>
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        Dr
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Dr. Anjali Verma
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          Senior Cardiologist · Lilavati
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-400 block pt-1">
                    Select Consultation Slot:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['10:30 AM', '02:15 PM', '04:45 PM'].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setBookedSlot(slot)}
                        className={`py-2 px-1 text-[11px] font-mono rounded-xl border text-center transition-all ${
                          bookedSlot === slot
                            ? 'bg-emerald-500 text-white border-emerald-400 font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {bookedSlot && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Slot confirmed for {bookedSlot}. Live sync dispatched to Doctor App.</span>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-neutral-400 block">
                    Doctor Triage Queue (Live Flutter State):
                  </span>
                  {[
                    { name: 'Rohan Sharma', time: '10:30 AM', type: 'Cardio Follow-up', status: 'WAITING' },
                    { name: 'Priya Iyer', time: '11:15 AM', type: 'Blood Test Review', status: 'IN-PROGRESS' },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.04] border border-white/10 p-2.5 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {p.time} · {p.type}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= APP 3: HRMS Portal ================= */}
          {activeApp === 'hrms' && (
            <div className="space-y-3.5 pt-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">HRMS Self-Service</h4>
                  <p className="text-[10px] text-neutral-400">
                    BLoC Pattern · Enterprise App
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                  Tokens
                </span>
              </div>

              {/* Employee ID Card */}
              <div className="p-3 bg-gradient-to-br from-purple-900/30 to-black/50 border border-purple-500/30 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center font-bold text-sm text-purple-200">
                  OA
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Omkar Anarse</span>
                  <span className="text-[10px] text-purple-300 font-mono">
                    ID: ENG-4091 · Metaphi
                  </span>
                </div>
              </div>

              {/* Leave Application Form Simulation */}
              <div className="bg-white/[0.04] border border-white/10 p-3 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Request Paid Leave:</span>
                  <span className="font-bold text-purple-400 font-mono">{leaveDays} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={leaveDays}
                  onChange={(e) => {
                    setLeaveDays(Number(e.target.value));
                    setLeaveApplied(false);
                  }}
                  className="w-full accent-purple-500"
                />
                <button
                  onClick={() => setLeaveApplied(true)}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                >
                  {leaveApplied ? 'Leave Submitted ✓' : 'Submit Leave Application'}
                </button>
              </div>

              {leaveApplied && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{leaveDays} days leave recorded in HRMS BLoC state.</span>
                </div>
              )}
            </div>
          )}

          {/* Bottom Virtual Home Bar (iOS indicator) */}
          <div className="pt-2 flex justify-center">
            <div className="w-28 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );

  // If rendered as modal (e.g. triggered from ⌘K)
  if (isModal || isOpenModal) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpenModal(false);
              onClose?.();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10"
          >
            <button
              onClick={() => {
                setIsOpenModal(false);
                onClose?.();
              }}
              className="absolute -top-3 -right-3 p-2 bg-neutral-900 border border-white/20 text-white rounded-full shadow-lg hover:bg-neutral-800 transition-colors z-40"
            >
              <X className="w-4 h-4" />
            </button>
            {content}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Rendered inline on page
  return content;
}
