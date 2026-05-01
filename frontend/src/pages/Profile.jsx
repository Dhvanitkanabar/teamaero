import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck, LogOut, Settings, Award, Activity, Zap, Cpu, Key, ChevronRight, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { AeroCard, AeroButton, GlassPanel, TechnicalDivider } from '../components/AeroUI';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const memberId = useMemo(() => {
    if (!user) return '';
    const hash = user.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `ID-${hash.toString(36).toUpperCase()}-${user.id || '00'}`;
  }, [user]);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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
      className="max-w-7xl mx-auto space-y-16 pb-32 pt-16"
    >
      {/* Identity Portfolio Header */}
      <motion.header 
         variants={itemVariants}
         className="bg-white/80 backdrop-blur-md p-10 lg:p-20 rounded-[48px] border border-slate-200 text-slate-950 flex flex-col md:flex-row items-center gap-12 lg:gap-16 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-48 h-48 lg:w-64 lg:h-64 rounded-[40px] bg-white border-4 border-slate-50 p-1.5 shadow-2xl group overflow-hidden">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full rounded-[34px] group-hover:scale-110 transition-transform duration-1000 object-cover" alt="Profile" />
           <div className="absolute -bottom-4 -right-4 bg-slate-900 w-16 h-16 rounded-2xl border-4 border-white flex items-center justify-center shadow-xl">
              <Activity size={24} className="text-sky-400"/>
           </div>
        </div>
        
        <div className="flex-grow text-center md:text-left relative z-10 space-y-8">
           <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-sky-100">
                 <User size={14}/> User Profile
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none text-slate-950">{user.name}</h1>
           </div>
           
           <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-6 py-3 bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 rounded-2xl shadow-sm text-slate-500">
                 <ShieldCheck size={16} className="text-sky-500"/> Trust Score: 99.4%
              </div>
              <div className="px-6 py-3 bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 rounded-2xl shadow-sm text-slate-500">
                 <Award size={16} className="text-amber-500"/> {user.role === 'admin' ? 'Strategic Council' : 'Community Member'}
              </div>
           </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Identity Data Strata */}
         <motion.div variants={itemVariants} className="lg:col-span-8 space-y-12">
            <GlassPanel className="p-10 lg:p-12 border-slate-200 shadow-xl !bg-white/80">
               <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-4 mb-10 text-slate-400">
                  <Cpu className="text-sky-500" size={20}/> Account Verification
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { l: 'User ID', v: memberId, i: Key },
                    { l: 'Handle', v: `@${user.name.toLowerCase().replace(' ', '_')}`, i: Activity },
                    { l: 'Access Level', v: user.role.toUpperCase(), i: ShieldCheck },
                    { l: 'Reputation', v: '99.98 Score', i: Zap }
                  ].map(x => (
                    <div key={x.l} className="space-y-3 group cursor-pointer">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none ml-1">{x.l}</p>
                       <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                          <span className="text-xl font-black text-slate-900 tracking-tight">{x.v}</span>
                          <x.i size={20} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                       </div>
                    </div>
                  ))}
               </div>
            </GlassPanel>

            <GlassPanel className="p-10 lg:p-12 border-slate-200 shadow-xl !bg-white/80">
               <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-4 mb-10 text-slate-400">
                  <Settings className="text-sky-500" size={20}/> Security & Privacy
               </h3>
               <div className="space-y-4">
                  {[
                    { l: 'Dashboard Display', s: true, d: 'Display real-time community insights on the dashboard.' },
                    { l: 'Verified Login', s: true, d: 'Secure account access using multi-factor identity hashes.' },
                    { l: 'Auto Sync', s: false, d: 'Automatically synchronize profile data across regional hubs.' }
                  ].map(x => (
                    <div key={x.l} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-500 group">
                       <div className="space-y-1">
                          <p className="text-xl font-black text-slate-950 tracking-tight">{x.l}</p>
                          <p className="text-xs font-medium text-slate-400 max-w-lg opacity-80">{x.d}</p>
                       </div>
                       <button className={`w-14 h-8 rounded-full relative transition-all duration-500 ${x.s ? 'bg-sky-500 shadow-lg' : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-sm ${x.s ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>
                  ))}
               </div>
            </GlassPanel>
         </motion.div>

         {/* Actions Strata */}
         <motion.div variants={itemVariants} className="lg:col-span-4 space-y-12">
            <GlassPanel className="p-10 lg:p-12 border-slate-200 shadow-xl !bg-white/80 flex flex-col h-full">
               <h3 className="text-xs font-black uppercase tracking-widest mb-10 text-slate-400">Profile Settings</h3>
               <div className="space-y-4 flex-1">
                  {[
                    { l: 'Security Settings', i: Settings },
                    { l: 'Activity Logs', i: ShieldCheck },
                    { l: 'Community Settings', i: Cpu }
                  ].map(x => (
                    <button key={x.l} className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-500 flex justify-between items-center group">
                       <span className="flex items-center gap-4 text-slate-900 font-bold text-sm"><x.i size={20} className="text-sky-500"/> {x.l}</span>
                       <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                  
                  <div className="h-px bg-slate-100 my-6" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full p-8 rounded-3xl bg-slate-900 text-white flex items-center justify-between group hover:bg-rose-600 transition-all duration-700 shadow-xl"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-rose-600 transition-all">
                           <LogOut size={24}/>
                        </div>
                        <div className="text-left">
                           <p className="text-xl font-black tracking-tight leading-none mb-1">Log Out</p>
                           <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Terminate Session</p>
                        </div>
                     </div>
                     <ChevronRight size={20} className="opacity-20 group-hover:translate-x-2 transition-all" />
                  </button>
               </div>
               
               <div className="mt-12 text-center">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Community Dashboard v04.1</p>
               </div>
            </GlassPanel>

            <GlassPanel className="p-10 lg:p-12 !bg-slate-900 text-white space-y-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                <Activity size={32} className="text-sky-400" />
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-sky-400 leading-none">Activity Score</p>
                   <p className="text-6xl font-black tracking-tight italic">99.98%</p>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-60 border-l-2 border-sky-500/40 pl-6">
                   Your profile is operating with high fidelity across all community nodes.
                </p>
                <AeroButton className="w-full !py-4 !text-xs !rounded-2xl">Refresh Analytics</AeroButton>
            </GlassPanel>
         </motion.div>
      </div>
      <TechnicalDivider />
    </motion.div>
  );
};

export default Profile;
