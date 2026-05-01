import React from 'react';
import { Activity, Server, Database, Globe, RefreshCcw, ShieldCheck, Zap, Cpu, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { AeroCard, AeroButton, GlassPanel } from '../../components/AeroUI';

const AdminDashboardTwo = () => {
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
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-200 pb-12">
        <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-sky-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
               <Cpu size={12}/> System Monitor
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-slate-950 tracking-tight leading-none">System <span className="text-sky-600">HEALTH</span></h1>
            <p className="text-slate-500 text-lg lg:text-xl font-medium opacity-80 border-l-2 border-sky-500 pl-6 max-w-2xl">
              Real-time diagnostics for global network stability and localized environment integrity across the Vanguard cluster.
            </p>
        </div>
        
        <GlassPanel className="p-6 flex items-center gap-5 !bg-sky-600 text-white shadow-xl shadow-sky-500/20 min-w-[280px] border-none">
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-xl">
              <RefreshCcw size={20}/>
           </div>
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-100 mb-0.5">Platform Uptime</p>
              <p className="text-xl font-black tabular-nums">99.998%</p>
           </div>
        </GlassPanel>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Server Load', value: '12%', status: 'Healthy', icon: Server, color: 'sky' },
          { label: 'Database Status', value: '99.9%', status: 'Stable', icon: Database, color: 'indigo' },
          { label: 'Active Connections', value: '142', status: 'Optimal', icon: Activity, color: 'sky' },
          { label: 'Network Latency', value: '24ms', status: 'Excellent', icon: Globe, color: 'emerald' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <GlassPanel className="group hover:bg-white transition-all duration-500 border-slate-200 shadow-lg !bg-white/80">
               <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:text-sky-600 group-hover:bg-sky-50 transition-all border border-slate-100 shadow-sm">
                     <stat.icon size={22}/>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">{stat.status}</span>
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-950 tracking-tight tabular-nums">{stat.value}</h3>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <motion.div variants={itemVariants} className="lg:col-span-8">
            <GlassPanel className="p-0 overflow-hidden shadow-xl border-slate-200 !bg-white/80">
               <header className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Terminal size={18}/>
                     </div>
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Activity Stream</h3>
                  </div>
                  <AeroButton variant="secondary" className="!px-6 !py-2 !rounded-xl !text-[10px] !bg-white border-slate-100 shadow-sm">Clear Buffer</AeroButton>
               </header>
               
               <div className="p-8 space-y-4 bg-white/40">
                  {[1, 2, 3, 4, 5, 6].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 group cursor-pointer hover:shadow-md transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-sky-500 animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.6)]' : 'bg-slate-200'}`} />
                          <span className="text-sm font-bold text-slate-950 tracking-tight">System Handshake <span className="text-slate-400 font-mono text-[9px] uppercase ml-3 bg-slate-50 px-2 py-0.5 rounded-md">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span></span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{i * 2}s ago</span>
                    </div>
                  ))}
               </div>
            </GlassPanel>
         </motion.div>

         <motion.div variants={itemVariants} className="lg:col-span-4">
            <GlassPanel className="bg-slate-900 text-white p-10 h-full flex flex-col relative overflow-hidden shadow-2xl !rounded-[40px] border-none">
               <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />
               
               <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-3 mb-10">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sky-500 border border-white/10 backdrop-blur-xl">
                        <ShieldCheck size={24}/>
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">Security Protocols</span>
                  </div>
                  
                  <h3 className="text-3xl font-black tracking-tight mb-4">Network Context</h3>
                  <p className="text-slate-400 text-base leading-relaxed mb-10 font-medium opacity-80">
                    Continuous monitoring of authentication environment for behavioral patterns. All protocols active at <span className="text-white font-bold border-b border-sky-500 pb-1">Level 7 Protection</span>.
                  </p>

                  <div className="space-y-4">
                     {[
                       { label: 'Access Logs', value: 'Verified', color: 'text-emerald-500' },
                       { label: 'Data Encryption', value: 'AES-256', color: 'text-sky-500' },
                       { label: 'Environment Locks', value: 'Active', color: 'text-sky-400' }
                     ].map(x => (
                       <div key={x.label} className="p-5 bg-white/5 rounded-2xl border border-white/5 group cursor-pointer hover:bg-white/10 transition-all">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{x.label}</p>
                          <p className={`text-base font-black ${x.color}`}>{x.value}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="mt-12 pt-10 border-t border-white/5 relative z-10">
                  <AeroButton className="w-full !bg-white !text-slate-900 hover:!bg-sky-500 hover:!text-white transition-all duration-500 py-5 !rounded-2xl shadow-xl">Perform System Audit</AeroButton>
               </div>
            </GlassPanel>
         </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboardTwo;
