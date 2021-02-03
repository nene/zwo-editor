import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface WorkoutState {
  name: string;
  author: string;
  description: string;
  tags: string[],
}

const initialState: WorkoutState = {
  name: "",
  author: "",
  description: "",
  tags: [],
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => ({ ...state, name: action.payload }),
    setAuthor: (state, action: PayloadAction<string>) => ({ ...state, author: action.payload }),
    setDescription: (state, action: PayloadAction<string>) => ({ ...state, description: action.payload }),
    setTags: (state, action: PayloadAction<string[]>) => ({ ...state, tags: action.payload }),
  },
});

export const reducer = workoutSlice.reducer;
export const { setName, setAuthor, setDescription, setTags } = workoutSlice.actions;

const selectWorkout = (state: RootState) => state.workout;
export const selectName = createSelector(selectWorkout, (w) => w.name);
export const selectAuthor = createSelector(selectWorkout, (w) => w.author);
export const selectDescription = createSelector(selectWorkout, (w) => w.description);
export const selectTags = createSelector(selectWorkout, (w) => w.tags);
