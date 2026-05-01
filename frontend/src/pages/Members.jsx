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
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {members.map((member) => (
          <motion.div key={member.id} variants={itemVariants}>
            <GlassPanel className="group p-0 overflow-hidden flex flex-col h-full !bg-white/80 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-700">
              {/* Visual Identity Header */}
              <div className="h-24 bg-gradient-to-br from-slate-50 to-sky-50/50 relative flex items-center px-6 border-b border-slate-100">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-[40px]" />
                 <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase opacity-60">{member.role}</span>
                 <div className="ml-auto flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-sky-400" />
                    <div className="w-1 h-1 rounded-full bg-sky-200" />
                 </div>
              </div>

               <div className="p-8 flex flex-col items-center text-center -mt-16 flex-grow">
                  <div className="relative mb-6">
                     <div className="w-28 h-28 rounded-3xl bg-white p-1 shadow-2xl group-hover:scale-105 group-hover:-rotate-2 transition-all duration-700 border border-slate-100">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-[22px]" />
                     </div>
                     <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${member.status === 'Active' ? 'bg-emerald-500 shadow-lg' : 'bg-slate-300'}`} />
                  </div>
                  
                  <div className="space-y-1 mb-6">
                     <h3 className="font-black text-xl text-slate-950 tracking-tight group-hover:text-sky-600 transition-colors duration-500">{member.name}</h3>
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{member.accountId}</p>
                  </div>
  
                  <div className="w-full grid grid-cols-2 gap-4 mb-6">
                     <div className="text-left p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Contribution</p>
                        <p className="text-sm font-black text-slate-950 tracking-tight">{member.integrity}%</p>
                     </div>
                     <div className="text-left p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Points</p>
                        <p className="text-sm font-black text-slate-950 tracking-tight">{member.xp.toLocaleString()}</p>
                     </div>
                  </div>
  
                  <p className="text-xs text-slate-500 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500 flex-grow">
                    {member.bio}
                  </p>
               </div>
               
               <footer className="p-6 bg-slate-50/50 flex flex-col gap-3 mt-auto border-t border-slate-100">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-2"><Activity size={10} className="text-emerald-500"/> Availability</span>
                     <span className="text-sky-600">Online Now</span>
                  </div>
                  <AeroButton variant="secondary" className="w-full !py-3 !text-white !bg-sky-600 !rounded-2xl !border-none !text-[9px] !font-black !uppercase !tracking-widest group/btn transition-all active:scale-95 shadow-lg shadow-sky-600/20">
                     View Profile <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-500 ml-2" />
                  </AeroButton>
               </footer>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>
      <TechnicalDivider />
    </motion.div>
  );
};

export default Members;
