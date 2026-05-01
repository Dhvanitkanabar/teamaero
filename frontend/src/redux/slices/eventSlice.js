import { createSlice } from '@reduxjs/toolkit';

const loadEvents = () => {
  try {
    const saved = localStorage.getItem('vanguard_events');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  events: loadEvents(),
  activeMatch: null,
  calendarEvents: {}
};

const syncChannel = new BroadcastChannel('vanguard_sync');

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
      localStorage.setItem('vanguard_events', JSON.stringify(state.events));
      syncChannel.postMessage({ type: 'EVENTS_UPDATED' });
    },
    updateActiveMatch: (state, action) => {
      state.activeMatch = { ...state.activeMatch, ...action.payload };
      localStorage.setItem('vanguard_match', JSON.stringify(state.activeMatch));
      syncChannel.postMessage({ type: 'EVENTS_UPDATED' });
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    rehydrateEvents: (state) => {
      state.events = loadEvents();
      const savedMatch = localStorage.getItem('vanguard_match');
      if (savedMatch) state.activeMatch = JSON.parse(savedMatch);
      const savedCalendar = localStorage.getItem('vanguard_calendar');
      if (savedCalendar) state.calendarEvents = JSON.parse(savedCalendar);
    },
    updateCalendarEvent: (state, action) => {
      const { date, data } = action.payload;
      state.calendarEvents[date] = data;
      localStorage.setItem('vanguard_calendar', JSON.stringify(state.calendarEvents));
      syncChannel.postMessage({ type: 'EVENTS_UPDATED' });
    }
  },
});

export const { addEvent, updateActiveMatch, setEvents, rehydrateEvents, updateCalendarEvent } = eventSlice.actions;
export default eventSlice.reducer;
