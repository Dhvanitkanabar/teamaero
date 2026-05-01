import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { setUser, logout } from '../redux/slices/authSlice';

/**
 * useAuth — Centralised authentication hook.
 *
 * Returns:
 *   user        — current authenticated user object (or null)
 *   isLoggedIn  — boolean convenience flag
 *   login(userData) — persist user to Redux store
 *   logout()    — clear auth and redirect to /login
 *   hasRole(role)   — check if user holds a specific role
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const login = useCallback(
    (userData) => {
      dispatch(setUser(userData));
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      return user.role === role;
    },
    [user]
  );

  return {
    user,
    isLoggedIn: !!isAuthenticated,
    login,
    logout: logoutUser,
    hasRole,
  };
};

export default useAuth;
