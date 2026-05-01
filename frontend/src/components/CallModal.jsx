import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, X } from 'lucide-react';

// STUN servers for ICE candidate negotiation (free Google STUN)
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

/**
 * CallModal — manages all call states:
 *  - IDLE: hidden
 *  - RINGING_OUT: caller is waiting for someone to pick up
 *  - RINGING_IN: callee sees the incoming call notification
 *  - IN_CALL: live WebRTC audio/video session
 */
const CallModal = ({ socket, user }) => {
  const [callState, setCallState] = useState('IDLE'); // IDLE | RINGING_OUT | RINGING_IN | IN_CALL
  const [callType, setCallType] = useState(null);     // 'voice' | 'video'
  const [remoteInfo, setRemoteInfo] = useState(null); // { name, socketId }

  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const ringtoneRef = useRef(null);

  // ─── Cleanup helper ─────────────────────────────────────────────────────────
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
    if (ringtoneRef.current) { ringtoneRef.current.pause(); ringtoneRef.current.currentTime = 0; }
    setCallState('IDLE');
    setCallType(null);
    setRemoteInfo(null);
    setIsMuted(false);
    setIsCamOff(false);
  }, []);

  // ─── Get local media stream ──────────────────────────────────────────────────
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

  // ─── Build PeerConnection ────────────────────────────────────────────────────
  const createPeerConnection = useCallback((targetSocketId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    // Send ICE candidates to the remote peer via signaling server
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('webrtc:ice-candidate', { candidate, targetSocketId });
      }
    };

    // When remote stream arrives → attach to remote video element
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  }, [socket]);

  // ─── OUTGOING call (caller side) ────────────────────────────────────────────
  const initiateCall = useCallback(async (type) => {
    if (!socket || !user) return;
    setCallType(type);
    setCallState('RINGING_OUT');

    socket.emit('call:initiate', {
      callType: type,
      callerName: user.name,
      callerId: user.id || user.accountId,
    });
  }, [socket, user]);

  // ─── Socket event handlers ───────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // Someone else is calling us
    const onIncoming = ({ callType, callerName, callerSocketId }) => {
      setCallType(callType);
      setRemoteInfo({ name: callerName, socketId: callerSocketId });
      setCallState('RINGING_IN');
      // Play ringtone
      try {
        const audio = new Audio('https://www.soundjay.com/phone/sounds/phone-ringing-1.mp3');
        audio.loop = true;
        audio.volume = 0.6;
        ringtoneRef.current = audio;
        audio.play().catch(() => {});
      } catch (_) {}
    };

    // Our call was accepted by someone
    const onAccepted = async ({ accepterSocketId, accepterName }) => {
      setRemoteInfo({ name: accepterName, socketId: accepterSocketId });
      if (ringtoneRef.current) { ringtoneRef.current.pause(); }

      try {
        const stream = await getLocalStream(callType);
        const pc = createPeerConnection(accepterSocketId);

        // Add all local tracks to the connection
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Create and send the WebRTC offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc:offer', { offer, targetSocketId: accepterSocketId });

        setCallState('IN_CALL');
      } catch (err) {
        console.error('Failed to start call after acceptance:', err);
        cleanup();
      }
    };

    // Our call was declined
    const onDeclined = () => {
      if (ringtoneRef.current) { ringtoneRef.current.pause(); }
      cleanup();
    };

    // Remote peer sent us an offer → we need to answer
    const onOffer = async ({ offer, senderSocketId }) => {
      try {
        const stream = await getLocalStream(callType);
        const pc = createPeerConnection(senderSocketId);

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc:answer', { answer, targetSocketId: senderSocketId });

        setCallState('IN_CALL');
      } catch (err) {
        console.error('Failed to handle offer:', err);
        cleanup();
      }
    };

    // Remote peer sent us their answer
    const onAnswer = async ({ answer }) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error('Failed to set remote description:', err);
      }
    };

    // New ICE candidate from remote peer
    const onIceCandidate = async ({ candidate }) => {
      try {
        if (peerConnectionRef.current && candidate) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Failed to add ICE candidate:', err);
      }
    };

    // Remote peer hung up
    const onEnded = () => {
      cleanup();
    };

    socket.on('call:incoming', onIncoming);
    socket.on('call:accepted', onAccepted);
    socket.on('call:declined', onDeclined);
    socket.on('webrtc:offer', onOffer);
    socket.on('webrtc:answer', onAnswer);
    socket.on('webrtc:ice-candidate', onIceCandidate);
    socket.on('call:ended', onEnded);

    return () => {
      socket.off('call:incoming', onIncoming);
      socket.off('call:accepted', onAccepted);
      socket.off('call:declined', onDeclined);
      socket.off('webrtc:offer', onOffer);
      socket.off('webrtc:answer', onAnswer);
      socket.off('webrtc:ice-candidate', onIceCandidate);
      socket.off('call:ended', onEnded);
    };
  }, [socket, callType, getLocalStream, createPeerConnection, cleanup]);

  // ─── Accept incoming call ────────────────────────────────────────────────────
  const acceptCall = useCallback(() => {
    if (!remoteInfo) return;
    if (ringtoneRef.current) { ringtoneRef.current.pause(); }
    socket.emit('call:accept', {
      callerSocketId: remoteInfo.socketId,
      accepterName: user.name,
    });
    // The caller will send us a WebRTC offer after this — handled in onOffer
    setCallState('IN_CALL');
  }, [remoteInfo, socket, user]);

  // ─── Decline incoming call ───────────────────────────────────────────────────
  const declineCall = useCallback(() => {
    if (!remoteInfo) return;
    socket.emit('call:decline', {
      callerSocketId: remoteInfo.socketId,
      declinerName: user.name,
    });
    cleanup();
  }, [remoteInfo, socket, user, cleanup]);

  // ─── End active call ─────────────────────────────────────────────────────────
  const endCall = useCallback(() => {
    socket.emit('call:end', {
      targetSocketId: remoteInfo?.socketId || null,
    });
    cleanup();
  }, [socket, remoteInfo, cleanup]);

  // ─── Toggle mute ────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach(t => {
      t.enabled = !t.enabled;
    });
    setIsMuted(prev => !prev);
  }, []);

  // ─── Toggle camera ───────────────────────────────────────────────────────────
  const toggleCam = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach(t => {
      t.enabled = !t.enabled;
    });
    setIsCamOff(prev => !prev);
  }, []);

  // Expose initiateCall to parent via window so Chat.jsx can trigger it
  useEffect(() => {
    window.__vanguardInitiateCall = initiateCall;
    return () => { delete window.__vanguardInitiateCall; };
  }, [initiateCall]);

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
        {/* ── Incoming Ring ── */}
        {callState === 'RINGING_IN' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[40px] p-12 max-w-sm w-full mx-4 shadow-2xl text-center space-y-8"
          >
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-sky-100 animate-ping opacity-30" />
              <div className="absolute inset-2 rounded-full bg-sky-100 animate-ping opacity-20 animation-delay-300" />
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${remoteInfo?.name}`}
                className="relative w-full h-full rounded-full border-4 border-sky-500 shadow-xl"
                alt="Caller"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-500">
                Incoming {callType === 'video' ? 'Video' : 'Voice'} Call
              </p>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight">{remoteInfo?.name}</h2>
              <p className="text-sm text-slate-400 font-medium">Requesting to connect...</p>
            </div>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={declineCall}
                className="w-20 h-20 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-500/30 transition-all active:scale-95"
              >
                <PhoneOff size={28} />
              </button>
              <button
                onClick={acceptCall}
                className="w-20 h-20 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
              >
                <Phone size={28} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Outgoing Ringing ── */}
        {callState === 'RINGING_OUT' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-950 rounded-[40px] p-12 max-w-sm w-full mx-4 shadow-2xl text-center space-y-8 border border-slate-800"
          >
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
              <div className="absolute inset-4 rounded-full bg-sky-500/30 animate-ping animation-delay-300" />
              <div className="relative w-full h-full rounded-full bg-slate-900 border-2 border-sky-500/50 flex items-center justify-center">
                {callType === 'video' ? <Video size={48} className="text-sky-400" /> : <Phone size={48} className="text-sky-400" />}
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

        {/* ── Active Call ── */}
        {callState === 'IN_CALL' && (
          <div className="relative w-full h-full flex flex-col bg-slate-950">
            {/* Remote Video (full screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay gradient at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

            {/* Local Video (pip) */}
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
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Connected</span>
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
