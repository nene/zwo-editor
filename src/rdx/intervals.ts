import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { Interval } from '../types/Interval';
import { RootState } from './store';
import { convertLengths } from './rehydrate';

type IntervalsState = Interval[];

const initialState: IntervalsState = [];

const intervalsSlice = createSlice({
  name: 'intervals',
  initialState,
  reducers: {
    setIntervals: (state, action: PayloadAction<Interval[]>) => action.payload,
  },
  extraReducers: {
    [REHYDRATE]: (state, action: PayloadAction<{intervals: IntervalsState}>) => {
      if (!(action.payload?.intervals instanceof Array)) {
        return state;
      }
      return action.payload.intervals.map(convertLengths) as Interval[];
    },
  },
});

export const reducer = intervalsSlice.reducer;
export const { setIntervals } = intervalsSlice.actions;

export const selectIntervals = (state: RootState) => state.intervals;
