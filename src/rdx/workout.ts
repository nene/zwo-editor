import { createSlice } from '@reduxjs/toolkit';
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
    setName: (state, action) => ({ ...state, name: action.payload }),
    setAuthor: (state, action) => ({ ...state, author: action.payload }),
    setDescription: (state, action) => ({ ...state, description: action.payload }),
    setTags: (state, action) => ({ ...state, tags: action.payload }),
  },
});

export const reducer = workoutSlice.reducer;
export const { setName, setAuthor, setDescription, setTags } = workoutSlice.actions;

export const selectName = (state: RootState) => state.workout.name;
export const selectAuthor = (state: RootState) => state.workout.author;
export const selectDescription = (state: RootState) => state.workout.description;
export const selectTags = (state: RootState) => state.workout.tags;
