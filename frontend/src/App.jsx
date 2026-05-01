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
import { AeroSky } from './components/AeroSky';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/AuthGuard';

const syncChannel = new BroadcastChannel('vanguard_sync');

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    syncChannel.onmessage = (event) => {
      if (event.data.type === 'POLLS_UPDATED') {
        dispatch(rehydratePolls());
        dispatch(addNotification({
          title: 'Polls Updated',
          message: 'Community polls have been updated. Cast your vote!',
          type: 'poll',
          icon: 'Radio'
        }));
      }
      if (event.data.type === 'TEAMS_UPDATED') {
        dispatch(rehydrateTeams());
        dispatch(addNotification({
          title: 'Rankings Updated',
          message: 'The Vanguard team scores and MVP have just been updated!',
          type: 'ranking',
          icon: 'Trophy'
        }));
      }
      if (event.data.type === 'EVENTS_UPDATED') {
        dispatch(rehydrateEvents());
        dispatch(addNotification({
          title: 'Calendar Updated',
          message: 'New events have been added to the community calendar.',
          type: 'event',
          icon: 'Calendar'
        }));
      }
    };
  }, [dispatch]);

  return (
    <Router>
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/control" element={<AdminControl />} />
          <Route path="/admin/dashboard-1" element={<AdminDashboardOne />} />
          <Route path="/admin/dashboard-2" element={<AdminDashboardTwo />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
