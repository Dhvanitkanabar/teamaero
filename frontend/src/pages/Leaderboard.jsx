import React, { useEffect } from 'react';
import { 
  Trophy, Medal, Crown, TrendingUp, Activity, 
  ArrowUpRight, Target, Shield, Zap, Globe,
  Star, ChevronRight, Award, Flame, ZapOff,
  User, Calendar, Clock, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { AeroCard, AeroButton, GlassPanel, TechnicalDivider } from '../components/AeroUI';
import { rehydrateTeams } from '../redux/slices/leaderboardSlice';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.user);
  const { dailyBest } = useSelector((state) => state.leaderboard);
  
  useEffect(() => {
    dispatch(rehydrateTeams());
  }, [dispatch]);

  // Sort members by score for the global leaderboard
  const globalRankings = [...members].sort((a, b) => (b.score || 0) - (a.score || 0));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-20 pb-40 pt-16"
    >
      {/* Cinematic Header */}
      <header className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 border-b border-slate-100 pb-16">
        <div className="space-y-6 relative z-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-sky-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-sky-600/20"
            >
               <Trophy size={14} className="animate-pulse" /> Community Rankings
            </motion.div>
            <h1 className="text-5xl lg:text-8xl font-black text-slate-950 tracking-tighter leading-[0.9] lg:max-w-4xl">
               TOP <span className="text-sky-600">PERFORMERS</span>
            </h1>
            <p className="text-slate-500 text-lg lg:text-2xl font-medium max-w-2xl leading-relaxed border-l-4 border-sky-500 pl-8">
              Recognizing outstanding daily contributions and long-term community leadership.
            </p>
        </div>
        
        <div className="flex gap-4">
           <GlassPanel className="p-8 flex items-center gap-8 vanguard-glass-deep !bg-white border-slate-100 shadow-2xl relative overflow-hidden group">
              <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 border border-sky-100">
                 <Activity size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Live Updates</p>
                 <p className="text-xl font-black text-slate-950 tracking-tight">Active Season</p>
                 <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Synchronized
                 </span>
              </div>
           </GlassPanel>
        </div>
      </header>

      {/* TODAY'S BEST PERFORMER SECTION */}
      <motion.section variants={itemVariants} className="space-y-10">
         <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Today's Best Performer</h2>
            <div className="h-px flex-1 bg-slate-100" />
         </div>

         <GlassPanel className="p-0 overflow-hidden border-slate-100 shadow-2xl !bg-white rounded-[50px] relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
               {/* Left: Performer Identity */}
               <div className="lg:col-span-4 bg-sky-600 p-12 lg:p-16 flex flex-col items-center justify-center text-center text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="absolute top-0 right-0 p-12 opacity-10">
                     <Star size={120} fill="white" />
                  </div>
                  
                  <div className="relative mb-10 group/avatar">
                     <div className="absolute -inset-4 bg-white/20 blur-2xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700" />
                     <div className="relative w-40 h-40 lg:w-56 lg:h-56 rounded-[60px] bg-white p-2 border-4 border-white/20 shadow-2xl overflow-hidden transform group-hover/avatar:scale-105 group-hover/avatar:rotate-3 transition-all duration-700">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dailyBest.name}`} className="w-full h-full rounded-[50px]" alt="Best Performer" />
                     </div>
                     <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-sky-600 border-4 border-sky-600 shadow-2xl">
                        <Zap size={32} fill="currentColor" />
                     </div>
                  </div>

                  <div className="space-y-2 relative z-10">
                     <p className="text-sky-100 text-[11px] font-black uppercase tracking-[0.4em]">MVP of the Day</p>
                     <h3 className="text-3xl lg:text-5xl font-black tracking-tight">{dailyBest.name}</h3>
                  </div>
               </div>

               {/* Right: Achievement Details */}
               <div className="lg:col-span-8 p-12 lg:p-20 flex flex-col justify-center space-y-12 bg-white relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-sky-600 flex items-center gap-3">
                        <Award size={16} /> Latest Achievement
                     </h4>
                     <p className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tighter leading-tight max-w-2xl">
                        Successfully managed {dailyBest.activity || 'the primary community session'} with a high performance rating.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Registered</p>
                        <p className="text-xl font-black text-slate-950 flex items-center gap-2">
                           <Clock size={18} className="text-sky-500" /> {dailyBest.time || '10:30 AM'}
                        </p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity Type</p>
                        <p className="text-xl font-black text-slate-950 flex items-center gap-2">
                           <Target size={18} className="text-rose-500" /> {dailyBest.activity || 'Management'}
                        </p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points Earned Today</p>
                        <p className="text-xl font-black text-sky-600 flex items-center gap-2">
                           <Zap size={18} fill="currentColor" /> +{dailyBest.score || 0}
                        </p>
                     </div>
                  </div>

                  <div className="pt-8">
                     <AeroButton className="!rounded-2xl !px-12 !py-5 !bg-slate-950 !text-white shadow-2xl shadow-slate-900/20 !font-black !text-[11px] !uppercase !tracking-widest">
                        View Profile Details
                     </AeroButton>
                  </div>
               </div>
            </div>
         </GlassPanel>
      </motion.section>

      {/* GLOBAL LEADERBOARD SECTION */}
      <motion.section variants={itemVariants} className="space-y-12">
         <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Global Leaderboard</h2>
            <div className="h-px flex-1 bg-slate-100" />
         </div>

         <GlassPanel className="p-0 overflow-hidden border-slate-100 shadow-2xl !bg-white rounded-[48px] relative z-10">
            <header className="p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-50/30">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight">Highest Overall Rankings</h3>
                  <p className="text-sm font-medium text-slate-400">A comprehensive list of all members by their total accumulated score.</p>
               </div>
               
               <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-xl">
                  {['All Time', 'This Month', 'This Week'].map((f, i) => (
                     <button 
                        key={f} 
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                           ${i === 0 ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-950'}`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </header>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/50">
                        {['Rank', 'Member', 'Total Score', 'Engagement', 'Status', 'Action'].map(th => (
                           <th key={th} className="px-12 py-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">{th}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {globalRankings.length > 0 ? globalRankings.map((p, idx) => (
                        <tr key={p.id} className="group hover:bg-sky-50 transition-colors">
                           <td className="px-12 py-10">
                              <span className={`text-4xl font-black tracking-tighter ${idx === 0 ? 'text-sky-600' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-slate-200'} group-hover:scale-110 inline-block transition-transform`}>
                                 {(idx + 1).toString().padStart(2, '0')}
                              </span>
                           </td>
                           <td className="px-12 py-10">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-1 group-hover:rotate-6 transition-transform shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-full h-full rounded-xl" />
                                 </div>
                                 <div>
                                    <p className="font-black text-slate-950 text-lg tracking-tight">{p.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Member</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-12 py-10">
                              <div className="flex items-baseline gap-2">
                                 <span className="text-2xl font-black text-slate-950 tracking-tighter">{(p.score || 0).toLocaleString()}</span>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</span>
                              </div>
                           </td>
                           <td className="px-12 py-10">
                              <div className="space-y-2 max-w-[120px]">
                                 <div className="flex justify-between items-center text-[10px] font-black text-slate-950">
                                    <span>High</span>
                                    <TrendingUp size={12} className="text-emerald-500" />
                                 </div>
                                 <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                    <motion.div 
                                       initial={{ width: 0 }}
                                       whileInView={{ width: '85%' }}
                                       className="h-full bg-sky-600 rounded-full"
                                    />
                                 </div>
                              </div>
                           </td>
                           <td className="px-12 py-10">
                              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                 <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Online
                              </span>
                           </td>
                           <td className="px-12 py-10 text-right">
                              <button className="w-12 h-12 rounded-2xl bg-white text-slate-300 hover:bg-slate-950 hover:text-white transition-all duration-500 border border-slate-100 shadow-sm flex items-center justify-center">
                                 <ArrowUpRight size={20} />
                              </button>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan="6" className="py-20 text-center opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">
                              Syncing Community Data...
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
            
            <footer className="p-12 bg-slate-50/50 text-center border-t border-slate-100">
               <AeroButton className="!px-16 !py-5 !rounded-2xl !bg-sky-600 shadow-2xl shadow-sky-600/20 !font-black !text-[11px] !uppercase !tracking-widest">
                  View Full Standings
               </AeroButton>
            </footer>
         </GlassPanel>
      </motion.section>

      <TechnicalDivider />
    </motion.div>
  );
};

export default Leaderboard;
