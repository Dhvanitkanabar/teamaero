import React from 'react';
import { motion } from 'framer-motion';

export const GlassPanel = ({ children, className = "" }) => (
  <div className={`vanguard-glass rounded-[24px] p-6 ${className}`}>
    {children}
  </div>
);

export const AeroCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`vanguard-card p-8 group relative ${className}`}
  >
    {/* Atmospheric Glow */}
    <div className="absolute -top-10 -right-10 w-48 h-48 bg-sky-400/5 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

export const StatCard = ({ label, value, icon: Icon, trend, color = "sky" }) => (
  <AeroCard className="w-full">
    <div className="flex items-center justify-between mb-6 md:mb-8">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[16px] md:rounded-[20px] bg-white shadow-xl flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform duration-700`}>
        <Icon size={20} className="md:size-24" />
      </div>
      {trend && (
        <span className="px-3 py-1 md:px-4 md:py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest backdrop-blur-md">
          {trend}
        </span>
      )}
    </div>
    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter tabular-nums">{value}</span>
      <div className="flex gap-1">
        <div className="w-1 h-2.5 md:h-3 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-1 h-1 md:h-1.5 bg-sky-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  </AeroCard>
);

export const AeroButton = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }) => {
  const base = "vanguard-btn-shimmer";
  const secondary = "vanguard-glass border-white/50 text-slate-950 font-black uppercase tracking-[0.2em] text-[9px] px-8 py-3.5 rounded-[16px] flex items-center justify-center transition-all hover:bg-white/60 hover:scale-105 active:scale-95 disabled:opacity-50";
  
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick} 
      className={`${variant === 'primary' ? base : secondary} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const TechnicalDivider = () => (
  <div className="flex items-center gap-6 w-full py-12 opacity-20">
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
    <div className="flex gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,1)]" />
      <div className="w-8 h-1.5 rounded-full bg-slate-200 shadow-inner" />
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-sky-500 to-transparent" />
  </div>
);

/**
 * Skeleton — premium pulsing placeholder for loading states (Point 6).
 */
export const Skeleton = ({ className = "", circle = false }) => (
  <div 
    className={`bg-slate-200/50 animate-pulse ${circle ? 'rounded-full' : 'rounded-2xl'} ${className}`} 
  />
);

