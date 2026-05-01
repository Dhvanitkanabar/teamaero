import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Activity, Users, Trophy, Radio, MessageSquare, 
  Shield, Zap, Globe, Target, Cpu, TrendingUp,
  MapPin, Clock, ArrowUpRight, Settings, Search,
  Crown, Flame, Droplets, Mountain, Wind, Star, 
  ChevronRight, Sparkles, Layout, Bell, Plus, Calendar as CalendarIcon, User,
  Command, Briefcase, Activity as ActivityIcon, Monitor, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AeroCard, StatCard, GlassPanel, TechnicalDivider, AeroButton } from '../components/AeroUI';
import { rehydrateTeams } from '../redux/slices/leaderboardSlice';
import { rehydrateEvents } from '../redux/slices/eventSlice';
import { format } from 'date-fns';

const Dashboard = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth) || {};
  const userState = useSelector((state) => state.user) || {};
  const { teams } = useSelector((state) => state.leaderboard);
  const { calendarEvents } = useSelector((state) => state.event);
  
  const user = authState.user;
  const members = userState.members || []; 

  useEffect(() => {
    dispatch(rehydrateTeams());
    dispatch(rehydrateEvents());
  }, [dispatch]);

  const teamMeta = {
    aero: { icon: Wind, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-100', isMine: true },
    ignis: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', isMine: false },
    aqua: { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', isMine: false },
    tera: { icon: Mountain, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', isMine: false },
  };

  const displayTeams = teams.map(t => ({
    ...t,
    ...teamMeta[t.id]
  }));

  const myTeam = displayTeams.find(t => t.isMine) || displayTeams[0];

  const upcomingEvents = Object.entries(calendarEvents)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 md:space-y-12 pb-40 pt-10 md:pt-16 px-4 md:px-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
         <motion.div variants={itemVariants} className="lg:col-span-8">
            <div className="h-full bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col justify-between group">
               <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-sky-50 rounded-full blur-[80px] md:blur-[100px] -mr-32 md:-mr-48 -mt-32 md:-mt-48 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-indigo-50/50 rounded-full blur-[60px] md:blur-[80px] -ml-24 md:-ml-32 -mb-24 md:-mb-32 pointer-events-none" />
               
               <div className="space-y-6 md:space-y-8 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-sky-100 shadow-sm">
                     <Command size={12} /> Operations Interface
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-950 tracking-tighter leading-[1.1]">
                     Welcome back, <br className="hidden sm:block"/>
                     <span className="text-sky-600">Operator {user?.name?.split('_')[1] || user?.name || 'Alpha'}</span>
                  </h1>
                  <p className="text-slate-500 text-base md:text-lg lg:text-xl font-medium max-w-xl leading-relaxed">
                     Squadron <span className="text-slate-950 font-black">{myTeam?.name || 'Aero'}</span> is currently maintaining optimal performance. Your strategic overview is ready.
                  </p>
               </div>

               <div className="mt-10 md:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 relative z-10">
                  <div className="p-4 md:p-6 bg-slate-50/80 rounded-2xl md:rounded-3xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm hover:shadow-lg">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Performance</p>
                     <p className="text-xl md:text-2xl font-black text-slate-950 tabular-nums">{myTeam?.score?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="p-4 md:p-6 bg-slate-50/80 rounded-2xl md:rounded-3xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm hover:shadow-lg">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Rank</p>
                     <p className="text-xl md:text-2xl font-black text-slate-950">#01</p>
                  </div>
                  <div className="p-4 md:p-6 bg-slate-50/80 rounded-2xl md:rounded-3xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm hover:shadow-lg">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Missions Logged</p>
                     <p className="text-xl md:text-2xl font-black text-slate-950 tabular-nums">12</p>
                  </div>
                  <div className="p-4 md:p-6 bg-slate-50/80 rounded-2xl md:rounded-3xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm hover:shadow-lg">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">System Status</p>
                     <div className="flex items-center gap-2 pt-1 md:pt-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>

         <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="h-full bg-slate-950 rounded-[32px] md:rounded-[48px] p-8 md:p-10 lg:p-14 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="absolute top-0 right-0 p-8 md:p-10 opacity-[0.03] text-white">
                  <Shield size={160} />
               </div>
               
               <div className="relative group/avatar">
                  <div className="absolute -inset-4 bg-sky-500/30 blur-2xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700" />
                  <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-[32px] md:rounded-[40px] bg-slate-900 p-1.5 border border-white/10 shadow-2xl overflow-hidden transform group-hover/avatar:scale-105 group-hover/avatar:-rotate-3 transition-all duration-700">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Commander" className="w-full h-full rounded-[26px] md:rounded-[34px] bg-slate-800" alt="Commander" />
                  </div>
                  <div className="absolute -bottom-3 md:-bottom-4 -right-3 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-sky-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white border-2 border-slate-950 shadow-xl">
                     <Star size={18} className="fill-white" />
                  </div>
               </div>

               <div className="space-y-2 md:space-y-3 relative z-10">
                  <p className="text-sky-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Squadron Commander</p>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">{myTeam?.leader || 'Admin'}</h3>
                  <p className="text-slate-400 text-xs md:text-sm font-medium">Head of Operations, Team {myTeam?.name}</p>
               </div>

               <div className="pt-2 md:pt-4 w-full relative z-10">
                  <AeroButton className="w-full !rounded-xl md:!rounded-2xl !py-3 md:!py-4 !bg-white/10 !text-white hover:!bg-sky-500 hover:!text-white !border-none !shadow-lg backdrop-blur-md transition-all duration-500 !text-[9px] md:!text-[10px] !font-black !uppercase !tracking-widest">
                     Establish Comms
                  </AeroButton>
               </div>
            </div>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
         <motion.div variants={itemVariants} className="xl:col-span-8 space-y-8 lg:space-y-10">
            <GlassPanel className="p-8 md:p-12 border-slate-100 shadow-xl !bg-white rounded-[32px] md:rounded-[48px] space-y-8 md:space-y-12">
               <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 md:space-y-2">
                     <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">Operational Roadmap</h2>
                     <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled Briefings & Milestones</p>
                  </div>
                  <Link to="/calendar">
                     <AeroButton variant="secondary" className="!py-2.5 !px-6 !text-[9px] !rounded-xl !bg-slate-50 border-slate-200 hover:!bg-white">View Full Roadmap</AeroButton>
                  </Link>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  {upcomingEvents.length > 0 ? upcomingEvents.map(([date, event]) => (
                     <div key={date} className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all duration-500 group hover:shadow-xl">
                        <div className="flex sm:flex-col md:flex-row items-center sm:items-start md:items-center gap-4 md:gap-6 mb-6">
                           <div className="text-center bg-white px-4 py-3 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm group-hover:scale-110 transition-transform duration-500 shrink-0">
                              <p className="text-[9px] md:text-[10px] font-black text-sky-600 uppercase tracking-widest">{format(new Date(date), 'MMM')}</p>
                              <p className="text-xl md:text-2xl font-black text-slate-950 tabular-nums leading-none mt-1">{format(new Date(date), 'dd')}</p>
                           </div>
                           <div className="space-y-1.5">
                              <h4 className="font-black text-slate-950 text-base md:text-lg tracking-tight leading-tight">{event.title}</h4>
                              <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                 <Clock size={12} className="text-sky-500" /> {event.time || 'All Day'}
                              </p>
                           </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                           <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <MapPin size={12} className="text-rose-500 shrink-0" /> <span className="truncate">{event.location || 'Remote'}</span>
                           </p>
                           <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Monitor size={12} className="text-indigo-500 shrink-0" /> <span className="truncate">Lead: {event.organizedBy || 'Command'}</span>
                           </p>
                        </div>
                     </div>
                  )) : (
                     <div className="md:col-span-3 py-16 text-center opacity-40 space-y-4">
                        <Briefcase size={48} className="mx-auto text-slate-400" strokeWidth={1.5} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No Operations Scheduled</p>
                     </div>
                  )}
               </div>
            </GlassPanel>

            <GlassPanel className="p-8 md:p-12 border-slate-100 shadow-xl !bg-white rounded-[32px] md:rounded-[48px] space-y-8 md:space-y-12">
               <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 md:space-y-2">
                     <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">Global Standings</h2>
                     <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Squadron Performance Metrics</p>
                  </div>
                  <Link to="/leaderboard">
                     <AeroButton variant="secondary" className="!py-2.5 !px-6 !text-[9px] !rounded-xl !bg-slate-50 border-slate-200 hover:!bg-white">Access Standings</AeroButton>
                  </Link>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {displayTeams.map((team) => (
                     <div key={team.name} className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] border transition-all duration-500 group ${team.isMine ? 'bg-sky-50/50 border-sky-100 shadow-md' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                           <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center ${team.bg} ${team.color} border ${team.border} group-hover:scale-110 transition-transform duration-500`}>
                              <team.icon size={20} className="md:w-6 md:h-6" />
                           </div>
                           <div className="text-right">
                              <p className="text-xl md:text-2xl font-black text-slate-950 tabular-nums leading-none mb-1">{team.score.toLocaleString()}</p>
                              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Net Score</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <div>
                                 <h4 className="font-black text-slate-950 text-base md:text-lg tracking-tight leading-tight">{team.name}</h4>
                                 <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">CMDR: {team.leader}</p>
                              </div>
                              {team.isMine && <span className="text-[8px] px-3 py-1 bg-sky-600 text-white rounded-full font-black uppercase tracking-widest shadow-sm">Your Unit</span>}
                           </div>
                           <div className="h-1.5 md:h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min((team.score / 2000) * 100, 100)}%` }}
                                 transition={{ duration: 1.5, ease: "easeOut" }}
                                 className={`h-full rounded-full ${team.isMine ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.4)]' : 'bg-slate-300'}`}
                              />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </GlassPanel>
         </motion.div>

         <motion.div variants={itemVariants} className="xl:col-span-4 space-y-8 lg:space-y-10">
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-xl p-8 md:p-10 space-y-8 md:space-y-10">
               <div className="flex items-center justify-between">
                  <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Active Personnel</h3>
                  <ActivityIcon size={16} className="text-emerald-500 animate-pulse" />
               </div>
               <div className="space-y-4 md:space-y-6">
                  {members.length > 0 ? members.slice(0, 4).map((m) => (
                     <div key={m.id} className="flex items-center justify-between group cursor-pointer p-3 md:p-4 -mx-3 md:-mx-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3 md:gap-4">
                           <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border border-slate-200 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                              <img src={m.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} className="w-full h-full rounded-[10px]" alt={m.name} />
                           </div>
                           <div>
                              <p className="font-black text-slate-950 text-xs md:text-sm tracking-tight leading-tight mb-0.5">{m.name}</p>
                              <p className="text-[8px] md:text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Active Link</p>
                           </div>
                        </div>
                        <button className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-sky-600 group-hover:border-sky-100 group-hover:bg-sky-50 transition-all shadow-sm">
                           <MessageSquare size={14} className="md:w-4 md:h-4" />
                        </button>
                     </div>
                  )) : (
                     <div className="py-10 text-center opacity-40 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Establishing Network Link...
                     </div>
                  )}
               </div>
               <Link to="/members">
                  <AeroButton variant="secondary" className="w-full !rounded-xl md:!rounded-2xl !py-3.5 md:!py-4 !text-[9px] md:!text-[10px] !bg-slate-950 hover:!bg-slate-900 !text-white !border-none transition-colors">
                     View Complete Roster
                  </AeroButton>
               </Link>
            </div>

            <div className="bg-slate-950 rounded-[32px] md:rounded-[40px] p-8 md:p-10 text-white space-y-6 shadow-2xl relative overflow-hidden group border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Award size={120} />
               </div>
               <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-500/20 rounded-xl md:rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-lg relative z-10 backdrop-blur-md">
                  <Trophy size={24} className="text-indigo-400" />
               </div>
               <div className="space-y-2 md:space-y-3 relative z-10">
                  <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">Hall of Records</h4>
                  <p className="text-xs md:text-sm font-medium text-slate-400 leading-relaxed max-w-[90%]">
                     Recognizing distinguished operational excellence and platform-wide achievements.
                  </p>
               </div>
               <Link to="/wall-of-fame" className="block relative z-10 pt-2">
                  <AeroButton className="w-full !rounded-xl md:!rounded-2xl !py-3.5 md:!py-4 !bg-indigo-600 hover:!bg-indigo-500 !text-white !border-none !shadow-xl !font-black !text-[9px] md:!text-[10px] !uppercase !tracking-widest transition-colors">
                     Access Archives
                  </AeroButton>
               </Link>
            </div>
         </motion.div>
      </div>

      <TechnicalDivider />
    </motion.div>
  );
};

export default Dashboard;
