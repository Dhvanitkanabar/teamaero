import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { rehydratePolls } from './redux/slices/pollSlice';
import { rehydrateTeams } from './redux/slices/leaderboardSlice';
import { rehydrateEvents } from './redux/slices/eventSlice';
import { addNotification } from './redux/slices/notificationSlice';

// --- Components ---
import { AeroSky } from './components/AeroSky';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/AuthGuard';
import ErrorBoundary from './components/ErrorBoundary';
import useAnalytics from './hooks/useAnalytics';

// --- Lazy-Loaded Pages ---
const Login = lazy(() => import('./pages/Login'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Members = lazy(() => import('./pages/Members'));
const Chat = lazy(() => import('./pages/Chat'));
const Polls = lazy(() => import('./pages/Polls'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminControl = lazy(() => import('./pages/AdminControl'));
const AdminDashboardOne = lazy(() => import('./pages/admin/AdminDashboardOne'));
const AdminDashboardTwo = lazy(() => import('./pages/admin/AdminDashboardTwo'));
const GameHistory = lazy(() => import('./pages/GameHistory'));
const WallOfFame = lazy(() => import('./pages/WallOfFame'));

const syncChannel = new BroadcastChannel('vanguard_sync');

/**
 * LoadingFallback — minimalist loader for Suspense.
 */
const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm z-[9999]">
    <div className="w-12 h-12 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
  </div>
);

/**
 * AppRoutes — rendered inside <Router>.
 */
function AppRoutes() {
  const dispatch = useDispatch();
  const { isGlobalLoading } = useSelector((state) => state.ui);
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
        }));
      }
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        {isGlobalLoading && <LoadingFallback />}
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
            <Route path="/game-history" element={<GameHistory />} />
            <Route path="/wall-of-fame" element={<WallOfFame />} />
            <Route path="/admin/control" element={<AdminControl />} />
            <Route path="/admin/dashboard-1" element={<AdminDashboardOne />} />
            <Route path="/admin/dashboard-2" element={<AdminDashboardTwo />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * App — entry component.
 */
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
