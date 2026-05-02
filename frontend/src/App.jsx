import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { rehydratePolls } from './redux/slices/pollSlice';
import { rehydrateTeams } from './redux/slices/leaderboardSlice';
import { rehydrateEvents } from './redux/slices/eventSlice';
import { addNotification } from './redux/slices/notificationSlice';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Chat from './pages/Chat';
import Polls from './pages/Polls';
import Leaderboard from './pages/Leaderboard';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import AdminControl from './pages/AdminControl';
import AdminDashboardOne from './pages/admin/AdminDashboardOne';
import AdminDashboardTwo from './pages/admin/AdminDashboardTwo';
import GameHistory from './pages/GameHistory';
import WallOfFame from './pages/WallOfFame';
import { AeroSky } from './components/AeroSky';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/AuthGuard';
import ErrorBoundary from './components/ErrorBoundary';
import useAnalytics from './hooks/useAnalytics';

const syncChannel = new BroadcastChannel('vanguard_sync');

function AppRoutes() {
  const dispatch = useDispatch();
  useAnalytics();

  useEffect(() => {
    syncChannel.onmessage = (event) => {
      const titles = {
        POLLS_UPDATED: 'Polls Updated',
        TEAMS_UPDATED: 'Rankings Updated',
        EVENTS_UPDATED: 'Calendar Updated',
      };
      const messages = {
        POLLS_UPDATED: 'Community polls have been updated. Cast your vote!',
        TEAMS_UPDATED: 'The Vanguard team scores and MVP have just been updated!',
        EVENTS_UPDATED: 'New events have been added to the community calendar.',
      };
      const icons = {
        POLLS_UPDATED: 'Radio',
        TEAMS_UPDATED: 'Trophy',
        EVENTS_UPDATED: 'Calendar',
      };
      const paths = {
        POLLS_UPDATED: '/polls',
        TEAMS_UPDATED: '/leaderboard',
        EVENTS_UPDATED: '/calendar',
      };
      const actions = {
        POLLS_UPDATED: rehydratePolls,
        TEAMS_UPDATED: rehydrateTeams,
        EVENTS_UPDATED: rehydrateEvents,
      };

      if (actions[event.data.type]) {
        dispatch(actions[event.data.type]());
        dispatch(addNotification({
          title: titles[event.data.type],
          message: messages[event.data.type],
          type: event.data.type.toLowerCase().split('_')[0],
          icon: icons[event.data.type],
          path: paths[event.data.type], // Added direct path navigation
        }));
      }
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <AeroSky />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile/:userId?" element={<Profile />} />
          <Route path="/game-history" element={<GameHistory />} />
          <Route path="/wall-of-fame" element={<WallOfFame />} />
          <Route path="/admin/control" element={<AdminControl />} />
          <Route path="/admin/dashboard-1" element={<AdminDashboardOne />} />
          <Route path="/admin/dashboard-2" element={<AdminDashboardTwo />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
