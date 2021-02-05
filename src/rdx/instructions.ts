import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { rehydrateAction, rehydrateLengths } from './rehydrate';
import { Instruction } from '../types/Instruction';
import { clearWorkout, loadWorkout } from './workout';

const initialState: Instruction[] = [];

const slice = createSlice({
  name: 'instructions',
  initialState,
  reducers: {
    setInstructions: (state, action: PayloadAction<Instruction[]>) => action.payload,
    addInstruction: (state, action: PayloadAction<Instruction>) => [...state, action.payload],
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrateAction, (state, action) => {
        return rehydrateLengths(action.payload?.instructions);
      })
      .addCase(clearWorkout, () => [])
      .addCase(loadWorkout, (state, {payload}) => payload.instructions)
  },
});

export const reducer = slice.reducer;
export const { setInstructions, addInstruction } = slice.actions;

export const selectInstructions = (state: RootState) => state.instructions;
