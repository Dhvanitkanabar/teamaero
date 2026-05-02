import { createSlice } from '@reduxjs/toolkit';

const chatChannel = new BroadcastChannel('vanguard_chat');

const SHARED_KEY = 'vanguard_messages_shared';

const loadMessages = () => {
  try {
    return JSON.parse(localStorage.getItem(SHARED_KEY)) || [];
  } catch {
    return [];
  }
};

const initialState = {
  messages: loadMessages()
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // Prevent duplicate messages
      const exists = state.messages.find(m => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
        localStorage.setItem(SHARED_KEY, JSON.stringify(state.messages));
        chatChannel.postMessage({ type: 'NEW_MESSAGE', payload: action.payload });
      }
    },
    syncMessages: (state, action) => {
      const exists = state.messages.find(m => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
        localStorage.setItem(SHARED_KEY, JSON.stringify(state.messages));
      }
    },
    rehydrateChat: (state) => {
      state.messages = loadMessages();
    },
    clearMessages: (state) => {
      state.messages = [];
      localStorage.setItem(SHARED_KEY, JSON.stringify([]));
    }
  }
});

export const { addMessage, syncMessages, rehydrateChat, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
