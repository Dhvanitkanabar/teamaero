import React, { useState, useMemo } from 'react';
import { 
  Users, Search, ShieldCheck, Star, Award, 
  Filter, ArrowRight, Activity, 
  Target, Cpu, Terminal, Shield, ExternalLink,
  ChevronRight, Zap, Globe, Lock, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AeroCard, AeroButton, GlassPanel, TechnicalDivider } from '../components/AeroUI';
import SEO from '../components/SEO';
import useDebounce from '../hooks/useDebounce';
import { getAllMembers } from '../utils/userMapping';

const Members = () => {
  const navigate = useNavigate();
  const allMembers = useMemo(() => getAllMembers(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);

  const filteredMembers = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return term
      ? allMembers.filter((m) =>
          m.name?.toLowerCase().includes(term) ||
          m.accountId?.toLowerCase().includes(term) ||
          m.role?.toLowerCase().includes(term)
        )
      : allMembers;
  }, [debouncedSearch, allMembers]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.05, delayChildren: 0.2 } 
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-20 pb-40 pt-10 px-4 sm:px-6"
    >
      <SEO
        title="Member Roster"
        description="Access the Vanguard AERO elite operator directory. Interactive identity grid for the squadron's 30 authorized members."
        url="/members"
      />

      {/* ── Cinematic Header ────────────────────────────────────────────────── */}
      <header className="relative flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 bg-sky-500/10 text-sky-400 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-sky-500/20"
        >
           <Activity size={12} className="animate-pulse" /> Vanguard Authorized Directory
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none italic uppercase">
             Member<span className="text-sky-500 vanguard-text-glow">Net</span>
          </h1>
          <p className="text-white/40 text-lg md:text-2xl font-medium italic max-w-2xl mx-auto">
             Encrypted repository of the <span className="text-white font-bold">30 Elite Operators</span> currently deployed in the AERO ecosystem.
          </p>
        </div>

        {/* Search Bar Refinement */}
        <div className="w-full max-w-xl relative group">
          <div className="absolute inset-0 bg-sky-500/5 blur-2xl group-focus-within:bg-sky-500/15 transition-all" />
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sky-500 transition-colors" size={20} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="AUTHENTICATE IDENTITY..."
            className="w-full bg-white/5 border border-white/10 rounded-[30px] py-6 pl-16 pr-8 text-sm font-black text-white shadow-2xl focus:border-sky-500/50 transition-all outline-none placeholder:text-white/10 italic tracking-widest"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-black text-white/30 tracking-widest uppercase">Live Scan</span>
          </div>
        </div>
      </header>

      {/* ── Member Grid ────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {filteredMembers.map((member) => (
            <motion.div 
              key={member.id} 
              variants={cardVariants}
              layout
              whileHover={{ y: -10 }}
              className="relative group"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-600/0 to-indigo-600/0 group-hover:from-sky-600/10 group-hover:to-indigo-600/10 blur-3xl transition-all duration-700 rounded-[40px]" />
              
              <div className="vanguard-glass-dark relative flex flex-col h-full border-white/5 group-hover:border-sky-500/40 transition-all duration-500 rounded-[40px] overflow-hidden">
                {/* Identity Header */}
                <div className="h-32 bg-gradient-to-br from-white/5 to-transparent p-8 flex items-start justify-between">
                   <div className="space-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${member.role === 'admin' ? 'text-amber-400' : 'text-sky-400'}`}>
                         {member.role === 'admin' ? 'Command Admin' : 'Active Member'}
                      </span>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{member.accountId}</p>
                   </div>
                   {member.role === 'admin' ? (
                     <ShieldCheck className="text-amber-400/50" size={24} />
                   ) : (
                     <Lock className="text-white/10" size={18} />
                   )}
                </div>

                {/* Avatar & Info */}
                <div className="px-8 pb-10 flex flex-col items-center text-center -mt-12 flex-grow">
                   <div className="relative mb-8 group-hover:scale-110 transition-transform duration-700">
                      {/* Scanning Ring */}
                      <div className="absolute -inset-3 border border-sky-500/20 rounded-[40px] animate-[spin_10s_linear_infinite] group-hover:border-sky-500/50 transition-colors" />
                      <div className="absolute -inset-6 border border-white/5 rounded-[50px] animate-[spin_15s_linear_infinite_reverse]" />
                      
                      <div className="w-28 h-28 rounded-[35px] bg-slate-950 p-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative z-10">
                         <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-950 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-20" />
                   </div>
                   
                   <div className="space-y-2 mb-8">
                      <h3 className="font-black text-3xl text-white tracking-tighter italic uppercase group-hover:text-sky-400 transition-colors">
                        {member.name}
                      </h3>
                      <div className="h-0.5 w-8 bg-sky-500/20 mx-auto rounded-full group-hover:w-16 transition-all duration-500" />
                   </div>

                   <p className="text-[11px] text-white/40 font-bold leading-relaxed tracking-wide flex-grow uppercase italic px-4">
                     "{member.bio}"
                   </p>

                   {/* Tech Metrics */}
                   <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                      <div className="text-left space-y-1">
                         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Efficiency</p>
                         <p className="text-sm font-black text-white italic">{member.integrity}%</p>
                      </div>
                      <div className="text-right space-y-1">
                         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Status</p>
                         <p className="text-sm font-black text-emerald-400 italic uppercase">Authorized</p>
                      </div>
                   </div>
                </div>
                
                {/* Action Footer */}
                <footer className="p-4 bg-white/[0.02] flex flex-col gap-3 mt-auto border-t border-white/5">
                   <button 
                     onClick={() => navigate(`/profile/${member.id}`)}
                     className="w-full py-5 rounded-[24px] bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] group/btn hover:bg-white hover:text-slate-950 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                   >
                      Access Profile <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </footer>

                {/* Corner Decoration */}
                <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-sky-500/0 group-hover:border-sky-500/40 transition-all duration-500 rounded-br-[40px] pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-40 space-y-6 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
             <Search size={32} className="text-white/20" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">No Identities Located</h3>
            <p className="text-white/30 text-sm font-bold uppercase tracking-widest">Adjust search parameters and try again.</p>
          </div>
        </motion.div>
      )}

      <TechnicalDivider />
    </motion.div>
  );
};

export default Members;
