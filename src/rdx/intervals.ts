import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Interval } from '../types/Interval';
import { RootState } from './store';
import { rehydrateAction, rehydrateLengths } from './rehydrate';
import { clearWorkout, loadWorkout } from './workout';
import { updateIntervalIntensity } from '../interval/intervalUtils';

const initialState: Interval[] = [];

const slice = createSlice({
  name: 'intervals',
  initialState,
  reducers: {
    setIntervals: (state, action: PayloadAction<Interval[]>) => action.payload,
    addInterval: (state, action: PayloadAction<Interval>) => [...state, action.payload],
    adjustIntensity: (intervals, {payload}: PayloadAction<{id: string, amount: number}>) =>
      updateIntervalIntensity(payload.id, payload.amount, intervals),
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrateAction, (state, action) => {
        return rehydrateLengths(action.payload?.intervals);
      })
      .addCase(clearWorkout, () => [])
      .addCase(loadWorkout, (state, {payload}) => payload.intervals)
  },
});

export const reducer = slice.reducer;
export const { setIntervals, addInterval, adjustIntensity } = slice.actions;

export const selectIntervals = (state: RootState) => state.intervals;
