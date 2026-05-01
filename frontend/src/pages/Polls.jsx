import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { votePoll } from '../redux/slices/pollSlice';
import { 
  Radio, Clock, CheckCircle2, Users, ArrowRight, ArrowUpRight,
  Terminal, Activity, Zap, Target, Lock, Unlock,
  BarChart3, MessageCircle, Share2, Info, Plus,
  TrendingUp, Layers, MousePointer2, ShieldCheck,
  ChevronRight, Sparkles, Filter, Globe, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AeroCard, AeroButton, GlassPanel, TechnicalDivider } from '../components/AeroUI';
import SEO from '../components/SEO';

const Polls = () => {
  const dispatch = useDispatch();
  const pollState = useSelector((state) => state.poll) || {};
  const authState = useSelector((state) => state.auth) || {};
  const polls = pollState.polls || [];
  const user = authState.user;

  const [selectedPoll, setSelectedPoll] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 pb-32 pt-20 px-4 lg:px-0"
    >
      <SEO
        title="Community Polls"
        description="Vote on active Vanguard AERO community polls. Your voice shapes the direction of squadron decisions and events."
        url="/polls"
        noindex={true}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Community Polls — Vanguard AERO',
          description: 'Active voting polls for the Vanguard AERO community.',
          url: 'https://vanguard-aero.vercel.app/polls',
        }}
      />
      {/* Light-Themed Modern Header */}
      <header className="relative max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-slate-100 pb-16">
        <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-sky-600 rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
                  <Globe size={24} className="animate-pulse" />
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500">Community Engagement</p>
                  <h1 className="text-4xl lg:text-7xl font-black text-slate-950 tracking-tighter leading-none">
                    COMMUNITY <span className="text-sky-600">POLLS</span>
                  </h1>
               </div>
            </div>
            <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed border-l-2 border-sky-500 pl-8">
               Share your voice with the community. Your input helps guide our collective projects and decision making.
            </p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Polls</p>
              <p className="text-2xl font-black text-slate-950 tabular-nums">{polls.length} / {polls.length}</p>
           </div>
           <div className="w-px h-10 bg-slate-200 hidden sm:block" />
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-100 shadow-lg overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=N${i}`} />
                </div>
              ))}
           </div>
        </div>
      </header>

      {/* Modern Light Stacked List */}
      <div className="max-w-6xl mx-auto space-y-4">
        {polls.length > 0 ? (
          polls.map((poll) => (
            <motion.div 
              key={poll.id} 
              variants={itemVariants}
              onClick={() => setSelectedPoll(selectedPoll === poll.id ? null : poll.id)}
              className="group cursor-pointer"
            >
               <div className={`relative transition-all duration-700 overflow-hidden rounded-[32px] border-2 shadow-xl
                  ${selectedPoll === poll.id 
                    ? 'bg-white border-sky-500/30 shadow-2xl shadow-sky-500/10 -translate-y-2' 
                    : 'bg-white/80 border-white hover:border-sky-100 hover:shadow-2xl'}`}>
                  
                  {/* Subtle Glow Layer */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none
                     ${selectedPoll === poll.id ? 'bg-sky-500/[0.03]' : 'bg-sky-500/[0.01]'}`} />

                  <div className="p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                     <div className="flex items-center gap-8 flex-1">
                        <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-700
                           ${selectedPoll === poll.id ? 'bg-sky-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600'}`}>
                           {selectedPoll === poll.id ? <CheckCircle2 size={28} /> : <Radio size={24} />}
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-3 mb-1">
                              <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full
                                 ${selectedPoll === poll.id ? 'bg-sky-500 text-white shadow-sm' : 'bg-sky-50 text-sky-600'}`}>
                                 {poll.active ? 'Active' : 'Completed'}
                              </span>
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">#{String(poll.id).slice(-8)}</span>
                           </div>
                           <h3 className={`text-xl lg:text-2xl font-black tracking-tight transition-colors
                              ${selectedPoll === poll.id ? 'text-slate-950' : 'text-slate-900 group-hover:text-sky-600'}`}>
                              {poll.question}
                           </h3>
                        </div>
                     </div>

                     <div className="flex items-center gap-10">
                        <div className="text-right">
                           <p className="text-[9px] font-black uppercase tracking-widest mb-1 text-slate-400">Total Votes</p>
                           <p className="text-xl font-black tabular-nums text-slate-950">{poll.totalVotes}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                           ${selectedPoll === poll.id ? 'bg-slate-100 text-slate-900 rotate-180' : 'bg-slate-50 text-slate-300 group-hover:bg-slate-900 group-hover:text-white'}`}>
                           <ChevronRight size={20} />
                        </div>
                     </div>
                  </div>

                  {/* Expanded Content: Voting Options */}
                  <AnimatePresence>
                    {selectedPoll === poll.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="px-8 pb-12 lg:px-10 lg:pb-16 relative z-10"
                      >
                         <div className="h-px w-full bg-slate-100 mb-12" />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {poll.options.map((option) => {
                               const isVoted = option.voters?.includes(user?.name);
                               const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                               
                               return (
                                 <button 
                                   key={option.id}
                                   disabled={!poll.active}
                                   onClick={(e) => {
                                      e.stopPropagation();
                                      if (poll.active) {
                                        dispatch(votePoll({ pollId: poll.id, optionId: option.id, userName: user?.name }));
                                      }
                                   }}
                                   className={`relative p-8 rounded-[28px] border-2 transition-all duration-700 text-left overflow-hidden group/opt
                                      ${!poll.active ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}
                                      ${isVoted 
                                         ? 'bg-sky-600 border-sky-600 text-white shadow-lg' 
                                         : 'bg-slate-50 border-slate-100 text-slate-600 ' + (poll.active ? 'hover:border-sky-200 hover:bg-white hover:text-sky-600' : '')}`}
                                 >
                                    <div className="relative z-10 flex items-center justify-between">
                                       <div className="flex items-center gap-6">
                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                             ${isVoted ? 'bg-white/20 text-white' : 'bg-white text-slate-300 group-hover/opt:text-sky-600'}`}>
                                             {isVoted ? <CheckCircle2 size={20}/> : <Plus size={20}/>}
                                          </div>
                                          <span className="text-lg font-black tracking-tight">{option.label}</span>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-3xl font-black tabular-nums tracking-tighter">{percentage}%</p>
                                          <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">{option.votes} Votes</p>
                                       </div>
                                    </div>
                                    
                                    {/* Progress Background */}
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      className={`absolute inset-0 -z-0 opacity-10 ${isVoted ? 'bg-white' : 'bg-sky-500'}`} 
                                    />
                                 </button>
                               );
                            })}
                         </div>
                         
                         <div className="mt-12 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            <div className="flex items-center gap-4">
                               <span className="flex items-center gap-2"><Activity size={14} className="text-emerald-500"/> Live Session</span>
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            </div>
                            <div className="flex items-center gap-4">
                               <ShieldCheck size={16} className="text-sky-500" /> Secure Connection
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </motion.div>
          ))
        ) : (
          <div className="py-40 text-center space-y-8 opacity-20">
             <Cpu size={100} strokeWidth={1} className="mx-auto animate-pulse text-slate-400" />
             <p className="text-xl font-black uppercase tracking-[0.4em] text-slate-400">No Active Polls</p>
          </div>
        )}
      </div>

      {/* Community Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { l: 'Voting Security', v: '99.9%', i: ShieldCheck, c: 'text-sky-500' },
           { l: 'Response Rate', v: '84%', i: Activity, c: 'text-emerald-500' },
           { l: 'Total Polls', v: pollState.polls?.length || 0, i: Layers, c: 'text-amber-500' }
         ].map((s, i) => (
            <GlassPanel key={i} className="p-8 border-slate-100 shadow-xl !bg-white group hover:shadow-2xl transition-all">
               <div className="flex items-center justify-between mb-4">
                  <s.i size={24} className={s.c} />
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.l}</p>
               <p className="text-2xl font-black text-slate-950 tracking-tight">{s.v}</p>
            </GlassPanel>
         ))}
      </div>

      <TechnicalDivider />
    </motion.div>
  );
};

export default Polls;
