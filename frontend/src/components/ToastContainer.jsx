import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, AlertTriangle, Info,
  X, Bell, Trophy, Radio, Calendar
} from 'lucide-react';
import { markAsRead } from '../redux/slices/notificationSlice';

// ── Icon map by notification type ──────────────────────────────────────────
const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    bar: 'bg-emerald-500',
    label: 'Success',
  },
  error: {
    icon: XCircle,
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    iconColor: 'text-rose-500',
    bar: 'bg-rose-500',
    label: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    bar: 'bg-amber-500',
    label: 'Warning',
  },
  poll: {
    icon: Radio,
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    iconColor: 'text-violet-500',
    bar: 'bg-violet-500',
    label: 'Poll',
  },
  ranking: {
    icon: Trophy,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    bar: 'bg-amber-500',
    label: 'Ranking',
  },
  event: {
    icon: Calendar,
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    iconColor: 'text-sky-500',
    bar: 'bg-sky-500',
    label: 'Event',
  },
  info: {
    icon: Info,
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    iconColor: 'text-sky-500',
    bar: 'bg-sky-500',
    label: 'Info',
  },
};

const AUTO_DISMISS_MS = 4500;

// ── Single Toast ────────────────────────────────────────────────────────────
const Toast = ({ notification, onDismiss }) => {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;
  const Icon = config.icon;
  const progressRef = useRef(null);

  // Animate the progress bar countdown
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.width = '100%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `width ${AUTO_DISMISS_MS}ms linear`;
        el.style.width = '0%';
      });
    });
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notification.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 64, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 64, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`relative w-[340px] rounded-2xl border shadow-xl overflow-hidden ${config.bg} ${config.border} bg-white`}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-0.5 w-full bg-black/5">
        <div ref={progressRef} className={`h-full ${config.bar} rounded-full`} />
      </div>

      <div className="flex items-start gap-4 p-4 pt-5">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.bg} border ${config.border}`}>
          <Icon size={18} className={config.iconColor} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0 space-y-0.5">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            {config.label}
          </p>
          {notification.title && (
            <p className="text-sm font-black text-slate-950 leading-tight">
              {notification.title}
            </p>
          )}
          {notification.message && (
            <p className="text-[12px] font-medium text-slate-500 leading-snug">
              {notification.message}
            </p>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(notification.id)}
          aria-label="Dismiss notification"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-black/5 transition-all shrink-0"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
};

// ── Toast Container — mount globally in Layout ─────────────────────────────
const ToastContainer = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);

  // Only show unread toasts — last 4 at a time
  const toasts = notifications
    .filter((n) => !n.read)
    .slice(0, 4);

  const handleDismiss = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[99998] flex flex-col gap-3 items-end pointer-events-none"
    >
      <AnimatePresence mode="sync">
        {toasts.map((n) => (
          <div key={n.id} className="pointer-events-auto">
            <Toast notification={n} onDismiss={handleDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
