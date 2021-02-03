import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { RootState } from './store';
import { convertLengths } from '../storage/storage';
import { Instruction } from '../types/Instruction';

type InstructionsState = Instruction[];

const initialState: InstructionsState = [];

const instructionsSlice = createSlice({
  name: 'instructions',
  initialState,
  reducers: {
    setInstructions: (state, action: PayloadAction<Instruction[]>) => action.payload,
  },
  extraReducers: {
    [REHYDRATE]: (state, action: PayloadAction<{instructions: InstructionsState}>) => {
      if (!(action.payload?.instructions instanceof Array)) {
        return state;
      }
      return action.payload.instructions.map(convertLengths) as Instruction[];
    },
  },
});

export const reducer = instructionsSlice.reducer;
export const { setInstructions } = instructionsSlice.actions;

export const selectInstructions = (state: RootState) => state.instructions;
