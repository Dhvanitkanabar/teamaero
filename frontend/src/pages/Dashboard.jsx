import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Activity, Users, Trophy, Radio, MessageSquare, 
  Shield, Zap, Globe, Target, Cpu, TrendingUp,
  MapPin, Clock, ArrowUpRight, Settings, Search,
  Crown, Flame, Droplets, Mountain, Wind, Star, 
  ChevronRight, Sparkles, Layout, Bell, Plus, Calendar as CalendarIcon, User
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

  // Map icons and colors for display
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

  // Get upcoming events
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
      className="space-y-12 pb-40 pt-16"
    >
      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
         {/* Welcome & Profile */}
         <motion.div variants={itemVariants} className="lg:col-span-7">
            <div className="h-full bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-12 lg:p-16 relative overflow-hidden flex flex-col justify-between group">
               <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />
               
               <div className="space-y-8 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-sky-100">
                     <Sparkles size={12} /> Recent Updates
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-slate-950 tracking-tighter leading-tight">
                     Hello, <br/>
                     <span className="text-sky-600">{user?.name || 'Member'}</span>
                  </h1>
                  <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-lg leading-relaxed">
                     Your team <span className="text-slate-950 font-black">{myTeam.name}</span> is currently {myTeam.score >= 1400 ? 'leading' : 'active'}. Here is your current overview.
                  </p>
               </div>

               <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                  <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Score</p>
                     <p className="text-2xl font-black text-slate-950">{myTeam.score.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
                     <p className="text-2xl font-black text-slate-950">#01</p>
                  </div>
                  <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Activities</p>
                     <p className="text-2xl font-black text-slate-950">12</p>
                  </div>
                  <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 backdrop-blur-sm group-hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                     <div className="flex items-center gap-1.5 pt-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>

         {/* Leader Spotlight */}
         <motion.div variants={itemVariants} className="lg:col-span-5">
            <div className="h-full bg-sky-600 rounded-[48px] p-10 lg:p-14 flex flex-col items-center justify-center text-center space-y-8 shadow-[0_40px_80px_-20px_rgba(14,165,233,0.3)] relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="absolute top-0 right-0 p-10 opacity-10 text-white">
                  <Crown size={120} />
               </div>
               
               <div className="relative group/avatar">
                  <div className="absolute -inset-4 bg-white/20 blur-2xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700" />
                  <div className="relative w-32 h-32 lg:w-44 lg:h-44 rounded-[40px] bg-white p-2 border-4 border-white/20 shadow-2xl overflow-hidden transform group-hover/avatar:scale-105 group-hover/avatar:-rotate-3 transition-all duration-700">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Devanshi" className="w-full h-full rounded-[30px]" alt="Leader" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-600 border-4 border-sky-600 shadow-xl">
                     <Trophy size={20} />
                  </div>
               </div>

               <div className="space-y-3 relative z-10">
                  <p className="text-sky-100 text-[10px] font-black uppercase tracking-[0.4em]">Team Leader</p>
                  <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight">{myTeam.leader}</h3>
                  <p className="text-sky-50/60 text-sm font-medium">Head of Team {myTeam.name}</p>
               </div>

               <div className="pt-4 relative z-10">
                  <AeroButton className="!rounded-2xl !px-10 !py-4 !bg-white !text-sky-600 !border-none !shadow-2xl !text-[10px] !font-black !uppercase !tracking-widest">
                     Message Leader
                  </AeroButton>
               </div>
            </div>
         </motion.div>
      </div>

      {/* Community Calendar & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Community Calendar Section */}
         <motion.div variants={itemVariants} className="lg:col-span-12">
            <GlassPanel className="p-12 border-slate-100 shadow-2xl !bg-white rounded-[48px] space-y-12">
               <header className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black text-slate-950 tracking-tight">Community Calendar</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upcoming Events & Milestones</p>
                  </div>
                  <Link to="/calendar">
                     <AeroButton variant="secondary" className="!py-2 !px-5 !text-[9px] !rounded-xl !bg-slate-50 border-slate-100">View Full Calendar</AeroButton>
                  </Link>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {upcomingEvents.length > 0 ? upcomingEvents.map(([date, event]) => (
                     <div key={date} className="p-8 rounded-[40px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 transition-all duration-500 group shadow-sm hover:shadow-xl">
                        <div className="flex items-center gap-6 mb-6">
                           <div className="text-center bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                              <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{format(new Date(date), 'MMM')}</p>
                              <p className="text-2xl font-black text-slate-950">{format(new Date(date), 'dd')}</p>
                           </div>
                           <div className="space-y-1">
                              <h4 className="font-black text-slate-950 text-lg tracking-tight leading-tight">{event.title}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                 <Clock size={12} className="text-sky-500" /> {event.time || 'All Day'}
                              </p>
                           </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <MapPin size={12} className="text-rose-500" /> {event.location || 'Remote'}
                           </p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <User size={12} className="text-amber-500" /> Arranged by: {event.organizedBy || 'Admin'}
                           </p>
                        </div>
                     </div>
                  )) : (
                     <div className="md:col-span-3 py-12 text-center opacity-30 space-y-4">
                        <CalendarIcon size={48} className="mx-auto" strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Upcoming Events Scheduled</p>
                     </div>
                  )}
               </div>
            </GlassPanel>
         </motion.div>

         {/* Team Standings */}
         <motion.div variants={itemVariants} className="lg:col-span-8">
            <GlassPanel className="p-12 border-slate-100 shadow-2xl !bg-white rounded-[48px] space-y-12">
               <header className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black text-slate-950 tracking-tight">Leaderboard</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Rankings & Performance</p>
                  </div>
                  <Link to="/leaderboard">
                     <AeroButton variant="secondary" className="!py-2 !px-5 !text-[9px] !rounded-xl !bg-slate-50 border-slate-100">View Rankings</AeroButton>
                  </Link>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {displayTeams.map((team, idx) => (
                     <div key={team.name} className={`p-8 rounded-[40px] border transition-all duration-500 group ${team.isMine ? 'bg-sky-50 border-sky-100 shadow-lg scale-[1.02]' : 'bg-white border-slate-50 hover:border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-8">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${team.bg} ${team.color} border ${team.border} group-hover:scale-110 transition-transform duration-500`}>
                              <team.icon size={24} />
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-black text-slate-950 tabular-nums">{team.score.toLocaleString()}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Team Score</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <div>
                                 <h4 className="font-black text-slate-950 text-lg tracking-tight">{team.name}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead: {team.leader}</p>
                              </div>
                              {team.isMine && <span className="text-[8px] px-2.5 py-1 bg-sky-600 text-white rounded-full font-black uppercase tracking-widest shadow-lg shadow-sky-600/20">Active</span>}
                           </div>
                           <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100 p-0.5">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min((team.score / 2000) * 100, 100)}%` }}
                                 transition={{ duration: 1.5, ease: "easeOut" }}
                                 className={`h-full rounded-full ${team.isMine ? 'bg-sky-600 shadow-[0_0_12px_rgba(14,165,233,0.5)]' : 'bg-slate-200'}`}
                              />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </GlassPanel>
         </motion.div>

         {/* Side Activity */}
         <motion.div variants={itemVariants} className="lg:col-span-4 space-y-10">
            {/* Members Online */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-10 space-y-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">Members Online</h3>
               <div className="space-y-6">
                  {members.length > 0 ? members.slice(0, 4).map((m) => (
                     <div key={m.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 p-0.5 group-hover:scale-110 transition-transform duration-500">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} className="w-full h-full rounded-[10px]" />
                           </div>
                           <div>
                              <p className="font-black text-slate-950 text-sm tracking-tight">{m.name}</p>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Active Now</p>
                           </div>
                        </div>
                        <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-sky-600 transition-all">
                           <MessageSquare size={14} />
                        </button>
                     </div>
                  )) : (
                     <div className="py-8 text-center opacity-20 text-[10px] font-black uppercase tracking-widest">
                        Loading Members...
                     </div>
                  )}
               </div>
               <Link to="/members">
                  <AeroButton variant="secondary" className="w-full !rounded-2xl !py-4 !text-[10px] !bg-slate-950 !text-white !border-none">
                     View All
                  </AeroButton>
               </Link>
            </div>

            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[40px] p-10 text-white space-y-6 shadow-[0_30px_60px_-15px_rgba(245,158,11,0.3)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Trophy size={100} />
               </div>
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                  <Zap size={24} className="text-white fill-white" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-black tracking-tight">Wall of Fame</h4>
                  <p className="text-sm font-medium opacity-80 leading-relaxed">
                     Celebrating our top members and leadership.
                  </p>
               </div>
               <Link to="/wall-of-fame">
                  <AeroButton className="w-full !rounded-2xl !py-4 !bg-white !text-orange-600 !border-none !shadow-xl !font-black !text-[10px] !uppercase !tracking-widest">
                     View Leaderboard
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
