import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [],
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setMembers, setLoading } = userSlice.actions;
export default userSlice.reducer;
