const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Track connected users: { socketId: { userId, userName } }
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // --- User Registration ---
  // Each client registers themselves with their userId and name on connect
  socket.on('register', ({ userId, userName }) => {
    connectedUsers[socket.id] = { userId, userName };
    console.log(`Registered: ${userName} (${userId}) as socket ${socket.id}`);
    // Broadcast updated user list to all clients
    io.emit('online_users', Object.values(connectedUsers));
  });

  // --- Chat ---
  socket.on('sendMessage', (messageData) => {
    socket.broadcast.emit('receiveMessage', messageData);
  });

  // --- WebRTC Signaling ---

  // Caller initiates a call to all other connected users
  socket.on('call:initiate', ({ callType, callerName, callerId }) => {
    console.log(`Call initiated by ${callerName} (type: ${callType})`);
    // Broadcast call invitation to all OTHER connected sockets
    socket.broadcast.emit('call:incoming', {
      callType,
      callerName,
      callerId,
      callerSocketId: socket.id,
    });
  });

  // A callee accepts the call → notify the original caller
  socket.on('call:accept', ({ callerSocketId, accepterName }) => {
    console.log(`Call accepted by ${accepterName}`);
    io.to(callerSocketId).emit('call:accepted', {
      accepterSocketId: socket.id,
      accepterName,
    });
  });

  // A callee declines the call → notify the original caller
  socket.on('call:decline', ({ callerSocketId, declinerName }) => {
    console.log(`Call declined by ${declinerName}`);
    io.to(callerSocketId).emit('call:declined', { declinerName });
  });

  // End/hang up the call → notify all participants
  socket.on('call:end', ({ targetSocketId }) => {
    console.log(`Call ended by ${socket.id}`);
    if (targetSocketId) {
      io.to(targetSocketId).emit('call:ended');
    } else {
      socket.broadcast.emit('call:ended');
    }
  });

  // --- WebRTC Offer/Answer/ICE relay ---
  socket.on('webrtc:offer', ({ offer, targetSocketId }) => {
    io.to(targetSocketId).emit('webrtc:offer', {
      offer,
      senderSocketId: socket.id,
    });
  });

  socket.on('webrtc:answer', ({ answer, targetSocketId }) => {
    io.to(targetSocketId).emit('webrtc:answer', {
      answer,
      senderSocketId: socket.id,
    });
  });

  socket.on('webrtc:ice-candidate', ({ candidate, targetSocketId }) => {
    io.to(targetSocketId).emit('webrtc:ice-candidate', {
      candidate,
      senderSocketId: socket.id,
    });
  });

  // --- Disconnect ---
  socket.on('disconnect', () => {
    const user = connectedUsers[socket.id];
    if (user) {
      console.log(`User disconnected: ${user.userName}`);
      delete connectedUsers[socket.id];
      io.emit('online_users', Object.values(connectedUsers));
      // Notify others if a call was in progress
      socket.broadcast.emit('call:ended');
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO Server running on port ${PORT}`);
});
