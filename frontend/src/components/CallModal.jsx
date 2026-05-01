import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

const CallModal = ({ socket, user }) => {
  const [callState, setCallState] = useState('IDLE'); // IDLE | RINGING_OUT | RINGING_IN | IN_CALL
  const [callType, setCallType] = useState(null);
  const [remoteInfo, setRemoteInfo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  // Keep refs in sync with state so async callbacks always read latest values
  const callTypeRef = useRef(null);
  const callStateRef = useRef('IDLE');
  const remoteInfoRef = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  // Helper to update both state and ref together
  const setCallTypeSynced = (val) => { callTypeRef.current = val; setCallType(val); };
  const setCallStateSynced = (val) => { callStateRef.current = val; setCallState(val); };
  const setRemoteInfoSynced = (val) => { remoteInfoRef.current = val; setRemoteInfo(val); };

  // ─── Cleanup ─────────────────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    callTypeRef.current = null;
    callStateRef.current = 'IDLE';
    remoteInfoRef.current = null;
    setCallState('IDLE');
    setCallType(null);
    setRemoteInfo(null);
    setIsMuted(false);
    setIsCamOff(false);
  }, []);

  // ─── Get local media ──────────────────────────────────────────────────────────
  const getLocalStream = useCallback(async (type) => {
    const constraints = {
      audio: true,
      video: type === 'video' ? { width: 1280, height: 720, facingMode: 'user' } : false,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  }, []);

  // ─── Build RTCPeerConnection ──────────────────────────────────────────────────
  const createPeerConnection = useCallback((targetSocketId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('webrtc:ice-candidate', { candidate, targetSocketId });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] Connection state:', pc.connectionState);
    };

    return pc;
  }, [socket]);

  // ─── ALL socket event listeners — mounted ONCE, use refs for current values ──
  useEffect(() => {
    if (!socket) return;

    // ── INCOMING CALL (callee receives this) ──────────────────────────────────
    const onIncoming = ({ callType: type, callerName, callerSocketId }) => {
      console.log('[Call] Incoming call from', callerName, 'type:', type);
      // Don't interrupt an active call
      if (callStateRef.current !== 'IDLE') return;

      setCallTypeSynced(type);
      setRemoteInfoSynced({ name: callerName, socketId: callerSocketId });
      setCallStateSynced('RINGING_IN');
    };

    // ── CALLER: someone accepted ──────────────────────────────────────────────
    const onAccepted = async ({ accepterSocketId, accepterName }) => {
      console.log('[Call] Accepted by', accepterName);
      setRemoteInfoSynced({ name: accepterName, socketId: accepterSocketId });
      const type = callTypeRef.current;

      try {
        const stream = await getLocalStream(type);
        const pc = createPeerConnection(accepterSocketId);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc:offer', { offer, targetSocketId: accepterSocketId });

        setCallStateSynced('IN_CALL');
      } catch (err) {
        console.error('[Call] Failed to create offer:', err);
        cleanup();
      }
    };

    // ── CALLER: someone declined ──────────────────────────────────────────────
    const onDeclined = ({ declinerName }) => {
      console.log('[Call] Declined by', declinerName);
      cleanup();
    };

    // ── CALLEE: receives the WebRTC offer from caller ─────────────────────────
    const onOffer = async ({ offer, senderSocketId }) => {
      console.log('[Call] Received offer from', senderSocketId);
      const type = callTypeRef.current; // read from ref, not stale state closure

      try {
        const stream = await getLocalStream(type);
        const pc = createPeerConnection(senderSocketId);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc:answer', { answer, targetSocketId: senderSocketId });

        setCallStateSynced('IN_CALL');
      } catch (err) {
        console.error('[Call] Failed to handle offer:', err);
        cleanup();
      }
    };

    // ── CALLER: receives the answer from callee ───────────────────────────────
    const onAnswer = async ({ answer }) => {
      console.log('[Call] Received answer');
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error('[Call] Failed to set remote description:', err);
      }
    };

    // ── ICE candidates ────────────────────────────────────────────────────────
    const onIceCandidate = async ({ candidate }) => {
      try {
        if (peerConnectionRef.current && candidate) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('[Call] Failed to add ICE candidate:', err);
      }
    };

    // ── Remote peer hung up ───────────────────────────────────────────────────
    const onEnded = () => {
      console.log('[Call] Call ended by remote');
      cleanup();
    };

    socket.on('call:incoming', onIncoming);
    socket.on('call:accepted', onAccepted);
    socket.on('call:declined', onDeclined);
    socket.on('webrtc:offer', onOffer);
    socket.on('webrtc:answer', onAnswer);
    socket.on('webrtc:ice-candidate', onIceCandidate);
    socket.on('call:ended', onEnded);

    // Debug: log all events received on this socket
    socket.onAny((event, ...args) => {
      if (event.startsWith('call:') || event.startsWith('webrtc:')) {
        console.log('[Socket] Event received:', event, args);
      }
    });

    return () => {
      socket.off('call:incoming', onIncoming);
      socket.off('call:accepted', onAccepted);
      socket.off('call:declined', onDeclined);
      socket.off('webrtc:offer', onOffer);
      socket.off('webrtc:answer', onAnswer);
      socket.off('webrtc:ice-candidate', onIceCandidate);
      socket.off('call:ended', onEnded);
      socket.offAny();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]); // Only depend on socket — all other values read via refs

  // ─── Initiate outgoing call ───────────────────────────────────────────────────
  const initiateCall = useCallback((type) => {
    if (!socket || !user) {
      console.warn('[Call] Cannot initiate: socket or user missing');
      return;
    }
    if (callStateRef.current !== 'IDLE') {
      console.warn('[Call] Already in a call');
      return;
    }
    console.log('[Call] Initiating', type, 'call as', user.name);
    setCallTypeSynced(type);
    setCallStateSynced('RINGING_OUT');
    socket.emit('call:initiate', {
      callType: type,
      callerName: user.name,
      callerId: user.id || user.accountId || user.name,
    });
  }, [socket, user]);

  // Expose to window so chat header buttons can trigger it
  useEffect(() => {
    window.__vanguardInitiateCall = initiateCall;
    return () => { delete window.__vanguardInitiateCall; };
  }, [initiateCall]);

  // ─── Accept incoming call ─────────────────────────────────────────────────────
  const acceptCall = useCallback(() => {
    const info = remoteInfoRef.current;
    if (!info) return;
    console.log('[Call] Accepting call from', info.name);
    socket.emit('call:accept', {
      callerSocketId: info.socketId,
      accepterName: user.name,
    });
    setCallStateSynced('IN_CALL');
  }, [socket, user]);

  // ─── Decline incoming call ────────────────────────────────────────────────────
  const declineCall = useCallback(() => {
    const info = remoteInfoRef.current;
    if (!info) return;
    socket.emit('call:decline', {
      callerSocketId: info.socketId,
      declinerName: user.name,
    });
    cleanup();
  }, [socket, user, cleanup]);

  // ─── End active call ──────────────────────────────────────────────────────────
  const endCall = useCallback(() => {
    socket.emit('call:end', {
      targetSocketId: remoteInfoRef.current?.socketId || null,
    });
    cleanup();
  }, [socket, cleanup]);

  // ─── Mute / Camera toggle ─────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsMuted(prev => !prev);
  }, []);

  const toggleCam = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsCamOff(prev => !prev);
  }, []);

  if (callState === 'IDLE') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl"
      >
        {/* ── Incoming Ring ───────────────────────────────────────────────────── */}
        {callState === 'RINGING_IN' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[40px] p-12 max-w-sm w-full mx-4 shadow-2xl text-center space-y-8"
          >
            {/* Pulsing avatar */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-sky-200 animate-ping opacity-40" />
              <div className="absolute inset-2 rounded-full bg-sky-100 animate-ping opacity-30" style={{ animationDelay: '0.3s' }} />
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${remoteInfo?.name}`}
                className="relative w-full h-full rounded-full border-4 border-sky-500 shadow-xl object-cover bg-sky-50"
                alt="Caller"
              />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 rounded-full border border-sky-100">
                {callType === 'video' ? <Video size={12} className="text-sky-500" /> : <Phone size={12} className="text-sky-500" />}
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-600">
                  Incoming {callType === 'video' ? 'Video' : 'Voice'} Call
                </p>
              </div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight">{remoteInfo?.name}</h2>
              <p className="text-sm text-slate-400 font-medium">Requesting to connect...</p>
            </div>

            <div className="flex items-center justify-center gap-8">
              <div className="text-center space-y-2">
                <button
                  onClick={declineCall}
                  className="w-20 h-20 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-500/30 transition-all active:scale-95"
                >
                  <PhoneOff size={28} />
                </button>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Decline</p>
              </div>
              <div className="text-center space-y-2">
                <button
                  onClick={acceptCall}
                  className="w-20 h-20 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 transition-all active:scale-95 animate-bounce"
                >
                  <Phone size={28} />
                </button>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Accept</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Outgoing Ringing ─────────────────────────────────────────────────── */}
        {callState === 'RINGING_OUT' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-950 rounded-[40px] p-12 max-w-sm w-full mx-4 shadow-2xl text-center space-y-8 border border-slate-800"
          >
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
              <div className="absolute inset-4 rounded-full bg-sky-500/30 animate-ping" style={{ animationDelay: '0.4s' }} />
              <div className="relative w-full h-full rounded-full bg-slate-900 border-2 border-sky-500/50 flex items-center justify-center">
                {callType === 'video'
                  ? <Video size={48} className="text-sky-400" />
                  : <Phone size={48} className="text-sky-400" />
                }
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-500">Calling Community...</p>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {callType === 'video' ? 'Video' : 'Voice'} Call
              </h2>
              <p className="text-sm text-slate-400">Waiting for someone to answer</p>
            </div>
            <button
              onClick={endCall}
              className="mx-auto w-20 h-20 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-500/30 transition-all active:scale-95"
            >
              <PhoneOff size={28} />
            </button>
          </motion.div>
        )}

        {/* ── Active Call ──────────────────────────────────────────────────────── */}
        {callState === 'IN_CALL' && (
          <div className="relative w-full h-full flex flex-col bg-slate-950">
            {/* Remote video (full screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

            {/* Local video PiP (draggable) */}
            {callType === 'video' && (
              <motion.div
                drag
                dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 160, bottom: window.innerHeight - 240 }}
                className="absolute top-6 right-6 w-36 h-48 md:w-44 md:h-60 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-grab active:cursor-grabbing z-10"
              >
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {isCamOff && (
                  <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                    <VideoOff size={32} className="text-slate-500" />
                  </div>
                )}
              </motion.div>
            )}

            {/* Call info */}
            <div className="absolute top-6 left-6 z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-400">
                {callType === 'video' ? 'Video' : 'Voice'} Call
              </p>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                {remoteInfo?.name || 'Community'}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-10 inset-x-0 z-10 flex items-center justify-center gap-5">
              <button
                onClick={toggleMute}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all active:scale-90 shadow-xl ${isMuted ? 'bg-rose-500 shadow-rose-500/30' : 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/10'}`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {callType === 'video' && (
                <button
                  onClick={toggleCam}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all active:scale-90 shadow-xl ${isCamOff ? 'bg-rose-500 shadow-rose-500/30' : 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/10'}`}
                >
                  {isCamOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
              )}

              <button
                onClick={endCall}
                className="w-20 h-20 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-500/40 transition-all active:scale-90"
              >
                <PhoneOff size={30} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CallModal;
