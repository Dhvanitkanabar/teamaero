import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import useSocketStatus from '../hooks/useSocketStatus';

/**
 * LiveIndicator — shows real-time socket connection status.
 *
 * Props:
 *   variant  — 'badge' (default) | 'dot' | 'bar'
 *   showText — boolean (default true)
 *   className — extra classes
 *
 * Usage:
 *   <LiveIndicator />
 *   <LiveIndicator variant="dot" />
 *   <LiveIndicator variant="bar" />
 */
const LiveIndicator = ({ variant = 'badge', showText = true, className = '' }) => {
  const { connected, connecting, reconnectAttempt } = useSocketStatus();

  // ── dot variant ──────────────────────────────────────────────────────────
  if (variant === 'dot') {
    return (
      <span
        aria-label={connected ? 'Connected' : connecting ? 'Connecting…' : 'Offline'}
        title={connected ? 'Real-time connected' : connecting ? `Reconnecting (attempt ${reconnectAttempt})…` : 'Offline'}
        className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${className} ${
          connected ? 'bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.4)] animate-pulse'
          : connecting ? 'bg-amber-400 animate-pulse'
          : 'bg-slate-300'
        }`}
      />
    );
  }

  // ── bar variant (thin top strip) ─────────────────────────────────────────
  if (variant === 'bar') {
    return (
      <AnimatePresence>
        {!connected && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            className={`fixed top-0 left-0 right-0 z-[99999] h-0.5 origin-left ${className} ${
              connecting ? 'bg-amber-400' : 'bg-rose-500'
            }`}
            role="status"
            aria-label={connecting ? 'Reconnecting to server…' : 'Server offline'}
          />
        )}
      </AnimatePresence>
    );
  }

  // ── badge variant (default) ───────────────────────────────────────────────
  return (
    <div
      aria-live="polite"
      aria-label={connected ? 'Live — connected' : connecting ? 'Reconnecting…' : 'Offline'}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-colors duration-500 ${className} ${
        connected
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
          : connecting
          ? 'bg-amber-50 text-amber-600 border-amber-200'
          : 'bg-slate-50 text-slate-400 border-slate-200'
      }`}
    >
      {connected ? (
        <>
          <Wifi size={10} aria-hidden="true" />
          {showText && 'Live'}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" aria-hidden="true" />
        </>
      ) : connecting ? (
        <>
          <Loader2 size={10} className="animate-spin" aria-hidden="true" />
          {showText && `Reconnecting${reconnectAttempt > 0 ? ` (${reconnectAttempt})` : '…'}`}
        </>
      ) : (
        <>
          <WifiOff size={10} aria-hidden="true" />
          {showText && 'Offline'}
        </>
      )}
    </div>
  );
};

export default LiveIndicator;
