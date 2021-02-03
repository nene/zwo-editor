import { createSlice } from '@reduxjs/toolkit';
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

export const selectFtp = (state: RootState) => state.athlete.ftp;
export const selectWeight = (state: RootState) => state.athlete.weight;
