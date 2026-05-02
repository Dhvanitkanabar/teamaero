import { createSlice } from '@reduxjs/toolkit';
import { local, LOCAL_KEYS } from '../../utils/storage';

const initialState = {
  theme: local.get(LOCAL_KEYS.THEME, 'dark'),
  isGlobalLoading: false,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      local.set(LOCAL_KEYS.THEME, state.theme);
    },
    setGlobalLoading: (state, action) => {
      state.isGlobalLoading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { toggleTheme, setGlobalLoading, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
