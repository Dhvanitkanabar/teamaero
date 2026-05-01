import { useState, useEffect } from 'react';
import socket from '../services/socket';

/**
 * useSocketStatus — tracks real-time socket connection state.
 *
 * Returns:
 *   connected   — boolean, true when socket is live
 *   connecting  — boolean, true during reconnect attempts
 *   error       — string | null, last error message
 *   reconnectAttempt — number, current reconnect count
 */
const useSocketStatus = () => {
  const [connected, setConnected] = useState(socket.connected);
  const [connecting, setConnecting] = useState(!socket.connected);
  const [error, setError] = useState(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setConnecting(false);
      setError(null);
      setReconnectAttempt(0);
    };

    const onDisconnect = (reason) => {
      setConnected(false);
      setConnecting(true);
      setError(`Disconnected: ${reason}`);
    };

    const onConnectError = (err) => {
      setConnected(false);
      setConnecting(true);
      setError(err.message || 'Connection error');
    };

    const onReconnectAttempt = (attempt) => {
      setConnecting(true);
      setReconnectAttempt(attempt);
    };

    const onReconnect = () => {
      setConnected(true);
      setConnecting(false);
      setError(null);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.io.on('reconnect_attempt', onReconnectAttempt);
    socket.io.on('reconnect', onReconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
      socket.io.off('reconnect', onReconnect);
    };
  }, []);

  return { connected, connecting, error, reconnectAttempt };
};

export default useSocketStatus;
