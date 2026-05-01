import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, Search, ShieldCheck, Star, Award, 
  Filter, ExternalLink, Mail, ArrowRight, Activity, 
  Target, Cpu, Terminal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AeroCard, AeroButton, GlassPanel, TechnicalDivider } from '../components/AeroUI';

const Members = () => {
  const { members } = useSelector((state) => state.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 pb-32 pt-16"
    >
      {/* Community Directory Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-12">
        <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-sky-100">
               <Users size={12}/> Community Network
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-slate-950 tracking-tight leading-none">
              Member<span className="text-sky-600">NETWORK</span>
            </h1>
            <p className="text-slate-500 text-lg lg:text-xl font-medium opacity-80 border-l-2 border-sky-500 pl-6 max-w-2xl">
              Meet the community leaders and members driving innovation across our community.
            </p>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
           <div className="relative group flex-grow lg:flex-grow-0">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search Members..." 
                className="w-full lg:w-[320px] bg-white border border-slate-200 rounded-[24px] py-4 pl-14 pr-8 text-sm font-bold text-slate-950 shadow-sm focus:shadow-xl focus:border-sky-200 transition-all outline-none placeholder:text-slate-300"
              />
           </div>
           <AeroButton variant="secondary" className="w-14 h-14 !p-0 !rounded-2xl !bg-white shadow-lg border-slate-200 shrink-0">
              <Filter size={20} className="text-slate-400" />
           </AeroButton>
        </div>
      </header>

      <motion.div 
        variants={itemVariants}
        className="w-full bg-white/50 backdrop-blur-md border border-slate-200 rounded-[40px] p-16 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]"
      >
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
          <ShieldCheck size={32} className="text-slate-400" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Member Directory Pending</h3>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest max-w-md leading-relaxed">
          Details will be added soon as we add the backend part.
        </p>
      </motion.div>
      <TechnicalDivider />
    </motion.div>
  );
};

export default Members;
