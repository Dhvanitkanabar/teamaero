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
    origin: "*", // allow all origins for now
    methods: ["GET", "POST"]
  }
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user sends a message, broadcast it to everyone else
  socket.on('sendMessage', (messageData) => {
    console.log('Message received:', messageData);
    // Broadcast the message to all OTHER connected clients
    socket.broadcast.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO Server running on port ${PORT}`);
});
