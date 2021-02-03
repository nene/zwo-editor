import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { RootState } from './store';
import { convertLengths } from './rehydrate';
import { Instruction } from '../types/Instruction';

const initialState: Instruction[] = [];

const slice = createSlice({
  name: 'instructions',
  initialState,
  reducers: {
    setInstructions: (state, action: PayloadAction<Instruction[]>) => action.payload,
  },
  extraReducers: {
    [REHYDRATE]: (state, action: PayloadAction<{instructions: Instruction[]}>) => {
      if (!(action.payload?.instructions instanceof Array)) {
        return state;
      }
      return action.payload.instructions.map(convertLengths) as Instruction[];
    },
  },
});

export const reducer = slice.reducer;
export const { setInstructions } = slice.actions;

export const selectInstructions = (state: RootState) => state.instructions;
