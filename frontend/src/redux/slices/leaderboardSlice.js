import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rankings: [],
  history: [],
  wallOfFame: [],
  teams: [
    { id: 'aero', name: 'Aero', score: 1450, leader: 'Devanshi Vadiya' },
    { id: 'ignis', name: 'Ignis', score: 1250, leader: 'Ankit Kumar' },
    { id: 'aqua', name: 'Aqua', score: 1120, leader: 'Jonty Patel' },
    { id: 'tera', name: 'Tera', score: 980, leader: 'Pal Pathak' },
  ],
  dailyBest: {
    name: "Devanshi Vadiya",
    id: "LEADER_01",
    score: 450,
    activity: "Strategic Planning",
    time: "Today, 10:30 AM"
  }
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setRankings: (state, action) => {
      state.rankings = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setWallOfFame: (state, action) => {
      state.wallOfFame = action.payload;
    },
    updateTeamScore: (state, action) => {
      const { id, score } = action.payload;
      const team = state.teams.find(t => t.id === id);
      if (team) {
        team.score = score;
      }
      localStorage.setItem('vanguard_teams', JSON.stringify(state.teams));
    },
    updateDailyBest: (state, action) => {
      state.dailyBest = { ...state.dailyBest, ...action.payload };
      localStorage.setItem('vanguard_daily_best', JSON.stringify(state.dailyBest));
    },
    rehydrateTeams: (state) => {
      const saved = localStorage.getItem('vanguard_teams');
      if (saved) state.teams = JSON.parse(saved);
      const savedDaily = localStorage.getItem('vanguard_daily_best');
      if (savedDaily) state.dailyBest = JSON.parse(savedDaily);
    }
  },
});

export const { setRankings, setHistory, setWallOfFame, updateTeamScore, updateDailyBest, rehydrateTeams } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
