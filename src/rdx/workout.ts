import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface WorkoutState {
  name: string;
  author: string;
  description: string;
}

const initialState: WorkoutState = {
  name: "",
  author: "",
  description: "",
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setName: (state, action) => ({ ...state, name: action.payload }),
    setAuthor: (state, action) => ({ ...state, author: action.payload }),
    setDescription: (state, action) => ({ ...state, description: action.payload }),
  },
});

export const reducer = workoutSlice.reducer;
export const { setName, setAuthor, setDescription } = workoutSlice.actions;

export const nameSelector = (state: RootState) => state.workout.name;
export const authorSelector = (state: RootState) => state.workout.author;
export const descriptionSelector = (state: RootState) => state.workout.description;
