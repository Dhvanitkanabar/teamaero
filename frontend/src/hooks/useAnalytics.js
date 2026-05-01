import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../services/analytics';

// Page title map for clean GA reports
const PAGE_TITLES = {
  '/': 'Home',
  '/login': 'Login',
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/leaderboard': 'Leaderboard',
  '/calendar': 'Calendar',
  '/polls': 'Polls',
  '/chat': 'Community Forum',
  '/profile': 'Profile',
  '/wall-of-fame': 'Wall of Fame',
  '/game-history': 'Game History',
  '/admin/control': 'Admin Control',
  '/admin/dashboard-1': 'Admin Dashboard 1',
  '/admin/dashboard-2': 'Admin Dashboard 2',
};

/**
 * useAnalytics — auto page tracking + event tracking helpers.
 *
 * Must be used inside <Router>.
 *
 * Returns:
 *   trackEvent(name, params) — fire a custom GA event
 *   trackClick(label)        — track a button/link click
 *   trackFileUpload(type, mb) — track file uploads
 */
const useAnalytics = () => {
  const location = useLocation();

  // Auto page view on every route change
  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] || document.title || location.pathname;
    analytics.pageView(location.pathname, title);
  }, [location.pathname]);

  const trackEvent = useCallback((name, params = {}) => {
    analytics.event(name, params);
  }, []);

  const trackClick = useCallback((label, extra = {}) => {
    analytics.event('button_click', { label, ...extra });
  }, []);

  const trackFileUpload = useCallback((fileType, fileSizeMB) => {
    analytics.fileUploaded(fileType, fileSizeMB);
  }, []);

  return { trackEvent, trackClick, trackFileUpload };
};

export default useAnalytics;
