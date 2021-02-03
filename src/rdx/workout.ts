import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { LengthType } from '../types/LengthType';
import { SportType } from '../types/SportType';
import { RootState } from './store';

interface WorkoutState {
  name: string;
  author: string;
  description: string;
  tags: string[],
  sportType: SportType;
  lengthType: LengthType;
}

const initialState: WorkoutState = {
  name: "",
  author: "",
  description: "",
  tags: [],
  sportType: "bike",
  lengthType: "time",
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => ({ ...state, name: action.payload }),
    setAuthor: (state, action: PayloadAction<string>) => ({ ...state, author: action.payload }),
    setDescription: (state, action: PayloadAction<string>) => ({ ...state, description: action.payload }),
    setTags: (state, action: PayloadAction<string[]>) => ({ ...state, tags: action.payload }),
    setSportType: (state, action: PayloadAction<SportType>) => ({ ...state, sportType: action.payload }),
    setLengthType: (state, action: PayloadAction<LengthType>) => ({ ...state, lengthType: action.payload }),
  },
});

export const reducer = workoutSlice.reducer;
export const { setName, setAuthor, setDescription, setTags, setSportType, setLengthType } = workoutSlice.actions;

const selectWorkout = (state: RootState) => state.workout;
export const selectName = createSelector(selectWorkout, (w) => w.name);
export const selectAuthor = createSelector(selectWorkout, (w) => w.author);
export const selectDescription = createSelector(selectWorkout, (w) => w.description);
export const selectTags = createSelector(selectWorkout, (w) => w.tags);
export const selectSportType = createSelector(selectWorkout, (w) => w.sportType);
export const selectLengthType = createSelector(selectWorkout, (w) => w.lengthType);
