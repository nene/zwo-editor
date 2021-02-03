import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { Interval } from '../types/Interval';
import { RootState } from './store';
import { convertLengths } from '../storage/storage';

interface IntervalsState {
  intervals: Interval[];
}

const initialState: IntervalsState = { intervals: [] };

const intervalsSlice = createSlice({
  name: 'intervals',
  initialState,
  reducers: {
    setIntervals: (state, action: PayloadAction<Interval[]>) => ({ intervals: action.payload }),
  },
  extraReducers: {
    [REHYDRATE]: (state, action: PayloadAction<{intervals: IntervalsState}>) => {
      if (!action.payload.intervals) {
        return state;
      }
      return {
        intervals: action.payload.intervals.intervals.map(convertLengths) as Interval[],
      };
    },
  },
});

export const reducer = intervalsSlice.reducer;
export const { setIntervals } = intervalsSlice.actions;

const selectBase = (state: RootState) => state.intervals;
export const selectIntervals = createSelector(selectBase, (s) => s.intervals);
