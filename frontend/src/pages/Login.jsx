import React, { useEffect, useState } from 'react';
import { local, LOCAL_KEYS } from '../utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { setUser } from '../redux/slices/authSlice';
import { Shield, Lock, Mail, ArrowRight, UserCircle, Globe, Activity, Zap, Cpu, Terminal, Key, Fingerprint, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AeroButton, GlassPanel, AeroCard } from '../components/AeroUI';
import SEO from '../components/SEO';
import { addNotification } from '../redux/slices/notificationSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation Schema using Yup (Point 5)
  const validationSchema = Yup.object({
    userId: Yup.string()
      .matches(/^[0-9]+$/, 'Operator ID must be numeric')
      .min(6, 'Operator ID must be 6 digits')
      .max(6, 'Operator ID must be 6 digits')
      .required('Operator ID is required'),
    password: Yup.string()
      .min(6, 'Access key must be at least 6 characters')
      .required('Access key is required'),
  });

  const formik = useFormik({
    initialValues: {
      userId: local.get(LOCAL_KEYS.REMEMBERED_USER_ID) || '',
      password: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      const idNum = parseInt(values.userId);
      const isMemberId = idNum >= 108600 && idNum <= 108630;
      const isAdminId = idNum === 108600 || idNum === 108650;
      
      // Artificial delay for premium UX
      setTimeout(() => {
        if ((isMemberId || isAdminId) && values.password === '123456') {
          if (rememberMe) {
            local.set(LOCAL_KEYS.REMEMBERED_USER_ID, values.userId);
          } else {
            local.remove(LOCAL_KEYS.REMEMBERED_USER_ID);
          }
          
          const role = isAdminId ? 'admin' : 'member';
          const name = isAdminId ? `Admin_${idNum}` : `Operator_${idNum}`;
          dispatch(setUser({ name, role, id: values.userId }));
          dispatch(addNotification({
            type: 'success',
            title: 'Access Granted',
            message: `Welcome back, ${name}. Identity verified.`,
          }));
          
          if (idNum === 108600) navigate('/admin/dashboard-1');
          else if (idNum === 108650) navigate('/admin/dashboard-2');
          else navigate('/dashboard');
        } else {
          setFieldError('password', 'Authentication failed. Check credentials.');
          dispatch(addNotification({
            type: 'error',
            title: 'Access Denied',
            message: 'Invalid Operator ID or Access Key.',
          }));
        }
        setSubmitting(false);
      }, 1000);
    },
  });

  useEffect(() => {
    const savedId = local.get(LOCAL_KEYS.REMEMBERED_USER_ID);
    if (savedId) setRememberMe(true);
  }, []);

  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-6">
      <SEO
        title="Login"
        description="Secure operator login for the Vanguard AERO platform."
        url="/login"
        noindex={true}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="vanguard-glass-dark backdrop-blur-[60px] !bg-black/40 border-white/10 shadow-2xl flex flex-col items-center p-12 rounded-[40px]">
          
          <header className="mb-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Shield className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic">Aero Command</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">Identity Verification Required</p>
          </header>

          <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
            <div className="space-y-1">
              <div className="relative group">
                <input 
                  id="userId"
                  name="userId"
                  type="text" 
                  placeholder="Operator ID (e.g. 108601)"
                  {...formik.getFieldProps('userId')}
                  className={`w-full bg-white/5 border ${formik.touched.userId && formik.errors.userId ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl py-[18px] px-8 text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 transition-all outline-none text-base`}
                />
                <UserCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/60 transition-colors" size={20}/>
              </div>
              {formik.touched.userId && formik.errors.userId && (
                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider pl-4 pt-1">{formik.errors.userId}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="Access Key"
                  {...formik.getFieldProps('password')}
                  className={`w-full bg-white/5 border ${formik.touched.password && formik.errors.password ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl py-[18px] px-8 text-white placeholder:text-white/20 focus:border-white/40 focus:bg-white/10 transition-all outline-none text-base`}
                />
                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/60 transition-colors" size={20}/>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider pl-4 pt-1">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-lg border ${rememberMe ? 'bg-white border-white' : 'border-white/20'} flex items-center justify-center transition-all`}>
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  {rememberMe && <Zap size={12} className="text-slate-950 fill-slate-950" />}
                </div>
                <span className="text-[12px] font-bold text-white/60 uppercase tracking-widest">Remember Me</span>
              </label>
              <button 
                type="button"
                className="text-[12px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                onClick={() => dispatch(addNotification({ type: 'info', title: 'Hint', message: 'Use your 6-digit ID and default key: 123456' }))}
              >
                Need Help?
              </button>
            </div>

            <button 
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-white text-slate-950 rounded-2xl py-[16px] text-sm font-black uppercase tracking-[0.2em] hover:bg-sky-50 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {formik.isSubmitting ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                <>Authorize Access <ArrowRight className="ml-2" size={16} /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
