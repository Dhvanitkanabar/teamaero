import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Settings, User, Info, Trophy, LayoutGrid, List,
  Activity, Zap, MapPin, Shield, Terminal, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, 
  eachDayOfInterval, isWednesday
} from 'date-fns';
import { AeroCard, AeroButton, GlassPanel, TechnicalDivider } from '../components/AeroUI';
import SEO from '../components/SEO';

const Calendar = () => {
  const { calendarEvents } = useSelector((state) => state.event);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const dayInterval = eachDayOfInterval({ start: startDate, end: endDate });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 pb-32 pt-16"
    >
      <SEO
        title="Calendar"
        description="Vanguard AERO community calendar. Browse and track scheduled events, group sessions, and upcoming squadron milestones."
        url="/calendar"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Community Calendar — Vanguard AERO',
          description: 'Browse upcoming Vanguard AERO community events, group sessions, and squadron milestones.',
          url: 'https://vanguard-aero.vercel.app/calendar',
        }}
      />
      {/* Community Calendar Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-slate-200 pb-12">
        <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
               <CalendarIcon size={12}/> Event Schedule
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-slate-950 tracking-tight leading-none">
              Community <span className="text-sky-600">CALENDAR</span>
            </h1>
            <p className="text-slate-500 text-lg lg:text-xl font-medium opacity-80 border-l-2 border-sky-500 pl-6 max-w-2xl">
              Mapping upcoming community events, group discussions, and collective milestones.
            </p>
        </div>
        
        <GlassPanel className="flex items-center gap-4 bg-white/80 border-slate-200 p-3 rounded-3xl shadow-xl">
           <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              <ChevronLeft size={20}/>
           </button>
           <span className="text-lg font-black text-slate-950 px-8 min-w-[200px] text-center tracking-tight">
             {format(currentMonth, 'MMMM yyyy')}
           </span>
           <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              <ChevronRight size={20}/>
           </button>
        </GlassPanel>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8">
           <div className="grid grid-cols-7 mb-6 px-4">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{day}</div>
             ))}
           </div>
           
           <motion.div 
              variants={containerVariants}
              className="grid grid-cols-7 gap-3 lg:gap-4"
           >
             {dayInterval.map((d, i) => {
               const dateKey = format(d, 'yyyy-MM-dd');
               const activeMonth = isSameMonth(d, monthStart);
               const selected = isSameDay(d, selectedDate);
               const event = calendarEvents[dateKey];
               const today = isSameDay(d, new Date());

               return (
                 <motion.div
                   key={i}
                   variants={itemVariants}
                   onClick={() => setSelectedDate(d)}
                   className={`relative min-h-[120px] lg:min-h-[160px] p-4 lg:p-6 cursor-pointer rounded-3xl lg:rounded-[40px] overflow-hidden transition-all duration-500 border-2
                     ${!activeMonth ? 'bg-slate-50/20 opacity-30 border-transparent pointer-events-none' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-100'}
                     ${selected ? 'bg-white border-sky-500 shadow-sky-100' : ''}`}
                 >
                   <div className="flex justify-between items-start relative z-10">
                      <span className={`text-xl lg:text-2xl font-black tracking-tight ${
                        !activeMonth ? 'text-slate-200' : today ? 'text-sky-600 underline' : 'text-slate-950'}`}>
                        {format(d, 'd')}
                      </span>
                      {event && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full shadow-lg animate-pulse" />}
                   </div>

                   {event && (
                      <div className="mt-4 p-2 lg:p-3 bg-sky-600 text-white rounded-xl lg:rounded-2xl text-[8px] lg:text-[9px] font-black uppercase tracking-widest shadow-lg relative z-10 text-center truncate">
                         {event.title || event.game}
                      </div>
                   )}
                 </motion.div>
               );
             })}
           </motion.div>
        </div>

        <aside className="lg:col-span-4 h-full">
           <AnimatePresence mode="wait">
              <motion.div 
                key={format(selectedDate, 'T')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                 <GlassPanel className="h-full flex flex-col p-8 lg:p-10 border-slate-200 shadow-xl !bg-white/80 min-h-[600px]">
                    <header className="mb-12 border-b border-slate-100 pb-8">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Event Timeline</p>
                       <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-none">
                         {format(selectedDate, 'EEEE')}<br/>
                         <span className="text-sky-600 font-black">{format(selectedDate, 'MMMM do')}</span>
                       </h2>
                    </header>

                    {calendarEvents[format(selectedDate, 'yyyy-MM-dd')] ? (
                      <div className="space-y-10 flex-1">
                         <div className="p-8 bg-sky-600 text-white rounded-3xl shadow-xl shadow-sky-600/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] pointer-events-none" />
                            <div className="flex items-center gap-4 mb-8 relative z-10">
                               <Trophy size={20} className="text-white" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-sky-50">Community Milestone</span>
                            </div>
                            <h4 className="text-2xl lg:text-3xl font-black mb-2 relative z-10 tracking-tight">{calendarEvents[format(selectedDate, 'yyyy-MM-dd')].title || calendarEvents[format(selectedDate, 'yyyy-MM-dd')].game}</h4>
                            <p className="text-sm font-medium text-sky-50 opacity-80 relative z-10">Scheduled Community Engagement</p>
                         </div>

                         <div className="space-y-4">
                            {[
                              { l: 'Arranged By', v: calendarEvents[format(selectedDate, 'yyyy-MM-dd')].organizedBy || 'Vanguard Team', i: User },
                              { l: 'Time', v: calendarEvents[format(selectedDate, 'yyyy-MM-dd')].time || 'All Day', i: Clock },
                              { l: 'Location', v: calendarEvents[format(selectedDate, 'yyyy-MM-dd')].location || 'Remote', i: MapPin },
                              { l: 'Status', v: 'Confirmed', i: Shield }
                            ].map(x => (
                              <div key={x.l} className="flex items-center gap-6 p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                                 <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-sky-500 shadow-sm transition-colors">
                                    <x.i size={20}/>
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{x.l}</p>
                                    <p className="text-base font-black text-slate-950 tracking-tight">{x.v}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8">
                         <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 shadow-inner">
                            <Activity size={40} className="opacity-40 animate-pulse"/>
                         </div>
                         <div className="space-y-3">
                            <p className="text-2xl font-black text-slate-950 tracking-tight">Free Day</p>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[240px] mx-auto">
                               No community events scheduled for this window.
                            </p>
                         </div>
                      </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-100">
                       <AeroButton className="w-full !py-5 !rounded-2xl !text-[10px] !font-black !uppercase !tracking-widest !shadow-xl !bg-sky-600">Sync Calendar <Terminal size={18} className="inline ml-3"/></AeroButton>
                    </div>
                 </GlassPanel>
              </motion.div>
           </AnimatePresence>
        </aside>
      </div>
      <TechnicalDivider />
    </motion.div>
  );
};

export default Calendar;
