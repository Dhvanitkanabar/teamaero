import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';

/**
 * useToast — convenient wrapper to fire toast notifications.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success('Saved!', 'Your changes were saved successfully.');
 *   toast.error('Failed', 'Could not connect to the server.');
 *   toast.info('Update', 'New polls are live.');
 *   toast.warning('Heads up', 'Session expires soon.');
 *   toast.poll('Poll Updated', 'A new poll is live.');
 *   toast.show({ type: 'ranking', title: '...', message: '...' });
 */
const useToast = () => {
  const dispatch = useDispatch();

  const show = useCallback(
    ({ type = 'info', title = '', message = '' }) => {
      dispatch(addNotification({ type, title, message }));
    },
    [dispatch]
  );

  return {
    show,
    success: (title, message) => show({ type: 'success', title, message }),
    error:   (title, message) => show({ type: 'error',   title, message }),
    info:    (title, message) => show({ type: 'info',    title, message }),
    warning: (title, message) => show({ type: 'warning', title, message }),
    poll:    (title, message) => show({ type: 'poll',    title, message }),
    ranking: (title, message) => show({ type: 'ranking', title, message }),
    event:   (title, message) => show({ type: 'event',   title, message }),
  };
};

export default useToast;
