import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoll, togglePollStatus } from '../redux/slices/pollSlice';
import { updateCalendarEvent } from '../redux/slices/eventSlice';
import { updateTeamScore, updateDailyBest } from '../redux/slices/leaderboardSlice';
import { addNotification } from '../redux/slices/notificationSlice';
import { 
  Shield, Radio, Calendar as CalendarIcon, 
  ListChecks, CheckCircle2, Circle, Plus, Clock, MapPin, Trash2, User, Trophy, Zap, TrendingUp, Star, Award, Target
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { AeroButton, GlassPanel } from '../components/AeroUI';

const AdminControl = () => {
  const dispatch = useDispatch();
  const { polls } = useSelector((state) => state.poll);
  const { calendarEvents } = useSelector((state) => state.event);
  const { teams, dailyBest } = useSelector((state) => state.leaderboard);
  const { members } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('poll');
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });
  const [newCalendarEvent, setNewCalendarEvent] = useState({ 
    date: format(new Date(), 'yyyy-MM-dd'), 
    title: '', 
    time: '', 
    location: '',
    organizedBy: '' 
  });
  
  const [mvpForm, setMvpForm] = useState({
     memberId: dailyBest.id || '',
     activity: dailyBest.activity || '',
     score: dailyBest.score || 0
  });

  const [checkedMembers, setCheckedMembers] = useState(new Set());

  const handleToggleMember = (id) => {
    const next = new Set(checkedMembers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedMembers(next);
  };

  const handleSelectAll = () => setCheckedMembers(new Set(members.map(m => m.id)));
  const handleDeselectAll = () => setCheckedMembers(new Set());
  
  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (newPoll.question && newPoll.options.every(o => o)) {
      const pollData = {
        question: newPoll.question,
        options: newPoll.options.map((opt, i) => ({ id: `opt${i+1}`, label: opt, votes: 0, voters: [] }))
      };
      dispatch(addPoll(pollData));
      
      // Dispatch local notification for immediate feedback
      dispatch(addNotification({
        title: 'Poll Created Successfully',
        message: `Your poll "${newPoll.question}" is now live for the community.`,
        type: 'poll',
        icon: 'Radio'
      }));

      setNewPoll({ question: '', options: ['', ''] });
    }
  };

  const handleAddCalendarEvent = (e) => {
    e.preventDefault();
    if (newCalendarEvent.title && newCalendarEvent.date) {
      dispatch(updateCalendarEvent({
        date: newCalendarEvent.date,
        data: {
          title: newCalendarEvent.title,
          time: newCalendarEvent.time,
          location: newCalendarEvent.location,
          organizedBy: newCalendarEvent.organizedBy,
          type: 'Event'
        }
      }));

      dispatch(addNotification({
        title: 'Event Scheduled',
        message: `"${newCalendarEvent.title}" has been added to the community calendar.`,
        type: 'event',
        icon: 'Calendar'
      }));

      setNewCalendarEvent({ date: format(new Date(), 'yyyy-MM-dd'), title: '', time: '', location: '', organizedBy: '' });
    }
  };

  const handleUpdateScore = (id, newScore) => {
     dispatch(updateTeamScore({ id, score: parseInt(newScore) || 0 }));
     const syncChannel = new BroadcastChannel('vanguard_sync');
     syncChannel.postMessage({ type: 'TEAMS_UPDATED' });
  };

  const handleUpdateMVP = (e) => {
     e.preventDefault();
     const selectedMember = members.find(m => m.id === mvpForm.memberId);
     if (selectedMember) {
        dispatch(updateDailyBest({
           id: selectedMember.id,
           name: selectedMember.name,
           activity: mvpForm.activity,
           score: parseInt(mvpForm.score),
           time: `Today, ${format(new Date(), 'hh:mm a')}`
        }));

        dispatch(addNotification({
          title: 'MVP Spotlight Updated',
          message: `${selectedMember.name} is now the featured performer of the day.`,
          type: 'ranking',
          icon: 'Star'
        }));

        const syncChannel = new BroadcastChannel('vanguard_sync');
        syncChannel.postMessage({ type: 'TEAMS_UPDATED' });
     }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-32 pt-16 px-4 lg:px-0"
    >
      {/* Management Portal Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-200 pb-12">
        <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-sky-500/20">
               <Shield size={12}/> Admin Control Center
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-slate-950 tracking-tighter leading-none">
              MANAGEMENT <span className="text-sky-600">PORTAL</span>
            </h1>
            <p className="text-slate-500 text-lg lg:text-xl font-medium opacity-80 border-l-2 border-sky-500 pl-6 max-w-2xl">
              Simplified administration terminal for community polls, events, scores, and participation.
            </p>
        </div>
        
        <nav className="flex items-center gap-1 bg-white p-1.5 rounded-2xl shadow-xl border border-slate-100">
          {[
            { id: 'poll', label: 'Polls', icon: Radio },
            { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
            { id: 'scores', label: 'Scores', icon: Trophy },
            { id: 'mvp', label: 'MVP', icon: Star },
            { id: 'checkin', label: 'Check-In', icon: ListChecks },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon size={14}/> {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabBg" 
                  className="absolute inset-0 bg-slate-950 rounded-xl shadow-lg shadow-slate-900/20"
                />
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'mvp' && (
             <motion.div key="mvp" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                   <GlassPanel className="space-y-8 p-10 border-slate-100 shadow-xl !bg-white">
                      <header>
                         <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-400/20">
                            <Star size={24} />
                         </div>
                         <h3 className="text-2xl font-black text-slate-950 tracking-tight">Set Daily Best Performer</h3>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Award the MVP spotlight for today's event.</p>
                      </header>
                      
                      <form onSubmit={handleUpdateMVP} className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Member</label>
                            <select 
                               className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white outline-none"
                               value={mvpForm.memberId}
                               onChange={(e) => setMvpForm({...mvpForm, memberId: e.target.value})}
                            >
                               <option value="">Select a member...</option>
                               {members.map(m => (
                                  <option key={m.id} value={m.id}>{m.name} ({m.accountId})</option>
                               ))}
                            </select>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Achievement/Activity</label>
                            <input 
                               placeholder="e.g. Strategic Planning..."
                               className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white outline-none"
                               value={mvpForm.activity}
                               onChange={(e) => setMvpForm({...mvpForm, activity: e.target.value})}
                            />
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Points Earned Today</label>
                            <div className="relative">
                               <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                               <input 
                                  type="number"
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-950 focus:bg-white outline-none"
                                  value={mvpForm.score}
                                  onChange={(e) => setMvpForm({...mvpForm, score: e.target.value})}
                               />
                            </div>
                         </div>

                         <AeroButton type="submit" className="w-full py-5 !rounded-2xl !bg-amber-500 shadow-xl shadow-amber-500/20">Set MVP Now</AeroButton>
                      </form>
                   </GlassPanel>
                </div>

                <div className="lg:col-span-7">
                   <GlassPanel className="p-12 border-slate-100 shadow-xl !bg-white rounded-[40px] relative overflow-hidden group h-full">
                      <div className="absolute top-0 right-0 p-12 opacity-5">
                         <Award size={160} />
                      </div>
                      <div className="space-y-8 relative z-10">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Current MVP Preview</p>
                         <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-3xl border-4 border-amber-400/20 p-1">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dailyBest.name}`} className="w-full h-full rounded-2xl" />
                            </div>
                            <div>
                               <h4 className="text-3xl font-black text-slate-950 tracking-tight">{dailyBest.name}</h4>
                               <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{dailyBest.time}</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Achievement</p>
                               <p className="text-lg font-black text-slate-950">{dailyBest.activity}</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Points</p>
                               <p className="text-lg font-black text-amber-600">+{dailyBest.score}</p>
                            </div>
                         </div>
                      </div>
                   </GlassPanel>
                </div>
             </motion.div>
          )}

          {activeTab === 'scores' && (
             <motion.div key="scores" variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {teams.map((team) => (
                      <GlassPanel key={team.id} className="p-8 space-y-6 border-slate-100 shadow-xl !bg-white group hover:border-sky-200 transition-all">
                         <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sky-600 border border-slate-100">
                               <Zap size={20} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Division: {team.id}</span>
                         </div>
                         
                         <div className="space-y-1">
                            <h4 className="text-xl font-black text-slate-950 tracking-tight">{team.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leader: {team.leader}</p>
                         </div>

                         <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Current Score</label>
                            <div className="relative">
                               <input 
                                  type="number"
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-950 focus:bg-white outline-none focus:border-sky-200 transition-all"
                                  value={team.score}
                                  onChange={(e) => handleUpdateScore(team.id, e.target.value)}
                               />
                               <TrendingUp size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-sky-500" />
                            </div>
                         </div>

                         <div className="pt-2">
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                               <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((team.score / 2000) * 100, 100)}%` }}
                                  className="h-full bg-sky-600"
                               />
                            </div>
                         </div>
                      </GlassPanel>
                   ))}
                </div>
             </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div key="calendar" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-5">
                  <GlassPanel className="space-y-8 p-10 border-slate-100 shadow-xl !bg-white">
                     <header>
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/20">
                           <CalendarIcon size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-950 tracking-tight">Schedule Event</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Add a new milestone to the community calendar.</p>
                     </header>
                     
                     <form onSubmit={handleAddCalendarEvent} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Title</label>
                           <input 
                              placeholder="Monthly Meeting..."
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white outline-none focus:border-amber-200 transition-all"
                              value={newCalendarEvent.title}
                              onChange={(e) => setNewCalendarEvent({...newCalendarEvent, title: e.target.value})}
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
                              <input 
                                 type="date"
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white outline-none"
                                 value={newCalendarEvent.date}
                                 onChange={(e) => setNewCalendarEvent({...newCalendarEvent, date: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Time</label>
                              <input 
                                 type="time"
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white outline-none"
                                 value={newCalendarEvent.time}
                                 onChange={(e) => setNewCalendarEvent({...newCalendarEvent, time: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                           <div className="relative">
                              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                              <input 
                                 placeholder="Main Lounge / Discord..."
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-950 focus:bg-white outline-none"
                                 value={newCalendarEvent.location}
                                 onChange={(e) => setNewCalendarEvent({...newCalendarEvent, location: e.target.value})}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Arranged By (Organizer)</label>
                           <div className="relative">
                              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                              <input 
                                 placeholder="Name of organizer..."
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-950 focus:bg-white outline-none"
                                 value={newCalendarEvent.organizedBy}
                                 onChange={(e) => setNewCalendarEvent({...newCalendarEvent, organizedBy: e.target.value})}
                              />
                           </div>
                        </div>

                        <AeroButton type="submit" className="w-full py-5 !rounded-2xl !bg-amber-600 shadow-xl shadow-amber-600/20">Add to Calendar</AeroButton>
                     </form>
                  </GlassPanel>
               </div>

               <div className="lg:col-span-7 space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                     {Object.entries(calendarEvents).length > 0 ? (
                        Object.entries(calendarEvents).map(([date, event]) => (
                           <GlassPanel key={date} className="p-8 border-slate-100 shadow-lg !bg-white group">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <div className="text-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(date), 'MMM')}</p>
                                       <p className="text-xl font-black text-slate-950">{format(new Date(date), 'dd')}</p>
                                    </div>
                                    <div className="space-y-1">
                                       <h4 className="text-xl font-black text-slate-950 tracking-tight">{event.title}</h4>
                                       <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-sky-500" /> {event.time || 'All Day'}</span>
                                          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-500" /> {event.location || 'Remote'}</span>
                                          {event.organizedBy && (
                                            <span className="flex items-center gap-1.5"><User size={12} className="text-amber-500" /> By: {event.organizedBy}</span>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                                 <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center border border-slate-100">
                                    <Trash2 size={18} />
                                 </button>
                              </div>
                           </GlassPanel>
                        ))
                     ) : (
                        <div className="py-20 text-center opacity-20">
                           <CalendarIcon size={64} className="mx-auto mb-6" />
                           <p className="text-xl font-black uppercase tracking-[0.3em]">No Scheduled Events</p>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'poll' && (
             <motion.div key="poll" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                   <GlassPanel className="space-y-8 p-10 border-slate-100 shadow-xl !bg-white">
                      <header>
                         <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-sky-600/20">
                            <Radio size={24} />
                         </div>
                         <h3 className="text-2xl font-black text-slate-950 tracking-tight">Create Community Poll</h3>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Gather member consensus on key decisions.</p>
                      </header>
                      
                      <form onSubmit={handleCreatePoll} className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Poll Question</label>
                            <textarea 
                               placeholder="What should we discuss next?"
                               className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 focus:bg-white outline-none focus:border-sky-200 transition-all min-h-[100px] resize-none"
                               value={newPoll.question}
                               onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
                            />
                         </div>

                         <div className="space-y-4">
                            {newPoll.options.map((opt, i) => (
                               <div key={i} className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Option {i+1}</label>
                                  <div className="relative">
                                    <Plus className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input 
                                      placeholder="Choice label..."
                                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-950 focus:bg-white outline-none"
                                      value={opt}
                                      onChange={(e) => {
                                         const next = [...newPoll.options];
                                         next[i] = e.target.value;
                                         setNewPoll({...newPoll, options: next});
                                      }}
                                    />
                                  </div>
                               </div>
                            ))}
                            <button 
                               type="button"
                               onClick={() => setNewPoll({...newPoll, options: [...newPoll.options, '']})}
                               className="text-[9px] font-black text-sky-600 uppercase tracking-widest ml-4 hover:text-sky-700 transition-colors"
                            >
                               + Add Another Option
                            </button>
                         </div>

                         <AeroButton type="submit" className="w-full py-5 !rounded-2xl !bg-sky-600 shadow-xl shadow-sky-600/20">Launch Poll</AeroButton>
                      </form>
                   </GlassPanel>
                </div>

                <div className="lg:col-span-7 space-y-6">
                   {polls.map(p => (
                      <GlassPanel key={p.id} className="group border-slate-100 shadow-lg !bg-white">
                         <div className="flex items-center justify-between mb-6">
                            <div>
                               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">ID: #{String(p.id).slice(-8)}</p>
                               <h4 className="text-xl font-black text-slate-950 tracking-tight">{p.question}</h4>
                            </div>
                            <button 
                               onClick={() => dispatch(togglePollStatus(p.id))}
                               className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border
                                 ${p.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                            >
                               {p.active ? 'Accepting' : 'Closed'}
                            </button>
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                               <span>Participation</span>
                               <span>{p.totalVotes} Members</span>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: p.totalVotes > 0 ? '100%' : '0%' }}
                                 className="h-full bg-sky-500"
                               />
                            </div>
                         </div>
                      </GlassPanel>
                   ))}
                </div>
             </motion.div>
          )}

          {activeTab === 'checkin' && (
            <motion.div key="checkin" variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
               <GlassPanel className="p-0 overflow-hidden border-slate-100 shadow-2xl !bg-white">
                  <header className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-950 tracking-tight">Member Check-In</h3>
                        <p className="text-sm font-medium text-slate-400">Verify member participation for current session.</p>
                     </div>
                     <div className="flex flex-wrap gap-3">
                        <AeroButton onClick={handleSelectAll} variant="secondary" className="px-5 py-2.5 !text-[10px] !rounded-xl !bg-white border-slate-200">Select All</AeroButton>
                        <AeroButton onClick={handleDeselectAll} variant="secondary" className="px-5 py-2.5 !text-[10px] !rounded-xl !bg-white border-slate-200">Deselect All</AeroButton>
                     </div>
                  </header>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/10">
                     {members.map((m) => (
                        <div 
                           key={m.id}
                           onClick={() => handleToggleMember(m.id)}
                           className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group
                              ${checkedMembers.has(m.id) 
                                 ? 'bg-sky-600 border-sky-600 text-white shadow-lg' 
                                 : 'bg-white border-slate-100 hover:border-sky-200 shadow-sm'}`}
                        >
                           <div className="flex items-center gap-4">
                              <img src={m.image} className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm" />
                              <div>
                                 <p className={`text-sm font-bold tracking-tight ${checkedMembers.has(m.id) ? 'text-white' : 'text-slate-950'}`}>{m.name}</p>
                                 <p className={`text-[9px] font-bold uppercase tracking-widest ${checkedMembers.has(m.id) ? 'text-white/60' : 'text-slate-400'}`}>{m.accountId}</p>
                              </div>
                           </div>
                           {checkedMembers.has(m.id) ? (
                              <CheckCircle2 size={20} className="text-white"/>
                           ) : (
                              <Circle size={20} className="text-slate-100 group-hover:text-sky-500 transition-colors"/>
                           )}
                        </div>
                     ))}
                  </div>

                  <footer className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{checkedMembers.size} Members Selected</p>
                     <AeroButton className="px-8 py-4 !rounded-xl !text-[11px] !bg-slate-950 shadow-xl shadow-slate-900/20">Confirm Attendance</AeroButton>
                  </footer>
               </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default AdminControl;
