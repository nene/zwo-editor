import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { RootState } from './store';
import { rehydrateLengths } from './rehydrate';
import { Instruction } from '../types/Instruction';
import { clearWorkout } from './workout';

const initialState: Instruction[] = [];

const slice = createSlice({
  name: 'instructions',
  initialState,
  reducers: {
    setInstructions: (state, action: PayloadAction<Instruction[]>) => action.payload,
    addInstruction: (state, action: PayloadAction<Instruction>) => [...state, action.payload],
  },
  extraReducers: {
    [REHYDRATE]: (state, action: PayloadAction<{instructions?: Instruction[]}>) => {
      return rehydrateLengths(action.payload?.instructions);
    },
    [clearWorkout.type]: () => [],
  },
});

export const reducer = slice.reducer;
export const { setInstructions, addInstruction } = slice.actions;

export const selectInstructions = (state: RootState) => state.instructions;
