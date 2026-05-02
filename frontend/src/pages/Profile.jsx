import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  User, Mail, Shield, LogOut, Settings, Award, Activity,
  Zap, Key, ChevronRight, Bell, Lock, Eye, EyeOff,
  BarChart3, Star, Clock, CheckCircle, Edit3, Camera,
  Trophy, MessageSquare, Calendar, TrendingUp, Globe, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import { getUserByGR, getAllMembers } from '../utils/userMapping';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, logout: logoutUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Determine which user data to display (dynamic vs current)
  const displayUser = useMemo(() => {
    if (userId) {
      const data = getUserByGR(userId);
      if (data) return { ...data, id: userId, accountId: `GR-${userId}` };
    }
    return currentUser;
  }, [userId, currentUser]);

  const isOwnProfile = !userId || userId === (currentUser?.id || currentUser?.grNumber);

  const [activeTab, setActiveTab] = useState('overview');
  const [notificationsOn, setNotificationsOn] = useState(() => localStorage.getItem('vanguard_notif_polls') !== 'false');
  const [privacyOn, setPrivacyOn] = useState(() => localStorage.getItem('vanguard_privacy_mode') === 'true');
  const [syncOn, setSyncOn] = useState(() => localStorage.getItem('vanguard_notif_events') !== 'false');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem(`vanguard_avatar_${displayUser?.id || 'me'}`));
  const [avatarStyle, setAvatarStyle] = useState(() => localStorage.getItem(`vanguard_style_${displayUser?.id || 'me'}`) || 'avataaars');

  useEffect(() => {
    localStorage.setItem('vanguard_notif_polls', notificationsOn);
    localStorage.setItem('vanguard_privacy_mode', privacyOn);
    localStorage.setItem('vanguard_notif_events', syncOn);
    if (isOwnProfile && currentUser) {
      const id = currentUser.id || currentUser.grNumber;
      if (profileImage) localStorage.setItem(`vanguard_avatar_${id}`, profileImage);
      else localStorage.removeItem(`vanguard_avatar_${id}`);
      localStorage.setItem(`vanguard_style_${id}`, avatarStyle);
    }
  }, [notificationsOn, privacyOn, syncOn, profileImage, avatarStyle, isOwnProfile, currentUser]);

  const handleSecurityAction = (action) => {
    const messages = {
      password: { title: 'Security Protocol', msg: 'Verification link sent to your authorized email.' },
      tfa: { title: '2FA Activation', msg: 'Multi-factor authentication system initializing...' },
      sessions: { title: 'Session Manager', msg: 'Scanning active authorized devices...' }
    };
    toast.success(messages[action].title, messages[action].msg);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success('Identity Updated', 'Your custom profile photo has been deployed.');
      };
      reader.readAsDataURL(file);
    }
  };

  const cycleAvatarStyle = () => {
    const styles = ['avataaars', 'bottts', 'pixel-art', 'lorelei', 'identicon'];
    const currentIndex = styles.indexOf(avatarStyle);
    const nextStyle = styles[(currentIndex + 1) % styles.length];
    setAvatarStyle(nextStyle);
    setProfileImage(null); // Clear custom photo if switching to character
    toast.info('Avatar Synced', `Identity style switched to ${nextStyle}.`);
  };

  const accountId = displayUser?.accountId || '';
  const joinDate = 'January 2026';

  if (!displayUser) return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p className="text-2xl font-black italic uppercase">Identity Not Found</p>
    </div>
  );

  const handleLogout = () => {
    toast.info('Signed Out', 'You have been signed out successfully.');
    setTimeout(() => logoutUser(), 600);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const tabs = isOwnProfile ? ['overview', 'activity', 'settings'] : ['overview', 'activity'];
  const score = displayUser?.xp || 0;
  const integrity = displayUser?.integrity || 98;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto pb-32 pt-8 px-0 space-y-8"
    >
      <SEO
        title={`${displayUser.name}`}
        description={`${displayUser.name}'s Vanguard AERO profile — stats, activity, and account settings.`}
        url="/profile"
        noindex={true}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: `${displayUser.name} — Vanguard AERO`,
          url: 'https://vanguard-aero.vercel.app/profile',
          mainEntity: {
            '@type': 'Person',
            name: displayUser.name,
            identifier: accountId,
            jobTitle: displayUser.role === 'admin' ? 'Administrator' : 'Squadron Member',
          },
        }}
      />

      {/* ── Hero Card ──────────────────────────────────────────────────────── */}
      <motion.section
        variants={itemVariants}
        className="relative rounded-[40px] overflow-hidden bg-slate-900 shadow-2xl"
        aria-label="Profile header"
      >
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-slate-900 to-indigo-900/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 p-8 md:p-12 lg:p-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            {/* Avatar */}
            <div className="relative shrink-0 group/avatar">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[28px] md:rounded-[36px] overflow-hidden bg-slate-800 border-2 border-white/10 shadow-2xl relative">
                <img
                  src={profileImage || `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${localStorage.getItem(`vanguard_seed_${displayUser.id}`) || displayUser.name}`}
                  alt={`${displayUser.name}'s avatar`}
                  className="w-full h-full object-cover"
                />
                {isOwnProfile && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <label className="cursor-pointer p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                      <Camera size={18} className="text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <button 
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                      title="Open Identity Gallery"
                    >
                      <User size={18} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-slate-950 bg-emerald-500 shadow-xl" />
            </div>

            {/* Name + Meta */}
            <div className="flex-grow min-w-0 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-[10px] font-black uppercase tracking-[0.25em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {displayUser.role === 'admin' ? 'Administrator' : 'Squadron Member'}
                  </span>
                  {displayUser.role === 'admin' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] font-black uppercase tracking-[0.25em]">
                      <Shield size={10} />
                      Admin Access
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                  {displayUser.name}
                </h1>
                <p className="text-slate-400 text-sm font-medium tracking-wide">
                  {accountId} · Joined {joinDate}
                </p>
              </div>

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { label: 'Points', value: score.toLocaleString(), icon: Zap, color: 'text-sky-400' },
                  { label: 'Attendance', value: `${integrity}%`, icon: CheckCircle, color: 'text-emerald-400' },
                  { label: 'Rank', value: '#' + (getAllMembers().findIndex(m => m.name === displayUser.name) + 1 || 1), icon: Trophy, color: 'text-amber-400' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <stat.icon size={14} className={stat.color} aria-hidden="true" />
                    <span className="text-white font-black text-lg leading-none">{stat.value}</span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign out button */}
            {isOwnProfile && (
              <button
                onClick={handleLogout}
                aria-label="Sign out of your account"
                className="shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-400 transition-all duration-300 active:scale-95 text-sm font-bold"
              >
                <LogOut size={16} aria-hidden="true" />
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Tab nav */}
        <div className="relative z-10 flex border-t border-white/5 px-8 md:px-12 lg:px-16">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              role="tab"
              className={`px-6 py-4 text-[11px] font-black uppercase tracking-[0.25em] border-b-2 transition-all duration-200 capitalize
                ${activeTab === tab
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.section>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            role="tabpanel"
            aria-label="Overview"
          >
            {/* Account details — 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Info */}
              <section
                aria-labelledby="account-info-heading"
                className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden"
              >
                <header className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                  <h2 id="account-info-heading" className="text-sm font-black text-slate-950 tracking-tight flex items-center gap-3">
                    <User size={16} className="text-sky-500" aria-hidden="true" />
                    Account Information
                  </h2>
                  <button
                    aria-label="Edit account information"
                    className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-100 transition-all"
                  >
                    <Edit3 size={14} aria-hidden="true" />
                  </button>
                </header>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', value: displayUser.name, icon: User },
                    { label: 'Account ID', value: accountId, icon: Key },
                    { label: 'Role', value: displayUser.role === 'admin' ? 'Administrator' : 'Squadron Member', icon: Shield },
                    { label: 'Status', value: 'Active', icon: Activity },
                    { label: 'Member Since', value: joinDate, icon: Calendar },
                    { label: 'Region', value: 'Global', icon: Globe },
                  ].map((field) => (
                    <div key={field.label} className="space-y-1.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                        <field.icon size={10} aria-hidden="true" />
                        {field.label}
                      </p>
                      <p className="text-base font-bold text-slate-950 tracking-tight">{field.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Performance */}
              <section
                aria-labelledby="performance-heading"
                className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden"
              >
                <header className="px-8 py-6 border-b border-slate-50">
                  <h2 id="performance-heading" className="text-sm font-black text-slate-950 tracking-tight flex items-center gap-3">
                    <BarChart3 size={16} className="text-sky-500" aria-hidden="true" />
                    Performance Summary
                  </h2>
                </header>
                <div className="p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Points', value: score.toLocaleString(), color: 'bg-sky-50 text-sky-600 border-sky-100' },
                    { label: 'Attendance', value: `${integrity}%`, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                    { label: 'Polls Voted', value: '12', color: 'bg-violet-50 text-violet-600 border-violet-100' },
                    { label: 'Streak', value: '7 days', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl border p-5 ${stat.color}`}>
                      <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Attendance bar */}
                <div className="px-8 pb-8 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendance Rate</p>
                    <p className="text-sm font-black text-slate-950">{integrity}%</p>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={integrity} aria-valuemin={0} aria-valuemax={100} aria-label={`Attendance: ${integrity}%`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${integrity}%` }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar — 1 col */}
            <div className="space-y-6">
              {/* Quick actions */}
              <section
                aria-labelledby="quick-actions-heading"
                className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden"
              >
                <header className="px-6 py-5 border-b border-slate-50">
                  <h2 id="quick-actions-heading" className="text-sm font-black text-slate-950 tracking-tight">
                    Quick Actions
                  </h2>
                </header>
                <nav className="p-4 space-y-2" aria-label="Profile quick actions">
                  {[
                    { label: 'View Leaderboard', href: '/leaderboard', icon: Trophy, desc: 'See your ranking' },
                    { label: 'Community Forum', href: '/chat', icon: MessageSquare, desc: 'Join the conversation' },
                    { label: 'Browse Calendar', href: '/calendar', icon: Calendar, desc: 'Upcoming events' },
                    { label: 'Active Polls', href: '/polls', icon: BarChart3, desc: 'Cast your vote' },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                      aria-label={action.label}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all shrink-0">
                        <action.icon size={18} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-950 leading-none truncate">{action.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">{action.desc}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform ml-auto shrink-0" aria-hidden="true" />
                    </Link>
                  ))}
                </nav>
              </section>

              {/* Score card */}
              <div className="bg-slate-950 rounded-[28px] p-6 space-y-5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 blur-[60px] pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">Total Score</p>
                  <Star size={16} className="text-amber-400" aria-hidden="true" />
                </div>
                <div className="relative z-10">
                  <p className="text-5xl font-black text-white tracking-tight">{score.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Points Earned</p>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <TrendingUp size={12} className="text-emerald-400" aria-hidden="true" />
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Active this season</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            role="tabpanel"
            aria-label="Activity"
          >
            <section
              aria-labelledby="activity-heading"
              className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden"
            >
              <header className="px-8 py-6 border-b border-slate-50">
                <h2 id="activity-heading" className="text-sm font-black text-slate-950 tracking-tight flex items-center gap-3">
                  <Clock size={16} className="text-sky-500" aria-hidden="true" />
                  Recent Activity
                </h2>
              </header>
              <ol className="divide-y divide-slate-50" aria-label="Activity timeline">
                {[
                  { action: 'Voted on community poll', time: '2 hours ago', icon: BarChart3, color: 'bg-violet-50 text-violet-500' },
                  { action: 'Attended weekly session', time: '1 day ago', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-500' },
                  { action: 'Sent 14 messages in forum', time: '2 days ago', icon: MessageSquare, color: 'bg-sky-50 text-sky-500' },
                  { action: 'Ranked #3 on leaderboard', time: '3 days ago', icon: Trophy, color: 'bg-amber-50 text-amber-500' },
                  { action: 'Joined calendar event', time: '5 days ago', icon: Calendar, color: 'bg-rose-50 text-rose-500' },
                  { action: 'Profile last updated', time: '1 week ago', icon: Edit3, color: 'bg-slate-50 text-slate-400' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-5 px-8 py-5 hover:bg-slate-50/50 transition-colors">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon size={16} aria-hidden="true" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-slate-950 truncate">{item.action}</p>
                    </div>
                    <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{item.time}</time>
                  </li>
                ))}
              </ol>
            </section>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            role="tabpanel"
            aria-label="Settings"
          >
            {/* Notifications */}
            <section
              aria-labelledby="notifications-heading"
              className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden"
            >
              <header className="px-8 py-6 border-b border-slate-50">
                <h2 id="notifications-heading" className="text-sm font-black text-slate-950 tracking-tight flex items-center gap-3">
                  <Bell size={16} className="text-sky-500" aria-hidden="true" />
                  Notification Preferences
                </h2>
              </header>
              <div className="p-8 space-y-4">
                {[
                  { label: 'Poll Updates', desc: 'Get notified when new polls go live', value: notificationsOn, set: setNotificationsOn },
                  { label: 'Event Reminders', desc: 'Reminders before scheduled events', value: syncOn, set: setSyncOn },
                  { label: 'Private Mode', desc: 'Hide your activity from other members', value: privacyOn, set: setPrivacyOn },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <p className="text-sm font-bold text-slate-950">{pref.label}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{pref.desc}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={pref.value}
                      aria-label={`Toggle ${pref.label}`}
                      onClick={() => pref.set(!pref.value)}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 ml-4 ${pref.value ? 'bg-sky-500 shadow-md shadow-sky-500/30' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${pref.value ? 'left-[26px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Security */}
            <section
              aria-labelledby="security-heading"
              className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden"
            >
              <header className="px-8 py-6 border-b border-slate-50">
                <h2 id="security-heading" className="text-sm font-black text-slate-950 tracking-tight flex items-center gap-3">
                  <Lock size={16} className="text-sky-500" aria-hidden="true" />
                  Security
                </h2>
              </header>
              <div className="p-8 space-y-3">
                {[
                  { id: 'password', label: 'Change Password', icon: Key, desc: 'Update your login credentials' },
                  { id: 'tfa', label: 'Two-Factor Authentication', icon: Shield, desc: 'Add an extra layer of security' },
                  { id: 'sessions', label: 'Active Sessions', icon: Globe, desc: 'Manage devices signed into your account' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSecurityAction(item.id)}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group text-left"
                    aria-label={item.label}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:border-sky-100 transition-all shrink-0 shadow-sm">
                      <item.icon size={16} aria-hidden="true" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-slate-950">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>

            {/* Danger zone */}
            <section
              aria-labelledby="danger-zone-heading"
              className="lg:col-span-2 bg-white rounded-[28px] border border-rose-100 shadow-sm overflow-hidden"
            >
              <header className="px-8 py-6 border-b border-rose-50">
                <h2 id="danger-zone-heading" className="text-sm font-black text-rose-500 tracking-tight">
                  Account Actions
                </h2>
              </header>
              <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-bold text-slate-950">Sign Out</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    End your current session on this device.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  aria-label="Sign out of your account"
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-sm tracking-tight transition-all active:scale-95 shadow-lg shadow-rose-500/20 shrink-0"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Identity Gallery Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setIsAvatarModalOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl vanguard-glass-dark border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <header className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-widest">Identity Vault</h2>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Select your squadron visual signature</p>
                </div>
                <button 
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="p-3 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={20} />
                </button>
              </header>

              <div className="p-8 overflow-y-auto no-scrollbar grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {[
                  { style: 'avataaars', seed: 'Felix' },
                  { style: 'avataaars', seed: 'Aneka' },
                  { style: 'bottts', seed: 'Buster' },
                  { style: 'bottts', seed: 'Zoe' },
                  { style: 'pixel-art', seed: 'Pixel' },
                  { style: 'pixel-art', seed: 'Vanguard' },
                  { style: 'lorelei', seed: 'Lara' },
                  { style: 'lorelei', seed: 'Aero' },
                  { style: 'adventure', seed: 'Quest' },
                  { style: 'adventure', seed: 'Hero' },
                  { style: 'big-ears', seed: 'Dumbo' },
                  { style: 'big-smile', seed: 'Happy' },
                  { style: 'fun-emoji', seed: 'Wink' },
                  { style: 'identicon', seed: 'Node' },
                  { style: 'shapes', seed: 'Geom' },
                  { style: 'thumbs', seed: 'Like' },
                ].map((opt, i) => (
                  <motion.button
                    key={`${opt.style}-${opt.seed}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => {
                      setAvatarStyle(opt.style);
                      setProfileImage(null); // Clear custom photo
                      // Save specific seed if needed
                      localStorage.setItem(`vanguard_seed_${currentUser.id}`, opt.seed);
                      setIsAvatarModalOpen(false);
                      toast.success('Identity Updated', 'Your new squadron avatar has been synchronized.');
                    }}
                    className="group relative aspect-square rounded-[30px] bg-white/5 border border-white/5 p-4 hover:border-sky-500/50 hover:bg-white/10 transition-all"
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/${opt.style}/svg?seed=${opt.seed}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt="Avatar Option"
                    />
                    <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/5 transition-colors rounded-[30px]" />
                  </motion.button>
                ))}
              </div>
              
              <footer className="p-8 border-t border-white/5 bg-white/[0.02]">
                 <p className="text-[9px] font-black text-center text-white/20 uppercase tracking-[0.4em]">
                    Vanguard AERO Neural Identity Grid v2.4
                 </p>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
