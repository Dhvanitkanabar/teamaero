import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Shield, Target, Globe, ArrowRight, Activity, 
  Cpu, Rocket, TrendingUp, ChevronDown, Terminal, Cloud, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TopAero from '../components/TopAero';
import SplineScene from '../components/SplineScene';
import SEO from '../components/SEO';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent selection:bg-sky-100 selection:text-sky-900">
      <SEO
        title="Home"
        description="Vanguard AERO — A real-time squadron management platform for high-performance teams. Track metrics, coordinate games, and communicate live."
        url="/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Vanguard AERO',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: 'https://vanguard-aero.vercel.app',
          description: 'Real-time squadron management and operations platform for Vanguard teams.',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          featureList: ['Real-time leaderboards', 'Live voice & video calls', 'Team polls', 'Event calendar', 'Member management'],
        }}
      />
      {/* 3. Pre-Hero Branding */}
      <TopAero />
      
      {/* Premium Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center space-y-4"
        >

          {/* Main Heading */}
          <div className="space-y-6">
             <motion.h1 variants={itemVariants} className="vanguard-heading text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tight">
                Modern management for<br />
                <span className="text-gradient-pro">high-performance teams.</span>
             </motion.h1>
             <motion.p variants={itemVariants} className="vanguard-body text-base sm:text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
                The most intuitive platform for teams to coordinate games, track live metrics, and build a winning culture in real-time.
             </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
             <Link to="/login" className="btn-premium btn-premium-primary min-w-[180px]">
                Get Started Free
             </Link>
             <button className="btn-premium btn-premium-secondary min-w-[180px]">
                View Live Demo
             </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Value Proposition Section */}
      <section className="min-h-[80vh] flex items-center px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
               <div className="space-y-4">
                  <h2 className="vanguard-heading text-4xl lg:text-5xl">Built for speed, designed for clarity.</h2>
                  <p className="vanguard-body text-lg">This platform removes the friction from team coordination, letting you focus on what actually matters—the performance.</p>
               </div>
               
               <div className="space-y-6">
                  {[
                    { icon: Zap, title: "Zero Latency Updates", desc: "Every action is synchronized across all devices in under 20ms." },
                    { icon: Shield, title: "Enterprise Security", desc: "End-to-end encryption for all team communications and data." },
                    { icon: Globe, title: "Global Infrastructure", desc: "Powered by a decentralized network of high-performance nodes." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 group">
                       <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                          <item.icon size={22} />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-6">
                  <div className="card-premium h-64 flex flex-col justify-end">
                     <p className="text-4xl font-bold text-slate-900 mb-2">99.9%</p>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sync Uptime</p>
                  </div>
                  <div className="card-premium h-48 bg-slate-900 !text-white border-none flex flex-col justify-end">
                     <p className="text-3xl font-bold mb-2">850+</p>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Teams</p>
                  </div>
               </div>
               <div className="space-y-6 pt-12">
                  <div className="card-premium h-48 bg-sky-500 !text-white border-none flex flex-col justify-end">
                     <p className="text-3xl font-bold mb-2">12ms</p>
                     <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Avg Latency</p>
                  </div>
                  <div className="card-premium h-64 flex flex-col justify-end">
                     <p className="text-4xl font-bold text-slate-900 mb-2">24/7</p>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Monitoring</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Final Section */}
      <section className="min-h-[80vh] flex items-center px-6">
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[32px] sm:rounded-[48px] p-8 sm:p-12 lg:p-24 text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -ml-48 -mb-48" />
            
            <div className="relative z-10 space-y-6">
               <h2 className="vanguard-heading text-3xl sm:text-4xl lg:text-6xl text-white">Ready to take your team<br />to the next level?</h2>
               <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">Join hundreds of teams using this platform to streamline their operations and track real-time metrics.</p>
            </div>

            <div className="relative z-10 pt-6">
               <Link to="/login" className="btn-premium bg-white text-slate-900 px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg mx-auto inline-flex hover:bg-slate-50">
                  Start Your Vanguard Journey <ArrowRight size={20} className="ml-2" />
               </Link>
            </div>
          </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 px-6 border-t border-slate-100 mt-24">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-4">
               <Globe size={20} className="text-slate-300" />
               <span>© 2026 VANGUARD. ALL RIGHTS RESERVED.</span>
            </div>
            <div className="flex gap-8">
               <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
               <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
               <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
               <a href="#" className="hover:text-slate-900 transition-colors">Status</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
