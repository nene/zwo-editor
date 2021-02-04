import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { Interval } from '../types/Interval';
import { RootState } from './store';
import { RehydrateAction, rehydrateLengths } from './rehydrate';
import { clearWorkout, loadWorkout } from './workout';

const initialState: Interval[] = [];

const slice = createSlice({
  name: 'intervals',
  initialState,
  reducers: {
    setIntervals: (state, action: PayloadAction<Interval[]>) => action.payload,
    addInterval: (state, action: PayloadAction<Interval>) => [...state, action.payload],
  },
  extraReducers: (builder) => {
    builder
      .addCase(REHYDRATE, (state, action: RehydrateAction) => {
        return rehydrateLengths(action.payload?.intervals);
      })
      .addCase(clearWorkout, () => [])
      .addCase(loadWorkout, (state, {payload}) => payload.intervals)
  },
});

export const reducer = slice.reducer;
export const { setIntervals, addInterval } = slice.actions;

export const selectIntervals = (state: RootState) => state.intervals;
