import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageTransition from './PageTransition';
import Navbar from './Navbar';
import CallModal from './CallModal';
import socket from '../services/socket';

const Layout = ({ showNavbar = true }) => {
  const authState = useSelector((state) => state.auth) || {};
  const user = authState.user;

  // Register this user with the signaling server as soon as they are logged in
  // This ensures call:incoming events are received on ANY page, not just /chat
  useEffect(() => {
    if (!user) return;

    const register = () => {
      socket.emit('register', {
        userId: user.id || user.accountId || user.name,
        userName: user.name,
      });
    };

    // Register immediately if already connected, or wait for connection
    if (socket.connected) {
      register();
    } else {
      socket.once('connect', register);
    }

    return () => {
      socket.off('connect', register);
    };
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col relative text-slate-950">
      {/* ── Skip to main content (keyboard / screen-reader accessibility) ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-6 focus:py-3 focus:bg-sky-600 focus:text-white focus:rounded-2xl focus:font-black focus:text-sm focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Global call modal — always mounted so rings work on every page */}
      <CallModal socket={socket} user={user} />

      {showNavbar && <Navbar />}
      <main
        id="main-content"
        role="main"
        aria-label="Page content"
        className="flex-grow px-6 lg:px-12 pt-24 lg:pt-32 pb-8 lg:pb-12 max-w-[1800px] mx-auto w-full relative z-10 transition-all duration-1000"
      >
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

