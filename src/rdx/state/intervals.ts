import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Interval } from "../../types/Interval";
import { RootState } from "../store";
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
import { propEq } from "ramda";
import { Instruction } from "../../types/Instruction";

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
    removeInstruction: (
      intervals,
      { payload }: PayloadAction<{ intervalId: string; instructionId: string }>
    ) => {
      return updateInstructionsField({
        intervals,
        intervalId: payload.intervalId,
        update: (instructions) =>
          instructions.filter((i) => i.id !== payload.instructionId),
      });
    },
    updateInstruction: (
      intervals,
      {
        payload,
      }: PayloadAction<{ intervalId: string; instruction: Instruction }>
    ) => {
      return updateInstructionsField({
        intervals,
        intervalId: payload.intervalId,
        update: (instructions) =>
          replaceById(payload.instruction, instructions),
      });
    },
    addInstruction: (
      intervals,
      {
        payload,
      }: PayloadAction<{ intervalId: string; instruction: Instruction }>
    ) => {
      return updateInstructionsField({
        intervals,
        intervalId: payload.intervalId,
        update: (instructions) => [...instructions, payload.instruction],
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearWorkout, () => [])
      .addCase(loadWorkout, (state, { payload }) => payload.intervals);
  },
});

type UpdateInstructionsFieldParams = {
  intervalId: string;
  update: (instructions: Instruction[]) => Instruction[];
  intervals: Interval[];
};

const updateInstructionsField = ({
  intervals,
  intervalId,
  update,
}: UpdateInstructionsFieldParams): Interval[] => {
  const interval = intervals.find(propEq("id", intervalId));
  if (!interval) {
    return intervals;
  }
  return replaceById(
    {
      ...interval,
      instructions: update(interval.instructions),
    },
    intervals
  );
};

export const reducer = slice.reducer;
export const {
  setIntervals,
  addInterval,
  updateInterval,
  removeInterval,
  removeInstruction,
  updateInstruction,
  addInstruction,
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
