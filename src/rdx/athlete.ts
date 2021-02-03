import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

interface AthleteState {
  ftp: number;
  weight: number;
}

const initialState: AthleteState = {
  ftp: 200,
  weight: 75,
};

const athleteSlice = createSlice({
  name: 'athlete',
  initialState,
  reducers: {
    setFtp: (state, action) => ({ ...state, ftp: action.payload }),
    setWeight: (state, action) => ({ ...state, weight: action.payload }),
  },
});

export const reducer = athleteSlice.reducer;
export const { setFtp, setWeight } = athleteSlice.actions;

const selectAthlete = (state: RootState) => state.athlete;
export const selectFtp = createSelector(selectAthlete, (a) => a.ftp);
export const selectWeight = createSelector(selectAthlete, (a) => a.weight);
