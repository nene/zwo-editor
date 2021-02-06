import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Interval } from '../../types/Interval';
import { RootState } from '../store';
import { rehydrateAction, rehydrateLengths } from '../rehydrate';
import { clearWorkout, loadWorkout } from './workout';
import { updateIntervalIntensity } from '../../interval/intervalUtils';
import { replaceById } from '../../utils/array';
import { clearSelection, selectSelectedId } from './selectedId';
import intervalFactory from '../../interval/intervalFactory';

const initialState: Interval[] = [];

const slice = createSlice({
  name: 'intervals',
  initialState,
  reducers: {
    setIntervals: (state, action: PayloadAction<Interval[]>) => action.payload,
    addInterval: (state, action: PayloadAction<Interval>) => [...state, action.payload],
    adjustIntensity: (intervals, {payload}: PayloadAction<{id: string, amount: number}>) =>
      updateIntervalIntensity(payload.id, payload.amount, intervals),
    updateInterval: (intervals, {payload}: PayloadAction<Interval>) =>
      replaceById(payload, intervals),
    removeInterval: (intervals, {payload: id}: PayloadAction<string | undefined>) =>
      intervals.filter(item => item.id !== id),
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
export const { setIntervals, addInterval, adjustIntensity, updateInterval, removeInterval } = slice.actions;

export const removeSelectedInterval = createAsyncThunk(
  'intervals/removeSelectedInterval',
  (_: void, {getState, dispatch}) => {
    const selectedId = selectSelectedId(getState() as RootState);
    dispatch(removeInterval(selectedId));
    dispatch(clearSelection());
  },
);

export const duplicateSelectedInterval = createAsyncThunk(
  'intervals/duplicateSelectedInterval',
  (_: void, {getState, dispatch}) => {
    const interval = selectSelectedInterval(getState() as RootState);
    if (interval) {
      dispatch(addInterval(intervalFactory.clone(interval)));
    }
    dispatch(clearSelection());
  },
);

export const selectIntervals = (state: RootState) => state.intervals;

export const selectSelectedInterval = createSelector(selectSelectedId, selectIntervals, (selectedId, intervals) => {
  return intervals.find((interval) => interval.id === selectedId);
});
