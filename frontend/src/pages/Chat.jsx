import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../redux/slices/chatSlice';
import { 
  Send, Phone, Video, MoreVertical,
  Paperclip, Smile, MessageSquare,
  Image as ImageIcon, FileText, X, Download, File
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { AeroButton } from '../components/AeroUI';
import socket from '../services/socket';
import SEO from '../components/SEO';
import useToast from '../hooks/useToast';
import FileUploadZone from '../components/FileUploadZone';
import LiveIndicator from '../components/LiveIndicator';
import analytics from '../services/analytics';

import { USER_MAP } from '../utils/userMapping';

const Chat = () => {
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat) || {};
  const authState = useSelector((state) => state.auth) || {};

  const messages = chatState.messages || [];
  const user = authState.user || { name: 'Member', role: 'member', id: 'guest' };

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const toast = useToast();

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Listen for chat messages from other users
  // (Registration is handled globally by Layout.jsx)
  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      dispatch(addMessage(messageData));
    };

    const handleMessageHistory = (history) => {
      // Sync whole history at once
      if (history && history.length > 0) {
        history.forEach(msg => dispatch(syncMessages(msg)));
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('message_history', handleMessageHistory);

    // Re-register listener if socket reconnects
    socket.on('connect', () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.on('receiveMessage', handleReceiveMessage);
      socket.emit('get_history'); // Request history on reconnect
    });

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('message_history', handleMessageHistory);
      socket.off('connect');
    };
  }, [dispatch]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    let fileData = null;
    if (attachedFile) {
      fileData = {
        name: attachedFile.name,
        size: (attachedFile.size / 1024).toFixed(1) + ' KB',
        type: attachedFile.type,
        url: URL.createObjectURL(attachedFile),
      };
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: user.name,
      senderId: user.id || user.accountId || user.name,
      text: inputText,
      timestamp: new Date().toISOString(),
      isAdmin: user.role === 'admin',
      file: fileData,
      avatar: localStorage.getItem(`vanguard_avatar_${user.id || user.accountId || user.name}`),
      style: localStorage.getItem(`vanguard_style_${user.id || user.accountId || user.name}`) || 'avataaars',
      seed: localStorage.getItem(`vanguard_seed_${user.id || user.accountId || user.name}`) || user.name,
    };

    dispatch(addMessage(newMessage));
    socket.emit('sendMessage', newMessage);
    analytics.messageSent(!!fileData);
    if (fileData) {
      analytics.fileUploaded(fileData.type, (attachedFile?.size / (1024 * 1024)).toFixed(2));
      toast.success('File Shared', `"${fileData.name}" sent to the forum.`);
    }
    setInputText('');
    setAttachedFile(null);
    setShowEmojiPicker(false);
  };

  const handleDownload = (file) => {
    if (!file || !file.url) return;
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
      toast.info('File Ready', `"${file.name}" attached. Press send to share.`);
    }
  };

  const handleFileSelected = (file) => {
    if (!file) return;
    setAttachedFile(file);
    setShowUploadZone(false);
    toast.info('File Ready', `"${file.name}" attached. Press send to share.`);
  };

  const addEmoji = (emoji) => setInputText(prev => prev + emoji);

  const commonEmojis = [
    '😊', '😂', '🔥', '🚀', '👍', '❤️', '👋', '🎉',
    '🤔', '👀', '✨', '💯', '😎', '🙌', '✅', '🛡️',
    '⚡', '💻', '🌐', '🎮', '💡', '🌟', '🛠️', '🔒',
  ];

  // Trigger real WebRTC calls via CallModal (mounted globally in Layout)
  const handleVoiceCall = () => { if (window.__vanguardInitiateCall) window.__vanguardInitiateCall('voice'); };
  const handleVideoCall = () => { if (window.__vanguardInitiateCall) window.__vanguardInitiateCall('video'); };

  return (
    <>
      <SEO
        title="Community Forum"
        description="Real-time community forum for Vanguard AERO operators. Send messages, share files, and start live voice and video calls."
        url="/chat"
        noindex={true}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Community Forum — Vanguard AERO',
          description: 'Real-time group messaging and calling hub for Vanguard AERO squadron members.',
          url: 'https://vanguard-aero.vercel.app/chat',
        }}
      />
      <div className="h-[calc(100vh-160px)] lg:h-[calc(100vh-180px)] mb-0 px-4 lg:px-6 max-w-5xl mx-auto relative overflow-hidden">
        <div className="h-full flex flex-col overflow-hidden vanguard-glass rounded-[32px] border-white/50 shadow-2xl bg-white/70">

          {/* Header */}
          <header className="px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between border-b border-slate-100/60 bg-white/40 backdrop-blur-lg shrink-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-xl">
                <MessageSquare size={20} className="text-sky-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-950 tracking-tight truncate">Community Forum</h2>
                  <LiveIndicator variant="badge" showText={false} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 bg-slate-50/50 p-1 rounded-xl border border-slate-100/50">
                <button
                  onClick={handleVoiceCall}
                  title="Start Voice Call"
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  <Phone size={16} />
                </button>
                <button
                  onClick={handleVideoCall}
                  title="Start Video Call"
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                >
                  <Video size={16} />
                </button>
              </div>
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all">
                <MoreVertical size={20} />
              </button>
            </div>
          </header>

          {/* Message Feed */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-scroll overflow-x-hidden p-4 lg:p-8 bg-white/5 min-h-0 relative z-0 pointer-events-auto custom-scrollbar"
          >
            <div className="flex flex-col justify-end min-h-full gap-3 max-w-4xl mx-auto">
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-20">
                  <MessageSquare size={64} strokeWidth={1} />
                  <p className="text-sm font-black uppercase tracking-[0.2em]">Start a conversation</p>
                </div>
              )}

              {messages.map((msg, i) => {
                const isOwn = msg.sender === user.name || msg.senderId === (user.id || user.accountId);
                const isSameSender = i > 0 && messages[i - 1].sender === msg.sender;
                return (
                  <div key={msg.id || i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isSameSender ? '-mt-2' : 'mt-2'}`}>
                    <div className={`max-w-[85%] lg:max-w-[70%] flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isSameSender ? (
                        <div className={`w-9 h-9 rounded-xl p-0.5 shadow-lg flex-shrink-0 mt-0.5 overflow-hidden border-2 ${isOwn ? 'bg-slate-900 border-white/20' : 'bg-white border-slate-100'}`}>
                          {(() => {
                            const senderData = Object.values(USER_MAP).find(u => u.name === msg.sender);
                            return (
                              <img 
                                src={senderData?.customImage || msg.avatar || `https://api.dicebear.com/7.x/${msg.style || 'avataaars'}/svg?seed=${msg.seed || msg.sender}`} 
                                className="w-full h-full object-cover" 
                                alt="Avatar" 
                              />
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="w-9 flex-shrink-0" />
                      )}

                      <div className={`space-y-1 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                        {!isSameSender && (
                          <div className="flex items-center gap-2 px-1 mb-0.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 opacity-50">{msg.sender}</span>
                            <span className="text-[9px] font-bold text-slate-300">
                              {(() => {
                                try {
                                  const d = new Date(msg.timestamp || msg.time);
                                  return isNaN(d.getTime()) ? '...' : format(d, 'HH:mm');
                                } catch { return '...'; }
                              })()}
                            </span>
                          </div>
                        )}

                        <div className={`px-5 py-2.5 rounded-[20px] text-[14px] font-medium shadow-sm flex flex-col gap-2 ${isOwn ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-950 rounded-tl-none'}`}>
                          {msg.file && (
                            <div className={`p-3 rounded-xl border ${isOwn ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} mb-1`}>
                              {msg.file.type.startsWith('image/') ? (
                                <div className="space-y-2">
                                  <img src={msg.file.url} alt="Shared" className="rounded-lg max-h-64 object-cover w-full cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleDownload(msg.file)} />
                                  <div className="flex items-center justify-between">
                                    <p className="text-[10px] opacity-60 font-bold uppercase truncate max-w-[200px]">{msg.file.name}</p>
                                    <button onClick={() => handleDownload(msg.file)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOwn ? 'hover:bg-white/10' : 'hover:bg-white shadow-sm'}`}>
                                      <Download size={14} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOwn ? 'bg-white/10 text-sky-400' : 'bg-white text-sky-600 shadow-sm'}`}>
                                    <FileText size={20} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-black truncate">{msg.file.name}</p>
                                    <p className="text-[9px] opacity-60 uppercase font-bold">{msg.file.size}</p>
                                  </div>
                                  <button onClick={() => handleDownload(msg.file)} className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOwn ? 'hover:bg-white/10' : 'hover:bg-slate-100 shadow-sm'}`}>
                                    <Download size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          {msg.text && <p className="leading-normal">{msg.text}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-2 shrink-0" />
            </div>
          </div>

          {/* Input Footer */}
          <footer className="p-4 lg:p-6 bg-white/40 border-t border-slate-100/40 shrink-0 z-10 relative">
            <AnimatePresence>
              {attachedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-4 left-4 lg:left-6 right-4 lg:right-6 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                    {attachedFile.type.startsWith('image/') ? <ImageIcon size={20} /> : <File size={20} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-slate-950 truncate">{attachedFile.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{(attachedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={() => setAttachedFile(null)} className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500">
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full mb-4 left-4 lg:left-6 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50"
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quick Reactions</span>
                    <button onClick={() => setShowEmojiPicker(false)} className="text-slate-300 hover:text-slate-950 transition-colors"><X size={14} /></button>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {commonEmojis.map(emoji => (
                      <button type="button" key={emoji} onClick={() => addEmoji(emoji)} className="w-10 h-10 flex items-center justify-center text-xl hover:bg-slate-50 rounded-xl transition-all active:scale-90">{emoji}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showUploadZone && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-full mb-3 left-4 lg:left-6 right-4 lg:right-6 z-50"
                >
                  <div className="bg-white rounded-[24px] shadow-2xl border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attach File</p>
                      <button
                        onClick={() => setShowUploadZone(false)}
                        aria-label="Close file upload"
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-300 hover:text-slate-950 hover:bg-slate-50 transition-all"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                    <FileUploadZone
                      onFilesSelected={handleFileSelected}
                      maxSizeMB={10}
                      multiple={false}
                      label="Drop a file or click to browse"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-4xl mx-auto bg-white p-2 rounded-2xl border border-slate-100 shadow-xl relative z-10">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button
                type="button"
                onClick={() => setShowUploadZone(!showUploadZone)}
                aria-label="Attach a file"
                aria-expanded={showUploadZone}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${attachedFile || showUploadZone ? 'bg-sky-50 text-sky-600' : 'text-slate-300 hover:text-sky-600 hover:bg-slate-50'}`}
              >
                <Paperclip size={20} aria-hidden="true" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-transparent py-3 px-2 text-[14px] font-bold text-slate-950 outline-none placeholder:text-slate-300"
              />

              <div className="flex items-center gap-2 pr-1">
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`hidden sm:flex w-9 h-9 items-center justify-center transition-all rounded-xl ${showEmojiPicker ? 'bg-sky-50 text-sky-600' : 'text-slate-300 hover:text-sky-500 hover:bg-slate-50'}`}>
                  <Smile size={20} />
                </button>
                <AeroButton type="submit" disabled={!inputText.trim() && !attachedFile} className="w-10 h-10 flex items-center justify-center p-0 !rounded-xl !bg-sky-600 !shadow-lg">
                  <Send size={18} className={(inputText.trim() || attachedFile) ? 'translate-x-0.5' : 'opacity-30'} />
                </AeroButton>
              </div>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Chat;

