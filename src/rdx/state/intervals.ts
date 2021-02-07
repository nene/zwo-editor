import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Interval } from "../../types/Interval";
import { RootState } from "../store";
import { rehydrateAction, rehydrateLengths } from "../rehydrate";
import { clearWorkout, loadWorkout } from "./workout";
import {
  updateIntervalIntensity,
  updateIntervalDuration,
  moveInterval,
} from "../../interval/intervalUtils";
import { replaceById } from "../../utils/array";
import { clearSelection, selectSelectedId } from "./selectedId";
import intervalFactory from "../../interval/intervalFactory";
import { Duration } from "../../types/Length";
import { selectMode } from "./mode";
import { PaceType } from "../../types/PaceType";

const initialState: Interval[] = [];

const slice = createSlice({
  name: "intervals",
  initialState,
  reducers: {
    setIntervals: (state, action: PayloadAction<Interval[]>) => action.payload,
    addInterval: (state, action: PayloadAction<Interval>) => [
      ...state,
      action.payload,
    ],
    updateInterval: (intervals, { payload }: PayloadAction<Interval>) =>
      replaceById(payload, intervals),
    removeInterval: (
      intervals,
      { payload: id }: PayloadAction<string | undefined>
    ) => intervals.filter((item) => item.id !== id),
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrateAction, (state, action) => {
        return rehydrateLengths(action.payload?.intervals);
      })
      .addCase(clearWorkout, () => [])
      .addCase(loadWorkout, (state, { payload }) => payload.intervals);
  },
});

export const reducer = slice.reducer;
export const {
  setIntervals,
  addInterval,
  updateInterval,
  removeInterval,
} = slice.actions;

export const removeSelectedInterval = createAsyncThunk(
  "intervals/removeSelectedInterval",
  (_: void, { getState, dispatch }) => {
    const selectedId = selectSelectedId(getState() as RootState);
    dispatch(removeInterval(selectedId));
    dispatch(clearSelection());
  }
);

export const duplicateSelectedInterval = createAsyncThunk(
  "intervals/duplicateSelectedInterval",
  (_: void, { getState, dispatch }) => {
    const interval = selectSelectedInterval(getState() as RootState);
    if (interval) {
      dispatch(addInterval(intervalFactory.clone(interval)));
    }
    dispatch(clearSelection());
  }
);

export const adjustSelectedIntervalIntensity = createAsyncThunk(
  "intervals/adjustSelectedIntervalIntensity",
  (amount: number, { getState, dispatch }) => {
    const selectedId = selectSelectedId(getState() as RootState);
    if (selectedId) {
      const intervals = selectIntervals(getState() as RootState);
      dispatch(
        setIntervals(updateIntervalIntensity(selectedId, amount, intervals))
      );
    }
  }
);

export const adjustSelectedIntervalDuration = createAsyncThunk(
  "intervals/adjustSelectedIntervalDuration",
  (amount: Duration, { getState, dispatch }) => {
    const selectedId = selectSelectedId(getState() as RootState);
    if (selectedId) {
      const intervals = selectIntervals(getState() as RootState);
      const mode = selectMode(getState() as RootState);
      dispatch(
        setIntervals(
          updateIntervalDuration(selectedId, amount, intervals, mode)
        )
      );
    }
  }
);

export const moveSelectedInterval = createAsyncThunk(
  "intervals/moveSelectedInterval",
  (direction: -1 | 1, { getState, dispatch }) => {
    const selectedId = selectSelectedId(getState() as RootState);
    if (selectedId) {
      const intervals = selectIntervals(getState() as RootState);
      dispatch(setIntervals(moveInterval(selectedId, direction, intervals)));
    }
  }
);

export const setSelectedIntervalPace = createAsyncThunk(
  "intervals/setSelectedIntervalPace",
  (pace: PaceType, { getState, dispatch }) => {
    const interval = selectSelectedInterval(getState() as RootState);
    if (interval && interval.type === "steady") {
      // TODO: Only steady?
      dispatch(updateInterval({ ...interval, pace }));
    }
  }
);

export const selectIntervals = (state: RootState) => state.intervals;

export const selectSelectedInterval = createSelector(
  selectSelectedId,
  selectIntervals,
  (selectedId, intervals) => {
    return intervals.find((interval) => interval.id === selectedId);
  }
);

export const selectSelectedIntervalPace = createSelector(
  selectSelectedInterval,
  (interval) => {
    return interval && interval.type !== "free" ? interval.pace : undefined;
  }
);
