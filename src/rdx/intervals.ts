import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { Interval } from '../types/Interval';
import { RootState } from './store';
import { rehydrateLengths } from './rehydrate';
import { clearWorkout } from './workout';

const initialState: Interval[] = [];

const slice = createSlice({
  name: 'intervals',
  initialState,
  reducers: {
    setIntervals: (state, action: PayloadAction<Interval[]>) => action.payload,
    addInterval: (state, action: PayloadAction<Interval>) => [...state, action.payload],
  },
  extraReducers: {
    [REHYDRATE]: (state, action: PayloadAction<{intervals?: Interval[]}>) => {
      return rehydrateLengths(action.payload?.intervals);
    },
    [clearWorkout.type]: () => [],
  },
});

export const reducer = slice.reducer;
export const { setIntervals, addInterval } = slice.actions;

export const selectIntervals = (state: RootState) => state.intervals;
