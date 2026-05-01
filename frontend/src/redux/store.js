import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import eventReducer from './slices/eventSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leaderboard: leaderboardReducer,
    event: eventReducer,
    user: userReducer,
    notifications: notificationReducer,
  },
});
