import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RunningTimes } from "../../types/RunningTimes";
import { RootState } from "../store";

interface AthleteState {
  ftp: number;
  weight: number;
  runningTimes: RunningTimes;
}

const initialState: AthleteState = {
  ftp: 200,
  weight: 75,
  runningTimes: [0, 0, 0, 0, 0],
};

const slice = createSlice({
  name: "athlete",
  initialState,
  reducers: {
    setFtp: (state, action: PayloadAction<number>) => ({
      ...state,
      ftp: action.payload,
    }),
    setWeight: (state, action: PayloadAction<number>) => ({
      ...state,
      weight: action.payload,
    }),
    setRunningTimes: (state, action: PayloadAction<number[]>) => ({
      ...state,
      runningTimes: action.payload,
    }),
  },
});

export const reducer = slice.reducer;
export const { setFtp, setWeight, setRunningTimes } = slice.actions;

const selectAthlete = (state: RootState) => state.athlete;
export const selectFtp = createSelector(selectAthlete, (a) => a.ftp);
export const selectWeight = createSelector(selectAthlete, (a) => a.weight);
export const selectRunningTimes = createSelector(
  selectAthlete,
  (a) => a.runningTimes
);
