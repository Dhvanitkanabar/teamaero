import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
  user: null, 
  isAuthenticated: false, 
  role: null, 
  loading: false 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.role = action.payload?.role || 'member';
      // We still save to localStorage for sync purposes across tabs, 
      // but we will NOT auto-load it on page refresh to satisfy user request for re-login
      localStorage.setItem('vanguard_auth', JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role
      }));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem('vanguard_auth');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
