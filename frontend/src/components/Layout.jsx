import React from 'react';
import { Outlet } from 'react-router-dom';
import PageTransition from './PageTransition';
import Navbar from './Navbar';

const Layout = ({ showNavbar = true }) => {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-950">
      {showNavbar && <Navbar />}
      <main className="flex-grow px-6 lg:px-12 pt-24 lg:pt-32 pb-8 lg:pb-12 max-w-[1800px] mx-auto w-full relative z-10 transition-all duration-1000">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      
      {/* Footer / Mobile Spacer */}
      <div className="h-20 lg:hidden relative z-10"></div>
    </div>
  );
};

export default Layout;
