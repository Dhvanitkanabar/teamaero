import { createSlice } from '@reduxjs/toolkit';
import { local, LOCAL_KEYS, clearAllStorageOnLogout } from '../../utils/storage';

const getPersistedAuth = () => {
  const persisted = local.get(LOCAL_KEYS.AUTH);
  if (persisted && persisted.isAuthenticated) {
    return persisted;
  }
  return {
    user: null,
    isAuthenticated: false,
    role: null,
  };
};

const initialState = {
  ...getPersistedAuth(),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.role = action.payload?.role || 'member';
      // Persist auth state for cross-tab sync via BroadcastChannel.
      // We do NOT auto-rehydrate on page load (user must re-login).
      // Passwords are NEVER stored here — only identity metadata.
      local.set(LOCAL_KEYS.AUTH, {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      });
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      // Wipe ALL namespaced data from localStorage + sessionStorage on logout.
      clearAllStorageOnLogout();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
