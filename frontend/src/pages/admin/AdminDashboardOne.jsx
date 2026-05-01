import React from 'react';
import { Users, TrendingUp, BarChart3, MessageSquare, Target, Calendar, ArrowUpRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AeroCard, AeroButton, GlassPanel } from '../../components/AeroUI';

const AdminDashboardOne = () => {
  const stats = [
    { label: 'Total Members', value: '1,284', trend: '+12.5%', icon: Users },
    { label: 'Active Sessions', value: '342', trend: '+5.2%', icon: Zap },
    { label: 'Community Votes', value: '8,921', trend: '+18.1%', icon: Target },
    { label: 'Support Queries', value: '12', trend: '-2.4%', icon: MessageSquare },
  ];

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
      className="space-y-12 pb-32 pt-16"
    >
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-sky-100">
          <BarChart3 size={12}/> Strategic Overview
        </div>
        <h1 className="text-4xl lg:text-7xl font-black text-slate-950 tracking-tight leading-none">
          Mission <span className="text-sky-600">CONTROL</span>
        </h1>
        <p className="text-slate-500 text-lg lg:text-xl font-medium opacity-80 border-l-2 border-sky-500 pl-6 max-w-2xl">
          Aggregated community intelligence and membership dynamics for the Vanguard ecosystem.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <GlassPanel className="p-8 group hover:bg-white transition-all duration-500 border-slate-200 shadow-lg !bg-white/80">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <stat.icon size={22}/>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-950 tracking-tight">{stat.value}</h3>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* User Activity Chart Placeholder */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <GlassPanel className="p-10 h-[400px] flex flex-col justify-between shadow-xl border-slate-200 !bg-white/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Membership Growth</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-sky-500 rounded-full" />
                <div className="w-3 h-3 bg-slate-200 rounded-full" />
              </div>
            </div>
            
            {/* Visual Representation of Chart */}
            <div className="flex items-end justify-between gap-2 flex-1 pt-12 pb-4">
              {[40, 70, 45, 90, 65, 80, 50, 85, 100, 75, 60, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-50 rounded-t-lg relative group overflow-hidden h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1.5, delay: i * 0.1 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-sky-600 to-sky-400 group-hover:from-sky-500 group-hover:to-sky-300 transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-4">
              <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
              <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Action Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
          <GlassPanel className="p-10 bg-slate-900 text-white shadow-2xl border-none h-full flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest text-sky-400 mb-8">Next Milestones</h3>
            <div className="space-y-6 flex-1">
              {[
                { title: 'Community Outreach', time: 'Tomorrow, 09:00', icon: Calendar },
                { title: 'Protocol Update', time: 'Apr 28, 14:30', icon: Zap },
                { title: 'Global Sync', time: 'May 02, 10:00', icon: Target },
              ].map((event, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-400">
                    <event.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">{event.title}</p>
                    <p className="text-[10px] font-medium text-slate-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <AeroButton className="w-full mt-8 !py-4 !text-xs !bg-sky-600 !text-white hover:!bg-white hover:!text-slate-950 transition-all duration-500">
              Schedule Operation
            </AeroButton>
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboardOne;
