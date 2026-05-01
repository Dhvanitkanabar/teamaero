import { io } from 'socket.io-client';

// Single shared socket instance for the entire app.
// Importing this file from multiple components always returns the SAME socket.
const socket = io('http://localhost:5000', {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
});

export default socket;
