import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { Interval } from '../types/Interval';
import { RootState } from './store';
import { convertLengths } from './rehydrate';

const initialState: Interval[] = [];

const slice = createSlice({
  name: 'intervals',
  initialState,
  reducers: {
    setIntervals: (state, action: PayloadAction<Interval[]>) => action.payload,
  },
  extraReducers: {
    [REHYDRATE]: (state, action: PayloadAction<{intervals: Interval[]}>) => {
      if (!(action.payload?.intervals instanceof Array)) {
        return state;
      }
      return action.payload.intervals.map(convertLengths) as Interval[];
    },
  },
});

export const reducer = slice.reducer;
export const { setIntervals } = slice.actions;

export const selectIntervals = (state: RootState) => state.intervals;
