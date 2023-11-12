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
    addEvent: (state, action) => {
      const { matchId, event } = action.payload;
      let matchIndex = -1;
      for (let i = 0; i < state.matches.length; i++) {
        if (state.matches[i].seasonId === matchId) {
          matchIndex = i;
          break;
        }
      }
      if (matchIndex == -1) {
        return;
      }

      const shotDescs = ["pointsTwoMade", "pointsThreeMade", "freeThrowsMade"];
      if (shotDescs.includes(event.eventType)) {
        try {
          state.matches[matchIndex].shotChart.shots.push(event);
        } catch (err) {
          console.log(err);
        }

        try {
          state.matches[matchIndex].pbp[event.periodId].events.push(event);
        } catch (err) {
          console.error(err);
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { buildMatch, addNewMatch, addShot, addEvent } =
  matchSlicer.actions;

export default matchSlicer.reducer;
