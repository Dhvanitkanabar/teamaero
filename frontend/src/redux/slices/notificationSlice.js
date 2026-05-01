import { createSlice } from '@reduxjs/toolkit';

const loadNotifications = () => {
  try {
    const saved = localStorage.getItem('vanguard_notifications');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  notifications: loadNotifications(),
  unreadCount: loadNotifications().filter(n => !n.read).length
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const newNotification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      };
      state.notifications.unshift(newNotification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
      state.unreadCount = state.notifications.filter(n => !n.read).length;
      localStorage.setItem('vanguard_notifications', JSON.stringify(state.notifications));
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
        state.unreadCount = state.notifications.filter(n => !n.read).length;
        localStorage.setItem('vanguard_notifications', JSON.stringify(state.notifications));
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
      localStorage.setItem('vanguard_notifications', JSON.stringify(state.notifications));
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      localStorage.removeItem('vanguard_notifications');
    },
    rehydrateNotifications: (state) => {
      state.notifications = loadNotifications();
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications, rehydrateNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
