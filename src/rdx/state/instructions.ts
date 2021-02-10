import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Instruction } from "../../types/Instruction";
import { clearWorkout, loadWorkout } from "./workout";
import { replaceById } from "../../utils/array";

const initialState: Instruction[] = [];

const slice = createSlice({
  name: "instructions",
  initialState,
  reducers: {
    setInstructions: (state, action: PayloadAction<Instruction[]>) =>
      action.payload,
    addInstruction: (state, action: PayloadAction<Instruction>) => [
      ...state,
      action.payload,
    ],
    updateInstruction: (
      instructions,
      { payload }: PayloadAction<Instruction>
    ) => replaceById(payload, instructions),
    removeInstruction: (instructions, { payload: id }: PayloadAction<string>) =>
      instructions.filter((item) => item.id !== id),
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearWorkout, () => [])
      .addCase(loadWorkout, (state, { payload }) => payload.instructions);
  },
});

export const reducer = slice.reducer;
export const {
  setInstructions,
  addInstruction,
  updateInstruction,
  removeInstruction,
} = slice.actions;

export const selectInstructions = (state: RootState) => state.instructions;
