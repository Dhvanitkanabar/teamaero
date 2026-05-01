import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { setUser } from '../redux/slices/authSlice';
import { Shield, Lock, Mail, ArrowRight, UserCircle, Globe, Activity, Zap, Cpu, Terminal, Key, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AeroButton, GlassPanel, AeroCard } from '../components/AeroUI';

const Login = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedId = localStorage.getItem('vanguard_userId');
    const savedPass = localStorage.getItem('vanguard_password');
    if (savedId && savedPass) {
      setUserId(savedId);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  if (isAuthenticated) return <Navigate to="/dashboard" />;

  const handleForgotPassword = (e) => {
    if (e) e.preventDefault();
    setError('enter you bd in this format DD/MM/YYYY');
    setTimeout(() => setError(''), 5000);
  };

  const handleRegisterClick = (e) => {
    if (e) e.preventDefault();
    setError('YOU ARE ALREADY REGISTERED TRY YOUR GR NUM AND BIRTHDATE');
    setTimeout(() => setError(''), 5000);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const idNum = parseInt(userId);
    const isMemberId = idNum >= 108600 && idNum <= 108630;
    const isAdminId = idNum === 108600 || idNum === 108650;
    
    if ((isMemberId || isAdminId) && password === '123456') {
      if (rememberMe) {
        localStorage.setItem('vanguard_userId', userId);
        localStorage.setItem('vanguard_password', password);
      } else {
        localStorage.removeItem('vanguard_userId');
        localStorage.removeItem('vanguard_password');
      }
      
      const role = isAdminId ? 'admin' : 'member';
      dispatch(setUser({ name: isAdminId ? `Admin_${idNum}` : `Operator_${idNum}`, role, id: userId }));
      
      if (idNum === 108600) {
        navigate('/admin/dashboard-1');
      } else if (idNum === 108650) {
        navigate('/admin/dashboard-2');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('AUTH_ERROR: SIGNAL_REJECTED');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="vanguard-glass-dark backdrop-blur-[60px] !bg-black/20 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col items-center p-12 rounded-[40px]">
          
          {/* Header */}
          <header className="mb-12 text-center">
            <h2 className="text-5xl font-black text-white tracking-tight mb-2">Login</h2>
          </header>

          <form onSubmit={handleLogin} className="w-full space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Username"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-full py-[18px] px-8 text-white placeholder:text-white/40 focus:border-white/60 focus:bg-white/15 transition-all outline-none text-lg"
                />
                <UserCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={24}/>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative group">
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-full py-[18px] px-8 text-white placeholder:text-white/40 focus:border-white/60 focus:bg-white/15 transition-all outline-none text-lg"
                />
                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={24}/>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded-sm border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className={`w-2 h-2 bg-white rounded-px transition-transform ${rememberMe ? 'scale-100' : 'scale-0'}`} />
                </div>
                <span className="text-[13px] font-medium text-white/80 group-hover:text-white">Remember Me</span>
              </label>
              <Link 
                to="#" 
                onClick={handleForgotPassword}
                className="text-[13px] font-medium text-white/60 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-[11px] font-bold uppercase tracking-widest text-center"
              >
                 {error}
              </motion.div>
            )}

            {/* Login Button */}
            <button 
              type="submit"
              className="w-full bg-white text-slate-950 rounded-full py-[14px] text-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] mt-4"
            >
              Login
            </button>

            {/* Footer */}
            <footer className="pt-8 text-center">
              <p className="text-sm font-medium text-white/60">
                Don't have an account? <Link to="#" onClick={handleRegisterClick} className="text-white font-bold hover:underline ml-1">Register</Link>
              </p>
            </footer>
          </form>
        </div>
      </motion.div>
    </div>

  );
};

export default Login;
