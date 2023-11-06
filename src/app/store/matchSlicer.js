import { createSlice } from "@reduxjs/toolkit";
import { matches } from "../data";

const initialState = {
  value: {},
  matches: matches,
};

export const matchSlicer = createSlice({
  name: "match",
  initialState,
  reducers: {
    buildMatch: (state, action) => {
      state.value = action.payload;
    },
    addNewMatch: (state, action) => {
      state.matches = [action.payload, ...state.matches];
    },
    addShot: (state, action) => {
      const { matchId, shot } = action.payload;
      let matchIndex = -1;
      for (let i = 0; i < state.matches.length; i++) {
        if (state.matches[i].seasonId === matchId) {
          matchIndex = i;
          break;
        }
      }
      if (matchIndex != -1) {
        state.matches[matchIndex].shotChart.shots.push(shot);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { buildMatch, addNewMatch, addShot } = matchSlicer.actions;

export default matchSlicer.reducer;
