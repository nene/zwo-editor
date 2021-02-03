import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RunningTimes } from '../types/RunningTimes';
import { RootState } from './store';

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

const athleteSlice = createSlice({
  name: 'athlete',
  initialState,
  reducers: {
    setFtp: (state, action) => ({ ...state, ftp: action.payload }),
    setWeight: (state, action) => ({ ...state, weight: action.payload }),
    setRunningTimes: (state, action) => ({ ...state, runningTimes: action.payload }),
  },
});

export const reducer = athleteSlice.reducer;
export const { setFtp, setWeight, setRunningTimes } = athleteSlice.actions;

const selectAthlete = (state: RootState) => state.athlete;
export const selectFtp = createSelector(selectAthlete, (a) => a.ftp);
export const selectWeight = createSelector(selectAthlete, (a) => a.weight);
export const selectRunningTimes = createSelector(selectAthlete, (a) => a.runningTimes);
