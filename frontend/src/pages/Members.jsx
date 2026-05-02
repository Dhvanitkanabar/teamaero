import React, { useState, useMemo } from 'react';
import { 
  Users, Search, ShieldCheck, Star, Award, 
  Filter, ArrowRight, Activity, 
  Target, Cpu, Terminal, Shield, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  // Filter members based on debounced search term
  const filteredMembers = debouncedSearch.trim()
    ? allMembers.filter((m) =>
        m.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.accountId?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.role?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allMembers;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 pb-32 pt-16"
    >
      <SEO
        title="Members"
        description="Browse the full Vanguard AERO squadron roster. Meet the 30 operators driving innovation."
        url="/members"
      />

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/10 pb-12">
        <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-sky-400 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/10">
               <Users size={10}/> Squadron Roster
            </div>
            <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
              Member<span className="text-sky-500">Net</span>
            </h1>
            <p className="text-white/40 text-lg lg:text-xl font-medium border-l-2 border-sky-500 pl-6 max-w-2xl italic">
              30 Elite Operators authorized for Vanguard AERO deployment.
            </p>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
           <div className="relative group flex-grow lg:flex-grow-0">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sky-500 transition-colors" size={18} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Identity..."
                className="w-full lg:w-[320px] bg-white/5 border border-white/10 rounded-[24px] py-5 pl-14 pr-8 text-sm font-bold text-white shadow-2xl focus:border-sky-500/50 transition-all outline-none placeholder:text-white/20"
              />
           </div>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredMembers.map((member) => (
          <motion.div key={member.id} variants={itemVariants}>
            <div className="vanguard-glass-dark group p-0 overflow-hidden flex flex-col h-full border-white/5 hover:border-sky-500/30 transition-all duration-500 rounded-[28px]">
              {/* Card Header - Smaller Height */}
              <div className="h-16 bg-white/5 relative flex items-center px-6 border-b border-white/5">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/10 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity" />
                 <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${member.role === 'admin' ? 'text-amber-400' : 'text-sky-400'}`}>
                    {member.role === 'admin' ? 'Strategic Admin' : 'Squadron Member'}
                 </span>
              </div>

               <div className="p-6 flex flex-col items-center text-center -mt-12 flex-grow">
                  <div className="relative mb-4">
                     <div className="w-20 h-20 rounded-[24px] bg-slate-900 p-1 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 border border-white/10 overflow-hidden">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-slate-950 bg-emerald-500" />
                  </div>
                  
                  <div className="space-y-0.5 mb-4">
                     <h3 className="font-black text-xl text-white tracking-tight italic uppercase">{member.name}</h3>
                     <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{member.accountId}</p>
                  </div>

                  <p className="text-[10px] text-white/50 font-bold leading-relaxed tracking-wide flex-grow uppercase italic line-clamp-2">
                    "{member.bio}"
                  </p>

                  <div className="w-full grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                     <div className="text-left">
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none">Integrity</p>
                        <p className="text-xs font-black text-white">{member.integrity}%</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none">XP</p>
                        <p className="text-xs font-black text-sky-400">{member.xp}</p>
                     </div>
                  </div>
               </div>
               
               <footer className="p-4 bg-white/5 flex flex-col gap-3 mt-auto border-t border-white/5">
                  <AeroButton 
                    variant="secondary" 
                    onClick={() => navigate(`/profile/${member.id}`)}
                    className="w-full !py-3 !text-white !bg-white/5 !rounded-xl !border-white/10 !text-[9px] !font-black !uppercase !tracking-[0.2em] group/btn hover:!bg-white hover:!text-slate-950 transition-all"
                  >
                     Visit Profile <ExternalLink size={12} className="ml-2" />
                  </AeroButton>
               </footer>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <TechnicalDivider />
    </motion.div>
  );
};

export default Members;
