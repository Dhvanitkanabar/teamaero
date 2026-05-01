import { createSlice } from '@reduxjs/toolkit';

const loadPolls = () => {
  try {
    const saved = localStorage.getItem('vanguard_polls');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  polls: loadPolls(),
};

const syncChannel = new BroadcastChannel('vanguard_sync');

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    addPoll: (state, action) => {
      state.polls.unshift({
        id: Date.now(),
        ...action.payload,
        totalVotes: 0,
        active: true,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('vanguard_polls', JSON.stringify(state.polls));
      syncChannel.postMessage({ type: 'POLLS_UPDATED' });
    },
    votePoll: (state, action) => {
      const { pollId, optionId, userName } = action.payload;
      const poll = state.polls.find(p => p.id === pollId);
      if (poll) {
        poll.options.forEach(opt => {
          if (opt.voters) {
             opt.voters = opt.voters.filter(v => v !== userName);
             opt.votes = opt.voters.length;
          }
        });

        const option = poll.options.find(o => o.id === optionId);
        if (option) {
          if (!option.voters) option.voters = [];
          if (!option.voters.includes(userName)) {
            option.voters.push(userName);
            option.votes = option.voters.length;
          }
        }
        poll.totalVotes = poll.options.reduce((sum, opt) => sum + (opt.voters?.length || 0), 0);
      }
      localStorage.setItem('vanguard_polls', JSON.stringify(state.polls));
      syncChannel.postMessage({ type: 'POLLS_UPDATED' });
    },
    togglePollStatus: (state, action) => {
      const poll = state.polls.find(p => p.id === action.payload);
      if (poll) {
        poll.active = !poll.active;
      }
      localStorage.setItem('vanguard_polls', JSON.stringify(state.polls));
      syncChannel.postMessage({ type: 'POLLS_UPDATED' });
    },
    rehydratePolls: (state) => {
      state.polls = loadPolls();
    }
  },
});

export const { addPoll, votePoll, togglePollStatus, rehydratePolls } = pollSlice.actions;
export default pollSlice.reducer;
