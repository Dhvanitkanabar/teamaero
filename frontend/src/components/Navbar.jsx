import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { markAsRead, markAllAsRead, clearNotifications } from '../redux/slices/notificationSlice';
import { 
  LayoutDashboard, Users, MessageSquare, BarChart2, 
  Settings, LogOut, Bell, User, Menu, X, 
  Shield, Zap, Globe, Target, Terminal,
  Calendar, History, Award, Radio, CheckCircle2, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const NavLinks = ({ links, location, isMobile, closeMenu }) => (
  <div className={`flex ${isMobile ? 'flex-col w-full gap-4 p-4' : 'items-center gap-1'}`}>
    {links.map((link) => {
      const isActive = location.pathname === link.path;
      return (
        <Link 
          key={link.path} 
          to={link.path} 
          onClick={closeMenu}
          className={`relative group ${isMobile ? 'w-full' : 'px-4 py-2.5'}`}
        >
          <div className={`flex items-center gap-3 transition-all duration-500 relative z-10
            ${isMobile ? 'p-4 rounded-2xl bg-white/5 border border-white/10' : ''}
            ${isActive ? 'text-white' : 'text-slate-200 hover:text-white'}`}>
            <link.icon size={isMobile ? 20 : 16} className={isActive ? 'text-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'text-slate-300 group-hover:text-sky-400 transition-all'} />
            <span className={`${isMobile ? 'text-sm' : 'text-[10px]'} font-black uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
              {link.name}
            </span>
          </div>
          {!isMobile && isActive && (
            <motion.div 
              layoutId="navGlow"
              className="absolute inset-0 bg-white/10 rounded-[16px] border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"
              transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
            />
          )}
        </Link>
      );
    })}
  </div>
);

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notification);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const navigate = useNavigate();

  const handleNotificationClick = (n) => {
    dispatch(markAsRead(n.id));
    if (n.path) {
      navigate(n.path);
      onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'poll': return <Radio size={16} className="text-sky-500" />;
      case 'event': return <Calendar size={16} className="text-amber-500" />;
      case 'ranking': return <Trophy size={16} className="text-orange-500" />;
      case 'chat': return <MessageSquare size={16} className="text-emerald-500" />;
      default: return <Bell size={16} className="text-slate-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute right-0 mt-4 w-[380px] bg-white rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-[100] text-slate-950"
        >
          <header className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">Notifications</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{unreadCount} New Messages</p>
            </div>
            <button 
              onClick={() => dispatch(markAllAsRead())}
              className="text-[9px] font-black text-sky-600 uppercase tracking-widest hover:text-sky-700"
            >
              Mark All Read
            </button>
          </header>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => handleNotificationClick(n)}
                    className={`p-5 flex gap-4 transition-colors cursor-pointer group relative ${!n.read ? 'bg-sky-50/50' : 'hover:bg-slate-50'}`}
                  >
                    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border
                      ${!n.read ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                         <h4 className={`text-[11px] font-black tracking-tight truncate ${!n.read ? 'text-slate-950' : 'text-slate-600'}`}>{n.title}</h4>
                         <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
                           <Clock size={10} /> {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                         </span>
                      </div>
                      <p className={`text-[10px] leading-relaxed line-clamp-2 ${!n.read ? 'text-slate-600 font-bold' : 'text-slate-400 font-medium'}`}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 opacity-20">
                <Bell size={40} className="mx-auto" strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-widest">No notifications yet</p>
              </div>
            )}
          </div>

          <footer className="p-4 bg-slate-50/50 text-center border-t border-slate-50">
            <button 
              onClick={() => dispatch(clearNotifications())}
              className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600"
            >
              Clear History
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UserActions = ({ isAuthenticated, user, isMobile }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { unreadCount } = useSelector((state) => state.notification);
  if (!isAuthenticated) return null;

  const userAvatar = localStorage.getItem(`vanguard_avatar_${user?.id}`) || null;
  const userStyle = localStorage.getItem(`vanguard_style_${user?.id}`) || 'avataaars';

  return (
    <div className={`flex items-center ${isMobile ? 'w-full justify-between p-4 bg-white/5 rounded-3xl mt-8' : 'gap-6 pr-2'}`}>
      {!isMobile && <div className="w-[1px] h-8 bg-white/10" />}
      
      <div className="relative">
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className={`relative group transition-all ${isNotifOpen ? 'text-sky-400' : 'text-slate-400 hover:text-sky-400'}`}
        >
          <Bell size={isMobile ? 24 : 20} className="group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-sky-500 rounded-full border-2 border-slate-900 shadow-[0_0_15px_rgba(14,165,233,0.6)] animate-pulse flex items-center justify-center">
               <span className="text-[7px] font-black text-white leading-none">{unreadCount}</span>
            </div>
          )}
        </button>
        {!isMobile && <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />}
      </div>
      
      <Link to="/profile" className="relative group">
        <div className={`${isMobile ? 'w-12 h-12' : 'w-10 h-10'} rounded-[14px] bg-slate-950 flex items-center justify-center text-white border border-white/20 group-hover:border-sky-500/50 transition-all duration-500 overflow-hidden shadow-2xl`}>
           <img 
             src={userAvatar || `https://api.dicebear.com/7.x/${userStyle}/svg?seed=${localStorage.getItem(`vanguard_seed_${user?.id}`) || user?.name}`} 
             className="w-full h-full relative z-10 object-cover" 
             alt="Avatar" 
           />
           <div className="absolute inset-0 bg-sky-600/10 group-hover:bg-sky-600/30 transition-colors" />
        </div>
      </Link>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isAuthenticated ? [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Polls', path: '/polls', icon: Target },
    { name: 'Rankings', path: '/leaderboard', icon: Award },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    ...(user?.role === 'admin' ? [{ name: 'Management', path: '/admin/control', icon: Shield }] : [])
  ] : [];

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100] px-6 lg:px-8 pt-4 lg:pt-8 pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`w-full lg:max-w-fit lg:mx-auto pointer-events-auto rounded-full transition-all duration-700 backdrop-blur-[40px] border border-white/10
            ${isScrolled 
              ? 'py-1.5 bg-slate-950/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]' 
              : 'py-2 bg-slate-950/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]'}`}
        >
          <div className="px-3 md:px-4 flex items-center gap-2 md:gap-6">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {isAuthenticated && <NavLinks links={navLinks} location={location} />}
              <UserActions isAuthenticated={isAuthenticated} user={user} />
            </div>

            {/* Mobile Edge-to-Edge Slim Command Bar */}
            <div className="lg:hidden w-full">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-950/80 backdrop-blur-xl py-2 px-4 rounded-full flex items-center justify-between border border-white/10 shadow-2xl"
              >
                {/* Identity Node */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-white shadow-lg">
                     <Shield size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none">Aero</span>
                </div>

                {/* Compact Actions */}
                <div className="flex items-center gap-6 px-6 border-x border-white/5 mx-2">
                  <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 relative">
                    <Bell size={16} />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-sky-500 rounded-full border border-slate-900" />
                  </button>
                  
                  <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                    <img 
                      src={localStorage.getItem(`vanguard_avatar_${user?.id}`) || `https://api.dicebear.com/7.x/${localStorage.getItem(`vanguard_style_${user?.id}`) || 'avataaars'}/svg?seed=${localStorage.getItem(`vanguard_seed_${user?.id}`) || user?.name}`} 
                      className="w-full h-full object-cover" 
                      alt="User" 
                    />
                  </Link>
                </div>

                {/* Slim Command Trigger */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-[110] bg-white rounded-full shadow-lg transition-all active:scale-95"
                >
                  <motion.span 
                    animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    className="w-5 h-0.5 bg-slate-950 rounded-full block" 
                  />
                  <motion.span 
                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-5 h-0.5 bg-slate-950 rounded-full block" 
                  />
                  <motion.span 
                    animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    className="w-5 h-0.5 bg-slate-950 rounded-full block" 
                  />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[120] lg:hidden flex items-start justify-end p-6 pt-24 pointer-events-none">
            {/* Ambient focus layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" 
              onClick={() => setIsMenuOpen(false)} 
            />
            
            {/* Side-Aligned Console */}
            <motion.div 
              initial={{ x: 40, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-slate-900/90 backdrop-blur-3xl w-full max-w-[280px] rounded-[32px] p-2 shadow-2xl relative z-10 pointer-events-auto overflow-hidden border border-white/10"
            >
              <div className="p-2 space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link 
                        to={link.path} 
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-4 p-3 rounded-[20px] transition-all duration-300 group
                          ${isActive 
                            ? 'bg-white text-slate-950 shadow-lg' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-all
                          ${isActive ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-500 group-hover:text-sky-400'}`}>
                          <link.icon size={16} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">
                          {link.name}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,1)]" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Console Divider */}
              <div className="h-[1px] w-full bg-white/5 my-1" />

              {/* Action Footer */}
              <div className="p-3 flex items-center justify-between">
                <button className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-[10px] bg-white/5 flex items-center justify-center relative">
                    <Bell size={16} />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-sky-500 rounded-full border border-slate-900" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Alerts</span>
                </button>
                
                <Link 
                  to="/profile" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 rounded-[12px] bg-slate-950 overflow-hidden border border-white/10 group shadow-2xl"
                >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-full h-full group-hover:scale-110 transition-transform duration-500" alt="Profile" />
                </Link>
              </div>
            </motion.div>

            {/* Close Trigger - Side Position */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl border border-white/10 pointer-events-auto"
            >
              <X size={18} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
